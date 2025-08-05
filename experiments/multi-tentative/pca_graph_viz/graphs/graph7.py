import numpy as np

# Graph 7: Exponential (Gaussian curve)
x = np.linspace(-5, 5, 100)
y = np.exp(-(x**2) / 4)

# All visual elements in lines array
lines = [
    # The Gaussian curve
    {
        "type": "curve",
        "id": "gaussian",
        "data": {"x": x.tolist(), "y": y.tolist()},
        "stroke": "blue",
        "stroke-width": 2,
        "fill": "none",
        "class": "curve gaussian-curve",
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
        "y1": -0.2,  # Gaussian peaks at 1, adding some padding
        "x2": 0,
        "y2": 1.2,
        "stroke": "#333333",
        "stroke-width": 2,
        "class": "axis y-axis",
    },
]

# No annotations yet
foreign_objects = []


def get_graph_dict():
    """Return the graph as a standardized dictionary (V2 format - curves in lines)."""
    return {
        "id": "graph7",
        "title": "Gaussian Curve",
        "description": "Shows e^(-x²/4) over the interval [-5, 5]",
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
