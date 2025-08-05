# Template for standardized graph dictionary structure
# This serves as a reference for the new dict-based graph format

graph_dict_template = {
    # Metadata
    "id": "graph_template",
    "title": "Template Graph",
    "description": "Example template showing all possible fields",
    # Data
    "data": {
        "x": [1, 2, 3, 4, 5],  # List of x values
        "y": [1, 4, 9, 16, 25],  # List of y values (single curve)
        # OR for multi-curve:
        # "y_list": [[1, 4, 9, 16, 25], [2, 8, 18, 32, 50]]  # List of y arrays
    },
    # SVG parameters with exact HTML/SVG attribute names
    "svg": {
        "width": 340,
        "height": 340,
        "viewBox": "0 0 340 340",
        "style": {"background-color": "white"},
    },
    # Visual settings
    "settings": {
        "margin": 5,
        "show_axes": False,  # We define axes in lines
        "show_grid": True,
        "grid_color": "lightgray",
        "curve_color": "blue",
        "axes_color": "#333333",  # For compatibility
    },
    # Lines (includes axes, grid lines, reference lines)
    "lines": [
        # X-axis example
        {
            "x1": -5,
            "y1": 0,
            "x2": 5,
            "y2": 0,
            "stroke": "#333333",
            "stroke-width": 2,  # Note: hyphenated for HTML/SVG
            "stroke-opacity": 1,
            "stroke-dasharray": None,
            "class": "axis x-axis",
            "id": "x-axis",
            "style": None,
            "type": "axis",  # This adds arrow marker
            "marker-end": "url(#arrow)",  # Added automatically for axis type
        },
        # Y-axis example without arrow
        {
            "x1": 0,
            "y1": -5,
            "x2": 0,
            "y2": 5,
            "stroke": "#333333",
            "stroke-width": 2,
            "class": "axis y-axis no-arrow",  # no-arrow class prevents arrow
            "type": "axis",
        },
        # Reference line example
        {
            "x1": -5,
            "y1": 2,
            "x2": 5,
            "y2": 2,
            "stroke": "#cccccc",
            "stroke-width": 1,
            "stroke-dasharray": "3,3",
            "class": "reference-line",
            "type": "curve",  # Default type, no arrow
        },
    ],
    # Foreign objects (LaTeX annotations)
    "foreign_objects": [
        {
            "x": 2,
            "y": 4,
            "width": 100,
            "height": 50,
            "latex": "f(2) = 4",
            "class": "svg-latex",
            "data-latex": "f(2) = 4",  # For KaTeX processing
            "show_point": True,  # Add red circle marker
            "style": {
                "background-color": "rgba(236, 48, 89, 0.2)",
                "color": "#ec3059",
                "border-radius": "0.25rem",
                "padding": "0.25rem",
            },
        }
    ],
}

# Example of how to use the dict with the new functions:
"""
from svg_utils import graph_from_dict

# Generate SVG from dict
svg_string = graph_from_dict(graph_dict_template)

# OR create dict from existing parameters:
from svg_utils import dict_from_graph_params
import numpy as np

x = np.linspace(-5, 5, 100)
y = x**2

graph_dict = dict_from_graph_params(
    x_data=x,
    y_data=y,
    size=340,
    lines=[...],  # Your lines
    foreign_objects=[...],  # Your annotations
    title="Parabola",
    description="y = x²",
    graph_id="parabola",
    show_axes=False,
    show_grid=True
)
"""
