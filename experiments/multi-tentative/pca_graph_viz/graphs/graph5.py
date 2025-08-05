import numpy as np

# Graph 5: Parabola with lots of LaTeX
x = np.linspace(-5, 5, 100)
y = x**2 - 4 * x + 3

# All visual elements in lines array
lines = [
    # The parabola curve
    {
        "type": "curve",
        "id": "parabola",
        "data": {"x": x.tolist(), "y": y.tolist()},
        "stroke": "#4681ea",
        "stroke-width": 2,
        "fill": "none",
        "class": "curve parabola-curve",
    },
    # X-axis with arrow
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
    # Y-axis without arrow
    {
        "type": "axis",
        "x1": 0,
        "y1": -5,
        "x2": 0,
        "y2": 40,  # Adjusted for the parabola range
        "stroke": "#333333",
        "stroke-width": 2,
        "class": "axis y-axis no-arrow",  # no-arrow class prevents arrow
    },
]

foreign_objects = [
    {
        "x": 2,
        "y": -1,
        "latex": r"V(2,-1)",
        "width": 60,
        "height": 25,
        "bg_color": "rgba(236, 48, 89, 0.2)",
        "text_color": "#ec3059",
        "border_radius": "0.25rem",
        "show_point": True,
    },
    {
        "x": 1,
        "y": 0,
        "latex": r"x_1=1",
        "width": 50,
        "height": 25,
        "bg_color": "rgba(236, 48, 89, 0.2)",
        "text_color": "#ec3059",
        "border_radius": "0.25rem",
    },
    {
        "x": 3,
        "y": 0,
        "latex": r"x_2=3",
        "width": 50,
        "height": 25,
        "bg_color": "rgba(236, 48, 89, 0.2)",
        "text_color": "#ec3059",
        "border_radius": "0.25rem",
    },
    {
        "x": -2,
        "y": 15,
        "latex": r"y=x^2-4x+3",
        "width": 100,
        "height": 25,
        "bg_color": "rgba(70, 129, 234, 0.2)",
        "text_color": "#4681ea",
        "border_radius": "0.25rem",
    },
    {
        "x": 4,
        "y": 20,
        "latex": r"\Delta = b^2 - 4ac = 16 - 12 = 4",
        "bg_color": "rgba(48, 145, 16, 0.2)",
        "text_color": "#309110",
        "border_radius": "0.25rem",
        "width": 180,
        "height": 25,
    },
    {
        "x": 4,
        "y": 15,
        "latex": r"x = \frac{-b \pm \sqrt{\Delta}}{2a} = \frac{4 \pm 2}{2}",
        "bg_color": "rgba(48, 145, 16, 0.2)",
        "text_color": "#309110",
        "border_radius": "0.25rem",
        "width": 150,
        "height": 25,
    },
]


def get_graph_dict():
    """Return the graph as a standardized dictionary (V2 format - curves in lines)."""
    return {
        "id": "graph5",
        "title": "Parabola with LaTeX Annotations",
        "description": "Shows f(x) = x² - 4x + 3 with vertex and roots labeled",
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
