# Shared SVG creation utilities
import numpy as np
import svgwrite

# Note: ForeignObject, Line and related functions are loaded in global namespace by Pyodide


# Simple color resolution
def resolve_color(color):
    """Resolve color to appropriate format for SVG"""
    if not color:
        return "black"
    return color


def create_svg(
    x_data,
    y_data,
    size=400,
    foreign_objects=None,
    lines=None,
    bg_color="white",
    axes_color=None,
    grid_color=None,
    curve_color=None,
    show_axes=True,
    show_grid=True,
):
    """Minimal SVG creator with lines, curves, and optional LaTeX injection via foreignObject elements"""
    dwg = svgwrite.Drawing(size=(size, size))
    dwg.add(dwg.rect(insert=(0, 0), size=(size, size), fill=resolve_color(bg_color)))

    # Scale data to fit
    margin = 30 if size <= 335 else 40
    plot_size = size - 2 * margin
    x_min, x_max = np.min(x_data), np.max(x_data)
    y_min, y_max = np.min(y_data), np.max(y_data)

    # Add padding
    x_range = x_max - x_min
    y_range = y_max - y_min
    x_min -= x_range * 0.1
    x_max += x_range * 0.1
    y_min -= y_range * 0.1
    y_max += y_range * 0.1

    def transform_x(x):
        return margin + (x - x_min) / (x_max - x_min) * plot_size

    def transform_y(y):
        return margin + plot_size - (y - y_min) / (y_max - y_min) * plot_size

    # Resolve colors
    axes_color = resolve_color(axes_color) if axes_color else "black"
    grid_color = resolve_color(grid_color) if grid_color else "lightgray"
    curve_color = resolve_color(curve_color) if curve_color else "blue"

    # Prepare lines list
    all_lines = []

    # Add grid lines if requested
    if show_grid and grid_color and grid_color != "none":
        grid_lines = create_grid_lines(
            x_min, x_max, y_min, y_max, grid_color=grid_color, grid_width=0.5, grid_opacity=0.3
        )
        all_lines.extend(grid_lines)

    # Add axes if requested
    if show_axes:
        axis_lines = create_axis_lines(
            x_min, x_max, y_min, y_max, axes_color=axes_color, axes_width=2
        )
        all_lines.extend(axis_lines)

    # Add custom lines if provided
    if lines:
        if isinstance(lines, list) and len(lines) > 0:
            if isinstance(lines[0], dict):
                lines = validate_lines(lines)
        all_lines.extend(lines)

    # Draw all lines
    for line in all_lines:
        svg_line = line.to_svg_line(transform_x, transform_y)
        # Parse and add the line element
        # Since svgwrite doesn't have a direct way to add raw SVG, we need to parse it
        # For now, we'll add it to a group
        line_elem = dwg.line(
            start=(transform_x(line.x1), transform_y(line.y1)),
            end=(transform_x(line.x2), transform_y(line.y2)),
            stroke=line.stroke,
            stroke_width=line.stroke_width,
        )
        if line.stroke_opacity is not None:
            line_elem["stroke-opacity"] = line.stroke_opacity
        if line.stroke_dasharray:
            line_elem["stroke-dasharray"] = line.stroke_dasharray
        if line.class_:
            line_elem["class"] = line.class_
        if line.id:
            line_elem["id"] = line.id
        if line.style:
            line_elem["style"] = line.style
        dwg.add(line_elem)

    # Draw curve
    points = [(transform_x(x), transform_y(y)) for x, y in zip(x_data, y_data)]
    if len(points) > 1:
        path_data = f"M {points[0][0]},{points[0][1]} "
        for point in points[1:]:
            path_data += f"L {point[0]},{point[1]} "
        dwg.add(dwg.path(d=path_data, stroke=curve_color, stroke_width=2, fill="none"))

    svg_string = dwg.tostring()

    # Inject foreign objects if provided
    if foreign_objects:
        # Validate and convert to ForeignObject instances
        if isinstance(foreign_objects, list) and len(foreign_objects) > 0:
            if isinstance(foreign_objects[0], dict):
                foreign_objects = validate_foreign_objects(foreign_objects)

        foreign_object_xmls = []
        for obj in foreign_objects:
            # Generate the foreignObject XML with transform functions
            foreign_object_xmls.append(obj.to_foreign_object_xml(transform_x, transform_y))

            # Add point marker if requested
            if obj.show_point:
                svg_x = transform_x(obj.x)
                svg_y = transform_y(obj.y)
                foreign_object_xmls.append(f'<circle cx="{svg_x}" cy="{svg_y}" r="3" fill="red"/>')

        injection_point = svg_string.rfind("</svg>")
        svg_string = (
            svg_string[:injection_point]
            + "\n".join(foreign_object_xmls)
            + svg_string[injection_point:]
        )

    return svg_string


