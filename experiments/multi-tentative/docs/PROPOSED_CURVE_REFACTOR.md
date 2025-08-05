# Proposed Curve Refactoring

## Current Structure (graph8 example):
```json
{
  "data": {
    "x": [array of 100 points],
    "y": [array of 100 points]
  },
  "lines": [
    {
      "type": "axis",
      "x1": -5, "y1": 0,
      "x2": 5, "y2": 0,
      "stroke": "#333333"
    }
  ]
}
```

## Proposed Structure:
```json
{
  "lines": [
    {
      "type": "curve",
      "id": "cubic",
      "data": {
        "x": [-5, -4.899, ...],
        "y": [-110, -102.879, ...]
      },
      "stroke": "#1976d2",
      "stroke-width": 2,
      "fill": "none",
      "class": "curve cubic-curve"
    },
    {
      "type": "axis",
      "x1": -5, "y1": 0,
      "x2": 5, "y2": 0,
      "stroke": "#333333",
      "stroke-width": 2,
      "class": "axis x-axis"
    },
    {
      "type": "axis", 
      "x1": 0, "y1": -120,
      "x2": 0, "y2": 120,
      "stroke": "#333333",
      "stroke-width": 2,
      "class": "axis y-axis"
    }
  ]
}
```

## Benefits:

1. **Unified model** - All visual elements in one place
2. **Arbitrary curves** - Just add more curve objects
3. **Consistent handling** - Process all elements the same way
4. **Better extensibility** - Easy to add new element types

## Example with Multiple Curves:
```json
{
  "lines": [
    {
      "type": "curve",
      "id": "identity",
      "data": {
        "x": [-1, -0.9, ..., 1],
        "y": [-1, -0.9, ..., 1]
      },
      "stroke": "#503ab2",
      "stroke-width": 2
    },
    {
      "type": "curve",
      "id": "minus-identity",
      "data": {
        "x": [-1, -0.9, ..., 1],
        "y": [1, 0.9, ..., -1]
      },
      "stroke": "#ab0084",
      "stroke-width": 2
    },
    {
      "type": "axis",
      "x1": -1, "y1": 0,
      "x2": 1, "y2": 0,
      "stroke": "#333333"
    }
  ]
}
```

## Implementation Plan:

1. Update `graph_from_dict()` to handle curves in lines array
2. Create a migration function to convert old format
3. Update all graph files to use new format
4. Deprecate `data.x`, `data.y`, `data.y_list`

## Type Definitions:

```python
LineElement = Union[
    {
        "type": "line",
        "x1": float, "y1": float,
        "x2": float, "y2": float,
        ...svg_attributes
    },
    {
        "type": "curve",
        "data": {
            "x": List[float],
            "y": List[float]
        },
        ...svg_attributes
    },
    {
        "type": "axis",
        "x1": float, "y1": float, 
        "x2": float, "y2": float,
        ...svg_attributes
    }
]
```

This would make the system much more flexible and consistent!