import { loadBrython } from './loader.js';

/**
 * Execute Python code with Brython, capturing stdout, stderr, missive and errors.
 *
 * The user code is embedded as a JSON-escaped string and run through
 * exec(compile(...)) inside a try/except, so the completion callback fires
 * whether the code succeeds or raises. The callback is keyed by execution id,
 * so overlapping executions cannot clobber each other.
 */
export async function executeAsync(code, filename = 'script.py', timeoutMs = 30000) {
  await loadBrython();
  return new Promise((resolve, reject) => {
    const start = performance.now();
    const suffix = `${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const id = `__brython_exec_${suffix}`;
    const cbName = `__brython_cb_${suffix}`;

    const cleanup = () => {
      clearTimeout(timeoutId);
      const el = document.getElementById(id);
      if (el) el.remove();
      delete window[cbName];
    };

    const timeoutId = setTimeout(() => {
      cleanup();
      reject(new Error(`🐍 [BrythonManager] Execution timeout after ${timeoutMs / 1000} seconds`));
    }, timeoutMs);

    window[cbName] = (payload) => {
      const end = performance.now();
      cleanup();
      resolve({ filename, time: end - start, ...payload });
    };

    // JSON string literals are valid Python string literals
    const codeJson = JSON.stringify(code);
    const filenameJson = JSON.stringify(filename);

    const wrapped = `
import sys
import traceback
from browser import window

_stdout_buf, _stderr_buf = [], []

class _Stdout:
    def write(self, data):
        _stdout_buf.append(str(data))
    def flush(self):
        pass

class _Stderr:
    def write(self, data):
        _stderr_buf.append(str(data))
    def flush(self):
        pass

sys.stdout = _Stdout()
sys.stderr = _Stderr()

_missive_value = None

def missive(obj):
    global _missive_value
    if _missive_value is not None:
        raise ValueError('missive() can only be called once')
    _missive_value = obj

_error = None
try:
    exec(compile(${codeJson}, ${filenameJson}, 'exec'), globals())
except BaseException as _exc:
    _error = {
        'type': type(_exc).__name__,
        'message': str(_exc),
        'traceback': traceback.format_exc()
    }
    _stderr_buf.append(traceback.format_exc())

window.${cbName}({
    'stdout': ''.join(_stdout_buf),
    'stderr': ''.join(_stderr_buf),
    'missive': _missive_value,
    'error': _error
})
`;

    const script = document.createElement('script');
    script.type = 'text/python3';
    script.id = id;
    script.textContent = wrapped;
    document.body.appendChild(script);

    if (typeof window.brython === 'function') {
      window.brython();
    } else {
      cleanup();
      reject(new Error('Brython runtime not initialised'));
    }
  });
}
