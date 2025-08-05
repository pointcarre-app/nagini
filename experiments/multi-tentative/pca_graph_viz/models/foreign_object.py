"""
ForeignObject model for SVG LaTeX annotations using Pydantic validation
"""

from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field, field_validator


class ForeignObject(BaseModel):
    """
    Model for SVG foreignObject elements containing LaTeX content.

    Uses exact SVG foreignObject attributes plus data attributes for content.
    """

    # SVG foreignObject positioning attributes (required for our use case)
    x: float = Field(..., description="X coordinate in SVG space")
    y: float = Field(..., description="Y coordinate in SVG space")

    # SVG foreignObject dimension attributes
    width: int = Field(default=80, gt=0, description="Width in pixels")
    height: int = Field(default=30, gt=0, description="Height in pixels")

    # Standard HTML/SVG attributes
    id: Optional[str] = Field(default=None, description="Element ID")
    class_: Optional[str] = Field(default="svg-latex", alias="class", description="CSS class names")
    style: Optional[str] = Field(default=None, description="Inline CSS style")
    transform: Optional[str] = Field(default=None, description="SVG transform")

    # Data attributes (custom attributes prefixed with data-)
    data_latex: str = Field(..., alias="data-latex", description="LaTeX expression to render")

    # Additional rendering options (not HTML attributes)
    show_point: bool = Field(
        default=False, description="Show a red dot at the coordinate (helper, not an attribute)"
    )

    @field_validator("style")
    @classmethod
    def validate_style(cls, v: Optional[str]) -> Optional[str]:
        """Validate CSS style string"""
        if v is None:
            return v
        # Basic validation - should be CSS property: value pairs
        if v and ":" not in v:
            raise ValueError(f"Invalid CSS style string: {v}")
        return v

    @field_validator("class_")
    @classmethod
    def validate_class(cls, v: Optional[str]) -> Optional[str]:
        """Ensure svg-latex is always included in classes"""
        if v is None:
            return "svg-latex"
        if "svg-latex" not in v:
            return f"svg-latex {v}"
        return v

    def to_foreign_object_xml(
        self, transform_x: callable = None, transform_y: callable = None, margin: float = 0
    ) -> str:
        """
        Generate the foreignObject XML string.

        Args:
            transform_x: Optional function to transform x coordinate from data to SVG space
            transform_y: Optional function to transform y coordinate from data to SVG space
            margin: Margin offset to add to coordinates (default 0)

        Returns:
            XML string for the foreignObject element
        """
        # Apply coordinate transformation if provided
        svg_x = transform_x(self.x) if transform_x else self.x
        svg_y = transform_y(self.y) if transform_y else self.y

        # Center foreignObject on the point and add margin
        fo_x = svg_x - self.width / 2 + margin
        fo_y = svg_y - self.height / 2 + margin

        # Build attribute string
        attrs = [f'x="{fo_x}"', f'y="{fo_y}"', f'width="{self.width}"', f'height="{self.height}"']

        if self.id:
            attrs.append(f'id="{self.id}"')

        if self.transform:
            attrs.append(f'transform="{self.transform}"')

        # Build inner div attributes
        div_attrs = [
            'xmlns="http://www.w3.org/1999/xhtml"',
            f'class="{self.class_}"',
            f'data-latex="{self.data_latex}"',
        ]

        if self.style:
            div_attrs.append(f'style="{self.style}"')

        return f"<foreignObject {' '.join(attrs)}><div {' '.join(div_attrs)}></div></foreignObject>"


def create_foreign_object(
    x: float,
    y: float,
    latex: str,
    width: int = 80,
    height: int = 30,
    style: Optional[str] = None,
    class_name: Optional[str] = None,
    id: Optional[str] = None,
    show_point: bool = False,
) -> ForeignObject:
    """
    Convenience function to create a ForeignObject with common parameters.

    Args:
        x, y: Coordinates in data space
        latex: LaTeX expression
        width, height: Dimensions in pixels
        style: CSS style string (e.g., "color: red; background: rgba(0,0,0,0.1)")
        class_name: Additional CSS classes
        id: Element ID
        show_point: Whether to show a point marker
    """
    return ForeignObject(
        x=x,
        y=y,
        width=width,
        height=height,
        style=style,
        **{"class": class_name} if class_name else {},
        id=id,
        **{"data-latex": latex},
        show_point=show_point,
    )


def validate_foreign_objects(objects: List[Dict[str, Any]]) -> List[ForeignObject]:
    """
    Validate a list of foreign object dictionaries.

    Handles both old format (with separate style properties) and new format.

    Args:
        objects: List of dictionaries with foreign object data

    Returns:
        List of validated ForeignObject instances
    """
    validated = []

    for obj in objects:
        # Handle old format with separate style properties
        if any(
            key in obj
            for key in ["bg_color", "text_color", "border_radius", "font_weight", "padding"]
        ):
            # Build style string from individual properties
            style_parts = []

            if obj.get("bg_color"):
                style_parts.append(f"background-color: {obj['bg_color']}")

            if obj.get("text_color"):
                style_parts.append(f"color: {obj['text_color']}")

            if obj.get("border_radius"):
                style_parts.append(f"border-radius: {obj['border_radius']}")

            if obj.get("font_weight"):
                style_parts.append(f"font-weight: {obj['font_weight']}")

            if obj.get("font_size"):
                style_parts.append(f"font-size: {obj['font_size']}")

            if obj.get("padding"):
                style_parts.append(f"padding: {obj['padding']}")

            # Create new object with proper attributes
            new_obj = {
                "x": obj["x"],
                "y": obj["y"],
                "data-latex": obj.get("latex", obj.get("data-latex", "")),
                "width": obj.get("width", 80),
                "height": obj.get("height", 30),
                "style": "; ".join(style_parts) if style_parts else None,
                "show_point": obj.get("show_point", False),
            }

            validated.append(ForeignObject(**new_obj))
        else:
            # Handle new format or already correct format
            if "latex" in obj and "data-latex" not in obj:
                obj["data-latex"] = obj.pop("latex")
            validated.append(ForeignObject(**obj))

    return validated
