# Scenery

Browser test suite and demo pages for Nagini. Everything runs against the local sources in `../src`, except the CDN tests, which fetch published releases. The same pages are served on GitHub Pages at `https://pointcarre-app.github.io/nagini/scenery/`.

## Running the suite

```bash
cd scenery
env/bin/python run_tests.py
```

Needs network access (Pyodide download, jsDelivr and esm.sh tests) and takes about 4 minutes for 66 tests. On success it prints `All programmatic scenery tests passed!` and exits 0. Pass a file path as first argument to save the JSON report there.

If `env/` does not exist yet (it is untracked), create it first:

```bash
python3.12 -m venv env
env/bin/pip install -r requirements.txt
```

## Layout

| Path | Role |
| --- | --- |
| `index.html`, `app.js`, `interactive-functions.js` | The suite page and its hub. `app.js` imports the modules from `tests/`, runs them, fills the results table and writes the JSON report into the hidden `#test-results-json` element. |
| `run_tests.py` | Selenium runner. Starts `../serve.py` on a free port, loads `index.html` in headless Chrome, waits up to 300 seconds for `#test-results-json`, fails on any `"status": "fail"`. |
| `tests/` | Test modules (one file per class under test) plus Python fixtures loaded into the Pyodide filesystem. |
| `examples/` | Showcase of the Nagini API with editable, runnable snippets. |
| `executions/` | One runnable example per execution flow, with the integration code and the matching diagram from `../docs/execution-flows.md`. Boots its shared manager with `snapshotCache: true`. |
| `experiments-snapshot/` | Benchmark spike behind the snapshot cache: measures fresh boot against IndexedDB snapshot restore. Not part of the suite. |
| `sympy/` | Computer algebra showcase on the executions-page template: symbolic manipulation, exact calculus, equation solving, a symbolic-to-figure pipeline, input() feeding sympify, and strictyaml (installed from PyPI through micropip) validating YAML that sympy then solves. |
| `lycee/` | French high-school maths algorithms as runnable programs. |
| `dataeng/` | Data engineering snippets (Python, SQL, streams). `dataeng/api-live/` serves a FastAPI app in the browser through a service worker. |
| `arcade/` | Data engineer challenges and a sprint mode. |
| `atelier/` | Theme workshop for daisyUI and CodeMirror. |
| `atelier_rg2a/` | RGAA contrast workshop on the same stack. |
| `legacy/` | Superseded pages kept for reference: `v0.0.26.html` (esm.sh import check), `full_local.html` and `full_local_needed_for_app.html` (local Pyodide, require the untracked `pyodide-local*` folders at the repo root), and `v0.0.11-test.json` (an old test report). |
| `env/` | Python virtualenv for the runner (untracked). `requirements.txt` lists its dependencies: selenium, webdriver-manager, beautifulsoup4. |

## How the pieces relate

`run_tests.py` serves the repo root, so `index.html` can import `../src/nagini.js` and point workers at `../src/pyodide/worker/worker-dist.js`. The demo pages import the same sources one level deeper (`../../src/...`). The test outcome of each row carries a `data-main_critic` attribute: `wrapp` (pass), `flop` (assertion failure) or `glitch` (runtime error); `run_tests.py` reads the aggregated JSON instead of scraping the table. The pages in `legacy/` are not part of the suite, and the two `full_local*` pages only work when the local Pyodide distributions are present.
