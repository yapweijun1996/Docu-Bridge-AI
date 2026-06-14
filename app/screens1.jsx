/* DocuBridge AI — Dashboard + Upload screens. window.Screens1 */
(function () {
  const DS = window.DocuBridgeAIDesignSystem_30d086;
  const { StatCard, Card, StatusBadge, ConfidenceBadge, Button, Input, Select } = DS;
  const { Icons, UI } = window;
  const C = window.DocCore;
  const { useStore } = window.AppStore;

  const fmtSize = (b) => (b < 1024 ? b + ' B' : b < 1048576 ? (b / 1024).toFixed(0) + ' KB' : (b / 1048576).toFixed(1) + ' MB');

  // ============================ Dashboard ============================
  function Dashboard({ go }) {
    const { documents, batches } = useStore();
    const by = (s) => documents.filter((d) => d.status === s).length;
    const stats = {
      total: documents.length,
      review: by('need_review'),
      ready: by('ready'),
      approved: by('approved') + by('submitted'),
      failed: by('failed'),
    };
    const reviewQueue = documents.filter((d) => d.status === 'need_review')
      .sort((a, b) => (b.validation_issues.filter((v) => v.sev === 'error').length) - (a.validation_issues.filter((v) => v.sev === 'error').length)).slice(0, 6);

    return React.createElement('div', { className: 'dbk-page' },
      React.createElement('div', { className: 'dbk-pagehead' },
        React.createElement('div', null,
          React.createElement('h1', null, 'Dashboard'),
          React.createElement('p', null, 'Processing overview across all batches · ' + documents.length + ' documents in local storage')),
        React.createElement('div', { style: { display: 'flex', gap: 8 } },
          React.createElement(Button, { variant: 'primary', iconLeft: React.createElement(Icons.Upload, { w: 16 }), onClick: () => go('upload') }, 'Upload batch'))),

      React.createElement('div', { className: 'dbk-grid-stats' },
        React.createElement(StatCard, { label: 'Total Documents', value: stats.total.toLocaleString(), tone: 'brand', icon: React.createElement(Icons.File, { w: 17 }), foot: 'across ' + batches.length + ' batches' }),
        React.createElement(StatCard, { label: 'Need Review', value: stats.review, tone: 'warning', icon: React.createElement(Icons.Eye, { w: 17 }), foot: 'awaiting a reviewer', interactive: true, onClick: () => go('queue') }),
        React.createElement(StatCard, { label: 'Ready to Submit', value: stats.ready, tone: 'info', icon: React.createElement(Icons.Check, { w: 17 }), foot: 'validation passed', interactive: true, onClick: () => go('queue') }),
        React.createElement(StatCard, { label: 'Approved', value: stats.approved, tone: 'success', icon: React.createElement(Icons.Approved, { w: 17 }), foot: 'reviewed & signed off', interactive: true, onClick: () => go('approved') }),
        React.createElement(StatCard, { label: 'Failed', value: stats.failed, tone: 'danger', icon: React.createElement(Icons.Alert, { w: 17 }), foot: 'needs reprocess', interactive: true, onClick: () => go('failed') })),

      React.createElement('div', { className: 'dbk-dash-cols' },
        React.createElement(Card, { title: 'Recent batches', actions: React.createElement(Button, { variant: 'ghost', size: 'sm', onClick: () => go('batches') }, 'View all'), flush: true },
          React.createElement('div', { className: 'dbk-batchlist' },
            batches.length === 0 ? React.createElement('div', { className: 'db-quiet' }, 'No batches yet.') :
              batches.slice(0, 5).map((b) => {
                const mine = documents.filter((d) => d.batch_id === b.batch_id);
                const done = mine.filter((d) => ['approved', 'submitted'].includes(d.status)).length;
                const pct = mine.length ? Math.round((done / mine.length) * 100) : 0;
                return React.createElement('div', { key: b.batch_id, className: 'dbk-batchrow', onClick: () => go('batch', { batchId: b.batch_id }) },
                  React.createElement('div', { className: 'dbk-batchrow__icon' }, React.createElement(Icons.Batches, { w: 18 })),
                  React.createElement('div', { className: 'dbk-batchrow__main' },
                    React.createElement('div', { className: 'dbk-batchrow__title' }, b.batch_name),
                    React.createElement('div', { className: 'dbk-batchrow__sub' }, C.TYPES[b.document_type].label + ' · ' + mine.length + ' files · ' + b.owner + ' · ' + C.ago(b.updated_at))),
                  React.createElement('div', { className: 'dbk-batchrow__prog' },
                    React.createElement('div', { className: 'dbk-progbar' }, React.createElement('i', { style: { width: pct + '%' } })),
                    React.createElement('span', null, pct + '% done')),
                  React.createElement(StatusBadge, { status: b.status }),
                  React.createElement(Icons.Chevron, { w: 16 }));
              }))),

        React.createElement(Card, { title: 'Review priority', flush: true },
          React.createElement('div', { className: 'dbk-priolist' },
            reviewQueue.length === 0 ? React.createElement('div', { className: 'db-quiet' }, 'Nothing waiting — inbox zero.') :
              reviewQueue.map((d) => {
                const errs = d.validation_issues.filter((v) => v.sev === 'error').length;
                return React.createElement('div', { key: d.document_id, className: 'dbk-prio', onClick: () => go('review', { docId: d.document_id }) },
                  React.createElement(Icons.FileText, { w: 16 }),
                  React.createElement('span', { className: 'dbk-mono dbk-strong' }, d.document_no || d.file_name),
                  React.createElement(ConfidenceBadge, { score: d.confidence, plain: true }),
                  errs > 0 && React.createElement('span', { className: 'dbk-issuechip' }, React.createElement(Icons.Alert, { w: 12 }), errs),
                  React.createElement(Icons.Chevron, { w: 15 }));
              })))));
  }

  // ============================ Upload ============================
  function UploadBatch({ go }) {
    const store = useStore();
    const [name, setName] = React.useState('June Purchase Orders ' + new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }));
    const [type, setType] = React.useState('Purchase Order');
    const [drag, setDrag] = React.useState(false);
    const [queue, setQueue] = React.useState([]);
    const [busy, setBusy] = React.useState(false);
    const inputRef = React.useRef(null);

    const OK = ['pdf', 'png', 'jpg', 'jpeg'];
    const addFiles = (fileList) => {
      const items = Array.from(fileList).map((f) => {
        const ext = (f.name.split('.').pop() || '').toLowerCase();
        return { id: C.uid('f'), name: f.name, size: f.size, blob: f, ok: OK.includes(ext) };
      });
      setQueue((q) => [...q, ...items].slice(0, 100));
    };
    const remove = (id) => setQueue((q) => q.filter((f) => f.id !== id));

    const valid = queue.filter((f) => f.ok);
    const totalBytes = queue.reduce((s, f) => s + f.size, 0);

    const start = async () => {
      if (!valid.length || busy) return;
      setBusy(true);
      const batch = await store.commitBatch({ name, typeLabel: type }, valid.map((f) => ({ name: f.name, blob: f.blob })));
      go('batch', { batchId: batch.batch_id });
    };

    return React.createElement('div', { className: 'dbk-page dbk-page--narrow' },
      React.createElement('div', { className: 'dbk-pagehead' },
        React.createElement('div', null,
          React.createElement('h1', null, 'Upload batch'),
          React.createElement('p', null, 'Drop PDFs or photos. OCR runs after you start processing — originals stay in your local IndexedDB.'))),

      React.createElement('div', { className: 'dbk-upload-grid' },
        React.createElement('div', { className: 'dbk-upload-left' },
          React.createElement(Card, { pad: true },
            React.createElement('div', { className: 'dbk-form2' },
              React.createElement(Input, { label: 'Batch name', placeholder: 'e.g. June Purchase Orders', value: name, onChange: (e) => setName(e.target.value), required: true }),
              React.createElement(Select, { label: 'Document type', value: type, onChange: (e) => setType(e.target.value),
                options: ['Purchase Order', 'Invoice', 'Delivery Order', 'Claim Form', 'Generic Document'] }))),

          React.createElement('div', {
            className: 'dbk-dropzone' + (drag ? ' is-drag' : ''),
            onDragOver: (e) => { e.preventDefault(); setDrag(true); },
            onDragLeave: () => setDrag(false),
            onDrop: (e) => { e.preventDefault(); setDrag(false); if (e.dataTransfer.files) addFiles(e.dataTransfer.files); },
            onClick: () => inputRef.current && inputRef.current.click(),
            style: { cursor: 'pointer' },
          },
            React.createElement('input', { ref: inputRef, type: 'file', multiple: true, accept: '.pdf,.png,.jpg,.jpeg', style: { display: 'none' },
              onChange: (e) => { addFiles(e.target.files); e.target.value = ''; } }),
            React.createElement('div', { className: 'dbk-dropzone__icon' }, React.createElement(Icons.Upload, { w: 26 })),
            React.createElement('div', { className: 'dbk-dropzone__title' }, 'Drag & drop files here'),
            React.createElement('div', { className: 'dbk-dropzone__sub' }, 'or click to browse · PDF, PNG, JPG, JPEG · up to 100 files'),
            React.createElement(Button, { variant: 'secondary', size: 'sm', iconLeft: React.createElement(Icons.Plus, { w: 15 }) }, 'Choose files'))),

        React.createElement(Card, { title: 'File queue', actions: React.createElement('span', { className: 'dbk-queuecount' }, queue.length + ' files · ' + fmtSize(totalBytes)), flush: true },
          queue.length === 0
            ? React.createElement('div', { className: 'db-quiet' }, 'No files yet. Add files to build a batch.')
            : React.createElement('div', { className: 'dbk-queue' },
              queue.map((f) => React.createElement('div', { key: f.id, className: 'dbk-filerow' },
                React.createElement(UI.FileExt, { name: f.name }),
                React.createElement('div', { className: 'dbk-filerow__main' },
                  React.createElement('div', { className: 'dbk-filerow__name' }, f.name),
                  React.createElement('div', { className: 'dbk-filerow__sub' }, fmtSize(f.size), !f.ok && React.createElement('span', { style: { color: 'var(--red-600)' } }, ' · unsupported type'))),
                f.ok ? React.createElement('span', { className: 'dbk-filestate dbk-filestate--ok' }, React.createElement(Icons.Check, { w: 13 }), 'Ready')
                  : React.createElement('span', { className: 'dbk-filestate dbk-filestate--err' }, React.createElement(Icons.Alert, { w: 13 }), 'Error'),
                React.createElement('button', { className: 'dbk-iconbtn', 'aria-label': 'Remove', onClick: () => remove(f.id) }, React.createElement(Icons.X, { w: 16 }))))),
          React.createElement('div', { className: 'dbk-queue-foot' },
            React.createElement('div', { className: 'dbk-queue-foot__meta' },
              React.createElement(StatusBadge, { status: 'uploaded' }), valid.length + ' ready' + (queue.length - valid.length ? ' · ' + (queue.length - valid.length) + ' error' : '')),
            React.createElement(Button, { iconLeft: React.createElement(Icons.Layers, { w: 16 }), disabled: !valid.length || busy, onClick: start },
              busy ? 'Starting…' : 'Start OCR · ' + valid.length + ' file' + (valid.length === 1 ? '' : 's'))))));
  }

  window.Screens1 = { Dashboard, UploadBatch };
})();
