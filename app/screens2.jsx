/* DocuBridge AI — Batches list, Batch detail, Review queue, Approved, Failed, Settings.
   window.Screens2 */
(function () {
  const DS = window.DocuBridgeAIDesignSystem_30d086;
  const { Card, Button, Select, StatusBadge, ConfidenceBadge, Checkbox, PageHeader, EmptyState, Input } = DS;
  const { Icons, UI } = window;
  const C = window.DocCore;
  const { useStore } = window.AppStore;
  const { useConfirm } = UI;

  // ---------- export helpers ----------
  function download(filename, text, mime) {
    const blob = new Blob([text], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; document.body.appendChild(a); a.click();
    setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 100);
  }
  function exportJSON(docs) {
    const payload = docs.map((d) => C.toJSON(d, 'reviewed'));
    download('docubridge_export_' + docs.length + '.json', JSON.stringify(payload.length === 1 ? payload[0] : payload, null, 2), 'application/json');
  }
  function exportCSV(docs) {
    const head = ['document_no', 'document_type', 'date', 'status', 'serial_no', 'stock_code', 'description', 'quantity', 'uom', 'unit_price', 'total_price'];
    const rows = [head.join(',')];
    const esc = (v) => { const s = String(v == null ? '' : v); return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; };
    docs.forEach((d) => {
      const fm = C.fieldMap(d);
      (d.line_items.length ? d.line_items : [{}]).forEach((li) => {
        rows.push([d.document_no, d.document_type, fm.transaction_date || '', d.status, li.serial_no || '', li.stock_code || '', li.description || '', li.quantity || '', li.uom || '', li.unit_price || '', li.total_price || ''].map(esc).join(','));
      });
    });
    download('docubridge_export_' + docs.length + '.csv', rows.join('\n'), 'text/csv');
  }
  window.Exports = { download, exportJSON, exportCSV };

  // ============================ shared document table ============================
  function DocTable({ docs, go, showType }) {
    const store = useStore();
    const confirm = useConfirm();
    const [sel, setSel] = React.useState({});
    const [q, setQ] = React.useState('');
    const [fStatus, setFStatus] = React.useState('');
    const [fType, setFType] = React.useState('');

    React.useEffect(() => { setSel({}); }, [docs.length]);

    const ql = q.trim().toLowerCase();
    const filtered = docs.filter((d) => {
      if (ql && !((d.document_no || '').toLowerCase().includes(ql) || (d.file_name || '').toLowerCase().includes(ql))) return false;
      if (fStatus && d.status !== fStatus) return false;
      if (fType && d.document_type !== fType) return false;
      return true;
    });
    const ids = filtered.map((d) => d.document_id);
    const selCount = ids.filter((id) => sel[id]).length;
    const allOn = filtered.length > 0 && selCount === filtered.length;
    const toggleAll = () => { if (allOn) setSel({}); else setSel(Object.fromEntries(ids.map((id) => [id, true]))); };

    const selectedDocs = filtered.filter((d) => sel[d.document_id]);
    const bulkApprove = async () => {
      const ready = selectedDocs.filter((d) => d.status === 'ready');
      if (!ready.length) { store.notify('Only documents that pass validation can be approved', 'info'); return; }
      if (await confirm({ title: 'Approve ' + ready.length + ' document' + (ready.length > 1 ? 's' : '') + '?', body: 'Reviewed data will be marked approved. The original OCR output is preserved separately.', confirmLabel: 'Approve' })) {
        for (const d of ready) await store.approveDoc(d);
        setSel({});
      }
    };
    const bulkDelete = async () => {
      if (await confirm({ title: 'Delete ' + selCount + ' document' + (selCount > 1 ? 's' : '') + '?', body: 'They will be removed from local storage. This cannot be undone.', danger: true, confirmLabel: 'Delete' })) {
        for (const d of selectedDocs) await store.deleteDoc(d.document_id);
        setSel({});
      }
    };

    return React.createElement(React.Fragment, null,
      React.createElement('div', { className: 'dbk-toolbar' },
        React.createElement('div', { className: 'dbk-searchbox' },
          React.createElement(Icons.Search, { w: 15 }),
          React.createElement('input', { placeholder: 'Search document no or file name…', value: q, onChange: (e) => setQ(e.target.value) })),
        React.createElement(Select, { size: 'sm', value: fStatus, onChange: (e) => setFStatus(e.target.value), placeholder: 'All statuses',
          options: [{ value: '', label: 'All statuses' }, { value: 'need_review', label: 'Need Review' }, { value: 'ready', label: 'Ready to Submit' }, { value: 'approved', label: 'Approved' }, { value: 'submitted', label: 'Submitted' }, { value: 'failed', label: 'Failed' }, { value: 'rejected', label: 'Rejected' }] }),
        showType && React.createElement(Select, { size: 'sm', value: fType, onChange: (e) => setFType(e.target.value), placeholder: 'Any type',
          options: [{ value: '', label: 'Any type' }, { value: 'purchase_order', label: 'Purchase Order' }, { value: 'invoice', label: 'Invoice' }, { value: 'delivery_order', label: 'Delivery Order' }, { value: 'generic', label: 'Generic' }] }),
        React.createElement('span', { className: 'grow' }),
        React.createElement('span', { className: 'dbk-resultcount' }, filtered.length + ' of ' + docs.length + ' shown')),

      selCount > 0 && React.createElement('div', { className: 'dbk-bulkbar' },
        React.createElement(Checkbox, { checked: true, indeterminate: !allOn, onChange: toggleAll, 'aria-label': 'Select all' }),
        React.createElement('b', null, selCount + ' selected'),
        React.createElement('span', { className: 'grow' }),
        React.createElement(Button, { variant: 'secondary', size: 'sm', iconLeft: React.createElement(Icons.Approved, { w: 15 }), onClick: bulkApprove }, 'Approve ready'),
        React.createElement(Button, { variant: 'secondary', size: 'sm', iconLeft: React.createElement(Icons.Download, { w: 15 }), onClick: () => exportJSON(selectedDocs) }, 'Export JSON'),
        React.createElement(Button, { variant: 'danger-soft', size: 'sm', iconLeft: React.createElement(Icons.Trash, { w: 15 }), onClick: bulkDelete }, 'Delete')),

      React.createElement(Card, { flush: true },
        filtered.length === 0
          ? React.createElement('div', { style: { padding: '30px 0' } }, React.createElement(EmptyState, { icon: React.createElement(Icons.Search, { w: 24 }), title: 'No documents match', description: 'Try clearing the search or filters.' }))
          : React.createElement('table', { className: 'dbk-table' },
            React.createElement('thead', null, React.createElement('tr', null,
              React.createElement('th', { style: { width: 36 } }, React.createElement(Checkbox, { checked: allOn, indeterminate: selCount > 0 && !allOn, onChange: toggleAll, 'aria-label': 'Select all rows' })),
              React.createElement('th', null, 'Status'),
              React.createElement('th', null, 'Document No'),
              React.createElement('th', null, 'File name'),
              React.createElement('th', null, 'Document Type'),
              React.createElement('th', { style: { textAlign: 'center' } }, 'Pages'),
              React.createElement('th', null, 'Confidence'),
              React.createElement('th', null, 'Validation'),
              React.createElement('th', null, 'Last updated'),
              React.createElement('th', { style: { width: 80 } }))),
            React.createElement('tbody', null,
              filtered.map((d) => {
                const errs = d.validation_issues.filter((v) => v.sev === 'error').length;
                const warns = d.validation_issues.filter((v) => v.sev === 'warning').length;
                const issues = errs + warns;
                return React.createElement('tr', { key: d.document_id, className: sel[d.document_id] ? 'is-selected' : '', onClick: () => go('review', { docId: d.document_id }) },
                  React.createElement('td', { onClick: (e) => e.stopPropagation() }, React.createElement(Checkbox, { checked: !!sel[d.document_id], onChange: () => setSel((s) => ({ ...s, [d.document_id]: !s[d.document_id] })), 'aria-label': 'Select ' + d.document_no })),
                  React.createElement('td', null, React.createElement(StatusBadge, { status: d.status })),
                  React.createElement('td', { className: 'dbk-mono dbk-strong' }, d.document_no || '—'),
                  React.createElement('td', { className: 'dbk-mono', style: { color: 'var(--text-muted)' } }, d.file_name),
                  React.createElement('td', { style: { color: 'var(--text-secondary)' } }, C.TYPES[d.document_type] ? C.TYPES[d.document_type].label : d.document_type),
                  React.createElement('td', { style: { textAlign: 'center' }, className: 'dbk-mono' }, d.page_count),
                  React.createElement('td', null, d.status === 'failed' ? React.createElement('span', { className: 'dbk-dash' }, '—') : React.createElement(ConfidenceBadge, { score: d.confidence, showPercent: true })),
                  React.createElement('td', null,
                    d.status === 'failed' ? React.createElement('span', { className: 'dbk-issuechip' }, React.createElement(Icons.Alert, { w: 12 }), 'Failed')
                      : issues > 0 ? React.createElement('span', { className: 'dbk-issuechip' }, React.createElement(Icons.Alert, { w: 12 }), issues + ' issue' + (issues > 1 ? 's' : ''))
                        : React.createElement('span', { className: 'dbk-okchip' }, React.createElement(Icons.Check, { w: 12 }), 'Clean')),
                  React.createElement('td', { style: { color: 'var(--text-muted)' } }, C.ago(d.updated_at)),
                  React.createElement('td', { onClick: (e) => e.stopPropagation() },
                    React.createElement(Button, { variant: 'ghost', size: 'sm', iconRight: React.createElement(Icons.Chevron, { w: 14 }), onClick: () => go('review', { docId: d.document_id }) }, 'Review')));
              })))));
  }

  // ============================ Batches list ============================
  function BatchesList({ go }) {
    const { batches, documents } = useStore();
    return React.createElement('div', { className: 'dbk-page' },
      React.createElement(PageHeader, { title: 'Batches', description: 'Every upload, grouped by batch. Open one to review its documents.',
        actions: React.createElement(Button, { iconLeft: React.createElement(Icons.Upload, { w: 16 }), onClick: () => go('upload') }, 'Upload batch') }),
      batches.length === 0
        ? React.createElement(Card, { pad: true }, React.createElement(EmptyState, { icon: React.createElement(Icons.Batches, { w: 24 }), title: 'No batches yet', description: 'Upload PDFs or photos to create your first batch.', actions: React.createElement(Button, { onClick: () => go('upload') }, 'Upload batch') }))
        : React.createElement('div', { className: 'dbk-grid-batches' },
          batches.map((b) => {
            const mine = documents.filter((d) => d.batch_id === b.batch_id);
            const cnt = (s) => mine.filter((d) => (s === 'approved' ? ['approved', 'submitted'].includes(d.status) : d.status === s)).length;
            return React.createElement(Card, { key: b.batch_id, interactive: true, flush: true, className: 'db-batchcard', onClick: () => go('batch', { batchId: b.batch_id }) },
              React.createElement('div', { className: 'db-batchcard__top' },
                React.createElement('div', { className: 'db-batchcard__icon' }, React.createElement(Icons.Batches, { w: 19 })),
                React.createElement('div', { style: { flex: 1, minWidth: 0 } },
                  React.createElement('div', { className: 'db-batchcard__name' }, b.batch_name),
                  React.createElement('div', { className: 'db-batchcard__meta' }, C.TYPES[b.document_type].label + ' · ' + mine.length + ' files · ' + C.ago(b.updated_at))),
                React.createElement(StatusBadge, { status: b.status })),
              React.createElement('div', { className: 'db-batchcard__stats' },
                React.createElement('div', { className: 'db-batchcard__stat' }, React.createElement('b', null, cnt('need_review')), React.createElement('span', null, 'Review')),
                React.createElement('div', { className: 'db-batchcard__stat' }, React.createElement('b', null, cnt('ready')), React.createElement('span', null, 'Ready')),
                React.createElement('div', { className: 'db-batchcard__stat' }, React.createElement('b', null, cnt('approved')), React.createElement('span', null, 'Approved')),
                React.createElement('div', { className: 'db-batchcard__stat' }, React.createElement('b', null, cnt('failed')), React.createElement('span', null, 'Failed'))));
          })));
  }

  // ============================ Batch detail ============================
  function BatchDetail({ go, params }) {
    const store = useStore();
    const batch = store.batches.find((b) => b.batch_id === params.batchId);
    const docs = store.documents.filter((d) => d.batch_id === params.batchId);
    if (!batch) return React.createElement('div', { className: 'dbk-page' }, React.createElement(EmptyState, { icon: React.createElement(Icons.Batches, { w: 24 }), title: 'Batch not found', actions: React.createElement(Button, { onClick: () => go('batches') }, 'All batches') }));
    const approvable = docs.filter((d) => ['approved', 'submitted'].includes(d.status));
    const failed = docs.filter((d) => d.status === 'failed');
    const reprocessAll = async () => { for (const d of failed) await store.reprocessDoc(d); };

    return React.createElement('div', { className: 'dbk-page', onClick: (e) => { if (e.target.closest && e.target.closest('.db-pageheader__crumbs a')) { e.preventDefault(); go('batches'); } } },
      React.createElement(PageHeader, {
        breadcrumbs: [{ label: 'Batches', href: '#' }, { label: batch.batch_name }],
        title: batch.batch_name,
        badge: React.createElement(StatusBadge, { status: batch.status }),
        description: docs.length + ' files · ' + C.TYPES[batch.document_type].label + ' · created by ' + batch.owner + ' · ' + C.ago(batch.updated_at),
        actions: React.createElement(React.Fragment, null,
          failed.length > 0 && React.createElement(Button, { variant: 'secondary', iconLeft: React.createElement(Icons.Refresh, { w: 16 }), onClick: reprocessAll }, 'Reprocess failed (' + failed.length + ')'),
          React.createElement(Button, { iconLeft: React.createElement(Icons.Download, { w: 16 }), disabled: !approvable.length, onClick: () => exportJSON(approvable) }, 'Export approved')),
      }),
      React.createElement(DocTable, { docs, go }));
  }

  // ============================ Review queue (virtual) ============================
  function ReviewQueue({ go }) {
    const { documents } = useStore();
    const docs = documents.filter((d) => ['need_review', 'ready'].includes(d.status));
    return React.createElement('div', { className: 'dbk-page' },
      React.createElement(PageHeader, { title: 'Review queue', description: 'Every document awaiting a reviewer or ready to submit, across all batches.' }),
      docs.length === 0
        ? React.createElement(Card, { pad: true }, React.createElement(EmptyState, { icon: React.createElement(Icons.Approved, { w: 24 }), title: 'Inbox zero', description: 'No documents are waiting for review.' }))
        : React.createElement(DocTable, { docs, go, showType: true }));
  }

  // ============================ Approved drafts ============================
  function ApprovedDrafts({ go }) {
    const store = useStore();
    const confirm = useConfirm();
    const docs = store.documents.filter((d) => ['approved', 'submitted'].includes(d.status));
    const [sel, setSel] = React.useState(0);
    React.useEffect(() => { if (sel >= docs.length) setSel(0); }, [docs.length]);
    const cur = docs[sel];
    const submit = async () => {
      if (!cur || cur.status === 'submitted') return;
      if (await confirm({ title: 'Submit ' + cur.document_no + ' to ERP?', body: 'In this demo no external call is made — the document is marked Submitted.', confirmLabel: 'Submit' })) store.submitDoc(cur);
    };

    return React.createElement('div', { className: 'dbk-page' },
      React.createElement(PageHeader, { title: 'Approved drafts', description: 'Reviewed, validated documents — ready to export or submit to ERP.',
        actions: React.createElement(React.Fragment, null,
          React.createElement(Button, { variant: 'secondary', iconLeft: React.createElement(Icons.Download, { w: 16 }), disabled: !docs.length, onClick: () => exportCSV(docs) }, 'Export CSV'),
          React.createElement(Button, { iconLeft: React.createElement(Icons.Send, { w: 16 }), disabled: !cur || cur.status === 'submitted', onClick: submit }, 'Submit to ERP')) }),
      docs.length === 0
        ? React.createElement(Card, { pad: true }, React.createElement(EmptyState, { icon: React.createElement(Icons.Approved, { w: 24 }), title: 'Nothing approved yet', description: 'Approve documents in the review workbench and they will appear here.', actions: React.createElement(Button, { onClick: () => go('queue') }, 'Go to review queue') }))
        : React.createElement('div', { className: 'dbk-approved-grid' },
          React.createElement(Card, { flush: true },
            React.createElement('table', { className: 'dbk-table' },
              React.createElement('thead', null, React.createElement('tr', null,
                React.createElement('th', null, 'Status'), React.createElement('th', null, 'Document No'), React.createElement('th', null, 'Document Type'), React.createElement('th', null, 'File'), React.createElement('th', null, 'Confidence'), React.createElement('th', null, 'Approved by'), React.createElement('th', null, 'When'), React.createElement('th', null))),
              React.createElement('tbody', null, docs.map((d, i) => React.createElement('tr', { key: d.document_id, className: sel === i ? 'is-selected' : '', onClick: () => setSel(i) },
                React.createElement('td', null, React.createElement(StatusBadge, { status: d.status })),
                React.createElement('td', { className: 'dbk-mono dbk-strong' }, d.document_no),
                React.createElement('td', { style: { color: 'var(--text-secondary)' } }, C.TYPES[d.document_type] ? C.TYPES[d.document_type].label : d.document_type),
                React.createElement('td', { className: 'dbk-mono', style: { color: 'var(--text-muted)' } }, d.file_name),
                React.createElement('td', null, React.createElement(ConfidenceBadge, { score: d.confidence, showPercent: true })),
                React.createElement('td', null, d.approved_by || '—'),
                React.createElement('td', { style: { color: 'var(--text-muted)' } }, d.approved_at ? C.ago(d.approved_at) : '—'),
                React.createElement('td', { onClick: (e) => e.stopPropagation() }, React.createElement(Button, { variant: 'ghost', size: 'sm', onClick: () => go('review', { docId: d.document_id }) }, 'Open'))))))),

          cur && React.createElement(Card, { flush: true, className: 'dbk-json-card' },
            React.createElement('div', { className: 'dbk-json-head' },
              React.createElement('div', null, React.createElement('span', { className: 'dbk-mono dbk-strong' }, cur.document_no), React.createElement('span', { className: 'dbk-json-sub' }, 'reviewed_json')),
              React.createElement('div', { className: 'dbk-json-actions' },
                React.createElement('button', { className: 'dbk-iconbtn', 'aria-label': 'Copy', onClick: () => { navigator.clipboard && navigator.clipboard.writeText(JSON.stringify(C.toJSON(cur, 'reviewed'), null, 2)); store.notify('reviewed_json copied', 'success'); } }, React.createElement(Icons.Code, { w: 16 })),
                React.createElement('button', { className: 'dbk-iconbtn', 'aria-label': 'Download', onClick: () => exportJSON([cur]) }, React.createElement(Icons.Download, { w: 16 })))),
            React.createElement(UI.JsonView, { obj: C.toJSON(cur, 'reviewed') }),
            React.createElement('div', { className: 'dbk-json-foot' },
              React.createElement(ConfidenceBadge, { score: cur.confidence, showPercent: true }),
              React.createElement('span', { className: 'dbk-json-foot__txt' }, 'All validations passed · original OCR preserved separately')))));
  }

  // ============================ Failed documents ============================
  function FailedDocuments({ go }) {
    const store = useStore();
    const confirm = useConfirm();
    const docs = store.documents.filter((d) => d.status === 'failed');
    return React.createElement('div', { className: 'dbk-page' },
      React.createElement(PageHeader, { title: 'Failed documents', description: 'Files that could not be OCR-processed. Reprocess them or remove them from the batch.' }),
      docs.length === 0
        ? React.createElement(Card, { pad: true }, React.createElement(EmptyState, { icon: React.createElement(Icons.Approved, { w: 24 }), title: 'No failures', description: 'Every document processed cleanly.' }))
        : React.createElement(Card, { flush: true },
          docs.map((d) => React.createElement('div', { key: d.document_id, className: 'db-fail-row' },
            React.createElement(UI.FileExt, { name: d.file_name }),
            React.createElement('div', { className: 'db-fail-row__main' },
              React.createElement('div', { className: 'db-fail-row__name' }, d.file_name),
              React.createElement('div', { className: 'db-fail-row__reason' }, React.createElement(Icons.Alert, { w: 13 }), d.fail_reason || 'OCR failed')),
            React.createElement('div', { className: 'db-fail-row__meta' },
              React.createElement('span', { style: { fontSize: 12, color: 'var(--text-secondary)' } }, C.TYPES[d.document_type] ? C.TYPES[d.document_type].label : d.document_type),
              React.createElement('span', { style: { fontSize: 12, color: 'var(--text-muted)' } }, C.ago(d.created_at))),
            React.createElement(StatusBadge, { status: 'failed' }),
            React.createElement(Button, { variant: 'secondary', size: 'sm', iconLeft: React.createElement(Icons.Refresh, { w: 15 }), onClick: () => store.reprocessDoc(d) }, 'Reprocess'),
            React.createElement(Button, { variant: 'danger-soft', size: 'sm', iconLeft: React.createElement(Icons.Trash, { w: 15 }), onClick: async () => { if (await confirm({ title: 'Delete ' + d.file_name + '?', body: 'Removes the file from local storage.', danger: true, confirmLabel: 'Delete' })) store.deleteDoc(d.document_id); } }, 'Delete')))));
  }

  // ============================ Settings ============================
  const OPENAI_MODELS = [
    { value: 'gpt-5.4-mini', label: 'GPT-5.4 mini (reasoning · effort low)' },
    { value: 'gpt-5.4', label: 'GPT-5.4 (reasoning · effort low)' },
    { value: 'gpt-4.1', label: 'GPT-4.1 (no reasoning)' },
    { value: 'gpt-4o', label: 'GPT-4o (Classic · stable)' },
  ];
  const GEMINI_MODELS = [
    { value: 'gemini-3.5-flash', label: 'Gemini 3.5 Flash (GA · thinking · level low)' },
    { value: 'gemini-3-flash', label: 'Gemini 3 Flash (Preview · thinking · level low)' },
    { value: 'gemini-3.1-flash-lite', label: 'Gemini 3.1 Flash Lite (fast · thinking · level low)' },
    { value: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash (GA · no level control)' },
    { value: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro (GA · most capable)' },
  ];

  function Settings() {
    const store = useStore();
    const confirm = useConfirm();
    const DEFAULT = { provider: 'gemini', openaiKey: '', geminiKey: '', openaiModel: 'gpt-5.4-mini', geminiModel: 'gemini-3.5-flash' };
    const [local, setLocal] = React.useState({ ...DEFAULT, ...(store.settings || {}) });
    const [saving, setSaving] = React.useState(false);
    const [testing, setTesting] = React.useState(false);
    const [testResult, setTestResult] = React.useState(null);

    React.useEffect(() => { if (store.settings) setLocal((p) => ({ ...DEFAULT, ...store.settings })); }, [store.settings]);

    const set = (k, v) => { setLocal((p) => ({ ...p, [k]: v })); setTestResult(null); };
    const saveSettings = async () => {
      setSaving(true);
      await store.saveSettings(local);
      setSaving(false);
      store.notify('Settings saved', 'success');
    };
    const testConn = async () => {
      setTesting(true);
      setTestResult(null);
      const key = local.provider === 'openai' ? local.openaiKey : local.geminiKey;
      const model = local.provider === 'openai' ? local.openaiModel : local.geminiModel;
      const result = await window.LLMProviders.testConnection(local.provider, key, model);
      setTestResult(result);
      setTesting(false);
    };
    const reset = async () => { if (await confirm({ title: 'Clear all data?', body: 'Permanently deletes every batch and document from your local IndexedDB. This cannot be undone.', danger: true, confirmLabel: 'Clear all' })) store.resetDemo(); };

    const rules = [
      ['Document number is required', 'document_no must not be empty', 'error'],
      ['Transaction date is required', 'transaction_date is required', 'error'],
      ['Grand total must be numeric', 'grand_total is numeric', 'error'],
      ['Totals must balance', 'subtotal + gst = grand_total', 'error'],
      ['Line total must match', 'quantity × unit_price = total_price', 'warning'],
      ['At least one line item', 'line_items.length ≥ 1', 'error'],
      ['Flag low-confidence rows', 'row confidence < 70%', 'warning'],
    ];
    return React.createElement('div', { className: 'dbk-page dbk-page--narrow' },
      React.createElement(PageHeader, { title: 'Settings', description: 'OCR provider, API keys, validation rules, and storage.' }),
      React.createElement('div', { className: 'db-settings' },
        React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 16 } },

          React.createElement(Card, { title: 'OCR provider', flush: true },
            React.createElement('div', { className: 'db-set-row' },
              React.createElement('div', { className: 'db-set-row__main' },
                React.createElement('b', null, 'Engine'),
                React.createElement('span', null, 'BYOK — bring your own API key. Keys stay in your browser only.')),
              React.createElement('div', { style: { width: 210 } },
                React.createElement(Select, { size: 'sm', value: local.provider, onChange: (e) => set('provider', e.target.value),
                  options: [
                    { value: 'gemini', label: 'Google Gemini' },
                    { value: 'openai', label: 'OpenAI' },
                  ] }))),

            local.provider === 'openai' && React.createElement('div', { className: 'db-set-row', style: { flexDirection: 'column', alignItems: 'flex-start', gap: 8 } },
              React.createElement('div', { style: { width: '100%' } },
                React.createElement(Select, { size: 'sm', label: 'Model', value: local.openaiModel, onChange: (e) => set('openaiModel', e.target.value), options: OPENAI_MODELS })),
              React.createElement(Input, { label: 'OpenAI API Key', type: 'password', placeholder: 'sk-...', value: local.openaiKey, onChange: (e) => set('openaiKey', e.target.value) }),
              React.createElement('span', { style: { fontSize: 11, color: 'var(--text-muted)' } }, '⚠ Stored in local IndexedDB — use on trusted devices only. Images are sent to OpenAI servers. PDFs not supported (use image formats).')),

            local.provider === 'gemini' && React.createElement('div', { className: 'db-set-row', style: { flexDirection: 'column', alignItems: 'flex-start', gap: 8 } },
              React.createElement('div', { style: { width: '100%' } },
                React.createElement(Select, { size: 'sm', label: 'Model', value: local.geminiModel, onChange: (e) => set('geminiModel', e.target.value), options: GEMINI_MODELS })),
              React.createElement(Input, { label: 'Gemini API Key', type: 'password', placeholder: 'AIza...', value: local.geminiKey, onChange: (e) => set('geminiKey', e.target.value) }),
              React.createElement('span', { style: { fontSize: 11, color: 'var(--text-muted)' } }, '⚠ Stored in local IndexedDB — use on trusted devices only. Images and PDFs are sent to Google servers. Free tier: 15 RPM / 1500 RPD.')),

            testResult && React.createElement('div', { style: { margin: '0 16px 4px', padding: '8px 12px', borderRadius: 6, fontSize: 12,
              background: testResult.ok ? 'var(--success-subtle, #f0fdf4)' : 'var(--danger-subtle, #fef2f2)',
              color: testResult.ok ? 'var(--success, #16a34a)' : 'var(--danger, #dc2626)', } },
              (testResult.ok ? '✓ ' : '✗ ') + testResult.message),

            React.createElement('div', { className: 'db-set-row' },
              React.createElement('div', { className: 'db-set-row__main' },
                React.createElement('b', null, 'Keep original OCR output'),
                React.createElement('span', null, 'extracted_json is never overwritten by edits')),
              React.createElement(StatusBadge, { status: 'approved' })),

            React.createElement('div', { style: { padding: '8px 16px 12px', display: 'flex', justifyContent: 'flex-end', gap: 8 } },
              React.createElement(Button, { size: 'sm', variant: 'secondary', disabled: testing, onClick: testConn }, testing ? 'Testing…' : 'Test connection'),
              React.createElement(Button, { size: 'sm', disabled: saving, onClick: saveSettings }, saving ? 'Saving…' : 'Save provider settings'))),

          React.createElement(Card, { title: 'Local storage', flush: true },
            React.createElement('div', { className: 'db-set-row' },
              React.createElement('div', { className: 'db-set-row__main' },
                React.createElement('b', null, 'IndexedDB'),
                React.createElement('span', null, store.documents.length + ' documents · ' + store.batches.length + ' batches')),
              React.createElement(Button, { variant: 'danger-soft', size: 'sm', iconLeft: React.createElement(Icons.Refresh, { w: 15 }), onClick: reset }, 'Clear all data')))),

        React.createElement(Card, { title: 'Validation rules', flush: true },
          rules.map((r, i) => React.createElement('div', { key: i, className: 'db-rule' },
            r[2] === 'error' ? React.createElement(Icons.Alert, { w: 14 }) : React.createElement(Icons.Eye, { w: 14 }),
            React.createElement('span', { style: { flex: 1 } }, r[0]),
            React.createElement('code', null, r[1]))))));
  }

  window.Screens2 = { BatchesList, BatchDetail, ReviewQueue, ApprovedDrafts, FailedDocuments, Settings };
})();
