# `pyodide/python/code_transformation.py` - Code Transformation

**Location:** `src/pyodide/python/code_transformation.py`

This file is a key part of Nagini's non-blocking input system. It contains the logic for transforming user-provided Python code to support `async` `input()` calls.

## Core Functions

### `transform_code_for_execution(code)`
-   **Description:** This is the main function called by the worker. It first checks if the user's code contains any `input()` calls. If it does, it transforms the code by calling `prepare_code_for_async_input` and then wrapping the entire script in an `async def` function. This allows the code to be run asynchronously, preventing it from blocking the main browser thread while waiting for user input. If no `input()` calls are found, the code is returned unmodified.
-   **Parameters:**
    -   `code` (string): The user's Python code.
-   **Returns:** The transformed (or original) Python code as a string.

### `prepare_code_for_async_input(code)`
-   **Description:** This function iterates through the user's code line by line and replaces every call to `input()` with `await input()`. This is necessary because the built-in `input` function is replaced with an `async` version in `worker-input.js`.
-   **Parameters:**
    -   `code` (string): The user's Python code.
-   **Returns:** The Python code with `await` added to all `input()` calls. 