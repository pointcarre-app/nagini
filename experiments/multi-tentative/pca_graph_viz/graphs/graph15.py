import numpy as np

# Graph 15: Quadratic Functions - Vertex Form and Discriminant Analysis
# f(x) = 2(x - 1)² - 3 (vertex form)
# f(x) = 2x² - 4x - 1 (standard form)
x = np.linspace(-2, 4, 200)
y = 2 * (x - 1)**2 - 3

# Find roots using quadratic formula
# 2x² - 4x - 1 = 0
# a=2, b=-4, c=-1
# Δ = b² - 4ac = 16 - 4(2)(-1) = 16 + 8 = 24
# x = (4 ± √24) / 4 = (4 ± 2√6) / 4 = 1 ± √6/2
root1 = float(1 - np.sqrt(6)/2)
root2 = float(1 + np.sqrt(6)/2)

# Colors
bg_color = "#fff8e1"
grid_color = "#ffecb3"
curve_color = "#ff6f00"
vertex_color = "#d84315"
root_color = "#4caf50"
axis_color = "#424242"

# All visual elements in lines array
lines = [
    # The quadratic curve
    {
        "type": "curve",
        "id": "quadratic",
        "data": {"x": x.tolist(), "y": y.tolist()},
        "stroke": curve_color,
        "stroke-width": 2.5,
        "fill": "none",
        "class": "curve quadratic",
    },
    # X-axis
    {
        "type": "axis",
        "x1": -2,
        "y1": 0,
        "x2": 4,
        "y2": 0,
        "stroke": axis_color,
        "stroke-width": 2,
        "class": "axis x-axis",
    },
    # Y-axis
    {
        "type": "axis",
        "x1": 0,
        "y1": -4,
        "x2": 0,
        "y2": 8,
        "stroke": axis_color,
        "stroke-width": 2,
        "class": "axis y-axis",
    },
    # Vertex point (1, -3)
    {
        "type": "circle",
        "cx": 1,
        "cy": -3,
        "r": 4,
        "fill": vertex_color,
        "stroke": "#bf360c",
        "stroke-width": 2,
        "class": "vertex-point",
    },
    # Root 1
    {
        "type": "circle",
        "cx": root1,
        "cy": 0,
        "r": 3,
        "fill": root_color,
        "stroke": "#2e7d32",
        "stroke-width": 1.5,
        "class": "root-point",
    },
    # Root 2
    {
        "type": "circle",
        "cx": root2,
        "cy": 0,
        "r": 3,
        "fill": root_color,
        "stroke": "#2e7d32",
        "stroke-width": 1.5,
        "class": "root-point",
    },
    # Vertical line through vertex
    {
        "type": "line",
        "x1": 1,
        "y1": -4,
        "x2": 1,
        "y2": 8,
        "stroke": vertex_color,
        "stroke-width": 1.5,
        "stroke-dasharray": "5,3",
        "class": "axis-symmetry",
    },
    # Horizontal line through vertex
    {
        "type": "line",
        "x1": -2,
        "y1": -3,
        "x2": 4,
        "y2": -3,
        "stroke": vertex_color,
        "stroke-width": 1.5,
        "stroke-dasharray": "5,3",
        "class": "vertex-line",
    },
]

foreign_objects = [
    {
        "x": 0.2,
        "y": 7,
        "latex": r"f(x) = 2(x-1)^2 - 3",
        "width": 140,
        "height": 25,
        "bg_color": "rgba(255, 111, 0, 0.1)",
        "text_color": curve_color,
        "border_radius": "0.3rem",
    },
    {
        "x": 0.2,
        "y": 6.2,
        "latex": r"f(x) = 2x^2 - 4x - 1",
        "width": 130,
        "height": 25,
        "bg_color": "rgba(255, 111, 0, 0.1)",
        "text_color": curve_color,
        "border_radius": "0.3rem",
    },
    {
        "x": 1.2,
        "y": -2.5,
        "latex": r"V(1, -3)",
        "width": 70,
        "height": 20,
        "bg_color": "rgba(216, 67, 21, 0.1)",
        "text_color": vertex_color,
        "border_radius": "0.3rem",
    },
    {
        "x": root1 - 0.3,
        "y": 0.8,
        "latex": r"x_1",
        "width": 25,
        "height": 20,
        "bg_color": "rgba(76, 175, 80, 0.1)",
        "text_color": root_color,
        "border_radius": "0.3rem",
    },
    {
        "x": root2 - 0.3,
        "y": 0.8,
        "latex": r"x_2",
        "width": 25,
        "height": 20,
        "bg_color": "rgba(76, 175, 80, 0.1)",
        "text_color": root_color,
        "border_radius": "0.3rem",
    },
    {
        "x": 2.5,
        "y": 4,
        "latex": r"\Delta = 24 > 0",
        "width": 80,
        "height": 20,
        "bg_color": "rgba(76, 175, 80, 0.1)",
        "text_color": root_color,
        "border_radius": "0.3rem",
    },
    {
        "x": 2.5,
        "y": 3.2,
        "latex": r"2 \text{ racines}",
        "width": 70,
        "height": 20,
        "bg_color": "rgba(76, 175, 80, 0.1)",
        "text_color": root_color,
        "border_radius": "0.3rem",
    },
]

def get_graph_dict():
    """Return the graph dictionary for quadratic function analysis."""
    return {
        "lines": lines,
        "foreign_objects": foreign_objects,
        "svg": {
            "size": 400,
            "margin": 5,
            "bg_color": bg_color,
        },
        "settings": {
            "show_grid": False,
            "show_axes": False,
        },
    } 