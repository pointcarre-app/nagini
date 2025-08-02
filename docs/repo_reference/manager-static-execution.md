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

### `executeAsync(worker, isReady, executionHistory, setHandleMessage, getHandleMessage, filename, code, namespace)`
-   **Description:** Executes Python code asynchronously and returns a promise that resolves with the execution result. This method implements the "Handler Replacement Pattern" to manage the asynchronous communication with the worker.
-   **Parameters:**
    -   `worker` (Worker): The web worker instance.
    -   `isReady` (boolean): `true` if the Pyodide environment is ready.
    -   `executionHistory` (Array): A reference to the execution history array for logging the result.
    -   `setHandleMessage` (function): A function to set the worker's `onmessage` handler.
    -   `getHandleMessage` (function): A function to get the current `onmessage` handler.
    -   `filename` (string): A name for the execution.
    -   `code` (string): The Python code to execute.
    -   `namespace` (Object, optional): An object to use as the global namespace.
-   **Returns:** A `Promise` that resolves with the `ExecutionResult` object.
-   **Throws:** `Error` if the manager is not ready or if the execution times out. 