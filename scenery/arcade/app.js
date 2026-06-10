/**
 * L'arcade du data engineer :: logique du jeu
 * Mode défis : code à trous validé par des tests dans Pyodide, chrono,
 * records en localStorage. Mode sprint : trous de code en JS pur,
 * 10 questions contre la montre.
 */

import { Nagini } from '../../src/nagini.js';
import { DEFIS } from './defis.js';
import { SPRINT } from './sprint.js';

const WORKER_PATH = '../../src/pyodide/worker/worker-dist.js';
const NIVEAUX = ['échauffement', 'solide', 'costaud'];
const THEMES = [
  'nord', 'winter', 'corporate', 'cupcake', 'emerald', 'retro',
  'dark', 'dim', 'night', 'business', 'dracula', 'synthwave',
];

const $ = (id) => document.getElementById(id);

let manager = null;
let editor = null;
let current = DEFIS[0];
const edited = new Map();

// ---------------------------------------------------------------- stockage

function lireRecords() {
  try { return JSON.parse(localStorage.getItem('arcade-records') || '{}'); }
  catch (_) { return {}; }
}

function ecrireRecord(defiId, secondes) {
  const records = lireRecords();
  if (records[defiId] == null || secondes < records[defiId]) {
    records[defiId] = secondes;
    try { localStorage.setItem('arcade-records', JSON.stringify(records)); } catch (_) { /* privé */ }
    return true;
  }
  return false;
}

function formatTemps(s) {
  const m = Math.floor(s / 60);
  return m > 0 ? `${m} min ${String(Math.round(s % 60)).padStart(2, '0')} s`
               : `${s.toFixed(1)} s`;
}

// ---------------------------------------------------------------- thème

function applyTheme(name) {
  document.documentElement.setAttribute('data-theme', name);
  try { localStorage.setItem('arcade-theme', name); } catch (_) { /* privé */ }
  $('theme-label').textContent = name;
  if (editor) editor.refresh();
}

function buildThemeMenu() {
  const list = $('theme-list');
  for (const t of THEMES) {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.textContent = t;
    a.addEventListener('click', () => { applyTheme(t); document.activeElement.blur(); });
    li.appendChild(a);
    list.appendChild(li);
  }
  let saved = 'night';
  try { saved = localStorage.getItem('arcade-theme') || 'night'; } catch (_) { /* privé */ }
  applyTheme(THEMES.includes(saved) ? saved : 'night');
}

// ---------------------------------------------------------------- statut

function setStatus(state, label) {
  $('status-text').textContent = label;
  $('status-led').className = 'status-led ' + state;
}

// ---------------------------------------------------------------- chrono défi

let chronoDebut = null;
let chronoTimer = null;
let chronoFige = false;

function chronoReset() {
  chronoDebut = performance.now();
  chronoFige = false;
  clearInterval(chronoTimer);
  chronoTimer = setInterval(() => {
    if (!chronoFige) {
      $('chrono').textContent = formatTemps((performance.now() - chronoDebut) / 1000);
    }
  }, 100);
}

function chronoSecondes() {
  return (performance.now() - chronoDebut) / 1000;
}

// ---------------------------------------------------------------- mode défis

function buildSidebar() {
  const menu = $('sidebar-menu');
  menu.innerHTML = '';
  const records = lireRecords();
  for (const niveau of NIVEAUX) {
    const titre = document.createElement('li');
    titre.className = 'menu-title';
    titre.textContent = niveau;
    menu.appendChild(titre);
    for (const defi of DEFIS.filter((d) => d.niveau === niveau)) {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.id = 'menu-' + defi.id;
      const record = records[defi.id];
      a.innerHTML = '';
      a.append(defi.titre + (record != null ? ' ' : ''));
      if (record != null) {
        const badge = document.createElement('span');
        badge.className = 'badge badge-success badge-xs ml-auto';
        badge.textContent = '★ ' + formatTemps(record);
        a.appendChild(badge);
      }
      a.addEventListener('click', () => selectDefi(defi));
      li.appendChild(a);
      menu.appendChild(li);
    }
  }
  for (const a of menu.querySelectorAll('a')) {
    a.classList.toggle('menu-active', a.id === 'menu-' + current.id);
  }
}

function selectDefi(defi) {
  if (editor) edited.set(current.id, editor.getValue());
  current = defi;
  buildSidebar();
  $('defi-niveau').textContent = defi.niveau;
  $('defi-titre').textContent = defi.titre;
  $('defi-brief').textContent = defi.brief;
  $('indice-texte').textContent = defi.indice;
  $('indice-bloc').classList.add('hidden');
  $('resultats').innerHTML = '';
  $('victoire').classList.add('hidden');
  $('erreur-bloc').classList.add('hidden');
  editor.setValue(edited.get(defi.id) ?? defi.code);
  chronoReset();
  const drawer = $('page-drawer');
  if (drawer) drawer.checked = false;
}

