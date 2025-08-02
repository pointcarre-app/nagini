# Graph 1: Identity and Minus Identity on [-1, 1]
x = np.linspace(-1, 1, 100)
y_identity = x  # y = x
y_minus_identity = -x  # y = -x

# Use nice hex colors directly
bg_color = "#f5f7fb"  # Very light blue-grey
grid_color = "#dde3ed"  # Light grey
axes_color = "#3a3d47"  # Dark blue-grey
curve1_color = "#6b46c1"  # Purple
curve2_color = "#c7366f"  # Red-pink

# Custom lines (optional) - for example, reference lines at x=0.5 and y=0.5
custom_lines = [
    {
        "x1": 0.5,
        "y1": -1,
        "x2": 0.5,
        "y2": 1,
        "stroke": "#cccccc",
        "stroke_width": 1,
        "stroke_dasharray": "3,3",
        "class": "reference-line vertical",
    },
    {
        "x1": -1,
        "y1": 0.5,
        "x2": 1,
        "y2": 0.5,
        "stroke": "#cccccc",
        "stroke_width": 1,
        "stroke_dasharray": "3,3",
        "class": "reference-line horizontal",
    },
]

foreign_objects = [
    {
        "x": 0.7,
        "y": 0.7,
        "latex": r"y=x",
        "width": 50,
        "height": 20,
        "style": "color: #503ab2",  # Purple text only, no background
    },
    {
        "x": 0.7,
        "y": -0.7,
        "latex": r"y=-x",
        "width": 50,
        "height": 20,
        "style": "color: #ab0084",  # Pink text only, no background
    },
    {
        "x": 1,
        "y": 1,
        "latex": r"x",
        "width": 20,
        "height": 20,
        "style": "color: #e6b45d",  # Gold text only, no background
    },
]

svg_output = create_multi_curve_svg(
    x_data=x,
    y_data_list=[y_identity, y_minus_identity],
    size=335,
    colors=[curve1_color, curve2_color],
    bg_color=bg_color,
    axes_color=axes_color,
    grid_color=grid_color,
    foreign_objects=foreign_objects,
    lines=custom_lines,
)
