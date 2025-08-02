# `pyodide/manager/manager-input.js` - Input Handling

**Location:** `src/pyodide/manager/manager-input.js`

This file contains the `PyodideManagerInput` class, which encapsulates all logic related to handling Python's `input()` function. It is a static class that operates on a `PyodideManager` instance.

## Class: `PyodideManagerInput`

### `initializeInputState(manager)`
-   **Description:** Initializes the `inputState` object on a `PyodideManager` instance. This sets up the necessary properties for managing input, such as the input queue and callback.

### `provideInput(manager, input)`
-   **Description:** Sends an input string to the worker, which is then passed to the waiting Python `input()` call.
-   **Parameters:**
    -   `manager` (PyodideManager): The manager instance.
    -   `input` (string): The input value to provide.

### `queueInput(manager, input)`
-   **Description:** Adds an input string to a queue. The queued inputs are automatically sent one by one as Python's `input()` function is called.
-   **Parameters:**
    -   `manager` (PyodideManager): The manager instance.
    -   `input` (string): The input value to queue.

### `setInputCallback(manager, callback)`
-   **Description:** Registers a callback function that will be invoked whenever Python requests input and the input queue is empty.
-   **Parameters:**
    -   `manager` (PyodideManager): The manager instance.
    -   `callback` (function): The callback to execute. It receives the `prompt` string as an argument.

### `isWaitingForInput(manager)`
-   **Description:** Checks if the Pyodide environment is currently paused and waiting for an `input()` call to be resolved.
-   **Returns:** `true` if waiting for input, otherwise `false`.

### `getCurrentPrompt(manager)`
-   **Description:** Returns the prompt string provided by the current Python `input()` call (e.g., `input("Your name: ")`).
-   **Returns:** The prompt string. 