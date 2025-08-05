import numpy as np

# Graph 16: Probability Distribution and Expected Value
# Discrete probability distribution: X = {1, 2, 3, 4, 5, 6}
# P(X=1) = 0.1, P(X=2) = 0.15, P(X=3) = 0.2, P(X=4) = 0.25, P(X=5) = 0.2, P(X=6) = 0.1

# Values and probabilities
x_values = [1, 2, 3, 4, 5, 6]
probabilities = [0.1, 0.15, 0.2, 0.25, 0.2, 0.1]

# Calculate expected value: E[X] = Σ x_i * P(X=x_i)
expected_value = float(sum(x * p for x, p in zip(x_values, probabilities)))

# Colors
bg_color = "#f3e5f5"
grid_color = "#e1bee7"
bar_color = "#9c27b0"
expected_color = "#f44336"
axis_color = "#424242"

# All visual elements in lines array
lines = [
    # X-axis
    {
        "type": "axis",
        "x1": 0.5,
        "y1": 0,
        "x2": 6.5,
        "y2": 0,
        "stroke": axis_color,
        "stroke-width": 2,
        "class": "axis x-axis",
    },
    # Y-axis
    {
        "type": "axis",
        "x1": 0,
        "y1": -0.02,
        "x2": 0,
        "y2": 0.3,
        "stroke": axis_color,
        "stroke-width": 2,
        "class": "axis y-axis",
    },
    # Grid lines
    {
        "type": "line",
        "x1": 0.5,
        "y1": 0.1,
        "x2": 6.5,
        "y2": 0.1,
        "stroke": grid_color,
        "stroke-width": 1,
        "stroke-dasharray": "2,2",
        "class": "grid-line",
    },
    {
        "type": "line",
        "x1": 0.5,
        "y1": 0.2,
        "x2": 6.5,
        "y2": 0.2,
        "stroke": grid_color,
        "stroke-width": 1,
        "stroke-dasharray": "2,2",
        "class": "grid-line",
    },
    {
        "type": "line",
        "x1": 0.5,
        "y1": 0.3,
        "x2": 6.5,
        "y2": 0.3,
        "stroke": grid_color,
        "stroke-width": 1,
        "stroke-dasharray": "2,2",
        "class": "grid-line",
    },
]

# Add probability bars
for i, (x, p) in enumerate(zip(x_values, probabilities)):
    # Bar rectangle
    lines.append({
        "type": "path",
        "d": f"M {x-0.3} 0 L {x-0.3} {p} L {x+0.3} {p} L {x+0.3} 0 Z",
        "fill": bar_color,
        "fill-opacity": "0.7",
        "stroke": "#7b1fa2",
        "stroke-width": 1.5,
        "class": "probability-bar",
    })

# Expected value line
lines.append({
    "type": "line",
    "x1": expected_value,
    "y1": 0,
    "x2": expected_value,
    "y2": 0.28,
    "stroke": expected_color,
    "stroke-width": 3,
    "stroke-dasharray": "5,3",
    "class": "expected-value-line",
})

foreign_objects = [
    {
        "x": 0.2,
        "y": 0.25,
        "latex": r"P(X = x)",
        "width": 80,
        "height": 20,
        "bg_color": "rgba(156, 39, 176, 0.1)",
        "text_color": bar_color,
        "border_radius": "0.3rem",
    },
    {
        "x": expected_value - 0.4,
        "y": 0.3,
        "latex": r"E[X]",
        "width": 40,
        "height": 20,
        "bg_color": "rgba(244, 67, 54, 0.1)",
        "text_color": expected_color,
        "border_radius": "0.3rem",
    },
    {
        "x": 1.5,
        "y": 0.35,
        "latex": r"E[X] = 3.45",
        "width": 90,
        "height": 20,
        "bg_color": "rgba(244, 67, 54, 0.1)",
        "text_color": expected_color,
        "border_radius": "0.3rem",
    },
    {
        "x": 4.5,
        "y": 0.35,
        "latex": r"\sum P(X) = 1",
        "width": 90,
        "height": 20,
        "bg_color": "rgba(156, 39, 176, 0.1)",
        "text_color": bar_color,
        "border_radius": "0.3rem",
    },
    # Probability values on bars
    {
        "x": 1 - 0.2,
        "y": 0.12,
        "latex": r"0.1",
        "width": 30,
        "height": 15,
        "bg_color": "rgba(156, 39, 176, 0.1)",
        "text_color": bar_color,
        "border_radius": "0.2rem",
    },
    {
        "x": 2 - 0.2,
        "y": 0.17,
        "latex": r"0.15",
        "width": 35,
        "height": 15,
        "bg_color": "rgba(156, 39, 176, 0.1)",
        "text_color": bar_color,
        "border_radius": "0.2rem",
    },
    {
        "x": 3 - 0.2,
        "y": 0.22,
        "latex": r"0.2",
        "width": 30,
        "height": 15,
        "bg_color": "rgba(156, 39, 176, 0.1)",
        "text_color": bar_color,
        "border_radius": "0.2rem",
    },
    {
        "x": 4 - 0.2,
        "y": 0.27,
        "latex": r"0.25",
        "width": 35,
        "height": 15,
        "bg_color": "rgba(156, 39, 176, 0.1)",
        "text_color": bar_color,
        "border_radius": "0.2rem",
    },
    {
        "x": 5 - 0.2,
        "y": 0.22,
        "latex": r"0.2",
        "width": 30,
        "height": 15,
        "bg_color": "rgba(156, 39, 176, 0.1)",
        "text_color": bar_color,
        "border_radius": "0.2rem",
    },
    {
        "x": 6 - 0.2,
        "y": 0.12,
        "latex": r"0.1",
        "width": 30,
        "height": 15,
        "bg_color": "rgba(156, 39, 176, 0.1)",
        "text_color": bar_color,
        "border_radius": "0.2rem",
    },
]

def get_graph_dict():
    """Return the graph dictionary for probability distribution."""
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