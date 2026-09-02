# Nagini

Python in the browser behind one small JavaScript API. The Pyodide backend runs real CPython (WebAssembly) inside a web worker. The Brython backend transpiles Python to JavaScript in the page itself, for instant lightweight scripts such as turtle graphics.

```javascript
import { Nagini } from 'https://esm.sh/gh/pointcarre-app/nagini@v0.0.51/src/nagini.js';

const manager = await Nagini.createManager('pyodide', ['numpy'], [], [],
  'https://cdn.jsdelivr.net/gh/pointcarre-app/nagini@v0.0.51/src/pyodide/worker/worker-dist.js');
await Nagini.waitForReady(manager, 60000);

const result = await manager.executeAsync('demo.py', 'import numpy as np\nprint(np.arange(5).mean())');
console.log(result.stdout);   // "2.0\n"
```

## Where to go

| Section | What it holds |
| --- | --- |
| [Getting started](getting-started/install.md) | Install from a CDN or your own origin, then a first complete page for each backend. |
| [Guide](guide/execution.md) | One page per capability, all with the same shape: use, details, limits, see also. |
| [Reference](api-reference.md) | Generated API reference, the architecture map, the execution flows traced message by message, and a page per source file. |
| [Project](project/testing.md) | How the browser test suite runs, the changelog, third-party licenses. |

## Live pages

The [scenery](https://pointcarre-app.github.io/nagini/scenery/) hub runs the browser test suite and links every demo: [executions](https://pointcarre-app.github.io/nagini/scenery/executions/) (one runnable example per execution flow), [examples](https://pointcarre-app.github.io/nagini/scenery/examples/), [sympy](https://pointcarre-app.github.io/nagini/scenery/sympy/), [lycée](https://pointcarre-app.github.io/nagini/scenery/lycee/) (French high-school algorithms), [data engineering](https://pointcarre-app.github.io/nagini/scenery/dataeng/) and [arcade](https://pointcarre-app.github.io/nagini/scenery/arcade/).

## Versions

Always pin a [tag](https://github.com/pointcarre-app/nagini/tags) in CDN URLs. `main` is the development branch. Source links in the reference pages are pinned to the tag named at the top of each page.
