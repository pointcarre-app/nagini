# `brython/manager/loader.js` - Brython Loader

**Location:** `src/brython/manager/loader.js`

This file is responsible for dynamically loading the Brython runtime into the browser.

## Function: `loadBrython(options)`

-   **Description:** This function injects the `brython.js` and `brython_stdlib.js` scripts into the document's `<head>`. It ensures that the scripts are loaded only once and then initializes the Brython runtime by calling `window.brython()`.
-   **Parameters:**
    -   `options` (Object): An object that can contain the following properties:
        -   `brythonJsPath` (string): The path to the `brython.js` file.
        -   `brythonStdlibPath` (string): The path to the `brython_stdlib.js` file.
-   **Returns:** A `Promise` that resolves when the Brython runtime is loaded and initialized.
-   **Throws:** `Error` if the script fails to load. 