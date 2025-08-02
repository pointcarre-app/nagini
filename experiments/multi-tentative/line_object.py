"""
Line model for SVG lines using Pydantic validation
"""

from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field, field_validator


class Line(BaseModel):
    """
    Model for SVG line elements with exact SVG attributes.

    Coordinates can be in data space and will be transformed to SVG space.
    """

    # Line endpoints (required)
    x1: float = Field(..., description="Start X coordinate in data space")
    y1: float = Field(..., description="Start Y coordinate in data space")
    x2: float = Field(..., description="End X coordinate in data space")
    y2: float = Field(..., description="End Y coordinate in data space")

    # SVG line attributes
    stroke: str = Field(default="black", description="Stroke color")
    stroke_width: float = Field(default=1, description="Stroke width")
    stroke_opacity: Optional[float] = Field(
        default=None, ge=0, le=1, description="Stroke opacity (0-1)"
    )
    stroke_dasharray: Optional[str] = Field(default=None, description="Dash pattern (e.g., '5,5')")
    stroke_linecap: Optional[str] = Field(
        default=None, description="Line cap style: butt, round, square"
    )
    stroke_linejoin: Optional[str] = Field(
        default=None, description="Line join style: miter, round, bevel"
    )

    # Standard SVG attributes
    id: Optional[str] = Field(default=None, description="Element ID")
    class_: Optional[str] = Field(default=None, alias="class", description="CSS class names")
    style: Optional[str] = Field(default=None, description="Inline CSS style")
    transform: Optional[str] = Field(default=None, description="SVG transform")

    @field_validator("stroke")
    @classmethod
    def validate_color(cls, v: str) -> str:
        """Basic color validation"""
        if not v:
            raise ValueError("Stroke color cannot be empty")
        return v

    @field_validator("stroke_linecap")
    @classmethod
    def validate_linecap(cls, v: Optional[str]) -> Optional[str]:
        """Validate line cap values"""
        if v and v not in ["butt", "round", "square"]:
            raise ValueError(f"Invalid stroke-linecap: {v}")
        return v

    @field_validator("stroke_linejoin")
    @classmethod
    def validate_linejoin(cls, v: Optional[str]) -> Optional[str]:
        """Validate line join values"""
        if v and v not in ["miter", "round", "bevel"]:
            raise ValueError(f"Invalid stroke-linejoin: {v}")
        return v

    def to_svg_line(self, transform_x: callable = None, transform_y: callable = None) -> str:
        """
        Generate the SVG line element string.

        Args:
            transform_x: Optional function to transform x coordinates from data to SVG space
            transform_y: Optional function to transform y coordinates from data to SVG space

        Returns:
            XML string for the line element
        """
        # Apply coordinate transformation if provided
        svg_x1 = transform_x(self.x1) if transform_x else self.x1
        svg_y1 = transform_y(self.y1) if transform_y else self.y1
        svg_x2 = transform_x(self.x2) if transform_x else self.x2
        svg_y2 = transform_y(self.y2) if transform_y else self.y2

        # Build attribute string
        attrs = [
            f'x1="{svg_x1}"',
            f'y1="{svg_y1}"',
            f'x2="{svg_x2}"',
            f'y2="{svg_y2}"',
            f'stroke="{self.stroke}"',
            f'stroke-width="{self.stroke_width}"',
        ]

        if self.stroke_opacity is not None:
            attrs.append(f'stroke-opacity="{self.stroke_opacity}"')

        if self.stroke_dasharray:
            attrs.append(f'stroke-dasharray="{self.stroke_dasharray}"')

        if self.stroke_linecap:
            attrs.append(f'stroke-linecap="{self.stroke_linecap}"')

        if self.stroke_linejoin:
            attrs.append(f'stroke-linejoin="{self.stroke_linejoin}"')

        if self.id:
            attrs.append(f'id="{self.id}"')

        if self.class_:
            attrs.append(f'class="{self.class_}"')

        if self.style:
            attrs.append(f'style="{self.style}"')

        if self.transform:
            attrs.append(f'transform="{self.transform}"')

        return f"<line {' '.join(attrs)} />"


def create_axis_lines(
    x_min: float,
    x_max: float,
    y_min: float,
    y_max: float,
    axes_color: str = "black",
    axes_width: float = 2,
) -> List[Line]:
    """
    Create horizontal and vertical axis lines at y=0 and x=0.

    Args:
        x_min, x_max: X-axis range
        y_min, y_max: Y-axis range
        axes_color: Color for axes
        axes_width: Width for axes

    Returns:
        List containing x-axis and/or y-axis lines if they're in range
    """
    lines = []

    # X-axis (horizontal line at y=0)
    if y_min <= 0 <= y_max:
        lines.append(
            Line(
                x1=x_min,
                y1=0,
                x2=x_max,
                y2=0,
                stroke=axes_color,
                stroke_width=axes_width,
                class_="axis x-axis",
            )
        )

    # Y-axis (vertical line at x=0)
    if x_min <= 0 <= x_max:
        lines.append(
            Line(
                x1=0,
                y1=y_min,
                x2=0,
                y2=y_max,
                stroke=axes_color,
                stroke_width=axes_width,
                class_="axis y-axis",
            )
        )

    return lines


def create_grid_lines(
    x_min: float,
    x_max: float,
    y_min: float,
    y_max: float,
    grid_count: int = 10,
    grid_color: str = "lightgray",
    grid_width: float = 0.5,
    grid_opacity: float = 0.3,
) -> List[Line]:
    """
    Create grid lines.

    Args:
        x_min, x_max: X-axis range
        y_min, y_max: Y-axis range
        grid_count: Number of grid lines in each direction
        grid_color: Color for grid lines
        grid_width: Width for grid lines
        grid_opacity: Opacity for grid lines

    Returns:
        List of grid lines
    """
    lines = []

    # Vertical grid lines
    for i in range(grid_count + 1):
        x = x_min + i * (x_max - x_min) / grid_count
        lines.append(
            Line(
                x1=x,
                y1=y_min,
                x2=x,
                y2=y_max,
                stroke=grid_color,
                stroke_width=grid_width,
                stroke_opacity=grid_opacity,
                class_="grid-line vertical",
            )
        )

    # Horizontal grid lines
    for i in range(grid_count + 1):
        y = y_min + i * (y_max - y_min) / grid_count
        lines.append(
            Line(
                x1=x_min,
                y1=y,
                x2=x_max,
                y2=y,
                stroke=grid_color,
                stroke_width=grid_width,
                stroke_opacity=grid_opacity,
                class_="grid-line horizontal",
            )
        )

    return lines


def validate_lines(lines: List[Dict[str, Any]]) -> List[Line]:
    """
    Validate a list of line dictionaries.

    Args:
        lines: List of dictionaries with line data

    Returns:
        List of validated Line instances
    """
    return [Line(**line) for line in lines]
