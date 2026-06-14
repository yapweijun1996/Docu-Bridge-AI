/* @ds-bundle: {"format":3,"namespace":"DocuBridgeAIDesignSystem_30d086","components":[{"name":"ExtractedField","sourcePath":"components/data/ExtractedField.jsx"},{"name":"StatCard","sourcePath":"components/data/StatCard.jsx"},{"name":"ConfidenceBadge","sourcePath":"components/feedback/ConfidenceBadge.jsx"},{"name":"EmptyState","sourcePath":"components/feedback/EmptyState.jsx"},{"name":"StatusBadge","sourcePath":"components/feedback/StatusBadge.jsx"},{"name":"ValidationMessage","sourcePath":"components/feedback/ValidationMessage.jsx"},{"name":"Button","sourcePath":"components/forms/Button.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"IconButton","sourcePath":"components/forms/IconButton.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Card","sourcePath":"components/layout/Card.jsx"},{"name":"PageHeader","sourcePath":"components/layout/PageHeader.jsx"}],"sourceHashes":{"components/data/ExtractedField.jsx":"27cdaca82704","components/data/StatCard.jsx":"1caef613ce59","components/feedback/ConfidenceBadge.jsx":"8aac601d08c2","components/feedback/EmptyState.jsx":"6e21ca92072e","components/feedback/StatusBadge.jsx":"2baa6a96e750","components/feedback/ValidationMessage.jsx":"bcebc1257d70","components/forms/Button.jsx":"b648dfb6b7f2","components/forms/Checkbox.jsx":"901b8db5dd10","components/forms/IconButton.jsx":"1b5a1268fe92","components/forms/Input.jsx":"4842f6e992e7","components/forms/Select.jsx":"1fdcce4c3c37","components/layout/Card.jsx":"b35fa5547381","components/layout/PageHeader.jsx":"d73765dff0b1","ui_kits/docubridge/AppShell.jsx":"6df3c3c11ad1","ui_kits/docubridge/ApprovedDrafts.jsx":"44e50cdd94de","ui_kits/docubridge/BatchDetail.jsx":"4f6e6bc1ec50","ui_kits/docubridge/Dashboard.jsx":"95dad5741847","ui_kits/docubridge/ReviewWorkbench.jsx":"d9cbabb1bd7a","ui_kits/docubridge/UploadBatch.jsx":"3cc993cc3421","ui_kits/docubridge/data.jsx":"9815b94e1ff8","ui_kits/docubridge/icons.jsx":"9c1a9e56281f"},"inlinedExternals":[],"unexposedExports":[{"name":"levelFromScore","sourcePath":"components/feedback/ConfidenceBadge.jsx"}]} */

