import numpy as np
from svg_utils import create_multi_curve_svg

# Graph 2: Identity and Minus Identity on [-2, 2]
x = np.linspace(-2, 2, 100)
y_identity = x  # y = x
y_minus_identity = -x  # y = -x

# Use nice hex colors directly - different from graph1
bg_color = "#f4f1e8"  # Very light warm grey
grid_color = "#e0d9c6"  # Light warm grey
curve1_color = "#4681ea"  # Blue
curve2_color = "#ea5545"  # Red

# Lines (including axes)
lines = [
    # X-axis
    {
        "x1": -2,
        "y1": 0,
        "x2": 2,
        "y2": 0,
        "stroke": "#342f26",  # Dark warm grey
        "stroke_width": 2,
        "class": "axis x-axis",
        "type": "axis",  # Add arrow to axis
    },
    # Y-axis
    {
        "x1": 0,
        "y1": -2,
        "x2": 0,
        "y2": 2,
        "stroke": "#342f26",  # Dark warm grey
        "stroke_width": 2,
        "class": "axis y-axis",
        "type": "axis",  # Add arrow to axis
    },
]

foreign_objects = [
    {
        "x": 1,
        "y": 1,
        "latex": r"x",
        "width": 20,
        "height": 20,
        "style": "background-color: rgba(0, 133, 192, 0.2); color: #0085c0; border-radius: 0.25rem",
    },
    {
        "x": 2,
        "y": 2,
        "latex": r"x",
        "width": 20,
        "height": 20,
        "style": "background-color: rgba(0, 133, 192, 0.2); color: #0085c0; border-radius: 0.25rem",
    },
]

# Final SVG output
svg_output_2 = create_multi_curve_svg(
    x_data=x,
    y_data_list=[y_identity, y_minus_identity],
    size=340,
    colors=[curve1_color, curve2_color],
    bg_color=bg_color,
    grid_color=grid_color,
    foreign_objects=foreign_objects,
    lines=lines,
    show_axes=False,  # Disable automatic axes since we're defining them in lines
)
