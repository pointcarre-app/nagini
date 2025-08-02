# `pyodide/manager/manager.js` - Pyodide Manager

**Location:** `src/pyodide/manager/manager.js`

This file contains the `PyodideManager` class, which is the core component for managing the Pyodide execution environment. It handles the creation and communication with the Pyodide web worker.

## Class: `PyodideManager`

### `constructor(packages, micropipPackages, filesToLoad, workerPath)`
-   **Description:** Creates a new `PyodideManager` instance. It performs strict validation on all parameters and initializes the web worker.
-   **Parameters:**
    -   `packages` (Array<string>): A list of standard Python packages to install.
    -   `micropipPackages` (Array<string>): A list of packages to install via `micropip`.
    -   `filesToLoad` (Array<Object>): An array of file objects to preload.
    -   `workerPath` (string): The path to the bundled worker script (`worker-dist.js`).
-   **Throws:** `Error` if any parameter is invalid.

### `executeAsync(filename, code, namespace)`
-   **Description:** Executes Python code asynchronously and returns a promise that resolves with the result. This is the primary method for running code.
-   **Parameters:**
    -   `filename` (string): A name for the execution, used for tracking.
    -   `code` (string): The Python code to execute.
    -   `namespace` (Object, optional): An object to use as the global namespace.
-   **Returns:** A `Promise` that resolves to an `ExecutionResult` object.

### `executeFile(filename, code, namespace)`
-   **Description:** Executes Python code in a "fire-and-forget" manner, without returning a result.
-   **Parameters:** Same as `executeAsync`.

### `fs(operation, params)`
-   **Description:** Provides an interface to the virtual filesystem within the Pyodide worker.
-   **`operation`** (string): The filesystem operation to perform (e.g., `'writeFile'`, `'readFile'`).
-   **`params`** (Object): Parameters for the operation.

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
-   **`executionHistory`** (Array<Object>): A log of all execution results.
-   **`worker`** (Worker): The `Worker` instance.
-   **`packages`** (Array<string>): The list of packages to be loaded.
-   **`micropipPackages`** (Array<string>): The list of packages to be loaded via `micropip`.
-   **`filesToLoad`** (Array<Object>): The list of files to be preloaded. 