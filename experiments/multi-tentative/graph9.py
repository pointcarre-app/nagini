import numpy as np
from svg_utils import create_svg

# Graph 9: Circle (parametric)
t = np.linspace(0, 2 * np.pi, 100)
x = 3 * np.cos(t)
y = 3 * np.sin(t)

# Lines (including axes)
lines = [
    # X-axis
    {
        "x1": -4,  # Circle radius is 3, adding some padding
        "y1": 0,
        "x2": 4,
        "y2": 0,
        "stroke": "#333333",  # Dark grey
        "stroke_width": 2,
        "class": "axis x-axis",
        "type": "axis",  # Add arrow
    },
    # Y-axis
    {
        "x1": 0,
        "y1": -4,
        "x2": 0,
        "y2": 4,
        "stroke": "#333333",  # Dark grey
        "stroke_width": 2,
        "class": "axis y-axis",
        "type": "axis",  # Add arrow
    },
]

# Draw circle with light grey background
svg_output_9 = create_svg(
    x_data=x,
    y_data=y,
    size=340,
    bg_color="#e8e8e8",
    lines=lines,
    show_axes=False,  # Disable automatic axes since we're defining them in lines
)
