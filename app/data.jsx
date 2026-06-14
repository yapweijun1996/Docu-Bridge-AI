/* DocuBridge AI — data core: document-type schemas, evidence layouts, and the
   business-validation rules. Extraction is provided by real LLM providers only
   (see providers.jsx); there is no mock OCR engine or seed sample data.
   Pure logic, exported to window.DocCore. No React here. */
(function () {
  // ---------- small helpers ----------
  const uid = (p) => p + '_' + Math.random().toString(36).slice(2, 9);
  const now = () => Date.now();
  const money = (n) => (n == null || isNaN(n) ? '—' :
    Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
  const num = (v) => { const n = parseFloat(String(v).replace(/[^0-9.\-]/g, '')); return isNaN(n) ? 0 : n; };
  const hasNum = (v) => { const s = String(v == null ? '' : v).replace(/[^0-9.\-]/g, ''); return s.length > 0 && !isNaN(parseFloat(s)); };
  const confLevel = (s) => (s >= 0.9 ? 'high' : s >= 0.7 ? 'medium' : 'low');
  const avg = (arr) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0);
  const ago = (ts) => {
    const s = Math.floor((now() - ts) / 1000);
    if (s < 60) return 'just now';
    if (s < 3600) return Math.floor(s / 60) + ' min ago';
    if (s < 86400) return Math.floor(s / 3600) + ' h ago';
    return Math.floor(s / 86400) + ' d ago';
  };

  // ---------- document type registry ----------
  const TYPES = {
    purchase_order: { key: 'purchase_order', label: 'Purchase Order', prefix: 'PO', tax: 'GST 9%', hasPrices: true },
    invoice: { key: 'invoice', label: 'Invoice', prefix: 'INV', tax: 'Tax 9%', hasPrices: true },
    delivery_order: { key: 'delivery_order', label: 'Delivery Order', prefix: 'DO', tax: null, hasPrices: false },
    claim_form: { key: 'claim_form', label: 'Claim Form', prefix: 'CLM', tax: 'GST 9%', hasPrices: true },
    generic: { key: 'generic', label: 'Generic Document', prefix: 'DOC', tax: null, hasPrices: false },
  };
  const typeFromLabel = (lab) => Object.values(TYPES).find((t) => t.label === lab) || TYPES.generic;

  // ---------- evidence layouts (boxes are % of the paper) ----------
  // Each field: {key,label,group,page,box:{x,y,w,h}}. The facsimile prints the value
  // at the same coordinates, so the evidence highlight always wraps it exactly.
  const LAYOUTS = {
    purchase_order: {
      letterhead: { title: 'PURCHASE ORDER' },
      pages: [
        { no: 1, label: 'Header & parties', lines: false, totals: false },
        { no: 2, label: 'Line items & totals', lines: true, totals: true },
      ],
      fields: [
        { key: 'document_title', label: 'Subject', group: 'header', page: 1, box: { x: 6, y: 8, w: 50, h: 5 } },
        { key: 'document_no', label: 'PO No.', group: 'header', page: 1, box: { x: 58, y: 16, w: 35, h: 5 } },
        { key: 'transaction_date', label: 'Date', group: 'header', page: 1, box: { x: 58, y: 23, w: 35, h: 5 } },
        { key: 'credit_term', label: 'Credit Term', group: 'header', page: 1, box: { x: 58, y: 30, w: 35, h: 5 } },
        { key: 'bill_to', label: 'Bill To', group: 'parties', page: 1, box: { x: 6, y: 42, w: 42, h: 12 }, multiline: true },
        { key: 'ship_to', label: 'Ship To', group: 'parties', page: 1, box: { x: 52, y: 42, w: 42, h: 12 }, multiline: true },
        { key: 'line_items', label: 'Line items', group: 'table', page: 2, box: { x: 6, y: 12, w: 88, h: 42 }, table: true },
        { key: 'delivery_address', label: 'Delivery Address', group: 'meta', page: 2, box: { x: 6, y: 56, w: 50, h: 7 }, multiline: true },
        { key: 'subtotal', label: 'Subtotal', group: 'totals', page: 2, box: { x: 60, y: 60, w: 33, h: 5 } },
        { key: 'gst', label: 'GST', group: 'totals', page: 2, box: { x: 60, y: 67, w: 33, h: 5 } },
        { key: 'grand_total', label: 'Grand Total', group: 'totals', page: 2, box: { x: 60, y: 74, w: 33, h: 6 } },
        { key: 'terms_and_conditions', label: 'Terms & Conditions', group: 'footer', page: 2, box: { x: 6, y: 83, w: 88, h: 11 }, multiline: true },
      ],
    },
    invoice: {
      letterhead: { title: 'TAX INVOICE' },
      pages: [{ no: 1, label: 'Invoice', lines: true, totals: true }],
      fields: [
        { key: 'document_title', label: 'Subject', group: 'header', page: 1, box: { x: 6, y: 8, w: 50, h: 5 } },
        { key: 'document_no', label: 'Invoice No.', group: 'header', page: 1, box: { x: 58, y: 15, w: 35, h: 5 } },
        { key: 'transaction_date', label: 'Invoice Date', group: 'header', page: 1, box: { x: 58, y: 21, w: 35, h: 5 } },
        { key: 'payment_terms', label: 'Payment Terms', group: 'header', page: 1, box: { x: 58, y: 27, w: 35, h: 5 } },
        { key: 'supplier', label: 'Supplier', group: 'parties', page: 1, box: { x: 6, y: 34, w: 42, h: 11 }, multiline: true },
        { key: 'customer', label: 'Bill To', group: 'parties', page: 1, box: { x: 52, y: 34, w: 42, h: 11 }, multiline: true },
        { key: 'line_items', label: 'Line items', group: 'table', page: 1, box: { x: 6, y: 49, w: 88, h: 28 }, table: true },
        { key: 'subtotal', label: 'Subtotal', group: 'totals', page: 1, box: { x: 60, y: 80, w: 33, h: 4.5 } },
        { key: 'gst', label: 'Tax', group: 'totals', page: 1, box: { x: 60, y: 85, w: 33, h: 4.5 } },
        { key: 'grand_total', label: 'Grand Total', group: 'totals', page: 1, box: { x: 60, y: 90, w: 33, h: 5.5 } },
      ],
    },
    delivery_order: {
      letterhead: { title: 'DELIVERY ORDER' },
      pages: [{ no: 1, label: 'Delivery', lines: true, totals: false }],
      fields: [
        { key: 'document_title', label: 'Subject', group: 'header', page: 1, box: { x: 6, y: 8, w: 50, h: 5 } },
        { key: 'document_no', label: 'DO No.', group: 'header', page: 1, box: { x: 58, y: 15, w: 35, h: 5 } },
        { key: 'transaction_date', label: 'Date', group: 'header', page: 1, box: { x: 58, y: 21, w: 35, h: 5 } },
        { key: 'customer', label: 'Customer', group: 'parties', page: 1, box: { x: 6, y: 32, w: 42, h: 11 }, multiline: true },
        { key: 'ship_to', label: 'Deliver To', group: 'parties', page: 1, box: { x: 52, y: 32, w: 42, h: 11 }, multiline: true },
        { key: 'line_items', label: 'Line items', group: 'table', page: 1, box: { x: 6, y: 47, w: 88, h: 36 }, table: true },
      ],
    },
    generic: {
      letterhead: { title: 'DOCUMENT' },
      pages: [{ no: 1, label: 'Document', lines: false, totals: false }],
      fields: [
        { key: 'document_title', label: 'Subject', group: 'header', page: 1, box: { x: 6, y: 8, w: 50, h: 5 } },
        { key: 'document_no', label: 'Reference No.', group: 'header', page: 1, box: { x: 58, y: 15, w: 35, h: 5 } },
        { key: 'transaction_date', label: 'Date', group: 'header', page: 1, box: { x: 58, y: 21, w: 35, h: 5 } },
        { key: 'bill_to', label: 'From', group: 'parties', page: 1, box: { x: 6, y: 32, w: 42, h: 11 }, multiline: true },
        { key: 'ship_to', label: 'To', group: 'parties', page: 1, box: { x: 52, y: 32, w: 42, h: 11 }, multiline: true },
      ],
    },
    claim_form: {
      letterhead: { title: 'CLAIM FORM' },
      pages: [{ no: 1, label: 'Claim', lines: true, totals: true }],
      fields: [
        { key: 'document_title', label: 'Subject', group: 'header', page: 1, box: { x: 6, y: 8, w: 50, h: 5 } },
        { key: 'document_no', label: 'Claim No.', group: 'header', page: 1, box: { x: 58, y: 15, w: 35, h: 5 } },
        { key: 'transaction_date', label: 'Date', group: 'header', page: 1, box: { x: 58, y: 21, w: 35, h: 5 } },
        { key: 'credit_term', label: 'Reference No.', group: 'header', page: 1, box: { x: 58, y: 27, w: 35, h: 5 } },
        { key: 'bill_to', label: 'Claimant', group: 'parties', page: 1, box: { x: 6, y: 34, w: 42, h: 11 }, multiline: true },
        { key: 'ship_to', label: 'Claim To', group: 'parties', page: 1, box: { x: 52, y: 34, w: 42, h: 11 }, multiline: true },
        { key: 'line_items', label: 'Claim items', group: 'table', page: 1, box: { x: 6, y: 49, w: 88, h: 28 }, table: true },
        { key: 'subtotal', label: 'Subtotal', group: 'totals', page: 1, box: { x: 60, y: 80, w: 33, h: 4.5 } },
        { key: 'gst', label: 'GST', group: 'totals', page: 1, box: { x: 60, y: 85, w: 33, h: 4.5 } },
        { key: 'grand_total', label: 'Total Claim', group: 'totals', page: 1, box: { x: 60, y: 90, w: 33, h: 5.5 } },
      ],
    },
  };

  // ---------- validation engine ----------
  function validate(doc) {
    const f = fieldMap(doc);
    const issues = [];
    const add = (sev, title, rule, detail, field) => issues.push({ id: uid('v'), sev, title, rule, detail, field });

    const docNo = (f.document_no || '').trim();
    if (!docNo) add('error', 'Document number is missing', 'document_no must not be empty',
      'Every document needs an identifier before it can be approved.', 'document_no');

    const date = (f.transaction_date || '').trim();
    if (!date) add('error', 'Transaction date is missing', 'transaction_date is required',
      'Add the document date from the original.', 'transaction_date');
    else if (!/\d{4}-\d{2}-\d{2}|\d{1,2}\s\w{3}\s\d{4}/.test(date))
      add('warning', 'Date format looks unusual', 'transaction_date should be a valid date',
        '“' + date + '” may not parse cleanly downstream.', 'transaction_date');

    if (!doc.line_items || doc.line_items.length === 0)
      add('error', 'No line items found', 'at least one line item is required',
        'Extraction returned an empty table.', 'line_items');

    // per-row math (priced docs only)
    if (TYPES[doc.document_type].hasPrices) {
      (doc.line_items || []).forEach((li, i) => {
        if (!hasNum(li.quantity))
          add('warning', 'Quantity is not numeric', `row ${i + 1} quantity must be numeric`,
            `Row ${i + 1}: "${li.quantity}" is not a valid number.`, 'line_items');
        if (!hasNum(li.unit_price))
          add('warning', 'Unit price is not numeric', `row ${i + 1} unit_price must be numeric`,
            `Row ${i + 1}: "${li.unit_price}" is not a valid number.`, 'line_items');
        if (!hasNum(li.total_price))
          add('warning', 'Total price is not numeric', `row ${i + 1} total_price must be numeric`,
            `Row ${i + 1}: "${li.total_price}" is not a valid number.`, 'line_items');
        const calc = +(num(li.quantity) * num(li.unit_price)).toFixed(2);
        if (hasNum(li.quantity) && hasNum(li.unit_price) && hasNum(li.total_price) && Math.abs(calc - num(li.total_price)) > 0.01)
          add('warning', 'Line total does not match', 'quantity × unit_price = total_price',
            `Row ${i + 1}: ${num(li.quantity)} × ${money(li.unit_price)} = ${money(calc)}, not ${money(li.total_price)}.`, 'line_items');
      });

      const t = doc.totals || {};
      if (!hasNum(f.subtotal))
        add('error', 'Subtotal is not numeric', 'subtotal must be numeric', 'Enter a valid number for subtotal.', 'subtotal');
      if (!hasNum(f.gst))
        add('error', 'GST is not numeric', 'gst must be numeric', 'Enter a valid number for GST.', 'gst');
      if (!hasNum(f.grand_total))
        add('error', 'Grand total is not numeric', 'grand_total must be numeric', 'Enter a valid number for grand total.', 'grand_total');
      else if (hasNum(f.subtotal) && hasNum(f.gst)) {
        const expected = +(num(t.subtotal) + num(t.gst)).toFixed(2);
        if (Math.abs(expected - num(t.grand)) > 0.01)
          add('error', 'Totals do not balance', 'subtotal + gst = grand_total',
            `${money(t.subtotal)} + ${money(t.gst)} = ${money(expected)}, not ${money(t.grand)}.`, 'grand_total');
      }
    }
    return issues;
  }

  function fieldMap(doc) {
    const m = {};
    (doc.fields || []).forEach((f) => { m[f.key] = f.value; });
    return m;
  }

  // Re-derive status from validation (never downgrade approved/submitted/rejected/failed).
  function deriveStatus(doc) {
    if (['approved', 'submitted', 'rejected', 'failed', 'processing', 'uploaded'].includes(doc.status)) return doc.status;
    const errs = (doc.validation_issues || []).filter((v) => v.sev === 'error').length;
    return errs > 0 ? 'need_review' : 'ready';
  }

  function docConfidence(doc) {
    // Average only real (non-null) confidences. Returns null when none exist
    // (LLM extraction supplies no confidence), so the UI shows no fake number.
    const cs = (doc.fields || []).filter((f) => !f.table && f.confidence != null).map((f) => f.confidence);
    (doc.line_items || []).forEach((li) => { if (li.confidence != null) cs.push(num(li.confidence)); });
    return cs.length ? +avg(cs).toFixed(2) : null;
  }

  // Build the reviewed_json payload from the working doc state.
  function toJSON(doc, kind) {
    const f = fieldMap(doc);
    const base = { document_type: doc.document_type, document_title: f.document_title || '', document_no: f.document_no || '', transaction_date: f.transaction_date || '' };
    if (doc.document_type === 'purchase_order') {
      Object.assign(base, {
        credit_term: f.credit_term || '',
        bill_to: splitParty(f.bill_to), ship_to: splitParty(f.ship_to),
        delivery_address: f.delivery_address || '',
        line_items: doc.line_items, totals: roundTotals(doc.totals),
        terms_and_conditions: f.terms_and_conditions || '',
      });
    } else if (doc.document_type === 'invoice') {
      Object.assign(base, {
        payment_terms: f.payment_terms || '',
        supplier: splitParty(f.supplier), customer: splitParty(f.customer),
        line_items: doc.line_items, totals: roundTotals(doc.totals),
      });
    } else if (doc.document_type === 'delivery_order') {
      Object.assign(base, {
        customer: splitParty(f.customer), deliver_to: splitParty(f.ship_to),
        line_items: (doc.line_items || []).map(({ unit_price, total_price, ...r }) => r),
      });
    } else if (doc.document_type === 'claim_form') {
      Object.assign(base, {
        credit_term: f.credit_term || '',
        claimant: splitParty(f.bill_to), claim_to: splitParty(f.ship_to),
        line_items: doc.line_items, totals: roundTotals(doc.totals),
      });
    } else {
      Object.assign(base, { from: splitParty(f.bill_to), to: splitParty(f.ship_to) });
    }
    if (kind === 'reviewed') base._review = { status: doc.status, approved_by: doc.approved_by || null, approved_at: doc.approved_at || null };
    return base;
  }
  const splitParty = (v) => { const [name, ...rest] = String(v || '').split('\n'); return { name: name || '', address: rest.join(', ') }; };
  const roundTotals = (t) => t ? { subtotal: num(t.subtotal), gst: num(t.gst), grand_total: num(t.grand) } : {};

  // ---------- sample document factory ----------
  function makeDoc(opts) {
    const t = TYPES[opts.type];
    const layout = LAYOUTS[opts.type];
    const fields = layout.fields.map((lf) => ({
      ...lf, value: opts.values[lf.key] != null ? opts.values[lf.key] : '',
      // AI-grounded box (from LLM) overrides the default layout box when present
      box: (opts.boxes && opts.boxes[lf.key]) ? opts.boxes[lf.key] : lf.box,
      grounded: !!(opts.boxes && opts.boxes[lf.key]),
      // confidence is null unless a real value is supplied — we don't fabricate one.
      confidence: opts.conf && opts.conf[lf.key] != null ? opts.conf[lf.key] : null,
      editable: lf.key !== 'line_items', edited: false,
    }));
    const doc = {
      document_id: opts.id || uid('doc'),
      batch_id: opts.batch_id,
      file_name: opts.file,
      file_type: opts.file.split('.').pop().toLowerCase(),
      document_type: opts.type,
      document_no: opts.values.document_no || '—',
      page_count: layout.pages.length,
      is_sample: false,
      file_blob: null,
      letterhead: { ...layout.letterhead, company: opts.company, address: opts.address, subtitle: t.label },
      pages: layout.pages.map((p) => ({ ...p, conf: null })),
      fields,
      line_items: t.hasPrices ? opts.lineItems : (opts.lineItems || []).map(({ unit_price, total_price, ...r }) => r),
      totals: t.hasPrices ? opts.totals : null,
      created_at: opts.created_at || now(),
      updated_at: opts.created_at || now(),
      approved_by: opts.approved_by || null,
      approved_at: opts.approved_at || null,
      status: opts.status || 'need_review',
      fail_reason: opts.fail_reason || null,
    };
    doc.extracted_json = toJSON(doc, 'extracted');
    doc.validation_issues = validate(doc);
    doc.confidence = opts.confidence != null ? opts.confidence : docConfidence(doc);
    if (doc.status === 'need_review' || doc.status === 'ready') doc.status = deriveStatus(doc);
    // pages confidence from fields — only real (non-null) field confidences count
    doc.pages.forEach((p) => {
      const fc = doc.fields.filter((f) => f.page === p.no && !f.table && f.confidence != null).map((f) => f.confidence);
      p.conf = fc.length ? +avg(fc).toFixed(2) : null;
    });
    return doc;
  }

  window.DocCore = {
    TYPES, LAYOUTS, typeFromLabel, uid, now, money, num, hasNum, confLevel, ago, avg,
    validate, deriveStatus, docConfidence, fieldMap, toJSON, makeDoc,
  };
})();
