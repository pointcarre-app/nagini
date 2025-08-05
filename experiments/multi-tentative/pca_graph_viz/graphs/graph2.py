import numpy as np

# Graph 2: Identity and Minus Identity on [-2, 2]
x = np.linspace(-2, 2, 100)
y_identity = x  # y = x
y_minus_identity = -x  # y = -x

# Use nice hex colors directly - different from graph1
bg_color = "#f4f1e8"  # Very light warm grey
grid_color = "#e0d9c6"  # Light warm grey
curve1_color = "#4681ea"  # Blue
curve2_color = "#ea5545"  # Red

# All visual elements in lines array
lines = [
    # First curve: y = x
    {
        "type": "curve",
        "id": "identity",
        "data": {"x": x.tolist(), "y": y_identity.tolist()},
        "stroke": curve1_color,
        "stroke-width": 2,
        "fill": "none",
        "class": "curve identity-curve",
    },
    # Second curve: y = -x
    {
        "type": "curve",
        "id": "minus-identity",
        "data": {"x": x.tolist(), "y": y_minus_identity.tolist()},
        "stroke": curve2_color,
        "stroke-width": 2,
        "fill": "none",
        "class": "curve minus-identity-curve",
    },
    # X-axis
    {
        "type": "axis",
        "x1": -2,
        "y1": 0,
        "x2": 2,
        "y2": 0,
        "stroke": "#342f26",  # Dark warm grey
        "stroke-width": 2,
        "class": "axis x-axis",
    },
    # Y-axis
    {
        "type": "axis",
        "x1": 0,
        "y1": -2,
        "x2": 0,
        "y2": 2,
        "stroke": "#342f26",  # Dark warm grey
        "stroke-width": 2,
        "class": "axis y-axis",
    },
]

foreign_objects = [
    {
        "x": 1,
        "y": 1,
        "latex": r"x",
        "width": 20,
        "height": 20,
        "bg_color": "rgba(0, 133, 192, 0.2)",
        "text_color": "#0085c0",
        "border_radius": "0.25rem",
    },
    {
        "x": 2,
        "y": 2,
        "latex": r"x",
        "width": 20,
        "height": 20,
        "bg_color": "rgba(0, 133, 192, 0.2)",
        "text_color": "#0085c0",
        "border_radius": "0.25rem",
    },
]


def get_graph_dict():
    """Return the graph as a standardized dictionary (V2 format - curves in lines)."""
    return {
        "id": "graph2",
        "title": "Identity and Minus Identity Functions",
        "description": "Shows y = x and y = -x on the interval [-2, 2]",
        "svg": {
            "width": 340,
            "height": 340,
            "viewBox": "0 0 340 340",
            "style": {"background-color": bg_color},
        },
        "settings": {
            "margin": 5,
            "show_axes": False,  # We define axes in lines
            "show_grid": True,
            "grid_color": grid_color,
            "axes_color": "#342f26",
        },
        "lines": lines,
        "foreign_objects": foreign_objects,
    }
