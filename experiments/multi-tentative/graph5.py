import numpy as np
from svg_utils import create_svg

# Graph 1: Parabola with lots of LaTeX
x = np.linspace(-5, 5, 100)
y = x**2 - 4 * x + 3

# Lines (including axes)
lines = [
    # X-axis with arrow
    {
        "x1": -5,
        "y1": 0,
        "x2": 5,
        "y2": 0,
        "stroke": "#333333",  # Dark grey
        "stroke_width": 2,
        "class": "axis x-axis",
        "type": "axis",  # Add arrow
    },
    # Y-axis without arrow (demonstrating no-arrow class)
    {
        "x1": 0,
        "y1": -5,
        "x2": 0,
        "y2": 40,  # Adjusted for the parabola range
        "stroke": "#333333",  # Dark grey
        "stroke_width": 2,
        "class": "axis y-axis no-arrow",  # no-arrow class prevents arrow
        "type": "axis",  # Still marked as axis but no arrow due to class
    },
]

foreign_objects = [
    {
        "x": 2,
        "y": -1,
        "latex": r"V(2,-1)",
        "bg_color": "rgba(236, 48, 89, 0.2)",
        "text_color": "#ec3059",
        "border_radius": "0.25rem",
        "show_point": True,
    },
    {
        "x": 1,
        "y": 0,
        "latex": r"x_1=1",
        "bg_color": "rgba(236, 48, 89, 0.2)",
        "text_color": "#ec3059",
        "border_radius": "0.25rem",
        "show_point": True,
    },
    {
        "x": 3,
        "y": 0,
        "latex": r"x_2=3",
        "bg_color": "rgba(236, 48, 89, 0.2)",
        "text_color": "#ec3059",
        "border_radius": "0.25rem",
        "show_point": True,
    },
    {
        "x": 0,
        "y": 3,
        "latex": r"f(0)=3",
        "bg_color": "rgba(236, 48, 89, 0.2)",
        "text_color": "#ec3059",
        "border_radius": "0.25rem",
        "show_point": True,
    },
    {
        "x": -2,
        "y": 15,
        "latex": r"f(x)=x^2-4x+3",
        "bg_color": "rgba(48, 145, 16, 0.2)",
        "text_color": "#309110",
        "border_radius": "0.25rem",
    },
    {"x": 4, "y": 3, "latex": r"\\Delta=4"},
    {"x": -3, "y": 24, "latex": r"a=1>0"},
    {"x": 4.5, "y": 8, "latex": r"\\uparrow"},
    {"x": -4, "y": 35, "latex": r"\\text{Domain: }\\mathbb{R}"},
    {"x": 4.5, "y": 20, "latex": r"\\lim_{x\\to\\infty}f(x)=+\\infty"},
    {
        "x": -1,
        "y": -0.5,
        "latex": r"f'(x)=2x-4",
        "bg_color": "rgba(48, 145, 16, 0.2)",
        "text_color": "#309110",
        "border_radius": "0.25rem",
    },
    {"x": 2, "y": -2.5, "latex": r"f'(2)=0"},
    {
        "x": -2.5,
        "y": 5,
        "latex": r"\\int f(x)dx=\\frac{x^3}{3}-2x^2+3x+C",
        "width": 180,
        "height": 30,
        "bg_color": "rgba(48, 145, 16, 0.2)",
        "text_color": "#309110",
        "border_radius": "0.25rem",
    },
]

# Final SVG output
svg_output_5 = create_svg(
    x_data=x,
    y_data=y,
    size=340,
    foreign_objects=foreign_objects,
    lines=lines,
    show_axes=False,  # Disable automatic axes since we're defining them in lines
)
