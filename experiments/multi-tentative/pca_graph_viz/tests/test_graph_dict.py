#!/usr/bin/env python3
"""
Quick test to verify the graph dict refactoring works correctly.
This can be run in Python to test the functions before browser integration.
"""

import json

import numpy as np


# Test the new functions
def test_graph_dict():
    # Import the new functions
    from pca_graph_viz.core.svg_utils import dict_from_graph_params, graph_from_dict

    # Create test data
    x = np.linspace(-2, 2, 50)
    y = x**2

    # Create test lines
    lines = [
        {
            "x1": -2,
            "y1": 0,
            "x2": 2,
            "y2": 0,
            "stroke": "#333333",
            "stroke_width": 2,
            "class": "axis x-axis",
            "type": "axis",
        }
    ]

    # Create test foreign objects
    foreign_objects = [
        {
            "x": 0,
            "y": 0,
            "latex": "f(0) = 0",
            "bg_color": "rgba(236, 48, 89, 0.2)",
            "text_color": "#ec3059",
            "show_point": True,
        }
    ]

    # Create graph dict
    graph_dict = dict_from_graph_params(
        x_data=x,
        y_data=y,
        size=340,
        lines=lines,
        foreign_objects=foreign_objects,
        title="Test Parabola",
        description="Testing the new dict-based system",
        graph_id="test_graph",
        show_axes=False,
        show_grid=True,
    )

    # Print the structure
    print("Graph Dict Structure:")
    print(json.dumps(graph_dict, indent=2))

    # Test that we can generate SVG from it
    try:
        svg_string = graph_from_dict(graph_dict)
        print(f"\nSVG generation successful! Length: {len(svg_string)} characters")
        print(f"SVG starts with: {svg_string[:100]}...")
        return True
    except Exception as e:
        print(f"\nError generating SVG: {e}")
        return False


# Test importing a real graph
def test_real_graph():
    try:
        from pca_graph_viz.tests.graphs.graph1 import get_graph_dict

        graph_dict = get_graph_dict()
        print("\nGraph1 dict loaded successfully!")
        print(f"Title: {graph_dict['title']}")
        print(f"ID: {graph_dict['id']}")
        print(f"Number of lines: {len(graph_dict['lines'])}")
        print(f"Number of foreign objects: {len(graph_dict['foreign_objects'])}")

        # Check that HTML attributes are correct
        if graph_dict["lines"]:
            first_line = graph_dict["lines"][0]
            if "stroke-width" in first_line:
                print("✓ HTML attributes correctly formatted (stroke-width)")
            else:
                print("✗ HTML attributes not formatted correctly")

        return True
    except Exception as e:
        print(f"\nError loading real graph: {e}")
        return False


if __name__ == "__main__":
    print("Testing Graph Dict Refactoring\n" + "=" * 40)

    # Run tests
    test1 = test_graph_dict()
    test2 = test_real_graph()

    if test1 and test2:
        print("\n✅ All tests passed!")
    else:
        print("\n❌ Some tests failed!")
