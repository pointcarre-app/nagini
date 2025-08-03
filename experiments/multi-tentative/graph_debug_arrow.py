# Debug graph to check arrow markers
x = np.linspace(-1, 1, 10)
y = x

# Simple lines with arrows
lines = [
    {
        "x1": -1,
        "y1": 0,
        "x2": 1,
        "y2": 0,
        "stroke": "#ff0000",  # Red
        "stroke_width": 3,
        "type": "axis",
    },
    {
        "x1": 0,
        "y1": -1,
        "x2": 0,
        "y2": 1,
        "stroke": "#0000ff",  # Blue
        "stroke_width": 3,
        "type": "axis",
    },
]

svg_output = create_svg(
    x_data=x,
    y_data=y,
    size=200,
    lines=lines,
    show_axes=False,
    show_grid=False,
    curve_color="#00ff00",  # Green curve
)

# Print first 1000 chars to see if marker is there
print("DEBUG SVG OUTPUT:")
print(svg_output[:1000])
print("...")
print("Looking for marker definition...")
if "<marker" in svg_output:
    print("FOUND MARKER!")
    marker_start = svg_output.find("<marker")
    marker_end = svg_output.find("</marker>") + 9
    print("Marker definition:", svg_output[marker_start:marker_end])
else:
    print("NO MARKER FOUND!")

if 'marker-end="url(#arrow)"' in svg_output:
    print("FOUND marker-end attribute!")
else:
    print("NO marker-end attribute found!")