(() => {

const __ds_ns = (window.DocuBridgeAIDesignSystem_30d086 = window.DocuBridgeAIDesignSystem_30d086 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/data/StatCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const TONES = {
  neutral: 'var(--slate-500)',
  brand: 'var(--brand)',
  warning: 'var(--amber-500)',
  success: 'var(--green-500)',
  danger: 'var(--red-500)',
  info: 'var(--cyan-500)'
};
let injected = false;
function inject() {
  if (injected || typeof document === 'undefined') return;
  injected = true;
  const s = document.createElement('style');
  s.textContent = `
  .db-stat{position:relative;background:var(--surface-card);border:var(--border-hairline) solid var(--border-subtle);
    border-radius:var(--radius-lg);box-shadow:var(--shadow-sm);padding:var(--space-4) var(--space-5);
    display:flex;flex-direction:column;gap:var(--space-2);overflow:hidden;}
  .db-stat--interactive{cursor:pointer;transition:box-shadow var(--dur-base) var(--ease-standard),border-color var(--dur-base) var(--ease-standard);}
  .db-stat--interactive:hover{box-shadow:var(--shadow-md);border-color:var(--border-default);}
  .db-stat__accent{position:absolute;left:0;top:0;bottom:0;width:3px;}
  .db-stat__top{display:flex;align-items:center;justify-content:space-between;gap:var(--space-2);}
  .db-stat__label{font-size:var(--text-xs);font-weight:var(--fw-semibold);color:var(--text-muted);
    letter-spacing:var(--tracking-wide);}
  .db-stat__icon{width:30px;height:30px;border-radius:var(--radius-md);display:flex;align-items:center;justify-content:center;}
  .db-stat__icon svg{width:17px;height:17px;display:block;}
  .db-stat__value{font-size:var(--text-3xl);font-weight:var(--fw-bold);color:var(--text-strong);
    line-height:1;font-variant-numeric:tabular-nums;letter-spacing:var(--tracking-tight);}
  .db-stat__foot{font-size:var(--text-xs);color:var(--text-subtle);}
  `;
  document.head.appendChild(s);
}

/**
 * StatCard — dashboard summary tile (Total Documents, Need Review, Approved…).
 */
function StatCard({
  label,
  value,
  tone = 'neutral',
  icon,
  foot,
  interactive = false,
  className = '',
  ...rest
}) {
  inject();
  const color = TONES[tone] || TONES.neutral;
  return /*#__PURE__*/React.createElement("div", _extends({
    className: ['db-stat', interactive ? 'db-stat--interactive' : '', className].filter(Boolean).join(' ')
  }, rest), /*#__PURE__*/React.createElement("span", {
    className: "db-stat__accent",
    style: {
      background: color
    },
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("div", {
    className: "db-stat__top"
  }, /*#__PURE__*/React.createElement("span", {
    className: "db-stat__label"
  }, label), icon && /*#__PURE__*/React.createElement("span", {
    className: "db-stat__icon",
    style: {
      background: `color-mix(in srgb, ${color} 12%, transparent)`,
      color
    },
    "aria-hidden": "true"
  }, icon)), /*#__PURE__*/React.createElement("div", {
    className: "db-stat__value"
  }, value), foot && /*#__PURE__*/React.createElement("div", {
    className: "db-stat__foot"
  }, foot));
}
Object.assign(__ds_scope, { StatCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/StatCard.jsx", error: String((e && e.message) || e) }); }

// components/feedback/ConfidenceBadge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* level → [bg, fg, icon-bars, label] */
const LEVELS = {
  high: ['var(--green-50)', 'var(--green-700)', 3, 'High'],
  medium: ['var(--amber-50)', 'var(--amber-700)', 2, 'Medium'],
  low: ['var(--red-50)', 'var(--red-700)', 1, 'Low']
};
function levelFromScore(score) {
  const pct = score <= 1 ? score * 100 : score;
  if (pct >= 90) return 'high';
  if (pct >= 70) return 'medium';
  return 'low';
}
let injected = false;
function inject() {
  if (injected || typeof document === 'undefined') return;
  injected = true;
  const s = document.createElement('style');
  s.textContent = `
  .db-conf{display:inline-flex;align-items:center;gap:6px;height:22px;padding:0 var(--space-2);
    border-radius:var(--radius-sm);font-family:var(--font-mono);font-size:var(--text-2xs);
    font-weight:var(--fw-semibold);white-space:nowrap;line-height:1;font-feature-settings:"zero" 1;}
  .db-conf__bars{display:inline-flex;align-items:flex-end;gap:1.5px;height:11px;}
  .db-conf__bars i{width:3px;border-radius:1px;background:currentColor;opacity:.25;}
  .db-conf__bars i:nth-child(1){height:5px;}
  .db-conf__bars i:nth-child(2){height:8px;}
  .db-conf__bars i:nth-child(3){height:11px;}
  .db-conf__bars i.on{opacity:1;}
  .db-conf__label{letter-spacing:var(--tracking-wide);}
  .db-conf--plain{background:transparent;padding:0;}
  `;
  document.head.appendChild(s);
}

/**
 * ConfidenceBadge — extraction confidence (High ≥90 / Medium 70–89 / Low <70).
 * Shows signal bars + label + optional percent. Never color alone.
 */
function ConfidenceBadge({
  level,
  score,
  showLabel = true,
  showPercent = false,
  plain = false,
  className = '',
  ...rest
}) {
  inject();
  // No real confidence to show → render nothing (don't default to a misleading "High").
  if (level == null && score == null) return null;
  const lvl = level || (score != null ? levelFromScore(score) : 'high');
  const [bg, fg, bars, label] = LEVELS[lvl];
  const pct = score != null ? Math.round(score <= 1 ? score * 100 : score) : null;
  return /*#__PURE__*/React.createElement("span", _extends({
    className: ['db-conf', plain ? 'db-conf--plain' : '', className].filter(Boolean).join(' '),
    style: {
      background: plain ? 'transparent' : bg,
      color: fg
    },
    title: `${label} confidence${pct != null ? ` — ${pct}%` : ''}`
  }, rest), /*#__PURE__*/React.createElement("span", {
    className: "db-conf__bars",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("i", {
    className: bars >= 1 ? 'on' : ''
  }), /*#__PURE__*/React.createElement("i", {
    className: bars >= 2 ? 'on' : ''
  }), /*#__PURE__*/React.createElement("i", {
    className: bars >= 3 ? 'on' : ''
  })), showLabel && /*#__PURE__*/React.createElement("span", {
    className: "db-conf__label"
  }, label), showPercent && pct != null && /*#__PURE__*/React.createElement("span", null, pct, "%"));
}
Object.assign(__ds_scope, { levelFromScore, ConfidenceBadge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/ConfidenceBadge.jsx", error: String((e && e.message) || e) }); }

// components/data/ExtractedField.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
let injected = false;
function inject() {
  if (injected || typeof document === 'undefined') return;
  injected = true;
  const s = document.createElement('style');
  s.textContent = `
  .db-xfield{display:flex;flex-direction:column;gap:5px;padding:var(--space-2) var(--space-3);
    border-radius:var(--radius-md);border:var(--border-hairline) solid transparent;
    transition:background var(--dur-fast) var(--ease-standard),border-color var(--dur-fast) var(--ease-standard);}
  .db-xfield--clickable{cursor:pointer;}
  .db-xfield--clickable:hover{background:var(--surface-hover);border-color:var(--border-subtle);}
  .db-xfield--active{background:var(--surface-selected);border-color:var(--blue-200);}
  .db-xfield--error{background:var(--red-50);border-color:var(--red-100);}
  .db-xfield__top{display:flex;align-items:center;justify-content:space-between;gap:var(--space-2);}
  .db-xfield__label{font-size:var(--text-xs);font-weight:var(--fw-semibold);color:var(--text-muted);
    letter-spacing:var(--tracking-wide);display:flex;align-items:center;gap:6px;}
  .db-xfield__src{display:inline-flex;align-items:center;gap:3px;font-size:var(--text-2xs);font-weight:var(--fw-medium);
    color:var(--text-link);font-family:var(--font-mono);}
  .db-xfield__src svg{width:11px;height:11px;}
  .db-xfield__value{font-family:var(--font-mono);font-size:var(--text-md);color:var(--text-strong);
    font-feature-settings:"zero" 1;min-height:20px;word-break:break-word;}
  .db-xfield__value--empty{color:var(--text-subtle);font-style:italic;}
  .db-xfield__input{font-family:var(--font-mono);font-size:var(--text-md);color:var(--text-strong);
    width:100%;border:var(--border-hairline) solid var(--border-default);border-radius:var(--radius-sm);
    padding:5px var(--space-2);background:var(--surface-card);outline:none;}
  .db-xfield__input:focus{border-color:var(--border-focus);box-shadow:var(--ring-focus);}
  .db-xfield__err{font-size:var(--text-2xs);color:var(--red-600);font-weight:var(--fw-medium);}
  .db-xfield__edited{font-size:var(--text-2xs);color:var(--amber-600);font-weight:var(--fw-semibold);letter-spacing:var(--tracking-wide);}
  `;
  document.head.appendChild(s);
}
const PinIcon = /*#__PURE__*/React.createElement("svg", {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, /*#__PURE__*/React.createElement("path", {
  d: "M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"
}), /*#__PURE__*/React.createElement("circle", {
  cx: "12",
  cy: "10",
  r: "3"
}));

/**
 * ExtractedField — evidence-first review field: label, value, confidence,
 * source page link, validation. The heart of the review workbench.
 */
function ExtractedField({
  label,
  value,
  confidence,
  pageNo,
  active = false,
  editable = true,
  edited = false,
  error,
  onSelect,
  onChange,
  className = '',
  ...rest
}) {
  inject();
  const [editing, setEditing] = React.useState(false);
  const empty = value == null || value === '';
  const cls = ['db-xfield', onSelect ? 'db-xfield--clickable' : '', active ? 'db-xfield--active' : '', error ? 'db-xfield--error' : '', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("div", _extends({
    className: cls,
    onClick: onSelect
  }, rest), /*#__PURE__*/React.createElement("div", {
    className: "db-xfield__top"
  }, /*#__PURE__*/React.createElement("span", {
    className: "db-xfield__label"
  }, label, edited && /*#__PURE__*/React.createElement("span", {
    className: "db-xfield__edited"
  }, "\xB7 edited")), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-2)'
    }
  }, confidence != null && /*#__PURE__*/React.createElement(__ds_scope.ConfidenceBadge, {
    score: typeof confidence === 'number' ? confidence : undefined,
    level: typeof confidence === 'string' ? confidence : undefined,
    plain: true,
    showPercent: typeof confidence === 'number'
  }), pageNo != null && /*#__PURE__*/React.createElement("span", {
    className: "db-xfield__src"
  }, PinIcon, "p.", pageNo))), editing && editable ? /*#__PURE__*/React.createElement("input", {
    className: "db-xfield__input",
    autoFocus: true,
    defaultValue: value,
    onClick: e => e.stopPropagation(),
    onBlur: e => {
      setEditing(false);
      onChange && onChange(e.target.value);
    },
    onKeyDown: e => {
      if (e.key === 'Enter') e.currentTarget.blur();
      if (e.key === 'Escape') setEditing(false);
    }
  }) : /*#__PURE__*/React.createElement("div", {
    className: ['db-xfield__value', empty ? 'db-xfield__value--empty' : ''].filter(Boolean).join(' '),
    onClick: e => {
      if (editable) {
        e.stopPropagation();
        setEditing(true);
      }
    }
  }, empty ? '— empty —' : value), error && /*#__PURE__*/React.createElement("span", {
    className: "db-xfield__err"
  }, error));
}
Object.assign(__ds_scope, { ExtractedField });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/ExtractedField.jsx", error: String((e && e.message) || e) }); }

// components/feedback/EmptyState.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
let injected = false;
function inject() {
  if (injected || typeof document === 'undefined') return;
  injected = true;
  const s = document.createElement('style');
  s.textContent = `
  .db-empty{display:flex;flex-direction:column;align-items:center;text-align:center;
    padding:var(--space-8) var(--space-6);gap:var(--space-2);}
  .db-empty__icon{width:48px;height:48px;border-radius:var(--radius-lg);display:flex;align-items:center;justify-content:center;
    background:var(--surface-sunken);border:var(--border-hairline) solid var(--border-subtle);color:var(--text-subtle);margin-bottom:var(--space-2);}
  .db-empty__icon svg{width:24px;height:24px;display:block;}
  .db-empty__title{font-size:var(--text-lg);font-weight:var(--fw-semibold);color:var(--text-strong);}
  .db-empty__desc{font-size:var(--text-sm);color:var(--text-muted);max-width:42ch;line-height:var(--leading-snug);}
  .db-empty__actions{display:flex;gap:var(--space-2);margin-top:var(--space-3);}
  `;
  document.head.appendChild(s);
}

/**
 * EmptyState — zero-data placeholder for lists, queues, and panels.
 */
function EmptyState({
  icon,
  title,
  description,
  actions,
  className = '',
  ...rest
}) {
  inject();
  return /*#__PURE__*/React.createElement("div", _extends({
    className: ['db-empty', className].filter(Boolean).join(' ')
  }, rest), icon && /*#__PURE__*/React.createElement("div", {
    className: "db-empty__icon",
    "aria-hidden": "true"
  }, icon), title && /*#__PURE__*/React.createElement("div", {
    className: "db-empty__title"
  }, title), description && /*#__PURE__*/React.createElement("div", {
    className: "db-empty__desc"
  }, description), actions && /*#__PURE__*/React.createElement("div", {
    className: "db-empty__actions"
  }, actions));
}
Object.assign(__ds_scope, { EmptyState });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/EmptyState.jsx", error: String((e && e.message) || e) }); }

// components/feedback/StatusBadge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Status → token mapping. Keys are the canonical document statuses.
   Each entry: [bg, fg, dot, label]. Color is NEVER the only signal — the
   text label is always rendered. */
const STATUS = {
  uploaded: ['var(--slate-100)', 'var(--slate-600)', 'var(--slate-400)', 'Uploaded'],
  processing: ['var(--blue-50)', 'var(--blue-700)', 'var(--blue-500)', 'Processing'],
  ocr_completed: ['var(--violet-50)', 'var(--violet-600)', 'var(--violet-500)', 'OCR Completed'],
  need_review: ['var(--amber-50)', 'var(--amber-700)', 'var(--amber-500)', 'Need Review'],
  ready: ['var(--cyan-50)', 'var(--cyan-700)', 'var(--cyan-500)', 'Ready to Submit'],
  approved: ['var(--green-50)', 'var(--green-700)', 'var(--green-500)', 'Approved'],
  submitted: ['var(--green-100)', 'var(--green-700)', 'var(--green-600)', 'Submitted'],
  failed: ['var(--red-50)', 'var(--red-700)', 'var(--red-500)', 'Failed'],
  rejected: ['var(--slate-200)', 'var(--slate-700)', 'var(--red-500)', 'Rejected']
};
let injected = false;
function inject() {
  if (injected || typeof document === 'undefined') return;
  injected = true;
  const s = document.createElement('style');
  s.textContent = `
  .db-status{display:inline-flex;align-items:center;gap:6px;height:22px;padding:0 var(--space-2) 0 7px;
    border-radius:var(--radius-full);font-family:var(--font-sans);font-size:var(--text-2xs);
    font-weight:var(--fw-semibold);letter-spacing:var(--tracking-wide);white-space:nowrap;line-height:1;}
  .db-status__dot{width:7px;height:7px;border-radius:50%;flex:none;}
  .db-status--processing .db-status__dot{animation:db-pulse 1.4s var(--ease-standard) infinite;}
  @keyframes db-pulse{0%,100%{opacity:1;}50%{opacity:.35;}}
  @media (prefers-reduced-motion:reduce){.db-status--processing .db-status__dot{animation:none;}}
  .db-status--lg{height:26px;font-size:var(--text-xs);padding:0 var(--space-3) 0 var(--space-2);}
  `;
  document.head.appendChild(s);
}

/**
 * StatusBadge — canonical document status pill (dot + text label).
 */
function StatusBadge({
  status = 'uploaded',
  size = 'md',
  className = '',
  ...rest
}) {
  inject();
  const [bg, fg, dot, label] = STATUS[status] || STATUS.uploaded;
  return /*#__PURE__*/React.createElement("span", _extends({
    className: ['db-status', `db-status--${status}`, size === 'lg' ? 'db-status--lg' : '', className].filter(Boolean).join(' '),
    style: {
      background: bg,
      color: fg
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    className: "db-status__dot",
    style: {
      background: dot
    },
    "aria-hidden": "true"
  }), label);
}
StatusBadge.STATUSES = Object.keys(STATUS);
Object.assign(__ds_scope, { StatusBadge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/StatusBadge.jsx", error: String((e && e.message) || e) }); }

// components/feedback/ValidationMessage.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const SEV = {
  error: ['var(--red-50)', 'var(--red-100)', 'var(--red-700)', 'var(--red-500)'],
  warning: ['var(--amber-50)', 'var(--amber-100)', 'var(--amber-700)', 'var(--amber-500)'],
  info: ['var(--blue-50)', 'var(--blue-100)', 'var(--blue-700)', 'var(--blue-500)'],
  success: ['var(--green-50)', 'var(--green-100)', 'var(--green-700)', 'var(--green-500)']
};
const ICON = {
  error: /*#__PURE__*/React.createElement("path", {
    d: "M12 8v4m0 4h.01M10.3 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.7 3.86a2 2 0 0 0-3.42 0Z"
  }),
  warning: /*#__PURE__*/React.createElement("path", {
    d: "M12 9v4m0 4h.01M10.3 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.7 3.86a2 2 0 0 0-3.42 0Z"
  }),
  info: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "9"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 16v-4m0-4h.01"
  })),
  success: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "9"
  }), /*#__PURE__*/React.createElement("path", {
    d: "m9 12 2 2 4-4"
  }))
};
let injected = false;
function inject() {
  if (injected || typeof document === 'undefined') return;
  injected = true;
  const s = document.createElement('style');
  s.textContent = `
  .db-vmsg{display:flex;align-items:flex-start;gap:var(--space-2);padding:var(--space-2) var(--space-3);
    border-radius:var(--radius-md);border:var(--border-hairline) solid;font-family:var(--font-sans);
    font-size:var(--text-sm);line-height:var(--leading-snug);}
  .db-vmsg__icon{flex:none;margin-top:1px;}
  .db-vmsg__icon svg{width:16px;height:16px;display:block;}
  .db-vmsg__body{min-width:0;}
  .db-vmsg__title{font-weight:var(--fw-semibold);}
  .db-vmsg__rule{font-family:var(--font-mono);font-size:var(--text-xs);opacity:.85;margin-top:2px;}
  .db-vmsg--inline{padding:0;border:none;background:transparent !important;font-size:var(--text-xs);
    font-weight:var(--fw-medium);align-items:center;}
  `;
  document.head.appendChild(s);
}

/**
 * ValidationMessage — surfaces a validation rule result (error / warning / info).
 */
function ValidationMessage({
  severity = 'error',
  title,
  rule,
  inline = false,
  className = '',
  children,
  ...rest
}) {
  inject();
  const [bg, border, fg, iconColor] = SEV[severity] || SEV.error;
  return /*#__PURE__*/React.createElement("div", _extends({
    className: ['db-vmsg', inline ? 'db-vmsg--inline' : '', className].filter(Boolean).join(' '),
    style: inline ? {
      color: fg
    } : {
      background: bg,
      borderColor: border,
      color: fg
    },
    role: severity === 'error' ? 'alert' : 'status'
  }, rest), /*#__PURE__*/React.createElement("span", {
    className: "db-vmsg__icon",
    style: {
      color: iconColor
    },
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, ICON[severity])), /*#__PURE__*/React.createElement("div", {
    className: "db-vmsg__body"
  }, title && /*#__PURE__*/React.createElement("div", {
    className: "db-vmsg__title"
  }, title), children && /*#__PURE__*/React.createElement("div", null, children), rule && /*#__PURE__*/React.createElement("div", {
    className: "db-vmsg__rule"
  }, rule)));
}
Object.assign(__ds_scope, { ValidationMessage });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/ValidationMessage.jsx", error: String((e && e.message) || e) }); }

// components/forms/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
let injected = false;
function inject() {
  if (injected || typeof document === 'undefined') return;
  injected = true;
  const s = document.createElement('style');
  s.textContent = `
  .db-btn{display:inline-flex;align-items:center;justify-content:center;gap:var(--space-2);
    font-family:var(--font-sans);font-weight:var(--fw-semibold);white-space:nowrap;
    border:var(--border-hairline) solid transparent;border-radius:var(--radius-md);
    cursor:pointer;transition:background var(--dur-fast) var(--ease-standard),
    border-color var(--dur-fast) var(--ease-standard),box-shadow var(--dur-fast) var(--ease-standard),
    color var(--dur-fast) var(--ease-standard);user-select:none;text-decoration:none;}
  .db-btn:focus-visible{outline:none;box-shadow:var(--ring-focus);}
  .db-btn:disabled,.db-btn[aria-disabled="true"]{opacity:.5;cursor:not-allowed;}
  .db-btn--sm{height:var(--control-h-sm);padding:0 var(--space-3);font-size:var(--text-sm);}
  .db-btn--md{height:var(--control-h-md);padding:0 var(--space-4);font-size:var(--text-md);}
  .db-btn--lg{height:var(--control-h-lg);padding:0 var(--space-5);font-size:var(--text-md);}
  .db-btn--block{width:100%;}
  /* primary */
  .db-btn--primary{background:var(--brand);color:var(--text-on-brand);box-shadow:var(--shadow-xs);}
  .db-btn--primary:hover:not(:disabled){background:var(--brand-hover);}
  .db-btn--primary:active:not(:disabled){background:var(--brand-active);}
  /* secondary */
  .db-btn--secondary{background:var(--surface-card);color:var(--text-body);border-color:var(--border-default);box-shadow:var(--shadow-xs);}
  .db-btn--secondary:hover:not(:disabled){background:var(--surface-hover);border-color:var(--border-strong);color:var(--text-strong);}
  .db-btn--secondary:active:not(:disabled){background:var(--slate-100);}
  /* ghost */
  .db-btn--ghost{background:transparent;color:var(--text-body);}
  .db-btn--ghost:hover:not(:disabled){background:var(--surface-hover);color:var(--text-strong);}
  /* danger */
  .db-btn--danger{background:var(--red-500);color:#fff;box-shadow:var(--shadow-xs);}
  .db-btn--danger:hover:not(:disabled){background:var(--red-600);}
  /* danger-soft */
  .db-btn--danger-soft{background:var(--red-50);color:var(--red-700);border-color:var(--red-100);}
  .db-btn--danger-soft:hover:not(:disabled){background:var(--red-100);}
  `;
  document.head.appendChild(s);
}

/**
 * Button — primary action control.
 */
function Button({
  variant = 'primary',
  size = 'md',
  block = false,
  iconLeft = null,
  iconRight = null,
  as = 'button',
  className = '',
  children,
  ...rest
}) {
  inject();
  const Tag = as;
  const cls = ['db-btn', `db-btn--${variant}`, `db-btn--${size}`, block ? 'db-btn--block' : '', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement(Tag, _extends({
    className: cls
  }, rest), iconLeft, children != null && /*#__PURE__*/React.createElement("span", null, children), iconRight);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Button.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
let injected = false;
function inject() {
  if (injected || typeof document === 'undefined') return;
  injected = true;
  const s = document.createElement('style');
  s.textContent = `
  .db-check{display:inline-flex;align-items:flex-start;gap:var(--space-2);cursor:pointer;user-select:none;
    font-family:var(--font-sans);font-size:var(--text-md);color:var(--text-body);}
  .db-check input{position:absolute;opacity:0;width:0;height:0;}
  .db-check__box{flex:none;width:18px;height:18px;margin-top:1px;border-radius:var(--radius-xs);
    border:var(--border-thick) solid var(--border-strong);background:var(--surface-card);
    display:inline-flex;align-items:center;justify-content:center;color:#fff;
    transition:background var(--dur-fast) var(--ease-standard),border-color var(--dur-fast) var(--ease-standard);}
  .db-check__box svg{width:12px;height:12px;opacity:0;transition:opacity var(--dur-fast) var(--ease-standard);}
  .db-check:hover .db-check__box{border-color:var(--brand);}
  .db-check input:checked + .db-check__box{background:var(--brand);border-color:var(--brand);}
  .db-check input:checked + .db-check__box svg{opacity:1;}
  .db-check input:indeterminate + .db-check__box{background:var(--brand);border-color:var(--brand);}
  .db-check input:focus-visible + .db-check__box{box-shadow:var(--ring-focus);}
  .db-check input:disabled ~ *{opacity:.5;}
  .db-check--disabled{cursor:not-allowed;}
  `;
  document.head.appendChild(s);
}

/**
 * Checkbox — row selection, bulk actions, review-checklist items.
 */
function Checkbox({
  label,
  indeterminate = false,
  disabled = false,
  className = '',
  ...rest
}) {
  inject();
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate;
  }, [indeterminate]);
  return /*#__PURE__*/React.createElement("label", {
    className: ['db-check', disabled ? 'db-check--disabled' : '', className].filter(Boolean).join(' ')
  }, /*#__PURE__*/React.createElement("input", _extends({
    ref: ref,
    type: "checkbox",
    disabled: disabled
  }, rest)), /*#__PURE__*/React.createElement("span", {
    className: "db-check__box",
    "aria-hidden": "true"
  }, indeterminate ? /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "3.5",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M5 12h14"
  })) : /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "3.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M20 6 9 17l-5-5"
  }))), label != null && /*#__PURE__*/React.createElement("span", null, label));
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
let injected = false;
function inject() {
  if (injected || typeof document === 'undefined') return;
  injected = true;
  const s = document.createElement('style');
  s.textContent = `
  .db-iconbtn{display:inline-flex;align-items:center;justify-content:center;
    border:var(--border-hairline) solid transparent;border-radius:var(--radius-md);
    background:transparent;color:var(--text-muted);cursor:pointer;padding:0;
    transition:background var(--dur-fast) var(--ease-standard),color var(--dur-fast) var(--ease-standard),
    border-color var(--dur-fast) var(--ease-standard),box-shadow var(--dur-fast) var(--ease-standard);}
  .db-iconbtn:hover:not(:disabled){background:var(--surface-hover);color:var(--text-strong);}
  .db-iconbtn:active:not(:disabled){background:var(--slate-100);}
  .db-iconbtn:focus-visible{outline:none;box-shadow:var(--ring-focus);}
  .db-iconbtn:disabled{opacity:.45;cursor:not-allowed;}
  .db-iconbtn--bordered{border-color:var(--border-default);background:var(--surface-card);}
  .db-iconbtn--bordered:hover:not(:disabled){border-color:var(--border-strong);}
  .db-iconbtn--active{background:var(--surface-selected);color:var(--brand);border-color:var(--blue-200);}
  .db-iconbtn--sm{width:30px;height:30px;}
  .db-iconbtn--md{width:36px;height:36px;}
  .db-iconbtn--lg{width:42px;height:42px;}
  .db-iconbtn svg{width:18px;height:18px;display:block;}
  `;
  document.head.appendChild(s);
}

