import numpy as np
from svg_utils import create_svg

# Graph 3: Exponential (Gaussian curve)
x = np.linspace(-5, 5, 100)
y = np.exp(-(x**2) / 4)

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
        "y1": -0.2,  # Gaussian peaks at 1, adding some padding
        "x2": 0,
        "y2": 1.2,
        "stroke": "#333333",  # Dark grey
        "stroke_width": 2,
        "class": "axis y-axis",
        "type": "axis",  # Add arrow
    },
]

# Ready for LaTeX annotations - some ideas:
# - Peak at (0, 1)
# - Standard deviation points
# - Integral formula
# - e^{-x^2/4} formula
foreign_objects = None  # No annotations yet

# Final SVG output
svg_output_7 = create_svg(
    x_data=x,
    y_data=y,
    size=340,
    foreign_objects=foreign_objects,
    lines=lines,
    show_axes=False,  # Disable automatic axes since we're defining them in lines
)
