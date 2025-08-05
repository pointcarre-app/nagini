"""
PCA Graph Visualization Package

A modular system for creating mathematical visualizations with embedded LaTeX annotations
using Pyodide, SVG, and KaTeX.
"""

__version__ = "0.1.0"

# Make key functions available at package level
from .core.svg_utils import (
    graph_from_dict,
    dict_from_graph_params,
    create_svg_scene,
    create_svg,  # Alias for create_svg_scene
    create_multi_curve_svg,
)

__all__ = [
    "graph_from_dict",
    "dict_from_graph_params",
    "create_svg_scene",
    "create_svg",  # Alias for create_svg_scene
    "create_multi_curve_svg",
]
