# Architecture

## No-build SPA

There is no bundler or transpile step. `index.html` loads, in order:

1. **CDN runtime** — React 18 UMD, ReactDOM UMD, Babel-standalone.
2. **Design system** — `_ds/…/_ds_bundle.js` (plain compiled JS) → `window.DocuBridgeAIDesignSystem_30d086`.
3. **pdf.js** — `cdnjs …/pdf.js/3.11.174/pdf.min.js` → `window.pdfjsLib` (used to rasterize PDFs to canvas).
4. **App modules** as `<script type="text/babel">` — Babel transforms the JSX in-browser at load.

Each app module is an IIFE that attaches one global namespace to `window`. There are no ES imports; modules find each other through `window.*`.

### Script load order matters

```
React / ReactDOM / Babel
  → _ds_bundle.js
  → pdf.js
  → icons.jsx      (window.Icons)
  → data.jsx       (window.DocCore)
  → providers.jsx  (window.LLMProviders)   ← must precede db.jsx (db.jsx calls it)
  → db.jsx         (window.AppStore)
  → ui.jsx         (window.UI)
  → screens1.jsx   (window.Screens1)
  → screens2.jsx   (window.Screens2)
  → workbench.jsx  (window.Workbench)
  → main.jsx       (boot)
```

Babel transforms run **after** the HTML finishes streaming, and not strictly in DOM order, so modules must not assume another is ready at parse time. `main.jsx`'s `boot()` guards against this: it polls every 50 ms until every required `window.*` global exists, then mounts React. Adding a new module means adding it to the load list **and** to the `boot()` readiness check.

## Global namespaces

| Global | File | Responsibility |
|---|---|---|
| `window.Icons` | icons.jsx | inline SVG icons |
| `window.DocCore` | data.jsx | pure logic: `TYPES`, `LAYOUTS`, `validate`, `toJSON`, `makeDoc`, `mockOCR`, `seed`, `deriveStatus`, helpers. **No React.** |
| `window.LLMProviders` | providers.jsx | `ocrExtractWithFallback`, `testConnection` |
| `window.AppStore` | db.jsx | `StoreProvider`, `useStore` — IndexedDB + React Context + all mutating actions |
| `window.UI` | ui.jsx | `AppShell`, `Toast`, `ConfirmProvider`/`useConfirm`, `JsonView`, `FileExt` |
| `window.Screens1/2`, `window.Workbench` | screens*.jsx, workbench.jsx | screen components |
| `window.DocuBridgeAIDesignSystem_30d086` | _ds bundle | `Card`, `Button`, `Select`, `Input`, `StatusBadge`, `ConfidenceBadge`, `StatCard`, `Checkbox`, `PageHeader`, `EmptyState`, `ExtractedField`, `ValidationMessage` |

## Boot & state ownership

```
boot() → ReactDOM.createRoot(#root).render(
  <StoreProvider>          // db.jsx — owns db, batches, documents, settings, toast
    <ConfirmProvider>      // ui.jsx — modal confirm()
      <App/>               // main.jsx — routing + AppShell
```

- `StoreProvider` opens IndexedDB, seeds on first run, loads `batches`/`documents`/`llm_settings`, and exposes everything plus action methods through React Context (`useStore`).
- `App` holds the current **route** (`{name, params}`), persisted to `localStorage` under `docubridge_route`, and renders the matching screen via `screenFor`. `go(name, params)` is the only navigation primitive — no router library.

## Routing

Route names → screens (`main.jsx` `screenFor`): `dashboard`, `upload`, `batches`, `batch`, `queue`, `review`, `approved`, `failed`, `settings`. `params.docId` / `params.batchId` carry context. The left nav highlight maps many routes to one nav item via `NAV_OF`.

## The two-phase OCR flow (`db.jsx` `commitBatch`)

This is the most important runtime sequence to understand.

```
commitBatch(meta, files):
  PHASE 1 (synchronous, instant UI):
    for each file → C.mockOCR() placeholder doc, status='processing', store + show
  PHASE 2 (setTimeout, async):
    for each file:
      if provider !== 'mock' && file.blob:
        LLMProviders.ocrExtractWithFallback(...)   ← real OpenAI/Gemini, mock on failure
        preserve document_id / file_blob / created_at, recompute status
      else: keep the mock doc
    persist resolved docs, replace in state, refresh batch rollup, toast
```

Why two phases: the user sees documents appear **immediately** (mock placeholders), while the real LLM call resolves in the background and swaps in the true extraction — without changing `document_id`, so the workbench stays stable. `reprocessDoc` reuses the same provider path for a single doc on demand.

## Data flow summary

