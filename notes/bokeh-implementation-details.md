# Bokeh Implementation Details in Nagini

## Overview

This document explains the differences between Bokeh implementations in `/examples` and `/scenery`, highlighting the architectural choices and testing strategies for each.

## `/examples` - Interactive Bokeh Demonstrations

### What's Loaded
- **Full BokehJS Libraries**: Complete interactive rendering stack
  ```html
  <script src="https://cdn.bokeh.org/bokeh/release/bokeh-3.6.2.min.js"></script>
  <script src="https://cdn.bokeh.org/bokeh/release/bokeh-widgets-3.6.2.min.js"></script>
  <script src="https://cdn.bokeh.org/bokeh/release/bokeh-tables-3.6.2.min.js"></script>
  ```
- **Bokeh Python Package**: Via Pyodide package manager
- **Nagini Library**: Full execution environment

### Purpose
- **User-Facing Demonstrations**: Shows end users how to integrate Bokeh with Nagini
- **Interactive Visualizations**: Full pan, zoom, hover, and selection tools
- **Bidirectional Communication**: JavaScript controls update Python parameters
- **Real Rendering**: Actual Bokeh plots displayed using `Bokeh.embed.embed_item()`

### Key Files
1. **`bokeh-interactive.html`**: Main demo with multiple plot types
2. **`bokeh-interactive-widgets.html`**: Bidirectional widget system
3. **`bokeh-test.html`**: Simple test implementation

### Characteristics
- **Frontend-Heavy**: Requires BokehJS for rendering
- **Visual Output**: Users see actual interactive plots
- **Browser Interactivity**: Mouse events, tooltips, selections work
- **Production-Ready Examples**: Code can be copied for real applications

## `/scenery` - Programmatic Bokeh Testing

### What's Loaded
- **Bokeh Python Package**: Via Pyodide (when needed)
- **Nagini Library**: Core execution and capture systems
- **NO BokehJS Libraries**: Intentionally omitted

### Purpose
- **Backend Testing**: Validates capture system functionality
- **Programmatic Verification**: Tests JSON capture without rendering
- **CI/CD Compatible**: Can run headless without visual output
- **Isolation Testing**: Ensures capture works independently of display

### Test Implementation (2️⃣-bis)
```javascript
testBokehCaptureWorkflow() {
    // Tests that bokeh_figures property exists
    // Verifies it's an array (even if empty)
    // Does NOT render or display plots
    // Does NOT require BokehJS libraries
}
```

### Characteristics
- **Backend-Focused**: Tests Python execution and capture
- **No Visual Output**: Only verifies JSON structure
- **Lightweight**: No rendering overhead
- **Automated Testing**: Suitable for CI/CD pipelines

## Key Differences Summary

| Aspect | `/examples` | `/scenery` |
|--------|------------|------------|
| **BokehJS Libraries** | ✅ Loaded | ❌ Not loaded |
| **Visual Output** | ✅ Interactive plots | ❌ JSON only |
| **User Interaction** | ✅ Pan/zoom/hover | ❌ None |
| **Testing Focus** | User experience | Backend capture |
| **Target Audience** | End users/developers | Test automation |
| **Rendering** | `Bokeh.embed.embed_item()` | None |
| **Dependencies** | Heavy (BokehJS ~3MB) | Light (Python only) |

## Architecture Implications

### Capture System (`capture_system.py`)
- Works independently of frontend libraries
- Exports Bokeh plots as JSON via `json_item()`
- Does not require BokehJS for capture
- Returns array of JSON strings in `bokeh_figures`

### Worker Communication
- `worker-execution.js` captures Bokeh figures
- Passes JSON strings through message protocol
- Frontend decides whether to render or just validate

### Testing Strategy
1. **Scenery**: Verify capture mechanics work
2. **Examples**: Demonstrate full interactive experience
3. **Separation**: Backend logic independent of frontend rendering

## Important Notes

### Worker Bundle Rebuilding
After any changes to capture system:
```bash
cd src/pyodide/worker
npm run build
```

### JSON vs Rendering
- **JSON Capture**: Always works if Bokeh Python package loaded
- **Visual Rendering**: Requires BokehJS libraries in HTML
- **Test Isolation**: Scenery tests capture without rendering overhead

### Performance Considerations
- **Examples**: ~3MB additional download (BokehJS)
- **Scenery**: Minimal overhead (JSON strings only)
- **Production**: Load BokehJS only when needed

## Conclusion

The dual approach allows:
1. **Robust Testing**: Backend capture validated without UI dependencies
2. **Rich Examples**: Full interactive experience for users
3. **Clean Architecture**: Separation of concerns between capture and display
4. **Flexible Deployment**: Choose rendering strategy based on needs
