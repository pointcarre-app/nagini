#!/usr/bin/env python3
"""
Example usage of the PCA Graph Visualization package.
This demonstrates how to use the package to generate graphs.
"""

from pca_graph_viz import graph_from_dict
from pca_graph_viz.graphs import get_all_graphs


def main():
    """Demonstrate package usage."""
    print("PCA Graph Visualization Package - Example Usage\n")

    # Get all available graphs
    all_graphs = get_all_graphs()

    print(f"Available graphs: {list(all_graphs.keys())}\n")

    # Example 1: Get and display info about graph5
    graph5 = all_graphs["graph5"]
    print("Graph 5 Information:")
    print(f"  Title: {graph5['title']}")
    print(f"  Description: {graph5['description']}")
    print(f"  Number of annotations: {len(graph5['foreign_objects'])}")
    print(f"  Data points: {len(graph5['data']['x'])}\n")

    # Example 2: Generate SVG from a graph
    svg_string = graph_from_dict(graph5)
    print(f"Generated SVG (first 200 chars):\n{svg_string[:200]}...\n")

    # Example 3: Create a custom graph
    import numpy as np
    from pca_graph_viz import dict_from_graph_params

    # Simple sine wave
    x = np.linspace(0, 2 * np.pi, 50)
    y = np.sin(x)

    custom_graph = dict_from_graph_params(
        x_data=x,
        y_data=y,
        size=340,
        title="Custom Sine Wave",
        description="A simple sine wave from 0 to 2π",
        graph_id="custom_sine",
        lines=[
            {
                "x1": 0,
                "y1": 0,
                "x2": 2 * np.pi,
                "y2": 0,
                "stroke": "#666666",
                "stroke_width": 1,
                "class": "axis x-axis",
                "type": "axis",
            }
        ],
    )

    print("Custom graph created:")
    print(f"  Title: {custom_graph['title']}")
    print(
        f"  Data range: x=[{min(custom_graph['data']['x']):.2f}, {max(custom_graph['data']['x']):.2f}]"
    )

    # Generate SVG for custom graph
    custom_svg = graph_from_dict(custom_graph)
    print(f"\nCustom SVG generated successfully! Length: {len(custom_svg)} characters")

    # Example 4: Export graph as JSON
    import json

    json_str = json.dumps(custom_graph, indent=2)
    print(f"\nGraph as JSON (first 300 chars):\n{json_str[:300]}...")


if __name__ == "__main__":
    main()
