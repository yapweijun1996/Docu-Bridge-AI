/* DocuBridge AI — Review Workbench (evidence-first, editable, live validation).
   window.Workbench */
(function () {
  const DS = window.DocuBridgeAIDesignSystem_30d086;
  const { Button, IconButton, StatusBadge, ConfidenceBadge, ExtractedField, ValidationMessage } = DS;
  const { Icons, UI } = window;
  const C = window.DocCore;
  const { useStore } = window.AppStore;
  const { useConfirm } = UI;
  const h = React.createElement;

  // numeric-coerce a working doc for save / json
  function normalize(doc) {
    const items = doc.line_items.map((li) => {
      const out = { ...li };
      ['quantity', 'unit_price', 'total_price'].forEach((k) => { if (out[k] != null && out[k] !== '') out[k] = C.num(out[k]); });
      out.confidence = C.num(out.confidence);
      return out;
    });
    return { ...doc, line_items: items };
  }

  // ---------------- data-driven facsimile page ----------------
  function FaxPage({ doc, page, active, showBoxes }) {
    const lh = doc.letterhead || {};
    const hasPrices = C.TYPES[doc.document_type].hasPrices;
    const fields = doc.fields.filter((f) => f.page === page);
    const box = (b) => ({ left: b.x + '%', top: b.y + '%', width: b.w + '%', height: b.h + '%' });

    return h('div', { className: 'db-fax' },
      // letterhead
      h('div', { className: 'db-fax__lh' },
        h('div', null,
          h('div', { className: 'db-fax__co' }, lh.company || 'UNTITLED DOCUMENT'),
          lh.address && h('div', { className: 'db-fax__addr' }, lh.address)),
        h('div', null,
          h('div', { className: 'db-fax__title' }, lh.title || 'DOCUMENT'),
          h('div', { className: 'db-fax__sub' }, lh.subtitle || ''))),

      // printed field stamps (ink)
      fields.filter((f) => !f.table).map((f) => h('div', {
        key: 'stamp-' + f.key, className: 'db-stamp' + (f.group === 'parties' ? ' db-stamp--party' : ''), style: box(f.box),
      },
        h('span', { className: 'db-stamp__lab' }, f.label),
        h('span', { className: 'db-stamp__val' }, f.value || '—'))),

      // line-item table (if a table field lives on this page)
      fields.filter((f) => f.table).map((f) => h('div', { key: 'tbl-' + f.key, className: 'db-fax-table', style: box(f.box) },
        h('table', null,
          h('thead', null, h('tr', null,
            h('th', null, '#'), h('th', null, 'Description'), h('th', { className: 'r' }, 'Qty'),
            hasPrices && h('th', { className: 'r' }, 'Price'), hasPrices && h('th', { className: 'r' }, 'Total'))),
          h('tbody', null, doc.line_items.map((li, i) => h('tr', { key: i },
            h('td', null, li.serial_no || i + 1),
            h('td', null, li.description || '—'),
            h('td', { className: 'r' }, li.quantity),
            hasPrices && h('td', { className: 'r' }, C.money(li.unit_price)),
            hasPrices && h('td', { className: 'r' }, C.money(li.total_price)))))))),

      // evidence boxes (highlights)
      showBoxes && fields.map((f) => h('div', {
        key: 'box-' + f.key, className: 'dbk-evbox' + (active === f.key ? ' is-active' : ''), style: box(f.box),
      }, active === f.key && h('span', { className: 'dbk-evbox__tag' }, f.label))));
  }

  // ---------------- pdf.js canvas renderer (one page, scaled to container width) ----------------
  // Falls back to native <embed> on error or timeout (e.g. sandboxed worker) so the PDF is never blank.
  function PdfCanvas({ blob, page, url }) {
    const canvasRef = React.useRef(null);
    const [err, setErr] = React.useState(null);
    React.useEffect(() => {
      let cancelled = false;
      const lib = window.pdfjsLib;
      if (!lib) { setErr('no-lib'); return; }
      lib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      const timer = setTimeout(() => { if (!cancelled) setErr('timeout'); }, 9000);
      (async () => {
        const buf = await blob.arrayBuffer();
        const pdf = await lib.getDocument({ data: buf }).promise;
        if (cancelled) return;
        const pg = await pdf.getPage(Math.min(page || 1, pdf.numPages));
        const viewport = pg.getViewport({ scale: 2 });
        const canvas = canvasRef.current;
        if (!canvas || cancelled) return;
        canvas.width = viewport.width; canvas.height = viewport.height;
        await pg.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
        if (!cancelled) clearTimeout(timer);
      })().catch((e) => { if (!cancelled) { clearTimeout(timer); setErr(e.message || 'render-failed'); } });
      return () => { cancelled = true; clearTimeout(timer); };
    }, [blob, page]);
    // fallback: show the PDF via native embed (no bbox overlay possible on a plugin layer)
    if (err) return h('embed', { src: url + '#toolbar=0&navpanes=0', type: 'application/pdf', style: { width: '100%', height: 640, border: 'none', display: 'block', background: '#fff' } });
    return h('canvas', { ref: canvasRef, style: { display: 'block', width: '100%' } });
  }

  // ---------------- real uploaded file viewer (image OR pdf, both with bbox overlay) ----------------
  function RealDoc({ doc, page, active, showBoxes }) {
    const url = React.useMemo(() => (doc.file_blob ? URL.createObjectURL(doc.file_blob) : null), [doc.document_id]);
    React.useEffect(() => () => { if (url) URL.revokeObjectURL(url); }, [url]);
    if (!doc.file_blob) return h('div', { className: 'db-fax' });
    const isImg = ['png', 'jpg', 'jpeg'].includes(doc.file_type);
    const isPdf = doc.file_type === 'pdf';
    const fields = doc.fields.filter((f) => f.page === page && !f.table && f.box);
    const box = (b) => ({ position: 'absolute', left: b.x + '%', top: b.y + '%', width: b.w + '%', height: b.h + '%' });
    const overlay = showBoxes && fields.map((f) => h('div', {
      key: 'box-' + f.key,
      className: 'dbk-evbox' + (active === f.key ? ' is-active' : ''),
      style: box(f.box),
    }, active === f.key && h('span', { className: 'dbk-evbox__tag' }, f.label)));
    const wrap = (inner) => h('div', { style: { position: 'relative', display: 'block', width: '100%' } }, inner, overlay);

    if (isImg && url) return wrap(h('img', { src: url, alt: doc.file_name, style: { display: 'block', width: '100%' } }));
    if (isPdf && window.pdfjsLib) return wrap(h(PdfCanvas, { blob: doc.file_blob, page, url }));
    // fallback: no pdf.js → native embed, no overlay
    return h('div', { className: 'db-realdoc' },
      h('embed', { src: url + '#toolbar=0&navpanes=0', type: 'application/pdf' }));
  }

  // ---------------- editable line item grid ----------------
  function LineItemGrid({ doc, onPatch, onAdd, onDelete }) {
    const hasPrices = C.TYPES[doc.document_type].hasPrices;
    const cell = (val, set, opts = {}) => h('input', { value: val == null ? '' : val, onChange: (e) => set(e.target.value), ...opts });
    return h('div', { className: 'dbk-ligrid' },
      h('table', null,
        h('thead', null, h('tr', null,
          h('th', { style: { width: 28 } }, '#'),
          h('th', null, 'Description'),
          h('th', { className: 'num', style: { width: 64 } }, 'Qty'),
          h('th', { style: { width: 46 } }, 'UOM'),
          hasPrices && h('th', { className: 'num', style: { width: 70 } }, 'Price'),
          hasPrices && h('th', { className: 'num', style: { width: 80 } }, 'Total'),
          h('th', { style: { width: 56 } }, 'Conf.'),
          h('th', { className: 'act' }))),
        h('tbody', null, doc.line_items.map((li, i) => {
          const mismatch = hasPrices && Math.abs(C.num(li.quantity) * C.num(li.unit_price) - C.num(li.total_price)) > 0.01;
          return h('tr', { key: i, className: C.num(li.confidence) < 0.7 ? 'is-low' : '' },
            h('td', { className: 'dbk-mono' }, i + 1),
            h('td', null,
              cell(li.description, (v) => onPatch(i, 'description', v)),
              h('div', { className: 'dbk-li-code dbk-mono', style: { paddingLeft: 5 } }, li.stock_code || '')),
            h('td', { className: 'num' }, cell(li.quantity, (v) => onPatch(i, 'quantity', v))),
            h('td', null, cell(li.uom, (v) => onPatch(i, 'uom', v))),
            hasPrices && h('td', { className: 'num' }, cell(li.unit_price, (v) => onPatch(i, 'unit_price', v))),
            hasPrices && h('td', { className: 'num' }, cell(li.total_price, (v) => onPatch(i, 'total_price', v), { style: mismatch ? { color: 'var(--red-600)', fontWeight: 600 } : null })),
            h('td', null, h(ConfidenceBadge, { score: C.num(li.confidence), showLabel: false, showPercent: true, plain: true })),
            h('td', { className: 'act' }, h('button', { className: 'dbk-li-del', 'aria-label': 'Delete row', onClick: () => onDelete(i) }, h(Icons.Trash, { w: 14 }))));
        }))),
      h('button', { className: 'dbk-li-add', onClick: onAdd }, h(Icons.Plus, { w: 14 }), 'Add row'));
  }

  // ---------------- JSON drawer (reviewed vs original) ----------------
  function JsonDrawer({ doc, onClose }) {
    const [tab, setTab] = React.useState('reviewed');
    const obj = tab === 'reviewed' ? C.toJSON(normalize(doc), 'reviewed') : doc.extracted_json;
    return h('div', { className: 'db-modal-scrim', onClick: onClose },
      h('div', { className: 'db-modal', style: { width: 600, maxWidth: '100%' }, onClick: (e) => e.stopPropagation() },
        h('div', { className: 'dbk-json-head' },
          h('div', { className: 'dbk-panel-tabs', style: { borderBottom: 'none' } },
            ['reviewed', 'extracted'].map((id) => h('button', { key: id, className: 'dbk-ptab' + (tab === id ? ' is-active' : ''), onClick: () => setTab(id) },
              id === 'reviewed' ? 'reviewed_json' : 'extracted_json (original)'))),
          h('button', { className: 'dbk-iconbtn', 'aria-label': 'Close', onClick: onClose }, h(Icons.X, { w: 16 }))),
        h(UI.JsonView, { obj }),
        h('div', { className: 'dbk-json-foot' },
          h(Icons.Database, { w: 14 }),
          h('span', { className: 'dbk-json-foot__txt' }, tab === 'reviewed' ? 'Your corrected draft — what gets exported.' : 'Frozen AI output — never overwritten by edits.'))));
  }

  // ---------------- workbench ----------------
  function ReviewWorkbench({ go, params }) {
    const store = useStore();
    const confirm = useConfirm();
    const source = store.documents.find((d) => d.document_id === params.docId);
    const [doc, setDoc] = React.useState(source);
    const [dirty, setDirty] = React.useState(false);
    const [page, setPage] = React.useState(1);
    const [zoom, setZoom] = React.useState(1);
    const [rotate, setRotate] = React.useState(0);
    const [showBoxes, setShowBoxes] = React.useState(true);
    const [active, setActive] = React.useState(null);
    const [tab, setTab] = React.useState('summary');
    const [jsonSubTab, setJsonSubTab] = React.useState('reviewed');

    // reset local state when the document changes
    React.useEffect(() => { setDoc(source); setDirty(false); setPage(1); setActive(source ? (source.fields[0] || {}).key : null); setTab('summary'); setJsonSubTab('reviewed'); }, [params.docId]);

    if (!doc) return h('div', { className: 'dbk-page' }, h(DS.EmptyState, { icon: h(Icons.FileText, { w: 24 }), title: 'Document not found', actions: h(Button, { onClick: () => go('batches') }, 'Back to batches') }));

    const hasPrices = C.TYPES[doc.document_type].hasPrices;
    const liveIssues = C.validate(normalize(doc));
    const errs = liveIssues.filter((v) => v.sev === 'error');
    const liveStatus = ['approved', 'submitted', 'rejected', 'failed'].includes(doc.status) ? doc.status : (errs.length ? 'need_review' : 'ready');
    const summaryFields = doc.fields.filter((f) => !f.table && f.group !== 'totals');
    const totalFields = doc.fields.filter((f) => f.group === 'totals');

    const selectField = (key, pg) => { setActive(key); if (pg) setPage(pg); };
    const patchField = (key, value) => {
      setDirty(true);
      setDoc((prev) => {
        const flds = prev.fields.map((f) => (f.key === key ? { ...f, value, edited: true, confidence: 1 } : f));
        let totals = prev.totals;
        if (totals && ['subtotal', 'gst', 'grand_total'].includes(key)) {
          const tk = key === 'grand_total' ? 'grand' : key;
          totals = { ...totals, [tk]: C.num(value) };
        }
        return { ...prev, fields: flds, totals };
      });
    };
    const patchLine = (i, key, value) => { setDirty(true); setDoc((prev) => ({ ...prev, line_items: prev.line_items.map((li, idx) => (idx === i ? { ...li, [key]: value } : li)) })); };
    const addLine = () => { setDirty(true); setDoc((prev) => ({ ...prev, line_items: [...prev.line_items, { serial_no: String(prev.line_items.length + 1), stock_code: '', description: '', remark: '', quantity: 0, uom: 'pcs', unit_price: 0, total_price: 0, confidence: 1 }] })); };
    const delLine = (i) => { setDirty(true); setDoc((prev) => ({ ...prev, line_items: prev.line_items.filter((_, idx) => idx !== i) })); };

    const save = async () => { const saved = await store.saveDoc(normalize(doc)); setDoc(saved); setDirty(false); store.notify('Draft saved · reviewed_json updated', 'success'); };
    const approve = async () => {
      if (errs.length) { store.notify(errs.length + ' error' + (errs.length > 1 ? 's' : '') + ' must be resolved before approval', 'error'); setTab('validate'); return; }
      if (await confirm({ title: 'Approve ' + (doc.document_no || 'document') + '?', body: 'Reviewed data is marked approved and the original OCR output is preserved separately.', confirmLabel: 'Approve document' })) {
        await store.approveDoc(normalize(doc)); go('batch', { batchId: doc.batch_id });
      }
    };
    const reject = async () => {
      if (await confirm({ title: 'Reject ' + (doc.document_no || 'document') + '?', body: 'The document will be marked Rejected and moved out of the review queue.', danger: true, confirmLabel: 'Reject' })) {
        await store.rejectDoc(doc, 'Rejected by reviewer'); go('batch', { batchId: doc.batch_id });
      }
    };
    const [reprocessing, setReprocessing] = React.useState(false);
    const reprocess = async () => {
      if (!doc.file_blob) { store.notify('No original file stored — re-upload the document to reprocess', 'error'); return; }
      setReprocessing(true);
      const fresh = await store.reprocessDoc(doc);
      setDoc(fresh); setDirty(false); setPage(1); setActive((fresh.fields[0] || {}).key);
      setReprocessing(false);
    };

    const isReal = !doc.is_sample && doc.file_blob;
    const curPage = doc.pages[page - 1] || doc.pages[0];

    return h('div', { className: 'dbk-wb' },
      // top bar
      h('div', { className: 'dbk-wb-top' },
        h('button', { className: 'dbk-back', 'aria-label': 'Back', onClick: () => go('batch', { batchId: doc.batch_id }) }, h(Icons.ArrowLeft, { w: 17 })),
        h('div', { className: 'dbk-wb-id' },
          h('span', { className: 'dbk-mono dbk-strong' }, doc.document_no || doc.file_name),
          h('span', { className: 'dbk-wb-file dbk-mono' }, doc.file_name)),
        h(StatusBadge, { status: liveStatus }),
        h(ConfidenceBadge, { score: doc.confidence, showPercent: true }),
        isReal && doc.ocr_provider && h('span', {
          title: 'Extracted by: ' + doc.ocr_provider,
          style: { fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 5, whiteSpace: 'nowrap',
            background: '#f0fdf4', color: '#15803d' },
        }, 'OCR: ' + doc.ocr_provider),
        h('span', { className: 'grow' }),
        dirty && h('span', { style: { fontSize: 12, color: 'var(--amber-700)', fontWeight: 600 } }, 'Unsaved changes'),
        isReal && h(Button, { variant: 'secondary', size: 'sm', iconLeft: h(Icons.Refresh, { w: 15 }), disabled: reprocessing, onClick: reprocess }, reprocessing ? 'Reprocessing…' : 'Reprocess OCR'),
        h(Button, { variant: 'secondary', size: 'sm', iconLeft: h(Icons.Save, { w: 15 }), disabled: !dirty, onClick: save }, 'Save draft'),
        h(Button, { variant: 'danger-soft', size: 'sm', onClick: reject }, 'Reject'),
        h(Button, { size: 'sm', iconLeft: h(Icons.Approved, { w: 15 }), onClick: approve }, 'Approve')),

      h('div', { className: 'dbk-wb-body' },
        // page rail
        h('div', { className: 'dbk-rail' },
          doc.pages.map((p) => h('button', { key: p.no, className: 'dbk-thumb' + (page === p.no ? ' is-active' : ''), onClick: () => setPage(p.no) },
            h('div', { className: 'dbk-thumb__page' }, h(Icons.FileText, { w: 20 })),
            h('span', { className: 'dbk-thumb__no' }, 'Page ' + p.no),
            h(ConfidenceBadge, { score: p.conf, showLabel: false, showPercent: true, plain: true })))),

        // viewer
        h('div', { className: 'dbk-viewer' },
          h('div', { className: 'dbk-viewer__toolbar' },
            h('span', { className: 'dbk-viewer__page' }, 'Page ' + page + ' of ' + doc.pages.length + ' · ' + (curPage.label || '')),
            h('span', { className: 'grow' }),
            h(IconButton, { label: 'Zoom out', size: 'sm', onClick: () => setZoom((z) => Math.max(0.6, +(z - 0.1).toFixed(2))) }, h(Icons.ZoomOut, { w: 16 })),
            h('span', { className: 'dbk-zoom dbk-mono' }, Math.round(zoom * 100) + '%'),
            h(IconButton, { label: 'Zoom in', size: 'sm', onClick: () => setZoom((z) => Math.min(1.6, +(z + 0.1).toFixed(2))) }, h(Icons.ZoomIn, { w: 16 })),
            h('span', { className: 'dbk-tbdiv' }),
            h(IconButton, { label: 'Rotate', size: 'sm', onClick: () => setRotate((r) => (r + 90) % 360) }, h(Icons.Rotate, { w: 16 })),
            h(IconButton, { label: 'Toggle highlights', size: 'sm', active: showBoxes, onClick: () => setShowBoxes((s) => !s) }, h(Icons.Box, { w: 16 }))),
          h('div', { className: 'dbk-viewer__stage' },
            h('div', { className: 'dbk-paperwrap' },
              h('div', { className: 'dbk-paper', style: { transform: `scale(${zoom}) rotate(${rotate}deg)` } },
                isReal ? h(RealDoc, { doc, page, active, showBoxes }) : h(FaxPage, { doc, page, active, showBoxes }),
                isReal && !doc.fields.some((f) => f.grounded) && h('div', { className: 'db-realnote' }, '⚠ 框为版面估算坐标 — Gemini 返回真实坐标后会自动定位到原文位置'))))),

        // extraction panel
        h('div', { className: 'dbk-panel' },
          h('div', { className: 'dbk-panel-tabs' },
            [['summary', 'Summary'], ['lines', 'Line Items'], ['validate', 'Validation'], ['json', 'Raw JSON'], ['agent', 'Agent']].map(([id, lab]) => h('button', { key: id, className: 'dbk-ptab' + (tab === id ? ' is-active' : ''), onClick: () => setTab(id) },
              lab,
              id === 'validate' && liveIssues.length > 0 && h('span', { className: 'dbk-ptab__count' }, liveIssues.length),
              id === 'agent' && (doc.agent_steps || []).length > 0 && h('span', { className: 'dbk-ptab__count' }, doc.agent_steps.length)))),

          h('div', { className: 'dbk-panel-scroll' },
            tab === 'summary' && h('div', { className: 'dbk-fieldgroup' },
              h('div', { className: 'dbk-fg-label' }, 'Header fields'),
              summaryFields.map((f) => h(ExtractedField, {
                key: f.key, label: f.label, value: f.value, confidence: f.confidence, pageNo: f.page,
                active: active === f.key, edited: f.edited,
                error: (liveIssues.find((v) => v.field === f.key && v.sev === 'error') || {}).detail,
                onSelect: () => selectField(f.key, f.page), onChange: (v) => patchField(f.key, v),
              })),
              totalFields.length > 0 && h('div', { className: 'dbk-fg-label', style: { marginTop: 14 } }, 'Totals'),
              totalFields.map((f) => h(ExtractedField, {
                key: f.key, label: f.label, value: f.value, confidence: f.confidence, pageNo: f.page,
                active: active === f.key, edited: f.edited,
                error: (liveIssues.find((v) => v.field === f.key && v.sev === 'error') || {}).detail,
                onSelect: () => selectField(f.key, f.page), onChange: (v) => patchField(f.key, v),
              }))),

            tab === 'lines' && h('div', { className: 'dbk-fieldgroup' },
              h('div', { className: 'dbk-fg-label' }, doc.line_items.length + ' line items' + (doc.line_items.filter((li) => C.num(li.confidence) < 0.7).length ? ' · ' + doc.line_items.filter((li) => C.num(li.confidence) < 0.7).length + ' low-confidence' : '')),
              h(LineItemGrid, { doc, onPatch: patchLine, onAdd: addLine, onDelete: delLine })),

            tab === 'validate' && h('div', { className: 'dbk-fieldgroup dbk-validate' },
              liveIssues.length === 0 && h(ValidationMessage, { severity: 'info', title: 'All checks passed' }, 'This document is ready to submit.'),
              liveIssues.map((v) => h(ValidationMessage, { key: v.id, severity: v.sev, title: v.title, rule: v.rule }, v.detail)),
              h('div', { className: 'dbk-checklist' },
                h('div', { className: 'dbk-fg-label' }, 'Review checklist'),
                [['Document No present', !!C.fieldMap(doc).document_no],
                 ['Transaction date present', !!C.fieldMap(doc).transaction_date],
                 ['At least one line item', doc.line_items.length > 0],
                 hasPrices && ['Totals balance', !liveIssues.some((v) => v.rule === 'subtotal + gst = grand_total')]].filter(Boolean)
                  .map(([t, ok], i) => h('div', { key: i, className: 'dbk-checkitem' + (ok ? ' is-ok' : ' is-bad') },
                    ok ? h(Icons.Check, { w: 14 }) : h(Icons.X, { w: 14 }), h('span', null, t))))),

            tab === 'json' && h('div', { className: 'dbk-fieldgroup' },
              h('div', { className: 'dbk-panel-tabs', style: { borderBottom: '1px solid var(--border)', marginBottom: 8 } },
                [['reviewed', 'reviewed_json'], ['extracted', 'extracted_json']].map(([id, lab]) =>
                  h('button', { key: id, className: 'dbk-ptab' + (jsonSubTab === id ? ' is-active' : ''), onClick: () => setJsonSubTab(id) }, lab))),
              h(UI.JsonView, { obj: jsonSubTab === 'reviewed' ? C.toJSON(normalize(doc), 'reviewed') : doc.extracted_json }),
              h('div', { style: { display: 'flex', gap: 8, padding: '8px 0', alignItems: 'center' } },
                h(Icons.Database, { w: 14 }),
                h('span', { style: { fontSize: 12, color: 'var(--text-muted)', flex: 1 } },
                  jsonSubTab === 'reviewed' ? 'Your corrected draft — what gets exported.' : 'Frozen AI output — never overwritten by edits.'),
                h('button', { className: 'dbk-iconbtn', 'aria-label': 'Copy JSON',
                  onClick: () => { const obj = jsonSubTab === 'reviewed' ? C.toJSON(normalize(doc), 'reviewed') : doc.extracted_json; navigator.clipboard && navigator.clipboard.writeText(JSON.stringify(obj, null, 2)); store.notify('JSON copied to clipboard', 'success'); } },
                  h(Icons.Code, { w: 15 }))))),

            tab === 'agent' && h('div', { className: 'dbk-fieldgroup' },
              h('div', { className: 'dbk-fg-label' }, 'Agent steps' + (doc.ocr_provider ? ' · ' + doc.ocr_provider : '')),
              (!doc.agent_steps || doc.agent_steps.length === 0)
                ? h('div', { className: 'db-quiet', style: { padding: '8px 2px' } }, 'No agent steps recorded for this document.')
                : doc.agent_steps.map((s, i) => h('div', { key: i, className: 'dbk-checkitem', style: { alignItems: 'flex-start', gap: 8 } },
                    h('span', { className: 'dbk-mono', style: { fontSize: 11, color: 'var(--brand-600, #2563eb)', minWidth: 64 } }, s.type || 'step'),
                    h('div', { style: { flex: 1 } },
                      s.name && h('div', { className: 'dbk-mono', style: { fontSize: 12, fontWeight: 600 } }, s.name),
                      h('div', { style: { fontSize: 12, color: 'var(--text-muted)' } }, s.summary || '—')))),
              h('div', { style: { fontSize: 11, color: 'var(--text-muted)', marginTop: 10, paddingTop: 8, borderTop: '1px solid var(--border)' } },
                'Steps stream from the agrun agent loop during extraction. Documents extracted via the direct-provider fallback path show a single explanatory row.')),

          errs.length > 0
            ? h('div', { className: 'dbk-panel-foot' }, h(Icons.Alert, { w: 15 }), h('span', null, errs.length + ' error' + (errs.length > 1 ? 's' : '') + ' must be resolved before approval.'))
            : h('div', { className: 'dbk-panel-foot', style: { background: 'var(--green-50)', color: 'var(--green-700)' } }, h(Icons.Check, { w: 15 }), h('span', null, 'Validation passed — ready to approve.')))),

      );
  }

  window.Workbench = { ReviewWorkbench };
})();
