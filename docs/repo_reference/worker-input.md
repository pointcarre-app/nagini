# `pyodide/worker/worker-input.js` - Worker Input Handling

**Location:** `src/pyodide/worker/worker-input.js`

This file contains the logic for handling Python's `input()` function within the Pyodide web worker.

## Core Functions

### `setupInputHandling(pyodide)`
-   **Description:** This function sets up the infrastructure for handling `input()`. It creates a `requestInput` function in the worker's global scope, then replaces the built-in `input` in one of two modes, picked by browser capability. With JSPI (`typeof WebAssembly.Suspending === 'function'`, Chrome 137 and later), the handler is a plain synchronous function that blocks through `pyodide.ffi.run_sync(requestInput(prompt))`: user code runs unmodified and `input()` works inside sync functions, lambdas and class bodies. Without JSPI, the handler is an async coroutine awaiting `requestInput`, paired with the AST rewrite in `code_transformation.py`. The setup snippet runs in a throwaway namespace, so none of its names leaks into the globals user code runs in.
-   **`requestInput(prompt)`:** When the Python `input()` is called, it triggers `requestInput`, which sends an `'input_required'` message to the main thread and then waits for a promise to be resolved.
-   **Parameters:**
    -   `pyodide` (PyodideAPI): The Pyodide instance.
-   **Returns:** The installed mode, `'jspi'` or `'async'`. The worker reports it on the `ready` message and the manager exposes it as `manager.inputMode`.

### `handleInputResponse(data, workerState)`
-   **Description:** This function is called when the worker receives a message of type `'input_response'` from the main thread. It takes the input value from the message and uses it to resolve the pending promise created by `requestInput`, which unpauses the Python execution.
-   **Parameters:**
    -   `data` (Object): The message data, containing the `input` string.
    -   `workerState` (Object): The current state of the worker. 