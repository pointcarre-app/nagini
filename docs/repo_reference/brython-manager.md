# `brython/manager/manager.js` - Brython Manager

**Location:** `src/brython/manager/manager.js`

This file contains the `BrythonManager` class, which provides a lightweight alternative to the `PyodideManager`. It executes Python code by transpiling it to JavaScript in the main browser thread.

## Class: `BrythonManager`

### `constructor(packages, filesToLoad, initPath, workerPath, brythonOptions)`
-   **Description:** Creates a new `BrythonManager` instance. It accepts the same parameters as `PyodideManager` for API compatibility, but most are ignored.
-   **`brythonOptions`** (Object): An object containing paths to the `brython.js` and `brython_stdlib.js` files.

### `executeAsync(filename, code, namespace)`
-   **Description:** Executes Python code by transpiling it to JavaScript. It returns a result object similar to `PyodideManager` for consistency.
-   **Parameters:**
    -   `filename` (string): A name for the execution.
    -   `code` (string): The Python code to execute.
    -   `namespace` (Object, optional): This parameter is ignored in the Brython backend.
-   **Returns:** A `Promise` that resolves to an `ExecutionResult` object.

### Unsupported Methods
The following methods from the `PyodideManager` are not supported and will either throw an error or log a warning to the console:
-   `fs()`
-   `queueInput()`
-   `provideInput()`
-   `setInputCallback()`
-   `isWaitingForInput()`
-   `getCurrentPrompt()` 