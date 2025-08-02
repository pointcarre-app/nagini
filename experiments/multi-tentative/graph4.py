# Graph 4: Identity and Minus Identity on [-4, 4]
x = np.linspace(-4, 4, 100)
y_identity = x  # y = x
y_minus_identity = -x  # y = -x

# Use nice hex colors directly - fourth variant
bg_color = "#f0e9d8"  # Very light yellow-grey
grid_color = "#dcc9a3"  # Light yellow-grey
axes_color = "#1f1b14"  # Almost black with yellow tint
curve1_color = "#5eadef"  # Cyan-blue
curve2_color = "#ec4899"  # Pink

foreign_objects = [
    {
        "x": 1,
        "y": 1,
        "latex": r"x",
        "width": 20,
        "height": 20,
        "bg_color": "rgba(214, 129, 12, 0.2)",
        "text_color": "#d6810c",
        "border_radius": "0.25rem",
    },
    {
        "x": 2,
        "y": 2,
        "latex": r"x",
        "width": 20,
        "height": 20,
        "bg_color": "rgba(214, 129, 12, 0.2)",
        "text_color": "#d6810c",
        "border_radius": "0.25rem",
    },
    {
        "x": 3,
        "y": 3,
        "latex": r"x",
        "width": 20,
        "height": 20,
        "bg_color": "rgba(214, 129, 12, 0.2)",
        "text_color": "#d6810c",
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
