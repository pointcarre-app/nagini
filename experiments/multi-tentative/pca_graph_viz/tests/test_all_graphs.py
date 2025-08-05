#!/usr/bin/env python3
"""Quick sanity-check for **all** predefined graphs.

The goal is to guarantee that every `graph<n>.py` module returns a valid
Graph-Dict which can be converted to an SVG string without raising.

Run with:
    pytest -q pca_graph_viz/tests/test_all_graphs.py
or simply:
    python -m pca_graph_viz.tests.test_all_graphs
"""

import pytest

from pca_graph_viz import graph_from_dict
from pca_graph_viz.tests import get_all_graphs


@pytest.mark.parametrize("graph_id, graph_dict", get_all_graphs().items())
def test_graph_can_generate_svg(graph_id: str, graph_dict: dict) -> None:
    """Ensure each graph dict turns into an SVG string > 0 length."""
    svg = graph_from_dict(graph_dict)
    assert isinstance(svg, str) and svg.startswith("<svg"), f"{graph_id}: invalid SVG output"
    assert len(svg) > 100, f"{graph_id}: SVG too short"
