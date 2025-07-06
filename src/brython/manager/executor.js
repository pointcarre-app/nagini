import { loadBrython } from './loader.js';

/**
 * Execute Python code with Brython, capturing stdout, stderr and missive.
 * Renamed from brython-executor.js
 */
export async function executeAsync(code, filename = 'script.py') {
  await loadBrython();
  return new Promise((resolve, reject) => {
    const start = performance.now();
    const id = `__brython_exec_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    window.__brython_finish_cb = (payload) => {
      const end = performance.now();
      const el = document.getElementById(id);
      if (el) el.remove();
      delete window.__brython_finish_cb;
      resolve({ filename, time: end - start, ...payload });
    };

    const wrapped = `\nimport sys\nfrom browser import window\n\n_stdout_buf, _stderr_buf = [], []\n\nclass _Stdout:\n    def write(self, data):\n        _stdout_buf.append(str(data))\n    def flush(self):\n        pass\n\nclass _Stderr:\n    def write(self, data):\n        _stderr_buf.append(str(data))\n    def flush(self):\n        pass\n\nsys.stdout = _Stdout()\nsys.stderr = _Stderr()\n\n_missive_value = None\n\ndef missive(obj):\n    global _missive_value\n    if _missive_value is not None:\n        raise ValueError('missive() can only be called once')\n    _missive_value = obj\n\n# --- user code starts here ---\n${code}\n# --- end user code ---\n\nwindow.__brython_finish_cb({\n    'stdout': ''.join(_stdout_buf),\n    'stderr': ''.join(_stderr_buf),\n    'missive': _missive_value\n})\n`;

    const script = document.createElement('script');
    script.type = 'text/python3';
    script.id = id;
    script.textContent = wrapped;
    document.body.appendChild(script);

    if (typeof window.brython === 'function') {
      window.brython();
    } else {
      reject(new Error('Brython runtime not initialised'));
    }
  });
} 