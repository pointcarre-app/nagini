from typing import Any, Dict

import sympy as sp
from pydantic import (
    BaseModel,
    ConfigDict,
    field_validator,
    field_serializer,
    model_validator,
)


class MathsObject(BaseModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)

    sympy_expr: sp.Expr

    def __str__(self):
        return sp.srepr(self.sympy_expr)

    @field_serializer("sympy_expr")
    def serialize_sympy_expr(self, value: sp.Expr) -> Dict[str, Any]:
        # This serializes any sympy expression to a JSON-compatible format
        return {"type": value.__class__.__name__, "sp.srepr": sp.srepr(value), "str": str(value)}


# class Number(MathsObject):

#     sympy_expr: sp.Number

#     # @field_validator('sympy_expr', mode='before')
#     # @classmethod
#     # def convert_to_sympy_number(cls, value: Any) -> sp.Number:
#     #     if isinstance(value, (int, float)):
#     #         return sp.Number(value)
#     #     return value

#     @property
#     def simplified(self) -> "Number":
#         if self.sympy_expr.is_Integer:
#             return self
#         else:
#             raise NotImplementedError

#     def __str__(self):
#         return str(self.sympy_expr)


class Integer(MathsObject):
    n: int
    sympy_expr: sp.Integer

    @model_validator(mode="before")
    @classmethod
    def compute_sympy_expr(cls, data: Dict[str, Any]) -> Dict[str, Any]:
        data["sympy_expr"] = sp.Integer(data["n"])
        return data

    def __int__(self):
        return self.n

    def __str__(self):
        return str(self.n)

    def __mul__(self, other):
        return Integer(n=self.n * other.n)

    @property
    def latex(self):
        return str(self.n)


class Fraction(MathsObject):
    p: Integer
    q: Integer
    sympy_expr: sp.Rational

    @field_validator("p", mode="before")
    @classmethod
    def convert_to_integer(cls, value: int | Integer) -> Integer:
        if isinstance(value, int):
            return Integer(n=value)
        return value

    @field_validator("q", mode="before")
    @classmethod
    def validate_denominator(cls, value: int | Integer) -> Integer:
        if value == 0:
            raise ValueError("Denominator cannot be zero")
        if isinstance(value, int):
            return Integer(n=value)
        return value

    @model_validator(mode="before")
    @classmethod
    def compute_sympy_expr(cls, data: Dict[str, Any]) -> Dict[str, Any]:
        data["sympy_expr"] = sp.Rational(int(data["p"]), int(data["q"]))
        return data

    @property
    def simplified(self):
        gcd = sp.gcd(self.p.sympy_expr, self.q.sympy_expr)
        return Fraction(p=int(self.p / gcd), q=int(self.q / gcd))

    @property
    def latex(self):
        return "\\dfrac\{" + self.p.latex + "}{" + self.q.latex + "}"
