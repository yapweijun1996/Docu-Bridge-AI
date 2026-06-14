# Live-test documents

Drop the PDF / PNG / JPG you want the agent to extract **into this folder**.

- Everything in here except this README is **git-ignored** — your private
  documents never get committed.
- After you add a file, tell the agent the filename (e.g. `receipt.pdf`) and it
  will load it into the preview browser, run a **real** Gemini extraction using
  the key from `.env`, and report exactly what Gemini returned (raw JSON + boxes)
  vs. what the UI shows.

This folder and `.env` exist only for local live testing. The app itself does
**not** read them at runtime — extraction settings live in IndexedDB (BYOK,
entered via the Settings screen). See `.env.sample` for details.
