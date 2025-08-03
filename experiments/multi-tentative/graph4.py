import numpy as np
from svg_utils import create_multi_curve_svg

# Graph 4: Identity and Minus Identity on [-4, 4]
x = np.linspace(-4, 4, 100)
y_identity = x  # y = x
y_minus_identity = -x  # y = -x

# Use nice hex colors directly - fourth variant
bg_color = "#f0e9d8"  # Very light yellow-grey
grid_color = "#dcc9a3"  # Light yellow-grey
curve1_color = "#5eadef"  # Cyan-blue
curve2_color = "#ec4899"  # Pink

# Lines (including axes)
lines = [
    # X-axis
    {
        "x1": -4,
        "y1": 0,
        "x2": 4,
        "y2": 0,
        "stroke": "#1f1b14",  # Almost black with yellow tint
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
        "stroke": "#1f1b14",  # Almost black with yellow tint
        "stroke_width": 2,
        "class": "axis y-axis",
        "type": "axis",  # Add arrow
    },
]

foreign_objects = [
    {
        "x": 1,
        "y": 1,
        "latex": r"x",
        "width": 20,
        "height": 20,
        "bg_color": "rgba(214, 129, 12, 0.2)",
        "text_color": "#d6810c",
        "border_radius": "0.25rem",
    },
    {
        "x": 2,
        "y": 2,
        "latex": r"x",
        "width": 20,
        "height": 20,
        "bg_color": "rgba(214, 129, 12, 0.2)",
        "text_color": "#d6810c",
        "border_radius": "0.25rem",
    },
    {
        "x": 3,
        "y": 3,
        "latex": r"x",
        "width": 20,
        "height": 20,
        "bg_color": "rgba(214, 129, 12, 0.2)",
        "text_color": "#d6810c",
        "border_radius": "0.25rem",
    },
]

# Final SVG output
svg_output_4 = create_multi_curve_svg(
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
