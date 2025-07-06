# =============================================================================
# Pyodide Python Initialization Script - DIRECT CAPTURE SYSTEM
# =============================================================================
# This file contains Python utilities that run inside the Pyodide environment.
# Uses direct sys.stdout/stderr replacement for reliable capture in WebAssembly.

# Standard Library Imports
# ------------------------
import json  # JavaScript Object Notation
import builtins  # Built-in functions and exceptions
import io  # I/O operations
import sys  # System-specific parameters and functions

# =============================================================================
# MODULE LOADING SETUP
# =============================================================================


# def setup_module_loading():
#     """Set up Python path and module loading for Pyodide environment."""
#     # Add current directory to Python path
#     sys.path.insert(0, os.getcwd())

#     # Create necessary directories if they don't exist
#     directories = ["src", "src/services", "src/services/product", "src/schemas"]

#     for directory in directories:
#         try:
#             if not os.path.exists(directory):
#                 os.makedirs(directory)
#         except Exception as e:
#             print(f"Warning: Could not create directory {directory}: {e}")

#     # Create __init__.py files if they don't exist
#     init_files = [
#         "src/__init__.py",
#         "src/services/__init__.py",
#         "src/services/product/__init__.py",
#         "src/schemas/__init__.py",
#     ]

#     for init_file in init_files:
#         try:
#             if not os.path.exists(init_file):
#                 with open(init_file, "w") as f:
#                     f.write("# Package initialization file\n")
#         except Exception as e:
#             print(f"Warning: Could not create {init_file}: {e}")


# =============================================================================
# DIRECT STDOUT/STDERR CAPTURE SYSTEM
# =============================================================================

# Store original stdout/stderr so we can restore them if needed
_original_stdout = sys.stdout
_original_stderr = sys.stderr

# Create capture buffers
_stdout_buffer = io.StringIO()
_stderr_buffer = io.StringIO()

# Storage for missive system
current_missive: dict | None = None
missive_already_called: bool = False


class CaptureStream:
    """Custom stream that captures all write operations"""

    def __init__(self, buffer):
        self.buffer = buffer

    def write(self, text):
        self.buffer.write(text)
        return len(text)

    def flush(self):
        self.buffer.flush()

    def isatty(self):
        return False


# Create capture streams
_stdout_capturer = CaptureStream(_stdout_buffer)
_stderr_capturer = CaptureStream(_stderr_buffer)

# =============================================================================
# UTILITY FUNCTIONS - Direct capture system management
# =============================================================================


def reset_captures() -> None:
    """Reset capture buffers and activate capturing by replacing sys.stdout/stderr"""
    global current_missive, missive_already_called

    # Clear buffers
    _stdout_buffer.truncate(0)
    _stdout_buffer.seek(0)
    _stderr_buffer.truncate(0)
    _stderr_buffer.seek(0)

    # Clear missive data
    current_missive = None
    missive_already_called = False

    # Close any existing matplotlib figures (if matplotlib is available)
    try:
        import matplotlib.pyplot as plt

        plt.close("all")
    except ImportError:
        pass  # matplotlib not available, skip
    except Exception:
        pass  # Ignore other errors

    # Activate capturing by replacing sys.stdout/stderr
    sys.stdout = _stdout_capturer
    sys.stderr = _stderr_capturer


def get_stdout() -> str:
    """Get captured stdout content"""
    return _stdout_buffer.getvalue()


def get_stderr() -> str:
    """Get captured stderr content"""
    return _stderr_buffer.getvalue()


def restore_original_streams() -> None:
    """Restore original stdout/stderr (for debugging if needed)"""
    sys.stdout = _original_stdout
    sys.stderr = _original_stderr


def get_missive() -> str | None:
    """
    Get the current missive dictionary as a JSON string.

    A "missive" is our term for structured data that user code wants to send
    back to JavaScript. It's always a Python dictionary that gets converted
    to JSON format (which JavaScript can easily understand).

    Returns:
        str | None: JSON string of the missive data, or None if no missive was sent

    Example:
        If user code did: missive({"result": 42, "status": "success"})
        This would return: '{"result": 42, "status": "success"}'
    """
    if current_missive is None:
        return None  # No missive was stored
    return json.dumps(current_missive)  # Convert Python dict to JSON string


