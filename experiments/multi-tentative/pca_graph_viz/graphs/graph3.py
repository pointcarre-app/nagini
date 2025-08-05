import numpy as np

# Graph 3: Identity and Minus Identity on [-3, 3]
x = np.linspace(-3, 3, 100)
y_identity = x  # y = x
y_minus_identity = -x  # y = -x

# Use nice hex colors directly - third variant
bg_color = "#f0ebf4"  # Very light purple-grey
grid_color = "#ddd0e6"  # Light purple-grey
curve1_color = "#4ade80"  # Green
curve2_color = "#f59e0b"  # Orange

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
        "x1": -3,
        "y1": 0,
        "x2": 3,
        "y2": 0,
        "stroke": "#25202a",  # Very dark purple
        "stroke-width": 2,
        "class": "axis x-axis",
    },
    # Y-axis
    {
        "type": "axis",
        "x1": 0,
        "y1": -3,
        "x2": 0,
        "y2": 3,
        "stroke": "#25202a",  # Very dark purple
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
        "bg_color": "rgba(48, 145, 16, 0.2)",
        "text_color": "#309110",
        "border_radius": "0.25rem",
        "font_size": "1rem",
    },
    {
        "x": 2,
        "y": 2,
        "latex": r"x",
        "width": 20,
        "height": 20,
        "bg_color": "rgba(48, 145, 16, 0.2)",
        "text_color": "#309110",
        "border_radius": "0.25rem",
        "font_size": "1rem",
    },
    {
        "x": 3,
        "y": 3,
        "latex": r"x",
        "width": 20,
        "height": 20,
        "bg_color": "rgba(48, 145, 16, 0.2)",
        "text_color": "#309110",
        "border_radius": "0.25rem",
        "font_size": "1rem",
    },
]


def get_graph_dict():
    """Return the graph as a standardized dictionary (V2 format - curves in lines)."""
    return {
        "id": "graph3",
        "title": "Identity and Minus Identity Functions",
        "description": "Shows y = x and y = -x on the interval [-3, 3]",
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
            "axes_color": "#25202a",
        },
        "lines": lines,
        "foreign_objects": foreign_objects,
    }
