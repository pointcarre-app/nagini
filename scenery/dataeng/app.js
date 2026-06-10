/**
 * Snippets data engineering :: logique de la page
 * Un manager Pyodide (pandas + sqlite3 inclus), un éditeur CodeMirror,
 * une barre latérale par section du parcours, des variantes par snippet.
 * Les variantes runnable === false sont affichées en lecture seule.
 */

import { Nagini } from '../../src/nagini.js';
import { PYTHON } from './snippets-python.js';
import { COLLECTE } from './snippets-collecte.js';
import { SQL } from './snippets-sql.js';
import { SQL_AVANCE } from './snippets-sql-avance.js';
import { FLUX } from './snippets-flux.js';

const WORKER_PATH = '../../src/pyodide/worker/worker-dist.js';
// sqlite3 est « unvendored » dans Pyodide : il se charge comme un package
const PACKAGES = ['numpy', 'pandas', 'matplotlib', 'sqlite3'];
const TIMEOUT_MS = 90000;

const CATALOG = [...PYTHON, ...COLLECTE, ...SQL, ...SQL_AVANCE, ...FLUX];
const SECTIONS = [
  'Python pour la data',
  'Collecte',
  'SQL et bases de données',
  'Nettoyage et agrégation',
  'Entrepôt de données',
  'Data lake et flux',
  'Gouvernance et partage',
];

const THEMES = [
  'business', 'corporate', 'nord', 'winter', 'emerald', 'cupcake',
  'dark', 'dim', 'night', 'dracula', 'synthwave', 'retro',
];

const $ = (id) => document.getElementById(id);

let manager = null;
let editor = null;
let current = CATALOG[0];
let currentVariant = 0;
const edited = new Map();

// ---------------------------------------------------------------- thème

function applyTheme(name) {
  document.documentElement.setAttribute('data-theme', name);
  try { localStorage.setItem('dataeng-theme', name); } catch (_) { /* privé */ }
  $('theme-label').textContent = name;
  for (const li of $('theme-list').children) {
    li.querySelector('a').classList.toggle('menu-active', li.dataset.theme === name);
  }
  if (editor) editor.refresh();
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
      document.activeElement.blur();
    });
    li.appendChild(a);
    list.appendChild(li);
  }
  let saved = 'business';
  try { saved = localStorage.getItem('dataeng-theme') || 'business'; } catch (_) { /* privé */ }
  applyTheme(THEMES.includes(saved) ? saved : 'business');
}

// ---------------------------------------------------------------- statut

function setStatus(state, label) {
  $('status-text').textContent = label;
  $('status-led').className = 'status-led ' + state;
}

// ---------------------------------------------------------------- menu latéral

function buildSidebar() {
  const menu = $('sidebar-menu');
  menu.innerHTML = '';
  for (const section of SECTIONS) {
    const titre = document.createElement('li');
    titre.className = 'menu-title';
    titre.textContent = section;
    menu.appendChild(titre);
    for (const snippet of CATALOG.filter((s) => s.section === section)) {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.id = 'menu-' + snippet.id;
      a.textContent = snippet.titre;
      a.addEventListener('click', () => selectSnippet(snippet));
      li.appendChild(a);
      menu.appendChild(li);
    }
  }
}

function highlightSidebar() {
  for (const a of $('sidebar-menu').querySelectorAll('a')) {
    a.classList.toggle('menu-active', a.id === 'menu-' + current.id);
  }
}

// ---------------------------------------------------------------- sélection

function variantKey() {
  return current.id + '::' + currentVariant;
}

function isRunnable(variant) {
  return variant.runnable !== false;
}

function selectSnippet(snippet) {
  if (editor) edited.set(variantKey(), editor.getValue());
  current = snippet;
  currentVariant = 0;
  renderSnippet();
  const drawer = $('page-drawer');
  if (drawer) drawer.checked = false;
}

function selectVariant(index) {
  if (editor) edited.set(variantKey(), editor.getValue());
  currentVariant = index;
  renderVariantTabs();
  loadVariantInEditor();
  clearOutput();
}

function loadVariantInEditor() {
  const variant = current.variantes[currentVariant];
  const code = edited.get(variantKey()) ?? variant.code;
  // coloration : SQL si le code commence par un commentaire SQL
  const mode = code.trimStart().startsWith('--') ? 'text/x-sql' : 'python';
  editor.setOption('mode', mode);
  editor.setValue(code);
  updateRunButton();
}

