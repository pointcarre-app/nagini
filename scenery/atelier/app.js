/**
 * Atelier de thème :: logique de la page
 * Chaque rôle CodeMirror (mot-clé, chaîne, curseur…) est associé à une
 * variable sémantique daisyUI (--color-base-100, --color-primary…), avec un
 * pourcentage de mélange optionnel. Le CSS est régénéré en direct et copiable.
 */

const THEMES = [
  'light', 'dark', 'cupcake', 'bumblebee', 'emerald', 'corporate',
  'synthwave', 'retro', 'cyberpunk', 'valentine', 'halloween', 'garden',
  'forest', 'aqua', 'lofi', 'pastel', 'fantasy', 'wireframe', 'black',
  'luxury', 'dracula', 'cmyk', 'autumn', 'business', 'acid', 'lemonade',
  'night', 'coffee', 'winter', 'dim', 'nord', 'sunset', 'caramellatte',
  'abyss', 'silk',
];

// Toutes les couleurs sémantiques de daisyUI v5, formalisme long uniquement.
const TOKEN_GROUPS = [
  { label: 'surfaces', tokens: ['base-100', 'base-200', 'base-300', 'base-content'] },
  { label: 'marque', tokens: ['primary', 'primary-content', 'secondary', 'secondary-content', 'accent', 'accent-content', 'neutral', 'neutral-content'] },
  { label: 'états', tokens: ['info', 'info-content', 'success', 'success-content', 'warning', 'warning-content', 'error', 'error-content'] },
];
const ALL_TOKENS = TOKEN_GROUPS.flatMap((g) => g.tokens);

// Les rôles de l'éditeur, leurs valeurs par défaut (celles de la page lycée).
const ROLES = [
  { key: 'editorBg',     group: 'surface', label: 'fond éditeur',     token: 'base-100',     mix: 100 },
  { key: 'editorFg',     group: 'surface', label: 'texte',            token: 'base-content', mix: 100 },
  { key: 'gutterBg',     group: 'surface', label: 'fond gouttière',   token: 'base-100',     mix: 100 },
  { key: 'gutterBorder', group: 'surface', label: 'bord gouttière',   token: 'base-300',     mix: 100 },
  { key: 'lineNumbers',  group: 'surface', label: 'numéros de ligne', token: 'base-content', mix: 35 },
  { key: 'cursor',       group: 'surface', label: 'curseur',          token: 'primary',      mix: 100 },
  { key: 'selection',    group: 'surface', label: 'sélection',        token: 'primary',      mix: 18 },
  { key: 'comment',      group: 'syntaxe', label: 'commentaire',      token: 'base-content', mix: 50 },
  { key: 'keyword',      group: 'syntaxe', label: 'mot-clé',          token: 'primary',      mix: 100 },
  { key: 'builtin',      group: 'syntaxe', label: 'fonction native',  token: 'secondary',    mix: 100 },
  { key: 'def',          group: 'syntaxe', label: 'définition',       token: 'secondary',    mix: 100 },
  { key: 'number',       group: 'syntaxe', label: 'nombre',           token: 'accent',       mix: 100 },
  { key: 'string',       group: 'syntaxe', label: 'chaîne',           token: 'success',      mix: 100 },
  { key: 'operator',     group: 'syntaxe', label: 'opérateur',        token: 'base-content', mix: 100 },
  { key: 'variable',     group: 'syntaxe', label: 'variable',         token: 'base-content', mix: 100 },
  { key: 'property',     group: 'syntaxe', label: 'attribut',         token: 'info',         mix: 100 },
  { key: 'meta',         group: 'syntaxe', label: 'décorateur',       token: 'warning',      mix: 100 },
];

