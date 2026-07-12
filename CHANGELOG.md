# v0.0.49

- **Native synchronous input() via JSPI**: when the browser supports WebAssembly stack switching (Chrome 137+ and other evergreen engines), `builtins.input` blocks natively on the host response through `pyodide.ffi.run_sync` and user code runs completely unmodified: `input()` now also works inside sync functions, lambdas and class bodies, places the AST rewrite could never reach. Without JSPI the previous behavior remains as fallback (async handler plus AST rewrite of genuine `input()` calls)
- `manager.inputMode` reports the active bridge (`"jspi"` or `"async"`)
- **Fix**: the Brython turtle demo in scenery now draws even when user code omits `turtle.done()` (Brython's turtle only replays its frames into the SVG when `done()` runs; the demo appends it when missing)
- **Documentation**: full sweep of docs and demo copy to the current architecture: input flow rewritten for the dual mode with the AST rewrite as explicit fallback, init flow gained the snapshot-cache branch, repo_reference pages corrected (module worker, pyimport references, worker-snapshot.js, `pyodide_init.py` tombstone), README input section updated, executions page mentions `snapshotCache` and `manager.inputMode`, API reference regenerated
- **Testing**: new suite test proving `input()` inside a sync `def` returns the provided value in jspi mode; full suite green 65/65

# v0.0.48

- **Interpreter snapshot cache**: new `snapshotCache` option on `createManager` (Pyodide backend). The worker snapshots the bare interpreter plus Nagini's embedded Python modules right before the input bridge is installed, stores it in IndexedDB (~31 MB, keyed by Pyodide origin and a hash of the embedded sources, so any change invalidates it), and later boots restore it in about 100 ms instead of a ~0.8 s interpreter boot. Packages, micropip, `filesToLoad` and the input bridge are replayed after the restore: package state cannot live in the snapshot on current Pyodide (its serializer rejects the live JS references that package loading creates). Every cache failure degrades to a fresh boot; a corrupt entry is deleted and rebuilt
- `manager.snapshotRestored` reports whether the current worker booted from the cache
- The executions demo page runs with the option enabled
- **Testing**: new suite test covering make, restore, and input() plus missive on a restored interpreter; full suite green 64/64

# v0.0.47

- **Pyodide 314.0.2 (Python 3.14.2)**: default CDN bumped from 0.29.4. Everything the suite uses ships in the 314 distribution (numpy, matplotlib, sympy, pydantic, strictyaml, fastapi, httpx); sqlite3 and lzma are now part of the bundled stdlib, no package load needed
- Notable runtime changes inherited from Pyodide: faster FFI (PyProxy creation, string conversions), JS errors deserialized with their original types, `ssl` module reduced to a stub (in-process ASGI demos unaffected), hashlib without OpenSSL-only algorithms
- Local Pyodide folders (0.28) still work through `pyodideCdnUrl`: the loader only needs `pyodide.mjs`, present in both generations
- **Testing**: full suite green 63/63 on 314.0.2

# v0.0.46

- **Module worker**: the Pyodide worker now runs as a module worker (`new Worker(blobUrl, { type: "module" })`) and loads the runtime with a native dynamic `import` of `pyodide.mjs` instead of `importScripts(pyodide.js)`. Same public API and the same bundled `worker-dist.js`; this is the plumbing prerequisite for Pyodide 314, whose distribution is ESM-only and no longer supports classic workers
- Local and offline setups (`pyodideCdnUrl`) keep working: `pyodide.mjs` ships in every Pyodide distribution in use, including the minimal local folders. Module workers require an evergreen browser (Firefox 114+ notably)
- **Testing**: full suite green 63/63 on Pyodide 0.29.4, covering the default CDN and the local 0.28 folders

# v0.0.45

- **Scenery reorganized**: stray pages moved to `scenery/legacy/` (`v0.0.26.html`, `full_local*.html`, the old critics JSON), the hub gained a navigation header (suite, demos, legacy, docs), `scenery/README.md` rewritten as the directory map; public page URLs unchanged
- **Documentation**: new `docs/architecture.md` (full-system ASCII diagram, every box linked to its source) and `docs/execution-flows.md` (ASCII sequence diagrams for init, execute, input(), figures, state across executions, fs(), Brython, missive, each step linked to the code); links pinned to the release tag
- **Executions page**: new `scenery/executions/` (daisyUI + CodeMirror), one runnable section per flow (#classic, #error, #input, #matplotlib, #multiple, #missive, #fs), each showing the exact integration JS and the matching flow excerpt
- **Namespace hardening**: the worker writes the bundled Python modules to the virtual filesystem and imports them by reference (`pyodide.pyimport`), keeping PyProxy handles; the capture infrastructure is never resolved by name in the interpreter globals anymore, so user code rebinding `get_stdout`, `reset_captures` or `json` cannot corrupt result capture. `pyodide_init.py` is gone; the only names Nagini exposes to user code are the builtins `missive` and `input` (`builtins.json`, `debug_missive_system` and the raw execution of module sources into globals are removed)
- **Shadow warning**: a default-namespace execution that rebinds `missive` or `input` in the persistent globals triggers a one-time `warning` message naming the offending file (surfaced as `console.warn` by the manager)
- **Input setup**: the input bridge snippet runs in a throwaway namespace; `requestInput` and `input_handler` no longer leak into user globals
- **Bokeh removed**: `get_bokeh_figures()`, the `bokeh_figures` result field, the showcase example, the root `examples/` and `notes/` folders and all related documentation; matplotlib capture is unchanged
- **Documentation**: namespace isolation guarantees and limits (what a namespaced run still shares: builtins, `sys.modules`, filesystem, matplotlib state) documented in the execution flows, with a pointer from the README security section; broken Brython `createManager` examples in the README fixed (`filesToLoad` must be an array)
- **Testing**: full suite green 63/63 (the bokeh capture test leaves with the feature)

# v0.0.44

- **Message protocol rework**: worker requests (execute, fs) now carry a correlation id echoed back in the response; a single permanent `onmessage` handler settles the matching promise. The handler-replacement pattern ("handler hijack") is gone from both `manager-static-execution.js` and `manager-fs.js`
  - **Fix**: a `fs()` call issued while an execution is in flight no longer hangs (the interceptors used to clobber each other's handler)
  - **Fix**: a late result from a timed-out execution is discarded by id instead of being attributed to the next execution
  - **Fix**: a worker crash rejects every pending request with the crash cause
- **Readiness**: managers expose `readyPromise`, resolved on the worker `ready` message and rejected with the original cause on init failure (bad worker path, CDN error); `Nagini.waitForReady` races it instead of polling `isReady` every 100 ms, so a broken `workerPath` rejects fast with the real error. Available on both Pyodide and Brython backends
- **API**: `manager.fs(operation, params, timeoutMs)` accepts an optional timeout (default 10000 ms); `setHandleMessage`/`getHandleMessage` removed (internal-only, no known consumers)
- **Testing**: four new scenery tests (fs during execution, concurrent executeAsync, timeout recovery with id-based discard, waitForReady rejection cause); full suite green 64/64

# v0.0.43

- **Build chain**: `nagini.umd.js` is no longer a hand-maintained copy: it is generated from `src/nagini.js` by webpack (`npm run build:umd`), with managers bundled inline; `npm run build` rebuilds both committed bundles (worker + UMD)
- **Packaging**: root `package.json` is now a real package (`nagini`, `exports` map for `.`, `./umd` and `./pyodide/worker`, `files` whitelist, version synced with tags)
- **SRI**: all third-party CDN assets in the demo pages (daisyUI, Tailwind browser, CodeMirror, BokehJS) are pinned to exact versions with `integrity` + `crossorigin` attributes; hashes verified against the served content
- **Documentation**: Security section extended with a Brython isolation warning (main-thread execution, full DOM access: trusted code only), a reference Content Security Policy, and CDN pinning guidance

# v0.0.42

- **Brython robustness**: `executeAsync` now wraps user code in try/except: a raising script resolves with `error` set (type, message, traceback appended to stderr) instead of hanging forever; completion callbacks are keyed per execution id (no shared global slot); new `timeoutMs` parameter (default 30000 ms) mirroring the Pyodide backend
- **UMD fix**: the UMD bundle now forwards `pyodideCdnUrl` to `PyodideManager`; offline/local Pyodide was silently ignored through the UMD path
- **Memory**: `executionHistory` is capped at 50 entries and no longer stores base64 figures; `executeAsync` results are built from the worker payload and still carry `figures`/`bokeh_figures`
- **Dev servers**: `serve.py` binds 127.0.0.1 by default (pass `--host 0.0.0.0` to expose); Flask example runs with `debug=False` on 127.0.0.1
- **Documentation**: README pinned CDN URLs updated from v0.0.29 to v0.0.35
- **Testing**: three new scenery tests (Brython error propagation, Brython concurrent executions, local UMD `pyodideCdnUrl` forwarding); full suite green 60/60

# v0.0.35

- **Arcade Game**: New `scenery/arcade/` page with two game modes for students
  - **Défis**: 13 data engineering algorithm challenges with holes to fill (exact and logical deduplication, counting, batching, manual GROUP BY, hash join, moving average, top-k with heapq, z-score outliers, Levenshtein distance, Jaccard trigram similarity, haversine GPS distance matrix), validated by hidden tests running in Pyodide, with a timer and personal records in localStorage
  - **Sprint**: 10 random fill-in-the-blank code snippets against the clock (pure JS, playable while Python boots), with a learning recap at the end

# v0.0.34

- **Pyodide 0.29.4**: Default CDN upgraded from 0.28.0 (Python 3.13.2, fastapi/starlette/httpx/pyarrow/geopandas now available in the distribution); full scenery suite green, local 0.28 bundles still supported
- **Execution**: User code now always runs through `runPythonAsync`: top-level `await` is available in any snippet (asyncio, httpx/ASGI, ...)
- **Live API Demo**: New `scenery/dataeng/api-live/` page: a real FastAPI app runs in Pyodide and a service worker routes the page's `fetch('./api/*')` calls to it (real requests in DevTools, 200/404/422/201 + OpenAPI), with an in-page REST client
- **Snippets**: Two new dataeng entries: `pyxhr` (real CORS network call to geo.api.gouv.fr with a requests-like API) and FastAPI tested in-process via `httpx.ASGITransport` (TestClient does not work in Pyodide: no threads)

# v0.0.30

- **Showcase Page**: New `scenery/examples/` page (daisyUI + CodeMirror, dark squared theme) with 12 runnable examples in tabs: matplotlib neon plots, Mandelbrot, Lissajous, random walks, polar roses, traffic heatmap, game of life, interactive Bokeh phyllotaxis, sympy analysis, FFT spectrum, missive() report and interactive stdin
- **API**: `executeAsync(filename, code, namespace, timeoutMs)` accepts an optional timeout (default 30000 ms) so interactive `input()` code can wait longer than 30 seconds
- **Fix**: matplotlib in the worker now points `font.sans-serif` to `DejaVu Sans` (bundled in Pyodide) instead of Arial, removing the `findfont` warnings that polluted stderr on every figure

# v0.0.29

- **Audit Fixes**: Corrections following a full codebase audit
  - **Fix**: Removed `[DEBUG]` print statements that polluted captured stdout when `missive()` was used
  - **Fix**: Added `worker.onerror` handler so worker crashes are detected and reported instead of hanging silently
  - **Fix**: Concurrent `executeAsync` calls are now serialized to prevent interleaved results
  - **Fix**: Brython parameter validation aligned with the Pyodide backend
- **Documentation**: Added an honest Security section to the README (no sandboxing beyond the browser/WebAssembly; `ValidationUtils.checkDangerousPatterns` is opt-in, not applied automatically)
- **Documentation**: Updated pinned CDN URLs in README and docs to the current tag; corrected obsolete descriptions of the `input()` transformation

# v0.0.28

- **input() Rewrite**: Replaced the line-by-line text substitution of `input(` with a proper AST transformation (`ast.NodeTransformer` in `code_transformation.py`)
  - **Fix**: Only genuine calls to the builtin `input()` are prefixed with `await`; names like `some_func__input()` or `obj.input()` are no longer corrupted
  - **Scoping**: Calls inside a sync `def`, a `lambda` or a class body are left untouched; calls inside `async def` are transformed
  - **No Wrapper**: Removed the `async def __run_code()` wrapper; code runs directly via `runPythonAsync` (top-level `await`), so top-level variables now persist in the globals
  - **Worker**: Detection gate switched from `includes('input(')` to the regex `/(?<![\w.])input\s*\(/` in `worker-execution.js`
- **Testing**: Added integration test #8 covering name collisions and globals persistence; full scenery suite green (57/57)

# v0.0.27

- **Local Pyodide**: Ensured the minimal 18MB Pyodide folder works for full Nagini usage
- **Testing**: Added `scenery/full_local_needed_for_app.html` and new scenery entries to validate the minimal local distribution

# v0.0.26

- **Local Pyodide**: Local configuration now covers the full feature set ("local also full")
- **Documentation**: Added `docs/LOCAL_PYODIDE_CONFIGURATION.md`
- **Testing**: Extended `pyodide-cdn-config-tests.js` and scenery with local configuration tests

# v0.0.25

- **Local Pyodide**: Full local implementation with a locally served Pyodide distribution (no CDN required)
- **Tooling**: Added `create_minimal_pyodide.py` to shrink the Pyodide distribution from ~300MB to ~40MB
- **Testing**: Added `scenery/full_local.html` and CDN/local configuration tests

# v0.0.24

- **Error Handling** + Docs



# v0.0.23

- **Error Handling**: Added comprehensive support for error handling in the `PyodideManager`
  - **Fix**: Corrected the `captureOutputs` function to properly capture Bokeh figures and errors.
  - **Fix**: Corrected the `handleMessage` function to properly capture Bokeh figures and errors.
  - **Fix**: Corrected the `executeAsync` function to properly capture Bokeh figures and errors.
  - **Fix**: Corrected the `executeFile` function to properly capture Bokeh figures and errors.
  - **Fix**: Corrected the `executeAsync` function to properly capture Bokeh figures and errors.



# v0.0.22

- **Bokeh Integration**: Added comprehensive support for Bokeh interactive visualizations
  - **📈 Capture System**: Extended `capture_system.py` to capture Bokeh plots as JSON via `bokeh.embed.json_item()`
  - **Worker Updates**: Modified `worker-execution.js` to capture and return `bokeh_figures` array alongside matplotlib figures
  - **Dual Strategy**: Implemented separate approaches for `/examples` (full interactivity) and `/scenery` (programmatic testing)
  - **Interactive Examples**: Created `bokeh-interactive.html` and `bokeh-interactive-widgets.html` demonstrating full Bokeh capabilities
  - **Bidirectional Widgets**: Implemented JavaScript-to-Python parameter passing for dynamic plot updates
  - **Test Coverage**: Added `testBokehCaptureWorkflow()` to verify backend capture without frontend dependencies
- **Documentation**: Comprehensive Bokeh documentation added to README with setup instructions, troubleshooting, and architecture details
- **Performance**: Bokeh capture works independently of BokehJS libraries, enabling lightweight backend testing

# v0.0.21

- **Logging Optimization**: Significantly minimized verbose logging across pyodide and utils directories while preserving essential execution results
  - **🐍 Enhanced Execution Logging**: All execution results (stdout/stderr/error/missive) now prominently displayed with snake emoji for easy identification
  - **Reduced Noise**: Removed verbose constructor, initialization, package loading, and file operation logs
  - **Clean Console**: Minimized worker creation, input handling, and validation logs while maintaining error reporting
  - **Performance**: Cleaner console output improves debugging experience and reduces log overhead
- **Code Quality**: Maintained all functionality while significantly improving log signal-to-noise ratio
- **Developer Experience**: Execution results are now the primary focus in console output with clear 🐍 snake emoji markers

# v0.0.20

- **Bug Fixes**: Fixed template literal syntax errors in esm.sh execution tests - replaced triple backslashes with clean string concatenation
- **UMD Bundle Fixes**: Resolved UMD bundle import issues by enhancing test methods to handle multiple import scenarios (module exports + global fallback)
- **Test Improvements**: Updated UMD tests to use v0.0.19 (where UMD bundle was actually created) instead of v0.0.17
- **Documentation**: All CDN import solutions now fully tested and working - esm.sh ⭐, UMD Bundle, and Import Maps
- **Production Ready**: Complete CDN import solution with comprehensive test coverage and clean, maintainable code

# v0.0.19

- **CDN Import Solutions**: Implemented comprehensive CDN import solutions for ES6 module compatibility:
  - **esm.sh CDN** ⭐ (Recommended): Smart CDN with automatic ES6 dependency resolution - free for commercial use
  - **UMD Bundle** (`nagini.umd.js`): Universal module definition for maximum compatibility across all environments
  - **Import Maps**: Modern browser solution for fine-grained dependency control
  - **Comprehensive Testing**: Added dedicated test suites for each CDN import method in scenery
  - **Documentation**: Created detailed comparison table and implementation guides for all solutions
- **Primary Solution**: esm.sh CDN chosen as the recommended approach for its simplicity and universal compatibility


# v0.0.18

- **Testing**: Added comprehensive CDN version and execution tests to the `scenery` test suite. These new tests validate that Nagini can be properly loaded and executed from the jsDelivr CDN, ensuring production readiness for CDN-based deployments.


# v0.0.17

- **CI/CD Fix**: Corrected the `requirements.txt` to properly install the imaging dependencies for the `mkdocs-material` social plugin. This resolves the final, persistent build error and ensures the documentation deploys successfully.

# v0.0.16

- **CI/CD Fix**: Corrected all deployment pathing issues for the GitHub Pages site. The interactive `scenery` test suite is now fully functional on the live documentation site.
- **Docs**: All hardcoded local URLs in the documentation have been replaced with relative paths for portability.
- **Stability**: This version marks the first stable release after the upgrade to Pyodide v0.28.0 and the resolution of all related deployment and testing issues.

> [!DANGER]
> Versions prior to `v0.0.16` are unstable.

# v0.0.15-unstable

- **CI/CD Fix**: Corrected the MkDocs deployment workflow by installing the necessary imaging dependencies (`mkdocs-material[imaging]`) for the social plugin. This resolves the final build error and ensures the documentation deploys successfully.

# v0.0.14-unstable

- **CI/CD**: Refactored the GitHub Pages deployment workflow to use a more robust, two-stage process. This resolves 404 errors for documentation pages by ensuring the entire `site` directory, including the `scenery` test application, is correctly deployed.
- **Docs**: Added links to the live documentation and interactive demos at the top of the `README.md` for easy access.

# v0.0.13-unstable

- **Upgrade**: Upgraded Pyodide to v0.28.0.
- **Fix**: Corrected Matplotlib integration to be compatible with Pyodide v0.28.0. The internal backend is now explicitly set to `agg` to ensure compatibility with the Web Worker environment, and font caching has been disabled to improve test stability.
- **Fix**: Resolved an issue where interactive test buttons in the `/scenery` application were unresponsive.
- **Documentation**: Added a new "Repository Reference" section to the documentation, providing a detailed file-by-file breakdown of the entire `src` directory.
- **Experiments**: Added a new `matplotlib-default` experiment to demonstrate the correct usage of Matplotlib within Nagini. Removed obsolete Matplotlib experiments.

# v0.0.12-unstable

- **Documentation**: Added a full documentation site with MkDocs, including a JSDoc-based API reference.
- **GitHub Actions**: Set up a new workflow to automatically build and deploy the documentation to GitHub Pages.

# v0.0.11-unstable

- **Fix**: Corrected a 404 error in the scenery application by removing an import for a non-existent `failure-tests.js` file.
- **README**: Added a prominent legend to clarify the branching model and production usage guidelines.
- **README**: Removed outdated information about `pre-push` hooks.




# v0.0.10-unstable

- **Bug Fix**: Fixed a critical bug where the asynchronous `input()` handling was broken. The `PyodideManager` was not correctly dequeuing and sending inputs to the worker, causing tests to fail and `input()` to return empty strings.
- **Documentation**: Added comprehensive documentation for the interactive input system to `docs/docs.md` and both the root and worker `README.md` files to clarify the asynchronous flow and prevent future regressions.
- **Worker Bundle Update**: Rebuilt `worker-dist.js` to include the input handling fix.

**🌐 jsDelivr CDN URLs for v0.0.10:**
- **Main Nagini Module**: `https://cdn.jsdelivr.net/gh/pointcarre-app/nagini@v0.0.10/src/nagini.js`
- **Pyodide Worker (ES6)**: `https://cdn.jsdelivr.net/gh/pointcarre-app/nagini@v0.0.10/src/pyodide/worker/worker.js`
- **Pyodide Worker (Bundled)**: `https://cdn.jsdelivr.net/gh/pointcarre-app/nagini@v0.0.10/src/pyodide/worker/worker-dist.js`


# v0.0.9-unstable

- **Bug Fix**: Corrected an issue where `PyodideFileLoader.loadFiles` was called as a static method instead of an instance method within the web worker, preventing custom files from being loaded.
- **Worker Bundle Update**: Rebuilt `worker-dist.js` to include the file loader fix.

**🌐 jsDelivr CDN URLs for v0.0.9:**
- **Main Nagini Module**: `https://cdn.jsdelivr.net/gh/pointcarre-app/nagini@v0.0.9/src/nagini.js`
- **Pyodide Worker (ES6)**: `https://cdn.jsdelivr.net/gh/pointcarre-app/nagini@v0.0.9/src/pyodide/worker/worker.js`
- **Pyodide Worker (Bundled)**: `https://cdn.jsdelivr.net/gh/pointcarre-app/nagini@v0.0.9/src/pyodide/worker/worker-dist.js`



# v0.0.8-unstable

- **Code Refactoring**: Removed redundant `Nagini` export in `src/nagini.js` to prevent double exports and improve code clarity.

**🌐 jsDelivr CDN URLs for v0.0.8:**
- **Main Nagini Module**: `https://cdn.jsdelivr.net/gh/pointcarre-app/nagini@v0.0.8/src/nagini.js`
- **Pyodide Worker (ES6)**: `https://cdn.jsdelivr.net/gh/pointcarre-app/nagini@v0.0.8/src/pyodide/worker/worker.js`
- **Pyodide Worker (Bundled)**: `https://cdn.jsdelivr.net/gh/pointcarre-app/nagini@v0.0.8/src/pyodide/worker/worker-dist.js`



# v0.0.7-unstable

- **Logging Format Standardization**: Standardized all logging messages to use consistent snake emoji (🐍) prefix
    - Updated all console.log, console.warn, console.error, and console.info statements across `/src` directory
    - Replaced various emojis (🔧, ️, 📦, 🏭, 🚨, 🐢, ⚡, etc.) with consistent 🐍 snake emoji
    - Improved log readability and consistency across all modules
- **Reduced Verbose Logging**: Removed full file content logging in worker execution
    - Eliminated logging of entire transformed Python code blocks
    - Removed ASCII separator lines that cluttered console output
    - Kept essential execution information while reducing noise
- **Worker Bundle Update**: Rebuilt worker-dist.js with new logging format
    - All worker logging now follows consistent snake emoji format
    - Reduced bundle size by removing verbose code logging

**🌐 jsDelivr CDN URLs for v0.0.7:**
- **Main Nagini Module**: `https://cdn.jsdelivr.net/gh/pointcarre-app/nagini@v0.0.7/src/nagini.js`
- **Pyodide Worker (ES6)**: `https://cdn.jsdelivr.net/gh/pointcarre-app/nagini@v0.0.7/src/pyodide/worker/worker.js`
- **Pyodide Worker (Bundled)**: `https://cdn.jsdelivr.net/gh/pointcarre-app/nagini@v0.0.7/src/pyodide/worker/worker-dist.js`



# v0.0.5-unstable

- **GitHub Migration**: Migrated project to GitHub for better collaboration and open source visibility
- **Enhanced Documentation**: Updated documentation for better clarity
- **ES6 Module Support**: Fixed module import issues for better browser compatibility

**🌐 jsDelivr CDN URLs for v0.0.5:**
- **Main Nagini Module**: `https://cdn.jsdelivr.net/gh/pointcarre-app/nagini@v0.0.5/src/nagini.js`
- **Pyodide Worker (ES6)**: `https://cdn.jsdelivr.net/gh/pointcarre-app/nagini@v0.0.5/src/pyodide/worker/worker.js`
- **Pyodide Worker (Bundled)**: `https://cdn.jsdelivr.net/gh/pointcarre-app/nagini@v0.0.5/src/pyodide/worker/worker-dist.js`



# v0.0.4-unstable

- No dual licensing: only AGPLv3



# v0.0.3-unstable

- Added micropip support
    - Added antlr4-python3-runtime support


# v0.0.2-unstable

- Fixed missive handling (ie parse at last moment, outside of the manager)
- Fixed `/scenery` 
- Fixed `/tests` (ie Flask cross origin)


# v0.0.1-unstable 

- Initial release
- Worker-based architecture
- Interactive input
- Matplotlib visualization
- Remote module loading
- Namespace isolation
- Structured data exchange
- Filesystem access
- Dual backend support
- Scenery testing