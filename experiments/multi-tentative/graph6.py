# Graph 2: Simple sine
x = np.linspace(-5, 5, 100)
y = np.sin(x)

foreign_objects = [
    {
        "x": 4.2,
        "y": 0,
        "latex": r"x",
        "width": 20,
        "height": 20,
        "text_color": "#141b20",
        "font_weight": "700",
    }
]

svg_output = create_svg(x_data=x, y_data=y, size=335, foreign_objects=foreign_objects)
