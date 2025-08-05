# PCA Graph Visualization

Interactive mathematical graph visualization using Python in the browser via Pyodide.

## 🚀 Quick Start

```bash
# Start server (you already have this running)
python serve.py

# Open the test suite
http://localhost:8000/scenery/
```

## 📁 Project Structure

```
.
├── scenery/
│   └── index.html          # 🎯 Main test suite (all tests in one place)
├── pca_graph_viz/          # 📦 Python package
│   ├── core/               # Core SVG generation
│   ├── models/             # Data models (Line, Curve, etc.)
│   └── graphs/             # Graph definitions (1-9 + v2 examples)
├── docs/                   # 📚 Documentation
│   ├── NEW_CURVE_FORMAT_SUMMARY.md
│   ├── PACKAGE_STRUCTURE.md
│   └── ...
├── requirements.txt        # Python dependencies
├── setup.py               # Package setup
└── serve.py               # Development server

```

## 🎨 Features

- **9 Mathematical Graphs**: Identity, parabola, sine, gaussian, cubic, circle
- **LaTeX Support**: Mathematical annotations with KaTeX
- **Pure Python SVG**: No JS libraries, just Python + svgwrite
- **New V2 Format**: Curves as line elements for unlimited flexibility

## 🔧 Graph Format

### Old Format ❌
```json
{
  "data": {
    "x": [points],
    "y": [points]  // Only ONE curve!
  }
}
```

### New V2 Format ✅
```json
{
  "lines": [
    {
      "type": "curve",
      "id": "cubic",
      "data": {"x": [...], "y": [...]},
      "stroke": "#1976d2"
    }
  ]
}
```

## 📊 Available Graphs

- **graph1-4**: Identity functions (y=x, y=-x)
- **graph5**: Parabola with LaTeX annotations
- **graph6**: Sine wave
- **graph7**: Gaussian curve
- **graph8**: Cubic function
- **graph9**: Parametric circle
- **graph1_v2, graph8_v2**: Examples using new format

## 🛠️ Development

The main test page (`scenery/index.html`) includes:
- **All Graphs**: View all 9 graphs with JSON
- **V2 Format Demo**: New curve format examples
- **Format Comparison**: Old vs new side-by-side
- **About**: Documentation and features

## 📦 Package Usage

```python
from pca_graph_viz import graph_from_dict_v2

graph = {
    "lines": [
        {"type": "curve", "data": {"x": [...], "y": [...]}}
    ]
}
svg = graph_from_dict_v2(graph)
```