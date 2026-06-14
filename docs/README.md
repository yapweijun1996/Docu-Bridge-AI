# DocuBridge AI — Developer Docs

> **AI Document Import for ERP** — a local-first document review workbench. Upload business PDFs/photos → OCR/LLM extraction → human review with evidence highlights → approve → export reviewed JSON.

These docs describe the **current implemented state**, which has grown beyond the original [`../PRD.md`](../PRD.md) MVP. The PRD scoped a mock-OCR-only MVP and explicitly deferred real OCR, bounding-box evidence, and template learning to later phases. The app now ships **real LLM extraction (OpenAI + Gemini), Gemini bounding-box grounding, SSE streaming, and PDF canvas rendering** — see [LLM-PROVIDERS.md](LLM-PROVIDERS.md).

---

## Doc index

| Doc | What's in it |
|---|---|
| [ARCHITECTURE.md](ARCHITECTURE.md) | No-build SPA structure, global `window.*` namespaces, script load order, routing, the two-phase OCR flow, agrun.js agent core integration plan |
| [DATA-MODEL.md](DATA-MODEL.md) | IndexedDB stores, the `doc`/`field`/`box` shapes, the `toJSON` export contract, status machine, validation rules |
| [LLM-PROVIDERS.md](LLM-PROVIDERS.md) | BYOK provider adapters (mock/OpenAI/Gemini), SSE streaming, thinking/effort config, bbox grounding, fallback chain, known unknowns |

---

## What this is

- **Pure frontend SPA.** No build step, no bundler, no `npm install`. React 18 UMD + Babel-standalone transform JSX in the browser, loaded from CDN. `package-lock.json` is effectively empty.
- **Local-first.** All state lives in the browser's IndexedDB (`docubridge_ai`). Uploaded file blobs, extracted data, reviewed data, and settings persist across refresh. Nothing is sent to a server *except* the document bytes you send to your chosen LLM provider (BYOK).
- **Evidence-first review.** Every extracted field carries a bounding box; clicking a field highlights the matching region on the original document.

## How to run

It's static files — serve the project root with any static server:

```bash
# any of these, from the repo root:
python3 -m http.server 3333
npx serve -l 3333
```

Then open `http://localhost:3333`. (Inside Claude Code, the `preview_start` tool serves it via `.claude/launch.json`.)

First load **seeds** sample batches (3 batches, ~9 docs) into IndexedDB. To reset: **Settings → Reset demo data**, or clear the `docubridge_ai` IndexedDB database.

## Tech at a glance

| Concern | Choice |
|---|---|
| UI | React 18 (UMD CDN) + Babel-standalone in-browser JSX |
| Design system | prebuilt bundle in `_ds/…/_ds_bundle.js` → `window.DocuBridgeAIDesignSystem_30d086` |
| Persistence | hand-rolled IndexedDB promise wrapper (`app/db.jsx`) |
| PDF rendering | pdf.js 3.11.174 (CDN) → `<canvas>` so bbox overlays can sit on top |
| LLM | BYOK OpenAI + Gemini, with a mock engine that never fails as fallback |
| Routing | client-side, `localStorage`-persisted route object; no router lib |

## Source map

```
index.html              load order + CDN deps
app/
  icons.jsx             window.Icons — inline SVG icon set
  data.jsx              window.DocCore — schemas, layouts, validation, mock OCR, seed (no React)
  providers.jsx         window.LLMProviders — OpenAI/Gemini/mock adapters, SSE, bbox mapping
  db.jsx                window.AppStore — IndexedDB + React Context store + actions
  ui.jsx                window.UI — AppShell, Toast, Confirm, JsonView, FileExt
  screens1.jsx          window.Screens1 — Dashboard, UploadBatch
  screens2.jsx          window.Screens2 — Batches, BatchDetail, ReviewQueue, Approved, Failed, Settings
  workbench.jsx         window.Workbench — ReviewWorkbench (viewer + bbox overlay + editor)
  main.jsx              router + boot()
  *.css                 kit.css / screens.css / app.css
```
