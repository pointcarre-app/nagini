# =============================================================================
# Pyodide Utilities
# =============================================================================
# This module contains utility functions for Pyodide environment setup


def setup_matplotlib():
    """Set up matplotlib configuration if the package is available"""
    try:
        import matplotlib
        import matplotlib.pyplot as plt

        # Use the non-interactive 'agg' backend, which is required for rendering in a worker.
        plt.switch_backend("agg")

        # Disable font caching to prevent issues in the test environment.
        matplotlib.rcParams["font.family"] = "sans-serif"
        matplotlib.rcParams["font.sans-serif"] = ["Arial"]
        matplotlib.rcParams["text.usetex"] = False

        # Override plt.show() to prevent display attempts
        def custom_show(*args, **kwargs):
            pass  # No-op since we capture figures manually

        plt.show = custom_show
        print("🎨 Matplotlib configured successfully with 'agg' backend and font caching disabled")
    except ImportError:
        # matplotlib not available, skip setup
        pass
    except Exception as e:
        print(f"Warning: Could not configure matplotlib: {e}")


# Additional utility functions can be added here as needed