function updateRunButton() {
  const variant = current.variantes[currentVariant];
  const runnable = isRunnable(variant);
  const btn = $('run-btn');
  btn.disabled = !runnable || !manager || !manager.isReady;
  $('readonly-badge').classList.toggle('hidden', runnable);
}

function renderVariantTabs() {
  const bar = $('variant-tabs');
  bar.innerHTML = '';
  current.variantes.forEach((v, i) => {
    const btn = document.createElement('button');
    btn.className = 'tab' + (i === currentVariant ? ' tab-active' : '');
    btn.textContent = v.label.toLowerCase() + (isRunnable(v) ? '' : ' 🔒');
    btn.addEventListener('click', () => selectVariant(i));
    bar.appendChild(btn);
  });
}

function renderSnippet() {
  highlightSidebar();
  $('algo-section').textContent = current.section;
  $('algo-competences').textContent = current.competences;
  $('algo-titre').textContent = current.titre;
  $('algo-contexte').textContent = current.contexte;
  $('algo-objectif').textContent = current.objectif;
  $('algo-idee').textContent = current.idee;
  $('algo-retenir').textContent = current.retenir;
  renderVariantTabs();
  loadVariantInEditor();
  clearOutput();
}

// ---------------------------------------------------------------- sorties

function clearOutput() {
  for (const id of ['out-stdout', 'out-stderr', 'out-missive']) $(id).textContent = '';
  $('figures').innerHTML = '';
  for (const id of ['panel-stdout', 'panel-stderr', 'panel-missive', 'panel-figures']) {
    $(id).classList.add('hidden');
  }
  $('exec-time').textContent = '';
  $('out-placeholder').classList.remove('hidden');
}

function show(panelId) {
  $(panelId).classList.remove('hidden');
  $('out-placeholder').classList.add('hidden');
}

function renderResult(result) {
  if (result.stdout && result.stdout.trim()) {
    $('out-stdout').textContent = result.stdout;
    show('panel-stdout');
  }
  if (result.stderr && result.stderr.trim()) {
    $('out-stderr').textContent = result.stderr;
    show('panel-stderr');
  }
  if (result.missive) {
    let pretty = result.missive;
    try { pretty = JSON.stringify(JSON.parse(result.missive), null, 2); } catch (_) { /* brut */ }
    $('out-missive').textContent = pretty;
    show('panel-missive');
  }
  if (result.figures && result.figures.length) {
    for (const b64 of result.figures) {
      const img = document.createElement('img');
      img.src = 'data:image/png;base64,' + b64;
      img.className = 'figure-img';
      $('figures').appendChild(img);
    }
    show('panel-figures');
  }
  $('exec-time').textContent = result.time != null ? `${result.time} ms` : '';
}

// ---------------------------------------------------------------- exécution

async function run() {
  if (!manager || !manager.isReady) return;
  if (!isRunnable(current.variantes[currentVariant])) return;
  const btn = $('run-btn');
  btn.disabled = true;
  clearOutput();
  setStatus('busy', 'exécution en cours');
  try {
    const result = await manager.executeAsync(
      current.id + '-' + currentVariant + '.py',
      editor.getValue(),
      undefined,
      TIMEOUT_MS
    );
    renderResult(result);
    setStatus('ready', 'prêt');
  } catch (e) {
    $('out-stderr').textContent = String(e);
    show('panel-stderr');
    setStatus('error', 'erreur');
  } finally {
    updateRunButton();
  }
}

function resetCode() {
  edited.delete(variantKey());
  loadVariantInEditor();
  clearOutput();
}

// ---------------------------------------------------------------- démarrage

async function boot() {
  buildThemeMenu();
  buildSidebar();

  editor = window.CodeMirror($('editor'), {
    value: '',
    mode: 'python',
    theme: 'lycee',
    lineNumbers: true,
    indentUnit: 4,
    scrollbarStyle: 'native',
    extraKeys: { 'Ctrl-Enter': run, 'Cmd-Enter': run },
  });

  renderSnippet();
  $('run-btn').addEventListener('click', run);
  $('reset-btn').addEventListener('click', resetCode);

  setStatus('boot', 'chargement de Python (pandas, numpy, sqlite3)');
  try {
    manager = await Nagini.createManager('pyodide', PACKAGES, [], [], WORKER_PATH);
    await Nagini.waitForReady(manager, 120000);
    window.manager = manager;
    window.CATALOG = CATALOG; // accès console et harnais de test
    setStatus('ready', 'prêt');
    updateRunButton();
  } catch (e) {
    setStatus('error', 'échec du chargement : ' + e.message);
  }
}

boot();