```
Upload screen → store.commitBatch → IndexedDB + state
                                  → (phase 2) LLMProviders → swap in real extraction
Workbench edits → store.saveDoc/approveDoc/rejectDoc → finalize() (revalidate, re-score, re-status)
                                  → persist to documents + reviewed_results + review_actions
Export → DocCore.toJSON(doc,'reviewed') → download (screens2.jsx Exports)
```

`finalize()` (db.jsx) is the single choke point that recomputes `validation_issues`, `confidence`, `status`, and per-page confidence on every save — keeping derived state consistent.

See [DATA-MODEL.md](DATA-MODEL.md) for the shapes and [LLM-PROVIDERS.md](LLM-PROVIDERS.md) for the provider layer.

## Agent Core Integration Plan (agrun.js)

**Production goal:** replace the one-shot `ocrExtractWithFallback()` call with a multi-step agent loop driven by [agrun.js](https://github.com/yapweijun1996/Agent-Runtime-JavaScript). No code changes have been made yet — this section documents the target architecture.

### Why an agent loop for OCR

A single LLM call either succeeds or falls back to mock. An agent loop can:
- **Repair** low-confidence fields by re-querying with a cropped region.
- **Chain** extractions across documents in a batch (supplier name from doc 1 feeds doc 2 as memory).
- **Gate** human approval precisely when confidence is below threshold, not on every failure.
- **Observe** every step (planner decision, action result) for audit and debug.

### agrun.js fit

agrun.js is a browser-first UMD bundle (`dist/agrun.js`) that implements the OODAE loop (Observe → Orient → Decide → Act → Evaluate). It fits the no-build IIFE pattern of this project:

```html
<!-- index.html — after pdf.js, before app modules -->
<script src="agrun.js"></script>
<!-- exposes window.Agrun = { createRuntime, openaiBrowserSkill, geminiBrowserSkill, ... } -->
```

### Integration layers

| Layer | Current | Target |
|---|---|---|
| Provider adapters | Direct fetch in `providers.jsx` | `defineAction` wrappers; agrun calls them |
| Extraction entry point | `ocrExtractWithFallback(file, type, ...)` | `runtime.run({ prompt, provider, apiKey, ... })` |
| Repair logic | None (mock fallback only) | Agent loop re-prompts for low-confidence fields |
| Approval | Toast warning on fallback | `actionPolicy` → `approval_required` result → workbench resume UI |
| Session memory | None | `createIndexedDBSessionStore({ dbName: 'docubridge-batch-<batchId>' })` |
| Step observability | None | `onStep` callback → render in workbench inspector panel |

### Execution flow (target)

```
commitBatch(meta, files)
  PHASE 1 (unchanged): mock placeholders → instant UI

  PHASE 2 (agent loop per document):
    const runtime = createRuntime({
      skills:      [openaiBrowserSkill | geminiBrowserSkill],
      sessionStore: createIndexedDBSessionStore({ dbName: 'docubridge-batch-' + batchId }),
      actionPolicy: { confidence_gate: { mode: 'ask' } },
    });
    const result = await runtime.run({
      provider, apiKey, model,
      prompt: buildOCRPrompt(file, type),
      onStep: (step) => updateWorkbenchProgress(step),
    });

    if (result.output?.kind === 'approval_required') {
      // workbench shows approval UI; user resolves → runtime.run({ approval_resolution })
    }
    // apply result to doc, persist, swap in state (same as current phase 2 tail)
```

### Key agrun.js contracts to implement

| Contract | Reference doc |
|---|---|
| `createRuntime(options)` | `agrun_docs/public-runtime-api.md` |
| `defineAction(spec)` | `agrun_docs/action-contract.md` |
| `createIndexedDBSessionStore` | `agrun_docs/usage-quickstart.md` |
| `approval_required` → `approval_resolution` | `agrun_docs/approval-flow.md` |
| `onStep` step event schema | `agrun_docs/result-schema.md` |
| `TodoState` for per-doc task tracking | `agrun_docs/todo-state-integration.md` |

### Boot order after agrun.js is added

```
React / ReactDOM / Babel
  → _ds_bundle.js
  → pdf.js
  → agrun.js          ← NEW (window.Agrun)
  → icons.jsx         (window.Icons)
  → data.jsx          (window.DocCore)
  → providers.jsx     (window.LLMProviders)   ← adapters become defineAction wrappers
  → db.jsx            (window.AppStore)        ← commitBatch uses runtime.run
  → ui.jsx            (window.UI)
  → screens*.jsx, workbench.jsx, main.jsx
```

`boot()` in `main.jsx` must add `window.Agrun` to its readiness check list.
