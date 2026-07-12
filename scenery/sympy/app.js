/**
 * Nagini sympy :: page logic
 *
 * Same engine as ../executions/app.js: one shared Pyodide manager for the
 * whole page, created lazily on the first run and reused everywhere. The
 * boot loads sympy and matplotlib from the pyodide distribution and
 * strictyaml from PyPI through micropip. Every python-produced string is
 * rendered with textContent, never innerHTML.
 */

import { Nagini } from '../../src/nagini.js';
import { SECTIONS, DOC_URL } from './sections.js';

const WORKER_PATH = '../../src/pyodide/worker/worker-dist.js';
const PACKAGES = ['sympy', 'matplotlib'];
const MICROPIP_PACKAGES = ['strictyaml'];
const DEFAULT_TIMEOUT_MS = 60000;
const BOOT_TIMEOUT_MS = 180000;

const $ = (id) => document.getElementById(id);

let manager = null;
let managerPromise = null;
let runsInFlight = 0;
let activeInputCtx = null; // step ctx whose run may be waiting on input()
const editors = []; // every CodeMirror instance, refreshed after attach

// ---------------------------------------------------------------- status

function setStatus(state, label) {
  $('status-led').className = 'status-led ' + state; // idle | boot | busy | ready | error
  $('status-text').textContent = label;
}

function beginRun(label) {
  runsInFlight += 1;
  setStatus('busy', 'running ' + label);
}

function endRun() {
  runsInFlight = Math.max(0, runsInFlight - 1);
  if (runsInFlight === 0) {
    if (manager && manager.isReady) setStatus('ready', 'ready');
    else setStatus('idle', 'idle, boots on first run');
  }
}

// --------------------------------------------------------------- manager

function ensureManager() {
  if (managerPromise) return managerPromise;
  setStatus('boot', 'loading pyodide + ' + PACKAGES.join(', ')
    + ' + ' + MICROPIP_PACKAGES.join(', ') + ' (PyPI)');
  managerPromise = (async () => {
    const m = await Nagini.createManager(
      'pyodide', PACKAGES, MICROPIP_PACKAGES, [], WORKER_PATH,
      { snapshotCache: true }
    );
    await Nagini.waitForReady(m, BOOT_TIMEOUT_MS);
    m.setInputCallback(onInputRequired);
    manager = m;
    window.manager = m; // console access for the curious
    return m;
  })();
  managerPromise.catch((e) => {
    managerPromise = null;
    setStatus('error', 'boot failed: ' + e.message);
  });
  return managerPromise;
}

// ------------------------------------------------------------- dom bits

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function panel(labelText) {
  const box = el('div', 'panel');
  const label = el('div', 'panel-label');
  label.appendChild(el('span', '', labelText));
  box.appendChild(label);
  return { box, label };
}

function outputPanel(labelText, preClass) {
  const { box } = panel(labelText);
  const pre = el('pre', 'term ' + preClass);
  box.appendChild(pre);
  box.classList.add('hidden');
  return { box, pre };
}

// ------------------------------------------------------------ input bar

function onInputRequired(prompt) {
  const ctx = activeInputCtx;
  if (!ctx) {
    console.warn('input requested but no run is active');
    return;
  }
  ctx.stdin.row.classList.remove('hidden');
  ctx.outputs.classList.remove('hidden');
  ctx.stdin.prompt.textContent = prompt || 'stdin:';
  ctx.stdin.field.value = '';
  ctx.stdin.field.focus();
}

function hideStdin(ctx) {
  ctx.stdin.row.classList.add('hidden');
}

function submitStdin(ctx) {
  if (!manager) return;
  try {
    // empty string is a valid answer: input() returns "" on a bare Enter
    manager.provideInput(ctx.stdin.field.value);
    hideStdin(ctx);
  } catch (e) {
    // keep the field visible so the run is not stranded waiting
    console.error('provideInput failed:', e);
  }
}

// ------------------------------------------------------------- rendering

function resetOutputs(ctx) {
  for (const key of Object.keys(ctx.out)) {
    ctx.out[key].pre.textContent = '';
    ctx.out[key].box.classList.add('hidden');
  }
  while (ctx.figures.firstChild) ctx.figures.removeChild(ctx.figures.firstChild);
  ctx.figuresPanel.classList.add('hidden');
  ctx.time.textContent = '';
  hideStdin(ctx);
  ctx.outputs.classList.add('hidden');
}

