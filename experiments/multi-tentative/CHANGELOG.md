# Changelog

All notable changes to the PCA Graph Visualization project.

## [Current] - 2024

### 🎨 Major Features
- **V2 Graph Format**: Unified structure where all visual elements (curves, axes, lines) exist in a single `lines` array
- **Educational Graphs**: Added 4 new educational math visualizations (graphs 10-13)
- **Shape Support**: Added support for circles and paths in addition to lines
- **Improved LaTeX**: Better positioning and styling for mathematical annotations

### 🐛 Bug Fixes

#### Import & Module Loading
- Fixed `ImportError` for `create_svg` by adding backwards compatibility alias
- Added module cache clearing in browser to prevent stale imports
- Added no-cache headers for Python files in development server

#### Style & Rendering
- Fixed `ValueError` in style dictionary updates by handling both string and dict styles
- Fixed division by zero in color handling for multi-curve graphs
- Fixed LaTeX elements missing backgrounds and being transparent
- Fixed KaTeX label centering in small (20x20) foreign objects
- Added optical centering adjustment for better text alignment

#### API & Parameters
- Fixed `TypeError` for unexpected 'margin' parameter in `create_multi_curve_svg`
- Added proper parameter filtering for multi-curve settings
- Fixed shape support for circle and path elements in graphs 10-13

### 🔧 Technical Improvements

#### SVG Generation
- Implemented d3.js-style `<g transform="translate()">` for margins
- Removed margin calculations from coordinate transformations
- Standardized margin to 5px across all graphs (reduced from 30-40px)
- Improved grid line generation using cleaner coordinates

#### Code Structure
- Consolidated all graphs to use V2 format exclusively
- Removed legacy `data.y` and `data.y_list` format support
- Unified API with single `graph_from_dict()` function
- Cleaned up redundant V2 files and renamed to standard names

### 📚 Documentation
- Created unified test interface at `scenery/index.html`
- Added comprehensive package structure documentation
- Documented new curve format and migration guide
- Added examples for all graph types

### 🎯 V2 Format Structure
```json
{
  "lines": [
    {
      "type": "curve",
      "id": "curve-name",
      "data": {"x": [...], "y": [...]},
      "stroke": "#color",
      "stroke-width": 2
    },
    {
      "type": "axis",
      "x1": -5, "y1": 0,
      "x2": 5, "y2": 0
    },
    {
      "type": "circle",
      "cx": 0, "cy": 0, "r": 1
    },
    {
      "type": "path",
      "d": "M0,0 L10,10"
    }
  ]
}
```

### 📦 Package Changes
- Created proper Python package structure with `setup.py`
- Added `requirements.txt` with dependencies (numpy, svgwrite, pydantic)
- Organized code into `core/`, `models/`, and `graphs/` modules
- Added `.gitignore` for Python projects

### 🗑️ Removed/Deprecated
- Removed old graph format support (`data.y`, `data.y_list`)
- Removed `graph_from_dict_v2` (now just `graph_from_dict`)
- Deleted debug and test files
- Removed redundant `_v2` graph files