# Graph 3: Identity and Minus Identity on [-3, 3]
x = np.linspace(-3, 3, 100)
y_identity = x  # y = x
y_minus_identity = -x  # y = -x

# Use nice hex colors directly - third variant
bg_color = "#f0ebf4"  # Very light purple-grey
grid_color = "#ddd0e6"  # Light purple-grey
axes_color = "#25202a"  # Very dark purple
curve1_color = "#4ade80"  # Green
curve2_color = "#f59e0b"  # Orange

foreign_objects = [
    {
        "x": 1,
        "y": 1,
        "latex": r"x",
        "width": 20,
        "height": 20,
        "bg_color": "rgba(48, 145, 16, 0.2)",
        "text_color": "#309110",
        "border_radius": "0.25rem",
    },
    {
        "x": 2,
        "y": 2,
        "latex": r"x",
        "width": 20,
        "height": 20,
        "bg_color": "rgba(48, 145, 16, 0.2)",
        "text_color": "#309110",
        "border_radius": "0.25rem",
    },
    {
        "x": 3,
        "y": 3,
        "latex": r"x",
        "width": 20,
        "height": 20,
        "bg_color": "rgba(48, 145, 16, 0.2)",
        "text_color": "#309110",
        "border_radius": "0.25rem",
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
)