/**
 * IconButton — square, icon-only control for toolbars (zoom, rotate, more).
 */
function IconButton({
  size = 'md',
  bordered = false,
  active = false,
  label,
  className = '',
  children,
  ...rest
}) {
  inject();
  const cls = ['db-iconbtn', `db-iconbtn--${size}`, bordered ? 'db-iconbtn--bordered' : '', active ? 'db-iconbtn--active' : '', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("button", _extends({
    className: cls,
    "aria-label": label,
    title: label
  }, rest), children);
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
let injected = false;
function inject() {
  if (injected || typeof document === 'undefined') return;
  injected = true;
  const s = document.createElement('style');
  s.textContent = `
  .db-field{display:flex;flex-direction:column;gap:6px;}
  .db-field__label{font-size:var(--text-xs);font-weight:var(--fw-semibold);color:var(--text-muted);
    letter-spacing:var(--tracking-wide);}
  .db-field__req{color:var(--red-500);margin-left:2px;}
  .db-input-wrap{display:flex;align-items:center;gap:var(--space-2);
    background:var(--surface-card);border:var(--border-hairline) solid var(--border-default);
    border-radius:var(--radius-md);padding:0 var(--space-3);height:var(--control-h-md);
    transition:border-color var(--dur-fast) var(--ease-standard),box-shadow var(--dur-fast) var(--ease-standard),background var(--dur-fast) var(--ease-standard);}
  .db-input-wrap:hover{border-color:var(--border-strong);}
  .db-input-wrap:focus-within{border-color:var(--border-focus);box-shadow:var(--ring-focus);}
  .db-input-wrap--sm{height:var(--control-h-sm);}
  .db-input-wrap--mono input{font-family:var(--font-mono);font-feature-settings:"zero" 1;}
  .db-input-wrap--error{border-color:var(--red-500);}
  .db-input-wrap--error:focus-within{box-shadow:0 0 0 3px color-mix(in srgb,var(--red-500) 30%,transparent);}
  .db-input-wrap--disabled{background:var(--surface-sunken);opacity:.7;cursor:not-allowed;}
  .db-input-wrap input{flex:1;min-width:0;border:none;background:transparent;outline:none;
    font-family:var(--font-sans);font-size:var(--text-md);color:var(--text-strong);padding:0;height:100%;}
  .db-input-wrap input::placeholder{color:var(--text-subtle);}
  .db-input__affix{color:var(--text-subtle);display:inline-flex;align-items:center;font-size:var(--text-sm);}
  .db-input__affix svg{width:16px;height:16px;display:block;}
  .db-field__hint{font-size:var(--text-xs);color:var(--text-subtle);}
  .db-field__hint--error{color:var(--red-600);font-weight:var(--fw-medium);}
  `;
  document.head.appendChild(s);
}

/**
 * Input — labelled text field used across forms and the extraction panel.
 */
function Input({
  label,
  required = false,
  hint,
  error,
  size = 'md',
  mono = false,
  prefix = null,
  suffix = null,
  disabled = false,
  id,
  className = '',
  ...rest
}) {
  inject();
  const wrapCls = ['db-input-wrap', size === 'sm' ? 'db-input-wrap--sm' : '', mono ? 'db-input-wrap--mono' : '', error ? 'db-input-wrap--error' : '', disabled ? 'db-input-wrap--disabled' : ''].filter(Boolean).join(' ');
  const fieldId = id || (label ? `f-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);
  return /*#__PURE__*/React.createElement("div", {
    className: ['db-field', className].filter(Boolean).join(' ')
  }, label && /*#__PURE__*/React.createElement("label", {
    className: "db-field__label",
    htmlFor: fieldId
  }, label, required && /*#__PURE__*/React.createElement("span", {
    className: "db-field__req"
  }, "*")), /*#__PURE__*/React.createElement("div", {
    className: wrapCls
  }, prefix && /*#__PURE__*/React.createElement("span", {
    className: "db-input__affix"
  }, prefix), /*#__PURE__*/React.createElement("input", _extends({
    id: fieldId,
    disabled: disabled,
    "aria-invalid": !!error
  }, rest)), suffix && /*#__PURE__*/React.createElement("span", {
    className: "db-input__affix"
  }, suffix)), (hint || error) && /*#__PURE__*/React.createElement("span", {
    className: ['db-field__hint', error ? 'db-field__hint--error' : ''].filter(Boolean).join(' ')
  }, error || hint));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
let injected = false;
function inject() {
  if (injected || typeof document === 'undefined') return;
  injected = true;
  const s = document.createElement('style');
  s.textContent = `
  .db-select{display:flex;flex-direction:column;gap:6px;}
  .db-select__label{font-size:var(--text-xs);font-weight:var(--fw-semibold);color:var(--text-muted);letter-spacing:var(--tracking-wide);}
  .db-select__wrap{position:relative;display:flex;align-items:center;}
  .db-select__wrap select{appearance:none;width:100%;height:var(--control-h-md);
    padding:0 var(--space-7) 0 var(--space-3);background:var(--surface-card);
    border:var(--border-hairline) solid var(--border-default);border-radius:var(--radius-md);
    font-family:var(--font-sans);font-size:var(--text-md);color:var(--text-strong);cursor:pointer;
    transition:border-color var(--dur-fast) var(--ease-standard),box-shadow var(--dur-fast) var(--ease-standard);}
  .db-select__wrap--sm select{height:var(--control-h-sm);font-size:var(--text-sm);}
  .db-select__wrap select:hover{border-color:var(--border-strong);}
  .db-select__wrap select:focus-visible{outline:none;border-color:var(--border-focus);box-shadow:var(--ring-focus);}
  .db-select__wrap select:disabled{background:var(--surface-sunken);opacity:.7;cursor:not-allowed;}
  .db-select__chev{position:absolute;right:var(--space-3);pointer-events:none;color:var(--text-muted);display:flex;}
  .db-select__chev svg{width:16px;height:16px;display:block;}
  `;
  document.head.appendChild(s);
}

/**
 * Select — labelled native dropdown (document type, status filter, etc).
 */
function Select({
  label,
  size = 'md',
  options = [],
  placeholder,
  id,
  className = '',
  children,
  ...rest
}) {
  inject();
  const fieldId = id || (label ? `s-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);
  return /*#__PURE__*/React.createElement("div", {
    className: ['db-select', className].filter(Boolean).join(' ')
  }, label && /*#__PURE__*/React.createElement("label", {
    className: "db-select__label",
    htmlFor: fieldId
  }, label), /*#__PURE__*/React.createElement("div", {
    className: ['db-select__wrap', size === 'sm' ? 'db-select__wrap--sm' : ''].filter(Boolean).join(' ')
  }, /*#__PURE__*/React.createElement("select", _extends({
    id: fieldId
  }, rest), placeholder && /*#__PURE__*/React.createElement("option", {
    value: "",
    disabled: true
  }, placeholder), children || options.map(o => {
    const opt = typeof o === 'string' ? {
      value: o,
      label: o
    } : o;
    return /*#__PURE__*/React.createElement("option", {
      key: opt.value,
      value: opt.value
    }, opt.label);
  })), /*#__PURE__*/React.createElement("span", {
    className: "db-select__chev",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "m6 9 6 6 6-6"
  })))));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/layout/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
let injected = false;
function inject() {
  if (injected || typeof document === 'undefined') return;
  injected = true;
  const s = document.createElement('style');
  s.textContent = `
  .db-card{background:var(--surface-card);border:var(--border-hairline) solid var(--border-subtle);
    border-radius:var(--radius-lg);box-shadow:var(--shadow-sm);overflow:hidden;}
  .db-card--flat{box-shadow:none;}
  .db-card--pad{padding:var(--space-5);}
  .db-card--interactive{cursor:pointer;transition:box-shadow var(--dur-base) var(--ease-standard),
    border-color var(--dur-base) var(--ease-standard),transform var(--dur-base) var(--ease-standard);}
  .db-card--interactive:hover{box-shadow:var(--shadow-md);border-color:var(--border-default);}
  .db-card--interactive:active{transform:translateY(1px);}
  .db-card__header{display:flex;align-items:center;justify-content:space-between;gap:var(--space-3);
    padding:var(--space-4) var(--space-5);border-bottom:var(--border-hairline) solid var(--border-subtle);}
  .db-card__title{font-size:var(--text-md);font-weight:var(--fw-semibold);color:var(--text-strong);}
  .db-card__body{padding:var(--space-5);}
  .db-card__body--flush{padding:0;}
  `;
  document.head.appendChild(s);
}

/**
 * Card — surface container for panels, list items, dashboard widgets.
 */
function Card({
  title,
  actions,
  flat = false,
  interactive = false,
  pad = false,
  flush = false,
  className = '',
  children,
  ...rest
}) {
  inject();
  const cls = ['db-card', flat ? 'db-card--flat' : '', interactive ? 'db-card--interactive' : '', pad && !title ? 'db-card--pad' : '', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("div", _extends({
    className: cls
  }, rest), title && /*#__PURE__*/React.createElement("div", {
    className: "db-card__header"
  }, /*#__PURE__*/React.createElement("span", {
    className: "db-card__title"
  }, title), actions && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-2)'
    }
  }, actions)), title || !pad ? /*#__PURE__*/React.createElement("div", {
    className: ['db-card__body', flush ? 'db-card__body--flush' : ''].filter(Boolean).join(' ')
  }, children) : children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/layout/Card.jsx", error: String((e && e.message) || e) }); }

