# `pyodide/worker/worker-fs.js` - Worker Filesystem Operations

**Location:** `src/pyodide/worker/worker-fs.js`

This file contains the logic for handling filesystem operations and package loading within the Pyodide web worker.

## Core Functions

### `handleFSOperation(data, workerState)`
-   **Description:** The main handler for `'fs_operation'` messages. It calls `executeFS` to perform the requested operation and then posts the result or an error back to the main thread.
-   **Parameters:**
    -   `data` (Object): The message data, containing the `operation` and its `params`.
    -   `workerState` (Object): The current state of the worker.

### `executeFS(data, pyodide)`
-   **Description:** This function contains the actual logic for interacting with Pyodide's virtual filesystem (`pyodide.FS`). It supports `writeFile`, `readFile`, `mkdir`, `exists`, and `listdir`.
-   **Parameters:**
    -   `data` (Object): The message data for the FS operation.
    -   `pyodide` (PyodideAPI): The Pyodide instance.
-   **Returns:** An object containing the result of the operation.
-   **Throws:** `Error` if the requested operation is not supported.

### `loadPackages(packages, workerState)`
-   **Description:** Loads a list of standard Pyodide packages. It includes "smart loading" logic to prevent re-installing packages that are already present in the environment.
-   **Parameters:**
    -   `packages` (Array<string>): An array of package names to load.
    -   `workerState` (Object): The current state of the worker. 