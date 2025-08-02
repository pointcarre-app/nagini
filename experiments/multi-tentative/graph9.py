# Graph 9: Circle (parametric)
t = np.linspace(0, 2 * np.pi, 100)
x = 3 * np.cos(t)
y = 3 * np.sin(t)

# Draw circle with light grey background
svg_output = create_svg(x_data=x, y_data=y, size=335, bg_color="#e8e8e8")
