import numpy as np

# Graph 4: Identity and Minus Identity on [-4, 4]
x = np.linspace(-4, 4, 100)
y_identity = x  # y = x
y_minus_identity = -x  # y = -x

# Use nice hex colors directly - fourth variant
bg_color = "#f0e9d8"  # Very light yellow-grey
grid_color = "#dcc9a3"  # Light yellow-grey
curve1_color = "#5eadef"  # Cyan-blue
curve2_color = "#ec4899"  # Pink

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
        "x1": -4,
        "y1": 0,
        "x2": 4,
        "y2": 0,
        "stroke": "#1f1b14",  # Almost black with yellow tint
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
        "stroke": "#1f1b14",  # Almost black with yellow tint
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
        "bg_color": "rgba(214, 129, 12, 0.2)",
        "text_color": "#d6810c",
        "border_radius": "0.25rem",
        "font_size": "1rem",
    },
    {
        "x": 2,
        "y": 2,
        "latex": r"x",
        "width": 20,
        "height": 20,
        "bg_color": "rgba(214, 129, 12, 0.2)",
        "text_color": "#d6810c",
        "border_radius": "0.25rem",
        "font_size": "1rem",
    },
    {
        "x": 3,
        "y": 3,
        "latex": r"x",
        "width": 20,
        "height": 20,
        "bg_color": "rgba(214, 129, 12, 0.2)",
        "text_color": "#d6810c",
        "border_radius": "0.25rem",
        "font_size": "1rem",
    },
]


def get_graph_dict():
    """Return the graph as a standardized dictionary (V2 format - curves in lines)."""
    return {
        "id": "graph4",
        "title": "Identity and Minus Identity Functions",
        "description": "Shows y = x and y = -x on the interval [-4, 4]",
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
            "axes_color": "#1f1b14",
        },
        "lines": lines,
        "foreign_objects": foreign_objects,
    }
