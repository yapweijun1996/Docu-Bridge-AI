/* DocuBridge AI — LLM provider adapters (OpenAI + Gemini + Mock fallback).
   BYOK: user supplies their own API key in Settings. Key never leaves the browser.
   Exposes window.LLMProviders = { ocrExtractWithFallback, testConnection } */
(function () {
  const C = window.DocCore;

  // ---------- helpers ----------
  async function blobToBase64(blob) {
    return new Promise((res, rej) => {
      const rd = new FileReader();
      rd.onload = () => res(rd.result.split(',')[1]);
      rd.onerror = () => rej(new Error('FileReader error'));
      rd.readAsDataURL(blob);
    });
  }

  // fetch with an abort timeout — thinking models can stall, this turns infinite "pending" into a clear error
  const LLM_TIMEOUT_MS = 90000;
  async function fetchWithTimeout(url, opts, ms) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), ms || LLM_TIMEOUT_MS);
    try {
      return await fetch(url, { ...opts, signal: ctrl.signal });
    } catch (e) {
      if (e.name === 'AbortError') throw new Error('Timed out after ' + Math.round((ms || LLM_TIMEOUT_MS) / 1000) + 's — try a faster model or disable thinking');
      throw e;
    } finally {
      clearTimeout(timer);
    }
  }

  // read an SSE stream, accumulate text via a per-chunk extractor (handles OpenAI + Gemini stream formats)
  async function readSSEText(resp, extract) {
    const handleLine = (line, push) => {
      const s = line.trim();
      if (!s.startsWith('data:')) return;
      const p = s.slice(5).trim();
      if (!p || p === '[DONE]') return;
      try { push(extract(JSON.parse(p)) || ''); } catch (e) { /* ignore partial/non-JSON keepalive lines */ }
    };
    if (!resp.body || !resp.body.getReader) {
      let out = '';
      (await resp.text()).split('\n').forEach((l) => handleLine(l, (s) => { out += s; }));
      return out;
    }
    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let buf = '', out = '';
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });
      let idx;
      while ((idx = buf.indexOf('\n')) >= 0) {
        handleLine(buf.slice(0, idx), (s) => { out += s; });
        buf = buf.slice(idx + 1);
      }
    }
    handleLine(buf, (s) => { out += s; });
    return out;
  }

  const SYSTEM_PROMPT =
    'You are a document OCR and data extraction engine. Extract all visible text and structured data from the document. ' +
    'Return ONLY valid JSON matching the schema. For missing or unclear fields return empty string "" or 0. ' +
    'Do not invent data not present in the document. For transaction_date use YYYY-MM-DD format when possible.';

  // Line item sub-properties (shared across schemas)
  const LI_PROPS = {
    serial_no: { type: 'string' },
    stock_code: { type: 'string' },
    description: { type: 'string' },
    remark: { type: 'string' },
    quantity: { type: 'number' },
    uom: { type: 'string' },
    unit_price: { type: 'number' },
    total_price: { type: 'number' },
  };
  const LI_REQUIRED = Object.keys(LI_PROPS);

  // OpenAI strict schema — requires additionalProperties:false + all keys in required at every level
  const OPENAI_SCHEMA = {
    type: 'object',
    properties: {
      company: { type: 'string' },
      address: { type: 'string' },
      document_title: { type: 'string' },
      document_no: { type: 'string' },
      transaction_date: { type: 'string' },
      credit_term: { type: 'string' },
      payment_terms: { type: 'string' },
      bill_to: { type: 'string' },
      ship_to: { type: 'string' },
      supplier: { type: 'string' },
      customer: { type: 'string' },
      delivery_address: { type: 'string' },
      terms_and_conditions: { type: 'string' },
      line_items: {
        type: 'array',
        items: { type: 'object', properties: LI_PROPS, required: LI_REQUIRED, additionalProperties: false },
      },
      subtotal: { type: 'number' },
      gst: { type: 'number' },
      grand_total: { type: 'number' },
    },
    required: [
      'company', 'address', 'document_title', 'document_no', 'transaction_date',
      'credit_term', 'payment_terms', 'bill_to', 'ship_to', 'supplier', 'customer',
      'delivery_address', 'terms_and_conditions', 'line_items', 'subtotal', 'gst', 'grand_total',
    ],
    additionalProperties: false,
  };

  // Gemini responseSchema — same structure but no additionalProperties.
  // `boxes` carries per-field grounding: [ymin, xmin, ymax, xmax] normalized 0–1000 (y-axis first).
  const GEMINI_SCHEMA = {
    type: 'object',
    properties: {
      company: { type: 'string' },
      address: { type: 'string' },
      document_title: { type: 'string' },
      document_no: { type: 'string' },
      transaction_date: { type: 'string' },
      credit_term: { type: 'string' },
      payment_terms: { type: 'string' },
      bill_to: { type: 'string' },
      ship_to: { type: 'string' },
      supplier: { type: 'string' },
      customer: { type: 'string' },
      delivery_address: { type: 'string' },
      terms_and_conditions: { type: 'string' },
      line_items: {
        type: 'array',
        items: {
          type: 'object',
          properties: LI_PROPS,
        },
      },
      subtotal: { type: 'number' },
      gst: { type: 'number' },
      grand_total: { type: 'number' },
      boxes: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            key: { type: 'string' },
            ymin: { type: 'number' },
            xmin: { type: 'number' },
            ymax: { type: 'number' },
            xmax: { type: 'number' },
          },
        },
      },
    },
  };

  // Gemini bbox → workbench %-box. Gemini format is [ymin, xmin, ymax, xmax] normalized 0–1000,
  // y-axis FIRST, top-left origin. /1000*100 == /10. Clamp to keep overlays on-page.
  function boxesToMap(boxes) {
    const clamp = (n) => Math.max(0, Math.min(100, n));
    const map = {};
    (boxes || []).forEach((b) => {
      if (!b || b.key == null) return;
      const ymin = +b.ymin, xmin = +b.xmin, ymax = +b.ymax, xmax = +b.xmax;
      if ([ymin, xmin, ymax, xmax].some((n) => isNaN(n))) return;
      map[b.key] = {
        x: clamp(xmin / 10),
        y: clamp(ymin / 10),
        w: clamp(Math.abs(xmax - xmin) / 10),
        h: clamp(Math.abs(ymax - ymin) / 10),
      };
    });
    return map;
  }

  // Map LLM extraction result → makeDoc() opts
  function llmToMakeDocOpts(result, type, batchId, fileName) {
    const conf = {};
    (C.LAYOUTS[type] ? C.LAYOUTS[type].fields : []).forEach((f) => { conf[f.key] = 0.88; });
    const values = {};
    ['document_title', 'document_no', 'transaction_date', 'credit_term', 'payment_terms',
     'bill_to', 'ship_to', 'supplier', 'customer', 'delivery_address', 'terms_and_conditions'].forEach((k) => {
      values[k] = result[k] || '';
    });
    values.subtotal = result.subtotal != null ? C.money(result.subtotal) : '';
    values.gst = result.gst != null ? C.money(result.gst) : '';
    values.grand_total = result.grand_total != null ? C.money(result.grand_total) : '';
    const lineItems = (result.line_items || []).map((li, i) => ({
      serial_no: li.serial_no || String(i + 1),
      stock_code: li.stock_code || '',
      description: li.description || '',
      remark: li.remark || '',
      quantity: typeof li.quantity === 'number' ? li.quantity : C.num(li.quantity),
      uom: li.uom || 'pcs',
      unit_price: typeof li.unit_price === 'number' ? li.unit_price : C.num(li.unit_price),
      total_price: typeof li.total_price === 'number' ? li.total_price : C.num(li.total_price),
      confidence: 0.88,
    }));
    return {
      type, batch_id: batchId, file: fileName,
      company: result.company || '', address: result.address || '',
      values, conf, lineItems,
      boxes: boxesToMap(result.boxes),
      totals: { subtotal: result.subtotal || 0, gst: result.gst || 0, grand: result.grand_total || 0 },
      status: 'need_review',
    };
  }

  // ---------- OpenAI adapter (model-agnostic) ----------
  async function openaiAdapter(f, type, batchId, seq, apiKey, model) {
    if (!apiKey) throw new Error('OpenAI API key not set — enter it in Settings');
    const ext = (f.name.split('.').pop() || '').toLowerCase();
    if (ext === 'pdf') throw new Error('OpenAI Vision does not accept PDF — upload PNG/JPG or switch to Gemini');
    const base64 = await blobToBase64(f.blob);
    const mime = ext === 'png' ? 'image/png' : 'image/jpeg';
    const om = model || 'gpt-5.4-mini';
    const body = {
      model: om,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: [
          { type: 'text', text: 'Extract all fields from this ' + (C.TYPES[type] ? C.TYPES[type].label : type) + ' document.' },
          { type: 'image_url', image_url: { url: 'data:' + mime + ';base64,' + base64, detail: 'high' } },
        ]},
      ],
      response_format: { type: 'json_schema', json_schema: { name: 'document_extraction', strict: true, schema: OPENAI_SCHEMA } },
      stream: true,
    };
    // gpt-5 family are reasoning models — effort low by default (let it finish; no token cap)
    if (/^gpt-5/.test(om)) body.reasoning_effort = 'low';
    const resp = await fetchWithTimeout('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + apiKey },
      body: JSON.stringify(body),
    }, LLM_TIMEOUT_MS);
    if (!resp.ok) {
      const txt = await resp.text();
      throw new Error('OpenAI ' + resp.status + ': ' + txt.slice(0, 300));
    }
    const content = await readSSEText(resp, (c) => (c.choices && c.choices[0] && c.choices[0].delta && c.choices[0].delta.content) || '');
    if (!content.trim()) throw new Error('OpenAI: empty stream — possible refusal or model error');
    return C.makeDoc(llmToMakeDocOpts(JSON.parse(content), type, batchId, f.name));
  }

  // ---------- Gemini adapter (model-agnostic) ----------
  async function geminiAdapter(f, type, batchId, seq, apiKey, model) {
    if (!apiKey) throw new Error('Gemini API key not set — enter it in Settings');
    const ext = (f.name.split('.').pop() || '').toLowerCase();
    const isPdf = ext === 'pdf';
    const mime = isPdf ? 'application/pdf' : (ext === 'png' ? 'image/png' : 'image/jpeg');
    const base64 = await blobToBase64(f.blob);
    const m = model || 'gemini-3.5-flash';
    const gc = { responseMimeType: 'application/json', responseSchema: GEMINI_SCHEMA, temperature: 0 };
    // 3.x are thinking models — thinking ON at low by default (let it finish; no token cap)
    if (/gemini-3/.test(m)) gc.thinkingConfig = { thinkingLevel: 'low' };
    const resp = await fetchWithTimeout(
      'https://generativelanguage.googleapis.com/v1beta/models/' + m + ':streamGenerateContent?alt=sse&key=' + apiKey,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [
            { inline_data: { mime_type: mime, data: base64 } },
            { text: 'Extract all fields from this ' + (C.TYPES[type] ? C.TYPES[type].label : type) + ' document. ' +
              'Additionally, for EVERY field you extract, return its bounding box on the page in the `boxes` array. ' +
              'Each entry is { key, ymin, xmin, ymax, xmax } where key is the field name (e.g. document_no, transaction_date, grand_total, bill_to) ' +
              'and the four numbers are the bounding box as [ymin, xmin, ymax, xmax] — the VERTICAL (y) axis comes FIRST — ' +
              'each an integer normalized to 0-1000 with the origin at the top-left corner of the page.' },
          ]}],
          generationConfig: gc,
        }),
      }
    );
    if (!resp.ok) {
      const txt = await resp.text();
      throw new Error('Gemini ' + resp.status + ': ' + txt.slice(0, 300));
    }
    const text = await readSSEText(resp, (c) => {
      const parts = c && c.candidates && c.candidates[0] && c.candidates[0].content && c.candidates[0].content.parts;
      return parts ? parts.map((p) => p.text || '').join('') : '';
    });
    if (!text.trim()) throw new Error('Gemini: empty stream — check API key, quota, or model name');
    let result;
    try { result = JSON.parse(text); } catch (e) { throw new Error('Gemini: invalid JSON from stream'); }
    return C.makeDoc(llmToMakeDocOpts(result, type, batchId, f.name));
  }

  // ---------- mock adapter — wraps existing C.mockOCR ----------
  function mockAdapter(f, type, batchId, seq) {
    return C.mockOCR(f.name, type, batchId, seq);
  }

  // ---------- main entry point with fallback chain ----------
  async function ocrExtractWithFallback(f, type, batchId, seq, settings) {
    const { provider = 'mock', openaiKey = '', geminiKey = '', openaiModel, geminiModel } = settings || {};
    if (provider === 'mock') { const d = mockAdapter(f, type, batchId, seq); d.ocr_provider = 'mock'; return d; }
    try {
      let d;
      if (provider === 'openai') d = await openaiAdapter(f, type, batchId, seq, openaiKey, openaiModel);
      else if (provider === 'gemini') d = await geminiAdapter(f, type, batchId, seq, geminiKey, geminiModel);
      else d = mockAdapter(f, type, batchId, seq);
      d.ocr_provider = provider === 'openai' ? 'openai (' + (openaiModel || 'gpt-5.4-mini') + ')'
        : provider === 'gemini' ? 'gemini (' + (geminiModel || 'gemini-3.5-flash') + ')' : 'mock';
      return d;
    } catch (err) {
      console.warn('[LLMProviders]', provider, 'failed — falling back to mock:', err.message);
      const doc = mockAdapter(f, type, batchId, seq);
      doc.ocr_provider = 'mock (fallback)';
      doc._llm_error = err.message;
      return doc;
    }
  }

  // ---------- Test connection — send a minimal prompt, return { ok, message } ----------
  async function testConnection(provider, apiKey, model) {
    if (provider === 'mock') return { ok: true, message: 'Mock OCR — no API needed' };
    try {
      if (provider === 'openai') {
        if (!apiKey) return { ok: false, message: 'API key is empty' };
        const tm = model || 'gpt-5.4-mini';
        const tbody = { model: tm, messages: [{ role: 'user', content: 'Reply with the single word: ok' }] };
        if (/^gpt-5/.test(tm)) tbody.reasoning_effort = 'low';
        const resp = await fetchWithTimeout('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + apiKey },
          body: JSON.stringify(tbody),
        }, 30000);
        if (!resp.ok) {
          const txt = await resp.text();
          return { ok: false, message: 'OpenAI ' + resp.status + ': ' + txt.slice(0, 200) };
        }
        const data = await resp.json();
        const reply = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
        return { ok: true, message: 'Connected — model: ' + tm + ' · reply: ' + (reply || '').trim() };
      }
      if (provider === 'gemini') {
        if (!apiKey) return { ok: false, message: 'API key is empty' };
        const m = model || 'gemini-3.5-flash';
        const gbody = { contents: [{ parts: [{ text: 'Reply with the single word: ok' }] }] };
        if (/gemini-3/.test(m)) gbody.generationConfig = { thinkingConfig: { thinkingLevel: 'low' } };
        const resp = await fetchWithTimeout(
          'https://generativelanguage.googleapis.com/v1beta/models/' + m + ':generateContent?key=' + apiKey,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(gbody),
          },
          30000
        );
        if (!resp.ok) {
          const txt = await resp.text();
          return { ok: false, message: 'Gemini ' + resp.status + ': ' + txt.slice(0, 200) };
        }
        const data = await resp.json();
        if (data.error) return { ok: false, message: 'Gemini error: ' + data.error.message };
        const part = data.candidates && data.candidates[0] && data.candidates[0].content &&
                     data.candidates[0].content.parts && data.candidates[0].content.parts[0];
        const reply = part ? part.text : '';
        return { ok: true, message: 'Connected — model: ' + m + ' · reply: ' + reply.trim() };
      }
      return { ok: false, message: 'Unknown provider: ' + provider };
    } catch (err) {
      return { ok: false, message: err.message };
    }
  }

  window.LLMProviders = { ocrExtractWithFallback, testConnection };
})();
