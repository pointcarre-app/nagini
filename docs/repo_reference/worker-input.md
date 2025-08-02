# `pyodide/worker/worker-input.js` - Worker Input Handling

**Location:** `src/pyodide/worker/worker-input.js`

This file contains the logic for handling Python's `input()` function within the Pyodide web worker.

## Core Functions

### `setupInputHandling(pyodide)`
-   **Description:** This function sets up the necessary infrastructure for handling `input()`. It creates a `requestInput` function in the worker's global scope and then runs a Python script to replace the built-in `input` with an async version that calls `requestInput`.
-   **`requestInput(prompt)`:** When the Python `input()` is called, it triggers `requestInput`, which sends an `'input_required'` message to the main thread and then waits for a promise to be resolved.
-   **Parameters:**
    -   `pyodide` (PyodideAPI): The Pyodide instance.

### `handleInputResponse(data, workerState)`
-   **Description:** This function is called when the worker receives a message of type `'input_response'` from the main thread. It takes the input value from the message and uses it to resolve the pending promise created by `requestInput`, which unpauses the Python execution.
-   **Parameters:**
    -   `data` (Object): The message data, containing the `input` string.
    -   `workerState` (Object): The current state of the worker. 