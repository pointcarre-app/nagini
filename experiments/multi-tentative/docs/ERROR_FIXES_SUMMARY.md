# Error Fixes Summary

## Errors Fixed

### 1. Style Dictionary Update Error
**Error**: `ValueError: dictionary update sequence element #0 has length 1; 2 is required`

**Cause**: In `dict_from_graph_params`, the code tried to update a dictionary with a string value when `style` was a string (e.g., `"color: #503ab2"`) instead of a dict.

**Fix**: Added type checking to handle both string and dict styles:
```python
if isinstance(fo["style"], dict):
    style.update(fo["style"])
else:
    # If style is a string, use it directly
    processed_fo["style"] = fo["style"]
    style = None
```

### 2. Unexpected Keyword Argument 'margin'
**Error**: `TypeError: create_multi_curve_svg() got an unexpected keyword argument 'margin'`

**Cause**: The settings dict contained 'margin' which isn't accepted by `create_multi_curve_svg`.

**Fix**: Filter settings to only pass accepted parameters:
```python
multi_curve_settings = {
    k: v for k, v in settings.items()
    if k in ['bg_color', 'axes_color', 'grid_color', 'show_axes', 'show_grid']
}
```

### 3. Division by Zero in Colors
**Error**: `ZeroDivisionError: integer modulo by zero`

**Cause**: The code tried to extract colors from lines with `type="curve"`, but all lines were axes/reference lines, resulting in an empty colors list.

**Fix**: 
- Get colors from settings instead of lines
- Added default colors if none specified
- Updated all multi-curve graphs to pass `colors` parameter

## Changes Made

1. **svg_utils.py**:
   - Fixed style handling in `dict_from_graph_params`
   - Added settings filtering in `graph_from_dict`
   - Added colors support with defaults
   - Added colors to settings dict

2. **graphs 1-4**:
   - Added `colors=[curve1_color, curve2_color]` parameter

## To Test

After clearing browser cache and refreshing:
```bash
python serve.py
# Open http://localhost:8000/test_graphs.html
```

All graphs should now load correctly!