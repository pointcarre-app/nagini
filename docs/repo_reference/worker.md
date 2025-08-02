# `pyodide/worker/worker.js` - Worker Entry Point

**Location:** `src/pyodide/worker/worker.js`

This file is the main entry point for the Pyodide web worker. It is responsible for initializing the worker's state and handling incoming messages from the main thread.

## Core Logic

### `workerState`
-   **Description:** An object that holds the state of the worker, including:
    -   `pyodide`: The Pyodide instance (once loaded).
    -   `isInitialized`: A boolean flag indicating if Pyodide is ready.
    -   `packagesLoaded`: A `Set` to track which standard packages have been loaded.
    -   `micropipPackagesLoaded`: A `Set` to track which `micropip` packages have been loaded.

### `self.onmessage`
-   **Description:** The main message handler for the worker. It receives all messages from the main thread and delegates them to the `handleMessage` function from `worker-handlers.js`.
-   **Error Handling:** It includes a `try...catch` block to handle any errors that occur during message processing and sends an error message back to the main thread. 