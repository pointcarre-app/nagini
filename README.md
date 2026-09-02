# Nagini

Python in the browser behind one small JavaScript API. The Pyodide backend runs real CPython (WebAssembly) inside a web worker. The Brython backend transpiles Python to JavaScript in the page itself, for instant lightweight scripts such as turtle graphics.

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
[![Pyodide](https://img.shields.io/badge/Pyodide-314.0.6-blue.svg)](https://pyodide.org/)
[![Brython](https://img.shields.io/badge/Brython-stable-green.svg)](https://brython.info/)

Documentation: [pointcarre-app.github.io/nagini](https://pointcarre-app.github.io/nagini/) (guide, API reference, architecture, execution flows). Live demos and browser test suite: [scenery](https://pointcarre-app.github.io/nagini/scenery/).

## Install

Always pin a [tag](https://github.com/pointcarre-app/nagini/tags). `main` is the development branch.

```html
<script type="module">
  import { Nagini } from 'https://esm.sh/gh/pointcarre-app/nagini@v0.0.50/src/nagini.js';
</script>
```

esm.sh resolves Nagini's ES module imports on the fly. The Pyodide worker must be the bundled `worker-dist.js`. Nagini wraps it in a blob worker, so it can be served from any origin:

```javascript
const WORKER = 'https://cdn.jsdelivr.net/gh/pointcarre-app/nagini@v0.0.50/src/pyodide/worker/worker-dist.js';
```

UMD bundle, import maps, self-hosting and offline Pyodide are covered in the [install guide](https://pointcarre-app.github.io/nagini/getting-started/install/).

## Quick start

```javascript
const manager = await Nagini.createManager('pyodide', ['numpy', 'matplotlib'], [], [], WORKER);
await Nagini.waitForReady(manager, 60000);

const result = await manager.executeAsync('demo.py', `
import numpy as np
print(np.arange(5).mean())
missive({"ok": True})
`);

result.stdout    // "2.0\n"
result.missive   // '{"ok": true}'  (a JSON string on the Pyodide backend)
result.error     // null, or { name, message } with the traceback in result.stderr
result.figures   // base64 PNG strings for every matplotlib figure drawn
```

Brython needs no worker and no download:

```javascript
const brython = await Nagini.createManager('brython', [], [], [], '');
await Nagini.waitForReady(brython);
await brython.executeAsync('square.py', `
import turtle
t = turtle.Turtle()
for _ in range(4):
    t.forward(100)
    t.left(90)
`);
```

## Features

| Feature | Pyodide | Brython | Guide |
| --- | --- | --- | --- |
| `executeAsync` with stdout, stderr, error, timing | yes | yes | [execution](https://pointcarre-app.github.io/nagini/guide/execution/) |
| `input()` from a queue or a callback, native blocking on JSPI browsers | yes | no | [input](https://pointcarre-app.github.io/nagini/guide/input/) |
| matplotlib figures captured as PNG | yes | no | [figures](https://pointcarre-app.github.io/nagini/guide/figures/) |
| `missive()` structured result | JSON string | object | [missive](https://pointcarre-app.github.io/nagini/guide/missive/) |
| persistent globals, per-run namespace isolation | yes | ignored | [state](https://pointcarre-app.github.io/nagini/guide/state/) |
| virtual filesystem, files loaded from URLs | yes | no | [filesystem](https://pointcarre-app.github.io/nagini/guide/filesystem/) |
| Pyodide packages and micropip (PyPI) | yes | no | [packages](https://pointcarre-app.github.io/nagini/guide/packages/) |
| interpreter snapshot cache, boot in about 100 ms | yes | n/a | [snapshot cache](https://pointcarre-app.github.io/nagini/guide/snapshot-cache/) |
| turtle graphics and DOM access | no | yes | [Brython](https://pointcarre-app.github.io/nagini/guide/brython/) |

## API on one screen

```javascript
Nagini.createManager(backend, packages, micropipPackages, filesToLoad, workerPath, options)
//  options: pyodideCdnUrl, snapshotCache (Pyodide); brythonJsPath, brythonStdlibPath (Brython)
Nagini.waitForReady(manager, timeoutMs = 30000)
Nagini.executeFromUrl(url, manager, namespace)

manager.executeAsync(filename, code, namespace, timeoutMs = 30000)   // Promise<ExecutionResult>
manager.executeFile(filename, code, namespace)                        // fire and forget
manager.queueInput(value)  manager.setInputCallback(fn)  manager.provideInput(value)
manager.isWaitingForInput()  manager.getCurrentPrompt()
manager.fs(operation, params, timeoutMs = 10000)   // writeFile readFile mkdir exists listdir
manager.isReady  manager.readyPromise  manager.inputMode  manager.snapshotRestored
manager.executionHistory   // last 50 results
manager.destroy()
```

Full signatures and types: [API reference](https://pointcarre-app.github.io/nagini/api-reference/).

## Security

Nagini adds no sandbox on top of the browser. Pyodide code has the whole virtual filesystem, network access through the browser and the `js` bridge to the worker. Brython code runs in the page with full DOM access, so only run trusted code through it. The `namespace` parameter keeps runs from stepping on each other but shares one interpreter. Details and a reference CSP: [security guide](https://pointcarre-app.github.io/nagini/guide/security/).

## Development

```bash
npm install && npm run build          # rebuilds worker-dist.js and nagini.umd.js
python3 serve.py                      # http://127.0.0.1:8010/scenery/
cd scenery && env/bin/python run_tests.py   # 66 browser tests, needs network
```

The browser suite and the demo pages live in [`scenery/`](scenery/README.md). Docs build with MkDocs from `requirements.txt`.

## License

AGPL-3.0-only, copyright 2025 SAS POINTCARRE.APP. Pyodide is MPL-2.0 and Brython is BSD-3-Clause: see [3RD-PARTY.md](3RD-PARTY.md).
