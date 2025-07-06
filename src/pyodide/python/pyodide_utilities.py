# =============================================================================
# Pyodide Utilities
# =============================================================================
# This module contains utility functions for Pyodide environment setup


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


# Additional utility functions can be added here as needed
