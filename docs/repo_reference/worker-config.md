# `pyodide/worker/worker-config.js` - Worker Configuration

**Location:** `src/pyodide/worker/worker-config.js`

This file centralizes all configuration constants and messages for the Pyodide web worker. This improves maintainability by providing a single source of truth for these values.

## Core Object: `PYODIDE_WORKER_CONFIG`

### `PYODIDE_CDN`
-   **Description:** The URL for the Pyodide CDN, from which the Pyodide runtime is loaded. The version number is part of this URL.
-   **Type:** `string`

### `MESSAGES`
-   **Description:** An object containing a categorized collection of all error, warning, and informational messages used by the worker. This ensures consistent and easily updatable messaging.
-   **Type:** `Object` 