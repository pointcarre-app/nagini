# Debug version of Graph 1
x = np.linspace(-1, 1, 100)
y_identity = x
y_minus_identity = -x

bg_color = "#f5f7fb"
grid_color = "#dde3ed"
curve1_color = "#6b46c1"
curve2_color = "#c7366f"

# Simplified lines with just axes
lines = [
    {
        "x1": -1,
        "y1": 0,
        "x2": 1,
        "y2": 0,
        "stroke": "#ff0000",  # Red for visibility
        "stroke_width": 3,
        "class": "axis x-axis",
        "type": "axis",
    },
    {
        "x1": 0,
        "y1": -1,
        "x2": 0,
        "y2": 1,
        "stroke": "#0000ff",  # Blue for visibility
        "stroke_width": 3,
        "class": "axis y-axis",
        "type": "axis",
    },
]

svg_output = create_multi_curve_svg(
    x_data=x,
    y_data_list=[y_identity, y_minus_identity],
    size=335,
    colors=[curve1_color, curve2_color],
    bg_color=bg_color,
    grid_color=grid_color,
    lines=lines,
    show_axes=False,
)

# Debug output
print("SVG length:", len(svg_output))
if "<defs>" in svg_output:
    print("Found <defs> tag")
    defs_start = svg_output.find("<defs>")
    defs_end = svg_output.find("</defs>") + 7
    print("Defs content:", svg_output[defs_start:defs_end])

if "<marker" in svg_output:
    print("Found marker definition")

if 'marker-end="url(#arrow)"' in svg_output:
    print("Found marker-end attributes")
    # Count how many
    count = svg_output.count('marker-end="url(#arrow)"')
    print(f"Number of lines with arrows: {count}")
