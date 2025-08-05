import numpy as np

# Graph 17: Vector Geometry and Dot Product
# Two vectors: u = (3, 2) and v = (4, 1)
# Dot product: u · v = 3×4 + 2×1 = 12 + 2 = 14

# Vector coordinates
u = np.array([3, 2])
v = np.array([4, 1])

# Calculate dot product
dot_product = float(np.dot(u, v))

# Calculate angle between vectors
# cos(θ) = (u·v) / (|u|·|v|)
u_norm = float(np.linalg.norm(u))
v_norm = float(np.linalg.norm(v))
cos_angle = dot_product / (u_norm * v_norm)
angle_rad = float(np.arccos(np.clip(cos_angle, -1, 1)))
angle_deg = float(np.degrees(angle_rad))

# Colors
bg_color = "#e8f5e8"
grid_color = "#c8e6c9"
u_color = "#2196f3"
v_color = "#ff9800"
angle_color = "#e91e63"
origin_color = "#9c27b0"

# All visual elements in lines array
lines = [
    # X-axis
    {
        "type": "axis",
        "x1": -1,
        "y1": 0,
        "x2": 5,
        "y2": 0,
        "stroke": "#424242",
        "stroke-width": 2,
        "class": "axis x-axis",
    },
    # Y-axis
    {
        "type": "axis",
        "x1": 0,
        "y1": -1,
        "x2": 0,
        "y2": 3,
        "stroke": "#424242",
        "stroke-width": 2,
        "class": "axis y-axis",
    },
    # Grid lines
    {
        "type": "line",
        "x1": -1,
        "y1": 1,
        "x2": 5,
        "y2": 1,
        "stroke": grid_color,
        "stroke-width": 1,
        "stroke-dasharray": "2,2",
        "class": "grid-line",
    },
    {
        "type": "line",
        "x1": -1,
        "y1": 2,
        "x2": 5,
        "y2": 2,
        "stroke": grid_color,
        "stroke-width": 1,
        "stroke-dasharray": "2,2",
        "class": "grid-line",
    },
    {
        "type": "line",
        "x1": 1,
        "y1": -1,
        "x2": 1,
        "y2": 3,
        "stroke": grid_color,
        "stroke-width": 1,
        "stroke-dasharray": "2,2",
        "class": "grid-line",
    },
    {
        "type": "line",
        "x1": 2,
        "y1": -1,
        "x2": 2,
        "y2": 3,
        "stroke": grid_color,
        "stroke-width": 1,
        "stroke-dasharray": "2,2",
        "class": "grid-line",
    },
    {
        "type": "line",
        "x1": 3,
        "y1": -1,
        "x2": 3,
        "y2": 3,
        "stroke": grid_color,
        "stroke-width": 1,
        "stroke-dasharray": "2,2",
        "class": "grid-line",
    },
    {
        "type": "line",
        "x1": 4,
        "y1": -1,
        "x2": 4,
        "y2": 3,
        "stroke": grid_color,
        "stroke-width": 1,
        "stroke-dasharray": "2,2",
        "class": "grid-line",
    },
    # Origin point
    {
        "type": "circle",
        "cx": 0,
        "cy": 0,
        "r": 3,
        "fill": origin_color,
        "stroke": "#7b1fa2",
        "stroke-width": 1.5,
        "class": "origin-point",
    },
    # Vector u
    {
        "type": "line",
        "x1": 0,
        "y1": 0,
        "x2": float(u[0]),
        "y2": float(u[1]),
        "stroke": u_color,
        "stroke-width": 3,
        "class": "vector-u",
    },
    # Vector v
    {
        "type": "line",
        "x1": 0,
        "y1": 0,
        "x2": float(v[0]),
        "y2": float(v[1]),
        "stroke": v_color,
        "stroke-width": 3,
        "class": "vector-v",
    },
    # End point of vector u
    {
        "type": "circle",
        "cx": float(u[0]),
        "cy": float(u[1]),
        "r": 3,
        "fill": u_color,
        "stroke": "#1976d2",
        "stroke-width": 1.5,
        "class": "vector-u-end",
    },
    # End point of vector v
    {
        "type": "circle",
        "cx": float(v[0]),
        "cy": float(v[1]),
        "r": 3,
        "fill": v_color,
        "stroke": "#f57c00",
        "stroke-width": 1.5,
        "class": "vector-v-end",
    },
]

# Add angle arc between vectors
# Create a small arc to show the angle
arc_radius = 0.8
arc_start_angle = 0
arc_end_angle = angle_rad
arc_points = 20
arc_x = []
arc_y = []

for i in range(arc_points + 1):
    t = i / arc_points
    angle = arc_start_angle + t * (arc_end_angle - arc_start_angle)
    arc_x.append(float(arc_radius * np.cos(angle)))
    arc_y.append(float(arc_radius * np.sin(angle)))

# Create path for the arc
arc_path = f"M {arc_x[0]} {arc_y[0]}"
for i in range(1, len(arc_x)):
    arc_path += f" L {arc_x[i]} {arc_y[i]}"

lines.append({
    "type": "path",
    "d": arc_path,
    "fill": "none",
    "stroke": angle_color,
    "stroke-width": 2,
    "class": "angle-arc",
})

foreign_objects = [
    {
        "x": 0.2,
        "y": 2.5,
        "latex": r"\vec{u} = (3, 2)",
        "width": 90,
        "height": 20,
        "bg_color": "rgba(33, 150, 243, 0.1)",
        "text_color": u_color,
        "border_radius": "0.3rem",
    },
    {
        "x": 0.2,
        "y": 2.2,
        "latex": r"\vec{v} = (4, 1)",
        "width": 80,
        "height": 20,
        "bg_color": "rgba(255, 152, 0, 0.1)",
        "text_color": v_color,
        "border_radius": "0.3rem",
    },
    {
        "x": 0.2,
        "y": 1.9,
        "latex": r"\vec{u} \cdot \vec{v} = 14",
        "width": 100,
        "height": 20,
        "bg_color": "rgba(233, 30, 99, 0.1)",
        "text_color": angle_color,
        "border_radius": "0.3rem",
    },
    {
        "x": 0.2,
        "y": 1.6,
        "latex": r"\theta = " + f"{float(angle_deg):.1f}°",
        "width": 80,
        "height": 20,
        "bg_color": "rgba(233, 30, 99, 0.1)",
        "text_color": angle_color,
        "border_radius": "0.3rem",
    },
    {
        "x": 3.5,
        "y": 1.5,
        "latex": r"|\vec{u}| = \sqrt{13}",
        "width": 90,
        "height": 20,
        "bg_color": "rgba(33, 150, 243, 0.1)",
        "text_color": u_color,
        "border_radius": "0.3rem",
    },
    {
        "x": 3.5,
        "y": 1.2,
        "latex": r"|\vec{v}| = \sqrt{17}",
        "width": 90,
        "height": 20,
        "bg_color": "rgba(255, 152, 0, 0.1)",
        "text_color": v_color,
        "border_radius": "0.3rem",
    },
    {
        "x": 0.8,
        "y": 0.3,
        "latex": r"\theta",
        "width": 20,
        "height": 20,
        "bg_color": "rgba(233, 30, 99, 0.1)",
        "text_color": angle_color,
        "border_radius": "0.3rem",
    },
]

def get_graph_dict():
    """Return the graph dictionary for vector geometry."""
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