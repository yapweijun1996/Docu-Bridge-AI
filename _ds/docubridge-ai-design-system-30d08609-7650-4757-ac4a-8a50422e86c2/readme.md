# DocuBridge AI — Design System

> DocuBridge AI turns business PDFs and scanned documents into structured, reviewable, ERP-ready data.

This project is the **design system** for DocuBridge AI: tokens, fonts, reusable React component primitives, foundation specimen cards, and a full interactive UI kit of the product. A compiler bundles the components into `_ds_bundle.js` and indexes the CSS so consuming projects can build on-brand screens.

**Source material:** built from the product spec `DESIGN.md` (DocuBridge AI — AI Document Review Workbench). No external codebase or Figma was attached — the visual system below was derived from the written spec. If a real codebase/Figma exists, re-attach it and this system can be reconciled against it.

---

## What DocuBridge AI is

An **evidence-first document processing workbench**. Users upload PDFs/photos (Purchase Orders, Invoices, Delivery Orders, Claim Forms), the system runs OCR/AI extraction into structured JSON, and humans **review, correct, approve, and export** before anything reaches an ERP. AI output is always a *draft*, never final truth. The original `extracted_json` and the corrected `reviewed_json` are kept separately.

Three ideas drive every screen:
1. **Evidence-first** — every extracted field traces back to a page + bounding box. Click a field → its source area highlights.
2. **Human-in-the-loop** — edit fields and line items, save a draft, approve, reject, reprocess.
3. **Batch-first** — work is organized by batch (1–100 files), each with a clear status.

Primary users are ERP / admin / finance / purchasing staff — **non-technical**. The UI must be calm, legible, and trustworthy.

---

## Visual foundations

**Overall feeling:** professional, calm, trustworthy, data-focused. Enterprise SaaS, *paper-and-ink*. Not colorful, not playful, no over-animation.

- **Color.** Cool **slate** neutrals carry the whole UI (app bg = slate-100, cards = white, borders = slate-200/300, body text = slate-700, headings + sidebar = slate-900). One **institutional blue** primary (`--brand` = `#2D6CDF`) for primary actions, links, selection, and the *active* evidence highlight. Semantic colors are disciplined: green = approved/high-confidence, amber = need-review/medium, red = failed/rejected/error/low, cyan = ready/processing, a rare violet = OCR-complete. **Color is never the only signal** — every status and confidence state ships with a text label.
- **Type.** **IBM Plex Sans** for all UI; **IBM Plex Mono** for *data* — document numbers, stock codes, amounts, percentages, JSON, raw OCR text. Mono uses a slashed zero (`font-feature-settings: "zero" 1`) and tabular figures for column alignment. Dense enterprise scale: body 14px, tables 12–13px, page headings 22px, dashboard stats 28–36px. Uppercase 11px eyebrows with wide tracking label sections.
- **Spacing.** 4px base grid. Tables are compact (1–3); review forms are comfortable (3–5); page padding 5–7.
- **Corners & elevation.** Small radii — controls/cards 7–10px, pills full-round, document-paper 2px. Hairline 1px borders do most of the structural work; shadows are soft and cool-tinted (`rgba(15,27,45,…)`), never heavy. Cards = white + 1px slate-200 border + `--shadow-sm`.
- **Backgrounds.** Flat surfaces only — no gradients, no textures, no full-bleed photography. The sidebar is a deep slate-900 well; the document viewer stage is a slate-200 "desk" the white paper sits on.
- **Motion.** Quick and calm: 120–180ms, standard ease `cubic-bezier(0.2,0,0.2,1)`, no bounce. The only ambient motion is the *processing* status dot's gentle pulse (disabled under `prefers-reduced-motion`).
- **States.** Hover = subtle slate-50 fill or one step darker for solid buttons; press = next-darker shade (and a 1px nudge on cards); focus = 3px brand-tinted ring (`--ring-focus`). Selected rows/nav use `--surface-selected` (blue-50).
- **The signature motif — evidence highlight.** A field's source region is drawn on the document as a bounding box: **amber** = a located region, **blue** = the field the reviewer has currently selected (with a focus ring + mono tag). This amber↔blue evidence link is the brand's defining interaction.

---

## Content fundamentals (voice & copy)

