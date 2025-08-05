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

from importlib import import_module
import sys
from types import ModuleType
from typing import Dict

# ---------------------------------------------------------------------------
# Public helpers
# ---------------------------------------------------------------------------
_GRAPH_NUMBERS = range(1, 18)  # graph1 .. graph17
__all__ = [f"graph{n}" for n in _GRAPH_NUMBERS] + ["get_all_graphs"]

# Make *this* package visible as the legacy "pca_graph_viz.graphs" package
sys.modules.setdefault("pca_graph_viz.graphs", sys.modules[__name__])

# Import all graph modules and register legacy aliases
for n in _GRAPH_NUMBERS:
    # Import from the actual graphs location
    mod: ModuleType = import_module(f"pca_graph_viz.graphs.graph{n}")

    # Expose as attribute for `from ... import graphN`
    globals()[f"graph{n}"] = mod  # type: ignore[assignment]

    # Legacy alias (old path)
    legacy_name = f"pca_graph_viz.graphs.graph{n}"
    sys.modules[legacy_name] = mod


def get_all_graphs() -> Dict[str, dict]:
    """Return dict: {'graph1': {...}, ..., 'graph17': {...}}"""
    return {f"graph{n}": globals()[f"graph{n}"].get_graph_dict() for n in _GRAPH_NUMBERS}
