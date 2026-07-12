# `pyodide/manager/manager.js` - Pyodide Manager

**Location:** `src/pyodide/manager/manager.js`

This file contains the `PyodideManager` class, which is the core component for managing the Pyodide execution environment. It handles the creation and communication with the Pyodide web worker.

## Class: `PyodideManager`

### `constructor(packages, micropipPackages, filesToLoad, workerPath, config)`
-   **Description:** Creates a new `PyodideManager` instance. It performs strict validation on all parameters and initializes the web worker.
-   **Parameters:**
    -   `packages` (Array<string>): A list of standard Python packages to install.
    -   `micropipPackages` (Array<string>): A list of packages to install via `micropip`.
    -   `filesToLoad` (Array<Object>): An array of file objects to preload.
    -   `workerPath` (string): The path to the bundled worker script (`worker-dist.js`).
    -   `config` (Object, optional): `pyodideCdnUrl` (custom Pyodide origin, for local or offline use) and `snapshotCache` (boolean, cache the bare interpreter as a memory snapshot in IndexedDB for near-instant later boots).
-   **Throws:** `Error` if any parameter is invalid.

### `executeAsync(filename, code, namespace, timeoutMs)`
-   **Description:** Executes Python code asynchronously and returns a promise that resolves with the result. This is the primary method for running code.
-   **Parameters:**
    -   `filename` (string): A name for the execution, used for tracking.
    -   `code` (string): The Python code to execute.
    -   `namespace` (Object, optional): An object to use as the global namespace.
    -   `timeoutMs` (number, optional, default 30000): Budget in milliseconds; on expiry the promise rejects and any late result is discarded by id.
-   **Returns:** A `Promise` that resolves to an `ExecutionResult` object.

### `executeFile(filename, code, namespace)`
-   **Description:** Executes Python code in a "fire-and-forget" manner, without returning a result.
-   **Parameters:** Same as `executeAsync`.

### `fs(operation, params, timeoutMs)`
-   **Description:** Provides an interface to the virtual filesystem within the Pyodide worker.
-   **`operation`** (string): The filesystem operation to perform (e.g., `'writeFile'`, `'readFile'`).
-   **`params`** (Object): Parameters for the operation.
-   **`timeoutMs`** (number, optional, default 10000): Budget in milliseconds, distinct from the execution timeout.

### Input Handling
-   **`provideInput(input)`:** Provides a string of input to the waiting Python process.
-   **`queueInput(input)`:** Adds a string to the input queue for future `input()` calls.
-   **`setInputCallback(callback)`:** Sets a callback function to be invoked when Python requests input.
-   **`isWaitingForInput()`:** Returns `true` if the Python environment is waiting for input.
-   **`getCurrentPrompt()`:** Returns the prompt message from the current `input()` call.

### `destroy()`
-   **Description:** Terminates the web worker and cleans up resources, including revoking the blob URL, to prevent memory leaks.

### Properties
-   **`isReady`** (boolean): `true` if the manager is initialized and ready for execution.
-   **`snapshotRestored`** (boolean): `true` when the worker booted from the IndexedDB snapshot cache (set on the `ready` message).
-   **`inputMode`** (string): `'jspi'` (sync `input()` through wasm stack switching, user code unmodified) or `'async'` (AST rewrite fallback), set on the `ready` message.
-   **`executionHistory`** (Array<Object>): A log of execution results, capped at the 50 most recent entries; each entry drops `figures` to keep memory bounded.
-   **`worker`** (Worker): The `Worker` instance.
-   **`packages`** (Array<string>): The list of packages to be loaded.
-   **`micropipPackages`** (Array<string>): The list of packages to be loaded via `micropip`.
-   **`filesToLoad`** (Array<Object>): The list of files to be preloaded. 