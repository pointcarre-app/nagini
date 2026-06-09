/**
 * Nagini showcase :: page logic
 * One Pyodide manager, one CodeMirror editor, tabs to switch examples.
 */

import { Nagini } from '../../src/nagini.js';
import { EXAMPLES } from './examples.js';

const WORKER_PATH = '../../src/pyodide/worker/worker-dist.js';
const PACKAGES = ['numpy', 'matplotlib', 'bokeh', 'sympy'];
const DEFAULT_TIMEOUT_MS = 60000;

const $ = (id) => document.getElementById(id);

let manager = null;
let editor = null;
let current = EXAMPLES[0];
const editedCode = new Map(); // example id -> last edited source

// ---------------------------------------------------------------- status

function setStatus(state, label) {
  const led = $('status-led');
  const txt = $('status-text');
  txt.textContent = label;
  led.className = 'status-led ' + state; // boot | ready | busy | error
}

// ---------------------------------------------------------------- tabs

function renderTabs() {
  const bar = $('tabs');
  bar.innerHTML = '';
  for (const ex of EXAMPLES) {
    const btn = document.createElement('button');
    btn.className = 'tab' + (ex.id === current.id ? ' tab-active' : '');
    btn.textContent = ex.tab;
    btn.addEventListener('click', () => selectExample(ex));
    bar.appendChild(btn);
  }
}

function selectExample(ex) {
  if (editor) editedCode.set(current.id, editor.getValue());
  current = ex;
  renderTabs();
  $('example-title').textContent = ex.title;
  $('example-desc').textContent = ex.desc;
  editor.setValue(editedCode.get(ex.id) ?? ex.code);
  clearOutput();
}

// ---------------------------------------------------------------- output

function clearOutput() {
  for (const id of ['out-stdout', 'out-stderr', 'out-missive']) $(id).textContent = '';
  $('figures').innerHTML = '';
  for (const id of ['panel-stdout', 'panel-stderr', 'panel-missive', 'panel-figures']) {
    $(id).classList.add('hidden');
  }
  $('exec-time').textContent = '';
  $('out-placeholder').classList.remove('hidden');
  hideStdinBar();
}

function show(panelId) {
  $(panelId).classList.remove('hidden');
  $('out-placeholder').classList.add('hidden');
}

let bokehCounter = 0;

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
    try { pretty = JSON.stringify(JSON.parse(result.missive), null, 2); } catch (_) { /* keep raw */ }
    $('out-missive').textContent = pretty;
    show('panel-missive');
  }

  const figures = $('figures');
  if (result.figures && result.figures.length) {
    for (const b64 of result.figures) {
      const img = document.createElement('img');
      img.src = 'data:image/png;base64,' + b64;
      img.className = 'figure-img';
      figures.appendChild(img);
    }
    show('panel-figures');
  }
  if (result.bokeh_figures && result.bokeh_figures.length && window.Bokeh) {
    for (const json of result.bokeh_figures) {
      const target = document.createElement('div');
      target.id = 'bokeh-fig-' + (bokehCounter++);
      target.className = 'bokeh-target';
      figures.appendChild(target);
      try {
        window.Bokeh.embed.embed_item(JSON.parse(json), target.id);
      } catch (e) {
        target.textContent = 'bokeh embed failed: ' + e.message;
      }
    }
    show('panel-figures');
  }

  $('exec-time').textContent = result.time != null ? `${result.time} ms` : '';
}

// ---------------------------------------------------------------- stdin bar

function showStdinBar(prompt) {
  const bar = $('stdin-bar');
  bar.classList.remove('hidden');
  $('stdin-prompt').textContent = prompt || 'stdin:';
  const field = $('stdin-field');
  field.value = '';
  field.focus();
}

function hideStdinBar() {
  $('stdin-bar').classList.add('hidden');
}

function submitStdin() {
  const value = $('stdin-field').value;
  hideStdinBar();
  manager.provideInput(value);
}

// ---------------------------------------------------------------- run

async function run() {
  if (!manager || !manager.isReady) return;
  const btn = $('run-btn');
  btn.disabled = true;
  clearOutput();
  setStatus('busy', 'RUNNING ' + current.id);
  try {
    const result = await manager.executeAsync(
      current.id + '.py',
      editor.getValue(),
      undefined,
      current.timeoutMs ?? DEFAULT_TIMEOUT_MS
    );
    renderResult(result);
    setStatus('ready', 'READY');
  } catch (e) {
    $('out-stderr').textContent = String(e);
    show('panel-stderr');
    setStatus('error', 'ERROR');
  } finally {
    hideStdinBar();
    btn.disabled = false;
  }
}

function resetCode() {
  editedCode.delete(current.id);
  editor.setValue(current.code);
  clearOutput();
}

// ---------------------------------------------------------------- boot

async function boot() {
  editor = window.CodeMirror($('editor'), {
    value: current.code,
    mode: 'python',
    theme: 'nagini',
    lineNumbers: true,
    indentUnit: 4,
    scrollbarStyle: 'native',
    extraKeys: {
      'Ctrl-Enter': run,
      'Cmd-Enter': run,
    },
  });

  renderTabs();
  $('example-title').textContent = current.title;
  $('example-desc').textContent = current.desc;
  $('run-btn').addEventListener('click', run);
  $('reset-btn').addEventListener('click', resetCode);
  $('stdin-field').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') submitStdin();
  });
  $('stdin-send').addEventListener('click', submitStdin);

  setStatus('boot', 'LOADING PYODIDE + ' + PACKAGES.join(', ').toUpperCase());
  try {
    manager = await Nagini.createManager('pyodide', PACKAGES, [], [], WORKER_PATH);
    await Nagini.waitForReady(manager, 120000);
    manager.setInputCallback((prompt) => showStdinBar(prompt));
    window.manager = manager; // console access for the curious
    setStatus('ready', 'READY');
    $('run-btn').disabled = false;
  } catch (e) {
    setStatus('error', 'BOOT FAILED: ' + e.message);
  }
}

boot();
