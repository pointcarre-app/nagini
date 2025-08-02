# `pyodide/python/pyodide_utilities.py` - Pyodide Utilities

**Location:** `src/pyodide/python/pyodide_utilities.py`

This file contains miscellaneous utility functions for configuring the Pyodide environment.

## Core Functions

### `setup_matplotlib()`
-   **Description:** This function is called after the necessary packages (including Matplotlib) have been loaded. It configures Matplotlib for use in a non-interactive Web Worker environment.
-   **Key Actions:**
    1.  **Sets Backend to `agg`:** It forces Matplotlib to use the non-interactive `agg` backend, which is essential for rendering plots in a worker without DOM access.
    2.  **Disables Font Caching:** It disables Matplotlib's font caching to prevent slowdowns and potential issues in the testing environment.
    3.  **Overrides `plt.show()`:** It replaces the standard `plt.show()` function with a no-op, as plots are captured automatically by the `capture_system.py` module. 