function harnais(codeEleve, tests) {
  return codeEleve + `


# ---- vérification automatique ----
_resultats = []
def _check(nom, condition):
    _resultats.append({"nom": nom, "ok": bool(condition)})

` + tests + `

missive({"resultats": _resultats})
`;
}

async function tester() {
  if (!manager || !manager.isReady) return;
  const btn = $('tester-btn');
  btn.disabled = true;
  $('erreur-bloc').classList.add('hidden');
  $('resultats').innerHTML = '<span class="loading loading-dots loading-sm"></span>';
  setStatus('busy', 'tests en cours');
  try {
    const result = await manager.executeAsync(
      'defi-' + current.id + '.py',
      harnais(editor.getValue(), current.tests),
      {},                      // namespace isolé : un défi ne pollue pas l'autre
      30000
    );
    $('resultats').innerHTML = '';
    if (result.error || !result.missive) {
      $('erreur-texte').textContent =
        (result.error ? result.error.message : 'aucun résultat') +
        (result.stderr ? '\n\n' + result.stderr.trim().split('\n').slice(-12).join('\n') : '');
      $('erreur-bloc').classList.remove('hidden');
      setStatus('ready', 'prêt');
      return;
    }
    const { resultats } = JSON.parse(result.missive);
    let ok = 0;
    for (const r of resultats) {
      const ligne = document.createElement('div');
      ligne.className = 'flex items-center gap-2 text-sm py-0.5';
      ligne.innerHTML = `<span class="badge badge-xs ${r.ok ? 'badge-success' : 'badge-error'}">${r.ok ? '✓' : '✗'}</span>`;
      ligne.append(' ' + r.nom);
      $('resultats').appendChild(ligne);
      if (r.ok) ok += 1;
    }
    if (resultats.length > 0 && ok === resultats.length) {
      chronoFige = true;
      const secondes = chronoSecondes();
      const nouveau = ecrireRecord(current.id, Math.round(secondes * 10) / 10);
      $('victoire-texte').textContent =
        `Défi réussi en ${formatTemps(secondes)}` +
        (nouveau ? ' : nouveau record !' : ` (record : ${formatTemps(lireRecords()[current.id])})`);
      $('victoire').classList.remove('hidden');
      buildSidebar();
    }
    setStatus('ready', 'prêt');
  } catch (e) {
    $('resultats').innerHTML = '';
    $('erreur-texte').textContent = String(e);
    $('erreur-bloc').classList.remove('hidden');
    setStatus('error', 'erreur');
  } finally {
    btn.disabled = false;
  }
}

// ---------------------------------------------------------------- mode sprint

const SPRINT_NB = 10;
let sprint = null;

function normaliser(s) {
  return s.trim().replace(/\s+/g, ' ');
}

function lireMeilleurSprint() {
  try { return JSON.parse(localStorage.getItem('arcade-sprint') || 'null'); }
  catch (_) { return null; }
}

function demarrerSprint() {
  const questions = [...SPRINT].sort(() => Math.random() - 0.5).slice(0, SPRINT_NB);
  sprint = {
    questions, index: 0, bonnes: 0, debut: performance.now(),
    journal: [],
  };
  $('sprint-accueil').classList.add('hidden');
  $('sprint-fin').classList.add('hidden');
  $('sprint-jeu').classList.remove('hidden');
  clearInterval(chronoTimer);
  chronoTimer = setInterval(() => {
    $('sprint-chrono').textContent = formatTemps((performance.now() - sprint.debut) / 1000);
  }, 100);
  afficherQuestion();
}

function afficherQuestion() {
  const q = sprint.questions[sprint.index];
  $('sprint-progress').textContent = `${sprint.index + 1} / ${SPRINT_NB}`;
  $('sprint-code').textContent = q.code;
  $('sprint-reponse').value = '';
  $('sprint-feedback').textContent = '';
  $('sprint-feedback').className = 'text-sm h-5';
  $('sprint-reponse').focus();
}

function validerSprint() {
  const q = sprint.questions[sprint.index];
  const reponse = normaliser($('sprint-reponse').value);
  if (!reponse) return;
  if (q.reponses.some((r) => normaliser(r) === reponse)) {
    sprint.bonnes += 1;
    sprint.journal.push({ q, reponse, ok: true });
    questionSuivante();
  } else {
    $('sprint-feedback').textContent = 'non, essaie encore (ou passe)';
    $('sprint-feedback').className = 'text-sm h-5 text-error';
    $('sprint-reponse').select();
  }
}

function passerSprint() {
  const q = sprint.questions[sprint.index];
  sprint.journal.push({ q, reponse: null, ok: false });
  questionSuivante();
}

