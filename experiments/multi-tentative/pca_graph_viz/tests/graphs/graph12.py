import numpy as np

# Graph 12: Unit Circle with Trigonometric Values
# Generate the unit circle
theta = np.linspace(0, 2 * np.pi, 100)
x_circle = np.cos(theta)
y_circle = np.sin(theta)

# Important angles (in radians)
angles = [
    0,
    float(np.pi / 6),
    float(np.pi / 4),
    float(np.pi / 3),
    float(np.pi / 2),
    float(2 * np.pi / 3),
    float(np.pi),
    float(5 * np.pi / 4),
    float(3 * np.pi / 2),
]
angle_labels = [
    "0",
    r"\frac{\pi}{6}",
    r"\frac{\pi}{4}",
    r"\frac{\pi}{3}",
    r"\frac{\pi}{2}",
    r"\frac{2\pi}{3}",
    r"\pi",
    r"\frac{5\pi}{4}",
    r"\frac{3\pi}{2}",
]

# Colors
bg_color = "#fafafa"
grid_color = "#e0e0e0"
circle_color = "#1565c0"
point_color = "#ff6f00"
angle_color = "#00897b"

# All visual elements in lines array
lines = [
    # The unit circle
    {
        "type": "curve",
        "id": "unit-circle",
        "data": {"x": x_circle.tolist(), "y": y_circle.tolist()},
        "stroke": circle_color,
        "stroke-width": 2.5,
        "fill": "none",
        "class": "curve unit-circle",
    },
    # X-axis
    {
        "type": "axis",
        "x1": -1.5,
        "y1": 0,
        "x2": 1.5,
        "y2": 0,
        "stroke": "#424242",
        "stroke-width": 2,
        "class": "axis x-axis",
    },
    # Y-axis
    {
        "type": "axis",
        "x1": 0,
        "y1": -1.5,
        "x2": 0,
        "y2": 1.5,
        "stroke": "#424242",
        "stroke-width": 2,
        "class": "axis y-axis",
    },
]

# Add radius lines and points for key angles
for i, angle in enumerate(angles[:4]):  # Show first 4 angles
    x = float(np.cos(angle))
    y = float(np.sin(angle))

    # Radius line
    lines.append(
        {
            "type": "line",
            "x1": 0,
            "y1": 0,
            "x2": x,
            "y2": y,
            "stroke": angle_color,
            "stroke-width": 1.5,
            "stroke-dasharray": "3,2",
            "class": f"radius angle-{i}",
        }
    )

    # Point on circle
    lines.append(
        {
            "type": "circle",
            "cx": x,
            "cy": y,
            "r": 4,
            "fill": point_color,
            "stroke": "#e65100",
            "stroke-width": 2,
            "class": f"angle-point angle-{i}",
        }
    )

# Add special points at (±1, 0) and (0, ±1)
special_points = [(1, 0), (-1, 0), (0, 1), (0, -1)]
for x, y in special_points:
    lines.append(
        {
            "type": "circle",
            "cx": x,
            "cy": y,
            "r": 3,
            "fill": circle_color,
            "stroke": "#0d47a1",
            "stroke-width": 2,
            "class": "special-point",
        }
    )

foreign_objects = [
    # Title
    {
        "x": 0,
        "y": 1.3,
        "latex": r"\text{Unit Circle}",
        "width": 100,
        "height": 30,
        "bg_color": "rgba(21, 101, 192, 0.1)",
        "text_color": circle_color,
        "border_radius": "0.5rem",
        "font_weight": "bold",
    },
    # Angle labels
    {
        "x": 0.7,
        "y": 0.1,
        "latex": angle_labels[1],  # π/6
        "width": 35,
        "height": 25,
        "bg_color": "rgba(0, 137, 123, 0.1)",
        "text_color": angle_color,
    },
    {
        "x": 0.5,
        "y": 0.35,
        "latex": angle_labels[2],  # π/4
        "width": 35,
        "height": 25,
        "bg_color": "rgba(0, 137, 123, 0.1)",
        "text_color": angle_color,
    },
    {
        "x": 0.25,
        "y": 0.55,
        "latex": angle_labels[3],  # π/3
        "width": 35,
        "height": 25,
        "bg_color": "rgba(0, 137, 123, 0.1)",
        "text_color": angle_color,
    },
    # Coordinate labels
    {
        "x": 1,
        "y": -0.25,
        "latex": "(1, 0)",
        "width": 50,
        "height": 20,
        "text_color": "#0d47a1",
        "font_size": "0.75rem",
    },
    {
        "x": -1,
        "y": -0.25,
        "latex": "(-1, 0)",
        "width": 50,
        "height": 20,
        "text_color": "#0d47a1",
        "font_size": "0.75rem",
    },
    {
        "x": 0.25,
        "y": 1,
        "latex": "(0, 1)",
        "width": 50,
        "height": 20,
        "text_color": "#0d47a1",
        "font_size": "0.75rem",
    },
    # Trig values for π/4
    {
        "x": 0.9,
        "y": 0.9,
        "latex": r"\left(\frac{\sqrt{2}}{2}, \frac{\sqrt{2}}{2}\right)",
        "width": 100,
        "height": 30,
        "bg_color": "rgba(255, 111, 0, 0.9)",
        "text_color": "white",
        "border_radius": "0.25rem",
        "font_size": "0.8rem",
    },
]


def get_graph_dict():
    """Return the graph as a standardized dictionary."""
    return {
        "id": "graph12",
        "title": "Unit Circle with Trigonometry",
        "description": "Unit circle showing key angles and their trigonometric values",
        "svg": {
            "width": 340,
            "height": 340,
            "viewBox": "0 0 340 340",
            "style": {"background-color": bg_color},
        },
        "settings": {
            "margin": 5,
            "show_axes": False,  # We define axes in lines
            "show_grid": True,
            "grid_color": grid_color,
            "axes_color": "#424242",
        },
        "lines": lines,
        "foreign_objects": foreign_objects,
    }
