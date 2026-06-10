/**
 * Atelier RGAA :: logique de la page
 * Résout les variables sémantiques daisyUI du thème actif (transparences
 * comprises), calcule les ratios de contraste WCAG et les confronte aux
 * seuils du RGAA. Les correspondances CodeMirror sont lues depuis l'atelier.
 */

const CUSTOM_THEMES = ['papier', 'encre', 'sauge'];

const DAISY_THEMES = [
  'light', 'dark', 'cupcake', 'bumblebee', 'emerald', 'corporate',
  'synthwave', 'retro', 'cyberpunk', 'valentine', 'halloween', 'garden',
  'forest', 'aqua', 'lofi', 'pastel', 'fantasy', 'wireframe', 'black',
  'luxury', 'dracula', 'cmyk', 'autumn', 'business', 'acid', 'lemonade',
  'night', 'coffee', 'winter', 'dim', 'nord', 'sunset', 'caramellatte',
  'abyss', 'silk',
];

const ALL_THEMES = [...CUSTOM_THEMES, ...DAISY_THEMES];

const COLOR_FAMILIES = ['primary', 'secondary', 'accent', 'neutral', 'info', 'success', 'warning', 'error'];
const ALL_TOKENS = [
  'base-100', 'base-200', 'base-300', 'base-content',
  ...COLOR_FAMILIES.flatMap((c) => [c, `${c}-content`]),
];

// Mêmes rôles et mêmes défauts que l'atelier : la clé localStorage est partagée.
const ATELIER_KEY = 'atelier-theme-builder-v1';
const ROLES_DEFAUT = {
  editorBg:     { token: 'base-100',     mix: 100 },
  editorFg:     { token: 'base-content', mix: 100 },
  gutterBg:     { token: 'base-100',     mix: 100 },
  gutterBorder: { token: 'base-300',     mix: 100 },
  lineNumbers:  { token: 'base-content', mix: 35 },
  cursor:       { token: 'primary',      mix: 100 },
  selection:    { token: 'primary',      mix: 18 },
  comment:      { token: 'base-content', mix: 50 },
  keyword:      { token: 'primary',      mix: 100 },
  builtin:      { token: 'secondary',    mix: 100 },
  def:          { token: 'secondary',    mix: 100 },
  number:       { token: 'accent',       mix: 100 },
  string:       { token: 'success',      mix: 100 },
  operator:     { token: 'base-content', mix: 100 },
  variable:     { token: 'base-content', mix: 100 },
  property:     { token: 'info',         mix: 100 },
  meta:         { token: 'warning',      mix: 100 },
};
const SYNTAX_ROLES = [
  ['comment', 'commentaire'], ['keyword', 'mot-clé'], ['builtin', 'fonction native'],
  ['def', 'définition'], ['number', 'nombre'], ['string', 'chaîne'],
  ['operator', 'opérateur'], ['variable', 'variable'], ['property', 'attribut'],
  ['meta', 'décorateur'],
];

const SAMPLE = `# dichotomie sur une liste triée
def cherche(valeurs, cible):
    """Renvoie un indice ou None."""
    gauche, droite = 0, len(valeurs) - 1
    while gauche <= droite:
        milieu = (gauche + droite) // 2
        if valeurs[milieu] == cible:
            return milieu
        if valeurs[milieu] < cible:
            gauche = milieu + 1
        else:
            droite = milieu - 1
    return None

print(cherche([1, 3, 5, 8, 13], 8))
`;

const STORAGE_KEY = 'atelier-rg2a-theme';
const $ = (id) => document.getElementById(id);

let editor = null;
let editorAction = null;
let mapping = structuredClone(ROLES_DEFAUT);

// ------------------------------------------------------------- correspondances

function loadMapping() {
  mapping = structuredClone(ROLES_DEFAUT);
  try {
    const raw = localStorage.getItem(ATELIER_KEY);
    if (!raw) return;
    const saved = JSON.parse(raw);
    for (const key of Object.keys(ROLES_DEFAUT)) {
      const m = saved.mapping && saved.mapping[key];
      if (m && ALL_TOKENS.includes(m.token) && m.mix >= 5 && m.mix <= 100) {
        mapping[key] = { token: m.token, mix: Math.round(m.mix) };
      }
    }
  } catch (_) { /* défauts */ }
}

