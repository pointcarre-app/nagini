# PCA Graph Visualization

Interactive mathematical graphs in the browser using Python + Pyodide.

## 🚀 Quick Start

```bash
python serve.py
# Open http://localhost:8000/scenery/
```

## 📊 Features

- **13 Mathematical Graphs**: From simple lines to complex educational visualizations
- **Pure Python SVG**: Generated with svgwrite, no JS libraries needed
- **LaTeX Support**: Mathematical annotations via KaTeX
- **Flexible Format**: Unified structure for curves, axes, and shapes

## 📁 Structure

```
pca_graph_viz/          # Python package
├── core/               # SVG generation
├── models/             # Data models
└── graphs/             # 13 pre-built graphs

scenery/index.html      # Test interface
docs/                   # Documentation
```

## 🔧 Installation

```bash
pip install -r requirements.txt
pip install -e .  # Development mode
```

## 📖 Documentation

- [Technical Details](docs/TECHNICAL.md) - Architecture and implementation
- [API Reference](docs/API.md) - Functions and examples
- [Changelog](CHANGELOG.md) - Version history

## 🎨 Example

```python
from pca_graph_viz import graph_from_dict

graph = {
    "lines": [
        {
            "type": "curve",
            "data": {"x": [...], "y": [...]},
            "stroke": "#1976d2"
        }
    ]
}
svg = graph_from_dict(graph)
```