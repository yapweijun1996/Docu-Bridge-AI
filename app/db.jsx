/* DocuBridge AI — local persistence (IndexedDB) + React store.
   Exposes window.AppStore = { StoreProvider, useStore }. */
(function () {
  const DB_NAME = 'docubridge_ai';
  const DB_VERSION = 2;
  const C = window.DocCore;

  // ---------- tiny IndexedDB promise wrapper ----------
  function openDB() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains('batches')) db.createObjectStore('batches', { keyPath: 'batch_id' });
        if (!db.objectStoreNames.contains('documents')) {
          const s = db.createObjectStore('documents', { keyPath: 'document_id' });
          s.createIndex('batch_id', 'batch_id', { unique: false });
        }
        if (!db.objectStoreNames.contains('meta')) db.createObjectStore('meta', { keyPath: 'key' });
        if (!db.objectStoreNames.contains('ocr_results')) db.createObjectStore('ocr_results', { keyPath: 'document_id' });
        if (!db.objectStoreNames.contains('reviewed_results')) db.createObjectStore('reviewed_results', { keyPath: 'document_id' });
        if (!db.objectStoreNames.contains('validation_issues')) db.createObjectStore('validation_issues', { keyPath: 'document_id' });
        if (!db.objectStoreNames.contains('review_actions')) {
          const ra = db.createObjectStore('review_actions', { keyPath: 'action_id' });
          ra.createIndex('document_id', 'document_id', { unique: false });
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }
  function tx(db, store, mode) { return db.transaction(store, mode).objectStore(store); }
  function getAll(db, store) {
    return new Promise((res, rej) => { const r = tx(db, store, 'readonly').getAll(); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); });
  }
  function put(db, store, val) {
    return new Promise((res, rej) => { const r = tx(db, store, 'readwrite').put(val); r.onsuccess = () => res(val); r.onerror = () => rej(r.error); });
  }
  function del(db, store, key) {
    return new Promise((res, rej) => { const r = tx(db, store, 'readwrite').delete(key); r.onsuccess = () => res(); r.onerror = () => rej(r.error); });
  }
  function getMeta(db, key) {
    return new Promise((res) => { const r = tx(db, 'meta', 'readonly').get(key); r.onsuccess = () => res(r.result ? r.result.value : undefined); r.onerror = () => res(undefined); });
  }

  // strip non-serialisable / large fields are fine; Blobs persist in IDB.
  const clone = (o) => { const { _objUrl, ...rest } = o; return rest; };

  // ---------- finalize a working doc (recompute validation/status/conf) ----------
  function finalize(doc) {
    doc.validation_issues = C.validate(doc);
    doc.confidence = C.docConfidence(doc);
    doc.status = C.deriveStatus(doc);
    doc.updated_at = C.now();
    doc.pages.forEach((p) => {
      const fc = doc.fields.filter((f) => f.page === p.no && !f.table).map((f) => f.confidence);
      if (fc.length) p.conf = +C.avg(fc).toFixed(2);
    });
    return doc;
  }

  const DEFAULT_SETTINGS = { provider: 'mock', openaiKey: '', geminiKey: '', openaiModel: 'gpt-5.4-mini', geminiModel: 'gemini-3.5-flash' };

  const StoreCtx = React.createContext(null);

  function StoreProvider({ children }) {
    const [db, setDb] = React.useState(null);
    const [batches, setBatches] = React.useState([]);
    const [documents, setDocuments] = React.useState([]);
    const [settings, setSettings] = React.useState(DEFAULT_SETTINGS);
    const [ready, setReady] = React.useState(false);
    const [toast, setToast] = React.useState(null);
    const toastTimer = React.useRef(null);

    const notify = React.useCallback((msg, kind = 'info') => {
      clearTimeout(toastTimer.current);
      setToast({ msg, kind, id: Math.random() });
      toastTimer.current = setTimeout(() => setToast(null), 3200);
    }, []);

    // boot: open db, seed on first run, load all
    React.useEffect(() => {
      let alive = true;
      (async () => {
        const d = await openDB();
        const seeded = await getMeta(d, 'seeded');
        if (!seeded) {
          const s = C.seed();
          for (const b of s.batches) await put(d, 'batches', b);
          for (const doc of s.documents) await put(d, 'documents', clone(doc));
          await put(d, 'meta', { key: 'seeded', value: true });
        }
        const [bs, ds, savedSettings] = [await getAll(d, 'batches'), await getAll(d, 'documents'), await getMeta(d, 'llm_settings')];
        if (!alive) return;
        setDb(d);
        setBatches(bs.sort((a, b) => b.created_at - a.created_at));
        setDocuments(ds.sort((a, b) => b.created_at - a.created_at));
        if (savedSettings) setSettings({ ...DEFAULT_SETTINGS, ...savedSettings });
        setReady(true);
      })();
      return () => { alive = false; };
    }, []);

    const persistDoc = React.useCallback(async (doc) => {
      if (db) await put(db, 'documents', clone(doc));
    }, [db]);
    const persistBatch = React.useCallback(async (b) => { if (db) await put(db, 'batches', b); }, [db]);

    // recompute a batch's rollup status from its docs
    const refreshBatch = React.useCallback((batchId, docs) => {
      setBatches((prev) => prev.map((b) => {
        if (b.batch_id !== batchId) return b;
        const mine = docs.filter((d) => d.batch_id === batchId);
        const has = (s) => mine.some((d) => d.status === s);
        let status = 'approved';
        if (has('processing')) status = 'processing';
        else if (has('need_review')) status = 'need_review';
        else if (has('ready')) status = 'ready';
        else if (mine.every((d) => ['approved', 'submitted'].includes(d.status))) status = 'approved';
        const nb = { ...b, status, total_files: mine.length, updated_at: C.now() };
        persistBatch(nb);
        return nb;
      }));
    }, [persistBatch]);

    // ---------- actions ----------
    const actions = React.useMemo(() => ({
      notify,

      // Create a batch from uploaded files; run mock OCR (with a processing delay).
      async commitBatch(meta, files) {
        const t = C.typeFromLabel(meta.typeLabel);
        const batch = { batch_id: C.uid('b'), batch_name: meta.name || 'Untitled batch', document_type: t.key,
          status: 'processing', total_files: files.length, owner: 'Aishah Tan', created_at: C.now(), updated_at: C.now() };
        await persistBatch(batch);
        setBatches((p) => [batch, ...p]);

        // create placeholder docs in 'processing' (mock OCR for immediate UI feedback)
        const docs = files.map((f, i) => {
          const d = C.mockOCR(f.name, t.key, batch.batch_id, i + 1);
          d.file_blob = f.blob || null;
          d.status = 'processing';
          d.created_at = C.now() + i;
          return d;
        });
        for (const d of docs) await persistDoc(d);
        setDocuments((p) => [...docs, ...p]);

        // resolve OCR — use real LLM if configured, then update placeholders
        const currentSettings = settings;
        setTimeout(async () => {
          const resolved = await Promise.all(docs.map(async (d, i) => {
            const f = files[i];
            if (currentSettings.provider !== 'mock' && f.blob) {
              try {
                const extracted = await window.DocAgent.runDocumentAgent(f, t.key, batch.batch_id, i + 1, currentSettings, null);
                extracted.document_id = d.document_id;
                extracted.file_blob = d.file_blob;
                extracted.created_at = d.created_at;
                extracted.is_sample = false;
                if (extracted.fail_reason) { extracted.status = 'failed'; return extracted; }
                extracted.status = C.deriveStatus({ ...extracted, status: 'need_review' });
                return extracted;
              } catch (err) {
                d.status = 'failed';
                d.fail_reason = 'LLM extraction failed: ' + err.message;
                return d;
              }
            }
            if (d.fail_reason) { d.status = 'failed'; return d; }
            d.status = C.deriveStatus({ ...d, status: 'need_review' });
            return d;
          }));
          for (const d of resolved) await persistDoc(d);
          setDocuments((prev) => {
            const next = prev.map((p) => resolved.find((r) => r.document_id === p.document_id) || p);
            refreshBatch(batch.batch_id, next);
            return next;
          });
          const fallbackCount = resolved.filter((d) => d.ocr_provider && d.ocr_provider.includes('fallback')).length;
          const okCount = resolved.filter((d) => !d.fail_reason).length;
          notify(
            fallbackCount
              ? 'OCR done — ' + okCount + '/' + resolved.length + ' extracted · ⚠ ' + fallbackCount + ' fell back to mock (LLM failed)'
              : 'OCR complete — ' + okCount + ' of ' + resolved.length + ' documents extracted',
            fallbackCount ? 'warning' : 'success'
          );
        }, currentSettings.provider !== 'mock' ? 800 : 2200);

        return batch;
      },

      // Persist edits to a single doc (workbench save).
      async saveDoc(doc) {
        const final = finalize({ ...doc });
        await persistDoc(final);
        if (db) {
          await put(db, 'reviewed_results', { document_id: final.document_id, reviewed_json: C.toJSON(final, 'reviewed'), updated_at: C.now() });
          await put(db, 'validation_issues', { document_id: final.document_id, issues: final.validation_issues, updated_at: C.now() });
          await put(db, 'review_actions', { action_id: C.uid('act'), document_id: final.document_id, action_type: 'save', user: 'Aishah Tan', timestamp: C.now(), details: {} });
        }
        setDocuments((prev) => {
          const next = prev.map((p) => (p.document_id === final.document_id ? final : p));
          refreshBatch(final.batch_id, next);
          return next;
        });
        return final;
      },

      async approveDoc(doc) {
        const final = finalize({ ...doc });
        final.status = 'approved'; final.approved_by = 'Aishah Tan'; final.approved_at = C.now();
        await persistDoc(final);
        if (db) {
          await put(db, 'reviewed_results', { document_id: final.document_id, reviewed_json: C.toJSON(final, 'reviewed'), updated_at: final.approved_at });
          await put(db, 'review_actions', { action_id: C.uid('act'), document_id: final.document_id, action_type: 'approve', user: final.approved_by, timestamp: final.approved_at, details: {} });
        }
        setDocuments((prev) => { const next = prev.map((p) => (p.document_id === final.document_id ? final : p)); refreshBatch(final.batch_id, next); return next; });
        notify('Document approved — original OCR preserved', 'success');
        return final;
      },

      async rejectDoc(doc, reason) {
        const final = { ...doc, status: 'rejected', fail_reason: reason || 'Rejected by reviewer', updated_at: C.now() };
        await persistDoc(final);
        if (db) {
          await put(db, 'review_actions', { action_id: C.uid('act'), document_id: final.document_id, action_type: 'reject', user: 'Aishah Tan', timestamp: final.updated_at, details: { reason: final.fail_reason } });
        }
        setDocuments((prev) => { const next = prev.map((p) => (p.document_id === final.document_id ? final : p)); refreshBatch(final.batch_id, next); return next; });
        notify('Document rejected', 'info');
        return final;
      },

      async submitDoc(doc) {
        const final = { ...doc, status: 'submitted', updated_at: C.now() };
        await persistDoc(final);
        setDocuments((prev) => { const next = prev.map((p) => (p.document_id === final.document_id ? final : p)); refreshBatch(final.batch_id, next); return next; });
        return final;
      },

      async reprocessDoc(doc) {
        let fresh;
        if (settings.provider !== 'mock' && doc.file_blob) {
          try {
            fresh = await window.LLMProviders.ocrExtractWithFallback(
              { name: doc.file_name, blob: doc.file_blob }, doc.document_type, doc.batch_id, 99, settings
            );
          } catch (err) {
            fresh = C.mockOCR(doc.file_name, doc.document_type, doc.batch_id, 99);
          }
        } else {
          fresh = C.mockOCR(doc.file_name, doc.document_type, doc.batch_id, 99);
        }
        fresh.document_id = doc.document_id; fresh.file_blob = doc.file_blob; fresh.created_at = doc.created_at;
        fresh.is_sample = doc.is_sample;
        await persistDoc(fresh);
        setDocuments((prev) => { const next = prev.map((p) => (p.document_id === fresh.document_id ? fresh : p)); refreshBatch(fresh.batch_id, next); return next; });
        notify(fresh.fail_reason ? 'Reprocess failed again — check the source file' : 'Reprocessed — ready for review', fresh.fail_reason ? 'error' : 'success');
        return fresh;
      },

      async saveSettings(s) {
        const next = { ...DEFAULT_SETTINGS, ...s };
        if (db) await put(db, 'meta', { key: 'llm_settings', value: next });
        setSettings(next);
      },

      async deleteDoc(docId) {
        const doc = documents.find((d) => d.document_id === docId);
        if (db) await del(db, 'documents', docId);
        setDocuments((prev) => { const next = prev.filter((p) => p.document_id !== docId); if (doc) refreshBatch(doc.batch_id, next); return next; });
        notify('Document removed from batch', 'info');
      },

      async resetDemo() {
        if (!db) return;
        for (const b of batches) await del(db, 'batches', b.batch_id);
        for (const d of documents) await del(db, 'documents', d.document_id);
        await put(db, 'meta', { key: 'seeded', value: false });
        const s = C.seed();
        for (const b of s.batches) await put(db, 'batches', b);
        for (const doc of s.documents) await put(db, 'documents', clone(doc));
        await put(db, 'meta', { key: 'seeded', value: true });
        setBatches(s.batches.sort((a, b) => b.created_at - a.created_at));
        setDocuments(s.documents.sort((a, b) => b.created_at - a.created_at));
        notify('Demo data reset', 'success');
      },
    }), [db, documents, batches, settings, notify, persistDoc, persistBatch, refreshBatch]);

    const value = { ready, batches, documents, settings, toast, ...actions };
    return React.createElement(StoreCtx.Provider, { value }, children);
  }

  function useStore() { return React.useContext(StoreCtx); }

  window.AppStore = { StoreProvider, useStore };
})();