def get_figures() -> list:
    """
    Capture matplotlib figures and return them as base64 encoded strings.

    Returns:
        list: List of base64 encoded PNG images of matplotlib figures
    """
    figures = []

    try:
        # Import matplotlib only when needed (after packages are loaded)
        import matplotlib.pyplot as plt
        import base64

        if hasattr(plt, "get_fignums"):
            try:
                for fig_num in plt.get_fignums():
                    plt.figure(fig_num)
                    buf = io.BytesIO()
                    plt.savefig(buf, format="png", dpi=100, bbox_inches="tight")
                    buf.seek(0)
                    figures.append(base64.b64encode(buf.read()).decode("utf-8"))
                    plt.close(fig_num)
            except Exception as e:
                print(f"Error capturing figures: {e}")
    except ImportError:
        # matplotlib not available, return empty list
        pass
    except Exception as e:
        print(f"Error importing matplotlib: {e}")

    return figures


def missive(data):
    """Send structured data back to JavaScript (once per execution)"""
    global current_missive, missive_already_called
    if missive_already_called:
        raise ValueError(
            "missive() can only be called once per execution. If you need to send multiple pieces of data, put them all in one dictionary."
        )
    current_missive = data
    missive_already_called = True


# =============================================================================
# CODE TRANSFORMATION FOR ASYNC INPUT SUPPORT
# =============================================================================


def prepare_code_for_async_input(code):
    """
    Transform code to support async input handling.
    This replaces input() calls with await input() calls since we'll replace
    the built-in input function with an async version.
    """
    lines = []
    for line in code.split("\n"):
        # Make sure input() uses await, but don't modify comments
        if "input(" in line and "await input(" not in line and not line.strip().startswith("#"):
            # Replace the input call with await input
            line = line.replace("input(", "await input(")
        lines.append(line)
    return "\n".join(lines)


def transform_code_for_execution(code):
    """
    Transform user code to support input handling only when needed.
    If code doesn't contain input() calls, execute it directly without transformation.
    """
    # Check if code contains input() calls
    if "input(" in code:
        # Only transform if input() is present
        prepared = prepare_code_for_async_input(code)

        # Properly indent the user code for the async function (8 spaces for try block)
        indented_code = ""
        for line in prepared.split("\n"):
            if line.strip():  # Skip empty lines for indentation
                indented_code += "        " + line + "\n"  # 8 spaces for try block
            else:
                indented_code += "\n"  # Keep empty lines

        return f"""import asyncio

async def __run_code():
    try:
        global current_missive, missive_already_called

{indented_code}
    except Exception as e:
        import traceback
        print(f"Error occurred: {{type(e).__name__}}: {{str(e)}}")
        traceback.print_exc()

# Execute the async code
await __run_code()
"""
    else:
        # No input() calls, execute code directly without transformation
        return code


# =============================================================================
# MAKE FUNCTIONS AVAILABLE GLOBALLY
# =============================================================================
builtins.missive = missive
builtins.json = json
builtins.transform_code_for_execution = transform_code_for_execution

# Initialize capture system immediately
reset_captures()


# Set up matplotlib if available (this will be called after packages are loaded)
def setup_matplotlib():
    """Set up matplotlib configuration if the package is available"""
    try:
        import matplotlib.pyplot as plt

        plt.switch_backend("agg")  # Use non-interactive backend

        # Override plt.show() to prevent display attempts
        def custom_show(*args, **kwargs):
            pass  # No-op since we capture figures manually

        plt.show = custom_show
        print("🎨 Matplotlib configured successfully")
    except ImportError:
        # matplotlib not available, skip setup
        pass
    except Exception as e:
        print(f"Warning: Could not configure matplotlib: {e}")


# Make setup_matplotlib available globally so it can be called after package loading
builtins.setup_matplotlib = setup_matplotlib

# # Set up module loading
# setup_module_loading()
