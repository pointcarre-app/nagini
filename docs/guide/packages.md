# Packages

Two lists at `createManager` time: packages from the Pyodide distribution, and packages installed from PyPI with micropip. Pyodide backend only.

## Use

```javascript
const manager = await Nagini.createManager(
  'pyodide',
  ['numpy', 'matplotlib', 'sympy'],   // shipped with Pyodide, loaded with loadPackage
  ['strictyaml'],                     // fetched from PyPI with micropip
  [],
  WORKER
);
await Nagini.waitForReady(manager, 90000);
```

Both lists install during boot, before `ready`. Nothing is loaded lazily at run time.

## Details

`packages` names must exist in the Pyodide distribution in use (314.0.6 by default). Already loaded packages are skipped. A name the distribution does not know does not fail the boot: the worker posts a `warning` (a `console.warn` on the page) and continues, and the `import` fails at run time instead.

`micropipPackages` accepts anything `micropip.install()` accepts: pure-Python wheels, and packages that publish Emscripten wheels on PyPI. The worker records installed names and skips them if asked again.

User code can also import `micropip` and install at run time; that works, but the install happens inside the execution timeout.

The Pyodide 314 distribution already bundles `sqlite3` and `lzma` in the standard library. Its `ssl` module is a stub and `hashlib` lacks the OpenSSL-only algorithms.

Network: `loadPackage` fetches wheels from the Pyodide base URL (jsDelivr by default, or your `pyodideCdnUrl`), and micropip talks to `pypi.org` and `files.pythonhosted.org`. Your Content Security Policy must allow those in `connect-src` (see [security](security.md)).

## Limits

Package state cannot live in the [snapshot cache](snapshot-cache.md): current Pyodide rejects it, so package load time is paid on every boot. Packages with native code and no Emscripten wheel cannot be installed at all.

## See also

Step 8 of the [initialization flow](../execution-flows.md#initialization-and-readypromise). Live: the [sympy](https://pointcarre-app.github.io/nagini/scenery/sympy/) page installs `strictyaml` through micropip.
