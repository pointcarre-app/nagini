"""Core utilities for SVG generation and color processing."""

from .svg_utils import (
    graph_from_dict,
    dict_from_graph_params,
    create_svg_scene,
    create_svg,  # Alias for create_svg_scene
    create_multi_curve_svg,
    SVGScene,
    resolve_color,
    define_arrow_marker,
)

from .color_utils import oklch_to_hex

__all__ = [
    # SVG functions
    "graph_from_dict",
    "dict_from_graph_params",
    "create_svg_scene",
    "create_svg",  # Alias for create_svg_scene
    "create_multi_curve_svg",
    "SVGScene",
    "resolve_color",
    "define_arrow_marker",
    # Color functions
    "oklch_to_hex",
]
