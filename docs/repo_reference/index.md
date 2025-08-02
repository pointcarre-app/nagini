# Repository Reference

This section provides a detailed file-by-file reference for the Nagini repository.

- [`nagini.js`](nagini.md) - The main API entry point.
- `utils/`
  - [`validation.js`](validation.md) - Centralized validation utilities.
  - [`createBlobWorker.js`](createBlobWorker.md) - Utilities for cross-origin workers.
- `pyodide/`
  - `manager/`
    - [`manager.js`](manager.md) - The core Pyodide manager.
    - [`manager-static-execution.js`](manager-static-execution.md) - Static execution logic.
    - [`manager-input.js`](manager-input.md) - Input handling.
    - [`manager-fs.js`](manager-fs.md) - Filesystem operations.
  - `worker/`
    - [`worker.js`](worker.md) - The main worker entry point.
    - [`worker-handlers.js`](worker-handlers.md) - Worker message handlers.
    - [`worker-execution.js`](worker-execution.md) - Worker execution logic.
    - [`worker-input.js`](worker-input.md) - Worker input handling.
    - [`worker-fs.js`](worker-fs.md) - Worker filesystem operations.
    - [`worker-config.js`](worker-config.md) - Worker configuration.
  - `file-loader/`
    - [`file-loader.js`](file-loader.md) - Remote file loading.
  - `python/`
    - [`pyodide_init.py`](pyodide-init.md) - Pyodide Python initialization.
    - [`capture_system.py`](capture-system.md) - Output capture system.
    - [`code_transformation.py`](code-transformation.md) - Code transformation for async input.
    - [`pyodide_utilities.py`](pyodide-utilities.md) - Pyodide utility functions.
- `brython/`
  - `manager/`
    - [`manager.js`](brython-manager.md) - The core Brython manager.
    - [`loader.js`](brython-loader.md) - Brython runtime loader.
    - [`executor.js`](brython-executor.md) - Brython code executor. 