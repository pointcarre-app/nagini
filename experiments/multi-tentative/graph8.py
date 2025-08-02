# Graph 4: Cubic
x = np.linspace(-5, 5, 100)
y = x**3 - 3 * x

foreign_objects = None  # No annotations

svg_output = create_svg(x_data=x, y_data=y, size=335, foreign_objects=foreign_objects)
