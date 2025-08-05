# Technical Documentation

## Architecture Overview

The system generates SVG visualizations from Python code running in the browser via Pyodide, with LaTeX math rendering through KaTeX.

```
Browser (HTML/JS) → Pyodide → Python Package → SVG String → KaTeX Processing → Display
```

## Core Components

### SVG Generation (`core/svg_utils.py`)
- `graph_from_dict()` - Main entry point, accepts graph dictionary
- `create_svg_scene()` - Single curve rendering
- `create_multi_curve_svg()` - Multiple curves with shared axes

### Data Models (`models/`)
- `Line` - Pydantic model for line validation
- `Curve` - Model for curve definitions
- `ForeignObject` - LaTeX annotation containers

### Graph Definitions (`graphs/`)
13 pre-built mathematical visualizations from simple lines to complex educational graphs.

## Graph Dictionary Format

```python
{
    "lines": [
        # Curves
        {
            "type": "curve",
            "id": "parabola",
            "data": {"x": [...], "y": [...]},
            "stroke": "#1976d2",
            "stroke-width": 2
        },
        # Axes with arrows
        {
            "type": "axis",
            "x1": -5, "y1": 0, "x2": 5, "y2": 0,
            "stroke": "#333"
        },
        # Shapes
        {
            "type": "circle",
            "cx": 0, "cy": 0, "r": 1
        },
        {
            "type": "path",
            "d": "M0,0 L10,10"
        }
    ],
    "foreign_objects": [
        {
            "x": 2, "y": 4,
            "width": 100, "height": 30,
            "latex": "y = x^2",
            "bg_color": "rgba(255,255,255,0.9)"
        }
    ],
    "svg": {
        "size": 400,
        "margin": 5,
        "bg_color": "white"
    },
    "settings": {
        "show_grid": true,
        "show_axes": false  # When providing custom axes
    }
}
```

## Coordinate System

1. **Data Space**: Original x,y values from arrays
2. **Normalized Space**: Scaled to [0,1] with 10% padding
3. **SVG Space**: Pixels with margin transform

The SVG uses `<g transform="translate(margin,margin)">` for clean separation of margins from data.

## LaTeX Integration

LaTeX formulas are embedded using SVG `foreignObject` elements:

```xml
<foreignObject x="100" y="50" width="80" height="30">
    <div class="svg-latex" data-latex="y = x^2">
        <!-- KaTeX renders here -->
    </div>
</foreignObject>
```

JavaScript post-processes all `data-latex` attributes with KaTeX.

## Line Types

- **curve**: Regular line, no markers
- **axis**: Line with arrow marker at end
- **circle**: Circle with center and radius
- **path**: Arbitrary SVG path

## Browser Requirements

- ES6+ JavaScript
- SVG foreignObject support
- Modern CSS (flexbox, CSS variables)

## Dependencies

- **Pyodide**: Python runtime in browser
- **NumPy**: Numerical computations
- **svgwrite**: SVG generation
- **KaTeX**: LaTeX rendering
- **Pydantic**: Data validation