function questionSuivante() {
  sprint.index += 1;
  if (sprint.index < SPRINT_NB) {
    afficherQuestion();
    return;
  }
  clearInterval(chronoTimer);
  const secondes = (performance.now() - sprint.debut) / 1000;
  $('sprint-jeu').classList.add('hidden');
  $('sprint-fin').classList.remove('hidden');
  $('sprint-score').textContent = `${sprint.bonnes} / ${SPRINT_NB} en ${formatTemps(secondes)}`;

  const meilleur = lireMeilleurSprint();
  const bat = !meilleur || sprint.bonnes > meilleur.bonnes ||
    (sprint.bonnes === meilleur.bonnes && secondes < meilleur.secondes);
  if (bat) {
    try {
      localStorage.setItem('arcade-sprint',
        JSON.stringify({ bonnes: sprint.bonnes, secondes: Math.round(secondes * 10) / 10 }));
    } catch (_) { /* privé */ }
  }
  $('sprint-record').textContent = bat
    ? 'nouveau record personnel !'
    : `record à battre : ${meilleur.bonnes} / ${SPRINT_NB} en ${formatTemps(meilleur.secondes)}`;

  const recap = $('sprint-recap');
  recap.innerHTML = '';
  for (const { q, reponse, ok } of sprint.journal) {
    const bloc = document.createElement('div');
    bloc.className = 'border border-base-300 rounded-box p-3 text-sm';
    const pre = document.createElement('pre');
    pre.className = 'mono text-xs whitespace-pre-wrap m-0 mb-1 opacity-80';
    pre.textContent = q.code.replace('____', '[ ' + q.reponses[0] + ' ]');
    const ligne = document.createElement('div');
    ligne.innerHTML = `<span class="badge badge-xs ${ok ? 'badge-success' : 'badge-error'}">${ok ? '✓' : '✗'}</span>`;
    ligne.append(` ${ok ? 'trouvé' : 'manqué'} : ${q.explication}`);
    bloc.append(pre, ligne);
    recap.appendChild(bloc);
  }
}

// ---------------------------------------------------------------- modes

function montrerMode(mode) {
  $('mode-defis').classList.toggle('hidden', mode !== 'defis');
  $('mode-sprint').classList.toggle('hidden', mode !== 'sprint');
  $('tab-defis').classList.toggle('tab-active', mode === 'defis');
  $('tab-sprint').classList.toggle('tab-active', mode === 'sprint');
  if (mode === 'defis' && editor) {
    editor.refresh();
    if (!chronoFige) chronoReset();
  }
  if (mode === 'sprint') {
    clearInterval(chronoTimer);
    const meilleur = lireMeilleurSprint();
    $('sprint-meilleur').textContent = meilleur
      ? `record personnel : ${meilleur.bonnes} / ${SPRINT_NB} en ${formatTemps(meilleur.secondes)}`
      : 'aucun record pour l\'instant : à toi de jouer';
  }
}

// ---------------------------------------------------------------- boot

async function boot() {
  buildThemeMenu();

  editor = window.CodeMirror($('editor'), {
    value: '',
    mode: 'python',
    theme: 'lycee',
    lineNumbers: true,
    indentUnit: 4,
    scrollbarStyle: 'native',
    extraKeys: { 'Ctrl-Enter': tester, 'Cmd-Enter': tester },
  });

  buildSidebar();
  selectDefi(current);

  $('tab-defis').addEventListener('click', () => montrerMode('defis'));
  $('tab-sprint').addEventListener('click', () => montrerMode('sprint'));
  $('tester-btn').addEventListener('click', tester);
  $('reset-btn').addEventListener('click', () => {
    edited.delete(current.id);
    editor.setValue(current.code);
    $('resultats').innerHTML = '';
    $('victoire').classList.add('hidden');
    $('erreur-bloc').classList.add('hidden');
    chronoReset();
  });
  $('indice-btn').addEventListener('click', () => $('indice-bloc').classList.toggle('hidden'));
  $('solution-btn').addEventListener('click', () => {
    if (window.confirm('Afficher la solution ? Le chrono ne compte plus vraiment...')) {
      editor.setValue(current.solution);
    }
  });
  $('sprint-start').addEventListener('click', demarrerSprint);
  $('sprint-rejouer').addEventListener('click', demarrerSprint);
  $('sprint-valider').addEventListener('click', validerSprint);
  $('sprint-passer').addEventListener('click', passerSprint);
  $('sprint-reponse').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') validerSprint();
  });

  setStatus('boot', 'chargement de Python');
  try {
    manager = await Nagini.createManager('pyodide', [], [], [], WORKER_PATH);
    await Nagini.waitForReady(manager, 120000);
    window.manager = manager;
    window.DEFIS = DEFIS; // harnais de test
    setStatus('ready', 'prêt');
    $('tester-btn').disabled = false;
  } catch (e) {
    setStatus('error', 'échec du chargement : ' + e.message);
  }
}

boot();
