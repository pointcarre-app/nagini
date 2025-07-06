/* Loader for Brython runtime – renamed from brython-loader.js */

let _loadPromise = null;

export function loadBrython({
  brythonJsPath = '/src/brython/lib/brython.js',
  brythonStdlibPath = '/src/brython/lib/brython_stdlib.js'
} = {}) {
  if (typeof window === 'undefined') {
    throw new Error('Brython backend requires a browser environment');
  }
  if (_loadPromise) return _loadPromise;

  const inject = (src) => new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const s = document.createElement('script');
    s.src = src;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(s);
  });

  _loadPromise = (async () => {
    if (typeof window.__BRYTHON__ === 'undefined') {
      await inject(brythonJsPath);
      await inject(brythonStdlibPath);
    }
    if (typeof window.brython === 'function') {
      window.brython({ debug: 0 });
    }
    return window.__BRYTHON__;
  })();

  return _loadPromise;
} 