# `utils/validation.js` - Validation Utilities

**Location:** `src/utils/validation.js`

This file provides a centralized set of static methods for validating parameters and data structures used throughout the Nagini library.

## Class: `ValidationUtils`

This class contains static methods for various validation tasks.

### `validateArray(value, paramName, component)`
-   **Description:** Checks if a value is an array.
-   **Throws:** `Error` if the value is not an array.

### `validateString(value, paramName, component, allowEmpty)`
-   **Description:** Checks if a value is a string.
-   **`allowEmpty`** (boolean, default: `false`): If `false`, the string cannot be empty.
-   **Throws:** `Error` if the value is not a string or if it's empty when not allowed.

### `validateBoolean(value, paramName, component)`
-   **Description:** Checks if a value is a boolean.
-   **Throws:** `Error` if the value is not a boolean.

### `validateFunction(value, paramName, component)`
-   **Description:** Checks if a value is a function.
-   **Throws:** `Error` if the value is not a function.

### `validateObject(value, paramName, component)`
-   **Description:** Checks if a value is a plain object (not `null` or an array).
-   **Throws:** `Error` if the value is not an object.

### `validateWorker(worker, component)`
-   **Description:** Validates a `Worker` instance by checking for the `postMessage` method.
-   **Throws:** `Error` if the worker is not a valid instance.

### `validatePyodide(pyodide, component)`
-   **Description:** Validates a Pyodide instance by checking for the `FS` object and `runPython` method.
-   **Throws:** `Error` if the instance is not valid.

### `validateFilesToLoad(filesToLoad, component)`
-   **Description:** Validates an array of file objects, ensuring each has a `url` and `path`.
-   **Throws:** `Error` if the array or any of its objects are invalid.

### `validatePackages(packages, component)`
-   **Description:** Validates an array of package names, ensuring each is a non-empty string.
-   **Throws:** `Error` if the array or any of its elements are invalid.

### `validateNamespace(namespace, component)`
-   **Description:** Validates an optional `namespace` object.
-   **Throws:** `Error` if the namespace is defined but is not a valid object.

### `validateExecutionParams(filename, code, namespace, component)`
-   **Description:** Validates all parameters for an execution call.
-   **Throws:** `Error` if any parameter is invalid.

### `checkDangerousPatterns(code)`
-   **Description:** Scans Python code for potentially dangerous patterns (e.g., `import os`).
-   **Returns:** An array of strings describing any dangerous patterns found.

### `validateBackend(backend, component)`
-   **Description:** Validates the backend name (must be `'pyodide'` or `'brython'`).
-   **Throws:** `Error` if the backend name is not valid. 