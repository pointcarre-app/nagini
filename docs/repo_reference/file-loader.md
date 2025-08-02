# `pyodide/file-loader/file-loader.js` - File Loader

**Location:** `src/pyodide/file-loader/file-loader.js`

This file contains the `PyodideFileLoader` class, which is responsible for fetching remote files and loading them into the Pyodide virtual filesystem.

## Class: `PyodideFileLoader`

### `constructor(filesToLoad)`
-   **Description:** Creates a new `PyodideFileLoader` instance.
-   **Parameters:**
    -   `filesToLoad` (Array<Object>): An array of file objects to load. Each object must have a `url` and `path` property.
-   **Throws:** `Error` if the `filesToLoad` argument is invalid.

### `loadFiles(pyodide, options)`
-   **Description:** Asynchronously fetches each file specified in the constructor and writes it to the Pyodide filesystem. It includes a retry mechanism with exponential backoff to handle transient network errors.
-   **Parameters:**
    -   `pyodide` (PyodideAPI): The Pyodide instance.
    -   `options` (Object, optional): An object to configure the loading process, including `maxRetries` and `retryDelay`.
-   **Throws:** `Error` if a file fails to load after all retry attempts. 