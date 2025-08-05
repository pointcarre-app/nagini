import numpy as np

# Graph 9: Circle (parametric)
t = np.linspace(0, 2 * np.pi, 100)
x = 3 * np.cos(t)
y = 3 * np.sin(t)

# All visual elements in lines array
lines = [
    # The circle curve
    {
        "type": "curve",
        "id": "circle",
        "data": {"x": x.tolist(), "y": y.tolist()},
        "stroke": "#1976d2",
        "stroke-width": 2,
        "fill": "none",
        "class": "curve circle-curve",
    },
    # X-axis
    {
        "type": "axis",
        "x1": -4,  # Circle radius is 3, adding some padding
        "y1": 0,
        "x2": 4,
        "y2": 0,
        "stroke": "#333333",
        "stroke-width": 2,
        "class": "axis x-axis",
    },
    # Y-axis
    {
        "type": "axis",
        "x1": 0,
        "y1": -4,
        "x2": 0,
        "y2": 4,
        "stroke": "#333333",
        "stroke-width": 2,
        "class": "axis y-axis",
    },
]


def get_graph_dict():
    """Return the graph as a standardized dictionary (V2 format - curves in lines)."""
    return {
        "id": "graph9",
        "title": "Circle",
        "description": "Parametric circle with radius 3",
        "svg": {
            "width": 340,
            "height": 340,
            "viewBox": "0 0 340 340",
            "style": {"background-color": "#e8e8e8"},
        },
        "settings": {
            "margin": 5,
            "show_axes": False,  # We define axes in lines
            "show_grid": True,
            "grid_color": "lightgray",
            "axes_color": "#333333",
        },
        "lines": lines,
        "foreign_objects": [],  # No annotations
    }
