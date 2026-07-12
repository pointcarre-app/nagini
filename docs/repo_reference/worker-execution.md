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
<!-- Do not quote the lookbehind regex verbatim here: the raw "<!" followed by "[" reads as a malformed marked section and crashes the mkdocs 1.6 source scanner under Python 3.12. -->
-   **Description:** This function decides whether the code needs the async `input()` rewrite. The gate has two conditions. First, `workerState.inputMode` must not be `'jspi'`: on browsers with JSPI, `input()` is a plain synchronous function blocking through `pyodide.ffi.run_sync`, so the code always passes through unchanged. Second (async mode only), the code must contain a call to the builtin `input()`, detected by a regex: `input\s*\(` preceded by neither a word character nor a dot (a negative lookbehind, exact pattern in `worker-execution.js`), which ignores names like `my_input(` or `obj.input(`. When both hold, it calls a Python-based transformation function (`transform_code_for_execution` in `code_transformation.py`) that rewrites the AST so that builtin `input()` calls become `await input()`. The code is not wrapped in a function: it is executed directly via `runPythonAsync` (top-level `await`), so top-level variables persist in the globals.
-   **Parameters:**
    -   `code` (string): The Python code to transform.
    -   `workerState` (Object): The current state of the worker.
-   **Returns:** An object containing the (potentially transformed) `code` and a boolean `needsAsync`.

### `captureOutputs(workerState, isErrorCase)`
-   **Description:** After execution, this function retrieves the standard output, standard error, missive data, and any Matplotlib figures through the `capture_system` PyProxy module reference held in `workerState` (`get_stdout`, `get_stderr`, `get_missive`, `get_figures`), never by name lookup in the interpreter globals.
-   **Parameters:**
    -   `workerState` (Object): The current state of the worker, carrying the `captureSystem` module reference.
    -   `isErrorCase` (boolean): If `true`, it skips the missive and figure capture, as they might not be valid in an error state; stdout and stderr are still collected.
-   **Returns:** An object containing the captured `stdout`, `stderr`, `missive`, and `figures`. 