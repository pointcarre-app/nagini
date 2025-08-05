"""Pre-defined mathematical graphs with LaTeX annotations."""

# Import the get_graph_dict function from each graph module
from .graph1 import get_graph_dict as get_graph1_dict
from .graph2 import get_graph_dict as get_graph2_dict
from .graph3 import get_graph_dict as get_graph3_dict
from .graph4 import get_graph_dict as get_graph4_dict
from .graph5 import get_graph_dict as get_graph5_dict
from .graph6 import get_graph_dict as get_graph6_dict
from .graph7 import get_graph_dict as get_graph7_dict
from .graph8 import get_graph_dict as get_graph8_dict
from .graph9 import get_graph_dict as get_graph9_dict
from .graph10 import get_graph_dict as get_graph10_dict
from .graph11 import get_graph_dict as get_graph11_dict
from .graph12 import get_graph_dict as get_graph12_dict
from .graph13 import get_graph_dict as get_graph13_dict
from .graph14 import get_graph_dict as get_graph14_dict
from .graph15 import get_graph_dict as get_graph15_dict
from .graph16 import get_graph_dict as get_graph16_dict
from .graph17 import get_graph_dict as get_graph17_dict


# Convenience function to get all graphs
def get_all_graphs():
    """Return a dictionary of all available graphs."""
    return {
        "graph1": get_graph1_dict(),
        "graph2": get_graph2_dict(),
        "graph3": get_graph3_dict(),
        "graph4": get_graph4_dict(),
        "graph5": get_graph5_dict(),
        "graph6": get_graph6_dict(),
        "graph7": get_graph7_dict(),
        "graph8": get_graph8_dict(),
        "graph9": get_graph9_dict(),
        "graph10": get_graph10_dict(),
        "graph11": get_graph11_dict(),
        "graph12": get_graph12_dict(),
        "graph13": get_graph13_dict(),
        "graph14": get_graph14_dict(),
        "graph15": get_graph15_dict(),
        "graph16": get_graph16_dict(),
        "graph17": get_graph17_dict(),
    }


__all__ = [
    "get_graph1_dict",
    "get_graph2_dict",
    "get_graph3_dict",
    "get_graph4_dict",
    "get_graph5_dict",
    "get_graph6_dict",
    "get_graph7_dict",
    "get_graph8_dict",
    "get_graph9_dict",
    "get_graph10_dict",
    "get_graph11_dict",
    "get_graph12_dict",
    "get_graph13_dict",
    "get_graph14_dict",
    "get_graph15_dict",
    "get_graph16_dict",
    "get_graph17_dict",
    "get_all_graphs",
]
