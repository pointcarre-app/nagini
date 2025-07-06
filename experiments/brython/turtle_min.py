from browser import document
import sys
import traceback

PRINT_OUTPUT = "output"


# Redirect stdout and stderr to the on-page output textarea
class _Writer:
    def write(self, data):
        # Ensure string type and append
        document[PRINT_OUTPUT].value += str(data)

    def flush(self):
        pass


sys.stdout = _Writer()
sys.stderr = _Writer()

# Prefix code that sets the turtle canvas wrapper so drawings appear in the page
PREFIX = """import turtle\nfrom browser import document\n# Route turtle graphics to the #turtle div\nturtle.set_defaults(turtle_canvas_wrapper=document['turtle'])\n"""


def _run_code(ev):
    """Execute the Python code currently in the textarea."""
    # Clear previous output
    document[PRINT_OUTPUT].value = ""
    # Reset turtle canvas
    try:
        from turtle import restart  # pylint: disable=import-error

        restart()
    except Exception:
        # If restart not available, ignore
        pass

    src = PREFIX + document["code"].value
    try:
        ns = {"__name__": "__main__"}
        exec(src, ns)
    except Exception:
        traceback.print_exc()


def _clear(ev):
    """Clear the output area and turtle canvas."""
    document[PRINT_OUTPUT].value = ""
    try:
        from turtle import restart  # pylint: disable=import-error

        restart()
    except Exception:
        pass


def _about(ev):
    """Show Brython version information in the output area."""
    import sys as _sys

    info = _sys.implementation.version
    document[
        PRINT_OUTPUT
    ].value = f"Brython version {_sys.version.split(' ')[0]} (implementation {_sys.implementation.name} {_sys.implementation.version})"


# Bind button events

document["run"].bind("click", _run_code)
document["clear"].bind("click", _clear)
document["about"].bind("click", _about)
