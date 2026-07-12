# `pyodide/python/code_transformation.py` - Code Transformation

**Location:** `src/pyodide/python/code_transformation.py`

This file is the async fallback of Nagini's input system: it transforms user-provided Python code to support `async` `input()` calls. It is only used when the browser lacks JSPI; with JSPI (`manager.inputMode === 'jspi'`), `input()` blocks synchronously through `pyodide.ffi.run_sync` and the worker never calls this module.

## Core Functions

### `transform_code_for_execution(code)`
-   **Description:** This is the main function called by the worker. It first checks if the user's code contains any calls to the builtin `input()`. If it does, it transforms the code by calling `prepare_code_for_async_input`. The code is **not** wrapped in any function: it is executed directly via `runPythonAsync`, which supports top-level `await`, so top-level variables persist in the global namespace after execution. If no `input()` calls are found, the code is returned unmodified.
-   **Parameters:**
    -   `code` (string): The user's Python code.
-   **Returns:** The transformed (or original) Python code as a string.

### `prepare_code_for_async_input(code)`
-   **Description:** This function parses the code into an AST and applies an `ast.NodeTransformer` that prefixes calls to the builtin `input()` with `await`. This is necessary because, in async input mode, the built-in `input` function is replaced with an `async` version in `worker-input.js`. Only genuine calls to the builtin are transformed: names that merely contain `input` (e.g. `some_func__input()`) and attribute calls (e.g. `obj.input()`) are left untouched. Scoping is respected: calls inside a synchronous `def`, a `lambda` or a class body are not transformed (an `await` there would be a syntax error), while calls inside an `async def` are.
-   **Parameters:**
    -   `code` (string): The user's Python code.
-   **Returns:** The Python code with `await` added to builtin `input()` calls in awaitable contexts. 