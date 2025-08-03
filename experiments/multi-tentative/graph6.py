import numpy as np
from svg_utils import create_svg

# Graph 2: Simple sine
x = np.linspace(-5, 5, 100)
y = np.sin(x)

# Lines (including axes)
lines = [
    # X-axis
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
    # Y-axis
    {
        "x1": 0,
        "y1": -1.5,  # Sine wave range is [-1, 1], adding some padding
        "x2": 0,
        "y2": 1.5,
        "stroke": "#333333",  # Dark grey
        "stroke_width": 2,
        "class": "axis y-axis",
        "type": "axis",  # Add arrow
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

# Final SVG output
svg_output_6 = create_svg(
    x_data=x,
    y_data=y,
    size=340,
    foreign_objects=foreign_objects,
    lines=lines,
    show_axes=False,  # Disable automatic axes since we're defining them in lines
)
