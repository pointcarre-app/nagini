"""Graphs subpackage living *inside* tests.

All `graphN.py` modules (1 ≤ N ≤ 17) are now stored here.  To keep backward
compatibility with the historical import path `pca_graph_viz.graphs`, we
register ourselves and each individual graph module under the old names in
`sys.modules`.

That means **both** of these work:

```python
from pca_graph_viz.tests.graphs import graph3
from pca_graph_viz.graphs import graph3  # legacy, still valid
```

`get_all_graphs()` returns a dictionary mapping ``"graphN"`` → graph dict for
convenient iteration.
"""

import sys
from importlib import import_module
from types import ModuleType
from typing import Dict

# Import individual graph modules directly
from . import (
    graph1,
    graph2,
    graph3,
    graph4,
    graph5,
    graph6,
    graph7,
    graph8,
    graph9,
    graph10,
    graph11,
    graph12,
    graph13,
    graph14,
    graph15,
    graph16,
    graph17,
)

# ---------------------------------------------------------------------------
# Public helpers
# ---------------------------------------------------------------------------
_GRAPH_NUMBERS = range(1, 18)  # graph1 .. graph17
__all__ = [f"graph{n}" for n in _GRAPH_NUMBERS] + ["get_all_graphs"]

# Make *this* package visible as the legacy "pca_graph_viz.graphs" package
sys.modules.setdefault("pca_graph_viz.graphs", sys.modules[__name__])

# Register legacy aliases for each graph module
for n in _GRAPH_NUMBERS:
    # Get the module from our local imports
    mod = globals()[f"graph{n}"]

    # Legacy alias (old path)
    legacy_name = f"pca_graph_viz.graphs.graph{n}"
    sys.modules[legacy_name] = mod


def get_all_graphs() -> Dict[str, dict]:
    """Return dict: {'graph1': {...}, ..., 'graph17': {...}}"""
    return {f"graph{n}": globals()[f"graph{n}"].get_graph_dict() for n in _GRAPH_NUMBERS}
