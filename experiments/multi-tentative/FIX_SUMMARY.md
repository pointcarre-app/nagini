# V2 Format Fixes

## Issues Fixed

### 1. JSON Decode Error
**Problem**: LaTeX strings with backslashes (like `\Delta`) were causing JSON parse errors
**Solution**: Double-escaped JSON strings using `JSON.stringify(JSON.stringify(graph))`

### 2. Missing Width/Height
**Problem**: Some foreign objects were missing width/height attributes causing rendering issues
**Solution**: Added explicit width/height to all foreign objects in graph5_v2.py

### 3. X-Array Handling
**Problem**: V2 assumed all curves share the same x data
**Solution**: Added check for matching x arrays with fallback handling

## Changes Made

1. **scenery/index.html**:
   - Fixed JSON escaping for both regular and V2 graph rendering
   - Changed from `json.loads('''${JSON.stringify(graph)}''')` 
   - To: `json_str = ${JSON.stringify(JSON.stringify(graph))}`

2. **graph5_v2.py**:
   - Added width/height to all foreign objects:
     - V(2,-1): width=60, height=25
     - x_1=1, x_2=3: width=50, height=25
     - y=x^2-4x+3: width=100, height=25
     - Delta formula: width=180, height=25
     - x formula: width=150, height=25

3. **svg_utils.py (graph_from_dict_v2)**:
   - Added check if all curves share the same x array
   - Improved handling for curves with different x data

## Testing

Open http://localhost:8010/scenery/ and check:
- V2 Format tab should render without errors
- LaTeX formulas should display correctly
- Foreign objects should have proper sizing