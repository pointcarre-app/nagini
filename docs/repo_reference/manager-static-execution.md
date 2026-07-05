# `pyodide/manager/manager-static-execution.js` - Static Executor

**Location:** `src/pyodide/manager/manager-static-execution.js`

This file contains the `PyodideManagerStaticExecutor` class, which holds the pure, static logic for executing Python code. This separation of concerns makes the execution logic more testable and decoupled from the stateful `PyodideManager`.

## Class: `PyodideManagerStaticExecutor`

This class only contains static methods and is not meant to be instantiated.

### `executeFile(worker, isReady, filename, code, namespace)`
-   **Description:** Dispatches a "fire-and-forget" execution request to the worker. It sends a `postMessage` to the worker but does not wait for a response.
-   **Parameters:**
    -   `worker` (Worker): The web worker instance.
    -   `isReady` (boolean): `true` if the Pyodide environment is ready.
    -   `filename` (string): A name for the execution, for tracking purposes.
    -   `code` (string): The Python code to execute.
    -   `namespace` (Object, optional): An object to use as the global namespace.
-   **Throws:** `Error` if any of the parameters are invalid.

### Promise-based execution

Promise-based execution lives in `PyodideManager.executeAsync(filename, code, namespace, timeoutMs)`, built on id-correlated worker messages: every request carries an id, the worker echoes it back in the response, and a single permanent `onmessage` handler settles the matching promise. See `manager.md`. This class only keeps the fire-and-forget `executeFile`. 