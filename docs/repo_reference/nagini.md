# `nagini.js` - Main API

**Location:** `src/nagini.js`

This file is the main entry point for the Nagini library. It provides a high-level API for creating and managing Python execution environments in the browser, supporting multiple backends like Pyodide and Brython.

## Core Object: `Nagini`

The `Nagini` object is the primary export of this file and contains several methods for interacting with the library.

### `Nagini.createManager(backend, packages, micropipPackages, filesToLoad, workerPath, options)`

This asynchronous function creates and initializes a backend manager.

-   **`backend`** (string, default: `'pyodide'`): The desired Python backend. Can be `'pyodide'` or `'brython'`.
-   **`packages`** (Array<string>): A list of standard Python packages to install (e.g., `['numpy', 'pandas']`).
-   **`micropipPackages`** (Array<string>): A list of packages to install via `micropip`.
-   **`filesToLoad`** (Array<Object>): An array of file objects to preload into the virtual filesystem. Each object should have a `url` and `path`.
-   **`workerPath`** (string): The path to the Pyodide worker script (`worker-dist.js`). This is crucial for cross-origin scenarios.
-   **`options`** (Object): Backend-specific options.

**Returns:** A promise that resolves to a manager instance (`PyodideManager` or `BrythonManager`).

### `Nagini.waitForReady(manager, timeout)`

Waits for the manager to complete its initialization.

-   **`manager`**: The manager instance returned by `createManager`.
-   **`timeout`** (number, default: `30000`): The maximum time to wait in milliseconds.

**Returns:** A promise that resolves when the manager is ready.

### `Nagini.executeFromUrl(url, manager, namespace)`

Fetches a Python script from a URL and executes it.

-   **`url`** (string): The URL of the Python script.
-   **`manager`**: The manager instance.
-   **`namespace`** (Object, optional): An object to be used as the global namespace for the execution.

**Returns:** A promise that resolves to the execution result.

### `Nagini.getSupportedBackends()`

Returns a list of all supported backend names.

**Returns:** An array of strings (e.g., `['pyodide', 'brython']`).

### `Nagini.isBackendSupported(backend)`

Checks if a given backend is supported.

-   **`backend`** (string): The name of the backend to check.

**Returns:** `true` if the backend is supported, `false` otherwise. 