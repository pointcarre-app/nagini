# `pyodide/manager/manager-fs.js` - Filesystem Operations

**Location:** `src/pyodide/manager/manager-fs.js`

This file contains the `PyodideManagerFS` class, which provides a high-level interface for interacting with the virtual filesystem within the Pyodide web worker. It is a static class that operates on a `PyodideManager` instance.

## Class: `PyodideManagerFS`

### `fs(manager, operation, params)`
-   **Description:** The main public method for all filesystem operations. It acts as a proxy, sending a command to the worker and returning the result.
-   **Parameters:**
    -   `manager` (PyodideManager): The manager instance.
    -   `operation` (string): The operation to perform (e.g., `'writeFile'`, `'readFile'`).
    -   `params` (Object): Parameters for the operation, such as `path` and `content`.
-   **Returns:** A `Promise` that resolves with the result of the operation.

### Convenience Methods

The following methods are convenient wrappers around the main `fs` method for common operations:

-   **`writeFile(manager, path, content)`:** Writes a file to the filesystem.
-   **`readFile(manager, path)`:** Reads the content of a file.
-   **`mkdir(manager, path)`:** Creates a new directory.
-   **`exists(manager, path)`:** Checks if a file or directory exists.
-   **`listdir(manager, path)`:** Lists the contents of a directory. 