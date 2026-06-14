# LLM Providers

All provider code lives in [`../app/providers.jsx`](../app/providers.jsx) → `window.LLMProviders = { ocrExtractWithFallback, testConnection }`. This layer is where the app went beyond the PRD's mock-only MVP.

## BYOK (Bring Your Own Key)

The user enters their own API key in **Settings**. It's stored in IndexedDB `meta.llm_settings` and **never leaves the browser** except as the `Authorization` header / `?key=` param on the direct call to the provider. There is no app server in between.

```js
llm_settings = {
  provider: 'mock' | 'openai' | 'gemini',
  openaiKey, geminiKey,
  openaiModel,   // default 'gpt-5.4-mini'
  geminiModel,   // default 'gemini-3.5-flash'
}
```

Security note shown in the UI: keys sit in local IndexedDB — use on trusted devices only; document bytes are sent to the provider's servers.

## The fallback chain

```
ocrExtractWithFallback(file, type, batchId, seq, settings):
  provider === 'mock'  → mockAdapter            (ocr_provider = 'mock')
  provider === 'openai'→ openaiAdapter
  provider === 'gemini'→ geminiAdapter
  on ANY throw         → mockAdapter            (ocr_provider = 'mock (fallback)', _llm_error = msg)
```

**Mock never fails** — it's the safety net, so the UI always ends up with a document. The catch: a silent fallback can look like success. That's why every result is tagged `ocr_provider`, and the workbench shows a **source badge** (and the failure reason on hover) so "why is this mock data?" is answerable at a glance.

## Adapters

| Adapter | Model default | PDF? | Endpoint |
|---|---|---|---|
| `mockAdapter` | — | — | wraps `DocCore.mockOCR` (deterministic fake data + layout boxes) |
| `openaiAdapter` | `gpt-5.4-mini` | ❌ throws on PDF (use PNG/JPG) | `POST /v1/chat/completions`, `stream:true` |
| `geminiAdapter` | `gemini-3.5-flash` | ✅ images + PDF | `POST …:streamGenerateContent?alt=sse` |

Both real adapters use **strict structured output** (OpenAI `response_format: json_schema` / Gemini `responseSchema`) so the model returns schema-valid JSON.

## SSE streaming

Both real adapters stream. `readSSEText(resp, extract)` reads the `ReadableStream`, splits on `\n`, takes `data:` lines, JSON-parses each chunk, and accumulates text via a per-provider extractor:

- **OpenAI**: `chunk.choices[0].delta.content`
- **Gemini**: `chunk.candidates[0].content.parts[].text`

Why streaming: a non-streamed `generateContent` on a thinking model leaves the request **pending** until *all* thinking + output finishes — which looks like a hang. Streaming keeps the connection alive and data flowing, so it never looks dead and won't be cut by intermediaries.

## Thinking / reasoning effort — ON at low

Empirically (per project owner), for these reasoning/thinking models:

- **Do enable thinking/effort, at `low`.** Turning it off hurts robustness on messy layouts.
  - Gemini 3.x: `generationConfig.thinkingConfig.thinkingLevel = 'low'` (applied when model matches `/gemini-3/`)
  - OpenAI gpt-5 family: `reasoning_effort = 'low'` (applied when model matches `/^gpt-5/`)
- **Do NOT cap tokens.** No `maxOutputTokens` / `max_tokens`. A token cap truncates the JSON mid-stream and breaks `JSON.parse`. Let it run to completion.
- **Control *intensity* (effort/level), not *length* (token budget).** The level knob is "how careful"; a token budget is a hard cut that severs the reasoning/output chain.

A 90 s `AbortController` timeout (`fetchWithTimeout`) is the only bound — it converts an infinite pending request into a clear error rather than limiting the model's work.

## Bounding-box grounding (Gemini)

Gemini is asked to return, for every extracted field, a box in the `boxes` array. **Coordinate format is `[ymin, xmin, ymax, xmax]`, normalized 0–1000, y-axis FIRST, top-left origin.** This is the classic footgun: assume x-first and every box is transposed, and you'll wrongly conclude "the model can't ground."

`boxesToMap` converts to the app's `{x, y, w, h}` percentages:

```
x = xmin / 10      y = ymin / 10
w = |xmax-xmin|/10 h = |ymax-ymin|/10   (clamped to 0–100)
```

`makeDoc` then overrides the layout's default box with the AI box and sets `field.grounded = true`. Sanity check when verifying: the title/header box should land near `y≈0` (top); if it's low on the page, your axes are flipped.

OpenAI gpt-4o-class vision is **not** reliable for precise coordinates — grounding is a Gemini feature here.

## PDF rendering + overlay

`<embed>`/native PDF is a plugin layer — you cannot lay DOM boxes on top. So PDFs are rasterized with **pdf.js to a `<canvas>`** (`workbench.jsx` `PdfCanvas`), and the bbox overlay divs sit on the canvas in a `position:relative` wrapper at `width:100%`. Images (`<img>`) use the same wrapper. If pdf.js errors or the render times out (9 s), it falls back to a native `<embed>` (PDF visible, no overlay).

> Heads-up: in sandboxed/headless preview environments the pdf.js **Web Worker can be blocked**, leaving the render promise unsettled — that's an environment limit, not a code bug. Real browsers render fine; the embed fallback covers the rest.

## testConnection

A minimal "reply with: ok" ping per provider (30 s timeout), used by the Settings **Test connection** button. Applies the same low effort/level, returns `{ ok, message }`, and surfaces the exact provider error (key, quota, model-permission, CORS) so misconfig is diagnosable before a real extraction.

## Model & field reference (verified 2026-06-14 against official docs)

Confirmed against developers.openai.com and ai.google.dev:

- **OpenAI** current models: `gpt-5.5` (flagship), `gpt-5.4`, **`gpt-5.4-mini`** (our default), `gpt-5.4-nano`. `reasoning_effort` accepts `none/low/medium/high/xhigh`. All support text+image (vision).
- **Gemini** current models: **`gemini-3.5-flash`** (GA, stable, default — our default), `gemini-3-flash` (Preview), `gemini-3.1-pro-preview`. The official REST example confirms the field is camelCase `"generationConfig":{"thinkingConfig":{"thinkingLevel":"low"}}` with values `low/medium/high`. You **cannot** combine `thinkingLevel` with the legacy `thinkingBudget` in one request.
- `gemini-2.0-flash` / `2.0-flash-lite` were **shut down 2026-06-01** — do not use.
- Our regex guards mean the low effort/level params are only sent to matching models: `/^gpt-5/` for OpenAI, `/gemini-3/` for Gemini. Older defaults (gpt-4.1, gemini-2.5) silently skip them, so picking a non-reasoning model makes the "low thinking" setting a no-op.

If a call still returns 400, the source badge / Test-connection message shows the reason — adjust to the live API.
- Gemini's `generativelanguage.googleapis.com` supports browser CORS with `?key=`; if CORS fails from localhost, that surfaces in Test connection.
- SSE chunk shapes are handled defensively (`try/catch` per line) but assume the documented OpenAI/Gemini stream formats.

## Extending

To add a provider: write an adapter `(f, type, batchId, seq, apiKey, model) → makeDoc(...)`, wire it into `ocrExtractWithFallback` and `testConnection`, add its models to `OPENAI_MODELS`/`GEMINI_MODELS` (screens2.jsx) and defaults to `DEFAULT_SETTINGS` (db.jsx). Return data through `llmToMakeDocOpts` so grounding + line mapping stay consistent.
