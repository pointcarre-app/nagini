# `pyodide/python/pyodide_init.py` - Pyodide Initialization

**Location:** `src/pyodide/python/pyodide_init.py`

This script is the main entry point for the Python environment within the Pyodide worker. It is responsible for importing all necessary Python modules and making their functions available in the global namespace so they can be called from JavaScript.

## Core Logic

This script performs the following actions:

1.  **Imports Modules:** It imports all the necessary functions from the other Python files in the same directory:
    -   `capture_system.py`
    -   `code_transformation.py`
    -   `pyodide_utilities.py`
2.  **Exposes Functions:** It attaches these functions to the `builtins` module, which makes them globally accessible in the Python environment. This allows JavaScript to call them via `pyodide.runPython()`.
3.  **Initializes Capture System:** It calls `reset_captures()` to ensure that the `stdout` and `stderr` streams are redirected and ready to capture output from the very beginning. 