import numpy as np
from svg_utils import create_svg
from line_model import Line

# Example graph using Pydantic Line model
x = np.linspace(-2, 2, 100)
y = x**2  # Simple parabola

# Create axes using Pydantic model
x_axis = Line(
    x1=-2,
    y1=0,
    x2=2,
    y2=0,
    stroke="#2d3748",  # Dark grey
    stroke_width=2,
    class_="axis x-axis",
)

y_axis = Line(
    x1=0,
    y1=-0.5,
    x2=0,
    y2=4.5,  # Parabola goes from 0 to 4
    stroke="#2d3748",  # Dark grey
    stroke_width=2,
    class_="axis y-axis",
)

# Add grid lines
grid_lines = []
for i in range(-2, 3):
    if i != 0:  # Skip the axis lines
        # Vertical grid lines
        grid_lines.append(
            Line(
                x1=i,
                y1=-0.5,
                x2=i,
                y2=4.5,
                stroke="#e2e8f0",
                stroke_width=0.5,
                stroke_opacity=0.5,
                class_="grid vertical",
            )
        )

for i in range(0, 5):
    if i != 0:  # Skip the axis line
        # Horizontal grid lines
        grid_lines.append(
            Line(
                x1=-2,
                y1=i,
                x2=2,
                y2=i,
                stroke="#e2e8f0",
                stroke_width=0.5,
                stroke_opacity=0.5,
                class_="grid horizontal",
            )
        )

# Convert Pydantic models to dicts for SVG function
lines = [
    x_axis.dict(by_alias=True),
    y_axis.dict(by_alias=True),
] + [line.dict(by_alias=True) for line in grid_lines]

# Create the SVG
svg_output = create_svg(
    x_data=x,
    y_data=y,
    size=335,
    bg_color="#ffffff",
    curve_color="#6366f1",  # Indigo
    lines=lines,
    show_axes=False,  # We're providing our own axes
    show_grid=False,  # We're providing our own grid
)
