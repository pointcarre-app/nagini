# Debug script to check arrow generation
x = [0, 1]
y = [0, 1]

lines = [
    {
        "x1": 0,
        "y1": 0,
        "x2": 1,
        "y2": 0,
        "stroke": "#ff0000",
        "stroke_width": 3,
        "class": "axis x-axis",
        "type": "axis",
    }
]

svg_output = create_svg(
    x_data=x,
    y_data=y,
    size=200,
    lines=lines,
    show_axes=False,
    show_grid=False,
)

print("Generated SVG:")
print(svg_output)
print("\n\nChecking for marker definition:")
if "<marker" in svg_output:
    print("✓ Found marker definition")
else:
    print("✗ No marker definition found")

print("\nChecking for marker-end attribute:")
if 'marker-end="url(#arrow)"' in svg_output:
    print("✓ Found marker-end attribute")
else:
    print("✗ No marker-end attribute found")