def create_multi_curve_svg(
    x_data,
    y_data_list,
    size=400,
    colors=None,
    bg_color="white",
    foreign_objects=None,
    lines=None,
    axes_color=None,
    grid_color=None,
    show_axes=True,
    show_grid=True,
):
    """Create SVG with multiple curves, lines, and optional foreignObject elements"""
    if colors is None:
        colors = ["blue", "red", "green", "orange", "purple"]

    # Use first curve to set up the SVG
    dwg = svgwrite.Drawing(size=(size, size))
    dwg.add(dwg.rect(insert=(0, 0), size=(size, size), fill=resolve_color(bg_color)))

    # Scale data to fit (use all curves to determine range)
    margin = 30 if size <= 335 else 40
    plot_size = size - 2 * margin

    all_x = []
    all_y = []
    for y_data in y_data_list:
        all_x.extend(x_data)
        all_y.extend(y_data)

    x_min, x_max = np.min(all_x), np.max(all_x)
    y_min, y_max = np.min(all_y), np.max(all_y)

    # Add padding
    x_range = x_max - x_min
    y_range = y_max - y_min
    x_min -= x_range * 0.1
    x_max += x_range * 0.1
    y_min -= y_range * 0.1
    y_max += y_range * 0.1

    def transform_x(x):
        return margin + (x - x_min) / (x_max - x_min) * plot_size

    def transform_y(y):
        return margin + plot_size - (y - y_min) / (y_max - y_min) * plot_size

    # Resolve colors
    axes_color = resolve_color(axes_color) if axes_color else "black"
    grid_color = resolve_color(grid_color) if grid_color else "lightgray"

    # Prepare lines list
    all_lines = []

    # Add grid lines if requested
    if show_grid and grid_color and grid_color != "none":
        grid_lines = create_grid_lines(
            x_min, x_max, y_min, y_max, grid_color=grid_color, grid_width=0.5, grid_opacity=0.3
        )
        all_lines.extend(grid_lines)

    # Add axes if requested
    if show_axes:
        axis_lines = create_axis_lines(
            x_min, x_max, y_min, y_max, axes_color=axes_color, axes_width=2
        )
        all_lines.extend(axis_lines)

    # Add custom lines if provided
    if lines:
        if isinstance(lines, list) and len(lines) > 0:
            if isinstance(lines[0], dict):
                lines = validate_lines(lines)
        all_lines.extend(lines)

    # Draw all lines
    for line in all_lines:
        line_elem = dwg.line(
            start=(transform_x(line.x1), transform_y(line.y1)),
            end=(transform_x(line.x2), transform_y(line.y2)),
            stroke=line.stroke,
            stroke_width=line.stroke_width,
        )
        if line.stroke_opacity is not None:
            line_elem["stroke-opacity"] = line.stroke_opacity
        if line.stroke_dasharray:
            line_elem["stroke-dasharray"] = line.stroke_dasharray
        if line.class_:
            line_elem["class"] = line.class_
        if line.id:
            line_elem["id"] = line.id
        if line.style:
            line_elem["style"] = line.style
        dwg.add(line_elem)

    # Draw curves
    for i, y_data in enumerate(y_data_list):
        points = [(transform_x(x), transform_y(y)) for x, y in zip(x_data, y_data)]
        if len(points) > 1:
            path_data = f"M {points[0][0]},{points[0][1]} "
            for point in points[1:]:
                path_data += f"L {point[0]},{point[1]} "
            color = resolve_color(colors[i % len(colors)])
            dwg.add(dwg.path(d=path_data, stroke=color, stroke_width=2, fill="none"))

    svg_string = dwg.tostring()

    # Inject foreign objects if provided
    if foreign_objects:
        # Validate and convert to ForeignObject instances
        if isinstance(foreign_objects, list) and len(foreign_objects) > 0:
            if isinstance(foreign_objects[0], dict):
                foreign_objects = validate_foreign_objects(foreign_objects)

        foreign_object_xmls = []
        for obj in foreign_objects:
            # Generate the foreignObject XML with transform functions
            foreign_object_xmls.append(obj.to_foreign_object_xml(transform_x, transform_y))

            # Add point marker if requested
            if obj.show_point:
                svg_x = transform_x(obj.x)
                svg_y = transform_y(obj.y)
                foreign_object_xmls.append(f'<circle cx="{svg_x}" cy="{svg_y}" r="3" fill="red"/>')

        injection_point = svg_string.rfind("</svg>")
        svg_string = (
            svg_string[:injection_point]
            + "\n".join(foreign_object_xmls)
            + svg_string[injection_point:]
        )

    return svg_string
