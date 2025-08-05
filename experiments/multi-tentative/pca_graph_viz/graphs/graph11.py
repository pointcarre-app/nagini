import numpy as np

# Graph 11: Area Under Curve - Teaching Integration
x = np.linspace(-1, 4, 200)
y = 0.5 * x**2 + 1  # f(x) = 0.5x² + 1

# Define integration bounds
a, b = 0.5, 2.5
x_fill = np.linspace(a, b, 100)
y_fill = 0.5 * x_fill**2 + 1

# Create polygon points for the filled area
polygon_points = [(a, 0)]  # Start at bottom left
for i in range(len(x_fill)):
    polygon_points.append((x_fill[i], y_fill[i]))
polygon_points.append((b, 0))  # End at bottom right

# Convert to SVG path data
path_data = f"M {a} 0 "
for i in range(len(x_fill)):
    path_data += f"L {x_fill[i]} {y_fill[i]} "
path_data += f"L {b} 0 Z"

# Colors
bg_color = "#f0f4f8"
grid_color = "#d2dce6"
curve_color = "#3f51b5"
area_color = "#7986cb"

# All visual elements in lines array
lines = [
    # The filled area (must come before the curve for proper layering)
    {
        "type": "path",
        "d": path_data,
        "fill": area_color,
        "fill-opacity": "0.3",
        "stroke": area_color,
        "stroke-width": 2,
        "class": "integral-area",
    },
    # The curve
    {
        "type": "curve",
        "id": "quadratic",
        "data": {"x": x.tolist(), "y": y.tolist()},
        "stroke": curve_color,
        "stroke-width": 2.5,
        "fill": "none",
        "class": "curve quadratic",
    },
    # Vertical line at x = a
    {
        "type": "line",
        "x1": a,
        "y1": 0,
        "x2": a,
        "y2": 0.5 * a**2 + 1,
        "stroke": area_color,
        "stroke-width": 2,
        "stroke-dasharray": "3,3",
        "class": "bound-line",
    },
    # Vertical line at x = b
    {
        "type": "line",
        "x1": b,
        "y1": 0,
        "x2": b,
        "y2": 0.5 * b**2 + 1,
        "stroke": area_color,
        "stroke-width": 2,
        "stroke-dasharray": "3,3",
        "class": "bound-line",
    },
    # X-axis
    {
        "type": "axis",
        "x1": -1,
        "y1": 0,
        "x2": 4,
        "y2": 0,
        "stroke": "#37474f",
        "stroke-width": 2,
        "class": "axis x-axis",
    },
    # Y-axis
    {
        "type": "axis",
        "x1": 0,
        "y1": -0.5,
        "x2": 0,
        "y2": 5,
        "stroke": "#37474f",
        "stroke-width": 2,
        "class": "axis y-axis",
    },
]

# Calculate the definite integral value
integral_value = (1 / 6 * b**3 + b) - (1 / 6 * a**3 + a)

foreign_objects = [
    {
        "x": 1.5,
        "y": 4.5,
        "latex": r"f(x) = \frac{1}{2}x^2 + 1",
        "width": 120,
        "height": 35,
        "bg_color": "rgba(63, 81, 181, 0.1)",
        "text_color": curve_color,
        "border_radius": "0.5rem",
    },
    {
        "x": 1.5,
        "y": 1.5,
        "latex": rf"\int_{{{a}}}^{{{b}}} f(x)\,dx",
        "width": 100,
        "height": 40,
        "bg_color": "rgba(121, 134, 203, 0.2)",
        "text_color": "#5c6bc0",
        "border_radius": "0.5rem",
        "font_weight": "bold",
    },
    {
        "x": 3,
        "y": 2.5,
        "latex": rf"= {integral_value:.2f}",
        "width": 70,
        "height": 30,
        "bg_color": "rgba(121, 134, 203, 0.15)",
        "text_color": "#5c6bc0",
        "border_radius": "0.25rem",
    },
    {
        "x": a,
        "y": -0.4,
        "latex": "a",
        "width": 20,
        "height": 20,
        "text_color": area_color,
        "font_weight": "bold",
    },
    {
        "x": b,
        "y": -0.4,
        "latex": "b",
        "width": 20,
        "height": 20,
        "text_color": area_color,
        "font_weight": "bold",
    },
]


def get_graph_dict():
    """Return the graph as a standardized dictionary."""
    return {
        "id": "graph11",
        "title": "Definite Integral Visualization",
        "description": "Shows the area under the curve f(x) = 0.5x² + 1 from a to b",
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
            "axes_color": "#37474f",
        },
        "lines": lines,
        "foreign_objects": foreign_objects,
    }
