#!/usr/bin/env python3
import sys

sys.path.append(".")

# Test SVG arrow generation
from svg_utils import create_svg
import numpy as np

# Create simple test data
x = np.linspace(-1, 1, 10)
y = x

# Define axes with type="axis"
lines = [
    {
        "x1": -1,
        "y1": 0,
        "x2": 1,
        "y2": 0,
        "stroke": "#ff0000",
        "stroke_width": 3,
        "class": "axis x-axis",
        "type": "axis",
    },
    {
        "x1": 0,
        "y1": -1,
        "x2": 0,
        "y2": 1,
        "stroke": "#0000ff",
        "stroke_width": 3,
        "class": "axis y-axis",
        "type": "axis",
    },
]

# Create SVG
svg_output = create_svg(
    x_data=x, y_data=y, size=200, lines=lines, show_axes=False, show_grid=False, bg_color="#ffffff"
)

# Save to file
with open("test_output.svg", "w") as f:
    f.write(svg_output)

print("SVG saved to test_output.svg")
print("\nChecking SVG content:")
print("- Has marker definition:", '<marker id="arrow"' in svg_output)
print("- Has marker-end attributes:", 'marker-end="url(#arrow)"' in svg_output)
print("- Number of marker-end attributes:", svg_output.count('marker-end="url(#arrow)"'))

# Check specific lines
import re

axis_lines = re.findall(r'<line[^>]*class="[^"]*axis[^"]*"[^>]*>', svg_output)
print(f"\nFound {len(axis_lines)} axis lines:")
for i, line in enumerate(axis_lines):
    print(f"  Line {i + 1}: {'HAS' if 'marker-end' in line else 'MISSING'} arrow")
