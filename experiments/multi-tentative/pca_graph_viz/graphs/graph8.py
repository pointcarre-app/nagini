import numpy as np

# Graph 8: Cubic Function
x = np.linspace(-5, 5, 100)
y = x**3 - 3 * x

# All visual elements in lines array
lines = [
    # The cubic curve itself
    {
        "type": "curve",
        "id": "cubic",
        "data": {"x": x.tolist(), "y": y.tolist()},
        "stroke": "#1976d2",  # Nice blue
        "stroke-width": 2,
        "fill": "none",
        "class": "curve cubic-curve",
    },
    # X-axis
    {
        "type": "axis",
        "x1": -5,
        "y1": 0,
        "x2": 5,
        "y2": 0,
        "stroke": "#333333",
        "stroke-width": 2,
        "class": "axis x-axis",
    },
    # Y-axis
    {
        "type": "axis",
        "x1": 0,
        "y1": -120,
        "x2": 0,
        "y2": 120,
        "stroke": "#333333",
        "stroke-width": 2,
        "class": "axis y-axis",
    },
]

foreign_objects = []  # No annotations


def get_graph_dict():
    """Return the graph as a standardized dictionary (V2 format)."""
    return {
        "id": "graph8",
        "title": "Cubic Function",
        "description": "Shows f(x) = x³ - 3x over the interval [-5, 5]",
        "svg": {
            "width": 340,
            "height": 340,
            "viewBox": "0 0 340 340",
            "style": {"background-color": "white"},
        },
        "settings": {
            "margin": 5,
            "show_axes": False,  # We define axes in lines
            "show_grid": True,
            "grid_color": "lightgray",
            "axes_color": "#333333",
        },
        "lines": lines,
        "foreign_objects": foreign_objects,
    }
