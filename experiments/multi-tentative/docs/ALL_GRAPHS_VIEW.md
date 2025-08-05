# All Graphs View Update

## Changes Made

Updated `test_graphs.html` to display all graphs simultaneously:

### Layout
- **Vertical stack**: Each graph gets its own row
- **Fixed graph size**: 340x340 pixels on the left
- **Scrollable JSON**: Full JSON representation on the right
- **Max height**: Each row has max-height of 400px

### Features
- All graphs load and display automatically
- No dropdown selector - everything visible at once
- Monospace font for JSON readability
- Clean, minimal CSS
- Each row shows:
  - Graph title (e.g., "graph1: Identity and Minus Identity Functions")
  - SVG visualization (340x340)
  - Complete JSON structure

### Benefits
- See all graphs at a glance
- Compare different graph structures easily
- Scroll through JSON while viewing the graph
- No clicking/selecting needed

### Usage
```bash
python serve.py
# Open http://localhost:8000/test_graphs.html
```

All 9 graphs will be displayed in order (graph1 through graph9).