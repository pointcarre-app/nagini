# API Reference

## Main Functions

### `graph_from_dict(graph_dict)`
Generate SVG from a graph dictionary.

```python
from pca_graph_viz import graph_from_dict

svg_string = graph_from_dict({
    "lines": [...],
    "foreign_objects": [...],
    "svg": {...},
    "settings": {...}
})
```

### `dict_from_graph_params(**kwargs)`
Create a graph dictionary from parameters.

```python
from pca_graph_viz import dict_from_graph_params

graph_dict = dict_from_graph_params(
    x_data=x_array,
    y_data=y_array,
    lines=[...],
    foreign_objects=[...],
    size=400,
    margin=5
)
```

### Pre-built Graphs

```python
from pca_graph_viz.graphs import get_graph1_dict, get_all_graphs

# Single graph
graph1 = get_graph1_dict()

# All graphs
all_graphs = get_all_graphs()  # Returns dict with graph1-graph13
```

## Examples

### Simple Parabola
```python
import numpy as np
from pca_graph_viz import graph_from_dict

x = np.linspace(-3, 3, 100)
y = x**2

graph = {
    "lines": [
        {
            "type": "curve",
            "id": "parabola",
            "data": {"x": x.tolist(), "y": y.tolist()},
            "stroke": "#1976d2",
            "stroke-width": 2
        }
    ]
}

svg = graph_from_dict(graph)
```

### Multiple Curves with Axes
```python
graph = {
    "lines": [
        # First curve
        {
            "type": "curve",
            "id": "sin",
            "data": {"x": x.tolist(), "y": np.sin(x).tolist()},
            "stroke": "red"
        },
        # Second curve
        {
            "type": "curve", 
            "id": "cos",
            "data": {"x": x.tolist(), "y": np.cos(x).tolist()},
            "stroke": "blue"
        },
        # X-axis with arrow
        {
            "type": "axis",
            "x1": -3, "y1": 0, "x2": 3, "y2": 0,
            "stroke": "#333"
        },
        # Y-axis with arrow
        {
            "type": "axis",
            "x1": 0, "y1": -1.5, "x2": 0, "y2": 1.5,
            "stroke": "#333"
        }
    ],
    "settings": {"show_axes": false}  # Using custom axes
}
```

### With LaTeX Annotations
```python
graph = {
    "lines": [...],
    "foreign_objects": [
        {
            "x": 1.5,
            "y": 2.25,
            "width": 80,
            "height": 30,
            "latex": "f(x) = x^2",
            "bg_color": "rgba(255,255,255,0.9)",
            "text_color": "#333"
        }
    ]
}
```

### Shapes and Paths
```python
graph = {
    "lines": [
        # Circle
        {
            "type": "circle",
            "cx": 0, "cy": 0, "r": 1,
            "fill": "none",
            "stroke": "green"
        },
        # Custom path
        {
            "type": "path",
            "d": "M -1,0 Q 0,1 1,0",
            "fill": "rgba(0,0,255,0.1)",
            "stroke": "blue"
        }
    ]
}
```

## Graph Dictionary Structure

### Required Fields
- `lines`: Array of visual elements (curves, axes, shapes)

### Optional Fields
- `foreign_objects`: LaTeX annotations
- `svg`: Size, margin, background color
- `settings`: Grid, axes visibility

### Line Object Fields
- `type`: "curve" | "axis" | "circle" | "path"
- `id`: Unique identifier (optional)
- `stroke`: Color string
- `stroke-width`: Line thickness
- `class`: CSS classes (optional)

For curves:
- `data`: Object with `x` and `y` arrays

For lines/axes:
- `x1`, `y1`, `x2`, `y2`: Coordinates

For circles:
- `cx`, `cy`: Center coordinates
- `r`: Radius

For paths:
- `d`: SVG path data string