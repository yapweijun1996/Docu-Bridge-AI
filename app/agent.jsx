/* DocuBridge AI — agent layer (agrun.js integration scaffolding).
   T006 + T007: wraps extraction as an agrun customAction and drives it through
   runtime.run() for real providers.

   ⚠️ STATUS — UNVERIFIED LIVE PATH:
   The mock-bypass path is verified (no key needed). The agrun runtime.run()
   planner path is NOT verified — it needs a real provider key + the user's
   browser to exercise. It is SAFE-BY-CONSTRUCTION: on ANY error it falls back
   to the proven direct extraction (LLMProviders.ocrExtractWithFallback), so
   extraction quality (strict schema + bbox) is preserved regardless.

   Architectural note: agrun's planner is text-prompt-driven; OCR is
   image -> structured-JSON + bbox. For SINGLE-SHOT extraction the planner is
   overhead — it just routes to the extract_document action, which does the
   real work via LLMProviders. The genuine multi-step agent value (repair /
   cross-doc memory / approval gate) lands in T008-T012; this file is the seam
   those build on.

   window.DocAgent = { runDocumentAgent }
*/
(function () {
  const A = window.Agrun;

  const keyOf = (s) => (s.provider === 'gemini' ? s.geminiKey : s.openaiKey);
  const modelOf = (s) => (s.provider === 'gemini' ? s.geminiModel : s.openaiModel);
  const skillOf = (s) => (s.provider === 'gemini' ? A.geminiBrowserSkill : A.openaiBrowserSkill);

  // Direct extraction (the proven path) — used for mock and as the agent fallback.
  async function direct(f, type, batchId, seq, settings, pathTag, err) {
    const d = await window.LLMProviders.ocrExtractWithFallback(f, type, batchId, seq, settings || { provider: 'mock' });
    d.agent_path = pathTag;
    if (err) d._agent_error = err;
    return d;
  }

  // Run one document. Real providers go through agrun's runtime.run(); mock (no
  // LLM to drive the planner) and any failure use the direct extraction path.
  async function runDocumentAgent(f, type, batchId, seq, settings, onStep) {
    // Mock has no LLM to drive the planner — bypass agrun entirely.
    if (!settings || settings.provider === 'mock' || !f.blob) {
      return direct(f, type, batchId, seq, settings, 'mock-direct');
    }

    try {
      // The action closes over THIS document, so the planner only has to decide
      // to call it — the args carry no image.
      const extractAction = A.defineAction({
        name: 'extract_document',
        description: 'Extract all structured fields, line items, totals and per-field bounding boxes from the current business document. Call this once, then finalize with its output.',
        tier: 0,
        execute: async () => {
          const doc = await window.LLMProviders.ocrExtractWithFallback(f, type, batchId, seq, settings);
          return { control: 'complete', output: doc, summary: 'extracted ' + (doc.document_no || f.name) };
        },
      });

      const runtime = A.createRuntime({
        skills: [skillOf(settings)],
        customActions: [extractAction],
      });

      const result = await runtime.run({
        provider: settings.provider,
        apiKey: keyOf(settings),
        model: modelOf(settings),
        prompt: 'Extract the structured data from this ' + type +
          ' document by calling the extract_document action exactly once, then finalize with its output.',
        onStep: onStep || undefined,
      });

      const doc = result && result.output && result.output.document_id ? result.output : null;
      if (!doc) throw new Error('agent loop returned no document output');
      doc.agent_path = 'agrun-loop';
      return doc;
    } catch (err) {
      // Any agent-loop failure -> proven direct extraction (keeps the app working).
      console.warn('[DocAgent] agent loop failed, using direct extraction:', err && err.message);
      return direct(f, type, batchId, seq, settings, 'direct-fallback', err && err.message);
    }
  }

  window.DocAgent = { runDocumentAgent };
})();
