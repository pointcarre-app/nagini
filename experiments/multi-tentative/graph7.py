# Graph 3: Exponential (Gaussian curve)
x = np.linspace(-5, 5, 100)
y = np.exp(-(x**2) / 4)

# Ready for LaTeX annotations - some ideas:
# - Peak at (0, 1)
# - Standard deviation points
# - Integral formula
# - e^{-x^2/4} formula
foreign_objects = None  # No annotations yet

svg_output = create_svg(x_data=x, y_data=y, size=335, foreign_objects=foreign_objects)
