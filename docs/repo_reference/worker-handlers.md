# `pyodide/worker/worker-handlers.js` - Worker Message Handlers

**Location:** `src/pyodide/worker/worker-handlers.js`

This file contains the core logic for handling messages sent to the Pyodide web worker. It acts as a dispatcher, routing incoming messages to the appropriate handler functions.

## Core Functions

### `handleMessage(e, workerState)`
-   **Description:** The main message dispatcher. It receives an event `e` from the worker's `onmessage` handler and routes it to the correct handler based on the `data.type` property.
-   **Parameters:**
    -   `e` (MessageEvent): The event object from the `onmessage` handler.
    -   `workerState` (Object): The current state of the worker.

### `handleInit(data, workerState)`
-   **Description:** Initializes the Pyodide environment. This function is called when the worker receives a message of type `'init'`. It loads the Pyodide runtime, installs specified packages (both standard and `micropip`), and preloads any files into the virtual filesystem.
-   **Parameters:**
    -   `data` (Object): The message data, containing `packages`, `micropipPackages`, and `filesToLoad`.
    -   `workerState` (Object): The current state of the worker.

### Other Handlers
This file also imports and re-exports handlers from other modules, including:

-   `handleExecute` from `./worker-execution.js`
-   `handleFSOperation` from `./worker-fs.js`
-   `handleInputResponse` from `./worker-input.js`
-   `setupInputHandling` from `./worker-input.js` 