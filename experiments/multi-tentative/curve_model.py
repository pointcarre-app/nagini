from typing import TypedDict, List, Optional, Union
import numpy as np


class CurveDefinition(TypedDict):
    """Data model for a curve in the graph"""

    x_data: Union[List[float], np.ndarray]
    y_data: Union[List[float], np.ndarray]
    color: str
    stroke_width: Optional[float]  # Default: 2
    stroke_dasharray: Optional[str]  # e.g., "5,5" for dashed
    class_name: Optional[str]  # CSS class
    label: Optional[str]  # Curve label for legend


# Example usage:
# Assuming you have x, y_identity, y_minus_identity defined
"""
x = np.linspace(-1, 1, 100)
y_identity = x
y_minus_identity = -x

curves = [
    {
        "x_data": x,
        "y_data": y_identity,
        "color": "#6b46c1",  # Purple
        "label": "y = x",
        "class_name": "identity-curve"
    },
    {
        "x_data": x,
        "y_data": y_minus_identity,
        "color": "#c7366f",  # Red-pink
        "label": "y = -x",
        "class_name": "minus-identity-curve"
    }
]
"""

# Alternative with Pydantic (if you prefer validation):
"""
from pydantic import BaseModel
from typing import List, Optional, Union
import numpy as np

class Curve(BaseModel):
    x_data: Union[List[float], np.ndarray]
    y_data: Union[List[float], np.ndarray]
    color: str
    stroke_width: float = 2.0
    stroke_dasharray: Optional[str] = None
    class_name: Optional[str] = None
    label: Optional[str] = None
    
    class Config:
        arbitrary_types_allowed = True  # For numpy arrays
"""
