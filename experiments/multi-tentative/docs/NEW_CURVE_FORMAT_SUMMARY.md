# New Curve Format Summary

## The Problem with the Old Format

The old JSON structure had curves separated from other visual elements:

```json
{
  "data": {
    "x": [100 points],      // Single curve
    "y": [100 points],      // OR
    "y_list": [[...], [...]]  // Multiple curves
  },
  "lines": [
    // Only axes and reference lines here
  ]
}
```

This caused:
- **Inconsistency**: Different handling for 1 vs N curves
- **Limited flexibility**: Curves couldn't have individual properties easily
- **Split logic**: Visual elements in two different places

## The New Format Solution

Now ALL visual elements (including curves) go in the `lines` array:

```json
{
  "lines": [
    {
      "type": "curve",
      "id": "cubic",
      "data": {
        "x": [-5, -4.9, ..., 5],
        "y": [-110, -102.8, ..., 110]
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
      "stroke-width": 2
    }
  ]
}
```

## Benefits

1. **Unified Structure**: Everything is a "line element" - curves, axes, reference lines
2. **Arbitrary Curves**: Just add more curve objects to support any number
3. **Individual Properties**: Each curve can have its own color, style, class, id
4. **Consistent Processing**: One loop handles all visual elements
5. **Better Extensibility**: Easy to add new element types (bezier curves, arcs, etc.)

## Implementation

### New Functions
- `graph_from_dict_v2()` - Processes the new format
- Graph files with `_v2.py` suffix use the new format

### Example: Multiple Curves
```json
{
  "lines": [
    {"type": "curve", "id": "identity", "data": {...}, "stroke": "#503ab2"},
    {"type": "curve", "id": "minus-identity", "data": {...}, "stroke": "#ab0084"},
    {"type": "axis", "x1": -1, "y1": 0, "x2": 1, "y2": 0}
  ]
}
```

### Testing
- `graph8_v2.py` - Single curve example (cubic function)
- `graph1_v2.py` - Multiple curves example (identity functions)
- `test_v2_format.html` - Interactive demo

## Migration Path

1. Keep old format working with `graph_from_dict()`
2. New graphs use `graph_from_dict_v2()` 
3. Gradually migrate existing graphs
4. Eventually deprecate old format

This makes the system much more flexible and maintainable!