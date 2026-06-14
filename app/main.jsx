/* DocuBridge AI — router + boot. */
(function () {
  const { Icons, UI } = window;
  const { StoreProvider, useStore } = window.AppStore;
  const h = React.createElement;

  const NAV_OF = { dashboard: 'dashboard', upload: 'upload', batches: 'batches', batch: 'batches',
    queue: 'queue', review: 'queue', approved: 'approved', failed: 'failed', settings: 'settings' };
  const LS_KEY = 'docubridge_route';

  function Loading() {
    return h('div', { style: { height: '100%', display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center', justifyContent: 'center', background: 'var(--surface-app)' } },
      h('img', { src: 'assets/logomark.svg', width: 44, height: 44, alt: '' }),
      h('div', { style: { fontSize: 13, color: 'var(--text-muted)', fontFamily: 'var(--font-sans)' } }, 'Opening local workspace…'));
  }

  function screenFor(route, go) {
    const S1 = window.Screens1, S2 = window.Screens2, WB = window.Workbench;
    const p = { go, params: route.params || {} };
    switch (route.name) {
      case 'upload': return h(S1.UploadBatch, p);
      case 'batches': return h(S2.BatchesList, p);
      case 'batch': return h(S2.BatchDetail, p);
      case 'queue': return h(S2.ReviewQueue, p);
      case 'review': return h(WB.ReviewWorkbench, p);
      case 'approved': return h(S2.ApprovedDrafts, p);
      case 'failed': return h(S2.FailedDocuments, p);
      case 'settings': return h(S2.Settings, p);
      default: return h(S1.Dashboard, p);
    }
  }

  function App() {
    const store = useStore();
    const [route, setRoute] = React.useState(() => {
      try { const r = JSON.parse(localStorage.getItem('docubridge_route')); if (r && r.name) return r; } catch (e) {}
      return { name: 'dashboard', params: {} };
    });
    const contentScroll = React.useRef(null);
    const go = React.useCallback((name, params = {}) => {
      const r = { name, params }; setRoute(r);
      try { localStorage.setItem('docubridge_route', JSON.stringify(r)); } catch (e) {}
    }, []);
    React.useEffect(() => {
      const el = document.querySelector('.dbk-content'); if (el) el.scrollTop = 0;
    }, [route]);

    if (!store.ready) return h(Loading);

    const counts = {
      review: store.documents.filter((d) => d.status === 'need_review').length || null,
      failed: store.documents.filter((d) => d.status === 'failed').length || null,
    };
    const bytes = store.documents.reduce((s, d) => s + (d.file_blob ? d.file_blob.size : 184000), 0);
    const MAX_BYTES = 500 * 1048576; // 500 MB soft cap for display purposes
    const storage = { docs: store.documents.length, mb: (bytes / 1048576).toFixed(1), pct: Math.min(96, Math.round(bytes / MAX_BYTES * 100)) };
    const active = NAV_OF[route.name] || 'dashboard';

    return h(React.Fragment, null,
      h(UI.AppShell, { active, go, counts, storage, documents: store.documents, batches: store.batches }, screenFor(route, go)),
      h(UI.Toast, { toast: store.toast }));
  }

  function boot() {
    const ready = window.React && window.ReactDOM && window.DocCore && window.AppStore && window.UI &&
      window.Screens1 && window.Screens2 && window.Workbench && window.Icons &&
      window.DocuBridgeAIDesignSystem_30d086 && window.Agrun && window.DocAgent;
    if (!ready) return setTimeout(boot, 50);
    ReactDOM.createRoot(document.getElementById('root')).render(
      h(window.AppStore.StoreProvider, null, h(UI.ConfirmProvider, null, h(App)))
    );
  }
  boot();
})();
