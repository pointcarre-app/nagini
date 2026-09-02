# First run

Two complete pages, one per backend. Both are copy-paste ready.

## Pyodide

```html
<!doctype html>
<meta charset="utf-8">
<pre id="out">loading Python…</pre>
<script type="module">
  import { Nagini } from 'https://esm.sh/gh/pointcarre-app/nagini@v0.0.51/src/nagini.js';

  const WORKER = 'https://cdn.jsdelivr.net/gh/pointcarre-app/nagini@v0.0.51/src/pyodide/worker/worker-dist.js';
  const out = document.getElementById('out');

  const manager = await Nagini.createManager('pyodide', ['numpy'], [], [], WORKER);
  await Nagini.waitForReady(manager, 60000);

  const result = await manager.executeAsync('first.py', `
import numpy as np
values = np.array([2, 4, 6])
print("mean:", values.mean())
missive({"n": int(values.size)})
`);

  out.textContent = result.stdout;                       // "mean: 4.0\n"
  console.log(JSON.parse(result.missive));               // { n: 3 }
  if (result.error) console.error(result.stderr);        // traceback on Python errors
</script>
```

What happened, in order: the worker was created from a blob of `worker-dist.js`, Pyodide was downloaded from jsDelivr, numpy was loaded, the `input()` bridge was installed, then `ready` resolved `waitForReady`. The [initialization flow](../execution-flows.md#initialization-and-readypromise) traces every message.

`createManager` returns immediately; only `waitForReady` (or `manager.readyPromise`) tells you the interpreter is up. A Python exception does not reject the promise: `result.error` is set and the traceback is in `result.stderr`. Rejections are reserved for infrastructure problems such as a timeout or a worker crash.

## Brython

```html
<!doctype html>
<meta charset="utf-8">
<div id="turtle-canvas"></div>
<pre id="out"></pre>
<script type="module">
  import { Nagini } from 'https://esm.sh/gh/pointcarre-app/nagini@v0.0.51/src/nagini.js';

  const manager = await Nagini.createManager('brython', [], [], [], '', {
    brythonJsPath: 'https://cdn.jsdelivr.net/gh/pointcarre-app/nagini@v0.0.51/src/brython/lib/brython.js',
    brythonStdlibPath: 'https://cdn.jsdelivr.net/gh/pointcarre-app/nagini@v0.0.51/src/brython/lib/brython_stdlib.js',
  });
  await Nagini.waitForReady(manager);

  const result = await manager.executeAsync('square.py', `
from browser import document
import turtle
turtle.set_defaults(turtle_canvas_wrapper=document["turtle-canvas"])
t = turtle.Turtle()
for _ in range(4):
    t.forward(100)
    t.left(90)
turtle.done()
print("drawn")
`);
  document.getElementById('out').textContent = result.stdout;   // "drawn\n"
</script>
```

No worker and no WebAssembly: the code runs in the page's main thread with full DOM access, which is why the [security guide](../guide/security.md) asks for first-party code only on this backend. Brython's turtle replays its frames into the SVG when `turtle.done()` runs, so keep that call at the end.

## Next

Every capability has its own page in the [guide](../guide/execution.md). The [executions](https://pointcarre-app.github.io/nagini/scenery/executions/) demo page runs one live example per flow, with the exact integration code shown beside it.
