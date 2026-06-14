/* DocuBridge AI — data core: document-type schemas, evidence layouts, a mock OCR
   engine, the business-validation rules, and seed sample documents.
   Pure logic, exported to window.DocCore. No React here. */
(function () {
  // ---------- small helpers ----------
  const uid = (p) => p + '_' + Math.random().toString(36).slice(2, 9);
  const now = () => Date.now();
  const money = (n) => (n == null || isNaN(n) ? '—' :
    Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
  const num = (v) => { const n = parseFloat(String(v).replace(/[^0-9.\-]/g, '')); return isNaN(n) ? 0 : n; };
  const hasNum = (v) => { const s = String(v == null ? '' : v).replace(/[^0-9.\-]/g, ''); return s.length > 0 && !isNaN(parseFloat(s)); };
  const confLevel = (s) => (s >= 0.9 ? 'high' : s >= 0.7 ? 'medium' : 'low');
  const avg = (arr) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0);
  const ago = (ts) => {
    const s = Math.floor((now() - ts) / 1000);
    if (s < 60) return 'just now';
    if (s < 3600) return Math.floor(s / 60) + ' min ago';
    if (s < 86400) return Math.floor(s / 3600) + ' h ago';
    return Math.floor(s / 86400) + ' d ago';
  };

  // ---------- document type registry ----------
  const TYPES = {
    purchase_order: { key: 'purchase_order', label: 'Purchase Order', prefix: 'PO', tax: 'GST 9%', hasPrices: true },
    invoice: { key: 'invoice', label: 'Invoice', prefix: 'INV', tax: 'Tax 9%', hasPrices: true },
    delivery_order: { key: 'delivery_order', label: 'Delivery Order', prefix: 'DO', tax: null, hasPrices: false },
    claim_form: { key: 'claim_form', label: 'Claim Form', prefix: 'CLM', tax: 'GST 9%', hasPrices: true },
    generic: { key: 'generic', label: 'Generic Document', prefix: 'DOC', tax: null, hasPrices: false },
  };
  const typeFromLabel = (lab) => Object.values(TYPES).find((t) => t.label === lab) || TYPES.generic;

  // ---------- evidence layouts (boxes are % of the paper) ----------
  // Each field: {key,label,group,page,box:{x,y,w,h}}. The facsimile prints the value
  // at the same coordinates, so the evidence highlight always wraps it exactly.
  const LAYOUTS = {
    purchase_order: {
      letterhead: { title: 'PURCHASE ORDER' },
      pages: [
        { no: 1, label: 'Header & parties', lines: false, totals: false },
        { no: 2, label: 'Line items & totals', lines: true, totals: true },
      ],
      fields: [
        { key: 'document_title', label: 'Subject', group: 'header', page: 1, box: { x: 6, y: 8, w: 50, h: 5 } },
        { key: 'document_no', label: 'PO No.', group: 'header', page: 1, box: { x: 58, y: 16, w: 35, h: 5 } },
        { key: 'transaction_date', label: 'Date', group: 'header', page: 1, box: { x: 58, y: 23, w: 35, h: 5 } },
        { key: 'credit_term', label: 'Credit Term', group: 'header', page: 1, box: { x: 58, y: 30, w: 35, h: 5 } },
        { key: 'bill_to', label: 'Bill To', group: 'parties', page: 1, box: { x: 6, y: 42, w: 42, h: 12 }, multiline: true },
        { key: 'ship_to', label: 'Ship To', group: 'parties', page: 1, box: { x: 52, y: 42, w: 42, h: 12 }, multiline: true },
        { key: 'line_items', label: 'Line items', group: 'table', page: 2, box: { x: 6, y: 12, w: 88, h: 42 }, table: true },
        { key: 'delivery_address', label: 'Delivery Address', group: 'meta', page: 2, box: { x: 6, y: 56, w: 50, h: 7 }, multiline: true },
        { key: 'subtotal', label: 'Subtotal', group: 'totals', page: 2, box: { x: 60, y: 60, w: 33, h: 5 } },
        { key: 'gst', label: 'GST', group: 'totals', page: 2, box: { x: 60, y: 67, w: 33, h: 5 } },
        { key: 'grand_total', label: 'Grand Total', group: 'totals', page: 2, box: { x: 60, y: 74, w: 33, h: 6 } },
        { key: 'terms_and_conditions', label: 'Terms & Conditions', group: 'footer', page: 2, box: { x: 6, y: 83, w: 88, h: 11 }, multiline: true },
      ],
    },
    invoice: {
      letterhead: { title: 'TAX INVOICE' },
      pages: [{ no: 1, label: 'Invoice', lines: true, totals: true }],
      fields: [
        { key: 'document_title', label: 'Subject', group: 'header', page: 1, box: { x: 6, y: 8, w: 50, h: 5 } },
        { key: 'document_no', label: 'Invoice No.', group: 'header', page: 1, box: { x: 58, y: 15, w: 35, h: 5 } },
        { key: 'transaction_date', label: 'Invoice Date', group: 'header', page: 1, box: { x: 58, y: 21, w: 35, h: 5 } },
        { key: 'payment_terms', label: 'Payment Terms', group: 'header', page: 1, box: { x: 58, y: 27, w: 35, h: 5 } },
        { key: 'supplier', label: 'Supplier', group: 'parties', page: 1, box: { x: 6, y: 34, w: 42, h: 11 }, multiline: true },
        { key: 'customer', label: 'Bill To', group: 'parties', page: 1, box: { x: 52, y: 34, w: 42, h: 11 }, multiline: true },
        { key: 'line_items', label: 'Line items', group: 'table', page: 1, box: { x: 6, y: 49, w: 88, h: 28 }, table: true },
        { key: 'subtotal', label: 'Subtotal', group: 'totals', page: 1, box: { x: 60, y: 80, w: 33, h: 4.5 } },
        { key: 'gst', label: 'Tax', group: 'totals', page: 1, box: { x: 60, y: 85, w: 33, h: 4.5 } },
        { key: 'grand_total', label: 'Grand Total', group: 'totals', page: 1, box: { x: 60, y: 90, w: 33, h: 5.5 } },
      ],
    },
    delivery_order: {
      letterhead: { title: 'DELIVERY ORDER' },
      pages: [{ no: 1, label: 'Delivery', lines: true, totals: false }],
      fields: [
        { key: 'document_title', label: 'Subject', group: 'header', page: 1, box: { x: 6, y: 8, w: 50, h: 5 } },
        { key: 'document_no', label: 'DO No.', group: 'header', page: 1, box: { x: 58, y: 15, w: 35, h: 5 } },
        { key: 'transaction_date', label: 'Date', group: 'header', page: 1, box: { x: 58, y: 21, w: 35, h: 5 } },
        { key: 'customer', label: 'Customer', group: 'parties', page: 1, box: { x: 6, y: 32, w: 42, h: 11 }, multiline: true },
        { key: 'ship_to', label: 'Deliver To', group: 'parties', page: 1, box: { x: 52, y: 32, w: 42, h: 11 }, multiline: true },
        { key: 'line_items', label: 'Line items', group: 'table', page: 1, box: { x: 6, y: 47, w: 88, h: 36 }, table: true },
      ],
    },
    generic: {
      letterhead: { title: 'DOCUMENT' },
      pages: [{ no: 1, label: 'Document', lines: false, totals: false }],
      fields: [
        { key: 'document_title', label: 'Subject', group: 'header', page: 1, box: { x: 6, y: 8, w: 50, h: 5 } },
        { key: 'document_no', label: 'Reference No.', group: 'header', page: 1, box: { x: 58, y: 15, w: 35, h: 5 } },
        { key: 'transaction_date', label: 'Date', group: 'header', page: 1, box: { x: 58, y: 21, w: 35, h: 5 } },
        { key: 'bill_to', label: 'From', group: 'parties', page: 1, box: { x: 6, y: 32, w: 42, h: 11 }, multiline: true },
        { key: 'ship_to', label: 'To', group: 'parties', page: 1, box: { x: 52, y: 32, w: 42, h: 11 }, multiline: true },
      ],
    },
    claim_form: {
      letterhead: { title: 'CLAIM FORM' },
      pages: [{ no: 1, label: 'Claim', lines: true, totals: true }],
      fields: [
        { key: 'document_title', label: 'Subject', group: 'header', page: 1, box: { x: 6, y: 8, w: 50, h: 5 } },
        { key: 'document_no', label: 'Claim No.', group: 'header', page: 1, box: { x: 58, y: 15, w: 35, h: 5 } },
        { key: 'transaction_date', label: 'Date', group: 'header', page: 1, box: { x: 58, y: 21, w: 35, h: 5 } },
        { key: 'credit_term', label: 'Reference No.', group: 'header', page: 1, box: { x: 58, y: 27, w: 35, h: 5 } },
        { key: 'bill_to', label: 'Claimant', group: 'parties', page: 1, box: { x: 6, y: 34, w: 42, h: 11 }, multiline: true },
        { key: 'ship_to', label: 'Claim To', group: 'parties', page: 1, box: { x: 52, y: 34, w: 42, h: 11 }, multiline: true },
        { key: 'line_items', label: 'Claim items', group: 'table', page: 1, box: { x: 6, y: 49, w: 88, h: 28 }, table: true },
        { key: 'subtotal', label: 'Subtotal', group: 'totals', page: 1, box: { x: 60, y: 80, w: 33, h: 4.5 } },
        { key: 'gst', label: 'GST', group: 'totals', page: 1, box: { x: 60, y: 85, w: 33, h: 4.5 } },
        { key: 'grand_total', label: 'Total Claim', group: 'totals', page: 1, box: { x: 60, y: 90, w: 33, h: 5.5 } },
      ],
    },
  };

  // ---------- validation engine ----------
  function validate(doc) {
    const f = fieldMap(doc);
    const issues = [];
    const add = (sev, title, rule, detail, field) => issues.push({ id: uid('v'), sev, title, rule, detail, field });

    const docNo = (f.document_no || '').trim();
    if (!docNo) add('error', 'Document number is missing', 'document_no must not be empty',
      'Every document needs an identifier before it can be approved.', 'document_no');

    const date = (f.transaction_date || '').trim();
    if (!date) add('error', 'Transaction date is missing', 'transaction_date is required',
      'Add the document date from the original.', 'transaction_date');
    else if (!/\d{4}-\d{2}-\d{2}|\d{1,2}\s\w{3}\s\d{4}/.test(date))
      add('warning', 'Date format looks unusual', 'transaction_date should be a valid date',
        '“' + date + '” may not parse cleanly downstream.', 'transaction_date');

    if (!doc.line_items || doc.line_items.length === 0)
      add('error', 'No line items found', 'at least one line item is required',
        'Extraction returned an empty table.', 'line_items');

    // per-row math (priced docs only)
    if (TYPES[doc.document_type].hasPrices) {
      (doc.line_items || []).forEach((li, i) => {
        if (!hasNum(li.quantity))
          add('warning', 'Quantity is not numeric', `row ${i + 1} quantity must be numeric`,
            `Row ${i + 1}: "${li.quantity}" is not a valid number.`, 'line_items');
        if (!hasNum(li.unit_price))
          add('warning', 'Unit price is not numeric', `row ${i + 1} unit_price must be numeric`,
            `Row ${i + 1}: "${li.unit_price}" is not a valid number.`, 'line_items');
        if (!hasNum(li.total_price))
          add('warning', 'Total price is not numeric', `row ${i + 1} total_price must be numeric`,
            `Row ${i + 1}: "${li.total_price}" is not a valid number.`, 'line_items');
        const calc = +(num(li.quantity) * num(li.unit_price)).toFixed(2);
        if (hasNum(li.quantity) && hasNum(li.unit_price) && hasNum(li.total_price) && Math.abs(calc - num(li.total_price)) > 0.01)
          add('warning', 'Line total does not match', 'quantity × unit_price = total_price',
            `Row ${i + 1}: ${num(li.quantity)} × ${money(li.unit_price)} = ${money(calc)}, not ${money(li.total_price)}.`, 'line_items');
        if (num(li.confidence) < 0.7)
          add('warning', 'Low-confidence line item', `row ${i + 1} confidence < 70%`,
            `${li.description || 'Row ' + (i + 1)} — verify quantity and unit price.`, 'line_items');
      });

      const t = doc.totals || {};
      if (!hasNum(f.subtotal))
        add('error', 'Subtotal is not numeric', 'subtotal must be numeric', 'Enter a valid number for subtotal.', 'subtotal');
      if (!hasNum(f.gst))
        add('error', 'GST is not numeric', 'gst must be numeric', 'Enter a valid number for GST.', 'gst');
      if (!hasNum(f.grand_total))
        add('error', 'Grand total is not numeric', 'grand_total must be numeric', 'Enter a valid number for grand total.', 'grand_total');
      else if (hasNum(f.subtotal) && hasNum(f.gst)) {
        const expected = +(num(t.subtotal) + num(t.gst)).toFixed(2);
        if (Math.abs(expected - num(t.grand)) > 0.01)
          add('error', 'Totals do not balance', 'subtotal + gst = grand_total',
            `${money(t.subtotal)} + ${money(t.gst)} = ${money(expected)}, not ${money(t.grand)}.`, 'grand_total');
      }
    }
    return issues;
  }

  function fieldMap(doc) {
    const m = {};
    (doc.fields || []).forEach((f) => { m[f.key] = f.value; });
    return m;
  }

  // Re-derive status from validation (never downgrade approved/submitted/rejected/failed).
  function deriveStatus(doc) {
    if (['approved', 'submitted', 'rejected', 'failed', 'processing', 'uploaded'].includes(doc.status)) return doc.status;
    const errs = (doc.validation_issues || []).filter((v) => v.sev === 'error').length;
    return errs > 0 ? 'need_review' : 'ready';
  }

  function docConfidence(doc) {
    const cs = (doc.fields || []).filter((f) => !f.table).map((f) => f.confidence);
    (doc.line_items || []).forEach((li) => cs.push(num(li.confidence)));
    return cs.length ? +avg(cs).toFixed(2) : 0;
  }

  // Build the reviewed_json payload from the working doc state.
  function toJSON(doc, kind) {
    const f = fieldMap(doc);
    const base = { document_type: doc.document_type, document_title: f.document_title || '', document_no: f.document_no || '', transaction_date: f.transaction_date || '' };
    if (doc.document_type === 'purchase_order') {
      Object.assign(base, {
        credit_term: f.credit_term || '',
        bill_to: splitParty(f.bill_to), ship_to: splitParty(f.ship_to),
        delivery_address: f.delivery_address || '',
        line_items: doc.line_items, totals: roundTotals(doc.totals),
        terms_and_conditions: f.terms_and_conditions || '',
      });
    } else if (doc.document_type === 'invoice') {
      Object.assign(base, {
        payment_terms: f.payment_terms || '',
        supplier: splitParty(f.supplier), customer: splitParty(f.customer),
        line_items: doc.line_items, totals: roundTotals(doc.totals),
      });
    } else if (doc.document_type === 'delivery_order') {
      Object.assign(base, {
        customer: splitParty(f.customer), deliver_to: splitParty(f.ship_to),
        line_items: (doc.line_items || []).map(({ unit_price, total_price, ...r }) => r),
      });
    } else if (doc.document_type === 'claim_form') {
      Object.assign(base, {
        credit_term: f.credit_term || '',
        claimant: splitParty(f.bill_to), claim_to: splitParty(f.ship_to),
        line_items: doc.line_items, totals: roundTotals(doc.totals),
      });
    } else {
      Object.assign(base, { from: splitParty(f.bill_to), to: splitParty(f.ship_to) });
    }
    if (kind === 'reviewed') base._review = { status: doc.status, approved_by: doc.approved_by || null, approved_at: doc.approved_at || null };
    return base;
  }
  const splitParty = (v) => { const [name, ...rest] = String(v || '').split('\n'); return { name: name || '', address: rest.join(', ') }; };
  const roundTotals = (t) => t ? { subtotal: num(t.subtotal), gst: num(t.gst), grand_total: num(t.grand) } : {};

  // ---------- sample document factory ----------
  function makeDoc(opts) {
    const t = TYPES[opts.type];
    const layout = LAYOUTS[opts.type];
    const fields = layout.fields.map((lf) => ({
      ...lf, value: opts.values[lf.key] != null ? opts.values[lf.key] : '',
      // AI-grounded box (from LLM) overrides the mock layout box when present
      box: (opts.boxes && opts.boxes[lf.key]) ? opts.boxes[lf.key] : lf.box,
      grounded: !!(opts.boxes && opts.boxes[lf.key]),
      confidence: opts.conf && opts.conf[lf.key] != null ? opts.conf[lf.key] : 0.92,
      editable: lf.key !== 'line_items', edited: false,
    }));
    const doc = {
      document_id: opts.id || uid('doc'),
      batch_id: opts.batch_id,
      file_name: opts.file,
      file_type: opts.file.split('.').pop().toLowerCase(),
      document_type: opts.type,
      document_no: opts.values.document_no || '—',
      page_count: layout.pages.length,
      is_sample: true,
      file_blob: null,
      letterhead: { ...layout.letterhead, company: opts.company, address: opts.address, subtitle: t.label },
      pages: layout.pages.map((p) => ({ ...p, conf: p.no === 1 ? 0.86 : 0.7 })),
      fields,
      line_items: t.hasPrices ? opts.lineItems : (opts.lineItems || []).map(({ unit_price, total_price, ...r }) => r),
      totals: t.hasPrices ? opts.totals : null,
      created_at: opts.created_at || now(),
      updated_at: opts.created_at || now(),
      approved_by: opts.approved_by || null,
      approved_at: opts.approved_at || null,
      status: opts.status || 'need_review',
      fail_reason: opts.fail_reason || null,
    };
    doc.extracted_json = toJSON(doc, 'extracted');
    doc.validation_issues = validate(doc);
    doc.confidence = opts.confidence != null ? opts.confidence : docConfidence(doc);
    if (doc.status === 'need_review' || doc.status === 'ready') doc.status = deriveStatus(doc);
    // pages confidence from fields
    doc.pages.forEach((p) => {
      const fc = doc.fields.filter((f) => f.page === p.no && !f.table).map((f) => f.confidence);
      if (fc.length) p.conf = +avg(fc).toFixed(2);
    });
    return doc;
  }

  // ---------- mock OCR for user-uploaded files ----------
  const VENDORS = [
    { c: 'Nordic Components AB', a: '14 Industrivägen, Malmö' },
    { c: 'Orient Trading Co', a: '5 Kallang Way, Singapore' },
    { c: 'Pacific Hardware Ltd', a: '88 Jurong East St 21' },
    { c: 'Summit Logistics', a: '3 Changi North Cres' },
  ];
  const PARTS = [
    ['STK-4471', 'M8 Hex Bolt, Zinc', 0.42, 'pcs'], ['STK-4490', 'M8 Hex Nut, Zinc', 0.18, 'pcs'],
    ['STK-7732', 'Flat Washer 8mm', 0.06, 'pcs'], ['STK-1180', 'Threadlock 50ml', 7.5, 'btl'],
    ['STK-2210', 'Steel Bracket L-90', 1.85, 'pcs'], ['STK-9004', 'Cable Tie 200mm', 0.03, 'pcs'],
    ['STK-5521', 'Safety Gloves L', 2.4, 'pr'], ['STK-3340', 'Masking Tape 24mm', 1.1, 'roll'],
  ];
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  function mockOCR(file, type, batchId, seq) {
    const t = TYPES[type];
    // ~8% of uploads "fail" to demonstrate the failed-docs flow
    if (Math.random() < 0.08) {
      return makeDoc({ type, batch_id: batchId, file, company: '', address: '', values: {}, lineItems: [], totals: null,
        status: 'failed', fail_reason: pick(['Unsupported encoding — page could not be rasterised', 'Image too low resolution for OCR', 'Password-protected PDF']) });
    }
    const v = pick(VENDORS);
    const nItems = rnd(2, 4);
    const items = [];
    for (let i = 0; i < nItems; i++) {
      const [code, desc, price, uom] = pick(PARTS);
      const qty = rnd(10, 800);
      const conf = Math.random() < 0.25 ? +(0.5 + Math.random() * 0.18).toFixed(2) : +(0.82 + Math.random() * 0.17).toFixed(2);
      // occasionally a wrong line total to trigger validation
      const glitch = Math.random() < 0.18;
      const total = +(qty * price * (glitch ? 1.1 : 1)).toFixed(2);
      items.push({ serial_no: String(i + 1), stock_code: code, description: desc, remark: '', quantity: qty, uom, unit_price: price, total_price: total, confidence: conf });
    }
    const subtotal = +items.reduce((s, li) => s + li.quantity * li.unit_price, 0).toFixed(2);
    const gst = +(subtotal * 0.09).toFixed(2);
    // occasionally a wrong grand total
    const grand = Math.random() < 0.25 ? +(subtotal + gst + rnd(50, 400)).toFixed(2) : +(subtotal + gst).toFixed(2);
    const docNo = t.prefix + '-2024-' + (4600 + seq);
    const lowField = () => +(0.55 + Math.random() * 0.4).toFixed(2);
    const values = {
      document_no: docNo, transaction_date: '2024-06-' + String(rnd(1, 28)).padStart(2, '0'),
      credit_term: pick(['30 days', '45 days', 'COD', '60 days']), payment_terms: pick(['Net 30', 'Net 45', 'Net 14']),
      bill_to: 'Acme Manufacturing Pte Ltd\nAccounts Dept, 12 Tuas Ave 3', supplier: v.c + '\n' + v.a,
      ship_to: 'Acme Warehouse\n12 Tuas Avenue 3, Singapore', customer: 'Acme Manufacturing Pte Ltd\n12 Tuas Ave 3',
      subtotal: money(subtotal), gst: money(gst), grand_total: money(grand),
    };
    const conf = {};
    LAYOUTS[type].fields.forEach((f) => { conf[f.key] = lowField(); });
    const doc = makeDoc({ type, batch_id: batchId, file, company: v.c, address: v.a, values, conf,
      lineItems: items, totals: { subtotal, gst, grand }, status: 'need_review' });
    doc.is_sample = false;
    return doc;
  }

  // ---------- seed data (first run) ----------
  function seed() {
    const batches = [];
    const docs = [];
    const t0 = now();

    // Batch 1 — June Purchase Orders (the hero batch, mixed statuses)
    const b1 = { batch_id: 'b_june_po', batch_name: 'June Purchase Orders', document_type: 'purchase_order',
      status: 'need_review', total_files: 6, owner: 'Aishah Tan', created_at: t0 - 4 * 60000, updated_at: t0 - 4 * 60000 };
    batches.push(b1);

    // hero PO — totals intentionally wrong to trigger validation
    docs.push(makeDoc({
      id: 'doc_hero', batch_id: b1.batch_id, type: 'purchase_order', file: 'po_acme_0512.pdf',
      company: 'ACME MANUFACTURING PTE LTD', address: '12 Tuas Avenue 3 · Singapore 639271',
      values: {
        document_title: 'Hardware Procurement — June 2024',
        document_no: 'PO-2024-0512', transaction_date: '2024-06-12', credit_term: '30 days',
        bill_to: 'Acme Manufacturing Pte Ltd\nAccounts Dept, 12 Tuas Ave 3',
        ship_to: 'Acme Warehouse\n12 Tuas Avenue 3, Singapore',
        delivery_address: '12 Tuas Avenue 3, Singapore 639271\nWarehouse Gate B',
        subtotal: '444.00', gst: '31.08', grand_total: '1,284.00',
        terms_and_conditions: 'Payment due within 30 days of invoice date. Goods received subject to quality inspection. Returns accepted within 14 days with prior written approval.',
      },
      conf: { document_no: 0.96, transaction_date: 0.82, credit_term: 0.74, bill_to: 0.9, ship_to: 0.69, subtotal: 0.9, gst: 0.88, grand_total: 0.61 },
      lineItems: [
        { serial_no: '1', stock_code: 'STK-4471', description: 'M8 Hex Bolt, Zinc', remark: '', quantity: 500, uom: 'pcs', unit_price: 0.42, total_price: 210.0, confidence: 0.93 },
        { serial_no: '2', stock_code: 'STK-4490', description: 'M8 Hex Nut, Zinc', remark: '', quantity: 500, uom: 'pcs', unit_price: 0.18, total_price: 90.0, confidence: 0.9 },
        { serial_no: '3', stock_code: 'STK-7732', description: 'Flat Washer 8mm', remark: '', quantity: 1000, uom: 'pcs', unit_price: 0.06, total_price: 60.0, confidence: 0.55 },
        { serial_no: '4', stock_code: 'STK-1180', description: 'Threadlock 50ml', remark: '', quantity: 12, uom: 'btl', unit_price: 7.5, total_price: 84.0, confidence: 0.61 },
      ],
      totals: { subtotal: 444.0, gst: 31.08, grand: 1284.0 }, confidence: 0.62, status: 'need_review', created_at: t0 - 4 * 60000,
    }));

    // a clean, ready PO
    docs.push(makeDoc({
      id: 'doc_clean', batch_id: b1.batch_id, type: 'purchase_order', file: 'po_acme_0513.pdf',
      company: 'ACME MANUFACTURING PTE LTD', address: '12 Tuas Avenue 3 · Singapore 639271',
      values: {
        document_no: 'PO-2024-0513', transaction_date: '2024-06-12', credit_term: '30 days',
        bill_to: 'Acme Manufacturing Pte Ltd\nAccounts Dept, 12 Tuas Ave 3',
        ship_to: 'Acme Warehouse\n12 Tuas Avenue 3, Singapore', subtotal: '370.00', gst: '33.30', grand_total: '403.30',
      },
      conf: { document_no: 0.97, transaction_date: 0.95, credit_term: 0.93, bill_to: 0.96, ship_to: 0.94, subtotal: 0.95, gst: 0.94, grand_total: 0.96 },
      lineItems: [{ serial_no: '1', stock_code: 'STK-2210', description: 'Steel Bracket L-90', remark: '', quantity: 200, uom: 'pcs', unit_price: 1.85, total_price: 370.0, confidence: 0.95 }],
      totals: { subtotal: 370.0, gst: 33.3, grand: 403.3 }, confidence: 0.94, status: 'ready', created_at: t0 - 6 * 60000,
    }));

    // a couple more need-review POs (lighter)
    [['PO-2024-0514', 'po_nordic_0514.pdf', 'Nordic Components AB', 0.88],
     ['PO-2024-0515', 'po_acme_0515.jpg', 'Pacific Hardware Ltd', 0.71]].forEach(([no, file, co, cf], i) => {
      const items = [{ serial_no: '1', stock_code: 'STK-9004', description: 'Cable Tie 200mm', remark: '', quantity: 5000, uom: 'pcs', unit_price: 0.03, total_price: 150.0, confidence: cf },
        { serial_no: '2', stock_code: 'STK-3340', description: 'Masking Tape 24mm', remark: '', quantity: 80, uom: 'roll', unit_price: 1.1, total_price: 88.0, confidence: cf + 0.05 }];
      const sub = 238.0, gst = +(sub * 0.09).toFixed(2);
      docs.push(makeDoc({ batch_id: b1.batch_id, type: 'purchase_order', file, company: co, address: '—',
        values: { document_no: no, transaction_date: '2024-06-1' + (i + 3), credit_term: '45 days',
          bill_to: 'Acme Manufacturing Pte Ltd\n12 Tuas Ave 3', ship_to: 'Acme Warehouse\n12 Tuas Ave 3',
          subtotal: money(sub), gst: money(gst), grand_total: money(sub + gst) },
        conf: { document_no: cf, transaction_date: cf, credit_term: cf - 0.1, bill_to: cf, ship_to: cf - 0.05, subtotal: cf, gst: cf, grand_total: cf },
        lineItems: items, totals: { subtotal: sub, gst, grand: +(sub + gst).toFixed(2) }, confidence: cf, status: 'need_review', created_at: t0 - (8 + i) * 60000 }));
    });

    // a failed scan
    docs.push(makeDoc({ batch_id: b1.batch_id, type: 'purchase_order', file: 'scan_0516.jpg', company: '', address: '',
      values: {}, conf: {}, lineItems: [], totals: null, status: 'failed', confidence: 0,
      fail_reason: 'Image too low resolution for OCR — text could not be located', created_at: t0 - 12 * 60000 }));

    // Batch 2 — Invoices
    const b2 = { batch_id: 'b_invoices', batch_name: 'Q2 Supplier Invoices', document_type: 'invoice',
      status: 'need_review', total_files: 2, owner: 'Marcus Lee', created_at: t0 - 30 * 60000, updated_at: t0 - 12 * 60000 };
    batches.push(b2);
    docs.push(makeDoc({
      id: 'doc_inv', batch_id: b2.batch_id, type: 'invoice', file: 'inv_nordic_8841.pdf',
      company: 'NORDIC COMPONENTS AB', address: '14 Industrivägen · Malmö, Sweden',
      values: { document_no: 'INV-8841', transaction_date: '2024-06-09', payment_terms: 'Net 30',
        supplier: 'Nordic Components AB\n14 Industrivägen, Malmö', customer: 'Acme Manufacturing Pte Ltd\n12 Tuas Ave 3',
        subtotal: '1,110.00', gst: '99.90', grand_total: '1,209.90' },
      conf: { document_no: 0.93, transaction_date: 0.88, payment_terms: 0.8, supplier: 0.91, customer: 0.86, subtotal: 0.9, gst: 0.9, grand_total: 0.9 },
      lineItems: [{ serial_no: '1', stock_code: 'STK-2210', description: 'Steel Bracket L-90', remark: '', quantity: 600, uom: 'pcs', unit_price: 1.85, total_price: 1110.0, confidence: 0.9 }],
      totals: { subtotal: 1110.0, gst: 99.9, grand: 1209.9 }, confidence: 0.89, status: 'need_review', created_at: t0 - 12 * 60000,
    }));
    docs.push(makeDoc({ batch_id: b2.batch_id, type: 'invoice', file: 'inv_orient_8842.pdf', company: 'ORIENT TRADING CO', address: '5 Kallang Way',
      values: { document_no: 'INV-8842', transaction_date: '2024-06-10', payment_terms: 'Net 45',
        supplier: 'Orient Trading Co\n5 Kallang Way', customer: 'Acme Manufacturing Pte Ltd\n12 Tuas Ave 3',
        subtotal: '540.00', gst: '48.60', grand_total: '588.60' },
      conf: { document_no: 0.96, transaction_date: 0.94, payment_terms: 0.92, supplier: 0.95, customer: 0.93, subtotal: 0.96, gst: 0.95, grand_total: 0.96 },
      lineItems: [{ serial_no: '1', stock_code: 'STK-5521', description: 'Safety Gloves L', remark: '', quantity: 225, uom: 'pr', unit_price: 2.4, total_price: 540.0, confidence: 0.95 }],
      totals: { subtotal: 540.0, gst: 48.6, grand: 588.6 }, confidence: 0.95, status: 'ready', created_at: t0 - 20 * 60000 }));

    // Batch 3 — Delivery Orders (already approved)
    const b3 = { batch_id: 'b_do', batch_name: 'Warehouse Delivery Orders', document_type: 'delivery_order',
      status: 'approved', total_files: 2, owner: 'Siti Wong', created_at: t0 - 200 * 60000, updated_at: t0 - 120 * 60000 };
    batches.push(b3);
    docs.push(makeDoc({
      id: 'doc_do', batch_id: b3.batch_id, type: 'delivery_order', file: 'do_summit_2207.pdf',
      company: 'SUMMIT LOGISTICS', address: '3 Changi North Crescent',
      values: { document_no: 'DO-2207', transaction_date: '2024-06-08',
        customer: 'Acme Manufacturing Pte Ltd\n12 Tuas Ave 3', ship_to: 'Acme Warehouse\nGate 4, 12 Tuas Ave 3' },
      conf: { document_no: 0.95, transaction_date: 0.93, customer: 0.94, ship_to: 0.92 },
      lineItems: [{ serial_no: '1', stock_code: 'STK-2210', description: 'Steel Bracket L-90', remark: 'Pallet A1', quantity: 600, uom: 'pcs', confidence: 0.95 },
        { serial_no: '2', stock_code: 'STK-5521', description: 'Safety Gloves L', remark: 'Pallet A2', quantity: 225, uom: 'pr', confidence: 0.93 }],
      status: 'approved', approved_by: 'Siti Wong', approved_at: t0 - 120 * 60000, confidence: 0.94, created_at: t0 - 200 * 60000,
    }));
    docs.push(makeDoc({ batch_id: b3.batch_id, type: 'delivery_order', file: 'do_summit_2208.pdf', company: 'SUMMIT LOGISTICS', address: '3 Changi North Crescent',
      values: { document_no: 'DO-2208', transaction_date: '2024-06-08', customer: 'Acme Manufacturing Pte Ltd\n12 Tuas Ave 3', ship_to: 'Acme Warehouse\nGate 4' },
      conf: { document_no: 0.97, transaction_date: 0.96, customer: 0.95, ship_to: 0.94 },
      lineItems: [{ serial_no: '1', stock_code: 'STK-9004', description: 'Cable Tie 200mm', remark: 'Box 1', quantity: 5000, uom: 'pcs', confidence: 0.96 }],
      status: 'submitted', approved_by: 'Siti Wong', approved_at: t0 - 130 * 60000, confidence: 0.96, created_at: t0 - 205 * 60000 }));

    return { batches, documents: docs };
  }

  window.DocCore = {
    TYPES, LAYOUTS, typeFromLabel, uid, now, money, num, hasNum, confLevel, ago, avg,
    validate, deriveStatus, docConfidence, fieldMap, toJSON, makeDoc, mockOCR, seed,
  };
})();
