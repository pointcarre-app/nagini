# `utils/createBlobWorker.js` - Blob Worker Utility

**Location:** `src/utils/createBlobWorker.js`

This file provides utilities for creating and managing web workers from blob URLs. This is a crucial technique for enabling cross-origin worker execution, which is a common requirement in web applications where the main application and the worker scripts are served from different origins.

## Functions

### `createBlobWorkerUrl(workerUrl)`
-   **Description:** Fetches a worker script from a URL and creates a blob URL from its content.
-   **`workerUrl`** (string): The URL of the bundled worker script (`worker-dist.js`).
-   **Returns:** A promise that resolves to a blob URL (string).
-   **Throws:** `Error` if the worker script cannot be fetched.

### `createBlobWorker(workerUrl)`
-   **Description:** Creates a `Worker` instance using the blob URL pattern.
-   **`workerUrl`** (string): The URL of the bundled worker script (`worker-dist.js`).
-   **Returns:** A promise that resolves to a `Worker` instance.
-   **Throws:** `Error` if the worker creation fails.

### `revokeBlobUrl(blobUrl)`
-   **Description:** Revokes a blob URL to release memory. This is an important cleanup step to prevent memory leaks.
-   **`blobUrl`** (string): The blob URL to revoke. 