- **Tone:** plain, precise, operational. Short labels, no marketing fluff. Tell the user what a thing *is* and what to do next.
- **Person:** mostly impersonal/imperative for actions ("Upload batch", "Start OCR", "Approve document", "Export approved"). Helper text addresses the user as **you** sparingly ("Drop PDFs or photos…").
- **Casing:** Sentence case for body, helper text, and buttons ("Save draft", "Approve document"). UPPERCASE only for short eyebrow/section labels and table column heads, with wide tracking. Status labels are Title Case ("Need Review", "Ready to Submit").
- **Numbers & data:** always monospace, tabular. Money to 2 decimals; confidence as a whole-number percent + a word ("High · 96%"). Document numbers verbatim (`PO-2024-0512`).
- **Status language:** the nine canonical statuses are fixed vocabulary — Uploaded, Processing, OCR Completed, Need Review, Ready to Submit, Approved, Submitted, Failed, Rejected. Don't invent synonyms.
- **Validation copy:** state the rule plainly and show the math. Title = the problem ("Totals do not balance"); detail = the evidence ("444.00 + 31.08 = 475.08, not 1,284.00"); the machine rule appears in mono (`subtotal + gst = grand_total`).
- **No emoji.** Iconography is line icons only (see below).

---

## Iconography

- **System:** a built-in **Lucide-style line-icon set** — 24px viewBox, 2px stroke, round caps/joins, no fills. Defined in `ui_kits/docubridge/icons.jsx` and exposed as `window.Icons` (≈40 glyphs: Dashboard, Upload, Batches, Queue, Approved, Failed, Settings, Search, File/FileText, Plus/Minus/Check/X, Chevron(s), Save, Rotate, Zoom, Box, Download, Code, Filter, More, Bell, Refresh, Trash, Pin, Send, Eye, Alert, Database, Clock, Layers).
- **Why Lucide-style:** neutral, legible at small sizes, matches the calm enterprise tone. If you prefer, swap in real [Lucide](https://lucide.dev) from CDN — the stroke weight matches 1:1. **Substitution flagged:** these are hand-built look-alikes, not the npm Lucide package.
- **Usage:** icons are monochrome and inherit `currentColor`. Pair an icon with a text label for any meaningful action; icon-only controls (toolbar zoom/rotate, overflow) must carry an `aria-label` (the `IconButton` component enforces this). Status/confidence are communicated by the badge components, not bare icons.
- **No emoji, no multicolor/illustrated icons.** The only "illustration" is the logo.

---

## Brand assets (`assets/`)

- `logomark.svg` — app-tile mark: a white document with an evidence checkmark + two bridging nodes on institutional blue. Use at 24–96px.
- `logo-wordmark.svg` — horizontal lockup "DocuBridge **AI**" (AI in blue). Use in the sidebar/topbar and headers.

---

## File index (manifest)

**Foundations**
- `styles.css` — global entry point (consumers link this). `@import`s only.
- `tokens/` — `fonts.css`, `colors.css`, `typography.css`, `spacing.css`, `elevation.css`, `base.css`.

**Components** (`window.DocuBridgeAIDesignSystem_30d086.*`)
- `components/forms/` — **Button, IconButton, Input, Select, Checkbox**
- `components/feedback/` — **StatusBadge, ConfidenceBadge, ValidationMessage, EmptyState**
- `components/layout/` — **Card, PageHeader**
- `components/data/` — **StatCard, ExtractedField** (the evidence-first review field)

**Foundation cards** (`guidelines/`) — colors (primary, neutrals, semantic, surfaces/text), type (families, scale), spacing (scale, radii/elevation), brand (logo, evidence highlight). Each is a `@dsCard` specimen.

**UI kit** (`ui_kits/docubridge/`) — interactive product recreation. `index.html` is a click-through across **Dashboard → Upload → Batch Detail → Review Workbench → Approved Drafts** (plus Failed / Settings empty states). Screens: `Dashboard.jsx`, `UploadBatch.jsx`, `BatchDetail.jsx`, `ReviewWorkbench.jsx`, `ApprovedDrafts.jsx`; chrome `AppShell.jsx`; `icons.jsx`, `data.jsx` (mock OCR data); styles `kit.css`, `screens.css`.

**Skill** — `SKILL.md` (Agent-Skills compatible).

---

## Status & confidence reference

| Status | Meaning | Tone |
|---|---|---|
| Uploaded | file in, OCR not started | neutral |
| Processing | OCR running (dot pulses) | blue |
| OCR Completed | output available | violet |
| Need Review | user must check | amber |
| Ready to Submit | validation passed | cyan |
| Approved | reviewed data approved | green |
| Submitted | sent to external system | green |
| Failed | OCR/parse failed | red |
| Rejected | user rejected | red/neutral |

Confidence: **High ≥ 90%**, **Medium 70–89%**, **Low < 70%** — shown at document, field, and line-item level, always with bars + a word.