// components/layout/PageHeader.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
let injected = false;
function inject() {
  if (injected || typeof document === 'undefined') return;
  injected = true;
  const s = document.createElement('style');
  s.textContent = `
  .db-pageheader{display:flex;align-items:flex-start;justify-content:space-between;gap:var(--space-4);
    padding:var(--space-5) 0;flex-wrap:wrap;}
  .db-pageheader__crumbs{display:flex;align-items:center;gap:6px;font-size:var(--text-xs);color:var(--text-muted);margin-bottom:6px;}
  .db-pageheader__crumbs a{color:var(--text-muted);}
  .db-pageheader__crumbs a:hover{color:var(--text-link);}
  .db-pageheader__sep{color:var(--text-subtle);}
  .db-pageheader__title{font-size:var(--text-2xl);font-weight:var(--fw-semibold);color:var(--text-strong);
    display:flex;align-items:center;gap:var(--space-3);}
  .db-pageheader__desc{font-size:var(--text-sm);color:var(--text-muted);margin-top:4px;max-width:70ch;}
  .db-pageheader__actions{display:flex;align-items:center;gap:var(--space-2);}
  `;
  document.head.appendChild(s);
}

/**
 * PageHeader — screen title block with breadcrumbs, meta, and actions.
 */
function PageHeader({
  breadcrumbs,
  title,
  badge,
  description,
  actions,
  className = '',
  ...rest
}) {
  inject();
  return /*#__PURE__*/React.createElement("div", _extends({
    className: ['db-pageheader', className].filter(Boolean).join(' ')
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, breadcrumbs && breadcrumbs.length > 0 && /*#__PURE__*/React.createElement("nav", {
    className: "db-pageheader__crumbs",
    "aria-label": "Breadcrumb"
  }, breadcrumbs.map((c, i) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: i
  }, i > 0 && /*#__PURE__*/React.createElement("span", {
    className: "db-pageheader__sep",
    "aria-hidden": "true"
  }, "/"), c.href ? /*#__PURE__*/React.createElement("a", {
    href: c.href
  }, c.label) : /*#__PURE__*/React.createElement("span", null, c.label)))), /*#__PURE__*/React.createElement("div", {
    className: "db-pageheader__title"
  }, title, badge), description && /*#__PURE__*/React.createElement("div", {
    className: "db-pageheader__desc"
  }, description)), actions && /*#__PURE__*/React.createElement("div", {
    className: "db-pageheader__actions"
  }, actions));
}
Object.assign(__ds_scope, { PageHeader });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/layout/PageHeader.jsx", error: String((e && e.message) || e) }); }

// ui_kits/docubridge/AppShell.jsx
try { (() => {
/* AppShell — sidebar + topbar chrome for DocuBridge. Exported to window.AppShell. */
(function () {
  const {
    Icons
  } = window;
  const NAV = [{
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'Dashboard'
  }, {
    id: 'upload',
    label: 'Upload',
    icon: 'Upload'
  }, {
    id: 'batches',
    label: 'Batches',
    icon: 'Batches'
  }, {
    id: 'queue',
    label: 'Review Queue',
    icon: 'Queue',
    badge: 86
  }, {
    id: 'approved',
    label: 'Approved Drafts',
    icon: 'Approved'
  }, {
    id: 'failed',
    label: 'Failed Documents',
    icon: 'Failed',
    badge: 3,
    danger: true
  }];
  function Sidebar({
    active,
    onNavigate
  }) {
    return /*#__PURE__*/React.createElement("aside", {
      className: "dbk-sidebar"
    }, /*#__PURE__*/React.createElement("div", {
      className: "dbk-brand"
    }, /*#__PURE__*/React.createElement("img", {
      src: "../../assets/logomark.svg",
      alt: "",
      width: "30",
      height: "30"
    }), /*#__PURE__*/React.createElement("span", {
      className: "dbk-brand__name"
    }, "DocuBridge", /*#__PURE__*/React.createElement("span", null, " AI"))), /*#__PURE__*/React.createElement("nav", {
      className: "dbk-nav"
    }, NAV.map(n => {
      const Ico = Icons[n.icon];
      return /*#__PURE__*/React.createElement("button", {
        key: n.id,
        className: 'dbk-navitem' + (active === n.id ? ' is-active' : ''),
        onClick: () => onNavigate && onNavigate(n.id)
      }, /*#__PURE__*/React.createElement(Ico, {
        w: 18
      }), /*#__PURE__*/React.createElement("span", null, n.label), n.badge != null && /*#__PURE__*/React.createElement("span", {
        className: 'dbk-navbadge' + (n.danger ? ' is-danger' : '')
      }, n.badge));
    }), /*#__PURE__*/React.createElement("div", {
      className: "dbk-nav__sep"
    }), /*#__PURE__*/React.createElement("button", {
      className: 'dbk-navitem' + (active === 'settings' ? ' is-active' : ''),
      onClick: () => onNavigate && onNavigate('settings')
    }, /*#__PURE__*/React.createElement(Icons.Settings, {
      w: 18
    }), /*#__PURE__*/React.createElement("span", null, "Settings"))), /*#__PURE__*/React.createElement("div", {
      className: "dbk-storage"
    }, /*#__PURE__*/React.createElement("div", {
      className: "dbk-storage__row"
    }, /*#__PURE__*/React.createElement(Icons.Database, {
      w: 15
    }), /*#__PURE__*/React.createElement("span", null, "Local IndexedDB")), /*#__PURE__*/React.createElement("div", {
      className: "dbk-storage__bar"
    }, /*#__PURE__*/React.createElement("i", {
      style: {
        width: '38%'
      }
    })), /*#__PURE__*/React.createElement("div", {
      className: "dbk-storage__meta"
    }, "218 docs \xB7 41 MB stored")));
  }
  function TopBar({
    onNavigate
  }) {
    return /*#__PURE__*/React.createElement("header", {
      className: "dbk-topbar"
    }, /*#__PURE__*/React.createElement("div", {
      className: "dbk-search"
    }, /*#__PURE__*/React.createElement(Icons.Search, {
      w: 16
    }), /*#__PURE__*/React.createElement("input", {
      placeholder: "Search document no, file name, or batch\u2026"
    }), /*#__PURE__*/React.createElement("kbd", null, "/")), /*#__PURE__*/React.createElement("div", {
      className: "dbk-topbar__right"
    }, /*#__PURE__*/React.createElement("span", {
      className: "dbk-mode"
    }, /*#__PURE__*/React.createElement("span", {
      className: "dbk-mode__dot"
    }), "Demo Mode"), /*#__PURE__*/React.createElement("button", {
      className: "dbk-iconbtn",
      "aria-label": "Notifications"
    }, /*#__PURE__*/React.createElement(Icons.Bell, {
      w: 18
    }), /*#__PURE__*/React.createElement("span", {
      className: "dbk-dot"
    })), /*#__PURE__*/React.createElement("div", {
      className: "dbk-user"
    }, /*#__PURE__*/React.createElement("div", {
      className: "dbk-avatar"
    }, "AT"), /*#__PURE__*/React.createElement("div", {
      className: "dbk-user__meta"
    }, /*#__PURE__*/React.createElement("b", null, "Aishah Tan"), /*#__PURE__*/React.createElement("span", null, "Finance \xB7 Reviewer")), /*#__PURE__*/React.createElement(Icons.ChevronDown, {
      w: 15
    }))));
  }
  function AppShell({
    active,
    onNavigate,
    children
  }) {
    return /*#__PURE__*/React.createElement("div", {
      className: "dbk-app"
    }, /*#__PURE__*/React.createElement(Sidebar, {
      active: active,
      onNavigate: onNavigate
    }), /*#__PURE__*/React.createElement("div", {
      className: "dbk-main"
    }, /*#__PURE__*/React.createElement(TopBar, {
      onNavigate: onNavigate
    }), /*#__PURE__*/React.createElement("div", {
      className: "dbk-content"
    }, children)));
  }
  window.AppShell = AppShell;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/docubridge/AppShell.jsx", error: String((e && e.message) || e) }); }

// ui_kits/docubridge/ApprovedDrafts.jsx
try { (() => {
/* Approved Drafts screen — reviewed JSON, export, submit. window.ApprovedDrafts */
(function () {
  const DS = window.DocuBridgeAIDesignSystem_30d086;
  const {
    Card,
    Button,
    StatusBadge,
    ConfidenceBadge,
    PageHeader
  } = DS;
  const {
    Icons
  } = window;
  const APPROVED = [{
    docNo: 'PO-2024-0517',
    file: 'po_orient_0517.pdf',
    by: 'A. Tan',
    when: '20 min ago',
    status: 'approved'
  }, {
    docNo: 'PO-2024-0519',
    file: 'po_nordic_0519.pdf',
    by: 'M. Lee',
    when: '1 h ago',
    status: 'submitted'
  }, {
    docNo: 'PO-2024-0521',
    file: 'po_acme_0521.pdf',
    by: 'A. Tan',
    when: '2 h ago',
    status: 'approved'
  }, {
    docNo: 'PO-2024-0524',
    file: 'po_orient_0524.pdf',
    by: 'S. Wong',
    when: '3 h ago',
    status: 'approved'
  }];
  const JSON_SAMPLE = `{
  "document_type": "purchase_order",
  "document_no": "PO-2024-0517",
  "transaction_date": "2024-06-11",
  "credit_term": "30 days",
  "bill_to": { "name": "Orient Trading Co", "address": "5 Kallang Way" },
  "line_items": [
    { "serial_no": "1", "stock_code": "STK-2210",
      "description": "Steel Bracket L-90", "quantity": 200,
      "uom": "pcs", "unit_price": 1.85, "total_price": 370.00 }
  ],
  "totals": { "subtotal": 370.00, "gst": 25.90, "grand_total": 395.90 },
  "_review": { "status": "approved", "approved_by": "A. Tan" }
}`;
  function ApprovedDrafts() {
    const [sel, setSel] = React.useState(0);
    return /*#__PURE__*/React.createElement("div", {
      className: "dbk-page"
    }, /*#__PURE__*/React.createElement(PageHeader, {
      title: "Approved drafts",
      description: "Reviewed, validated documents \u2014 ready to export or submit to ERP.",
      actions: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
        variant: "secondary",
        iconLeft: /*#__PURE__*/React.createElement(Icons.Download, {
          w: 16
        })
      }, "Export CSV"), /*#__PURE__*/React.createElement(Button, {
        iconLeft: /*#__PURE__*/React.createElement(Icons.Send, {
          w: 16
        })
      }, "Submit selected to ERP"))
    }), /*#__PURE__*/React.createElement("div", {
      className: "dbk-approved-grid"
    }, /*#__PURE__*/React.createElement(Card, {
      flush: true
    }, /*#__PURE__*/React.createElement("table", {
      className: "dbk-table"
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Status"), /*#__PURE__*/React.createElement("th", null, "Document No"), /*#__PURE__*/React.createElement("th", null, "File"), /*#__PURE__*/React.createElement("th", null, "Approved by"), /*#__PURE__*/React.createElement("th", null, "When"), /*#__PURE__*/React.createElement("th", null))), /*#__PURE__*/React.createElement("tbody", null, APPROVED.map((d, i) => /*#__PURE__*/React.createElement("tr", {
      key: i,
      className: sel === i ? 'is-selected' : '',
      onClick: () => setSel(i)
    }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(StatusBadge, {
      status: d.status
    })), /*#__PURE__*/React.createElement("td", {
      className: "dbk-mono dbk-strong"
    }, d.docNo), /*#__PURE__*/React.createElement("td", {
      className: "dbk-mono",
      style: {
        color: 'var(--text-muted)'
      }
    }, d.file), /*#__PURE__*/React.createElement("td", null, d.by), /*#__PURE__*/React.createElement("td", {
      style: {
        color: 'var(--text-muted)'
      }
    }, d.when), /*#__PURE__*/React.createElement("td", {
      onClick: e => e.stopPropagation()
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      size: "sm"
    }, "View"))))))), /*#__PURE__*/React.createElement(Card, {
      flush: true,
      className: "dbk-json-card"
    }, /*#__PURE__*/React.createElement("div", {
      className: "dbk-json-head"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
      className: "dbk-mono dbk-strong"
    }, APPROVED[sel].docNo), /*#__PURE__*/React.createElement("span", {
      className: "dbk-json-sub"
    }, "reviewed_json")), /*#__PURE__*/React.createElement("div", {
      className: "dbk-json-actions"
    }, /*#__PURE__*/React.createElement("button", {
      className: "dbk-iconbtn",
      "aria-label": "Copy"
    }, /*#__PURE__*/React.createElement(Icons.Code, {
      w: 16
    })), /*#__PURE__*/React.createElement("button", {
      className: "dbk-iconbtn",
      "aria-label": "Download"
    }, /*#__PURE__*/React.createElement(Icons.Download, {
      w: 16
    })))), /*#__PURE__*/React.createElement("pre", {
      className: "dbk-json"
    }, /*#__PURE__*/React.createElement("code", null, JSON_SAMPLE)), /*#__PURE__*/React.createElement("div", {
      className: "dbk-json-foot"
    }, /*#__PURE__*/React.createElement(ConfidenceBadge, {
      level: "high"
    }), /*#__PURE__*/React.createElement("span", {
      className: "dbk-json-foot__txt"
    }, "All validations passed \xB7 original OCR preserved separately")))));
  }
  window.ApprovedDrafts = ApprovedDrafts;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/docubridge/ApprovedDrafts.jsx", error: String((e && e.message) || e) }); }

