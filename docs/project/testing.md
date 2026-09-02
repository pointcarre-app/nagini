# Testing

The suite runs in a real browser against the local sources. It lives in `scenery/` with the demo pages, and the same pages are published on [GitHub Pages](https://pointcarre-app.github.io/nagini/scenery/).

## Run it

```bash
cd scenery
python3.12 -m venv env && env/bin/pip install -r requirements.txt   # first time only
env/bin/python run_tests.py
```

The runner starts `serve.py` on a free port, loads `scenery/index.html` in headless Chrome, waits for the aggregated JSON report and exits non-zero on any failing test. It needs network access (Pyodide download, jsDelivr and esm.sh tests) and takes about four minutes for 66 tests. Pass a file path as first argument to save the JSON report.

To watch the suite by hand, run `python3 serve.py` at the repo root and open `http://127.0.0.1:8010/scenery/`.

## What it covers

| Module | Under test |
| --- | --- |
| `nagini-tests.js` | The facade: `createManager`, `waitForReady`, `executeFromUrl`, backend checks. |
| `pyodide-manager-tests.js`, `pyodide-integration-tests.js` | Execution, results, `input()` in both bridge modes (including the empty string and a call inside a sync `def`), namespaces, figures, the snapshot cache. |
| `python-error-handling-tests.js` | `result.error` and tracebacks. |
| `file-loader-tests.js` | `filesToLoad` and the virtual filesystem. |
| `brython-manager-tests.js` | The Brython backend, turtle included. |
| `cdn-*.js`, `esm-sh-*.js`, `umd-tests.js` | Published releases loaded from jsDelivr and esm.sh, and the UMD bundle. |
| `validation-utils-tests.js`, `utilities-tests.js` | Parameter validation and helpers. |

## Before a commit

There is no continuous integration beyond the Pages deployment. The local rule is: suite green, then `npm run build` produces no diff in `worker-dist.js` and `nagini.umd.js`.

## Demo pages

| Page | Role |
| --- | --- |
| `executions/` | One runnable example per execution flow, with the integration code and the diagram from the flows page. Boots with `snapshotCache: true`. |
| `examples/` | Editable, runnable snippets showing the API. |
| `sympy/` | Symbolic algebra, exact calculus, figures from expressions, `input()` feeding `sympify`, strictyaml through micropip. |
| `lycee/` | French high-school maths algorithms as runnable programs. |
| `dataeng/` | Data engineering snippets; `dataeng/api-live/` serves a FastAPI app in the browser through a service worker. |
| `arcade/` | Data engineer challenges and a sprint mode. |
| `atelier/`, `atelier_rg2a/` | Theme and RGAA contrast workshops on the same stack. |
| `experiments-snapshot/` | Benchmark behind the snapshot cache. Not part of the suite. |
| `legacy/` | Superseded pages kept for reference. |
