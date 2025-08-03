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


def define_arrow_marker(drawing, arrow_id, color, arrow_size):
    """Defines an arrowhead marker."""
    marker = drawing.marker(
        id=arrow_id,
        viewBox="0 0 8 8",
        refX="1",  # Position arrow to extend beyond line
        refY="4",
        markerWidth=str(arrow_size),
        markerHeight=str(arrow_size),
        orient="auto",
        markerUnits="userSpaceOnUse",  # Use absolute units
    )
    # Less wide, shorter arrow shape
    marker.add(drawing.path(d="M 0 2 L 6 4 L 0 6 z", fill=color))
    drawing.defs.add(marker)


def draw_axes(
    drawing,
    width,
    height,
    x_min,
    x_max,
    y_min,
    y_max,
    color="currentColor",
    stroke_width=1,
    include_arrows=True,
    arrow_size=8,  # Increased default size
):
    """
    Draws the X and Y axes, with optional arrows.
    The arrows are sized based on the `arrow_size` parameter.
    """
    # Determine origin point
    x_origin = width * (-x_min / (x_max - x_min))
    y_origin = height * (y_max / (y_max - y_min))

    # Define unique arrow markers for each axis
    arrow_id_x = "arrow-x"
    define_arrow_marker(drawing, arrow_id_x, color, arrow_size)
    arrow_id_y = "arrow-y"
    define_arrow_marker(drawing, arrow_id_y, color, arrow_size)

    # Y-axis
    drawing.add(
        drawing.line(
            start=(x_origin, height),
            end=(x_origin, 0),
            stroke=color,
            stroke_width=stroke_width,
            marker_end=f"url(#{arrow_id_y})" if include_arrows else None,
        )
    )

    # X-axis
    drawing.add(
        drawing.line(
            start=(0, y_origin),
            end=(width, y_origin),
            stroke=color,
            stroke_width=stroke_width,
            marker_end=f"url(#{arrow_id_x})" if include_arrows else None,
        )
    )


