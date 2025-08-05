import numpy as np

# Graph 6: Simple sine wave
x = np.linspace(-5, 5, 100)
y = np.sin(x)

# All visual elements in lines array
lines = [
    # The sine curve
    {
        "type": "curve",
        "id": "sine",
        "data": {"x": x.tolist(), "y": y.tolist()},
        "stroke": "blue",
        "stroke-width": 2,
        "fill": "none",
        "class": "curve sine-curve",
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
        "y1": -1.5,  # Sine wave range is [-1, 1], adding some padding
        "x2": 0,
        "y2": 1.5,
        "stroke": "#333333",
        "stroke-width": 2,
        "class": "axis y-axis",
    },
]

foreign_objects = [
    {
        "x": 4.2,
        "y": 0,
        "latex": r"x",
        "width": 20,
        "height": 20,
        "text_color": "#141b20",
        "font_weight": "700",
    }
]


def get_graph_dict():
    """Return the graph as a standardized dictionary (V2 format - curves in lines)."""
    return {
        "id": "graph6",
        "title": "Sine Wave",
        "description": "Shows sin(x) over the interval [-5, 5]",
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
