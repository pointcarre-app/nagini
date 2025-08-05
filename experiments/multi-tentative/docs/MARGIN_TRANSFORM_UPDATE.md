# Margin Transform Update Summary

## Overview
Updated the SVG generation system to use d3.js-style `<g>` transform for margins instead of calculating margin offsets in every coordinate transformation.

## Changes Made

### 1. SVG Structure Change
- **Before**: Margins were calculated into every x/y coordinate transformation
- **After**: All plot elements are wrapped in `<g transform="translate(margin, margin)">`

### 2. Transform Functions Updated
Both `create_svg_scene` and `create_multi_curve_svg` functions were updated:

**Before:**
```python
def transform_x(x):
    return margin + (x - x_min) / (x_max - x_min) * plot_size

def transform_y(y):
    return margin + plot_size - (y - y_min) / (y_max - y_min) * plot_size
```

**After:**
```python
def transform_x(x):
    return (x - x_min) / (x_max - x_min) * plot_size

def transform_y(y):
    return plot_size - (y - y_min) / (y_max - y_min) * plot_size
```

### 3. SVG Generation Updates
- Created a plot group: `plot_group = dwg.g(transform=f"translate({margin}, {margin})")`
- All drawing operations now add elements to `plot_group` instead of `dwg`
- The plot group is added to the main drawing at the end
- Grid lines now use coordinates from 0 to plot_size instead of margin to size-margin

### 4. Margin Standardization
- All graphs now use a fixed margin of 5 pixels (previously 30 or 40)
- Updated all 13 graph files to have `"margin": 5`
- Updated default margin in `dict_from_graph_params` to 5

## Benefits
1. **Cleaner code**: No need to add margin in every coordinate calculation
2. **D3.js compatibility**: Follows the same pattern as d3.js for margins
3. **Better separation**: Visual margin is handled by SVG transform, not data transformation
4. **Smaller margins**: Reduced from 30px to 5px, giving more space for the actual graph

## Testing
Navigate to http://localhost:8010/experiments/multi-tentative/scenery/ to see all graphs with the new margin system.