class SVGScene:
    def __init__(self, width, height, x_min, x_max, y_min, y_max, transform_x, transform_y):
        self.width = width
        self.height = height
        self.x_min = x_min
        self.x_max = x_max
        self.y_min = y_min
        self.y_max = y_max
        self.transform_x = transform_x
        self.transform_y = transform_y
        self.show_grid = True
        self.grid_color = "lightgray"
        self.show_axes = True
        self.axes_color = "black"
        self.curves = []
        self.lines = []
        self.foreign_objects = []

    def add_curve(self, x_data, y_data, color):
        self.curves.append({"x_data": x_data, "y_data": y_data, "color": color})

    def add_line(self, line_obj):
        self.lines.append(line_obj)

    def add_foreign_objects(self, foreign_objects):
        self.foreign_objects.extend(foreign_objects)

    def draw_grid(self, drawing, color="lightgray", grid_width=0.5, grid_opacity=0.3):
        """Draws grid lines."""
        if not self.show_grid:
            return

        # Draw vertical lines
        for x in np.arange(self.x_min, self.x_max + 1, 1):
            drawing.add(
                drawing.line(
                    start=(self.transform_x(x), 0),
                    end=(self.transform_x(x), self.height),
                    stroke=color,
                    stroke_width=grid_width,
                    stroke_opacity=grid_opacity,
                )
            )

        # Draw horizontal lines
        for y in np.arange(self.y_min, self.y_max + 1, 1):
            drawing.add(
                drawing.line(
                    start=(0, self.transform_y(y)),
                    end=(self.width, self.transform_y(y)),
                    stroke=color,
                    stroke_width=grid_width,
                    stroke_opacity=grid_opacity,
                )
            )

    def draw_axes(
        self, drawing, color="currentColor", stroke_width=1, include_arrows=True, arrow_size=4
    ):
        """Draws the X and Y axes."""
        if not self.show_axes:
            return

        x_origin = self.transform_x(0)
        y_origin = self.transform_y(0)

        # Define unique arrow markers for each axis
        arrow_id_x = "arrow-x"
        define_arrow_marker(drawing, arrow_id_x, color, arrow_size)
        arrow_id_y = "arrow-y"
        define_arrow_marker(drawing, arrow_id_y, color, arrow_size)

        # Y-axis (from bottom to top to get arrow at top)
        drawing.add(
            drawing.line(
                start=(x_origin, self.height),
                end=(x_origin, 0),
                stroke=color,
                stroke_width=stroke_width,
                marker_end=f"url(#{arrow_id_y})" if include_arrows else None,
            )
        )

        # X-axis (from left to right)
        drawing.add(
            drawing.line(
                start=(0, y_origin),
                end=(self.width, y_origin),
                stroke=color,
                stroke_width=stroke_width,
                marker_end=f"url(#{arrow_id_x})" if include_arrows else None,
            )
        )

    def draw_curves(self, drawing):
        """Draws all curves."""
        for curve_data in self.curves:
            x_data = curve_data["x_data"]
            y_data = curve_data["y_data"]
            color = curve_data["color"]

            points = [(self.transform_x(x), self.transform_y(y)) for x, y in zip(x_data, y_data)]
            if len(points) > 1:
                path_data = f"M {points[0][0]},{points[0][1]} "
                for point in points[1:]:
                    path_data += f"L {point[0]},{point[1]} "
                drawing.add(dwg.path(d=path_data, stroke=color, stroke_width=2, fill="none"))

    def draw_lines(self, drawing):
        """Draws all lines."""
        for line_obj in self.lines:
            # Handle both Line objects and dictionaries
            if hasattr(line_obj, "to_svg_line"):
                # Line object
                line_elem = drawing.line(
                    start=(self.transform_x(line_obj.x1), self.transform_y(line_obj.y1)),
                    end=(self.transform_x(line_obj.x2), self.transform_y(line_obj.y2)),
                    stroke=line_obj.stroke,
                    stroke_width=line_obj.stroke_width,
                )
                if line_obj.stroke_opacity is not None:
                    line_elem["stroke-opacity"] = line_obj.stroke_opacity
                if line_obj.stroke_dasharray:
                    line_elem["stroke-dasharray"] = line_obj.stroke_dasharray
                if line_obj.class_:
                    line_elem["class"] = line_obj.class_
                if line_obj.id:
                    line_elem["id"] = line_obj.id
                if line_obj.style:
                    line_elem["style"] = line_obj.style
                # Check for type field to add arrow
                if hasattr(line_obj, "type") and line_obj.type == "axis":
                    line_elem["marker-end"] = "url(#arrow)"
            else:
                # Dictionary
                line_elem = drawing.line(
                    start=(
                        self.transform_x(line_obj.get("x1")),
                        self.transform_y(line_obj.get("y1")),
                    ),
                    end=(
                        self.transform_x(line_obj.get("x2")),
                        self.transform_y(line_obj.get("y2")),
                    ),
                    stroke=line_obj.get("stroke", "black"),
                    stroke_width=line_obj.get("stroke_width", 1),
                )
                if line_obj.get("stroke_opacity") is not None:
                    line_elem["stroke-opacity"] = line_obj.get("stroke_opacity")
                if line_obj.get("stroke_dasharray"):
                    line_elem["stroke-dasharray"] = line_obj.get("stroke_dasharray")
                if line_obj.get("class"):
                    line_elem["class"] = line_obj.get("class")
                if line_obj.get("id"):
                    line_elem["id"] = line_obj.get("id")
                if line_obj.get("style"):
                    line_elem["style"] = line_obj.get("style")
                # Check for type field to add arrow
                if line_obj.get("type") == "axis":
                    line_elem["marker-end"] = "url(#arrow)"

            drawing.add(line_elem)

    def draw_foreign_objects(self, drawing):
        """Draws all foreign objects."""
        for obj in self.foreign_objects:
            # Handle both dictionary and object formats
            if isinstance(obj, dict):
                x = obj.get("x", 0)
                y = obj.get("y", 0)
                show_point = obj.get("show_point", False)

                # Generate foreignObject XML for dictionary
                svg_x = self.transform_x(x)
                svg_y = self.transform_y(y)
                width = obj.get("width", 100)
                height = obj.get("height", 50)
                latex = obj.get("latex", "")
                style = obj.get("style", "")
                classes = obj.get("class", "svg-latex")

                drawing.add(
                    drawing.foreignObject(
                        insert=(svg_x - width / 2, svg_y - height / 2),
                        size=(width, height),
                        style=f"font-size: 12px; text-align: center; {style}",
                        data_latex=latex,
                        class_=classes,
                    )
                )
            else:
                # Handle object with to_foreign_object_xml method
                if hasattr(obj, "to_foreign_object_xml"):
                    drawing.add(obj.to_foreign_object_xml(self.transform_x, self.transform_y))
                show_point = getattr(obj, "show_point", False)
                x = getattr(obj, "x", 0)
                y = getattr(obj, "y", 0)

            # Add point marker if requested
            if show_point:
                svg_x = self.transform_x(x)
                svg_y = self.transform_y(y)
                drawing.add(drawing.circle(center=(svg_x, svg_y), r=3, fill="red"))

    def to_svg(self):
        """Converts the SVGScene object to an SVG string."""
        dwg = svgwrite.Drawing(size=(self.width, self.height))
        dwg.add(
            dwg.rect(insert=(0, 0), size=(self.width, self.height), fill=resolve_color("white"))
        )

        self.draw_grid(dwg, color=self.grid_color)
        self.draw_axes(dwg, color=self.axes_color)
        self.draw_curves(dwg)
        self.draw_lines(dwg)
        self.draw_foreign_objects(dwg)

        return dwg.tostring()


