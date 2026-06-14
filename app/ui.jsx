/* DocuBridge AI — app chrome + shared UI. window.UI */
(function () {
  const { Icons } = window;
  const C = window.DocCore;

  // ---------------- Toast ----------------
  function Toast({ toast }) {
    if (!toast) return null;
    const map = { success: ['Check', 'var(--green-600)'], error: ['Alert', 'var(--red-600)'], info: ['Database', 'var(--brand)'], warning: ['Alert', 'var(--amber-600)'] };
    const [ico, col] = map[toast.kind] || map.info;
    const Ico = Icons[ico];
    return React.createElement('div', { className: 'db-toast', key: toast.id },
      React.createElement('span', { className: 'db-toast__ico', style: { color: col } }, React.createElement(Ico, { w: 17 })),
      React.createElement('span', null, toast.msg));
  }

  // ---------------- Confirm dialog ----------------
  const ConfirmCtx = React.createContext(() => Promise.resolve(false));
  function ConfirmProvider({ children }) {
    const [state, setState] = React.useState(null);
    const resolver = React.useRef(null);
    const confirm = React.useCallback((opts) => new Promise((res) => { resolver.current = res; setState(opts); }), []);
    const close = (val) => { setState(null); resolver.current && resolver.current(val); };
    return React.createElement(ConfirmCtx.Provider, { value: confirm },
      children,
      state && React.createElement('div', { className: 'db-modal-scrim', onClick: () => close(false) },
        React.createElement('div', { className: 'db-modal', onClick: (e) => e.stopPropagation() },
          React.createElement('div', { className: 'db-modal__title' }, state.title),
          React.createElement('div', { className: 'db-modal__body' }, state.body),
          React.createElement('div', { className: 'db-modal__foot' },
            React.createElement('button', { className: 'db-btn db-btn--secondary db-btn--md', onClick: () => close(false) }, state.cancelLabel || 'Cancel'),
            React.createElement('button', { className: 'db-btn db-btn--' + (state.danger ? 'danger' : 'primary') + ' db-btn--md', onClick: () => close(true) }, state.confirmLabel || 'Confirm')))));
  }
  function useConfirm() { return React.useContext(ConfirmCtx); }

  // ---------------- JSON viewer ----------------
  function highlight(obj) {
    let s = JSON.stringify(obj, null, 2);
    s = s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
    s = s.replace(/("(\\.|[^"\\])*")(\s*:)?|\b(true|false|null)\b|(-?\d+(\.\d+)?)/g,
      (m, str, _c, colon, kw, n2) => {
        if (str) return colon ? '<span class="jk">' + str + '</span>' + colon : '<span class="js">' + str + '</span>';
        if (kw) return '<span class="jb">' + kw + '</span>';
        if (n2) return '<span class="jn">' + m + '</span>';
        return m;
      });
    return s;
  }
  function JsonView({ obj, className }) {
    return React.createElement('pre', { className: 'dbk-json ' + (className || '') },
      React.createElement('code', { dangerouslySetInnerHTML: { __html: highlight(obj) } }));
  }

  // ---------------- file ext chip ----------------
  function FileExt({ name }) {
    const ext = (name.split('.').pop() || '').toUpperCase();
    return React.createElement('div', { className: 'dbk-fileext dbk-fileext--' + (ext === 'PDF' ? 'pdf' : 'img') }, ext);
  }

  // ---------------- Sidebar ----------------
  const NAV = [
    { id: 'dashboard', label: 'Dashboard', icon: 'Dashboard' },
    { id: 'upload', label: 'Upload', icon: 'Upload' },
    { id: 'batches', label: 'Batches', icon: 'Batches' },
    { id: 'queue', label: 'Review Queue', icon: 'Queue', badgeKey: 'review' },
    { id: 'approved', label: 'Approved Drafts', icon: 'Approved' },
    { id: 'failed', label: 'Failed Documents', icon: 'Failed', badgeKey: 'failed', danger: true },
  ];
  function Sidebar({ active, go, counts, storage }) {
    return React.createElement('aside', { className: 'dbk-sidebar' },
      React.createElement('div', { className: 'dbk-brand' },
        React.createElement('img', { src: 'assets/logomark.svg', alt: '', width: 30, height: 30 }),
        React.createElement('span', { className: 'dbk-brand__name' }, 'DocuBridge', React.createElement('span', null, ' AI'))),
      React.createElement('nav', { className: 'dbk-nav' },
        NAV.map((n) => {
          const Ico = Icons[n.icon];
          const badge = n.badgeKey ? counts[n.badgeKey] : null;
          return React.createElement('button', { key: n.id, className: 'dbk-navitem' + (active === n.id ? ' is-active' : ''), onClick: () => go(n.id) },
            React.createElement(Ico, { w: 18 }), React.createElement('span', null, n.label),
            badge ? React.createElement('span', { className: 'dbk-navbadge' + (n.danger ? ' is-danger' : '') }, badge) : null);
        }),
        React.createElement('div', { className: 'dbk-nav__sep' }),
        React.createElement('button', { className: 'dbk-navitem' + (active === 'settings' ? ' is-active' : ''), onClick: () => go('settings') },
          React.createElement(Icons.Settings, { w: 18 }), React.createElement('span', null, 'Settings'))),
      React.createElement('div', { className: 'dbk-storage' },
        React.createElement('div', { className: 'dbk-storage__row' }, React.createElement(Icons.Database, { w: 15 }), React.createElement('span', null, 'Local IndexedDB')),
        React.createElement('div', { className: 'dbk-storage__bar' }, React.createElement('i', { style: { width: storage.pct + '%' } })),
        React.createElement('div', { className: 'dbk-storage__meta' }, storage.docs + ' docs · ' + storage.mb + ' MB stored')));
  }

  // ---------------- TopBar with working global search ----------------
  function TopBar({ go, documents, batches }) {
    const [q, setQ] = React.useState('');
    const [open, setOpen] = React.useState(false);
    const boxRef = React.useRef(null);
    React.useEffect(() => {
      const h = (e) => { if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false); };
      document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h);
    }, []);
    const ql = q.trim().toLowerCase();
    const docHits = ql ? documents.filter((d) => (d.document_no || '').toLowerCase().includes(ql) || (d.file_name || '').toLowerCase().includes(ql)).slice(0, 6) : [];
    const batchHits = ql ? batches.filter((b) => b.batch_name.toLowerCase().includes(ql)).slice(0, 3) : [];
    const choose = (fn) => { setOpen(false); setQ(''); fn(); };
    return React.createElement('header', { className: 'dbk-topbar' },
      React.createElement('div', { className: 'dbk-search', ref: boxRef, style: { position: 'relative' } },
        React.createElement(Icons.Search, { w: 16 }),
        React.createElement('input', { placeholder: 'Search document no, file name, or batch…', value: q,
          onChange: (e) => { setQ(e.target.value); setOpen(true); }, onFocus: () => setOpen(true) }),
        React.createElement('kbd', null, '/'),
        open && ql && React.createElement('div', { className: 'db-search-pop' },
          docHits.length === 0 && batchHits.length === 0 && React.createElement('div', { className: 'db-search-empty' }, 'No matches'),
          batchHits.map((b) => React.createElement('button', { key: b.batch_id, className: 'db-search-row', onClick: () => choose(() => go('batch', { batchId: b.batch_id })) },
            React.createElement(Icons.Batches, { w: 15 }), React.createElement('span', { className: 'db-search-row__main' }, b.batch_name), React.createElement('span', { className: 'db-search-row__tag' }, 'Batch'))),
          docHits.map((d) => React.createElement('button', { key: d.document_id, className: 'db-search-row', onClick: () => choose(() => go('review', { docId: d.document_id })) },
            React.createElement(Icons.FileText, { w: 15 }), React.createElement('span', { className: 'db-search-row__main dbk-mono' }, d.document_no || d.file_name), React.createElement('span', { className: 'db-search-row__tag' }, C.TYPES[d.document_type].label))))),
      React.createElement('div', { className: 'dbk-topbar__right' },
        React.createElement('span', { className: 'dbk-mode' }, React.createElement('span', { className: 'dbk-mode__dot' }), 'Local Mode'),
        React.createElement('button', { className: 'dbk-iconbtn', 'aria-label': 'Notifications', title: 'No notifications', disabled: true, style: { opacity: 0.5, cursor: 'default' } }, React.createElement(Icons.Bell, { w: 18 })),
        React.createElement('div', { className: 'dbk-user', style: { cursor: 'default' } },
          React.createElement('div', { className: 'dbk-avatar' }, 'AT'),
          React.createElement('div', { className: 'dbk-user__meta' }, React.createElement('b', null, 'Aishah Tan'), React.createElement('span', null, 'Finance · Reviewer')))));
  }

  function AppShell({ active, go, counts, storage, documents, batches, children }) {
    return React.createElement('div', { className: 'dbk-app' },
      React.createElement(Sidebar, { active, go, counts, storage }),
      React.createElement('div', { className: 'dbk-main' },
        React.createElement(TopBar, { go, documents, batches }),
        React.createElement('div', { className: 'dbk-content' }, children)));
  }

  window.UI = { Toast, ConfirmProvider, useConfirm, JsonView, FileExt, AppShell };
})();