function cssValue({ token, mix }) {
  const v = `var(--color-${token})`;
  return mix >= 100 ? v : `color-mix(in oklab, ${v} ${mix}%, transparent)`;
}

function buildEditorCss() {
  const m = (key) => cssValue(mapping[key]);
  return `.cm-s-atelier.CodeMirror { background: ${m('editorBg')}; color: ${m('editorFg')}; }
.cm-s-atelier .CodeMirror-gutters { background: ${m('gutterBg')}; border-right: 1px solid ${m('gutterBorder')}; }
.cm-s-atelier .CodeMirror-linenumber { color: ${m('lineNumbers')}; }
.cm-s-atelier .CodeMirror-cursor { border-left: 2px solid ${m('cursor')}; }
.cm-s-atelier .CodeMirror-selected,
.cm-s-atelier.CodeMirror-focused .CodeMirror-selected { background: ${m('selection')}; }
.cm-s-atelier span.cm-comment { color: ${m('comment')}; font-style: italic; }
.cm-s-atelier span.cm-keyword { color: ${m('keyword')}; font-weight: 600; }
.cm-s-atelier span.cm-builtin { color: ${m('builtin')}; }
.cm-s-atelier span.cm-def { color: ${m('def')}; }
.cm-s-atelier span.cm-number { color: ${m('number')}; }
.cm-s-atelier span.cm-string { color: ${m('string')}; }
.cm-s-atelier span.cm-operator { color: ${m('operator')}; }
.cm-s-atelier span.cm-variable { color: ${m('variable')}; }
.cm-s-atelier span.cm-property { color: ${m('property')}; }
.cm-s-atelier span.cm-meta { color: ${m('meta')}; }`;
}

// ------------------------------------------------------------- moteur couleur

// Sonde DOM : un conteneur dont on peut forcer le data-theme, un canvas 1px
// pour résoudre n'importe quelle expression CSS en sRGB (alpha compris).
const probeHost = document.createElement('div');
probeHost.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;';
const probe = document.createElement('div');
probeHost.appendChild(probe);
document.body.appendChild(probeHost);

const canvas = document.createElement('canvas');
canvas.width = canvas.height = 1;
const ctx = canvas.getContext('2d', { willReadFrequently: true });

// Résout une chaîne couleur déjà calculée (rgb, oklch, color-mix…) en sRGB
// prémultiplié + alpha, par double composition sur blanc puis sur noir.
function paintResolve(computed) {
  const paint = (bg) => {
    ctx.globalCompositeOperation = 'copy';
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 1, 1);
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = computed;
    ctx.fillRect(0, 0, 1, 1);
    return ctx.getImageData(0, 0, 1, 1).data;
  };
  const w = paint('#ffffff');
  const b = paint('#000000');
  const alpha = 1 - (w[0] - b[0] + w[1] - b[1] + w[2] - b[2]) / 765;
  return { pre: [b[0], b[1], b[2]], alpha: Math.min(1, Math.max(0, alpha)) };
}

function resolveColor(expr, themeName = null) {
  if (themeName) probeHost.setAttribute('data-theme', themeName);
  else probeHost.removeAttribute('data-theme');
  probe.style.color = 'rgb(0, 0, 0)';
  probe.style.color = expr;
  return paintResolve(getComputedStyle(probe).color);
}

// Compose une couleur (prémultipliée) sur un fond opaque [r, g, b].
function over(fg, bgRgb) {
  return [0, 1, 2].map((i) => fg.pre[i] + (1 - fg.alpha) * bgRgb[i]);
}

