# =============================================================================
# Pyodide Python Initialization Script - Modular Version
# =============================================================================
# This file contains Python utilities that run inside the Pyodide environment.
# It coordinates all the modular components for a cleaner architecture.

# Standard Library Imports
# ------------------------
import json  # JavaScript Object Notation
import builtins  # Built-in functions and exceptions

# Local Module Imports
# --------------------
from capture_system import (
    reset_captures,
    get_stdout,
    get_stderr,
    get_missive,
    get_figures,
    missive,
    restore_original_streams,
)

from code_transformation import transform_code_for_execution, prepare_code_for_async_input

from pyodide_utilities import setup_matplotlib

# =============================================================================
# MAKE FUNCTIONS AVAILABLE GLOBALLY
# =============================================================================
# Export all the necessary functions to the global namespace so they can be
# called from JavaScript and from user Python code

# Capture system functions
builtins.reset_captures = reset_captures
builtins.get_stdout = get_stdout
builtins.get_stderr = get_stderr
builtins.get_missive = get_missive
builtins.get_figures = get_figures
builtins.missive = missive
builtins.restore_original_streams = restore_original_streams

# Code transformation functions
builtins.transform_code_for_execution = transform_code_for_execution
builtins.prepare_code_for_async_input = prepare_code_for_async_input

# Utility functions
builtins.setup_matplotlib = setup_matplotlib

# Other globals
builtins.json = json

# =============================================================================
# INITIALIZATION
# =============================================================================

# Initialize capture system immediately
reset_captures()

print("🐍 Pyodide initialization completed successfully!")
print("🔧 All modules loaded and capture system active")

# Note: setup_matplotlib() will be called after packages are loaded
# in the worker initialization process