function show(ctx, key) {
  ctx.out[key].box.classList.remove('hidden');
  ctx.outputs.classList.remove('hidden');
}

function renderResult(ctx, result) {
  if (result.stdout && result.stdout.trim()) {
    ctx.out.stdout.pre.textContent = result.stdout;
    show(ctx, 'stdout');
  }
  if (result.stderr && result.stderr.trim()) {
    ctx.out.stderr.pre.textContent = result.stderr;
    show(ctx, 'stderr');
  }
  if (result.error) {
    ctx.out.error.pre.textContent = (result.error.name || 'Error') + ': '
      + (result.error.message || 'unknown error');
    show(ctx, 'error');
  }
  if (result.missive) {
    if (ctx.step.showMissiveRaw) {
      ctx.out.missiveRaw.pre.textContent = 'typeof result.missive: '
        + typeof result.missive + '\n' + result.missive;
      show(ctx, 'missiveRaw');
    }
    let parsed = null;
    try { parsed = JSON.parse(result.missive); } catch (_) { /* raw only */ }
    if (parsed !== null) {
      ctx.out.missive.pre.textContent = JSON.stringify(parsed, null, 2);
      show(ctx, 'missive');
    }
  }
  if (result.figures && result.figures.length) {
    for (const b64 of result.figures) {
      const img = document.createElement('img');
      img.src = 'data:image/png;base64,' + b64;
      img.className = 'figure-img';
      img.alt = 'figure captured from the worker';
      ctx.figures.appendChild(img);
    }
    ctx.figuresPanel.classList.remove('hidden');
    ctx.outputs.classList.remove('hidden');
  }
  ctx.time.textContent = result.time != null ? result.time + ' ms' : '';
}

function renderRejection(ctx, e) {
  ctx.out.rejected.pre.textContent = String(e && e.message ? e.message : e);
  show(ctx, 'rejected');
}

// ------------------------------------------------------------------ runs

async function runStep(demo, ctx, button) {
  button.disabled = true;
  resetOutputs(ctx);
  try {
    const m = await ensureManager();
    beginRun(ctx.step.file);
    activeInputCtx = ctx;
    try {
      if (demo.queued) {
        for (const value of demo.queued) m.queueInput(value);
      }
      const result = await m.executeAsync(
        ctx.step.file,
        ctx.editor.getValue(),
        ctx.step.namespace,
        ctx.step.timeoutMs ?? DEFAULT_TIMEOUT_MS
      );
      renderResult(ctx, result);
    } finally {
      endRun();
      hideStdin(ctx);
      if (activeInputCtx === ctx) activeInputCtx = null;
    }
  } catch (e) {
    renderRejection(ctx, e);
  } finally {
    button.disabled = false;
  }
}

// ------------------------------------------------------------- builders

function buildStep(demo, step) {
  const wrap = el('div', 'step');

  const editorPanel = panel('editor :: ' + step.file);
  const host = el('div', 'editor-host');
  editorPanel.box.appendChild(host);
  wrap.appendChild(editorPanel.box);

  const editor = window.CodeMirror(host, {
    value: step.code,
    mode: 'python',
    theme: 'nagini',
    lineNumbers: true,
    indentUnit: 4,
    viewportMargin: Infinity,
    scrollbarStyle: 'native',
  });
  editors.push(editor);

  const outputs = el('div', 'outputs hidden');

  // stdin row, revealed only when python asks for input
  const stdinRow = el('div', 'panel stdin-row hidden');
  const stdinLabel = el('div', 'panel-label stdin-label');
  stdinLabel.appendChild(el('span', '', 'stdin :: program is waiting'));
  stdinRow.appendChild(stdinLabel);
  const stdinBody = el('div', 'stdin-body');
  const stdinPrompt = el('span', 'stdin-prompt', '');
  const stdinField = document.createElement('input');
  stdinField.type = 'text';
  stdinField.className = 'stdin-field';
  stdinField.autocomplete = 'off';
  const stdinSend = el('button', 'btn btn-sm btn-exec', 'Send');
  stdinBody.appendChild(stdinPrompt);
  stdinBody.appendChild(stdinField);
  stdinBody.appendChild(stdinSend);
  stdinRow.appendChild(stdinBody);
  outputs.appendChild(stdinRow);

  const figuresPanel = panel('figures');
  const figures = el('div', 'figures');
  figuresPanel.box.appendChild(figures);
  figuresPanel.box.classList.add('hidden');
  outputs.appendChild(figuresPanel.box);

  const out = {
    stdout: outputPanel('stdout', 'out-stdout'),
    missiveRaw: outputPanel('missive :: raw string', 'out-missive-raw'),
    missive: outputPanel('missive :: parsed object', 'out-missive-parsed'),
    error: outputPanel('result.error', 'out-error'),
    stderr: outputPanel('stderr', 'out-stderr'),
    rejected: outputPanel('rejected promise', 'out-rejected'),
  };
  for (const key of ['stdout', 'missiveRaw', 'missive', 'error', 'stderr', 'rejected']) {
    outputs.appendChild(out[key].box);
  }

  const ctx = {
    step,
    editor,
    outputs,
    out,
    figures,
    figuresPanel: figuresPanel.box,
    time: el('span', 'exec-time'),
    stdin: { row: stdinRow, prompt: stdinPrompt, field: stdinField },
  };

  stdinSend.addEventListener('click', () => submitStdin(ctx));
  stdinField.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') submitStdin(ctx);
  });

  const runbar = el('div', 'runbar');
  const button = el('button', 'btn btn-sm btn-exec', step.button || 'Run');
  button.addEventListener('click', () => runStep(demo, ctx, button));
  runbar.appendChild(button);
  ctx.runButton = button;
  runbar.appendChild(ctx.time);
  wrap.appendChild(runbar);
  wrap.appendChild(outputs);

  return { wrap, ctx };
}

