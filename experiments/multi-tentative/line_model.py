from pydantic import BaseModel
from typing import Optional
from enum import Enum


class LineType(str, Enum):
    """Type of line to draw"""

    CURVE = "curve"
    AXIS = "axis"


class Line(BaseModel):
    """Pydantic model for a line in SVG graphs"""

    x1: float
    y1: float
    x2: float
    y2: float
    stroke: str
    stroke_width: float = 2.0
    stroke_opacity: Optional[float] = None
    stroke_dasharray: Optional[str] = None
    class_: Optional[str] = None  # 'class' is reserved, so use 'class_'
    id: Optional[str] = None
    style: Optional[str] = None
    type: LineType = LineType.CURVE  # Default to curve (no arrows)

    class Config:
        # Allow using 'class' as field name in dict input
        fields = {"class_": "class"}
        use_enum_values = True  # This allows string values to be used


# Example usage:
if __name__ == "__main__":
    # Create axis lines with arrows
    x_axis = Line(
        x1=-5,
        y1=0,
        x2=5,
        y2=0,
        stroke="#333333",
        stroke_width=2,
        class_="axis x-axis",
        type=LineType.AXIS,  # This will add an arrow
    )

    y_axis = Line(
        x1=0,
        y1=-5,
        x2=0,
        y2=5,
        stroke="#333333",
        stroke_width=2,
        class_="axis y-axis",
        type=LineType.AXIS,  # This will add an arrow
    )

    # Create a reference line without arrow
    ref_line = Line(
        x1=-5,
        y1=2.5,
        x2=5,
        y2=2.5,
        stroke="#cccccc",
        stroke_width=1,
        stroke_dasharray="3,3",
        class_="reference-line",
        type=LineType.CURVE,  # No arrow
    )

    # Convert to dict for use in SVG functions
    lines = [x_axis.dict(by_alias=True), y_axis.dict(by_alias=True), ref_line.dict(by_alias=True)]
    print(lines)
