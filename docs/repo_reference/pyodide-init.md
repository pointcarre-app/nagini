# `pyodide/python/pyodide_init.py` - removed

**Location:** none, this file no longer exists in the repository.

`pyodide_init.py` used to be the Python entry point of the worker: it imported the other Python modules and attached their functions to `builtins`, so JavaScript could call them by name through `pyodide.runPython()`.

That mechanism was replaced. The worker now writes `capture_system.py`, `code_transformation.py` and `pyodide_utilities.py` to the virtual filesystem, imports each one with `pyodide.pyimport` and keeps the returned PyProxy module references (see [`worker-handlers.js`](worker-handlers.md)). The capture infrastructure is only ever called through those references, never by name lookup in the interpreter globals, so user code rebinding a name cannot corrupt it. Importing `capture_system` installs `builtins.missive`; together with `input`, that is the only name Nagini exposes to user code.

This page is kept so old links keep resolving.