def create_svg_scene(
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
    **kwargs,
):
    """Minimal SVG creator with lines, curves, and optional LaTeX injection via foreignObject elements"""
    dwg = svgwrite.Drawing(size=(size, size))
    dwg.add(dwg.rect(insert=(0, 0), size=(size, size), fill=resolve_color(bg_color)))

    # Scale data to fit
    margin = 30 if size <= 340 else 40
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

    # Draw grid first (behind everything)
    if show_grid and grid_color and grid_color != "none":
        # Draw grid lines manually
        for x in np.arange(np.ceil(x_min), np.floor(x_max) + 1):
            line_elem = dwg.line(
                start=(transform_x(x), margin),
                end=(transform_x(x), size - margin),
                stroke=grid_color,
                stroke_width=0.5,
                stroke_opacity=0.3,
            )
            dwg.add(line_elem)

        for y in np.arange(np.ceil(y_min), np.floor(y_max) + 1):
            line_elem = dwg.line(
                start=(margin, transform_y(y)),
                end=(size - margin, transform_y(y)),
                stroke=grid_color,
                stroke_width=0.5,
                stroke_opacity=0.3,
            )
            dwg.add(line_elem)

    # Draw axes
    if show_axes:
        draw_axes(
            dwg,
            size,
            size,
            x_min,
            x_max,
            y_min,
            y_max,
            color=axes_color if axes_color else "black",
        )
    else:
        # Even if show_axes is False, we need to define arrow markers for custom axis lines
        define_arrow_marker(dwg, "arrow-x", axes_color if axes_color else "black", 6)
        define_arrow_marker(dwg, "arrow-y", axes_color if axes_color else "black", 6)

    # Prepare lines list
    all_lines = []

    # Add custom lines if provided
    if lines:
        all_lines.extend(lines if isinstance(lines, list) else [lines])

    # Draw all lines
    for line in all_lines:
        # Handle both Line objects and dictionaries
        if hasattr(line, "to_svg_line"):
            # Line object
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
            # Check for type field to add arrow
            if hasattr(line, "type") and line.type == "axis":
                # Determine which arrow to use based on line orientation
                if abs(line.y2 - line.y1) > abs(line.x2 - line.x1):
                    line_elem["marker-end"] = "url(#arrow-y)"
                else:
                    line_elem["marker-end"] = "url(#arrow-x)"
        else:
            # Dictionary
            line_elem = dwg.line(
                start=(transform_x(line.get("x1")), transform_y(line.get("y1"))),
                end=(transform_x(line.get("x2")), transform_y(line.get("y2"))),
                stroke=line.get("stroke", "black"),
                stroke_width=line.get("stroke_width", 1),
            )
            if line.get("stroke_opacity") is not None:
                line_elem["stroke-opacity"] = line.get("stroke_opacity")
            if line.get("stroke_dasharray"):
                line_elem["stroke-dasharray"] = line.get("stroke_dasharray")
            if line.get("class"):
                line_elem["class"] = line.get("class")
            if line.get("id"):
                line_elem["id"] = line.get("id")
            if line.get("style"):
                line_elem["style"] = line.get("style")
            # Check for type field to add arrow
            if line.get("type") == "axis":
                # Determine which arrow to use based on line orientation
                x1, y1 = line.get("x1", 0), line.get("y1", 0)
                x2, y2 = line.get("x2", 0), line.get("y2", 0)
                if abs(y2 - y1) > abs(x2 - x1):
                    line_elem["marker-end"] = "url(#arrow-y)"
                else:
                    line_elem["marker-end"] = "url(#arrow-x)"

        dwg.add(line_elem)

    # Draw curve
    points = [(transform_x(x), transform_y(y)) for x, y in zip(x_data, y_data)]
    if len(points) > 1:
        path_data = f"M {points[0][0]},{points[0][1]} "
        for point in points[1:]:
            path_data += f"L {point[0]},{point[1]} "
        dwg.add(dwg.path(d=path_data, stroke=curve_color, stroke_width=2, fill="none"))

    svg_string = dwg.tostring()

    # Aggressively ensure arrows are present
    # This function is no longer defined, so we'll skip this for now
    # svg_string = ensure_arrows_in_svg(svg_string)

    # Inject foreign objects if provided
    if foreign_objects:
        # Validate and convert to ForeignObject instances
        if isinstance(foreign_objects, list) and len(foreign_objects) > 0:
            if isinstance(foreign_objects[0], dict):
                # This function is no longer defined, so we'll skip foreign object validation for now
                pass

        foreign_object_xmls = []
        for obj in foreign_objects:
            # Handle both dictionary and object formats
            if isinstance(obj, dict):
                x = obj.get("x", 0)
                y = obj.get("y", 0)
                show_point = obj.get("show_point", False)

                # Generate foreignObject XML for dictionary
                svg_x = transform_x(x)
                svg_y = transform_y(y)
                width = obj.get("width", 100)
                height = obj.get("height", 50)
                latex = obj.get("latex", "")
                style = obj.get("style", "")
                classes = obj.get("class", "svg-latex")

                foreign_object_xmls.append(
                    f'<foreignObject x="{svg_x - width / 2}" y="{svg_y - height / 2}" '
                    f'width="{width}" height="{height}">'
                    f'<div xmlns="http://www.w3.org/1999/xhtml" class="{classes}" '
                    f'style="{style}" data-latex="{latex}"></div>'
                    f"</foreignObject>"
                )
            else:
                # Handle object with to_foreign_object_xml method
                if hasattr(obj, "to_foreign_object_xml"):
            foreign_object_xmls.append(obj.to_foreign_object_xml(transform_x, transform_y))
                show_point = getattr(obj, "show_point", False)
                x = getattr(obj, "x", 0)
                y = getattr(obj, "y", 0)

            # Add point marker if requested
            if show_point:
                svg_x = transform_x(x)
                svg_y = transform_y(y)
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
    margin = 30 if size <= 340 else 40
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

    # Draw grid first (behind everything)
    if show_grid and grid_color and grid_color != "none":
        # Draw grid lines manually
        for x in np.arange(np.ceil(x_min), np.floor(x_max) + 1):
            line_elem = dwg.line(
                start=(transform_x(x), margin),
                end=(transform_x(x), size - margin),
                stroke=grid_color,
                stroke_width=0.5,
                stroke_opacity=0.3,
            )
            dwg.add(line_elem)

        for y in np.arange(np.ceil(y_min), np.floor(y_max) + 1):
            line_elem = dwg.line(
                start=(margin, transform_y(y)),
                end=(size - margin, transform_y(y)),
                stroke=grid_color,
                stroke_width=0.5,
                stroke_opacity=0.3,
            )
            dwg.add(line_elem)

    # Draw axes
    if show_axes:
        draw_axes(
            dwg,
            size,
            size,
            x_min,
            x_max,
            y_min,
            y_max,
            color=axes_color,
        )
    else:
        # Even if show_axes is False, we need to define arrow markers for custom axis lines
        # We'll create them with a default color and update per line if needed
        pass

    # Prepare lines list
    all_lines = []

    # Add custom lines if provided
    if lines:
        all_lines.extend(lines if isinstance(lines, list) else [lines])

    # Create arrow markers for axis lines with their specific colors
    arrow_markers_created = set()
    for line in all_lines:
        if isinstance(line, dict) and line.get("type") == "axis":
            # Skip if line has 'no-arrow' class
            if "no-arrow" in line.get("class", ""):
                continue
            stroke_color = line.get("stroke", "black")
            marker_id = f"arrow-{stroke_color.replace('#', '')}"
            if marker_id not in arrow_markers_created:
                define_arrow_marker(dwg, marker_id, stroke_color, 8)  # Increased size
                arrow_markers_created.add(marker_id)

    # Draw all lines
    for line in all_lines:
        # Handle both Line objects and dictionaries
        if hasattr(line, "x1"):
            # Line object
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
            # Check for type field to add arrow
            if hasattr(line, "type") and line.type == "axis":
                # Use color-specific arrow marker
                stroke_color = getattr(line, "stroke", "black")
                marker_id = f"arrow-{stroke_color.replace('#', '')}"
                line_elem["marker-end"] = f"url(#{marker_id})"
        else:
            # Dictionary
            line_elem = dwg.line(
                start=(transform_x(line.get("x1")), transform_y(line.get("y1"))),
                end=(transform_x(line.get("x2")), transform_y(line.get("y2"))),
                stroke=line.get("stroke", "black"),
                stroke_width=line.get("stroke_width", 1),
            )
            if line.get("stroke_opacity") is not None:
                line_elem["stroke-opacity"] = line.get("stroke_opacity")
            if line.get("stroke_dasharray"):
                line_elem["stroke-dasharray"] = line.get("stroke_dasharray")
            if line.get("class"):
                line_elem["class"] = line.get("class")
            if line.get("id"):
                line_elem["id"] = line.get("id")
            if line.get("style"):
                line_elem["style"] = line.get("style")
            # Check for type field to add arrow
            if line.get("type") == "axis":
                # Skip arrow if line has 'no-arrow' class
                if "no-arrow" not in line.get("class", ""):
                    # Use color-specific arrow marker
                    stroke_color = line.get("stroke", "black")
                    marker_id = f"arrow-{stroke_color.replace('#', '')}"
                    line_elem["marker-end"] = f"url(#{marker_id})"

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

    # Aggressively ensure arrows are present
    # This function is no longer defined, so we'll skip this for now
    # svg_string = ensure_arrows_in_svg(svg_string)

    # Inject foreign objects if provided
    if foreign_objects:
        # Validate and convert to ForeignObject instances
        if isinstance(foreign_objects, list) and len(foreign_objects) > 0:
            if isinstance(foreign_objects[0], dict):
                # This function is no longer defined, so we'll skip foreign object validation for now
                pass

        foreign_object_xmls = []
        for obj in foreign_objects:
            # Handle both dictionary and object formats
            if isinstance(obj, dict):
                x = obj.get("x", 0)
                y = obj.get("y", 0)
                show_point = obj.get("show_point", False)

                # Generate foreignObject XML for dictionary
                svg_x = transform_x(x)
                svg_y = transform_y(y)
                width = obj.get("width", 100)
                height = obj.get("height", 50)
                latex = obj.get("latex", "")
                style = obj.get("style", "")
                classes = obj.get("class", "svg-latex")

                foreign_object_xmls.append(
                    f'<foreignObject x="{svg_x - width / 2}" y="{svg_y - height / 2}" '
                    f'width="{width}" height="{height}">'
                    f'<div xmlns="http://www.w3.org/1999/xhtml" class="{classes}" '
                    f'style="{style}" data-latex="{latex}"></div>'
                    f"</foreignObject>"
                )
            else:
                # Handle object with to_foreign_object_xml method
                if hasattr(obj, "to_foreign_object_xml"):
            foreign_object_xmls.append(obj.to_foreign_object_xml(transform_x, transform_y))
                show_point = getattr(obj, "show_point", False)
                x = getattr(obj, "x", 0)
                y = getattr(obj, "y", 0)

            # Add point marker if requested
            if show_point:
                svg_x = transform_x(x)
                svg_y = transform_y(y)
                foreign_object_xmls.append(f'<circle cx="{svg_x}" cy="{svg_y}" r="3" fill="red"/>')

        injection_point = svg_string.rfind("</svg>")
        svg_string = (
            svg_string[:injection_point]
            + "\n".join(foreign_object_xmls)
            + svg_string[injection_point:]
        )

    return svg_string
