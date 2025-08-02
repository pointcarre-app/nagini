# `pyodide/worker/worker-execution.js` - Worker Execution Logic

**Location:** `src/pyodide/worker/worker-execution.js`

This file contains the core logic for executing Python code within the Pyodide web worker.

## Core Functions

### `handleExecute(data, workerState)`
-   **Description:** The main handler for `'execute'` messages. It takes the Python code and an optional namespace from the message, executes it using Pyodide, and then captures and posts the results back to the main thread.
-   **Parameters:**
    -   `data` (Object): The message data, containing `code`, `filename`, and an optional `namespace`.
    -   `workerState` (Object): The current state of the worker.

### `transformCodeForExecution(code, workerState)`
-   **Description:** This function checks if the user's code contains `input()`. If it does, it calls a Python-based transformation function (`transform_code_for_execution` in `code_transformation.py`) to wrap the code in an `async` function. This is a key part of the non-blocking input system.
-   **Parameters:**
    -   `code` (string): The Python code to transform.
    -   `workerState` (Object): The current state of the worker.
-   **Returns:** An object containing the (potentially transformed) `code` and a boolean `needsAsync`.

### `captureOutputs(pyodide, isErrorCase)`
-   **Description:** After execution, this function calls Python helper functions (`get_stdout`, `get_stderr`, etc. in `capture_system.py`) to retrieve the standard output, standard error, missive data, and any Matplotlib figures that were generated.
-   **Parameters:**
    -   `pyodide` (PyodideAPI): The Pyodide instance.
    -   `isErrorCase` (boolean): If `true`, it avoids trying to capture the missive, as it might not be valid in an error state.
-   **Returns:** An object containing the captured `stdout`, `stderr`, `missive`, and `figures`. 