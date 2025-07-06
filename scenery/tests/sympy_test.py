import sympy as sp
from sympy import symbols, expand, factor, solve, diff, integrate

# Define symbols
x, y, z = symbols("x y z")

# Basic algebraic operations
expr = (x + y) ** 2
expanded = expand(expr)
print(f"Expanded (x + y)^2 = {expanded}")

# Factoring
factored = factor(x**2 - 4)
print(f"Factored x^2 - 4 = {factored}")

# Solving equations
equation = x**2 - 4 * x + 3
solutions = solve(equation, x)
print(f"Solutions to x^2 - 4x + 3 = 0: {solutions}")

# Calculus
derivative = diff(x**3 + 2 * x**2 + x, x)
print(f"Derivative of x^3 + 2x^2 + x = {derivative}")

integral = integrate(x**2, x)
print(f"Integral of x^2 = {integral}")

# Send structured data via missive
missive(
    {
        "sympy_version": sp.__version__,
        "expanded_expr": str(expanded),
        "factored_expr": str(factored),
        "solutions": [str(sol) for sol in solutions],
        "derivative": str(derivative),
        "integral": str(integral),
    }
)
