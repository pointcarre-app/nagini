"""Proxy module that exposes graph dictionaries from the original
`pca_graph_viz.graphs` package while living under `pca_graph_viz.tests`.

This lets test-specific code reference the graphs via
`pca_graph_viz.tests` instead of `pca_graph_viz.graphs` without actually
copying the ~17 graph definition files.
"""

from importlib import import_module
from types import ModuleType
from typing import Dict

_GRAPH_NUMBERS = list(range(1, 18))  # graph1 .. graph17


def _load_graph_module(n: int) -> ModuleType:
    """Import and return the aliased `graph<n>` module from tests.graphs."""
    return import_module(f"pca_graph_viz.tests.graphs.graph{n}")


# Dynamically create get_graph<n>_dict functions
for _n in _GRAPH_NUMBERS:
    _mod = _load_graph_module(_n)
    globals()[f"get_graph{_n}_dict"] = _mod.get_graph_dict  # type: ignore[attr-defined]
    __all__ = globals().get("__all__", [])
    __all__.append(f"get_graph{_n}_dict")


def get_all_graphs() -> Dict[str, dict]:
    """Return a dict with keys 'graph1' .. 'graph17' and their dictionaries."""
    return {f"graph{n}": globals()[f"get_graph{n}_dict"]() for n in _GRAPH_NUMBERS}


# Expose helper in __all__
__all__.append("get_all_graphs")