const SAMPLE = `# parcours en largeur, version itérative
from collections import deque

VISITES_MAX = 1_000

class Graphe:
    """Un graphe orienté minimal."""

    def __init__(self, sommets):
        self.sommets = sommets
        self.arcs = {}

    @staticmethod
    def identifiant(nom):
        return nom.strip().lower()

    def ajouter(self, depart, arrivee, poids=1.0):
        self.arcs.setdefault(depart, []).append((arrivee, poids))

    def largeur(self, origine):
        vus = {origine}
        file = deque([origine])
        while file:
            sommet = file.popleft()
            for voisin, _ in self.arcs.get(sommet, []):
                if voisin not in vus and len(vus) < VISITES_MAX:
                    vus.add(voisin)
                    file.append(voisin)
        return vus

g = Graphe(["a", "b", "c"])
g.ajouter("a", "b", poids=2.5)
print(f"sommets atteints : {sorted(g.largeur('a'))}")
`;

const STORAGE_KEY = 'atelier-theme-builder-v1';
const $ = (id) => document.getElementById(id);

let editor = null;
// état courant : { theme, mapping: { roleKey: { token, mix } } }
const state = {
  theme: 'nord',
  mapping: Object.fromEntries(ROLES.map((r) => [r.key, { token: r.token, mix: r.mix }])),
};

// ---------------------------------------------------------------- persistance

function save() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (_) { /* privé */ }
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const saved = JSON.parse(raw);
    if (THEMES.includes(saved.theme)) state.theme = saved.theme;
    for (const role of ROLES) {
      const m = saved.mapping && saved.mapping[role.key];
      if (m && ALL_TOKENS.includes(m.token) && m.mix >= 5 && m.mix <= 100) {
        state.mapping[role.key] = { token: m.token, mix: Math.round(m.mix) };
      }
    }
  } catch (_) { /* on repart des défauts */ }
}

// ---------------------------------------------------------------- css

function cssValue({ token, mix }) {
  const v = `var(--color-${token})`;
  return mix >= 100 ? v : `color-mix(in oklab, ${v} ${mix}%, transparent)`;
}

function buildCss() {
  const m = (key) => cssValue(state.mapping[key]);
  return `/* Thème CodeMirror « atelier », branché sur les variables daisyUI.
   Il suit le thème actif (data-theme) sans une seule couleur codée en dur. */
.cm-s-atelier.CodeMirror {
  background: ${m('editorBg')};
  color: ${m('editorFg')};
}
.cm-s-atelier .CodeMirror-gutters {
  background: ${m('gutterBg')};
  border-right: 1px solid ${m('gutterBorder')};
}
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
.cm-s-atelier span.cm-meta { color: ${m('meta')}; }
`;
}

function applyCss() {
  const css = buildCss();
  $('live-theme').textContent = css;
  $('css-out').textContent = css;
}

// ---------------------------------------------------------------- thème daisyUI

function applyTheme(name) {
  state.theme = name;
  document.documentElement.setAttribute('data-theme', name);
  $('theme-label').textContent = name;
  for (const li of $('theme-list').children) {
    li.querySelector('a').classList.toggle('menu-active', li.dataset.theme === name);
  }
  if (editor) editor.refresh();
  save();
}

function buildThemeMenu() {
  const list = $('theme-list');
  for (const t of THEMES) {
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
  }
}

// ---------------------------------------------------------------- lignes de réglage

function buildTokenSelect(selected) {
  const select = document.createElement('select');
  select.className = 'select select-xs select-bordered w-full mono';
  for (const group of TOKEN_GROUPS) {
    const og = document.createElement('optgroup');
    og.label = group.label;
    for (const token of group.tokens) {
      const opt = document.createElement('option');
      opt.value = token;
      opt.textContent = token;
      opt.selected = token === selected;
      og.appendChild(opt);
    }
    select.appendChild(og);
  }
  return select;
}