// ui_kits/docubridge/BatchDetail.jsx
try { (() => {
/* Batch Detail screen — document listing table with filters. window.BatchDetail */
(function () {
  const DS = window.DocuBridgeAIDesignSystem_30d086;
  const {
    Card,
    Button,
    Select,
    StatusBadge,
    ConfidenceBadge,
    Checkbox,
    PageHeader,
    Input
  } = DS;
  const {
    Icons,
    DocData
  } = window;
  function BatchDetail({
    onNavigate
  }) {
    const [sel, setSel] = React.useState({});
    const docs = DocData.documents;
    const selCount = Object.values(sel).filter(Boolean).length;
    const allOn = selCount === docs.length;
    const toggleAll = () => {
      if (allOn) setSel({});else setSel(Object.fromEntries(docs.map(d => [d.id, true])));
    };
    return /*#__PURE__*/React.createElement("div", {
      className: "dbk-page"
    }, /*#__PURE__*/React.createElement(PageHeader, {
      breadcrumbs: [{
        label: 'Batches',
        href: '#'
      }, {
        label: 'June Purchase Orders'
      }],
      title: "June Purchase Orders",
      badge: /*#__PURE__*/React.createElement(StatusBadge, {
        status: "need_review"
      }),
      description: "100 files \xB7 Purchase Order \xB7 created by A. Tan \xB7 updated 4 min ago",
      actions: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
        variant: "secondary",
        iconLeft: /*#__PURE__*/React.createElement(Icons.Refresh, {
          w: 16
        })
      }, "Reprocess failed"), /*#__PURE__*/React.createElement(Button, {
        iconLeft: /*#__PURE__*/React.createElement(Icons.Download, {
          w: 16
        }),
        onClick: () => onNavigate && onNavigate('approved')
      }, "Export approved"))
    }), /*#__PURE__*/React.createElement("div", {
      className: "dbk-toolbar"
    }, /*#__PURE__*/React.createElement("div", {
      className: "dbk-searchbox"
    }, /*#__PURE__*/React.createElement(Icons.Search, {
      w: 15
    }), /*#__PURE__*/React.createElement("input", {
      placeholder: "Search document no or file name\u2026"
    })), /*#__PURE__*/React.createElement(Select, {
      size: "sm",
      placeholder: "All statuses",
      options: [{
        value: 'need_review',
        label: 'Need Review'
      }, {
        value: 'ready',
        label: 'Ready to Submit'
      }, {
        value: 'approved',
        label: 'Approved'
      }, {
        value: 'failed',
        label: 'Failed'
      }]
    }), /*#__PURE__*/React.createElement(Select, {
      size: "sm",
      placeholder: "Any confidence",
      options: ['High', 'Medium', 'Low']
    }), /*#__PURE__*/React.createElement(Select, {
      size: "sm",
      placeholder: "Document type",
      options: ['Purchase Order', 'Invoice']
    }), /*#__PURE__*/React.createElement("span", {
      className: "grow"
    }), /*#__PURE__*/React.createElement("span", {
      className: "dbk-resultcount"
    }, "8 of 100 shown")), selCount > 0 && /*#__PURE__*/React.createElement("div", {
      className: "dbk-bulkbar"
    }, /*#__PURE__*/React.createElement(Checkbox, {
      checked: true,
      indeterminate: !allOn,
      onChange: toggleAll,
      "aria-label": "Select all"
    }), /*#__PURE__*/React.createElement("b", null, selCount, " selected"), /*#__PURE__*/React.createElement("span", {
      className: "grow"
    }), /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      size: "sm",
      iconLeft: /*#__PURE__*/React.createElement(Icons.Approved, {
        w: 15
      })
    }, "Approve ready"), /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      size: "sm",
      iconLeft: /*#__PURE__*/React.createElement(Icons.Download, {
        w: 15
      })
    }, "Export"), /*#__PURE__*/React.createElement(Button, {
      variant: "danger-soft",
      size: "sm",
      iconLeft: /*#__PURE__*/React.createElement(Icons.Trash, {
        w: 15
      })
    }, "Delete")), /*#__PURE__*/React.createElement(Card, {
      flush: true
    }, /*#__PURE__*/React.createElement("table", {
      className: "dbk-table"
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
      style: {
        width: 36
      }
    }, /*#__PURE__*/React.createElement(Checkbox, {
      checked: allOn,
      indeterminate: selCount > 0 && !allOn,
      onChange: toggleAll,
      "aria-label": "Select all rows"
    })), /*#__PURE__*/React.createElement("th", null, "Status"), /*#__PURE__*/React.createElement("th", null, "Document No"), /*#__PURE__*/React.createElement("th", null, "File name"), /*#__PURE__*/React.createElement("th", {
      style: {
        textAlign: 'center'
      }
    }, "Pages"), /*#__PURE__*/React.createElement("th", null, "Confidence"), /*#__PURE__*/React.createElement("th", null, "Validation"), /*#__PURE__*/React.createElement("th", null, "Last updated"), /*#__PURE__*/React.createElement("th", {
      style: {
        width: 80
      }
    }))), /*#__PURE__*/React.createElement("tbody", null, docs.map(d => /*#__PURE__*/React.createElement("tr", {
      key: d.id,
      onClick: () => onNavigate && onNavigate('review')
    }, /*#__PURE__*/React.createElement("td", {
      onClick: e => e.stopPropagation()
    }, /*#__PURE__*/React.createElement(Checkbox, {
      checked: !!sel[d.id],
      onChange: () => setSel(s => ({
        ...s,
        [d.id]: !s[d.id]
      })),
      "aria-label": 'Select ' + d.docNo
    })), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(StatusBadge, {
      status: d.status
    })), /*#__PURE__*/React.createElement("td", {
      className: "dbk-mono dbk-strong"
    }, d.docNo), /*#__PURE__*/React.createElement("td", {
      className: "dbk-mono",
      style: {
        color: 'var(--text-muted)'
      }
    }, d.file), /*#__PURE__*/React.createElement("td", {
      style: {
        textAlign: 'center'
      },
      className: "dbk-mono"
    }, d.pages), /*#__PURE__*/React.createElement("td", null, d.status === 'failed' ? /*#__PURE__*/React.createElement("span", {
      className: "dbk-dash"
    }, "\u2014") : /*#__PURE__*/React.createElement(ConfidenceBadge, {
      score: d.conf,
      showPercent: true
    })), /*#__PURE__*/React.createElement("td", null, d.issues > 0 ? /*#__PURE__*/React.createElement("span", {
      className: "dbk-issuechip"
    }, /*#__PURE__*/React.createElement(Icons.Alert, {
      w: 12
    }), d.issues, " issue", d.issues > 1 ? 's' : '') : /*#__PURE__*/React.createElement("span", {
      className: "dbk-okchip"
    }, /*#__PURE__*/React.createElement(Icons.Check, {
      w: 12
    }), "Clean")), /*#__PURE__*/React.createElement("td", {
      style: {
        color: 'var(--text-muted)'
      }
    }, d.updated), /*#__PURE__*/React.createElement("td", {
      onClick: e => e.stopPropagation()
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      size: "sm",
      iconRight: /*#__PURE__*/React.createElement(Icons.Chevron, {
        w: 14
      }),
      onClick: () => onNavigate && onNavigate('review')
    }, "Review"))))))), /*#__PURE__*/React.createElement("div", {
      className: "dbk-pagination"
    }, /*#__PURE__*/React.createElement("span", null, "Showing 1\u20138 of 100"), /*#__PURE__*/React.createElement("div", {
      className: "dbk-pagebtns"
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      size: "sm",
      disabled: true
    }, "Prev"), /*#__PURE__*/React.createElement("button", {
      className: "dbk-pagenum is-active"
    }, "1"), /*#__PURE__*/React.createElement("button", {
      className: "dbk-pagenum"
    }, "2"), /*#__PURE__*/React.createElement("button", {
      className: "dbk-pagenum"
    }, "3"), /*#__PURE__*/React.createElement("span", {
      className: "dbk-dash"
    }, "\u2026"), /*#__PURE__*/React.createElement("button", {
      className: "dbk-pagenum"
    }, "13"), /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      size: "sm"
    }, "Next"))));
  }
  window.BatchDetail = BatchDetail;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/docubridge/BatchDetail.jsx", error: String((e && e.message) || e) }); }

