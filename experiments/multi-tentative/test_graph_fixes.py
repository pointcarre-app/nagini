#!/usr/bin/env python3
"""Test the graph fixes for SVG space usage and LaTeX centering."""

import sys

sys.path.insert(0, ".")

from pca_graph_viz.graphs import graph1
from pca_graph_viz.core.svg_utils import graph_from_dict

# Get the graph dictionary
graph_dict = graph1.get_graph_dict()

# Generate the SVG
svg_string = graph_from_dict(graph_dict)

# Save to file (using local path since we're already in experiments/multi-tentative)
with open("test_graph1.svg", "w") as f:
    f.write(svg_string)

# Print some diagnostic info
print("Graph generated successfully!")
print(f"SVG size: {graph_dict['svg']['width']}x{graph_dict['svg']['height']}")
print(f"Number of foreign objects: {len(graph_dict['foreign_objects'])}")

# Check foreign object positions in the SVG
import re

fo_pattern = r'<foreignObject x="([^"]+)" y="([^"]+)" width="([^"]+)" height="([^"]+)"'
matches = re.findall(fo_pattern, svg_string)
print("\nForeign object positions:")
for i, (x, y, w, h) in enumerate(matches):
    print(f"  Object {i + 1}: x={x}, y={y}, width={w}, height={h}")
