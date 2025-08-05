import numpy as np

# Graph 10: Tangent Line to Parabola - Teaching Derivatives
x = np.linspace(-3, 3, 100)
y_parabola = x**2
x_tangent = 1.5  # Point of tangency
y_tangent = x_tangent**2
slope = 2 * x_tangent  # Derivative at x=1.5

# Tangent line equation: y - y0 = m(x - x0)
x_tangent_line = np.linspace(-1, 3, 50)
y_tangent_line = slope * (x_tangent_line - x_tangent) + y_tangent

# Colors
bg_color = "#fef3e2"
grid_color = "#f5d5a8"
curve_color = "#e91e63"
tangent_color = "#4caf50"

# All visual elements in lines array
lines = [
    # The parabola
    {
        "type": "curve",
        "id": "parabola",
        "data": {"x": x.tolist(), "y": y_parabola.tolist()},
        "stroke": curve_color,
        "stroke-width": 2.5,
        "fill": "none",
        "class": "curve parabola",
    },
    # The tangent line
    {
        "type": "curve",
        "id": "tangent",
        "data": {"x": x_tangent_line.tolist(), "y": y_tangent_line.tolist()},
        "stroke": tangent_color,
        "stroke-width": 2,
        "stroke-dasharray": "5,3",
        "fill": "none",
        "class": "curve tangent-line",
    },
    # X-axis
    {
        "type": "axis",
        "x1": -3,
        "y1": 0,
        "x2": 3,
        "y2": 0,
        "stroke": "#424242",
        "stroke-width": 2,
        "class": "axis x-axis",
    },
    # Y-axis
    {
        "type": "axis",
        "x1": 0,
        "y1": -1,
        "x2": 0,
        "y2": 9,
        "stroke": "#424242",
        "stroke-width": 2,
        "class": "axis y-axis",
    },
    # Point of tangency
    {
        "type": "circle",
        "cx": float(x_tangent),
        "cy": float(y_tangent),
        "r": 4,
        "fill": "#ff5722",
        "stroke": "#d84315",
        "stroke-width": 2,
        "class": "tangent-point",
    },
]

foreign_objects = [
    {
        "x": 0,
        "y": 8.5,
        "latex": r"f(x) = x^2",
        "width": 80,
        "height": 30,
        "bg_color": "rgba(233, 30, 99, 0.1)",
        "text_color": curve_color,
        "border_radius": "0.5rem",
    },
    {
        "x": 2.5,
        "y": 5,
        "latex": r"f'(x) = 2x",
        "width": 90,
        "height": 30,
        "bg_color": "rgba(76, 175, 80, 0.1)",
        "text_color": tangent_color,
        "border_radius": "0.5rem",
    },
    {
        "x": float(x_tangent),
        "y": float(y_tangent + 0.7),
        "latex": rf"({float(x_tangent)}, {float(y_tangent):.2f})",
        "width": 70,
        "height": 25,
        "bg_color": "rgba(255, 87, 34, 0.9)",
        "text_color": "white",
        "border_radius": "0.25rem",
        "font_weight": "bold",
    },
    {
        "x": -1.5,
        "y": 6,
        "latex": rf"\text{{Slope}} = {float(slope)}",
        "width": 100,
        "height": 30,
        "bg_color": "rgba(76, 175, 80, 0.15)",
        "text_color": "#2e7d32",
        "border_radius": "0.5rem",
    },
]


def get_graph_dict():
    """Return the graph as a standardized dictionary."""
    return {
        "id": "graph10",
        "title": "Tangent Line to Parabola",
        "description": "Demonstrates the concept of derivatives with a tangent line to f(x) = x²",
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
