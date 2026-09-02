# Install

Nagini is plain ES modules plus one bundled worker. Pick where each of the two comes from, pin a tag, done.

## The two files you need

| Piece | What it is | Where it may live |
| --- | --- | --- |
| `src/nagini.js` | The API entry point. It imports the managers and validation utilities as relative ES modules. | Any origin that resolves those imports: esm.sh, your own server, or the UMD bundle that has no imports at all. |
| `src/pyodide/worker/worker-dist.js` | The bundled Pyodide worker (webpack output, committed). | Any origin. Nagini fetches it and turns it into a blob worker, so cross-origin is fine. |

The Brython backend needs neither a worker nor a download beyond the Brython runtime files (see [Brython](../guide/brython.md)).

Always pin a [tag](https://github.com/pointcarre-app/nagini/tags). The snippets below use `v0.0.50`; `main` moves.

## esm.sh (recommended)

esm.sh rewrites the relative imports of `nagini.js` on the fly, so one line is enough:

```html
<script type="module">
  import { Nagini } from 'https://esm.sh/gh/pointcarre-app/nagini@v0.0.50/src/nagini.js';

  const WORKER = 'https://cdn.jsdelivr.net/gh/pointcarre-app/nagini@v0.0.50/src/pyodide/worker/worker-dist.js';
  const manager = await Nagini.createManager('pyodide', ['numpy'], [], [], WORKER);
  await Nagini.waitForReady(manager, 60000);
</script>
```

## UMD bundle

`src/nagini.umd.js` inlines every import. It works from any raw CDN and under strict module policies:

```html
<script type="module">
  const mod = await import('https://cdn.jsdelivr.net/gh/pointcarre-app/nagini@v0.0.50/src/nagini.umd.js');
  const Nagini = mod.default || mod;
</script>
```

## Import maps

If you prefer the raw sources from jsDelivr, map the relative imports yourself:

```html
<script type="importmap">
{
  "imports": {
    "./utils/validation.js": "https://cdn.jsdelivr.net/gh/pointcarre-app/nagini@v0.0.50/src/utils/validation.js",
    "./pyodide/manager/manager.js": "https://cdn.jsdelivr.net/gh/pointcarre-app/nagini@v0.0.50/src/pyodide/manager/manager.js",
    "./brython/manager/manager.js": "https://cdn.jsdelivr.net/gh/pointcarre-app/nagini@v0.0.50/src/brython/manager/manager.js"
  }
}
</script>
<script type="module">
  const { Nagini } = await import('https://cdn.jsdelivr.net/gh/pointcarre-app/nagini@v0.0.50/src/nagini.js');
</script>
```

Import maps need Chrome 89, Firefox 108 or Safari 16.4 and later.

## Self-hosted

Copy `src/` next to your page and import it relatively. This is the recommended setup for production: no third-party CDN in the chain, and subresource integrity becomes possible on your own assets.

```javascript
import { Nagini } from './nagini/nagini.js';
const manager = await Nagini.createManager('pyodide', ['numpy'], [], [], './nagini/pyodide/worker/worker-dist.js');
```

The worker path must point at `worker-dist.js`, never at the modular `worker.js`. Rebuild the bundle after touching anything under `src/pyodide/`:

```bash
npm install
npm run build     # worker-dist.js and nagini.umd.js
```

## Offline Pyodide

By default the worker loads Pyodide from jsDelivr (`https://cdn.jsdelivr.net/pyodide/v314.0.6/full/`). To serve it yourself, or to ship it inside a Capacitor or Cordova app, pass `pyodideCdnUrl`. The URL must end with a slash:

```javascript
const manager = await Nagini.createManager('pyodide', ['sympy'], [], [], './nagini/pyodide/worker/worker-dist.js',
  { pyodideCdnUrl: './pyodide/' });
```

The folder needs `pyodide.mjs`, `pyodide.asm.js`, `pyodide.asm.wasm`, `python_stdlib.zip`, `pyodide-lock.json` and the wheels of the packages you load. `scripts/create_minimal_pyodide.py` trims a full Pyodide download to the packages listed in its `PACKAGES_TO_INCLUDE` (about 18 MB with sympy and pydantic). A 404 during boot almost always means the trailing slash is missing or a wheel is absent from the folder.

## Troubleshooting

| Error | Cause and fix |
| --- | --- |
| `Cannot use import statement outside a module` | The script tag is not `type="module"`, or `nagini.js` was loaded as a classic script. Use esm.sh or the UMD bundle. |
| `Failed to resolve module specifier` | Raw jsDelivr cannot resolve the relative imports of `nagini.js`. Use esm.sh, an import map, or the UMD bundle. |
| `Manager initialization timeout` | Pyodide plus packages did not load within `waitForReady`'s budget (30 s by default). Raise it, and check the network tab for a blocked CDN. |
| Worker error mentioning `worker.js` | The worker path must be the bundled `worker-dist.js`. |