// ui_kits/docubridge/Dashboard.jsx
try { (() => {
/* Dashboard screen. Exported to window.Dashboard. */
(function () {
  const DS = window.DocuBridgeAIDesignSystem_30d086;
  const {
    StatCard,
    Card,
    StatusBadge,
    ConfidenceBadge,
    Button
  } = DS;
  const {
    Icons,
    DocData
  } = window;
  function BatchRow({
    b,
    onOpen
  }) {
    const done = b.counts.approved;
    const pct = Math.round(done / b.total * 100);
    return /*#__PURE__*/React.createElement("div", {
      className: "dbk-batchrow",
      onClick: onOpen
    }, /*#__PURE__*/React.createElement("div", {
      className: "dbk-batchrow__icon"
    }, /*#__PURE__*/React.createElement(Icons.Batches, {
      w: 18
    })), /*#__PURE__*/React.createElement("div", {
      className: "dbk-batchrow__main"
    }, /*#__PURE__*/React.createElement("div", {
      className: "dbk-batchrow__title"
    }, b.name), /*#__PURE__*/React.createElement("div", {
      className: "dbk-batchrow__sub"
    }, b.type, " \xB7 ", b.total, " files \xB7 ", b.owner, " \xB7 ", b.updated)), /*#__PURE__*/React.createElement("div", {
      className: "dbk-batchrow__prog"
    }, /*#__PURE__*/React.createElement("div", {
      className: "dbk-progbar"
    }, /*#__PURE__*/React.createElement("i", {
      style: {
        width: pct + '%'
      }
    })), /*#__PURE__*/React.createElement("span", null, pct, "% done")), /*#__PURE__*/React.createElement(StatusBadge, {
      status: b.status
    }), /*#__PURE__*/React.createElement(Icons.Chevron, {
      w: 16
    }));
  }
  function Dashboard({
    onNavigate
  }) {
    return /*#__PURE__*/React.createElement("div", {
      className: "dbk-page"
    }, /*#__PURE__*/React.createElement("div", {
      className: "dbk-pagehead"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", null, "Dashboard"), /*#__PURE__*/React.createElement("p", null, "Processing overview across all batches \xB7 updated just now")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      iconLeft: /*#__PURE__*/React.createElement(Icons.Refresh, {
        w: 16
      })
    }, "Refresh"), /*#__PURE__*/React.createElement(Button, {
      iconLeft: /*#__PURE__*/React.createElement(Icons.Upload, {
        w: 16
      }),
      onClick: () => onNavigate && onNavigate('upload')
    }, "Upload batch"))), /*#__PURE__*/React.createElement("div", {
      className: "dbk-grid-stats"
    }, /*#__PURE__*/React.createElement(StatCard, {
      label: "Total Documents",
      value: "1,284",
      tone: "brand",
      icon: /*#__PURE__*/React.createElement(Icons.File, {
        w: 17
      }),
      foot: "across 14 batches"
    }), /*#__PURE__*/React.createElement(StatCard, {
      label: "Need Review",
      value: "86",
      tone: "warning",
      icon: /*#__PURE__*/React.createElement(Icons.Eye, {
        w: 17
      }),
      foot: "2 batches",
      interactive: true,
      onClick: () => onNavigate && onNavigate('queue')
    }), /*#__PURE__*/React.createElement(StatCard, {
      label: "Ready to Submit",
      value: "22",
      tone: "info",
      icon: /*#__PURE__*/React.createElement(Icons.Check, {
        w: 17
      }),
      foot: "validation passed",
      interactive: true
    }), /*#__PURE__*/React.createElement(StatCard, {
      label: "Approved",
      value: "612",
      tone: "success",
      icon: /*#__PURE__*/React.createElement(Icons.Approved, {
        w: 17
      }),
      foot: "+38 today",
      interactive: true,
      onClick: () => onNavigate && onNavigate('approved')
    }), /*#__PURE__*/React.createElement(StatCard, {
      label: "Failed",
      value: "9",
      tone: "danger",
      icon: /*#__PURE__*/React.createElement(Icons.Alert, {
        w: 17
      }),
      foot: "needs reprocess",
      interactive: true,
      onClick: () => onNavigate && onNavigate('failed')
    })), /*#__PURE__*/React.createElement("div", {
      className: "dbk-dash-cols"
    }, /*#__PURE__*/React.createElement(Card, {
      title: "Recent batches",
      actions: /*#__PURE__*/React.createElement(Button, {
        variant: "ghost",
        size: "sm",
        onClick: () => onNavigate && onNavigate('batches')
      }, "View all"),
      flush: true
    }, /*#__PURE__*/React.createElement("div", {
      className: "dbk-batchlist"
    }, DocData.batches.map(b => /*#__PURE__*/React.createElement(BatchRow, {
      key: b.id,
      b: b,
      onOpen: () => onNavigate && onNavigate('batch')
    })))), /*#__PURE__*/React.createElement(Card, {
      title: "Review priority",
      flush: true
    }, /*#__PURE__*/React.createElement("div", {
      className: "dbk-priolist"
    }, DocData.documents.filter(d => d.status === 'need_review').slice(0, 5).map(d => /*#__PURE__*/React.createElement("div", {
      key: d.id,
      className: "dbk-prio",
      onClick: () => onNavigate && onNavigate('review')
    }, /*#__PURE__*/React.createElement(Icons.FileText, {
      w: 16
    }), /*#__PURE__*/React.createElement("span", {
      className: "dbk-mono dbk-strong"
    }, d.docNo), /*#__PURE__*/React.createElement(ConfidenceBadge, {
      score: d.conf,
      plain: true
    }), d.issues > 0 && /*#__PURE__*/React.createElement("span", {
      className: "dbk-issuechip"
    }, /*#__PURE__*/React.createElement(Icons.Alert, {
      w: 12
    }), d.issues), /*#__PURE__*/React.createElement(Icons.Chevron, {
      w: 15
    })))))));
  }
  window.Dashboard = Dashboard;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/docubridge/Dashboard.jsx", error: String((e && e.message) || e) }); }

// ui_kits/docubridge/ReviewWorkbench.jsx
try { (() => {
/* Document Review Workbench — the 3-panel evidence-first review screen.
   window.ReviewWorkbench */
(function () {
  const DS = window.DocuBridgeAIDesignSystem_30d086;
  const {
    Button,
    IconButton,
    StatusBadge,
    ConfidenceBadge,
    ExtractedField,
    ValidationMessage
  } = DS;
  const {
    Icons,
    DocData
  } = window;
  const R = DocData.review;

  /* ---------- Center: document viewer ---------- */
  function PaperDoc({
    page,
    zoom,
    rotate,
    activeBox
  }) {
    return /*#__PURE__*/React.createElement("div", {
      className: "dbk-paperwrap"
    }, /*#__PURE__*/React.createElement("div", {
      className: "dbk-paper",
      style: {
        transform: `scale(${zoom}) rotate(${rotate}deg)`
      }
    }, page === 1 ? /*#__PURE__*/React.createElement("div", {
      className: "dbk-paper__body"
    }, /*#__PURE__*/React.createElement("div", {
      className: "dbk-pp-head"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "dbk-pp-co"
    }, "ACME MANUFACTURING PTE LTD"), /*#__PURE__*/React.createElement("div", {
      className: "dbk-pp-mut"
    }, "12 Tuas Avenue 3 \xB7 Singapore 639271")), /*#__PURE__*/React.createElement("div", {
      className: "dbk-pp-title"
    }, "PURCHASE ORDER")), /*#__PURE__*/React.createElement("div", {
      className: "dbk-pp-grid"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
      className: "dbk-pp-lab"
    }, "PO No."), /*#__PURE__*/React.createElement("b", null, "PO-2024-0512")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
      className: "dbk-pp-lab"
    }, "Date"), /*#__PURE__*/React.createElement("b", null, "12 Jun 2024")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
      className: "dbk-pp-lab"
    }, "Credit Term"), /*#__PURE__*/React.createElement("b", null, "30 days"))), /*#__PURE__*/React.createElement("div", {
      className: "dbk-pp-parties"
    }, /*#__PURE__*/React.createElement("div", {
      className: "dbk-pp-box"
    }, /*#__PURE__*/React.createElement("span", {
      className: "dbk-pp-lab"
    }, "Bill To"), /*#__PURE__*/React.createElement("b", null, "Acme Manufacturing Pte Ltd"), /*#__PURE__*/React.createElement("span", {
      className: "dbk-pp-mut"
    }, "Accounts Dept, 12 Tuas Ave 3")), /*#__PURE__*/React.createElement("div", {
      className: "dbk-pp-box"
    }, /*#__PURE__*/React.createElement("span", {
      className: "dbk-pp-lab"
    }, "Ship To"), /*#__PURE__*/React.createElement("b", null, "Acme Warehouse"), /*#__PURE__*/React.createElement("span", {
      className: "dbk-pp-mut"
    }, "12 Tuas Avenue 3, S'pore"))), /*#__PURE__*/React.createElement("div", {
      className: "dbk-pp-lines"
    }, [0, 1, 2, 3, 4].map(i => /*#__PURE__*/React.createElement("div", {
      key: i,
      className: "dbk-pp-ln",
      style: {
        width: 90 - i * 7 + '%'
      }
    })))) : /*#__PURE__*/React.createElement("div", {
      className: "dbk-paper__body"
    }, /*#__PURE__*/React.createElement("div", {
      className: "dbk-pp-title sm"
    }, "LINE ITEMS"), /*#__PURE__*/React.createElement("table", {
      className: "dbk-pp-table"
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "#"), /*#__PURE__*/React.createElement("th", null, "Code"), /*#__PURE__*/React.createElement("th", null, "Description"), /*#__PURE__*/React.createElement("th", null, "Qty"), /*#__PURE__*/React.createElement("th", null, "Price"), /*#__PURE__*/React.createElement("th", null, "Total"))), /*#__PURE__*/React.createElement("tbody", null, R.lineItems.map(li => /*#__PURE__*/React.createElement("tr", {
      key: li.sn
    }, /*#__PURE__*/React.createElement("td", null, li.sn), /*#__PURE__*/React.createElement("td", null, li.code), /*#__PURE__*/React.createElement("td", null, li.desc), /*#__PURE__*/React.createElement("td", null, li.qty), /*#__PURE__*/React.createElement("td", null, li.price.toFixed(2)), /*#__PURE__*/React.createElement("td", null, li.total.toFixed(2)))))), /*#__PURE__*/React.createElement("div", {
      className: "dbk-pp-totals"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", null, "Subtotal"), /*#__PURE__*/React.createElement("b", null, "444.00")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", null, "GST 7%"), /*#__PURE__*/React.createElement("b", null, "31.08")), /*#__PURE__*/React.createElement("div", {
      className: "grand"
    }, /*#__PURE__*/React.createElement("span", null, "Grand Total"), /*#__PURE__*/React.createElement("b", null, "1,284.00")))), R.summary.filter(f => f.page === page).map(f => /*#__PURE__*/React.createElement("div", {
      key: f.key,
      className: 'dbk-evbox' + (activeBox === f.key ? ' is-active' : ''),
      style: {
        left: f.box.x + '%',
        top: f.box.y + '%',
        width: f.box.w + '%',
        height: f.box.h + '%'
      }
    }, activeBox === f.key && /*#__PURE__*/React.createElement("span", {
      className: "dbk-evbox__tag"
    }, f.label)))));
  }

  /* ---------- Right: line item grid ---------- */
  function LineItemGrid() {
    return /*#__PURE__*/React.createElement("div", {
      className: "dbk-ligrid"
    }, /*#__PURE__*/React.createElement("table", null, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "#"), /*#__PURE__*/React.createElement("th", null, "Description"), /*#__PURE__*/React.createElement("th", null, "Qty"), /*#__PURE__*/React.createElement("th", null, "Price"), /*#__PURE__*/React.createElement("th", null, "Total"), /*#__PURE__*/React.createElement("th", null, "Conf."))), /*#__PURE__*/React.createElement("tbody", null, R.lineItems.map(li => {
      const calc = +(li.qty * li.price).toFixed(2);
      const mismatch = Math.abs(calc - li.total) > 0.01;
      return /*#__PURE__*/React.createElement("tr", {
        key: li.sn,
        className: li.conf < 0.7 ? 'is-low' : ''
      }, /*#__PURE__*/React.createElement("td", {
        className: "dbk-mono"
      }, li.sn), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
        className: "dbk-li-desc"
      }, li.desc), /*#__PURE__*/React.createElement("div", {
        className: "dbk-li-code dbk-mono"
      }, li.code)), /*#__PURE__*/React.createElement("td", {
        className: "dbk-mono"
      }, li.qty), /*#__PURE__*/React.createElement("td", {
        className: "dbk-mono"
      }, li.price.toFixed(2)), /*#__PURE__*/React.createElement("td", {
        className: 'dbk-mono ' + (mismatch ? 'dbk-li-bad' : '')
      }, li.total.toFixed(2)), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(ConfidenceBadge, {
        score: li.conf,
        showLabel: false,
        showPercent: true,
        plain: true
      })));
    }))), /*#__PURE__*/React.createElement("button", {
      className: "dbk-li-add"
    }, /*#__PURE__*/React.createElement(Icons.Plus, {
      w: 14
    }), "Add row"));
  }
  function ReviewWorkbench({
    onNavigate
  }) {
    const [page, setPage] = React.useState(1);
    const [zoom, setZoom] = React.useState(1);
    const [rotate, setRotate] = React.useState(0);
    const [active, setActive] = React.useState('document_no');
    const [tab, setTab] = React.useState('summary');
    const selectField = (key, pg) => {
      setActive(key);
      if (pg) setPage(pg);
    };
    return /*#__PURE__*/React.createElement("div", {
      className: "dbk-wb"
    }, /*#__PURE__*/React.createElement("div", {
      className: "dbk-wb-top"
    }, /*#__PURE__*/React.createElement("button", {
      className: "dbk-back",
      onClick: () => onNavigate && onNavigate('batch')
    }, /*#__PURE__*/React.createElement(Icons.ArrowLeft, {
      w: 17
    })), /*#__PURE__*/React.createElement("div", {
      className: "dbk-wb-id"
    }, /*#__PURE__*/React.createElement("span", {
      className: "dbk-mono dbk-strong"
    }, R.docNo), /*#__PURE__*/React.createElement("span", {
      className: "dbk-wb-file dbk-mono"
    }, R.file)), /*#__PURE__*/React.createElement(StatusBadge, {
      status: R.status
    }), /*#__PURE__*/React.createElement(ConfidenceBadge, {
      score: R.conf,
      showPercent: true
    }), /*#__PURE__*/React.createElement("span", {
      className: "grow"
    }), /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      size: "sm",
      iconLeft: /*#__PURE__*/React.createElement(Icons.Code, {
        w: 15
      })
    }, "View JSON"), /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      size: "sm",
      iconLeft: /*#__PURE__*/React.createElement(Icons.Save, {
        w: 15
      })
    }, "Save draft"), /*#__PURE__*/React.createElement(Button, {
      variant: "danger-soft",
      size: "sm"
    }, "Reject"), /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      iconLeft: /*#__PURE__*/React.createElement(Icons.Approved, {
        w: 15
      })
    }, "Approve")), /*#__PURE__*/React.createElement("div", {
      className: "dbk-wb-body"
    }, /*#__PURE__*/React.createElement("div", {
      className: "dbk-rail"
    }, R.pages.map(p => /*#__PURE__*/React.createElement("button", {
      key: p.no,
      className: 'dbk-thumb' + (page === p.no ? ' is-active' : ''),
      onClick: () => setPage(p.no)
    }, /*#__PURE__*/React.createElement("div", {
      className: "dbk-thumb__page"
    }, /*#__PURE__*/React.createElement(Icons.FileText, {
      w: 20
    })), /*#__PURE__*/React.createElement("span", {
      className: "dbk-thumb__no"
    }, "Page ", p.no), /*#__PURE__*/React.createElement(ConfidenceBadge, {
      score: p.conf,
      showLabel: false,
      showPercent: true,
      plain: true
    })))), /*#__PURE__*/React.createElement("div", {
      className: "dbk-viewer"
    }, /*#__PURE__*/React.createElement("div", {
      className: "dbk-viewer__toolbar"
    }, /*#__PURE__*/React.createElement("span", {
      className: "dbk-viewer__page"
    }, "Page ", page, " of ", R.pages.length, " \xB7 ", R.pages[page - 1].label), /*#__PURE__*/React.createElement("span", {
      className: "grow"
    }), /*#__PURE__*/React.createElement(IconButton, {
      label: "Zoom out",
      size: "sm",
      onClick: () => setZoom(z => Math.max(0.6, +(z - 0.1).toFixed(2)))
    }, /*#__PURE__*/React.createElement(Icons.ZoomOut, {
      w: 16
    })), /*#__PURE__*/React.createElement("span", {
      className: "dbk-zoom dbk-mono"
    }, Math.round(zoom * 100), "%"), /*#__PURE__*/React.createElement(IconButton, {
      label: "Zoom in",
      size: "sm",
      onClick: () => setZoom(z => Math.min(1.6, +(z + 0.1).toFixed(2)))
    }, /*#__PURE__*/React.createElement(Icons.ZoomIn, {
      w: 16
    })), /*#__PURE__*/React.createElement("span", {
      className: "dbk-tbdiv"
    }), /*#__PURE__*/React.createElement(IconButton, {
      label: "Rotate",
      size: "sm",
      onClick: () => setRotate(r => (r + 90) % 360)
    }, /*#__PURE__*/React.createElement(Icons.Rotate, {
      w: 16
    })), /*#__PURE__*/React.createElement(IconButton, {
      label: "Toggle highlights",
      size: "sm",
      active: true
    }, /*#__PURE__*/React.createElement(Icons.Box, {
      w: 16
    }))), /*#__PURE__*/React.createElement("div", {
      className: "dbk-viewer__stage"
    }, /*#__PURE__*/React.createElement(PaperDoc, {
      page: page,
      zoom: zoom,
      rotate: rotate,
      activeBox: active
    }))), /*#__PURE__*/React.createElement("div", {
      className: "dbk-panel"
    }, /*#__PURE__*/React.createElement("div", {
      className: "dbk-panel-tabs"
    }, [['summary', 'Summary'], ['lines', 'Line Items'], ['validate', 'Validation']].map(([id, lab]) => /*#__PURE__*/React.createElement("button", {
      key: id,
      className: 'dbk-ptab' + (tab === id ? ' is-active' : ''),
      onClick: () => setTab(id)
    }, lab, id === 'validate' && /*#__PURE__*/React.createElement("span", {
      className: "dbk-ptab__count"
    }, R.validation.length)))), /*#__PURE__*/React.createElement("div", {
      className: "dbk-panel-scroll"
    }, tab === 'summary' && /*#__PURE__*/React.createElement("div", {
      className: "dbk-fieldgroup"
    }, /*#__PURE__*/React.createElement("div", {
      className: "dbk-fg-label"
    }, "Header fields"), R.summary.map(f => /*#__PURE__*/React.createElement(ExtractedField, {
      key: f.key,
      label: f.label,
      value: f.value,
      confidence: f.conf,
      pageNo: f.page,
      active: active === f.key,
      edited: f.key === 'ship_to',
      error: f.key === 'ship_to' ? undefined : undefined,
      onSelect: () => selectField(f.key, f.page)
    })), /*#__PURE__*/React.createElement("div", {
      className: "dbk-fg-label",
      style: {
        marginTop: 14
      }
    }, "Totals"), /*#__PURE__*/React.createElement(ExtractedField, {
      label: "Subtotal",
      value: "444.00",
      confidence: 0.9,
      pageNo: 2,
      active: active === 'subtotal',
      onSelect: () => selectField('subtotal', 2)
    }), /*#__PURE__*/React.createElement(ExtractedField, {
      label: "GST",
      value: "31.08",
      confidence: 0.88,
      pageNo: 2,
      active: active === 'gst',
      onSelect: () => selectField('gst', 2)
    }), /*#__PURE__*/React.createElement(ExtractedField, {
      label: "Grand Total",
      value: "1,284.00",
      confidence: 0.61,
      pageNo: 2,
      edited: true,
      error: "Subtotal + GST = 475.08, not 1,284.00",
      active: active === 'grand',
      onSelect: () => selectField('grand', 2)
    })), tab === 'lines' && /*#__PURE__*/React.createElement("div", {
      className: "dbk-fieldgroup"
    }, /*#__PURE__*/React.createElement("div", {
      className: "dbk-fg-label"
    }, "4 line items \xB7 1 low-confidence"), /*#__PURE__*/React.createElement(LineItemGrid, null)), tab === 'validate' && /*#__PURE__*/React.createElement("div", {
      className: "dbk-fieldgroup dbk-validate"
    }, R.validation.map((v, i) => /*#__PURE__*/React.createElement(ValidationMessage, {
      key: i,
      severity: v.sev,
      title: v.title,
      rule: v.rule
    }, v.detail)), /*#__PURE__*/React.createElement("div", {
      className: "dbk-checklist"
    }, /*#__PURE__*/React.createElement("div", {
      className: "dbk-fg-label"
    }, "Review checklist"), [['Document No present', true], ['Transaction date valid', true], ['At least one line item', true], ['Totals balance', false]].map(([t, ok], i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      className: 'dbk-checkitem' + (ok ? ' is-ok' : ' is-bad')
    }, ok ? /*#__PURE__*/React.createElement(Icons.Check, {
      w: 14
    }) : /*#__PURE__*/React.createElement(Icons.X, {
      w: 14
    }), /*#__PURE__*/React.createElement("span", null, t)))))), /*#__PURE__*/React.createElement("div", {
      className: "dbk-panel-foot"
    }, /*#__PURE__*/React.createElement(Icons.Alert, {
      w: 15
    }), /*#__PURE__*/React.createElement("span", null, "1 error must be resolved before approval.")))));
  }
  window.ReviewWorkbench = ReviewWorkbench;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/docubridge/ReviewWorkbench.jsx", error: String((e && e.message) || e) }); }