function luminance([r, g, b]) {
  const lin = (c) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

function contrast(rgbA, rgbB) {
  const [hi, lo] = [luminance(rgbA), luminance(rgbB)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

function levelOf(ratio) {
  if (ratio >= 7) return 'AAA';
  if (ratio >= 4.5) return 'AA';
  if (ratio >= 3) return 'AA grand';
  return 'échec';
}

function formatRatio(r) {
  return r.toFixed(2).replace('.', ',') + ':1';
}

// ------------------------------------------------------------- les deux matrices

const tokenVar = (t) => `var(--color-${t})`;

function interfacePairs(themeName = null) {
  const white = [255, 255, 255];
  const tok = (t) => resolveColor(tokenVar(t), themeName);
  const bg100 = over(tok('base-100'), white);
  const rows = [];
  const push = (label, fgRes, bgRgb, min, fgExpr, bgExpr) => {
    rows.push({ label, min, ratio: contrast(over(fgRes, bgRgb), bgRgb), fgExpr, bgExpr });
  };
  for (const [b, min] of [['base-100', 7], ['base-200', 7], ['base-300', 4.5]]) {
    push(`base-content / ${b}`, tok('base-content'), over(tok(b), white), min,
      tokenVar('base-content'), tokenVar(b));
  }
  for (const c of COLOR_FAMILIES) {
    push(`${c}-content / ${c}`, tok(`${c}-content`), over(tok(c), white), 4.5,
      tokenVar(`${c}-content`), tokenVar(c));
    push(`${c} / base-100`, tok(c), bg100, 4.5, tokenVar(c), tokenVar('base-100'));
  }
  return rows;
}

function editorPairs(themeName = null) {
  const white = [255, 255, 255];
  const res = (key) => resolveColor(cssValue(mapping[key]), themeName);
  const pageBg = over(resolveColor(tokenVar('base-100'), themeName), white);
  const editorBg = over(res('editorBg'), pageBg);
  const gutterBg = over(res('gutterBg'), editorBg);
  const selectionBg = over(res('selection'), editorBg);

  const rows = [];
  const push = (label, fgRes, bgRgb, min, fgExpr, bgExpr) => {
    rows.push({ label, min, ratio: contrast(over(fgRes, bgRgb), bgRgb), fgExpr, bgExpr });
  };
  push('texte / fond', res('editorFg'), editorBg, 4.5, cssValue(mapping.editorFg), cssValue(mapping.editorBg));
  push('numéros de ligne / gouttière', res('lineNumbers'), gutterBg, 4.5, cssValue(mapping.lineNumbers), cssValue(mapping.gutterBg));
  push('curseur / fond (composant)', res('cursor'), editorBg, 3, cssValue(mapping.cursor), cssValue(mapping.editorBg));
  push('bord gouttière / fond (composant)', res('gutterBorder'), gutterBg, 3, cssValue(mapping.gutterBorder), cssValue(mapping.gutterBg));
  push('texte / sélection', res('editorFg'), selectionBg, 4.5, cssValue(mapping.editorFg), cssValue(mapping.selection));
  for (const [key, label] of SYNTAX_ROLES) {
    push(`${label} / fond`, res(key), editorBg, 4.5, cssValue(mapping[key]), cssValue(mapping.editorBg));
  }
  return rows;
}

function countFails(themeName) {
  const fails = (rows) => rows.filter((r) => r.ratio < r.min).length;
  return {
    interface: fails(interfacePairs(themeName)),
    editor: fails(editorPairs(themeName)),
  };
}

// ------------------------------------------------------------- rendu

function badgeFor(row) {
  const level = levelOf(row.ratio);
  const conforme = row.ratio >= row.min;
  const cls = !conforme ? 'badge-error'
    : row.ratio >= 7 ? 'badge-success'
    : 'badge-success badge-soft';
  return `<span class="badge badge-sm ${cls}">${conforme ? level : 'sous le seuil'}</span>`;
}

function renderTable(hostId, rows) {
  const host = $(hostId);
  host.innerHTML = '';
  for (const row of rows) {
    const div = document.createElement('div');
    div.className = 'contrast-row';
    div.innerHTML = `
      <span class="contrast-sample" style="color: ${row.fgExpr}; background: ${row.bgExpr};">Aa</span>
      <span class="contrast-label">
        <span class="pair mono">${row.label}</span>
        <span class="min"> · min ${String(row.min).replace('.', ',')}:1</span>
      </span>
      <span class="contrast-ratio">${formatRatio(row.ratio)}</span>
      <span class="contrast-badge">${badgeFor(row)}</span>`;
    host.appendChild(div);
  }
}

function renderScore(id, rows) {
  const ok = rows.filter((r) => r.ratio >= r.min).length;
  const badge = $(id);
  badge.textContent = `${ok}/${rows.length} conformes`;
  badge.className = 'badge badge-sm ' + (ok === rows.length ? 'badge-success' : 'badge-error');
}

function renderMatrices() {
  const iRows = interfacePairs();
  const eRows = editorPairs();
  renderTable('interface-table', iRows);
  renderTable('editor-table', eRows);
  renderScore('interface-score', iRows);
  renderScore('editor-score', eRows);
}

// ------------------------------------------------------------- mise en action

// Couleurs effectives d'un élément rendu : texte (alpha et opacités héritées
// composés) et fond (remontée du DOM jusqu'à un fond opaque).
function effectiveColors(el) {
  const cs = getComputedStyle(el);
  const fg = paintResolve(cs.color);

  let opacityMul = 1;
  const layers = [];
  let node = el;
  while (node && node.nodeType === 1) {
    const ns = getComputedStyle(node);
    opacityMul *= parseFloat(ns.opacity) || 1;
    const bgc = paintResolve(ns.backgroundColor);
    if (bgc.alpha > 0) {
      layers.push(bgc);
      if (bgc.alpha >= 0.999) break;
    }
    node = node.parentElement;
  }
  let bg = [255, 255, 255];
  for (const layer of layers.reverse()) bg = over(layer, bg);

  return {
    fg: { pre: fg.pre.map((c) => c * opacityMul), alpha: fg.alpha * opacityMul },
    bg,
    fontSize: parseFloat(cs.fontSize),
    weight: parseInt(cs.fontWeight, 10) || 400,
  };
}

function annotate(el) {
  const { fg, bg, fontSize, weight } = effectiveColors(el);
  const ratio = contrast(over(fg, bg), bg);
  // texte agrandi au sens WCAG : 24px, ou 18,66px (14pt) en gras
  const large = fontSize >= 24 || (fontSize >= 18.66 && weight >= 700);
  const min = el.dataset.min ? parseFloat(el.dataset.min) : large ? 3 : 4.5;
  const ok = ratio >= min;

  const detail = `${el.dataset.check} · ${Math.round(fontSize)}px/${weight}`
    + `${large ? ' · grand' : ''} · ${formatRatio(ratio)} · min ${String(min).replace('.', ',')}:1`
    + ` · ${ok ? levelOf(ratio) : 'sous le seuil'}`;

  const display = getComputedStyle(el).display;
  const inline = display.startsWith('inline') || el.tagName === 'TH' || el.tagName === 'TD';
  const chip = document.createElement(inline ? 'span' : 'div');
  chip.className = (inline ? 'ctr-chip ' : 'ctr-note ') + (ok ? 'ok' : 'ko');
  chip.textContent = inline ? `${formatRatio(ratio)} ${ok ? levelOf(ratio) : 'KO'}` : detail;
  chip.title = detail;

  if (el.tagName === 'TH' || el.tagName === 'TD') el.appendChild(chip);
  else el.insertAdjacentElement('afterend', chip);
  return ok;
}

function renderAction() {
  const specimen = $('specimen');
  for (const old of specimen.querySelectorAll('.ctr-note, .ctr-chip')) old.remove();

  let ok = 0;
  const checks = specimen.querySelectorAll('[data-check]');
  for (const el of checks) {
    if (annotate(el)) ok += 1;
  }
  const badge = $('action-score');
  badge.textContent = `${ok}/${checks.length} conformes`;
  badge.className = 'badge badge-sm ' + (ok === checks.length ? 'badge-success' : 'badge-error');

  renderActionParams();
}

// Les autres paramètres qui comptent pour la lisibilité, lus sur le rendu réel.
function renderActionParams() {
  const host = $('action-params');
  const root = getComputedStyle(document.documentElement);
  const p = $('specimen').querySelector('p[data-check]');
  const ps = getComputedStyle(p);
  const interligne = (parseFloat(ps.lineHeight) / parseFloat(ps.fontSize)).toFixed(2).replace('.', ',');
  const cm = document.querySelector('#editor-action .CodeMirror');
  const entries = [
    ['police texte', ps.fontFamily.split(',')[0].replace(/["']/g, '')],
    ['police code', cm ? getComputedStyle(cm).fontFamily.split(',')[0].replace(/["']/g, '') : '?'],
    ['corps', Math.round(parseFloat(ps.fontSize)) + 'px'],
    ['interligne', '×' + interligne],
    ['--radius-box', root.getPropertyValue('--radius-box').trim() || '?'],
    ['--radius-selector', root.getPropertyValue('--radius-selector').trim() || '?'],
    ['--border', root.getPropertyValue('--border').trim() || '?'],
  ];
  host.innerHTML = entries
    .map(([k, v]) => `<span><span style="opacity:0.55;">${k}</span> ${v}</span>`)
    .join('');
}

// ------------------------------------------------------------- autres critères

// Critères RGAA/WCAG automatisables sur le spécimen, recalculés à chaque thème.
function checkCriteria() {
  const specimen = $('specimen');
  const rows = [];

  // interligne : au moins 1,5 fois le corps sur les blocs de texte
  let minLh = Infinity;
  for (const b of specimen.querySelectorAll('p, li, blockquote')) {
    const cs = getComputedStyle(b);
    const lh = parseFloat(cs.lineHeight) / parseFloat(cs.fontSize);
    if (lh < minLh) minLh = lh;
  }
  rows.push({
    label: 'interligne ≥ 1,5', ref: 'WCAG 1.4.12',
    ok: minLh >= 1.5, detail: '×' + minLh.toFixed(2).replace('.', ','),
  });

  // corps du texte courant
  const p = specimen.querySelector('p[data-check]');
  const corps = parseFloat(getComputedStyle(p).fontSize);
  rows.push({
    label: 'corps du texte ≥ 16px', ref: 'bonne pratique',
    ok: corps >= 16, detail: Math.round(corps) + 'px',
  });

  // liens repérables autrement que par la couleur seule : soulignement,
  // sinon 3:1 entre la couleur du lien et celle du texte qui l'entoure
  let linksOk = true;
  let linkDetail = 'soulignés';
  for (const a of specimen.querySelectorAll('a')) {
    const cs = getComputedStyle(a);
    if (!cs.textDecorationLine.includes('underline')) {
      const bg = effectiveColors(a).bg;
      const linkRgb = over(paintResolve(cs.color), bg);
      const textRgb = over(paintResolve(getComputedStyle(p).color), bg);
      const r = contrast(linkRgb, textRgb);
      linkDetail = formatRatio(r) + ' vs texte';
      if (r < 3) linksOk = false;
    }
  }
  rows.push({
    label: 'liens repérables sans la couleur seule', ref: 'RGAA 10.6',
    ok: linksOk, detail: linkDetail,
  });

  // hiérarchie des titres : commence à h1, aucun niveau sauté en descendant
  const levels = [...specimen.querySelectorAll('h1, h2, h3, h4, h5, h6')]
    .map((h) => Number(h.tagName[1]));
  let titlesOk = levels.length > 0 && levels[0] === 1;
  for (let i = 1; i < levels.length; i += 1) {
    if (levels[i] > levels[i - 1] + 1) titlesOk = false;
  }
  rows.push({
    label: 'hiérarchie des titres sans saut', ref: 'RGAA 9.1',
    ok: titlesOk, detail: levels.map((n) => 'h' + n).join(' → '),
  });

  // taille des cibles interactives : 24 px de côté minimum
  let minSide = Infinity;
  for (const b of specimen.querySelectorAll('button')) {
    const rect = b.getBoundingClientRect();
    minSide = Math.min(minSide, rect.width, rect.height);
  }
  rows.push({
    label: 'cibles ≥ 24×24 px', ref: 'WCAG 2.5.8',
    ok: minSide >= 24, detail: Math.round(minSide) + 'px',
  });

  // focus visible : le style doit changer quand l'élément prend le focus
  const snap = (el) => {
    const cs = getComputedStyle(el);
    return [cs.outlineStyle, cs.outlineWidth, cs.outlineColor, cs.boxShadow].join('|');
  };
  let focusOk = true;
  for (const el of [specimen.querySelector('a'), specimen.querySelector('button')]) {
    if (!el) continue;
    const before = snap(el);
    el.focus({ preventScroll: true });
    const changed = snap(el) !== before;
    el.blur();
    if (!changed) focusOk = false;
  }
  rows.push({
    label: 'focus visible (lien et bouton)', ref: 'RGAA 10.7',
    ok: focusOk, detail: focusOk ? 'contour détecté' : 'aucun changement',
  });

  // bordure du bouton contour : 3:1 contre le fond (composant d'interface)
  const outlineBtn = specimen.querySelector('[data-check="bouton contour"]');
  const btnBg = effectiveColors(outlineBtn).bg;
  const borderRgb = over(paintResolve(getComputedStyle(outlineBtn).borderTopColor), btnBg);
  const borderRatio = contrast(borderRgb, btnBg);
  rows.push({
    label: 'bordure de composant ≥ 3:1', ref: 'WCAG 1.4.11',
    ok: borderRatio >= 3, detail: formatRatio(borderRatio),
  });

  return rows;
}

function renderCriteria() {
  const rows = checkCriteria();
  const host = $('criteria-table');
  host.innerHTML = '';
  for (const row of rows) {
    const div = document.createElement('div');
    div.className = 'criteria-row';
    div.innerHTML = `
      <span class="criteria-label">
        <span>${row.label}</span>
        <span class="ref mono">${row.ref}</span>
      </span>
      <span class="mono criteria-detail">${row.detail}</span>
      <span class="badge badge-sm ${row.ok ? 'badge-success' : 'badge-error'}">${row.ok ? 'conforme' : 'KO'}</span>`;
    host.appendChild(div);
  }
  const ok = rows.filter((r) => r.ok).length;
  const badge = $('criteria-score');
  badge.textContent = `${ok}/${rows.length}`;
  badge.className = 'badge badge-sm ' + (ok === rows.length ? 'badge-success' : 'badge-error');
}

// ------------------------------------------------------------- thèmes candidats

const STRIP_TOKENS = ['base-100', 'base-200', 'base-300', 'primary', 'secondary', 'accent', 'info', 'success', 'warning', 'error'];

function renderCandidates() {
  const host = $('candidates');
  host.innerHTML = '';
  for (const name of CUSTOM_THEMES) {
    const fails = countFails(name);
    const card = document.createElement('div');
    card.className = 'candidate';
    card.setAttribute('data-theme', name); // les variables du candidat s'appliquent ici
    card.style.background = 'var(--color-base-100)';
    card.style.color = 'var(--color-base-content)';
    card.innerHTML = `
      <div class="strip">${STRIP_TOKENS.map((t) => `<span style="background: var(--color-${t});"></span>`).join('')}</div>
      <div class="candidate-head">
        <span class="font-semibold">${name}</span>
        <span class="flex items-center gap-2">
          <span class="badge badge-sm ${fails.interface === 0 ? 'badge-success' : 'badge-error'}">
            interface ${fails.interface === 0 ? 'conforme' : fails.interface + ' KO'}
          </span>
          <span class="badge badge-sm badge-soft ${fails.editor === 0 ? 'badge-success' : 'badge-warning'}">
            éditeur ${fails.editor === 0 ? 'conforme' : fails.editor + ' KO'}
          </span>
          <button class="btn btn-xs btn-primary" data-activate="${name}">activer</button>
        </span>
      </div>`;
    host.appendChild(card);
  }
  for (const btn of host.querySelectorAll('[data-activate]')) {
    btn.addEventListener('click', () => applyTheme(btn.dataset.activate));
  }
}

// ------------------------------------------------------------- paire libre

function buildPairSelects() {
  for (const [id, initial] of [['pair-fg', 'base-content'], ['pair-bg', 'base-100']]) {
    const select = $(id);
    for (const token of ALL_TOKENS) {
      const opt = document.createElement('option');
      opt.value = token;
      opt.textContent = token;
      opt.selected = token === initial;
      select.appendChild(opt);
    }
    select.addEventListener('change', renderPair);
  }
}

function renderPair() {
  const fg = $('pair-fg').value;
  const bg = $('pair-bg').value;
  const white = [255, 255, 255];
  const bgRgb = over(resolveColor(tokenVar(bg)), white);
  const ratio = contrast(over(resolveColor(tokenVar(fg)), bgRgb), bgRgb);
  const sample = $('pair-sample');
  sample.style.color = tokenVar(fg);
  sample.style.background = tokenVar(bg);
  $('pair-ratio').textContent = formatRatio(ratio);
  const level = levelOf(ratio);
  $('pair-badge').textContent = level;
  $('pair-badge').className = 'badge ' + (ratio >= 7 ? 'badge-success' : ratio >= 4.5 ? 'badge-success badge-soft' : ratio >= 3 ? 'badge-warning' : 'badge-error');
}

// ------------------------------------------------------------- thème actif

function applyTheme(name) {
  document.documentElement.setAttribute('data-theme', name);
  try { localStorage.setItem(STORAGE_KEY, name); } catch (_) { /* privé */ }
  $('theme-label').textContent = name;
  for (const li of $('theme-list').children) {
    const a = li.querySelector('a');
    if (a) a.classList.toggle('menu-active', li.dataset.theme === name);
  }
  if (editor) editor.refresh();
  if (editorAction) editorAction.refresh();
  renderMatrices();
  renderPair();
  renderAction();
  renderCriteria();
}

function buildThemeMenu() {
  const list = $('theme-list');
  const addTitle = (text) => {
    const li = document.createElement('li');
    li.className = 'menu-title';
    li.textContent = text;
    list.appendChild(li);
  };
  const addTheme = (t) => {
    const li = document.createElement('li');
    li.dataset.theme = t;
    const a = document.createElement('a');
    a.textContent = t;
    a.addEventListener('click', () => {
      applyTheme(t);
      document.activeElement.blur(); // referme le dropdown
    });
    li.appendChild(a);
    list.appendChild(li);
  };
  addTitle('candidats');
  CUSTOM_THEMES.forEach(addTheme);
  addTitle('daisyui');
  DAISY_THEMES.forEach(addTheme);
}

// ------------------------------------------------------------- démarrage

function refreshAll() {
  loadMapping();
  $('live-theme').textContent = buildEditorCss();
  renderMatrices();
  renderCandidates();
  renderPair();
  renderAction();
  renderCriteria();
}

function boot() {
  loadMapping();
  buildThemeMenu();
  buildPairSelects();
  $('live-theme').textContent = buildEditorCss();

  editor = window.CodeMirror($('editor'), {
    value: SAMPLE,
    mode: 'python',
    theme: 'atelier',
    lineNumbers: true,
    indentUnit: 4,
    scrollbarStyle: 'native',
  });

  editorAction = window.CodeMirror($('editor-action'), {
    value: SAMPLE,
    mode: 'python',
    theme: 'atelier',
    lineNumbers: true,
    indentUnit: 4,
    viewportMargin: Infinity,
    scrollbarStyle: 'native',
  });
  editorAction.getWrapperElement().dataset.check = 'bloc de code';

  $('action-toggle').addEventListener('change', (e) => {
    $('specimen').classList.toggle('hide-notes', !e.target.checked);
  });

  let saved = 'papier';
  try { saved = localStorage.getItem(STORAGE_KEY) || 'papier'; } catch (_) { /* privé */ }
  // ?theme=encre force un thème : lien partageable, et testable en headless
  const urlTheme = new URLSearchParams(location.search).get('theme');
  if (urlTheme && ALL_THEMES.includes(urlTheme)) saved = urlTheme;
  applyTheme(ALL_THEMES.includes(saved) ? saved : 'papier');
  renderCandidates();

  // les réglages changés dans l'atelier (autre onglet) se répercutent ici
  window.addEventListener('storage', (e) => {
    if (e.key === ATELIER_KEY) refreshAll();
  });
}

boot();
