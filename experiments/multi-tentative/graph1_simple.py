# Simplified Graph 1 for debugging arrows
x = [0, 1]
y = [0, 1]

lines = [
    {
        "x1": 0,
        "y1": 0.5,
        "x2": 1,
        "y2": 0.5,
        "stroke": "#ff0000",
        "stroke_width": 3,
        "type": "axis",
    },
    {
        "x1": 0.5,
        "y1": 0,
        "x2": 0.5,
        "y2": 1,
        "stroke": "#0000ff",
        "stroke_width": 3,
        "type": "axis",
    },
]

svg_output = create_svg(
    x_data=x, y_data=y, size=200, lines=lines, show_axes=False, bg_color="#ffffff"
)
