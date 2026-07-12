# Architecture

All source links on this page are pinned to the released tag
[v0.0.50](https://github.com/pointcarre-app/nagini/tree/v0.0.50), so they stay
valid whatever happens on `main`. They are re-pinned at each release, the same
habit as the CDN URLs in the README.

Nagini is a small facade over two backends that run Python in the browser. The
Pyodide backend runs real CPython (compiled to WebAssembly) inside a web
worker and talks to the page through messages carrying correlation ids. The
Brython backend transpiles Python to JavaScript and runs it directly in the
main thread of the page. Both expose the same manager surface: `executeAsync`,
`executeFile`, the input helpers, `fs` (Pyodide only) and an
`executionHistory`.

Step-by-step message traces for every operation live in
[execution flows](execution-flows.md). This page is the static map: which file
does what, and how the pieces are wired together.

## System diagram

```
+-----------------------------------------------------------------------------+
|                                  HOST PAGE                                  |
|            (your HTML page, Flask or Django template, app, ...)             |
|                                                                             |
|   import { Nagini } from ".../src/nagini.js"   (or the UMD bundle)          |
|   const manager = await Nagini.createManager(...)                           |
+--------------------------------------+--------------------------------------+
                                       |
                                       v
+-----------------------------------------------------------------------------+
|                      NAGINI FACADE     src/nagini.js                        |
|                                                                             |
|   createManager()        waitForReady()         executeFromUrl()            |
|   validates arguments (src/utils/validation.js), then dynamically           |
|   imports the requested backend and returns a manager                       |
+-------------------+------------------------------------------+--------------+
                    |                                          |
           backend "pyodide"                          backend "brython"
                    |                                          |
                    v                                          v
+---------------------------------------+  +---------------------------------+
|  PYODIDE MANAGER (main thread)        |  |  BRYTHON MANAGER (main thread)  |
|  src/pyodide/manager/manager.js       |  |  src/brython/manager/manager.js |
|                                       |  |                                 |
|   + manager-static-execution.js       |  |   + loader.js                   |
|       fire-and-forget executeFile     |  |       injects brython.js and    |
|   + manager-input.js                  |  |       brython_stdlib.js         |
|       input queue / callback state    |  |       as script tags            |
|   + manager-fs.js                     |  |   + executor.js                 |
|       fs() operation wrappers         |  |       runs code as a            |
|                                       |  |       text/python3 script tag   |
|   correlation ids + pending map       |  |       with a per-execution      |
|   executionChain (serialization)      |  |       callback                  |
|   readyPromise, executionHistory      |  |                                 |
+-------------------+-------------------+  |  Python transpiled to JS,       |
                    |                      |  runs IN the page: full DOM     |
   fetch(workerPath), wrap in a Blob,      |  access, no worker isolation    |
   URL.createObjectURL                     +----------------+----------------+
   src/utils/createBlobWorker.js                            |
                    |                                       v
 new Worker(blobUrl,{type:'module'})       +---------------------------------+
                    |                      |  BRYTHON RUNTIME (main thread)  |
                    v                      |  src/brython/lib/brython.js     |
+---------------------------------------+  |  src/brython/lib/               |
|  WEB WORKER (separate thread)         |  |      brython_stdlib.js          |
|  src/pyodide/worker/worker-dist.js    |  +---------------------------------+
|  one self-contained file, built by    |
|  webpack from:                        |
|                                       |
|   worker.js            entry point    |
|   worker-handlers.js   init + routing |
|   worker-execution.js  execute path   |
|   worker-input.js      input() bridge |
|   worker-fs.js         fs operations  |
|   worker-snapshot.js   snapshot cache |
|   worker-config.js     constants      |
|   ../file-loader/file-loader.js       |
|       remote files at init            |
|                                       |
|  embedded Python sources, bundled as  |
|  strings from src/pyodide/python/:    |
|   capture_system.py     stdout,       |
|       stderr, missive, figures        |
|   code_transformation.py AST rewrite  |
|       of input() (async fallback)     |
|   pyodide_utilities.py  matplotlib    |
|       setup                           |
+-------------------+-------------------+
                    |
   await import(cdnUrl + "pyodide.mjs")
                    |
                    v
+---------------------------------------+
|  PYODIDE RUNTIME (CPython on wasm)    |
|  default: jsDelivr CDN, 314.0.2       |
|  overridable with options             |
|  .pyodideCdnUrl for self-hosted       |
|  or offline use                       |
+---------------------------------------+
```

## The boxes, one by one

### Host page

Your application. It imports the facade as an ES module (directly, through
esm.sh, or via the UMD bundle), creates a manager, waits for readiness and
calls `executeAsync`. Nothing else from Nagini needs to appear in the page:
the worker file is fetched by the manager itself.

### Nagini facade

[src/nagini.js](https://github.com/pointcarre-app/nagini/blob/v0.0.50/src/nagini.js)
exposes
[`createManager`](https://github.com/pointcarre-app/nagini/blob/v0.0.50/src/nagini.js#L29),
[`waitForReady`](https://github.com/pointcarre-app/nagini/blob/v0.0.50/src/nagini.js#L76)
and
[`executeFromUrl`](https://github.com/pointcarre-app/nagini/blob/v0.0.50/src/nagini.js#L111).
It validates the backend name, enforces the bundled `worker-dist.js` for
Pyodide, then dynamically imports the chosen manager so the page only loads
the backend it uses.

### Validation utilities

[src/utils/validation.js](https://github.com/pointcarre-app/nagini/blob/v0.0.50/src/utils/validation.js)
centralizes parameter checks (`validateBackend`, `validatePackages`,
[`validateExecutionParams`](https://github.com/pointcarre-app/nagini/blob/v0.0.50/src/utils/validation.js#L170), ...)
used by the facade and by both managers, so invalid input throws early with a
named component in the message. It also ships the opt-in
[`checkDangerousPatterns`](https://github.com/pointcarre-app/nagini/blob/v0.0.50/src/utils/validation.js#L181)
heuristic, which is never applied automatically.

### PyodideManager

[src/pyodide/manager/manager.js](https://github.com/pointcarre-app/nagini/blob/v0.0.50/src/pyodide/manager/manager.js)
is the main-thread half of the Pyodide backend. It owns the worker, a
[pending-request map keyed by correlation id](https://github.com/pointcarre-app/nagini/blob/v0.0.50/src/pyodide/manager/manager.js#L114-L119),
an
[`executionChain`](https://github.com/pointcarre-app/nagini/blob/v0.0.50/src/pyodide/manager/manager.js#L112)
that serializes executions, a
[`readyPromise`](https://github.com/pointcarre-app/nagini/blob/v0.0.50/src/pyodide/manager/manager.js#L123-L132)
and the
[`executionHistory` capped at 50 entries](https://github.com/pointcarre-app/nagini/blob/v0.0.50/src/pyodide/manager/manager.js#L37).
Every request goes through
[`_postRequest`](https://github.com/pointcarre-app/nagini/blob/v0.0.50/src/pyodide/manager/manager.js#L284)
and every worker message through
[`_dispatchMessage`](https://github.com/pointcarre-app/nagini/blob/v0.0.50/src/pyodide/manager/manager.js#L219).
The `ready` message fills two read-only flags: `manager.snapshotRestored`
(whether the interpreter came out of the snapshot cache) and
`manager.inputMode` (`'jspi'` or `'async'`).

### Manager helper modules

Three static classes keep `manager.js` small.
[manager-static-execution.js](https://github.com/pointcarre-app/nagini/blob/v0.0.50/src/pyodide/manager/manager-static-execution.js)
implements the fire-and-forget
[`executeFile`](https://github.com/pointcarre-app/nagini/blob/v0.0.50/src/pyodide/manager/manager-static-execution.js#L40).
[manager-input.js](https://github.com/pointcarre-app/nagini/blob/v0.0.50/src/pyodide/manager/manager-input.js)
holds the input state machine (queue, callback, current prompt) and reacts to
`input_required` messages in
[`handleInputMessage`](https://github.com/pointcarre-app/nagini/blob/v0.0.50/src/pyodide/manager/manager-input.js#L118).
[manager-fs.js](https://github.com/pointcarre-app/nagini/blob/v0.0.50/src/pyodide/manager/manager-fs.js)
wraps the five filesystem operations and unwraps their results in
[`fs`](https://github.com/pointcarre-app/nagini/blob/v0.0.50/src/pyodide/manager/manager-fs.js#L32).

### Blob worker creation

[src/utils/createBlobWorker.js](https://github.com/pointcarre-app/nagini/blob/v0.0.50/src/utils/createBlobWorker.js)
fetches `worker-dist.js` as text, wraps it in a `Blob` and returns an object
URL in
[`createBlobWorkerUrl`](https://github.com/pointcarre-app/nagini/blob/v0.0.50/src/utils/createBlobWorker.js#L15).
Workers built from blob URLs are same-origin by construction, which is what
makes Nagini usable when the library is served from a different origin than
the page (Flask and Django setups, CDNs).

### Bundled worker: worker-dist.js

[src/pyodide/worker/worker-dist.js](https://github.com/pointcarre-app/nagini/blob/v0.0.50/src/pyodide/worker/worker-dist.js)
is a generated file: webpack inlines all worker modules and the three Python
sources into one script with no imports left. Only this bundle is accepted by
the manager (checked in the
[constructor](https://github.com/pointcarre-app/nagini/blob/v0.0.50/src/pyodide/manager/manager.js#L62-L64)),
because a blob worker cannot resolve relative ES imports. Rebuild it with
`npm run build` after touching any worker or Python source.

### Worker entry: worker.js

[src/pyodide/worker/worker.js](https://github.com/pointcarre-app/nagini/blob/v0.0.50/src/pyodide/worker/worker.js)
holds the worker state (pyodide instance, loaded package sets) and installs
the single
[`self.onmessage`](https://github.com/pointcarre-app/nagini/blob/v0.0.50/src/pyodide/worker/worker.js#L64)
handler. Errors thrown while handling a message are posted back with the
request id echoed, so the matching promise on the manager side rejects instead
of hanging.

### worker-handlers.js

[src/pyodide/worker/worker-handlers.js](https://github.com/pointcarre-app/nagini/blob/v0.0.50/src/pyodide/worker/worker-handlers.js)
routes messages by type in
[`handleMessage`](https://github.com/pointcarre-app/nagini/blob/v0.0.50/src/pyodide/worker/worker-handlers.js#L85)
and owns
[`handleInit`](https://github.com/pointcarre-app/nagini/blob/v0.0.50/src/pyodide/worker/worker-handlers.js#L117):
load Pyodide (from a cached snapshot when `snapshotCache` allows it),
import the bundled Python modules, set up input handling, load files and
packages, then post `ready` with the `snapshotRestored` and `inputMode`
flags. It imports the Python sources
[as bundled strings](https://github.com/pointcarre-app/nagini/blob/v0.0.50/src/pyodide/worker/worker-handlers.js#L15-L18)
through the webpack `@python` alias.

### worker-execution.js

[src/pyodide/worker/worker-execution.js](https://github.com/pointcarre-app/nagini/blob/v0.0.50/src/pyodide/worker/worker-execution.js)
is the execute path:
[`handleExecute`](https://github.com/pointcarre-app/nagini/blob/v0.0.50/src/pyodide/worker/worker-execution.js#L18)
resets the capture buffers, transforms the code for `input()` support when
needed (async input mode only, jspi mode runs the code untouched), runs it
through `runPythonAsync`, then collects everything with
[`captureOutputs`](https://github.com/pointcarre-app/nagini/blob/v0.0.50/src/pyodide/worker/worker-execution.js#L102)
and posts a single `result` message carrying the request id.

### worker-input.js

[src/pyodide/worker/worker-input.js](https://github.com/pointcarre-app/nagini/blob/v0.0.50/src/pyodide/worker/worker-input.js)
bridges Python's `input()` to the page, in one of two modes picked at init
by
[`setupInputHandling`](https://github.com/pointcarre-app/nagini/blob/main/src/pyodide/worker/worker-input.js).
On browsers with JSPI (`WebAssembly.Suspending`), `builtins.input` becomes
a plain sync function that blocks through `pyodide.ffi.run_sync`: user code
runs unmodified and `input()` works even inside sync functions, lambdas and
class bodies. Without JSPI, `builtins.input` is an async coroutine awaiting
a JavaScript promise, paired with the AST rewrite in
`code_transformation.py`. In both modes
[`handleInputResponse`](https://github.com/pointcarre-app/nagini/blob/v0.0.50/src/pyodide/worker/worker-input.js#L96)
resolves the parked promise when the manager sends the user's answer. The
chosen mode travels on the `ready` message and is exposed as
`manager.inputMode`.

### worker-fs.js

[src/pyodide/worker/worker-fs.js](https://github.com/pointcarre-app/nagini/blob/v0.0.50/src/pyodide/worker/worker-fs.js)
executes filesystem operations against Pyodide's virtual FS in
[`executeFS`](https://github.com/pointcarre-app/nagini/blob/v0.0.50/src/pyodide/worker/worker-fs.js#L40)
(writeFile, readFile, mkdir, exists, listdir) and also hosts
[`loadPackages`](https://github.com/pointcarre-app/nagini/blob/v0.0.50/src/pyodide/worker/worker-fs.js#L73),
which skips packages already loaded in this worker.

### worker-snapshot.js

[src/pyodide/worker/worker-snapshot.js](https://github.com/pointcarre-app/nagini/blob/main/src/pyodide/worker/worker-snapshot.js)
implements the optional interpreter snapshot cache behind the
`snapshotCache` manager option. It stores a memory snapshot of the bare
interpreter plus Nagini's embedded Python modules (~31 MB) in IndexedDB,
keyed by the full Pyodide base URL and a SHA-256 of the embedded sources; storing
a new entry evicts the others. The snapshot is taken right before the
input bridge is installed: the bridge, loaded files and packages hold live
JavaScript references (hiwire entries) that Pyodide's snapshot serializer
rejects, so they are replayed on every boot instead. A matching entry cuts
the interpreter boot from ~0.8 s to ~100 ms; every failure path (no
IndexedDB, quota, corrupt entry) falls back to a fresh boot. The restore
outcome is exposed as `manager.snapshotRestored`. The full branch is traced
in the
[initialization flow](execution-flows.md#the-snapshot-cache-branch).

### worker-config.js

[src/pyodide/worker/worker-config.js](https://github.com/pointcarre-app/nagini/blob/v0.0.50/src/pyodide/worker/worker-config.js)
centralizes constants, most importantly the default
[`PYODIDE_CDN`](https://github.com/pointcarre-app/nagini/blob/v0.0.50/src/pyodide/worker/worker-config.js#L17)
URL (jsDelivr, Pyodide 314.0.2, Python 3.14) used when the host does not pass
`options.pyodideCdnUrl`, plus every user-facing message string.

### Python capture layer (embedded in the bundle)

These three files live in
[src/pyodide/python/](https://github.com/pointcarre-app/nagini/tree/v0.0.50/src/pyodide/python)
but execute inside Pyodide, in the worker. They are bundled into
`worker-dist.js` as raw strings, so no HTTP fetch happens at init. The
worker writes them to the virtual filesystem, imports each one with
`pyodide.pyimport` and keeps the returned PyProxy handles: the capture
infrastructure is only ever called through those module references, never
by name lookup in the namespace where user code runs. The only names
exposed to user code are the builtins `missive` and `input`.

[capture_system.py](https://github.com/pointcarre-app/nagini/blob/v0.0.50/src/pyodide/python/capture_system.py)
replaces `sys.stdout` and `sys.stderr` with capture buffers in
[`reset_captures`](https://github.com/pointcarre-app/nagini/blob/v0.0.50/src/pyodide/python/capture_system.py#L49)
and implements
[`get_stdout`](https://github.com/pointcarre-app/nagini/blob/v0.0.50/src/pyodide/python/capture_system.py#L76),
[`get_missive`](https://github.com/pointcarre-app/nagini/blob/v0.0.50/src/pyodide/python/capture_system.py#L92) and
[`get_figures`](https://github.com/pointcarre-app/nagini/blob/v0.0.50/src/pyodide/python/capture_system.py#L112),
plus the once-per-execution
[`missive`](https://github.com/pointcarre-app/nagini/blob/v0.0.50/src/pyodide/python/capture_system.py#L146)
function.

[code_transformation.py](https://github.com/pointcarre-app/nagini/blob/v0.0.50/src/pyodide/python/code_transformation.py)
is the async input fallback (only used when the browser lacks JSPI): it
rewrites genuine calls to the builtin `input()` into `await input()` on the
AST, through
[`transform_code_for_execution`](https://github.com/pointcarre-app/nagini/blob/v0.0.50/src/pyodide/python/code_transformation.py#L86)
and the
[`_AwaitInputTransformer`](https://github.com/pointcarre-app/nagini/blob/v0.0.50/src/pyodide/python/code_transformation.py#L15)
visitor. Calls inside sync functions, lambdas or class bodies are left alone,
where `await` would be invalid.

[pyodide_utilities.py](https://github.com/pointcarre-app/nagini/blob/v0.0.50/src/pyodide/python/pyodide_utilities.py)
provides
[`setup_matplotlib`](https://github.com/pointcarre-app/nagini/blob/v0.0.50/src/pyodide/python/pyodide_utilities.py#L7):
it switches matplotlib to the `agg` backend and turns `plt.show()` into a
no-op, since figures are captured manually after each run.

### PyodideFileLoader

[src/pyodide/file-loader/file-loader.js](https://github.com/pointcarre-app/nagini/blob/v0.0.50/src/pyodide/file-loader/file-loader.js)
downloads the `filesToLoad` entries (`{url, path}` objects, local or remote)
into the Pyodide virtual filesystem during init, with up to three attempts
and a growing delay between them in
[`loadFiles`](https://github.com/pointcarre-app/nagini/blob/v0.0.50/src/pyodide/file-loader/file-loader.js#L58).
Although it lives outside the worker directory, it runs inside the worker: it
is imported by
[worker-handlers.js](https://github.com/pointcarre-app/nagini/blob/v0.0.50/src/pyodide/worker/worker-handlers.js#L12)
and bundled into `worker-dist.js`.

### Pyodide sources: CDN or self-hosted

By default the worker loads Pyodide from the jsDelivr CDN pinned in
[worker-config.js](https://github.com/pointcarre-app/nagini/blob/v0.0.50/src/pyodide/worker/worker-config.js#L17).
Passing `options.pyodideCdnUrl` to `createManager` makes the worker run
[`import(pyodide.mjs)` and `loadPyodide`](https://github.com/pointcarre-app/nagini/blob/v0.0.50/src/pyodide/worker/worker-handlers.js#L132-L169)
against your own origin instead, which is how offline and Capacitor setups
work. See
[LOCAL_PYODIDE_CONFIGURATION.md](LOCAL_PYODIDE_CONFIGURATION.md)
for the full recipe.

### BrythonManager

[src/brython/manager/manager.js](https://github.com/pointcarre-app/nagini/blob/v0.0.50/src/brython/manager/manager.js)
mirrors the PyodideManager surface but runs everything in the main thread.
[loader.js](https://github.com/pointcarre-app/nagini/blob/v0.0.50/src/brython/manager/loader.js)
injects
[brython.js and brython_stdlib.js](https://github.com/pointcarre-app/nagini/tree/v0.0.50/src/brython/lib)
as script tags (paths overridable through `brythonJsPath` and
`brythonStdlibPath`), and
[executor.js](https://github.com/pointcarre-app/nagini/blob/v0.0.50/src/brython/manager/executor.js)
wraps user code in a capture harness and runs it as a `text/python3` script
tag with a per-execution callback. Input, packages and `fs` are not
supported, and the code has full DOM access: only run trusted code through
this backend.

## Build chain

```
 src/pyodide/worker/
 +-- worker.js  (entry) ------------+
 +-- worker-handlers.js             |     webpack.config.cjs
 +-- worker-execution.js            |     +--------------------------+
 +-- worker-input.js                |     | target: webworker        |
 +-- worker-fs.js                   +---->| alias @python ->         |
 +-- worker-snapshot.js             |     |   src/pyodide/python     |
 +-- worker-config.js               |     | rule: *.py bundled as    |
                                    |     |   raw text (asset/source)|
 src/pyodide/file-loader/           |     +------------+-------------+
 +-- file-loader.js ----------------+                  |
                                    |                  |
 src/pyodide/python/                |                  v
 +-- capture_system.py              |     src/pyodide/worker/worker-dist.js
 +-- code_transformation.py         |     (committed, served to browsers,
 +-- pyodide_utilities.py ----------+      wrapped in a blob URL at runtime)


 src/nagini.js  (entry) ------------+
 +-- src/utils/*.js                 |     webpack.umd.config.cjs
 +-- src/pyodide/manager/*.js       +---->  single chunk, UMD library
 +-- src/brython/manager/*.js ------+       named "Nagini"
                                                       |
                                                       v
                                          src/nagini.umd.js
```

Two webpack configs live next to the worker sources.
[webpack.config.cjs](https://github.com/pointcarre-app/nagini/blob/v0.0.50/src/pyodide/worker/webpack.config.cjs)
builds `worker-dist.js` from `worker.js`, with the
[`@python` alias](https://github.com/pointcarre-app/nagini/blob/v0.0.50/src/pyodide/worker/webpack.config.cjs#L15)
and an
[asset/source rule](https://github.com/pointcarre-app/nagini/blob/v0.0.50/src/pyodide/worker/webpack.config.cjs#L37-L38)
that turns `.py` files into plain strings.
[webpack.umd.config.cjs](https://github.com/pointcarre-app/nagini/blob/v0.0.50/src/pyodide/worker/webpack.umd.config.cjs)
builds `src/nagini.umd.js` from `src/nagini.js` as one self-contained UMD
file, with the dynamic backend imports inlined.

From the repository root, `npm run build` runs both builds (see the scripts in
[package.json](https://github.com/pointcarre-app/nagini/blob/v0.0.50/package.json)).
Both outputs are committed, so integrators consume them straight from a CDN
without any build step.