function buildDemo(demo) {
  const wrap = el('div', 'demo col-demo');
  if (demo.heading) wrap.appendChild(el('h3', 'demo-heading', demo.heading));
  if (demo.note) wrap.appendChild(el('p', 'demo-note', demo.note));

  for (const step of demo.steps) {
    const built = buildStep(demo, step);
    wrap.appendChild(built.wrap);
  }

  return wrap;
}

function buildJsPanel(demo) {
  const { box } = panel('js integration :: as called by this page');
  box.classList.add('col-js');
  const host = el('div', 'js-snippet');
  box.appendChild(host);
  editors.push(window.CodeMirror(host, {
    value: demo.js,
    mode: 'javascript',
    theme: 'nagini',
    lineNumbers: false,
    readOnly: 'nocursor',
    lineWrapping: true,
    viewportMargin: Infinity,
    scrollbarStyle: 'native',
  }));
  return box;
}

function buildFlowPanel(section) {
  const { box, label } = panel('flow');
  box.classList.add('col-flow');
  const link = document.createElement('a');
  link.href = DOC_URL + '#' + (section.docAnchor || section.id);
  link.className = 'doc-link';
  link.textContent = 'full diagram in the docs';
  label.appendChild(link);
  box.appendChild(el('pre', 'flow', section.flow));
  return box;
}

function buildSection(section) {
  const sec = el('section', 'exec-section');
  sec.id = section.id;

  const head = el('div', 'section-head');
  const h2 = el('h2', '', section.title);
  const anchor = document.createElement('a');
  anchor.href = '#' + section.id;
  anchor.className = 'anchor-link';
  anchor.textContent = '#' + section.id;
  head.appendChild(h2);
  head.appendChild(anchor);
  const doc = document.createElement('a');
  doc.href = DOC_URL + '#' + (section.docAnchor || section.id);
  doc.className = 'doc-link';
  doc.textContent = 'step-by-step flow in the docs';
  head.appendChild(doc);
  sec.appendChild(head);

  sec.appendChild(el('p', 'blurb', section.blurb));

  const grid = el('div', 'section-grid');
  section.demos.forEach((demo, i) => {
    grid.appendChild(buildDemo(demo));
    grid.appendChild(buildJsPanel(demo));
    if (i === 0) grid.appendChild(buildFlowPanel(section));
  });
  sec.appendChild(grid);

  return sec;
}

// ----------------------------------------------------------------- boot

function boot() {
  const root = $('sections');
  for (const section of SECTIONS) {
    root.appendChild(buildSection(section));
  }
  setStatus('idle', 'idle, boots on first run');

  // editors were created on detached nodes: refresh once attached
  requestAnimationFrame(() => {
    for (const editor of editors) editor.refresh();
  });

  // re-apply the anchor once the sections exist
  if (location.hash) {
    const target = document.getElementById(location.hash.slice(1));
    if (target) target.scrollIntoView();
  }
}

boot();
