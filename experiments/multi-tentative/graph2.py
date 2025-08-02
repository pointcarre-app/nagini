# Graph 2: Identity and Minus Identity on [-2, 2]
x = np.linspace(-2, 2, 100)
y_identity = x  # y = x
y_minus_identity = -x  # y = -x

# Use nice hex colors directly - different from graph1
bg_color = "#f4f1e8"  # Very light warm grey
grid_color = "#e0d9c6"  # Light warm grey
axes_color = "#342f26"  # Dark warm grey
curve1_color = "#4681ea"  # Blue
curve2_color = "#ea5545"  # Red

foreign_objects = [
    {
        "x": 1,
        "y": 1,
        "latex": r"x",
        "width": 20,
        "height": 20,
        "style": "background-color: rgba(0, 133, 192, 0.2); color: #0085c0; border-radius: 0.25rem",
    },
    {
        "x": 2,
        "y": 2,
        "latex": r"x",
        "width": 20,
        "height": 20,
        "style": "background-color: rgba(0, 133, 192, 0.2); color: #0085c0; border-radius: 0.25rem",
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
