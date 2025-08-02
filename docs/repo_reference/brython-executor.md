# `brython/manager/executor.js` - Brython Executor

**Location:** `src/brython/manager/executor.js`

This file is responsible for the actual execution of Python code using the Brython engine.

## Function: `executeAsync(code, filename)`

-   **Description:** This function takes a string of Python code, wraps it in a boilerplate that redirects `stdout` and `stderr` and defines a `missive` function, and then executes it. It achieves this by creating a new `<script type="text/python3">` tag, adding the code to it, and appending it to the document. Brython then automatically discovers and runs the code.
-   **Parameters:**
    -   `code` (string): The Python code to execute.
    -   `filename` (string, default: `'script.py'`): A name for the execution.
-   **Returns:** A `Promise` that resolves with an object containing the `stdout`, `stderr`, `missive`, and execution `time`.
-   **Throws:** `Error` if the Brython runtime is not initialized. 