function buildRoleRow(role) {
  const m = state.mapping[role.key];
  const row = document.createElement('div');
  row.className = 'role-row';

  const label = document.createElement('span');
  label.className = 'role-label';
  label.textContent = role.label;

  const swatch = document.createElement('span');
  swatch.className = 'swatch';

  const select = buildTokenSelect(m.token);

  const range = document.createElement('input');
  range.type = 'range';
  range.min = '5';
  range.max = '100';
  range.step = '5';
  range.value = String(m.mix);
  range.className = 'range range-xs range-primary';

  const pct = document.createElement('span');
  pct.className = 'role-mix mono';

  const sync = () => {
    swatch.style.background = `var(--color-${m.token})`;
    swatch.style.opacity = String(m.mix / 100);
    pct.textContent = m.mix + '%';
  };

  select.addEventListener('change', () => {
    m.token = select.value;
    sync();
    applyCss();
    save();
  });
  range.addEventListener('input', () => {
    m.mix = Number(range.value);
    sync();
    applyCss();
    save();
  });

  sync();
  row.append(label, swatch, select, range, pct);
  return { row, sync, select, range };
}

const rowControls = new Map(); // roleKey -> { sync, select, range }

function buildRolePanel() {
  const host = $('roles');
  host.innerHTML = '';
  rowControls.clear();
  let lastGroup = null;
  for (const role of ROLES) {
    if (role.group !== lastGroup) {
      const title = document.createElement('div');
      title.className = 'group-title';
      title.textContent = role.group;
      host.appendChild(title);
      lastGroup = role.group;
    }
    const { row, sync, select, range } = buildRoleRow(role);
    host.appendChild(row);
    rowControls.set(role.key, { sync, select, range });
  }
}

function refreshRows() {
  for (const role of ROLES) {
    const m = state.mapping[role.key];
    const c = rowControls.get(role.key);
    c.select.value = m.token;
    c.range.value = String(m.mix);
    c.sync();
  }
}

// ---------------------------------------------------------------- palette

function buildPalette() {
  const host = $('palette');
  for (const token of ALL_TOKENS) {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'palette-chip';
    chip.title = `copier var(--color-${token})`;

    const color = document.createElement('div');
    color.className = 'chip-color';
    color.style.background = `var(--color-${token})`;

    const name = document.createElement('div');
    name.className = 'chip-name';
    name.textContent = token;

    chip.append(color, name);
    chip.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(`var(--color-${token})`);
        name.textContent = 'copié !';
        setTimeout(() => { name.textContent = token; }, 900);
      } catch (_) { /* presse-papier refusé */ }
    });
    host.appendChild(chip);
  }
}

// ---------------------------------------------------------------- boutons

function resetMapping() {
  for (const role of ROLES) {
    state.mapping[role.key] = { token: role.token, mix: role.mix };
  }
  refreshRows();
  applyCss();
  save();
}

// L'aléatoire ne touche que la syntaxe : les surfaces resteraient illisibles.
const RANDOM_POOL = [
  'primary', 'secondary', 'accent', 'info', 'success', 'warning', 'error',
  'base-content', 'neutral-content',
];

function randomizeSyntax() {
  for (const role of ROLES.filter((r) => r.group === 'syntaxe')) {
    const pick = RANDOM_POOL[Math.floor(Math.random() * RANDOM_POOL.length)];
    state.mapping[role.key].token = pick;
  }
  refreshRows();
  applyCss();
  save();
}

async function copyCss() {
  const btn = $('copy-btn');
  try {
    await navigator.clipboard.writeText(buildCss());
    btn.textContent = 'copié !';
  } catch (_) {
    btn.textContent = 'échec';
  }
  setTimeout(() => { btn.textContent = 'copier'; }, 900);
}

// ---------------------------------------------------------------- démarrage

function boot() {
  load();
  buildThemeMenu();
  applyTheme(state.theme);
  buildRolePanel();
  buildPalette();
  applyCss();

  editor = window.CodeMirror($('editor'), {
    value: SAMPLE,
    mode: 'python',
    theme: 'atelier',
    lineNumbers: true,
    indentUnit: 4,
    scrollbarStyle: 'native',
  });

  $('reset-btn').addEventListener('click', resetMapping);
  $('random-btn').addEventListener('click', randomizeSyntax);
  $('copy-btn').addEventListener('click', copyCss);
}

boot();
