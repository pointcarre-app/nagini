# Execution flows

All source links on this page are pinned to the released tag
[v0.0.46](https://github.com/pointcarre-app/nagini/tree/v0.0.46), so they stay
valid whatever happens on `main`. They are re-pinned at each release, the same
habit as the CDN URLs in the README.

This page traces every kind of code execution through Nagini, message by
message, so you can follow any run on paper. The static component map is in
[architecture](architecture.md). Each flow ends with a minimal integration
snippet and a link to the live example page.

How to read the diagrams: each column is a component and its vertical bar is
its lifeline, time flows downward, `--->` is a `postMessage` or a direct
function call, and lines starting with `-` after a bar are actions inside that
component. Column key:

```
[host page]        your code
[Nagini]           src/nagini.js (facade)
[PyodideManager]   src/pyodide/manager/*.js, main thread
[worker]           src/pyodide/worker/worker-dist.js, separate thread
[python]           code running inside Pyodide (capture layer + user code)
```

## Initialization and readyPromise

```
[host page]                  [Nagini]                 [PyodideManager]                  [worker]                      [python]
     |                           |                            |                             |                             |
     |-------------------------->|                            |                             |                             |
     | createManager('pyodide',  |                            |                             |                             |
     | packages, micropip,       |                            |                             |                             |
     | filesToLoad, workerPath,  |                            |                             |                             |
     | options)                  |                            |                             |                             |
     |                           |- validateBackend()         |                             |                             |
     |                           |  enforce worker-dist.js    |                             |                             |
     |                           |  import backend module     |                             |                             |
     |                           |--------------------------->|                             |                             |
     |                           | new PyodideManager(...)    |                             |                             |
     |                           |                            |- constructor():             |                             |
     |                           |                            |  validate arguments,        |                             |
     |                           |                            |  create readyPromise,       |                             |
     |                           |                            |  call initWorker()          |                             |
     |                           |                            |- createBlobWorkerUrl():     |                             |
     |                           |                            |  fetch(workerPath) + Blob   |                             |
     |                           |                            |  + URL.createObjectURL      |                             |
     |                           |                            |- new Worker(blobUrl)        |                             |
     |                           |                            |---------------------------->|                             |
     |                           |                            | postMessage {type: 'init',  |                             |
     |                           |                            | packages, micropip,         |                             |
     |                           |                            | filesToLoad, pyodideCdnUrl} |                             |
     |<--------------------------|                            |                             |                             |
     | manager (not ready yet)   |                            |                             |                             |
     |                           |                            |                             |                             |
     |-------------------------->|                            |                             |                             |
     | waitForReady(manager,     |                            |                             |                             |
     | timeout)                  |                            |                             |                             |
     |                           |- Promise.race(             |                             |                             |
     |                           |  readyPromise,             |                             |                             |
     |                           |  timeout promise)          |                             |                             |
     |                           |                            |                             |                             |
     |                           |                            |                             |- handleInit():              |
     |                           |                            |                             |  import(pyodide.mjs),       |
     |                           |                            |                             |  await loadPyodide()        |
     |                           |                            |                             |---------------------------->|
     |                           |                            |                             | write capture_system.py,    |
     |                           |                            |                             | code_transformation.py,     |
     |                           |                            |                             | pyodide_utilities.py to FS  |
     |                           |                            |                             |---------------------------->|
     |                           |                            |                             | pyimport the three modules, |
     |                           |                            |                             | keep PyProxy references     |
     |                           |                            |                             |                             |- builtins.missive installed,
     |                           |                            |                             |                             |  reset_captures()
     |                           |                            |                             |---------------------------->|
     |                           |                            |                             | setupInputHandling()        |
     |                           |                            |                             |                             |- builtins.input replaced by
     |                           |                            |                             |                             |  async input_handler
     |                           |                            |                             |- PyodideFileLoader          |
     |                           |                            |                             |  .loadFiles(filesToLoad)    |
     |                           |                            |                             |- loadPackages(packages),    |
     |                           |                            |                             |  micropip.install(...)      |
     |                           |                            |                             |---------------------------->|
     |                           |                            |                             | setup_matplotlib()          |
     |                           |                            |<----------------------------|                             |
     |                           |                            | postMessage {type: 'ready'} |                             |
     |                           |                            |- handleMessage():           |                             |
     |                           |                            |  isReady = true             |                             |
     |                           |                            |  _readyResolve()            |                             |
     |<--------------------------|                            |                             |                             |
     | waitForReady resolves     |                            |                             |                             |
```

Step by step:

1. `Nagini.createManager("pyodide", packages, micropipPackages, filesToLoad, workerPath, options)`
   ([nagini.js#L28](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/nagini.js#L28))
   checks the backend name with `validateBackend`
   ([validation.js#L208](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/utils/validation.js#L208)),
   requires a `worker-dist.js` path
   ([nagini.js#L34-L45](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/nagini.js#L34-L45)),
   dynamically imports the backend
   ([nagini.js#L47](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/nagini.js#L47))
   and constructs the manager
   ([nagini.js#L52](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/nagini.js#L52)).
2. The `PyodideManager` constructor
   ([manager.js#L51](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/pyodide/manager/manager.js#L51))
   validates every argument
   ([manager.js#L55-L63](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/pyodide/manager/manager.js#L55-L63)),
   creates the `readyPromise`
   ([manager.js#L107-L116](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/pyodide/manager/manager.js#L107-L116))
   and calls `initWorker`
   ([manager.js#L119](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/pyodide/manager/manager.js#L119)).
3. `initWorker`
   ([manager.js#L149](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/pyodide/manager/manager.js#L149))
   fetches the bundle and wraps it in a blob URL with `createBlobWorkerUrl`
   ([createBlobWorker.js#L15](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/utils/createBlobWorker.js#L15)),
   creates the `Worker`
   ([manager.js#L157](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/pyodide/manager/manager.js#L157)),
   installs `_dispatchMessage` as the permanent `onmessage` handler
   ([manager.js#L159](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/pyodide/manager/manager.js#L161))
   and posts the `init` message
   ([manager.js#L177-L183](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/pyodide/manager/manager.js#L179-L185)).
4. In the worker, `self.onmessage`
   ([worker.js#L48](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/pyodide/worker/worker.js#L60))
   routes through `handleMessage`
   ([worker-handlers.js#L85](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/pyodide/worker/worker-handlers.js#L84))
   to `handleInit`
   ([worker-handlers.js#L117](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/pyodide/worker/worker-handlers.js#L116)):
   a dynamic `import` of `pyodide.mjs` followed by `loadPyodide`
   ([worker-handlers.js#L131-L136](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/pyodide/worker/worker-handlers.js#L131-L136))
   pulls the runtime from the CDN pinned in
   ([worker-config.js#L17](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/pyodide/worker/worker-config.js#L17))
   or from `options.pyodideCdnUrl`.
5. The three bundled Python modules are written to the virtual filesystem,
   then imported by reference with `pyodide.pyimport`
   ([worker-handlers.js](https://github.com/pointcarre-app/nagini/blob/main/src/pyodide/worker/worker-handlers.js)):
   the worker keeps PyProxy handles to `capture_system`,
   `code_transformation` and `pyodide_utilities` and calls the capture
   infrastructure through those handles, never by name lookup in the
   interpreter globals. Importing `capture_system` installs
   `builtins.missive`; the worker then activates capture with
   `reset_captures()`. Nothing else lands in the namespace user code runs
   in: the only names Nagini exposes to user code are `missive` and
   `input`.
6. `setupInputHandling`
   ([worker-input.js#L16](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/pyodide/worker/worker-input.js#L16))
   defines `self.requestInput` and replaces `builtins.input` with an async
   `input_handler`; the setup snippet runs in a throwaway namespace, so
   neither `requestInput` nor `input_handler` appears in the globals user
   code runs in
   ([worker-input.js#L39-L50](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/pyodide/worker/worker-input.js#L43-L53)).
7. `filesToLoad` entries are downloaded into the virtual filesystem by
   `PyodideFileLoader.loadFiles`
   ([worker-handlers.js#L163-L171](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/pyodide/worker/worker-handlers.js#L163-L171),
   [file-loader.js#L58](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/pyodide/file-loader/file-loader.js#L58)),
   with three retries and exponential backoff.
8. Packages install through `loadPackages`
   ([worker-handlers.js#L174](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/pyodide/worker/worker-handlers.js#L174),
   [worker-fs.js#L73](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/pyodide/worker/worker-fs.js#L73)),
   micropip packages through `micropip.install`
   ([worker-handlers.js#L177-L193](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/pyodide/worker/worker-handlers.js#L177-L193));
   both skip what this worker already loaded. Then `setup_matplotlib()`
   ([worker-handlers.js#L195](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/pyodide/worker/worker-handlers.js#L197),
   [pyodide_utilities.py#L7](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/pyodide/python/pyodide_utilities.py#L7))
   switches matplotlib to the `agg` backend if the package is present.
9. The worker posts `{type: "ready"}`
   ([worker-handlers.js#L202-L203](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/pyodide/worker/worker-handlers.js#L202-L203)).
   The manager flips `isReady`
   ([manager.js#L311-L313](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/pyodide/manager/manager.js#L312-L314))
   and resolves the `readyPromise`
   ([manager.js#L217-L219](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/pyodide/manager/manager.js#L219-L221)).
10. `Nagini.waitForReady`
    ([nagini.js#L74](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/nagini.js#L74))
    races the `readyPromise` against a timeout
    ([nagini.js#L78-L86](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/nagini.js#L78-L86));
    managers without a `readyPromise` fall back to polling `isReady`
    ([nagini.js#L93-L99](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/nagini.js#L93-L99)).

Failure path: a bad worker path, a CDN failure or a crash during init produces
an error message without id
([worker-handlers.js#L205-L209](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/pyodide/worker/worker-handlers.js#L205-L209)).
The manager then rejects the `readyPromise` with the original cause and fails
every pending request
([manager.js#L221-L227](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/pyodide/manager/manager.js#L223-L229)),
so `waitForReady` surfaces the real error instead of a generic timeout.

Integration snippet:

```javascript
import { Nagini } from "https://esm.sh/gh/pointcarre-app/nagini@v0.0.47/src/nagini.js";

const manager = await Nagini.createManager(
    "pyodide",
    ["numpy"],        // packages resolved by pyodide.loadPackage
    [],               // micropip packages (PyPI)
    [],               // filesToLoad: [{ url, path }]
    "https://cdn.jsdelivr.net/gh/pointcarre-app/nagini@v0.0.47/src/pyodide/worker/worker-dist.js"
);
await Nagini.waitForReady(manager, 60000);
```

See it live: the first run on the
[executions page](https://pointcarre-app.github.io/nagini/scenery/executions/#classic)
creates and initializes the shared manager
([repo-relative link](../scenery/executions/index.html#classic)).

## Classic executeAsync

```
[host page]                          [PyodideManager]                       [worker]                        [python]
     |                                       |                                  |                               |
     |-------------------------------------->|                                  |                               |
     | executeAsync(filename, code,          |                                  |                               |
     | namespace?, timeoutMs = 30000)        |                                  |                               |
     |                                       |- queued on executionChain        |                               |
     |                                       |  (one run at a time)             |                               |
     |                                       |- run():                          |                               |
     |                                       |  validateExecutionParams(),      |                               |
     |                                       |  isReady check                   |                               |
     |                                       |- _postRequest():                 |                               |
     |                                       |  id = _nextRequestId++,          |                               |
     |                                       |  _pendingRequests.set(id, ...),  |                               |
     |                                       |  setTimeout(timeoutMs)           |                               |
     |                                       |--------------------------------->|                               |
     |                                       | postMessage {type: 'execute',    |                               |
     |                                       | filename, code, id}              |                               |
     |                                       |                                  |- handleMessage()              |
     |                                       |                                  |  -> handleExecute()           |
     |                                       |                                  |- transformCodeForExecution(): |
     |                                       |                                  |  no input() call in code      |
     |                                       |                                  |  -> code unchanged            |
     |                                       |                                  |------------------------------>|
     |                                       |                                  | captureSystem.reset_captures()|
     |                                       |                                  |                               |- buffers cleared, sys.stdout and
     |                                       |                                  |                               |  sys.stderr replaced by capture streams
     |                                       |                                  |------------------------------>|
     |                                       |                                  | await runPythonAsync(code)    |
     |                                       |                                  |                               |- user code runs; print() writes into
     |                                       |                                  |                               |  the capture buffer; exceptions are
     |                                       |                                  |                               |  caught by handleExecute
     |                                       |                                  |- captureOutputs():            |
     |                                       |                                  |------------------------------>|
     |                                       |                                  | get_stdout(), get_stderr(),   |
     |                                       |                                  | get_missive(), get_figures()  |
     |                                       |                                  | through the module PyProxy    |
     |                                       |<---------------------------------|                               |
     |                                       | postMessage {type: 'result', id, |                               |
     |                                       | filename, stdout, stderr,        |                               |
     |                                       | missive, figures, error, time}   |                               |
     |                                       |- _dispatchMessage(): pending id  |                               |
     |                                       |  found -> clearTimeout;          |                               |
     |                                       |  handleMessage(): push entry to  |                               |
     |                                       |  executionHistory (cap 50)       |                               |
     |<--------------------------------------|                                  |                               |
     | promise resolves with the             |                                  |                               |
     | ExecutionResult object                |                                  |                               |
```

Step by step:

1. `manager.executeAsync(filename, code, namespace?, timeoutMs = 30000)`
   ([manager.js#L397](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/pyodide/manager/manager.js#L397))
   chains the run on `executionChain`
   ([manager.js#L417-L418](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/pyodide/manager/manager.js#L417-L418)),
   so two calls on the same manager never interleave.
2. When its turn comes, `run()` validates the parameters
   ([manager.js#L403](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/pyodide/manager/manager.js#L403),
   [validation.js#L170](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/utils/validation.js#L170))
   and throws if the manager is not ready
   ([manager.js#L404-L406](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/pyodide/manager/manager.js#L404-L406)).
3. `_postRequest`
   ([manager.js#L266](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/pyodide/manager/manager.js#L267))
   allocates a correlation id
   ([manager.js#L268](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/pyodide/manager/manager.js#L269)),
   stores `{resolve, reject, timeoutId}` in `_pendingRequests`
   ([manager.js#L275](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/pyodide/manager/manager.js#L276)),
   arms the timeout
   ([manager.js#L269-L273](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/pyodide/manager/manager.js#L270-L274))
   and posts `{type: "execute", filename, code, id}`
   ([manager.js#L278](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/pyodide/manager/manager.js#L279)).
   `namespace` is added to the message only when provided
   ([manager.js#L407-L410](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/pyodide/manager/manager.js#L407-L410)).
4. In the worker, `handleExecute`
   ([worker-execution.js#L18](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/pyodide/worker/worker-execution.js#L18))
   first calls `transformCodeForExecution`
   ([worker-execution.js#L77](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/pyodide/worker/worker-execution.js#L82)):
   a regex
   ([worker-execution.js#L81](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/pyodide/worker/worker-execution.js#L86))
   looks for a genuine `input(` call. Without one, the code passes through
   unchanged (the `input()` rewrite is the next flow).
5. `reset_captures()`
   ([worker-execution.js#L29](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/pyodide/worker/worker-execution.js#L29),
   [capture_system.py#L49](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/pyodide/python/capture_system.py#L49))
   truncates the buffers, clears the missive slot, closes leftover figures and
   swaps `sys.stdout` and `sys.stderr` for capture streams
   ([capture_system.py#L83-L84](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/pyodide/python/capture_system.py#L72-L73)).
6. The code always runs through `runPythonAsync`
   ([worker-execution.js#L42](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/pyodide/worker/worker-execution.js#L42)):
   it handles synchronous code identically and enables top-level `await`.
7. `captureOutputs`
   ([worker-execution.js#L109](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/pyodide/worker/worker-execution.js#L109))
   pulls `get_stdout()` and `get_stderr()`
   ([capture_system.py#L87-L94](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/pyodide/python/capture_system.py#L76-L83)),
   `get_missive()`
   ([capture_system.py#L103](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/pyodide/python/capture_system.py#L92)),
   and `get_figures()`, all through the `capture_system` module reference
   (user code rebinding those names cannot affect capture). On a Python
   exception,
   `handleExecute` catches it and builds `{name, message}`
   ([worker-execution.js#L47-L50](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/pyodide/worker/worker-execution.js#L47-L56));
   stdout and stderr are still captured, so `result.stderr` carries the full
   traceback.
8. `postResult` sends one `result` message echoing the request id
   ([worker-execution.js#L64-L68](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/pyodide/worker/worker-execution.js#L69-L73),
   [worker-execution.js#L149](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/pyodide/worker/worker-execution.js#L176)).
9. Back in the manager, `_dispatchMessage`
   ([manager.js#L200](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/pyodide/manager/manager.js#L202))
   finds the pending entry by id and clears its timeout
   ([manager.js#L201-L207](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/pyodide/manager/manager.js#L203-L209)),
   lets `handleMessage` push the history entry (figures excluded, capped at 50
   entries,
   [manager.js#L348-L361](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/pyodide/manager/manager.js#L348-L361)
   and
   [manager.js#L37](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/pyodide/manager/manager.js#L37)),
   then resolves the promise with the full result
   ([manager.js#L231-L244](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/pyodide/manager/manager.js#L233-L245)).

A Python error does not reject the promise: the promise resolves and the
result carries `error` plus the traceback in `stderr`. Rejections are reserved
for infrastructure problems (timeout, crash, invalid arguments). On current
Pyodide the caught error often has an empty `.message`, so `error.message`
falls back to `"Unknown execution error"`
([worker-execution.js#L48](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/pyodide/worker/worker-execution.js#L48));
the real diagnostic is in `result.stderr`.

Integration snippet:

```javascript
const result = await manager.executeAsync("hello.py", `
name = "world"
print(f"hello {name}")
`);
console.log(result.stdout);   // "hello world\n"
console.log(result.error);    // null on success, { name, message } on Python error
console.log(result.stderr);   // full traceback when error is set
```

See it live:
[classic execution](https://pointcarre-app.github.io/nagini/scenery/executions/#classic)
and
[error with traceback](https://pointcarre-app.github.io/nagini/scenery/executions/#error)
(repo-relative:
[classic](../scenery/executions/index.html#classic),
[error](../scenery/executions/index.html#error)).

## input(): pausing Python for the host

```
[host page]                          [PyodideManager]                       [worker]                        [python]
     |                                       |                                  |                               |
     |- queueInput('Ada') and/or             |                                  |                               |
     |  setInputCallback(cb)                 |                                  |                               |
     |-------------------------------------->|                                  |                               |
     | executeAsync('ask.py', code,          |                                  |                               |
     | undefined, 120000)                    |                                  |                               |
     |                                       |--------------------------------->|                               |
     |                                       | postMessage {type: 'execute',    |                               |
     |                                       | filename, code, id}              |                               |
     |                                       |                                  |- transformCodeForExecution(): |
     |                                       |                                  |  the regex finds a real       |
     |                                       |                                  |  input( call                  |
     |                                       |                                  |------------------------------>|
     |                                       |                                  | transform_code_for_           |
     |                                       |                                  | execution(code)               |
     |                                       |                                  |                               |- _AwaitInputTransformer rewrites
     |                                       |                                  |                               |  input() -> await input() on the AST;
     |                                       |                                  |                               |  sync def / lambda / class bodies
     |                                       |                                  |                               |  are left untouched
     |                                       |                                  |<------------------------------|
     |                                       |                                  | rewritten source              |
     |                                       |                                  |------------------------------>|
     |                                       |                                  | await runPythonAsync(         |
     |                                       |                                  | rewritten code)               |
     |                                       |                                  |                               |- await input(prompt) enters
     |                                       |                                  |                               |  input_handler(): prints the prompt,
     |                                       |                                  |                               |  then awaits requestInput(prompt)
     |                                       |                                  |- requestInput(): stores       |
     |                                       |                                  |  self.pendingInputResolver    |
     |                                       |<---------------------------------|                               |
     |                                       | postMessage {type:               |                               |
     |                                       | 'input_required', prompt}        |                               |
     |                                       |- handleInputMessage():           |                               |
     |                                       |  inputQueue non-empty ?          |                               |
     |                                       |  shift() + provideInput(input) : |                               |
     |                                       |  inputCallback(prompt)           |                               |
     |-------------------------------------->|                                  |                               |
     | provideInput('Ada')                   |                                  |                               |
     | (callback path)                       |                                  |                               |
     |                                       |--------------------------------->|                               |
     |                                       | postMessage {type:               |                               |
     |                                       | 'input_response', input}         |                               |
     |                                       |                                  |- handleInputResponse():       |
     |                                       |                                  |  pendingInputResolver(input)  |
     |                                       |                                  |                               |- await returns 'Ada',
     |                                       |                                  |                               |  execution resumes
     |                                       |<---------------------------------|                               |
     |                                       | postMessage {type: 'result', id, |                               |
     |                                       | stdout, ...} as in the classic   |                               |
     |                                       | flow                             |                               |
     |<--------------------------------------|                                  |                               |
     | promise resolves                      |                                  |                               |
```

Step by step:

1. Before or during the run, the host queues answers with `queueInput`
   ([manager-input.js#L65](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/pyodide/manager/manager-input.js#L65))
   or registers a callback with `setInputCallback`
   ([manager-input.js#L78](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/pyodide/manager/manager-input.js#L78)).
2. The execute message reaches the worker as usual. This time the regex gate
   in `transformCodeForExecution`
   ([worker-execution.js#L81](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/pyodide/worker/worker-execution.js#L86))
   matches, so the worker calls the Python transformer
   ([worker-execution.js#L91](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/pyodide/worker/worker-execution.js#L91)).
3. `transform_code_for_execution`
   ([code_transformation.py#L86](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/pyodide/python/code_transformation.py#L86))
   parses the code and lets `_AwaitInputTransformer`
   ([code_transformation.py#L15](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/pyodide/python/code_transformation.py#L15))
   wrap every call to the builtin `input` in `ast.Await`
   ([code_transformation.py#L54-L60](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/pyodide/python/code_transformation.py#L54-L60)).
   Names like `my_input()` or `obj.input()` are untouched, and calls inside
   sync `def`, `lambda` or class bodies are left alone
   ([code_transformation.py#L25-L52](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/pyodide/python/code_transformation.py#L25-L52)),
   where `await` would be a syntax error. The code is not wrapped in a
   function, so top-level variables keep landing in the globals.
4. The rewritten code runs through `runPythonAsync`. Each `await input(...)`
   enters `input_handler`
   ([worker-input.js#L39-L50](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/pyodide/worker/worker-input.js#L43-L53)):
   it prints the prompt into the captured stdout, then awaits
   `requestInput(prompt)`.
5. `requestInput`
   ([worker-input.js#L18-L29](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/pyodide/worker/worker-input.js#L18-L29))
   posts `{type: "input_required", prompt}` and parks the resolver in
   `self.pendingInputResolver`. The Python coroutine is now suspended and the
   worker event loop is free.
6. On the manager side, `handleInputMessage`
   ([manager-input.js#L113-L135](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/pyodide/manager/manager-input.js#L113-L135))
   records the prompt, then either dequeues a queued answer and calls
   `provideInput` immediately
   ([manager-input.js#L120-L122](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/pyodide/manager/manager-input.js#L120-L122)),
   or invokes the registered callback with the prompt
   ([manager-input.js#L124-L127](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/pyodide/manager/manager-input.js#L124-L127)).
7. `provideInput`
   ([manager-input.js#L41-L56](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/pyodide/manager/manager-input.js#L41-L56))
   posts `{type: "input_response", input}` to the worker.
8. `handleInputResponse`
   ([worker-input.js#L64-L81](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/pyodide/worker/worker-input.js#L68-L85))
   calls `pendingInputResolver(input)`: the awaited promise resolves, `input()`
   returns the string, Python resumes. The rest of the run finishes like the
   classic flow, and the `result` message resets the input state
   ([manager.js#L333](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/pyodide/manager/manager.js#L334),
   [manager-input.js#L143](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/pyodide/manager/manager-input.js#L143)).

The execution timeout keeps ticking while Python waits for a human. Raise
`timeoutMs` for interactive code
([manager.js#L397](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/pyodide/manager/manager.js#L397)).
If it fires while no input was provided, the promise rejects and any late
result is discarded by id, but the coroutine keeps awaiting inside the
worker: that execution only finishes if a `provideInput` arrives later.

Integration snippet:

```javascript
manager.queueInput("Ada");                  // consumed by the first input()
manager.setInputCallback((prompt) => {      // used when the queue is empty
    manager.provideInput(window.prompt(prompt) ?? "");
});

const result = await manager.executeAsync("ask.py", `
name = input("Your name? ")
print(f"Hello {name}")
`, undefined, 120000);                      // 2 min budget for human input
```

See it live:
[interactive input](https://pointcarre-app.github.io/nagini/scenery/executions/#input)
([repo-relative link](../scenery/executions/index.html#input)).

## Figure capture: matplotlib

```
[host page]                          [PyodideManager]                       [worker]                        [python]
     |                                       |                                  |                               |
     |-------------------------------------->|                                  |                               |
     | executeAsync('plot.py', code)         |                                  |                               |
     |                                       |--------------------------------->|                               |
     |                                       | postMessage {type: 'execute',    |                               |
     |                                       | filename, code, id}              |                               |
     |                                       |                                  |------------------------------>|
     |                                       |                                  | captureSystem.reset_captures()|
     |                                       |                                  |                               |- plt.close('all') on leftover figures
     |                                       |                                  |------------------------------>|
     |                                       |                                  | await runPythonAsync(code)    |
     |                                       |                                  |                               |- agg backend (set at init),
     |                                       |                                  |                               |  plt.show() is a no-op:
     |                                       |                                  |                               |  figures stay open in pyplot
     |                                       |                                  |- captureOutputs():            |
     |                                       |                                  |------------------------------>|
     |                                       |                                  | get_figures()                 |
     |                                       |                                  |                               |- for each figure number:
     |                                       |                                  |                               |  savefig(BytesIO, format='png'),
     |                                       |                                  |                               |  base64-encode, close the figure
     |                                       |                                  |<------------------------------|
     |                                       |                                  | list of base64 PNG strings    |
     |                                       |                                  |- figuresResult.toJs()         |
     |                                       |<---------------------------------|                               |
     |                                       | postMessage {type: 'result', id, |                               |
     |                                       | figures: [...], ...}             |                               |
     |                                       |- result kept whole for the       |                               |
     |                                       |  caller; history entry drops     |                               |
     |                                       |  figures                         |                               |
     |<--------------------------------------|                                  |                               |
     | result.figures                        |                                  |                               |
```

Step by step:

1. At init time, `setup_matplotlib`
   ([pyodide_utilities.py#L7](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/pyodide/python/pyodide_utilities.py#L7))
   switched matplotlib to the `agg` backend
   ([pyodide_utilities.py#L14](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/pyodide/python/pyodide_utilities.py#L14))
   and made `plt.show()` a no-op
   ([pyodide_utilities.py#L23-L26](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/pyodide/python/pyodide_utilities.py#L23-L26)),
   so nothing tries to open a window inside the worker.
2. `reset_captures()` closes figures left over from a previous run
   ([capture_system.py#L61-L69](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/pyodide/python/capture_system.py#L61-L69)).
3. The user code draws. Figures stay open in the pyplot registry until capture.
4. After the run, `captureOutputs` calls `get_figures()`
   ([worker-execution.js#L126](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/pyodide/worker/worker-execution.js#L126),
   [capture_system.py#L123](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/pyodide/python/capture_system.py#L112)):
   each open figure is saved to a `BytesIO` as PNG, base64-encoded and closed
   ([capture_system.py#L139-L145](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/pyodide/python/capture_system.py#L128-L134)).
5. The Python list converts to a JavaScript array with `.toJs()`
   ([worker-execution.js](https://github.com/pointcarre-app/nagini/blob/main/src/pyodide/worker/worker-execution.js))
   and travels in the `result` message. `result.figures` holds base64 PNG
   strings.
6. The resolved result keeps the figures, but the `executionHistory` entry
   drops them to avoid piling base64 payloads in memory
   ([manager.js#L345-L356](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/pyodide/manager/manager.js#L345-L356)).

Rendering: a matplotlib figure needs nothing but an `img` tag.

Integration snippet (manager created with `["matplotlib"]` in packages):

```javascript
const result = await manager.executeAsync("plot.py", `
import matplotlib.pyplot as plt
plt.plot([0, 1, 2], [0, 1, 4])
plt.title("squares")
`);

for (const b64 of result.figures) {
    const img = document.createElement("img");
    img.src = "data:image/png;base64," + b64;
    document.body.appendChild(img);
}
```

See it live:
[matplotlib capture](https://pointcarre-app.github.io/nagini/scenery/executions/#matplotlib)
([repo-relative link](../scenery/executions/index.html#matplotlib)).

## State across executions

One Python interpreter lives in the worker for the whole life of the manager.
That single fact explains everything in this section.

### Globals persist between runs

```
[host page]                          [PyodideManager]                       [worker]                        [python]
     |                                       |                                  |                               |
     |-------------------------------------->|                                  |                               |
     | executeAsync('a.py', 'x = 41')        |                                  |                               |
     |                                       |--------------------------------->|                               |
     |                                       | {type: 'execute', id: 1, ...}    |                               |
     |                                       |                                  |------------------------------>|
     |                                       |                                  | await runPythonAsync(         |
     |                                       |                                  | 'x = 41')                     |
     |                                       |                                  |                               |- x lands in the interpreter globals
     |                                       |<---------------------------------|                               |
     |                                       | {type: 'result', id: 1, ...}     |                               |
     |                                       |                                  |                               |
     |-------------------------------------->|                                  |                               |
     | executeAsync('b.py',                  |                                  |                               |
     | 'print(x + 1)')                       |                                  |                               |
     |                                       |--------------------------------->|                               |
     |                                       | {type: 'execute', id: 2, ...}    |                               |
     |                                       |                                  |------------------------------>|
     |                                       |                                  | await runPythonAsync(         |
     |                                       |                                  | 'print(x + 1)')               |
     |                                       |                                  |                               |- same globals: x is still 41,
     |                                       |                                  |                               |  prints 42
     |                                       |<---------------------------------|                               |
     |                                       | {type: 'result', id: 2,          |                               |
     |                                       | stdout: '42', ...}               |                               |
```

Without a namespace, `runPythonAsync` executes in the interpreter's shared
globals
([worker-execution.js#L42](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/pyodide/worker/worker-execution.js#L42)),
so module-level names survive from one `executeAsync` to the next. The
`input()` rewrite keeps this property: the code is never wrapped in a function
([code_transformation.py#L1-L11](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/pyodide/python/code_transformation.py#L1-L11)).

### The namespace parameter isolates a run

```
[host page]                          [PyodideManager]                       [worker]                        [python]
     |                                       |                                  |                               |
     |-------------------------------------->|                                  |                               |
     | executeAsync('c.py', code,            |                                  |                               |
     | namespace = {})                       |                                  |                               |
     |                                       |- message.namespace set only      |                               |
     |                                       |  when provided                   |                               |
     |                                       |--------------------------------->|                               |
     |                                       | {type: 'execute', id, code,      |                               |
     |                                       | namespace}                       |                               |
     |                                       |                                  |- pyodideNamespace =           |
     |                                       |                                  |  pyodide.toPy(namespace)      |
     |                                       |                                  |------------------------------>|
     |                                       |                                  | await runPythonAsync(code,    |
     |                                       |                                  | {globals: pyodideNamespace})  |
     |                                       |                                  |                               |- code runs against the namespace
     |                                       |                                  |                               |  dict, not the shared globals
     |                                       |                                  |- finally:                     |
     |                                       |                                  |  pyodideNamespace.destroy()   |
     |                                       |<---------------------------------|                               |
     |                                       | {type: 'result', id,             |                               |
     |                                       | executedWithNamespace: true}     |                               |
```

Passing a plain object as third argument sends it with the message
([manager.js#L407-L410](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/pyodide/manager/manager.js#L407-L410)).
The worker converts it with `pyodide.toPy`
([worker-execution.js#L35](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/pyodide/worker/worker-execution.js#L35))
and runs the code with that dict as its globals
([worker-execution.js#L37](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/pyodide/worker/worker-execution.js#L37)),
destroying the proxy afterwards
([worker-execution.js#L39](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/pyodide/worker/worker-execution.js#L39)).
Names created there never touch the shared globals.

#### What namespace isolation protects against, and what it does not

The namespace parameter is the safe way to run code you do not control
alongside other runs. Verified guarantees:

- Assignments, `def` statements and `import` bindings land in the namespace
  dict and are discarded when the run ends: nothing persists into later runs.
- Rebinding `missive`, `input` or any other name cannot shadow them for
  other executions: the shadow dies with the namespace.
- The capture infrastructure (stdout/stderr buffers, missive slot, figure
  capture, the input() AST rewrite) is out of reach by construction: the
  worker calls it through module references held since init, never through
  a namespace (see the initialization flow above).

What it does not isolate: all runs still share one interpreter, so a
namespaced run can still

- mutate `builtins` (`import builtins; builtins.missive = ...` poisons the
  name for every later run; capture itself stays intact, but user code
  calling `missive` reaches the impostor),
- monkey-patch any imported module through `sys.modules` (imports and their
  side effects are interpreter-wide),
- write to the virtual filesystem (files persist for the manager's life),
- leave matplotlib state behind (the pyplot figure registry is global;
  `reset_captures` closes leftover figures when the next run starts),
- post arbitrary protocol messages through the `js` bridge, and burn CPU or
  memory: there is no quota and no interrupt yet.

For default-namespace runs the worker posts a `warning` message the first
time user code shadows `missive` or `input` in the persistent globals
(surfaced as `console.warn` by the manager), since that shadow outlives the
run. If runs must not observe each other at all, use one manager per trust
domain: `destroy()` and recreate, or run several managers side by side.

### Two concurrent executeAsync calls

```
[host page]                          [PyodideManager]                       [worker]
     |                                       |                                  |
     |-------------------------------------->|                                  |
     | executeAsync('one.py', ...)  (A)      |                                  |
     |-------------------------------------->|                                  |
     | executeAsync('two.py', ...)  (B)      |                                  |
     | (before A settles)                    |                                  |
     |                                       |- executionChain: B's run() only  |
     |                                       |  starts once A settles           |
     |                                       |--------------------------------->|
     |                                       | {type: 'execute', id: 1}  (A)    |
     |                                       |<---------------------------------|
     |                                       | {type: 'result', id: 1}          |
     |<--------------------------------------|                                  |
     | promise A resolves                    |                                  |
     |                                       |--------------------------------->|
     |                                       | {type: 'execute', id: 2}  (B)    |
     |                                       |<---------------------------------|
     |                                       | {type: 'result', id: 2}          |
     |<--------------------------------------|                                  |
     | promise B resolves                    |                                  |
```

`executionChain`
([manager.js#L417-L418](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/pyodide/manager/manager.js#L417-L418))
serializes the calls: the second `execute` message is only posted after the
first settles (resolve or reject). Ids stay distinct, so responses can never
be attributed to the wrong caller
([manager.js#L397-L402](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/pyodide/manager/manager.js#L397-L402)).

### Timeout, and the late result

```
[host page]                          [PyodideManager]                       [worker]
     |                                       |                                  |
     |-------------------------------------->|                                  |
     | executeAsync('slow.py', code,         |                                  |
     | undefined, 2000)                      |                                  |
     |                                       |--------------------------------->|
     |                                       | {type: 'execute', id: 7}         |
     |                                       |                                  |- python is busy, no answer yet
     |                                       |- after 2000 ms:                  |
     |                                       |  _pendingRequests.delete(7),     |
     |                                       |  reject(timeout error)           |
     |<--------------------------------------|                                  |
     | promise rejects:                      |                                  |
     | 'Execution timeout after              |                                  |
     | 2 seconds'                            |                                  |
     |                                       |                                  |- python keeps running: the
     |                                       |                                  |  timeout does not interrupt
     |                                       |                                  |  the worker
     |                                       |<---------------------------------|
     |                                       | {type: 'result', id: 7}  (late)  |
     |                                       |- _dispatchMessage(): no pending  |
     |                                       |  entry for id 7 -> the settled   |
     |                                       |  promise stays rejected; the     |
     |                                       |  entry still lands in            |
     |                                       |  executionHistory                |
```

The timeout armed by `_postRequest`
([manager.js#L269-L273](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/pyodide/manager/manager.js#L270-L274))
deletes the pending entry and rejects the promise. Two honest caveats. First,
the timeout does not interrupt Python: the worker keeps computing until the
run finishes, and only then processes the next queued message. Second, when
the late `result` finally arrives, `_dispatchMessage` finds no pending entry
for its id, so the settled promise is untouched
([manager.js#L200-L207](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/pyodide/manager/manager.js#L202-L209)),
but the entry is still logged and pushed to `executionHistory`
([manager.js#L332-L362](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/pyodide/manager/manager.js#L333-L362)).

### Worker crash rejects everything

```
[host page]                          [PyodideManager]                       [worker]
     |                                       |                                  |
     |-------------------------------------->|                                  |
     | executeAsync(...)  (pending)          |                                  |
     |                                       |--------------------------------->|
     |                                       | {type: 'execute', id: 9}         |
     |                                       |                                  |- worker crashes (wasm trap,
     |                                       |                                  |  out of memory, ...)
     |                                       |<---------------------------------|
     |                                       | worker.onerror event             |
     |                                       |- synthesized {type: 'error'}     |
     |                                       |  without id:                     |
     |                                       |  _readyReject(cause),            |
     |                                       |  _failAllPending(cause)          |
     |<--------------------------------------|                                  |
     | every pending promise rejects         |                                  |
     | with the same cause                   |                                  |
```

`worker.onerror` and `worker.onmessageerror`
([manager.js#L163-L174](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/pyodide/manager/manager.js#L165-L176))
synthesize an error message without id. `_dispatchMessage` treats it as fatal:
`_readyReject(error)` and `_failAllPending(error)`
([manager.js#L221-L227](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/pyodide/manager/manager.js#L223-L229),
[manager.js#L294-L300](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/pyodide/manager/manager.js#L295-L301)),
so every in-flight `executeAsync` and `fs` promise rejects with the cause
instead of hanging. `destroy()`
([manager.js#L437-L458](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/pyodide/manager/manager.js#L437-L458))
does the same on purpose, then terminates the worker and revokes the blob URL.

Integration snippet:

```javascript
// globals persist between runs on the same manager
await manager.executeAsync("a.py", "x = 41");
const r1 = await manager.executeAsync("b.py", "print(x + 1)");
console.log(r1.stdout);                       // "42\n"

// a namespace object isolates a run
const r2 = await manager.executeAsync("c.py", "print('x' in globals())", {});
console.log(r2.stdout);                       // "False\n"

// concurrent calls are serialized, in call order
const [ra, rb] = await Promise.all([
    manager.executeAsync("one.py", "y = 1"),
    manager.executeAsync("two.py", "print(y)"),
]);

// a timeout rejects the promise; the correlation id discards the late result
try {
    await manager.executeAsync("slow.py", "import time\ntime.sleep(10)", undefined, 2000);
} catch (e) {
    console.log(e.message);                   // Execution timeout after 2 seconds
}
```

See it live:
[multiple executions and state](https://pointcarre-app.github.io/nagini/scenery/executions/#multiple)
([repo-relative link](../scenery/executions/index.html#multiple)).

## Filesystem operations: fs()

```
[host page]                          [PyodideManager]                       [worker]
     |                                       |                                  |
     |-------------------------------------->|                                  |
     | fs('writeFile', {path, content},      |                                  |
     | timeoutMs = 10000)                    |                                  |
     |                                       |- PyodideManagerFS.fs()           |
     |                                       |  -> _sendFSCommand()             |
     |                                       |  -> _postRequest() with the fs   |
     |                                       |  operation's own timeout         |
     |                                       |--------------------------------->|
     |                                       | postMessage {type:               |
     |                                       | 'fs_operation', operation,       |
     |                                       | path, content, id}               |
     |                                       |                                  |- handleFSOperation()
     |                                       |                                  |  -> executeFS():
     |                                       |                                  |  pyodide.FS.writeFile / readFile /
     |                                       |                                  |  mkdir / analyzePath / readdir
     |                                       |<---------------------------------|
     |                                       | {type: 'fs_result', id, result}  |
     |                                       | or {type: 'fs_error', id, error} |
     |                                       |- fs() unwraps per operation:     |
     |                                       |  readFile -> result.content,     |
     |                                       |  exists -> result.exists,        |
     |                                       |  listdir -> result.files         |
     |<--------------------------------------|                                  |
     | promise resolves (or rejects          |                                  |
     | on fs_error / timeout)                |                                  |
```

Step by step:

1. `manager.fs(operation, params, timeoutMs = 10000)`
   ([manager.js#L373](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/pyodide/manager/manager.js#L373))
   delegates to `PyodideManagerFS.fs`
   ([manager-fs.js#L32](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/pyodide/manager/manager-fs.js#L32)),
   which validates and forwards to `_sendFSCommand`
   ([manager-fs.js#L136-L146](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/pyodide/manager/manager-fs.js#L136-L146)).
2. The request goes through the same `_postRequest` machinery as executions,
   with its own timeout parameter (default 10 seconds, distinct from the
   30-second execution default). The message is
   `{type: "fs_operation", operation, ...params, id}`
   ([manager-fs.js#L141-L145](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/pyodide/manager/manager-fs.js#L141-L145)).
3. In the worker, `handleFSOperation`
   ([worker-fs.js#L17](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/pyodide/worker/worker-fs.js#L17))
   runs `executeFS`
   ([worker-fs.js#L40-L63](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/pyodide/worker/worker-fs.js#L40-L63)):
   `writeFile` (creating the parent directory when needed), `readFile`,
   `mkdir`, `exists` via `FS.analyzePath`, `listdir` via `FS.readdir`.
4. The worker answers `{type: "fs_result", id, result}`
   ([worker-fs.js#L25](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/pyodide/worker/worker-fs.js#L25))
   or `{type: "fs_error", id, error}`
   ([worker-fs.js#L96](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/pyodide/worker/worker-fs.js#L96)).
5. The manager resolves or rejects the pending promise
   ([manager.js#L245-L248](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/pyodide/manager/manager.js#L246-L249)),
   and `fs()` unwraps the payload per operation: `readFile` returns the
   content, `exists` the boolean, `listdir` the file list
   ([manager-fs.js#L38-L50](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/pyodide/manager/manager-fs.js#L38-L50)).

`fs()` requests are not serialized on `executionChain`. They are correlated by
id like everything else, so one can be issued while an execution is in flight;
the worker serves it as soon as its event loop is free, for example while
Python is suspended awaiting `input()`.

Integration snippet:

```javascript
await manager.fs("writeFile", { path: "data/notes.txt", content: "hello" });
const exists  = await manager.fs("exists",   { path: "data/notes.txt" });  // true
const content = await manager.fs("readFile", { path: "data/notes.txt" });  // "hello"
const files   = await manager.fs("listdir",  { path: "data" }, 5000);      // own timeout
```

See it live:
[filesystem operations](https://pointcarre-app.github.io/nagini/scenery/executions/#fs)
([repo-relative link](../scenery/executions/index.html#fs)).

## Brython executeAsync

```
[host page]                          [BrythonManager]                    [executor]                 [page DOM + Brython]
     |                                       |                                |                               |
     |-------------------------------------->|                                |                               |
     | createManager('brython', [], [],      |                                |                               |
     | [], '', options) -> constructor       |                                |                               |
     |                                       |- loadBrython(options):         |                               |
     |                                       |  inject brython.js and         |                               |
     |                                       |  brython_stdlib.js script      |                               |
     |                                       |  tags, then window.brython(    |                               |
     |                                       |  {debug: 0})                   |                               |
     |                                       |                                |                               |
     |-------------------------------------->|                                |                               |
     | executeAsync(filename, code,          |                                |                               |
     | namespace (ignored), timeoutMs)       |                                |                               |
     |                                       |- wait for readyPromise,        |                               |
     |                                       |  validateExecutionParams()     |                               |
     |                                       |------------------------------->|                               |
     |                                       | executeAsync(code,             |                               |
     |                                       | filename, timeoutMs)           |                               |
     |                                       |                                |- unique suffix -> script      |
     |                                       |                                |  id + window callback         |
     |                                       |                                |  name; setTimeout(timeoutMs)  |
     |                                       |                                |- wrap code: stdout/stderr     |
     |                                       |                                |  buffers, missive(),          |
     |                                       |                                |  try/except around            |
     |                                       |                                |  exec(compile(code,           |
     |                                       |                                |  filename, 'exec'))           |
     |                                       |                                |------------------------------>|
     |                                       |                                | append <script type=          |
     |                                       |                                | 'text/python3'>;              |
     |                                       |                                | window.brython()              |
     |                                       |                                |                               |- Brython transpiles and runs the
     |                                       |                                |                               |  wrapper in the main thread
     |                                       |                                |<------------------------------|
     |                                       |                                | window[cbName]({stdout,       |
     |                                       |                                | stderr, missive, error})      |
     |                                       |                                |- cleanup(): clearTimeout,     |
     |                                       |                                |  remove script tag,           |
     |                                       |                                |  delete window callback       |
     |                                       |<-------------------------------|                               |
     |                                       | {stdout, stderr, missive,      |                               |
     |                                       | error, time}                   |                               |
     |                                       |- map to ExecutionResult        |                               |
     |                                       |  (figures: []), push to        |                               |
     |                                       |  executionHistory              |                               |
     |<--------------------------------------|                                |                               |
     | promise resolves                      |                                |                               |
```

Step by step:

1. `createManager("brython", ...)` constructs a `BrythonManager`
   ([nagini.js#L53-L56](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/nagini.js#L53-L56),
   [manager.js#L12](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/brython/manager/manager.js#L12)).
   The constructor starts `loadBrython(brythonOptions)`
   ([manager.js#L29-L36](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/brython/manager/manager.js#L29-L36)),
   which injects `brython.js` then `brython_stdlib.js` as script tags and
   calls `window.brython({debug: 0})`
   ([loader.js#L14-L35](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/brython/manager/loader.js#L14-L35)).
   Default library paths are `/src/brython/lib/...`, overridable with
   `brythonJsPath` and `brythonStdlibPath`
   ([loader.js#L5-L8](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/brython/manager/loader.js#L5-L8)).
2. `executeAsync(filename, code, namespace, timeoutMs)`
   ([manager.js#L40](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/brython/manager/manager.js#L40))
   awaits readiness, validates, then delegates to the executor's
   `executeAsync`
   ([executor.js#L11](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/brython/manager/executor.js#L11)).
   The `namespace` argument is accepted for API parity but not used.
3. The executor builds a unique suffix for a script element id and a
   per-execution `window` callback name
   ([executor.js#L15-L17](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/brython/manager/executor.js#L15-L17)),
   and arms the timeout
   ([executor.js#L26-L29](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/brython/manager/executor.js#L26-L29)).
4. The user code is embedded as a JSON string inside a wrapper that captures
   stdout and stderr, defines a once-per-run `missive`, and runs
   `exec(compile(code, filename, "exec"), globals())` inside `try/except`
   ([executor.js#L41-L88](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/brython/manager/executor.js#L41-L88)).
5. The wrapper is appended to the page as a `<script type="text/python3">`
   and `window.brython()` transpiles and runs it in the main thread
   ([executor.js#L90-L97](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/brython/manager/executor.js#L90-L97)).
6. Whether the code succeeds or raises, the wrapper calls the window callback
   with `{stdout, stderr, missive, error}`
   ([executor.js#L82-L87](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/brython/manager/executor.js#L82-L87)).
   The callback clears the timeout, removes the script element, deletes
   itself, then resolves with the payload and the elapsed time
   ([executor.js#L31-L35](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/brython/manager/executor.js#L31-L35)).
7. `BrythonManager.executeAsync` maps the payload to the shared
   `ExecutionResult` shape (`figures` is always empty, turtle draws straight
   to a canvas) and pushes it to `executionHistory`
   ([manager.js#L49-L61](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/brython/manager/manager.js#L49-L61)).
8. On timeout, `cleanup()` removes the script element and the callback, and
   the promise rejects
   ([executor.js#L19-L29](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/brython/manager/executor.js#L19-L29)).
   `input()`, packages and `fs()` are not supported on this backend
   ([manager.js#L69-L77](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/brython/manager/manager.js#L69-L77)).

No worker here: the code runs in the page with full DOM access. Only run
first-party, trusted code through this backend (see the security section of
the README).

Integration snippet:

```javascript
const brythonManager = await Nagini.createManager("brython", [], [], [], "", {
    brythonJsPath: "../../src/brython/lib/brython.js",
    brythonStdlibPath: "../../src/brython/lib/brython_stdlib.js",
});
await Nagini.waitForReady(brythonManager);

const result = await brythonManager.executeAsync("hello.py",
    'print("hello from Brython")');
console.log(result.stdout);   // "hello from Brython\n"
```

See it live: the
[executions page](https://pointcarre-app.github.io/nagini/scenery/executions/)
demonstrates the Pyodide backend; for Brython in action, the
[scenery test suite](https://pointcarre-app.github.io/nagini/scenery/)
runs three BrythonManager tests in the browser
([repo-relative link](../scenery/index.html)).

## The missive channel

A missive is the structured answer of a run: user code calls `missive({...})`
once, and the value comes back on `result.missive`. The two backends agree on
the name and the once-per-run rule, but not on the type. This asymmetry is
real in v0.0.44, so portable host code must handle both.

Pyodide backend: the missive travels as a JSON string.

```
[host page]                          [PyodideManager]                       [worker]                        [python]
     |                                       |                                  |                               |
     |-------------------------------------->|                                  |                               |
     | executeAsync('m.py',                  |                                  |                               |
     | 'missive({"answer": 42})')            |                                  |                               |
     |                                       |--------------------------------->|                               |
     |                                       | {type: 'execute', id, ...}       |                               |
     |                                       |                                  |------------------------------>|
     |                                       |                                  | await runPythonAsync(code)    |
     |                                       |                                  |                               |- missive(data): once-per-run guard,
     |                                       |                                  |                               |  stores the dict in
     |                                       |                                  |                               |  builtins._nagini_current_missive
     |                                       |                                  |------------------------------>|
     |                                       |                                  | get_missive()                 |
     |                                       |                                  |                               |- json.dumps(dict)
     |                                       |                                  |                               |  -> a JSON STRING
     |                                       |                                  |<------------------------------|
     |                                       |                                  | '{"answer": 42}'              |
     |                                       |<---------------------------------|                               |
     |                                       | {type: 'result', id,             |                               |
     |                                       | missive: '{"answer": 42}'}       |                               |
     |<--------------------------------------|                                  |                               |
     | result.missive is a string:           |                                  |                               |
     | JSON.parse() it yourself              |                                  |                               |
```

`missive(data)`
([capture_system.py#L207-L224](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/pyodide/python/capture_system.py#L146-L166))
guards against a second call
([capture_system.py#L213-L218](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/pyodide/python/capture_system.py#L152-L157))
and stores the dict. After the run, `get_missive()` serializes it with
`json.dumps`
([capture_system.py#L103-L120](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/pyodide/python/capture_system.py#L92-L109))
and the worker keeps it as a string on purpose
([worker-execution.js#L108-L113](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/pyodide/worker/worker-execution.js#L117-L122)).
So on this backend `result.missive` is a JSON string: parse it yourself.

Brython backend: the missive arrives as a live object.

```
[host page]                          [BrythonManager]                   [wrapper python]
     |                                       |                                  |
     |-------------------------------------->|                                  |
     | executeAsync('m.py',                  |                                  |
     | 'missive({"answer": 42})')            |                                  |
     |                                       |--------------------------------->|
     |                                       | run via executor.js              |
     |                                       |                                  |- missive(obj): once-per-run
     |                                       |                                  |  guard, keeps the object
     |                                       |<---------------------------------|
     |                                       | callback payload                 |
     |                                       | {missive: {answer: 42}}          |
     |<--------------------------------------|                                  |
     | result.missive is already an          |                                  |
     | object (or null): do not              |                                  |
     | JSON.parse() it                       |                                  |
```

The wrapper defines its own once-per-run `missive(obj)`
([executor.js#L65-L69](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/brython/manager/executor.js#L65-L69))
and passes the value through the window callback; the manager forwards it
as-is
([manager.js#L54](https://github.com/pointcarre-app/nagini/blob/v0.0.47/src/brython/manager/manager.js#L54)).
So on this backend `result.missive` is already an object (or `null`), and
calling `JSON.parse` on it would throw.

Integration snippet:

```javascript
const result = await manager.executeAsync("m.py", `
missive({"answer": 42, "status": "ok"})
`);

// portable across both backends
const missive = typeof result.missive === "string"
    ? JSON.parse(result.missive)
    : result.missive;
console.log(missive.answer);   // 42
```

See it live:
[missive exchange](https://pointcarre-app.github.io/nagini/scenery/executions/#missive)
([repo-relative link](../scenery/executions/index.html#missive)).
