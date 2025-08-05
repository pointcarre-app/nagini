import numpy as np

# Graph 14: Arithmetic and Geometric Sequences - Teaching Discrete Mathematics
# Arithmetic sequence: u_n = 2 + 3n (first 8 terms)
n_arith = np.arange(0, 8)
u_arith = 2 + 3 * n_arith

# Geometric sequence: v_n = 3 * (1.5)^n (first 8 terms)  
n_geom = np.arange(0, 8)
v_geom = 3 * (1.5 ** n_geom)

# Colors
bg_color = "#f8f9fa"
grid_color = "#e9ecef"
arith_color = "#007bff"
geom_color = "#28a745"
point_color = "#dc3545"

# All visual elements in lines array
lines = [
    # X-axis
    {
        "type": "axis",
        "x1": -0.5,
        "y1": 0,
        "x2": 7.5,
        "y2": 0,
        "stroke": "#495057",
        "stroke-width": 2,
        "class": "axis x-axis",
    },
    # Y-axis
    {
        "type": "axis",
        "x1": 0,
        "y1": -5,
        "x2": 0,
        "y2": 35,
        "stroke": "#495057",
        "stroke-width": 2,
        "class": "axis y-axis",
    },
    # Grid lines
    {
        "type": "line",
        "x1": 0,
        "y1": 10,
        "x2": 7,
        "y2": 10,
        "stroke": grid_color,
        "stroke-width": 1,
        "stroke-dasharray": "2,2",
        "class": "grid-line",
    },
    {
        "type": "line",
        "x1": 0,
        "y1": 20,
        "x2": 7,
        "y2": 20,
        "stroke": grid_color,
        "stroke-width": 1,
        "stroke-dasharray": "2,2",
        "class": "grid-line",
    },
    {
        "type": "line",
        "x1": 0,
        "y1": 30,
        "x2": 7,
        "y2": 30,
        "stroke": grid_color,
        "stroke-width": 1,
        "stroke-dasharray": "2,2",
        "class": "grid-line",
    },
]

# Add arithmetic sequence points and connecting lines
for i, (n, u) in enumerate(zip(n_arith, u_arith)):
    # Point
    lines.append({
        "type": "circle",
        "cx": float(n),
        "cy": float(u),
        "r": 3,
        "fill": arith_color,
        "stroke": "#0056b3",
        "stroke-width": 1.5,
        "class": "arith-point",
    })
    
    # Connecting line (except for last point)
    if i < len(n_arith) - 1:
        lines.append({
            "type": "line",
            "x1": float(n),
            "y1": float(u),
            "x2": float(n_arith[i+1]),
            "y2": float(u_arith[i+1]),
            "stroke": arith_color,
            "stroke-width": 2,
            "class": "arith-line",
        })

# Add geometric sequence points and connecting lines
for i, (n, v) in enumerate(zip(n_geom, v_geom)):
    # Point
    lines.append({
        "type": "circle",
        "cx": float(n),
        "cy": float(v),
        "r": 3,
        "fill": geom_color,
        "stroke": "#1e7e34",
        "stroke-width": 1.5,
        "class": "geom-point",
    })
    
    # Connecting line (except for last point)
    if i < len(n_geom) - 1:
        lines.append({
            "type": "line",
            "x1": float(n),
            "y1": float(v),
            "x2": float(n_geom[i+1]),
            "y2": float(v_geom[i+1]),
            "stroke": geom_color,
            "stroke-width": 2,
            "class": "geom-line",
        })

foreign_objects = [
    {
        "x": 0.5,
        "y": 32,
        "latex": r"u_n = 2 + 3n",
        "width": 100,
        "height": 25,
        "bg_color": "rgba(0, 123, 255, 0.1)",
        "text_color": arith_color,
        "border_radius": "0.3rem",
    },
    {
        "x": 0.5,
        "y": 28,
        "latex": r"v_n = 3 \times 1.5^n",
        "width": 120,
        "height": 25,
        "bg_color": "rgba(40, 167, 69, 0.1)",
        "text_color": geom_color,
        "border_radius": "0.3rem",
    },
    {
        "x": 1,
        "y": 15,
        "latex": r"r = 3",
        "width": 50,
        "height": 20,
        "bg_color": "rgba(0, 123, 255, 0.1)",
        "text_color": arith_color,
        "border_radius": "0.3rem",
    },
    {
        "x": 2,
        "y": 8,
        "latex": r"q = 1.5",
        "width": 60,
        "height": 20,
        "bg_color": "rgba(40, 167, 69, 0.1)",
        "text_color": geom_color,
        "border_radius": "0.3rem",
    },
    {
        "x": 6.5,
        "y": 25,
        "latex": r"n",
        "width": 20,
        "height": 20,
        "bg_color": "rgba(73, 80, 87, 0.1)",
        "text_color": "#495057",
        "border_radius": "0.3rem",
    },
]

def get_graph_dict():
    """Return the graph dictionary for arithmetic and geometric sequences."""
    return {
        "lines": lines,
        "foreign_objects": foreign_objects,
        "svg": {
            "size": 400,
            "margin": 5,
            "bg_color": bg_color,
        },
        "settings": {
            "show_grid": False,
            "show_axes": False,
        },
    } 