// ui_kits/docubridge/UploadBatch.jsx
try { (() => {
/* Upload Batch screen. Exported to window.UploadBatch. */
(function () {
  const DS = window.DocuBridgeAIDesignSystem_30d086;
  const {
    Card,
    Input,
    Select,
    Button,
    StatusBadge,
    ConfidenceBadge
  } = DS;
  const {
    Icons
  } = window;
  const QUEUE = [{
    name: 'po_acme_0512.pdf',
    size: '248 KB',
    pages: 2,
    state: 'done'
  }, {
    name: 'po_acme_0513.pdf',
    size: '180 KB',
    pages: 1,
    state: 'done'
  }, {
    name: 'po_nordic_0514.pdf',
    size: '512 KB',
    pages: 3,
    state: 'uploading',
    pct: 64
  }, {
    name: 'po_acme_0515.jpg',
    size: '1.2 MB',
    pages: 1,
    state: 'queued'
  }, {
    name: 'scan_0516.jpg',
    size: '2.0 MB',
    pages: 1,
    state: 'error'
  }];
  function FileRow({
    f,
    onRemove
  }) {
    const ext = f.name.split('.').pop().toUpperCase();
    return /*#__PURE__*/React.createElement("div", {
      className: "dbk-filerow"
    }, /*#__PURE__*/React.createElement("div", {
      className: 'dbk-fileext dbk-fileext--' + (ext === 'PDF' ? 'pdf' : 'img')
    }, ext), /*#__PURE__*/React.createElement("div", {
      className: "dbk-filerow__main"
    }, /*#__PURE__*/React.createElement("div", {
      className: "dbk-filerow__name"
    }, f.name), /*#__PURE__*/React.createElement("div", {
      className: "dbk-filerow__sub"
    }, f.size, " \xB7 ", f.pages, " page", f.pages > 1 ? 's' : '', f.state === 'uploading' && /*#__PURE__*/React.createElement("span", {
      className: "dbk-mono"
    }, " \xB7 ", f.pct, "%"), f.state === 'error' && /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--red-600)'
      }
    }, " \xB7 unsupported / corrupt")), f.state === 'uploading' && /*#__PURE__*/React.createElement("div", {
      className: "dbk-progbar dbk-progbar--thin"
    }, /*#__PURE__*/React.createElement("i", {
      style: {
        width: f.pct + '%'
      }
    }))), f.state === 'done' && /*#__PURE__*/React.createElement("span", {
      className: "dbk-filestate dbk-filestate--ok"
    }, /*#__PURE__*/React.createElement(Icons.Check, {
      w: 13
    }), "Ready"), f.state === 'queued' && /*#__PURE__*/React.createElement("span", {
      className: "dbk-filestate"
    }, /*#__PURE__*/React.createElement(Icons.Clock, {
      w: 13
    }), "Queued"), f.state === 'error' && /*#__PURE__*/React.createElement("span", {
      className: "dbk-filestate dbk-filestate--err"
    }, /*#__PURE__*/React.createElement(Icons.Alert, {
      w: 13
    }), "Error"), /*#__PURE__*/React.createElement("button", {
      className: "dbk-iconbtn",
      "aria-label": "Remove",
      onClick: onRemove
    }, /*#__PURE__*/React.createElement(Icons.X, {
      w: 16
    })));
  }
  function UploadBatch({
    onNavigate
  }) {
    const [drag, setDrag] = React.useState(false);
    return /*#__PURE__*/React.createElement("div", {
      className: "dbk-page dbk-page--narrow"
    }, /*#__PURE__*/React.createElement("div", {
      className: "dbk-pagehead"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", null, "Upload batch"), /*#__PURE__*/React.createElement("p", null, "Drop PDFs or photos. OCR runs after you start processing \u2014 originals stay in local storage."))), /*#__PURE__*/React.createElement("div", {
      className: "dbk-upload-grid"
    }, /*#__PURE__*/React.createElement("div", {
      className: "dbk-upload-left"
    }, /*#__PURE__*/React.createElement(Card, {
      pad: true
    }, /*#__PURE__*/React.createElement("div", {
      className: "dbk-form2"
    }, /*#__PURE__*/React.createElement(Input, {
      label: "Batch name",
      placeholder: "e.g. June Purchase Orders",
      defaultValue: "June Purchase Orders",
      required: true
    }), /*#__PURE__*/React.createElement(Select, {
      label: "Document type",
      options: ['Purchase Order', 'Invoice', 'Delivery Order', 'Claim Form', 'Generic Document']
    }))), /*#__PURE__*/React.createElement("div", {
      className: 'dbk-dropzone' + (drag ? ' is-drag' : ''),
      onDragOver: e => {
        e.preventDefault();
        setDrag(true);
      },
      onDragLeave: () => setDrag(false),
      onDrop: e => {
        e.preventDefault();
        setDrag(false);
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "dbk-dropzone__icon"
    }, /*#__PURE__*/React.createElement(Icons.Upload, {
      w: 26
    })), /*#__PURE__*/React.createElement("div", {
      className: "dbk-dropzone__title"
    }, "Drag & drop files here"), /*#__PURE__*/React.createElement("div", {
      className: "dbk-dropzone__sub"
    }, "or click to browse \xB7 PDF, PNG, JPG, JPEG \xB7 up to 100 files"), /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      size: "sm",
      iconLeft: /*#__PURE__*/React.createElement(Icons.Plus, {
        w: 15
      })
    }, "Choose files"))), /*#__PURE__*/React.createElement(Card, {
      title: "File queue",
      actions: /*#__PURE__*/React.createElement("span", {
        className: "dbk-queuecount"
      }, "5 files \xB7 4.1 MB"),
      flush: true
    }, /*#__PURE__*/React.createElement("div", {
      className: "dbk-queue"
    }, QUEUE.map((f, i) => /*#__PURE__*/React.createElement(FileRow, {
      key: i,
      f: f
    }))), /*#__PURE__*/React.createElement("div", {
      className: "dbk-queue-foot"
    }, /*#__PURE__*/React.createElement("div", {
      className: "dbk-queue-foot__meta"
    }, /*#__PURE__*/React.createElement(StatusBadge, {
      status: "uploaded"
    }), " 3 ready \xB7 1 uploading \xB7 1 error"), /*#__PURE__*/React.createElement(Button, {
      iconLeft: /*#__PURE__*/React.createElement(Icons.Layers, {
        w: 16
      }),
      onClick: () => onNavigate && onNavigate('batch')
    }, "Start OCR \xB7 4 files")))));
  }
  window.UploadBatch = UploadBatch;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/docubridge/UploadBatch.jsx", error: String((e && e.message) || e) }); }

