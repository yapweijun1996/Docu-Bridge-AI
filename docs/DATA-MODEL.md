# Data Model

## IndexedDB

Database `docubridge_ai`, **version 2** (`app/db.jsx`). Stores:

| Store | keyPath | Indexes | Holds |
|---|---|---|---|
| `batches` | `batch_id` | — | batch metadata + rollup status |
| `documents` | `document_id` | `batch_id` | the working doc (full state, incl. `file_blob`) |
| `meta` | `key` | — | `seeded` flag, `llm_settings` (BYOK provider/keys/models) |
| `ocr_results` | `document_id` | — | reserved for frozen OCR output |
| `reviewed_results` | `document_id` | — | `reviewed_json` snapshot on save/approve |
| `validation_issues` | `document_id` | — | issue list snapshot on save |
| `review_actions` | `action_id` | `document_id` | audit trail: save/approve/reject events |

> Bumping `DB_VERSION` adds stores in `onupgradeneeded` but does **not** reseed. The `meta.seeded` flag gates seeding; clear it (or Reset demo data) to force a reseed. `llm_settings` lives in the existing `meta` store, so adding BYOK needed no version bump.

The wrapper is tiny: `openDB`, `tx`, `getAll`, `put`, `del`, `getMeta`. Blobs persist natively in IndexedDB. `clone()` strips the non-serialisable `_objUrl` before writing.

## The `doc` object (`DocCore.makeDoc`)

The canonical document shape, produced by `makeDoc(opts)` and consumed everywhere:

```js
{
  document_id, batch_id,
  file_name, file_type,            // 'pdf' | 'png' | 'jpg' | 'jpeg'
  document_type,                   // purchase_order | invoice | delivery_order | claim_form | generic
  document_no, page_count,
  is_sample,                       // true = seeded facsimile (no real blob); false = user upload
  file_blob,                       // the original File/Blob, or null
  ocr_provider,                    // 'mock' | 'gemini (model)' | 'openai (model)' | 'mock (fallback)'
  _llm_error,                      // set when a provider failed and fell back to mock
  letterhead, pages: [{ no, label, conf, … }],
  fields:  [Field],                // see below
  line_items: [LineItem],
  totals:  { subtotal, gst, grand } | null,
  confidence,                      // 0–1, avg of field + line confidences
  status,                          // see status machine
  extracted_json,                  // frozen original OCR output (never overwritten by edits)
  validation_issues: [Issue],
  created_at, updated_at, approved_by, approved_at, fail_reason
}
```

### Field

```js
{
  key, label, group,               // group: header | parties | meta | totals | footer | table
  page,                            // 1-based page number
  box: { x, y, w, h },             // % of the page (0–100). Layout default OR AI-grounded (see below)
  grounded,                        // true if box came from the LLM, not the mock layout
  value, confidence, editable, edited,
  table?, multiline?
}
```

`box` coordinates are **percentages of the page**, which lets the same overlay math work for the seeded facsimile, uploaded images, and pdf.js-rendered canvases.

### Layouts & types (`DocCore.LAYOUTS`, `DocCore.TYPES`)

`LAYOUTS[type]` defines the fields, their groups, pages, and **default** boxes for each document type. `makeDoc` maps layout fields → working fields, overlaying values/confidences and (when present) AI boxes. `TYPES[type]` carries `label`, `prefix`, `tax`, `hasPrices` (priced docs run total/line math; DOs don't).

The five types: `purchase_order`, `invoice`, `delivery_order`, `claim_form`, `generic`.

## Status machine

```
uploaded → processing → need_review ⇄ ready → approved → submitted
                              ↓
                           (failed / rejected are terminal)
```

`deriveStatus(doc)` re-derives status from validation on every `finalize()`:
- Terminal/locked states (`approved`, `submitted`, `rejected`, `failed`, `processing`, `uploaded`) are **never downgraded**.
- Otherwise: any `error`-severity issue → `need_review`; else → `ready`.

Batch status is a rollup (`refreshBatch`): processing > need_review > ready > approved.

## Validation (`DocCore.validate`)

Returns `[{ sev, title, rule, detail, field }]` where `sev ∈ {error, warning, info}`. Highlights:

- **Errors** (block approval): missing `document_no`, missing `transaction_date`, non-numeric `subtotal`/`gst`/`grand_total`, no line items, **totals don't balance** (`subtotal + gst ≠ grand_total`).
- **Warnings** (allow approval): non-numeric row qty/price, **line total mismatch** (`qty × unit_price ≠ total_price`), row confidence < 70%.
- Priced-only checks (`TYPES[type].hasPrices`) are skipped for delivery orders.

Approval is blocked while any `error` is unresolved (enforced in the workbench).

## Confidence

`docConfidence` = average of all non-table field confidences plus line-item confidences. Bands (PRD §13): High ≥ 0.90, Medium 0.70–0.89, Low < 0.70. UI always shows **label + number**, never color alone.

## Export contract (`DocCore.toJSON(doc, kind)`)

Builds the export payload from current working state. `kind = 'extracted' | 'reviewed'`; `reviewed` appends `_review: { status, approved_by, approved_at }`. Exports use **`reviewed_json`**, never the frozen `extracted_json`.

Per-type shape differs:
- **purchase_order**: `credit_term`, `bill_to`/`ship_to` (split into `{name, address}`), `delivery_address`, `line_items`, `totals`, `terms_and_conditions`
- **invoice**: `payment_terms`, `supplier`/`customer`, `line_items`, `totals`
- **delivery_order**: `customer`, `deliver_to`, `line_items` (no prices)
- **claim_form**: `claimant`, `claim_to`, `line_items`, `totals`
- **generic**: `from`, `to`

Helpers: `splitParty(v)` splits a multiline party string into `{name, address}`; `roundTotals(t)` coerces totals to numbers.

## Provider OCR result → doc

`LLMProviders.llmToMakeDocOpts` maps an LLM JSON result into `makeDoc` opts: copies header values, maps `line_items` (default confidence 0.88), and converts the LLM `boxes` array into a per-field `{x,y,w,h}%` map that overrides layout boxes. See [LLM-PROVIDERS.md](LLM-PROVIDERS.md) for the coordinate conversion (it's y-first — easy to get wrong).
