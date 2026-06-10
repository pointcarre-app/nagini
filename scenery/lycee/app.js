/**
 * Algorithmes du lycée :: logique de la page
 * Un manager Pyodide, un éditeur CodeMirror, une barre latérale par niveau,
 * des variantes (algorithme / visualisation / plus loin) par entrée.
 */

import { Nagini } from '../../src/nagini.js';
import { SECONDE } from './algos-seconde.js';
import { PREMIERE } from './algos-premiere.js';
import { TERMINALE } from './algos-terminale.js';

const WORKER_PATH = '../../src/pyodide/worker/worker-dist.js';
const PACKAGES = ['numpy', 'matplotlib'];
const TIMEOUT_MS = 90000;

const CATALOG = [...SECONDE, ...PREMIERE, ...TERMINALE];
const NIVEAUX = ['Seconde', 'Première', 'Terminale'];

const THEMES = [
  'nord', 'winter', 'corporate', 'cupcake', 'emerald', 'retro',
  'dark', 'dim', 'night', 'business', 'dracula', 'synthwave',
];

const $ = (id) => document.getElementById(id);

let manager = null;
let editor = null;
let current = CATALOG[0];
let currentVariant = 0;
const edited = new Map(); // `${algoId}::${variantIndex}` -> code modifié

// ---------------------------------------------------------------- thème

function applyTheme(name) {
  document.documentElement.setAttribute('data-theme', name);
  try { localStorage.setItem('lycee-theme', name); } catch (_) { /* privé */ }
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
      document.activeElement.blur(); // referme le dropdown
    });
    li.appendChild(a);
    list.appendChild(li);
  }
  let saved = 'nord';
  try { saved = localStorage.getItem('lycee-theme') || 'nord'; } catch (_) { /* privé */ }
  applyTheme(THEMES.includes(saved) ? saved : 'nord');
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
  for (const niveau of NIVEAUX) {
    const titre = document.createElement('li');
    titre.className = 'menu-title';
    titre.textContent = niveau;
    menu.appendChild(titre);
    for (const algo of CATALOG.filter((a) => a.niveau === niveau)) {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.id = 'menu-' + algo.id;
      a.textContent = algo.titre;
      a.addEventListener('click', () => selectAlgo(algo));
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

function selectAlgo(algo) {
  if (editor) edited.set(variantKey(), editor.getValue());
  current = algo;
  currentVariant = 0;
  renderAlgo();
  const drawer = $('page-drawer');
  if (drawer) drawer.checked = false; // referme le tiroir sur mobile
}

function selectVariant(index) {
  if (editor) edited.set(variantKey(), editor.getValue());
  currentVariant = index;
  renderVariantTabs();
  editor.setValue(edited.get(variantKey()) ?? current.variantes[index].code);
  clearOutput();
}

function renderVariantTabs() {
  const bar = $('variant-tabs');
  bar.innerHTML = '';
  current.variantes.forEach((v, i) => {
    const btn = document.createElement('button');
    btn.className = 'tab' + (i === currentVariant ? ' tab-active' : '');
    btn.textContent = v.label.toLowerCase();
    btn.addEventListener('click', () => selectVariant(i));
    bar.appendChild(btn);
  });
}

function renderAlgo() {
  highlightSidebar();
  $('algo-niveau').textContent = current.niveau;
  $('algo-theme').textContent = current.theme;
  $('algo-titre').textContent = current.titre;
  $('algo-bo').textContent = current.bo;
  $('algo-objectif').textContent = current.objectif;
  $('algo-idee').textContent = current.idee;
  $('algo-retenir').textContent = current.retenir;
  renderVariantTabs();
  editor.setValue(edited.get(variantKey()) ?? current.variantes[currentVariant].code);
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
    btn.disabled = false;
  }
}

function resetCode() {
  edited.delete(variantKey());
  editor.setValue(current.variantes[currentVariant].code);
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

  renderAlgo();
  $('run-btn').addEventListener('click', run);
  $('reset-btn').addEventListener('click', resetCode);

  setStatus('boot', 'chargement de Python (numpy, matplotlib)');
  try {
    manager = await Nagini.createManager('pyodide', PACKAGES, [], [], WORKER_PATH);
    await Nagini.waitForReady(manager, 120000);
    window.manager = manager;
    window.CATALOG = CATALOG; // accès console et harnais de test
    setStatus('ready', 'prêt');
    $('run-btn').disabled = false;
  } catch (e) {
    setStatus('error', 'échec du chargement : ' + e.message);
  }
}

boot();
