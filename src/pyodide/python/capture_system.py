# =============================================================================
# Output Capture System for Pyodide
# =============================================================================
# This module handles stdout/stderr capture and the missive system
# Uses direct sys.stdout/stderr replacement for reliable capture in WebAssembly

import json
import io
import sys
import builtins

# Store original stdout/stderr so we can restore them if needed
_original_stdout = sys.stdout
_original_stderr = sys.stderr

# Create capture buffers
_stdout_buffer = io.StringIO()
_stderr_buffer = io.StringIO()

# Storage for missive system - using builtins to ensure global availability
if not hasattr(builtins, "_nagini_current_missive"):
    builtins._nagini_current_missive = None
if not hasattr(builtins, "_nagini_missive_already_called"):
    builtins._nagini_missive_already_called = False


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


def reset_captures() -> None:
    """Reset capture buffers and activate capturing by replacing sys.stdout/stderr"""
    print("[DEBUG] reset_captures() called. Clearing missive state.")

    # Clear buffers
    _stdout_buffer.truncate(0)
    _stdout_buffer.seek(0)
    _stderr_buffer.truncate(0)
    _stderr_buffer.seek(0)

    # Clear missive data using builtins for global access
    builtins._nagini_current_missive = None
    builtins._nagini_missive_already_called = False

    # Close any existing matplotlib figures (if matplotlib is available)
    try:
        import matplotlib.pyplot as plt

        plt.close("all")
    except ImportError:
        pass  # matplotlib not available, skip
    except Exception:
        pass  # Ignore other errors

    # Clear any existing Bokeh figures (if bokeh is available)
    try:
        from bokeh.plotting import curdoc

        doc = curdoc()
        doc.clear()
    except ImportError:
        pass  # bokeh not available, skip
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
    print(
        f"[DEBUG] get_missive() called. _nagini_current_missive is: {builtins._nagini_current_missive}"
    )
    if builtins._nagini_current_missive is None:
        return None  # No missive was stored
    return json.dumps(builtins._nagini_current_missive)  # Convert Python dict to JSON string


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


def get_bokeh_figures() -> list:
    """
    Capture Bokeh figures and return them as JSON for frontend rendering.

    Returns:
        list: List of JSON strings representing Bokeh figures
    """
    bokeh_figures = []

    try:
        # Import bokeh only when needed
        from bokeh.plotting import curdoc
        from bokeh.embed import json_item

        # Get the current document
        doc = curdoc()

        # Check if there are any roots (plots/layouts) in the document
        if doc.roots:
            for root in doc.roots:
                try:
                    # Convert each root to JSON format
                    item_json = json_item(root)
                    bokeh_figures.append(json.dumps(item_json))
                except Exception as e:
                    print(f"Error converting Bokeh figure to JSON: {e}")

        # Also check for figures that might not be in curdoc yet
        # This handles cases where figures are created but not added to document
        try:
            from bokeh import plotting

            # Check if there are any current plots
            if hasattr(plotting, "curplot") and plotting.curplot() is not None:
                plot = plotting.curplot()
                if plot not in doc.roots:
                    item_json = json_item(plot)
                    bokeh_figures.append(json.dumps(item_json))
        except:
            pass  # curplot might not exist in all versions

    except ImportError:
        # bokeh not available, return empty list
        pass
    except Exception as e:
        print(f"Error capturing Bokeh figures: {e}")

    return bokeh_figures


def missive(data):
    """Send structured data back to JavaScript (once per execution)"""
    print(f"[DEBUG] missive() called with data: {data}")
    if builtins._nagini_missive_already_called:
        print("[DEBUG] missive() called more than once. Raising ValueError.")
        raise ValueError(
            "missive() can only be called once per execution. "
            "If you need to send multiple pieces of data, "
            "put them all in one dictionary."
        )
    builtins._nagini_current_missive = data
    builtins._nagini_missive_already_called = True
    print(f"[DEBUG] _nagini_current_missive is now set to: {builtins._nagini_current_missive}")


# Make the missive function available globally
builtins.missive = missive

# Legacy global variables for backward compatibility
current_missive = builtins._nagini_current_missive
missive_already_called = builtins._nagini_missive_already_called


def debug_missive_system():
    """Debug function to check the current state of the missive system"""
    print(f"[DEBUG] _nagini_current_missive: {builtins._nagini_current_missive}")
    print(f"[DEBUG] _nagini_missive_already_called: {builtins._nagini_missive_already_called}")
    print(f"[DEBUG] get_missive() returns: {get_missive()}")
    print(f"[DEBUG] missive function available: {hasattr(builtins, 'missive')}")
    return {
        "current_missive": builtins._nagini_current_missive,
        "missive_already_called": builtins._nagini_missive_already_called,
        "get_missive_result": get_missive(),
        "missive_function_available": hasattr(builtins, "missive"),
    }


# Make debug function available globally too
builtins.debug_missive_system = debug_missive_system