// ui_kits/docubridge/data.jsx
try { (() => {
/* Mock data for the DocuBridge UI kit. Exported to window.DocData.
   Mirrors the OCR service contract: extracted_json + field_metadata + validation. */
(function () {
  const batches = [{
    id: 'b1',
    name: 'June Purchase Orders',
    type: 'Purchase Order',
    total: 100,
    status: 'need_review',
    counts: {
      review: 86,
      ready: 6,
      approved: 5,
      failed: 3
    },
    updated: '4 min ago',
    owner: 'A. Tan'
  }, {
    id: 'b2',
    name: 'Q2 Supplier Invoices',
    type: 'Invoice',
    total: 48,
    status: 'processing',
    counts: {
      review: 12,
      ready: 0,
      approved: 0,
      failed: 1
    },
    updated: 'just now',
    owner: 'M. Lee'
  }, {
    id: 'b3',
    name: 'Warehouse Delivery Orders',
    type: 'Delivery Order',
    total: 32,
    status: 'approved',
    counts: {
      review: 0,
      ready: 0,
      approved: 32,
      failed: 0
    },
    updated: '2 h ago',
    owner: 'S. Wong'
  }, {
    id: 'b4',
    name: 'May Claim Forms',
    type: 'Claim Form',
    total: 18,
    status: 'ready',
    counts: {
      review: 0,
      ready: 16,
      approved: 2,
      failed: 0
    },
    updated: 'yesterday',
    owner: 'A. Tan'
  }];
  const documents = [{
    id: 'd1',
    docNo: 'PO-2024-0512',
    file: 'po_acme_0512.pdf',
    pages: 2,
    conf: 0.62,
    status: 'need_review',
    issues: 2,
    updated: '4 min ago'
  }, {
    id: 'd2',
    docNo: 'PO-2024-0513',
    file: 'po_acme_0513.pdf',
    pages: 1,
    conf: 0.94,
    status: 'ready',
    issues: 0,
    updated: '6 min ago'
  }, {
    id: 'd3',
    docNo: 'PO-2024-0514',
    file: 'po_nordic_0514.pdf',
    pages: 3,
    conf: 0.88,
    status: 'need_review',
    issues: 1,
    updated: '8 min ago'
  }, {
    id: 'd4',
    docNo: 'PO-2024-0515',
    file: 'po_acme_0515.jpg',
    pages: 1,
    conf: 0.71,
    status: 'need_review',
    issues: 1,
    updated: '11 min ago'
  }, {
    id: 'd5',
    docNo: '—',
    file: 'scan_0516.jpg',
    pages: 1,
    conf: 0.0,
    status: 'failed',
    issues: 1,
    updated: '12 min ago'
  }, {
    id: 'd6',
    docNo: 'PO-2024-0517',
    file: 'po_orient_0517.pdf',
    pages: 2,
    conf: 0.97,
    status: 'approved',
    issues: 0,
    updated: '20 min ago'
  }, {
    id: 'd7',
    docNo: 'PO-2024-0518',
    file: 'po_acme_0518.pdf',
    pages: 1,
    conf: 0.91,
    status: 'need_review',
    issues: 0,
    updated: '24 min ago'
  }, {
    id: 'd8',
    docNo: 'PO-2024-0519',
    file: 'po_nordic_0519.pdf',
    pages: 2,
    conf: 0.83,
    status: 'submitted',
    issues: 0,
    updated: '1 h ago'
  }];

  // The document open in the review workbench (a Purchase Order).
  const review = {
    docNo: 'PO-2024-0512',
    file: 'po_acme_0512.pdf',
    type: 'Purchase Order',
    status: 'need_review',
    conf: 0.62,
    pages: [{
      no: 1,
      label: 'Header & parties',
      conf: 0.84
    }, {
      no: 2,
      label: 'Line items & totals',
      conf: 0.58
    }],
    summary: [{
      key: 'document_no',
      label: 'Document No',
      value: 'PO-2024-0512',
      conf: 0.96,
      page: 1,
      box: {
        x: 60,
        y: 8,
        w: 32,
        h: 5
      }
    }, {
      key: 'transaction_date',
      label: 'Transaction Date',
      value: '2024-06-12',
      conf: 0.82,
      page: 1,
      box: {
        x: 60,
        y: 16,
        w: 28,
        h: 5
      }
    }, {
      key: 'credit_term',
      label: 'Credit Term',
      value: '30 days',
      conf: 0.74,
      page: 1,
      box: {
        x: 60,
        y: 24,
        w: 22,
        h: 5
      }
    }, {
      key: 'bill_to',
      label: 'Bill To',
      value: 'Acme Manufacturing Pte Ltd',
      conf: 0.9,
      page: 1,
      box: {
        x: 8,
        y: 34,
        w: 40,
        h: 6
      }
    }, {
      key: 'ship_to',
      label: 'Ship To',
      value: 'Acme Warehouse, 12 Tuas Ave',
      conf: 0.69,
      page: 1,
      box: {
        x: 8,
        y: 42,
        w: 40,
        h: 6
      }
    }],
    lineItems: [{
      sn: '1',
      code: 'STK-4471',
      desc: 'M8 Hex Bolt, Zinc',
      qty: 500,
      uom: 'pcs',
      price: 0.42,
      total: 210.0,
      conf: 0.93
    }, {
      sn: '2',
      code: 'STK-4490',
      desc: 'M8 Hex Nut, Zinc',
      qty: 500,
      uom: 'pcs',
      price: 0.18,
      total: 90.0,
      conf: 0.9
    }, {
      sn: '3',
      code: 'STK-7732',
      desc: 'Flat Washer 8mm',
      qty: 1000,
      uom: 'pcs',
      price: 0.06,
      total: 60.0,
      conf: 0.55
    }, {
      sn: '4',
      code: 'STK-1180',
      desc: 'Threadlock 50ml',
      qty: 12,
      uom: 'btl',
      price: 7.5,
      total: 84.0,
      conf: 0.61
    }],
    totals: {
      subtotal: 444.0,
      gst: 31.08,
      grand: 1284.0
    },
    // grand intentionally wrong to trigger validation
    validation: [{
      sev: 'error',
      title: 'Totals do not balance',
      rule: 'subtotal + gst = grand_total',
      detail: '444.00 + 31.08 = 475.08, not 1,284.00'
    }, {
      sev: 'warning',
      title: 'Low-confidence line item',
      rule: 'row 3 confidence < 70%',
      detail: 'Flat Washer 8mm — verify quantity and unit price.'
    }]
  };
  window.DocData = {
    batches,
    documents,
    review
  };
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/docubridge/data.jsx", error: String((e && e.message) || e) }); }

// ui_kits/docubridge/icons.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Shared icon set — Lucide-style 24px stroke icons. Exported to window.Icons.
   Stroke 2, round caps. Sized via CSS (width/height on the svg). */
(function () {
  const S = ({
    children,
    w = 18,
    ...p
  }) => /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 24 24",
    width: w,
    height: w,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, p), children);
  const Icons = {
    Dashboard: p => /*#__PURE__*/React.createElement(S, p, /*#__PURE__*/React.createElement("rect", {
      x: "3",
      y: "3",
      width: "7",
      height: "9",
      rx: "1.5"
    }), /*#__PURE__*/React.createElement("rect", {
      x: "14",
      y: "3",
      width: "7",
      height: "5",
      rx: "1.5"
    }), /*#__PURE__*/React.createElement("rect", {
      x: "14",
      y: "12",
      width: "7",
      height: "9",
      rx: "1.5"
    }), /*#__PURE__*/React.createElement("rect", {
      x: "3",
      y: "16",
      width: "7",
      height: "5",
      rx: "1.5"
    })),
    Upload: p => /*#__PURE__*/React.createElement(S, p, /*#__PURE__*/React.createElement("path", {
      d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M17 8l-5-5-5 5"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M12 3v12"
    })),
    Batches: p => /*#__PURE__*/React.createElement(S, p, /*#__PURE__*/React.createElement("path", {
      d: "M3 7l9-4 9 4-9 4-9-4Z"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M3 7v10l9 4 9-4V7"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M12 11v10"
    })),
    Queue: p => /*#__PURE__*/React.createElement(S, p, /*#__PURE__*/React.createElement("path", {
      d: "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "3"
    })),
    Approved: p => /*#__PURE__*/React.createElement(S, p, /*#__PURE__*/React.createElement("path", {
      d: "M22 11.1V12a10 10 0 1 1-5.9-9.1"
    }), /*#__PURE__*/React.createElement("path", {
      d: "m9 11 3 3L22 4"
    })),
    Failed: p => /*#__PURE__*/React.createElement(S, p, /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "9"
    }), /*#__PURE__*/React.createElement("path", {
      d: "m15 9-6 6M9 9l6 6"
    })),
    Settings: p => /*#__PURE__*/React.createElement(S, p, /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "3"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"
    })),
    Search: p => /*#__PURE__*/React.createElement(S, p, /*#__PURE__*/React.createElement("circle", {
      cx: "11",
      cy: "11",
      r: "7"
    }), /*#__PURE__*/React.createElement("path", {
      d: "m21 21-4.3-4.3"
    })),
    File: p => /*#__PURE__*/React.createElement(S, p, /*#__PURE__*/React.createElement("path", {
      d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M14 2v6h6"
    })),
    FileText: p => /*#__PURE__*/React.createElement(S, p, /*#__PURE__*/React.createElement("path", {
      d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M14 2v6h6M8 13h8M8 17h8M8 9h2"
    })),
    Plus: p => /*#__PURE__*/React.createElement(S, p, /*#__PURE__*/React.createElement("path", {
      d: "M5 12h14M12 5v14"
    })),
    Minus: p => /*#__PURE__*/React.createElement(S, p, /*#__PURE__*/React.createElement("path", {
      d: "M5 12h14"
    })),
    Check: p => /*#__PURE__*/React.createElement(S, p, /*#__PURE__*/React.createElement("path", {
      d: "M20 6 9 17l-5-5"
    })),
    X: p => /*#__PURE__*/React.createElement(S, p, /*#__PURE__*/React.createElement("path", {
      d: "M18 6 6 18M6 6l12 12"
    })),
    Chevron: p => /*#__PURE__*/React.createElement(S, p, /*#__PURE__*/React.createElement("path", {
      d: "m9 18 6-6-6-6"
    })),
    ChevronDown: p => /*#__PURE__*/React.createElement(S, p, /*#__PURE__*/React.createElement("path", {
      d: "m6 9 6 6 6-6"
    })),
    ArrowLeft: p => /*#__PURE__*/React.createElement(S, p, /*#__PURE__*/React.createElement("path", {
      d: "M19 12H5M12 19l-7-7 7-7"
    })),
    Save: p => /*#__PURE__*/React.createElement(S, p, /*#__PURE__*/React.createElement("path", {
      d: "M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M17 21v-8H7v8M7 3v5h8"
    })),
    Rotate: p => /*#__PURE__*/React.createElement(S, p, /*#__PURE__*/React.createElement("path", {
      d: "M3 12a9 9 0 1 0 3-6.7L3 8"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M3 3v5h5"
    })),
    ZoomIn: p => /*#__PURE__*/React.createElement(S, p, /*#__PURE__*/React.createElement("circle", {
      cx: "11",
      cy: "11",
      r: "7"
    }), /*#__PURE__*/React.createElement("path", {
      d: "m21 21-4.3-4.3M11 8v6M8 11h6"
    })),
    ZoomOut: p => /*#__PURE__*/React.createElement(S, p, /*#__PURE__*/React.createElement("circle", {
      cx: "11",
      cy: "11",
      r: "7"
    }), /*#__PURE__*/React.createElement("path", {
      d: "m21 21-4.3-4.3M8 11h6"
    })),
    Box: p => /*#__PURE__*/React.createElement(S, p, /*#__PURE__*/React.createElement("rect", {
      x: "3",
      y: "3",
      width: "18",
      height: "18",
      rx: "2"
    })),
    Download: p => /*#__PURE__*/React.createElement(S, p, /*#__PURE__*/React.createElement("path", {
      d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M7 10l5 5 5-5"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M12 15V3"
    })),
    Code: p => /*#__PURE__*/React.createElement(S, p, /*#__PURE__*/React.createElement("path", {
      d: "m16 18 6-6-6-6M8 6l-6 6 6 6"
    })),
    Filter: p => /*#__PURE__*/React.createElement(S, p, /*#__PURE__*/React.createElement("path", {
      d: "M22 3H2l8 9.5V19l4 2v-8.5L22 3Z"
    })),
    More: p => /*#__PURE__*/React.createElement(S, p, /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "5",
      r: "1.5"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "1.5"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "19",
      r: "1.5"
    })),
    Bell: p => /*#__PURE__*/React.createElement(S, p, /*#__PURE__*/React.createElement("path", {
      d: "M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M13.7 21a2 2 0 0 1-3.4 0"
    })),
    Refresh: p => /*#__PURE__*/React.createElement(S, p, /*#__PURE__*/React.createElement("path", {
      d: "M3 12a9 9 0 0 1 15-6.7L21 8"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M21 3v5h-5"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M21 12a9 9 0 0 1-15 6.7L3 16"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M3 21v-5h5"
    })),
    Trash: p => /*#__PURE__*/React.createElement(S, p, /*#__PURE__*/React.createElement("path", {
      d: "M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"
    })),
    Pin: p => /*#__PURE__*/React.createElement(S, p, /*#__PURE__*/React.createElement("path", {
      d: "M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "10",
      r: "3"
    })),
    Send: p => /*#__PURE__*/React.createElement(S, p, /*#__PURE__*/React.createElement("path", {
      d: "M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z"
    })),
    Eye: p => /*#__PURE__*/React.createElement(S, p, /*#__PURE__*/React.createElement("path", {
      d: "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "3"
    })),
    Alert: p => /*#__PURE__*/React.createElement(S, p, /*#__PURE__*/React.createElement("path", {
      d: "M12 9v4m0 4h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"
    })),
    Database: p => /*#__PURE__*/React.createElement(S, p, /*#__PURE__*/React.createElement("ellipse", {
      cx: "12",
      cy: "5",
      rx: "9",
      ry: "3"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M3 5v14a9 3 0 0 0 18 0V5M3 12a9 3 0 0 0 18 0"
    })),
    Clock: p => /*#__PURE__*/React.createElement(S, p, /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "9"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M12 7v5l3 2"
    })),
    Layers: p => /*#__PURE__*/React.createElement(S, p, /*#__PURE__*/React.createElement("path", {
      d: "m12 2 9 5-9 5-9-5 9-5Z"
    }), /*#__PURE__*/React.createElement("path", {
      d: "m3 12 9 5 9-5M3 17l9 5 9-5"
    }))
  };
  window.Icons = Icons;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/docubridge/icons.jsx", error: String((e && e.message) || e) }); }

__ds_ns.ExtractedField = __ds_scope.ExtractedField;

__ds_ns.StatCard = __ds_scope.StatCard;

__ds_ns.ConfidenceBadge = __ds_scope.ConfidenceBadge;

__ds_ns.EmptyState = __ds_scope.EmptyState;

__ds_ns.StatusBadge = __ds_scope.StatusBadge;

__ds_ns.ValidationMessage = __ds_scope.ValidationMessage;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.PageHeader = __ds_scope.PageHeader;

})();
