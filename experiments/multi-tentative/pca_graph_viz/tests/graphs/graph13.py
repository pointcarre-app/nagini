import numpy as np

# Graph 13: Exponential and Natural Logarithm - Inverse Functions
x_exp = np.linspace(-2, 2.5, 100)
y_exp = np.exp(x_exp)  # e^x

x_log = np.linspace(0.1, 8, 100)
y_log = np.log(x_log)  # ln(x)

# Line y = x for reference (shows the reflection axis)
x_line = np.linspace(-2, 3, 50)
y_line = x_line

# Colors
bg_color = "#f3e5f5"
grid_color = "#e1bee7"
exp_color = "#7b1fa2"
log_color = "#00695c"
line_color = "#616161"

# All visual elements in lines array
lines = [
    # Reference line y = x (dashed)
    {
        "type": "curve",
        "id": "identity-line",
        "data": {"x": x_line.tolist(), "y": y_line.tolist()},
        "stroke": line_color,
        "stroke-width": 1.5,
        "stroke-dasharray": "5,5",
        "fill": "none",
        "class": "curve identity-line",
    },
    # Exponential function
    {
        "type": "curve",
        "id": "exponential",
        "data": {"x": x_exp.tolist(), "y": y_exp.tolist()},
        "stroke": exp_color,
        "stroke-width": 2.5,
        "fill": "none",
        "class": "curve exponential",
    },
    # Natural logarithm
    {
        "type": "curve",
        "id": "logarithm",
        "data": {"x": x_log.tolist(), "y": y_log.tolist()},
        "stroke": log_color,
        "stroke-width": 2.5,
        "fill": "none",
        "class": "curve logarithm",
    },
    # X-axis
    {
        "type": "axis",
        "x1": -2,
        "y1": 0,
        "x2": 4,
        "y2": 0,
        "stroke": "#424242",
        "stroke-width": 2,
        "class": "axis x-axis",
    },
    # Y-axis
    {
        "type": "axis",
        "x1": 0,
        "y1": -2,
        "x2": 0,
        "y2": 4,
        "stroke": "#424242",
        "stroke-width": 2,
        "class": "axis y-axis",
    },
    # Point at (1, e)
    {
        "type": "circle",
        "cx": 1,
        "cy": float(np.e),
        "r": 4,
        "fill": exp_color,
        "stroke": "#4a148c",
        "stroke-width": 2,
        "class": "special-point",
    },
    # Point at (e, 1)
    {
        "type": "circle",
        "cx": float(np.e),
        "cy": 1,
        "r": 4,
        "fill": log_color,
        "stroke": "#004d40",
        "stroke-width": 2,
        "class": "special-point",
    },
    # Point at (0, 1) for e^0
    {
        "type": "circle",
        "cx": 0,
        "cy": 1,
        "r": 3,
        "fill": exp_color,
        "stroke": "#4a148c",
        "stroke-width": 2,
        "class": "special-point",
    },
    # Point at (1, 0) for ln(1)
    {
        "type": "circle",
        "cx": 1,
        "cy": 0,
        "r": 3,
        "fill": log_color,
        "stroke": "#004d40",
        "stroke-width": 2,
        "class": "special-point",
    },
]

foreign_objects = [
    # Exponential function label
    {
        "x": -1,
        "y": 3,
        "latex": r"y = e^x",
        "width": 70,
        "height": 30,
        "bg_color": "rgba(123, 31, 162, 0.1)",
        "text_color": exp_color,
        "border_radius": "0.5rem",
        "font_weight": "bold",
    },
    # Logarithm function label
    {
        "x": 3,
        "y": -1,
        "latex": r"y = \ln(x)",
        "width": 80,
        "height": 30,
        "bg_color": "rgba(0, 105, 92, 0.1)",
        "text_color": log_color,
        "border_radius": "0.5rem",
        "font_weight": "bold",
    },
    # Identity line label
    {
        "x": 2.5,
        "y": 2.8,
        "latex": r"y = x",
        "width": 50,
        "height": 25,
        "bg_color": "rgba(97, 97, 97, 0.1)",
        "text_color": line_color,
        "border_radius": "0.25rem",
    },
    # Point (1, e) label
    {
        "x": 1,
        "y": float(np.e + 0.3),
        "latex": r"(1, e)",
        "width": 50,
        "height": 25,
        "bg_color": "rgba(123, 31, 162, 0.9)",
        "text_color": "white",
        "border_radius": "0.25rem",
    },
    # Point (e, 1) label
    {
        "x": float(np.e),
        "y": 1.3,
        "latex": r"(e, 1)",
        "width": 50,
        "height": 25,
        "bg_color": "rgba(0, 105, 92, 0.9)",
        "text_color": "white",
        "border_radius": "0.25rem",
    },
    # Inverse relationship note
    {
        "x": 0.5,
        "y": -1.5,
        "latex": r"f^{-1}(f(x)) = x",
        "width": 120,
        "height": 30,
        "bg_color": "rgba(255, 193, 7, 0.2)",
        "text_color": "#f57f17",
        "border_radius": "0.5rem",
        "font_weight": "bold",
    },
    # e value
    {
        "x": -1.5,
        "y": -1.5,
        "latex": r"e \approx 2.718",
        "width": 100,
        "height": 25,
        "bg_color": "rgba(33, 33, 33, 0.1)",
        "text_color": "#212121",
        "border_radius": "0.25rem",
    },
]


def get_graph_dict():
    """Return the graph as a standardized dictionary."""
    return {
        "id": "graph13",
        "title": "Exponential and Logarithm Functions",
        "description": "Shows e^x and ln(x) as inverse functions reflected across y = x",
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
            "axes_color": "#424242",
        },
        "lines": lines,
        "foreign_objects": foreign_objects,
    }
