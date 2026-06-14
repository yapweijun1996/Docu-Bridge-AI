# DocuBridge AI

AI Document Import Workbench for ERP — upload business PDFs or images, extract data with LLM OCR, review with bounding-box evidence highlights, approve, and export structured JSON.

## What it does

| Feature | Status |
|---|---|
| Upload batches of PDFs / images | ✅ |
| Two-phase OCR (instant mock placeholders → real LLM swap) | ✅ |
| BYOK OpenAI & Gemini extraction with SSE streaming | ✅ |
| Gemini bounding-box grounding (field-level evidence overlay) | ✅ |
| Mock fallback with visible warning badge (never silent) | ✅ |
| Human review workbench (edit, approve, reject) | ✅ |
| Validation rules (totals balance, required fields, row math) | ✅ |
| Export reviewed JSON per document type | ✅ |
| IndexedDB local persistence, no server | ✅ |
| Agent-driven OCR loop (agrun.js) | 🚧 Planned — see below |

## Document types

`purchase_order` · `invoice` · `delivery_order` · `claim_form` · `generic`

## How to run

Static files — serve the project root with any static server:

```bash
python3 -m http.server 3333
# or
npx serve -l 3333
```

Open `http://localhost:3333`. No build step, no `npm install`.

First load seeds sample data (3 batches, ~9 docs) into IndexedDB. Reset via **Settings → Reset demo data**.

## Production goal: General Document OCR with agrun.js agent core

The target production architecture replaces the current one-shot LLM call with an **agent loop** powered by [agrun.js](https://github.com/yapweijun1996/Agent-Runtime-JavaScript) — a browser-first agent runtime that implements the OODAE loop (Observe → Orient → Decide → Act → Evaluate).

### Why agrun.js

| Capability needed | agrun.js solution |
|---|---|
| Multi-step extraction with retry and repair | OODAE loop — planner LLM + action gates |
| Provider-agnostic (OpenAI + Gemini) | `openaiBrowserSkill` / `geminiBrowserSkill` adapters |
| Browser-first, zero build tooling | Single UMD bundle → `<script src="agrun.js">` |
| Human approval gate for low-confidence docs | `actionPolicy` → `approval_required` → resumable token |
| Observable extraction steps | `onStep` callback: every planner decision and action result |
| Cross-doc memory in a batch | `createIndexedDBSessionStore({ dbName: 'docubridge-batch-<id>' })` |
| Task tracking per document | Built-in `TodoState` subsystem (5 actions, 7 config knobs) |

### High-level integration plan (no code changes yet)

1. **Load agrun.js** — add `<script src="agrun.js">` in `index.html` after pdf.js; expose `window.Agrun`.
2. **Wrap adapters as custom actions** — OpenAI/Gemini adapters become `defineAction` specs; the agent loop calls them instead of a direct one-shot.
3. **Repair loop** — the agent detects low-confidence fields and re-queries for those specific regions (crop + re-extract).
4. **Approval gate** — documents below confidence threshold emit `approval_required`; the workbench surface becomes the resolution UI.
5. **Batch-scoped sessions** — use `createIndexedDBSessionStore` scoped to `batch_id`; supplier name learned from doc 1 flows into doc 2 as `globalMemory`.

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md#agent-core-integration-plan-agrunjs) for the detailed architecture, and [`task.jsonl`](task.jsonl) for the production task board.

## Tech at a glance

| Concern | Current choice |
|---|---|
| UI | React 18 UMD + Babel-standalone, in-browser JSX transform |
| Persistence | IndexedDB (`docubridge_ai`, DB v2, 7 stores) |
| LLM | BYOK OpenAI `gpt-5.4-mini` + Gemini `gemini-3.5-flash`, mock fallback |
| PDF rendering | pdf.js 3.11.174 → `<canvas>` for bbox overlay support |
| Agent runtime (planned) | agrun.js — OODAE loop, approval gates, session memory |

## Docs

| Doc | Contents |
|---|---|
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | SPA structure, load order, two-phase OCR, agent core integration plan |
| [`docs/DATA-MODEL.md`](docs/DATA-MODEL.md) | IndexedDB stores, doc/field/box shapes, status machine, validation rules |
| [`docs/LLM-PROVIDERS.md`](docs/LLM-PROVIDERS.md) | BYOK adapters, SSE streaming, thinking config, bbox grounding |
| [`PRD.md`](PRD.md) | Product requirements and phase roadmap |
| [`task.jsonl`](task.jsonl) | Production task board (General Document OCR) |
