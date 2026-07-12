// Memory snapshot spike (lot C). One scenario per page load, results as JSON
// in #out, IndexedDB carries snapshots between loads.

const CDN = 'https://cdn.jsdelivr.net/pyodide/v314.0.2/full/';
const DB_NAME = 'nagini-snapshot-spike';
const STORE = 'snapshots';

function idb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function idbPut(key, value) {
  const db = await idb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).put(value, key);
    tx.oncomplete = resolve;
    tx.onerror = () => reject(tx.error);
  });
}

async function idbGet(key) {
  const db = await idb();
  return new Promise((resolve, reject) => {
    const req = db.transaction(STORE).objectStore(STORE).get(key);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function boot(extra = {}) {
  const t0 = performance.now();
  const { loadPyodide } = await import(CDN + 'pyodide.mjs');
  const pyodide = await loadPyodide({ indexURL: CDN, ...extra });
  return { pyodide, bootMs: Math.round(performance.now() - t0) };
}

async function timed(fn) {
  const t0 = performance.now();
  const value = await fn();
  return { value, ms: Math.round(performance.now() - t0) };
}

const MPL_SETUP = `
import matplotlib
matplotlib.use("agg")
import matplotlib.pyplot as plt
`;

const MPL_PLOT = `
import io, base64
import matplotlib.pyplot as plt
plt.plot([0, 1, 2], [0, 1, 4])
buf = io.BytesIO()
plt.savefig(buf, format="png")
plt.close("all")
len(base64.b64encode(buf.getvalue()))
`;

const scenarios = {
  async 'bare-cached'() {
    const { pyodide, bootMs } = await boot();
    const sanity = pyodide.runPython('2 + 2');
    return { bootMs, sanity };
  },

  async 'bare-snap-make'() {
    const { pyodide, bootMs } = await boot({ _makeSnapshot: true });
    const make = await timed(() => pyodide.makeMemorySnapshot());
    await idbPut('bare', make.value);
    return { bootMs, makeMs: make.ms, sizeMB: +(make.value.byteLength / 1e6).toFixed(1) };
  },

  async 'bare-snap-restore'() {
    const read = await timed(() => idbGet('bare'));
    if (!read.value) throw new Error('no bare snapshot in IDB');
    const { pyodide, bootMs } = await boot({ _loadSnapshot: read.value });
    const sanity = pyodide.runPython('2 + 2');
    const version = pyodide.runPython('import sys; sys.version.split()[0]');
    return { idbReadMs: read.ms, bootMs, totalMs: read.ms + bootMs, sanity, version };
  },

  async 'numpy-cached'() {
    const { pyodide, bootMs } = await boot();
    const pkg = await timed(() => pyodide.loadPackage('numpy'));
    const imp = await timed(() => pyodide.runPython('import numpy'));
    const compute = pyodide.runPython('import numpy; int(numpy.arange(100).sum())');
    return { bootMs, pkgMs: pkg.ms, importMs: imp.ms, totalMs: bootMs + pkg.ms + imp.ms, compute };
  },

  async 'numpy-snap-make'() {
    const { pyodide, bootMs } = await boot({ _makeSnapshot: true });
    const pkg = await timed(() => pyodide.loadPackage('numpy'));
    const imp = await timed(() => pyodide.runPython('import numpy'));
    const make = await timed(() => pyodide.makeMemorySnapshot());
    await idbPut('numpy', make.value);
    return { bootMs, pkgMs: pkg.ms, importMs: imp.ms, makeMs: make.ms, sizeMB: +(make.value.byteLength / 1e6).toFixed(1) };
  },

  async 'numpy-snap-restore'() {
    const read = await timed(() => idbGet('numpy'));
    if (!read.value) throw new Error('no numpy snapshot in IDB');
    const { pyodide, bootMs } = await boot({ _loadSnapshot: read.value });
    const compute = pyodide.runPython('import numpy; int(numpy.arange(100).sum())');
    return { idbReadMs: read.ms, bootMs, totalMs: read.ms + bootMs, compute };
  },

  async 'mpl-cached'() {
    const { pyodide, bootMs } = await boot();
    const pkg = await timed(() => pyodide.loadPackage('matplotlib'));
    const imp = await timed(() => pyodide.runPython(MPL_SETUP));
    const pngB64Len = pyodide.runPython(MPL_PLOT);
    return { bootMs, pkgMs: pkg.ms, importMs: imp.ms, totalMs: bootMs + pkg.ms + imp.ms, pngB64Len };
  },

  async 'mpl-snap-make'() {
    const { pyodide, bootMs } = await boot({ _makeSnapshot: true });
    const pkg = await timed(() => pyodide.loadPackage('matplotlib'));
    const imp = await timed(() => pyodide.runPython(MPL_SETUP));
    const make = await timed(() => pyodide.makeMemorySnapshot());
    await idbPut('mpl', make.value);
    return { bootMs, pkgMs: pkg.ms, importMs: imp.ms, makeMs: make.ms, sizeMB: +(make.value.byteLength / 1e6).toFixed(1) };
  },

  async 'numpy-snap-make-noimp'() {
    const { pyodide, bootMs } = await boot({ _makeSnapshot: true });
    const pkg = await timed(() => pyodide.loadPackage('numpy'));
    const make = await timed(() => pyodide.makeMemorySnapshot());
    await idbPut('numpy2', make.value);
    return { bootMs, pkgMs: pkg.ms, makeMs: make.ms, sizeMB: +(make.value.byteLength / 1e6).toFixed(1) };
  },

  async 'numpy-snap-restore-imp'() {
    const read = await timed(() => idbGet('numpy2'));
    if (!read.value) throw new Error('no numpy2 snapshot in IDB');
    const { pyodide, bootMs } = await boot({ _loadSnapshot: read.value });
    const imp = await timed(() => pyodide.runPython('import numpy'));
    const compute = pyodide.runPython('import numpy; int(numpy.arange(100).sum())');
    return { idbReadMs: read.ms, bootMs, importMs: imp.ms, totalMs: read.ms + bootMs + imp.ms, compute };
  },

  async 'sympy-cached'() {
    const { pyodide, bootMs } = await boot();
    const pkg = await timed(() => pyodide.loadPackage('sympy'));
    const imp = await timed(() => pyodide.runPython('import sympy'));
    const solved = pyodide.runPython('import sympy; str(sympy.solve(sympy.Symbol("x")**2 - 4))');
    return { bootMs, pkgMs: pkg.ms, importMs: imp.ms, totalMs: bootMs + pkg.ms + imp.ms, solved };
  },

  async 'sympy-snap-make'() {
    const { pyodide, bootMs } = await boot({ _makeSnapshot: true });
    const pkg = await timed(() => pyodide.loadPackage('sympy'));
    const imp = await timed(() => pyodide.runPython('import sympy'));
    const make = await timed(() => pyodide.makeMemorySnapshot());
    await idbPut('sympy', make.value);
    return { bootMs, pkgMs: pkg.ms, importMs: imp.ms, makeMs: make.ms, sizeMB: +(make.value.byteLength / 1e6).toFixed(1) };
  },

  async 'sympy-snap-restore'() {
    const read = await timed(() => idbGet('sympy'));
    if (!read.value) throw new Error('no sympy snapshot in IDB');
    const { pyodide, bootMs } = await boot({ _loadSnapshot: read.value });
    const solved = pyodide.runPython('import sympy; str(sympy.solve(sympy.Symbol("x")**2 - 4))');
    return { idbReadMs: read.ms, bootMs, totalMs: read.ms + bootMs, solved };
  },

  async 'sympy-pkgopt-cached'() {
    const t0 = performance.now();
    const { loadPyodide } = await import(CDN + 'pyodide.mjs');
    const pyodide = await loadPyodide({ indexURL: CDN, packages: ['sympy'] });
    const bootMs = Math.round(performance.now() - t0);
    const imp = await timed(() => pyodide.runPython('import sympy'));
    const solved = pyodide.runPython('import sympy; str(sympy.solve(sympy.Symbol("x")**2 - 4))');
    return { bootMs, importMs: imp.ms, totalMs: bootMs + imp.ms, solved };
  },

  async 'sympy-pkgopt-snap-make'() {
    const t0 = performance.now();
    const { loadPyodide } = await import(CDN + 'pyodide.mjs');
    const pyodide = await loadPyodide({ indexURL: CDN, packages: ['sympy'], _makeSnapshot: true });
    const bootMs = Math.round(performance.now() - t0);
    const imp = await timed(() => pyodide.runPython('import sympy'));
    const make = await timed(() => pyodide.makeMemorySnapshot());
    await idbPut('sympy-pkgopt', make.value);
    return { bootMs, importMs: imp.ms, makeMs: make.ms, sizeMB: +(make.value.byteLength / 1e6).toFixed(1) };
  },

  async 'sympy-pkgopt-snap-restore'() {
    const read = await timed(() => idbGet('sympy-pkgopt'));
    if (!read.value) throw new Error('no sympy-pkgopt snapshot in IDB');
    const { pyodide, bootMs } = await boot({ _loadSnapshot: read.value });
    const solved = pyodide.runPython('import sympy; str(sympy.solve(sympy.Symbol("x")**2 - 4))');
    return { idbReadMs: read.ms, bootMs, totalMs: read.ms + bootMs, solved };
  },

  async 'mpl-pkgopt-snap-make'() {
    const t0 = performance.now();
    const { loadPyodide } = await import(CDN + 'pyodide.mjs');
    const pyodide = await loadPyodide({ indexURL: CDN, packages: ['matplotlib'], _makeSnapshot: true });
    const bootMs = Math.round(performance.now() - t0);
    const imp = await timed(() => pyodide.runPython(MPL_SETUP));
    const make = await timed(() => pyodide.makeMemorySnapshot());
    await idbPut('mpl-pkgopt', make.value);
    return { bootMs, importMs: imp.ms, makeMs: make.ms, sizeMB: +(make.value.byteLength / 1e6).toFixed(1) };
  },

  async 'mpl-pkgopt-snap-restore'() {
    const read = await timed(() => idbGet('mpl-pkgopt'));
    if (!read.value) throw new Error('no mpl-pkgopt snapshot in IDB');
    const { pyodide, bootMs } = await boot({ _loadSnapshot: read.value });
    const pngB64Len = pyodide.runPython(MPL_PLOT);
    return { idbReadMs: read.ms, bootMs, totalMs: read.ms + bootMs, pngB64Len };
  },

  async 'mpl-snap-restore'() {
    const read = await timed(() => idbGet('mpl'));
    if (!read.value) throw new Error('no mpl snapshot in IDB');
    const { pyodide, bootMs } = await boot({ _loadSnapshot: read.value });
    const pngB64Len = pyodide.runPython(MPL_PLOT);
    return { idbReadMs: read.ms, bootMs, totalMs: read.ms + bootMs, pngB64Len };
  },
};

const out = document.getElementById('out');
const name = new URLSearchParams(location.search).get('scenario');

(async () => {
  let result;
  try {
    if (!scenarios[name]) throw new Error(`unknown scenario: ${name}`);
    result = { scenario: name, ok: true, ...(await scenarios[name]()) };
  } catch (e) {
    result = { scenario: name, ok: false, error: String(e && e.message || e) };
  }
  out.textContent = JSON.stringify(result);
  out.dataset.done = '1';
})();
