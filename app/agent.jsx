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
    // T011: no agent loop ran on the direct path — leave a single explanatory step.
    d.agent_steps = [{ type: pathTag === 'direct-fallback' ? 'fallback' : 'direct',
      name: '', summary: pathTag === 'direct-fallback'
        ? ('Agent loop failed — used direct extraction. ' + (err || ''))
        : 'Mock/direct extraction — agrun planner loop bypassed (no LLM in mock mode).' }];
    return d;
  }

  // T011: defensively project an agrun onStep event into a compact, renderable row.
  function projectStep(step) {
    try {
      return {
        type: (step && (step.type || step.phase || step.kind)) || 'step',
        name: (step && (step.name || step.actionName || step.action)) || '',
        summary: (step && (step.summary || step.detail || step.message)) || '',
      };
    } catch (e) { return { type: 'step', name: '', summary: '' }; }
  }

  // Run one document. Real providers go through agrun's runtime.run(); mock (no
  // LLM to drive the planner) and any failure use the direct extraction path.
  async function runDocumentAgent(f, type, batchId, seq, settings, onStep) {
    // Mock has no LLM to drive the planner — bypass agrun entirely.
    if (!settings || settings.provider === 'mock' || !f.blob) {
      return direct(f, type, batchId, seq, settings, 'mock-direct');
    }

    const steps = [];   // T011: collect agent steps for the workbench inspector
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
        onStep: (step) => {
          if (steps.length < 200) steps.push(projectStep(step));
          if (onStep) { try { onStep(step); } catch (e) { /* host hook must not break the loop */ } }
        },
      });

      const doc = result && result.output && result.output.document_id ? result.output : null;
      if (!doc) throw new Error('agent loop returned no document output');
      doc.agent_path = 'agrun-loop';
      doc.agent_steps = steps;   // T011
      return doc;
    } catch (err) {
      // Any agent-loop failure -> proven direct extraction (keeps the app working).
      console.warn('[DocAgent] agent loop failed, using direct extraction:', err && err.message);
      return direct(f, type, batchId, seq, settings, 'direct-fallback', err && err.message);
    }
  }

  window.DocAgent = { runDocumentAgent };
})();
