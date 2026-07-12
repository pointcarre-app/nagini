/**
 * Section catalog for the sympy page.
 *
 * Same schema as ../executions/sections.js: each section carries a blurb,
 * a compact pure-ASCII flow excerpt (drawing characters restricted to
 * + - | > v ^) and runnable demos with the exact JS integration snippet
 * this page performs.
 *
 * Anchors (#symbolic, #calculus, #solve, #plot, #input, #yaml) are stable.
 * Each section's docAnchor is the slug of the matching heading in
 * docs/execution-flows.md.
 */

export const DOC_URL = '../../docs/execution-flows.md';

export const SECTIONS = [

  // ----------------------------------------------------------- symbolic
  {
    id: 'symbolic',
    docAnchor: 'classic-executeasync',
    title: 'Symbolic manipulation',
    blurb: 'Real CPython means real SymPy: expand, factor and simplify run '
      + 'in the worker exactly as they would in a terminal. Everything '
      + 'below is exact arithmetic on expression trees, no floats, and the '
      + 'output travels back on result.stdout.',
    flow: `executeAsync("symbolic.py", code)
        |
        v
+------------------------------+
| worker                       |
| import sympy (loaded at boot)|
| expand / factor / simplify   |
| results print to stdout      |
+------------------------------+
        |
        | postMessage: result, id
        v
result.stdout carries the algebra`,
    demos: [
      {
        id: 'symbolic-basics',
        js: `// one shared manager for the whole page, created on first run:
// sympy comes from the pyodide distribution, strictyaml from PyPI
import { Nagini } from '../../src/nagini.js';

const manager = await Nagini.createManager(
  'pyodide',
  ['sympy', 'matplotlib'],   // pyodide packages, loaded at boot
  ['strictyaml'],            // micropip packages (PyPI)
  [],
  '../../src/pyodide/worker/worker-dist.js',
  { snapshotCache: true }    // interpreter restored from IndexedDB
                             // on reload; packages still load each time
);
await Nagini.waitForReady(manager, 180000);

const result = await manager.executeAsync('symbolic.py', code, undefined, 60000);
// result.stdout holds everything the code printed`,
        steps: [
          {
            file: 'symbolic.py',
            button: 'Run',
            code: `import sympy as sp

x, y = sp.symbols("x y")

print("expand   :", sp.expand((x + y)**4))
print("factor   :", sp.factor(x**4 - 1))

messy = sp.sin(x)**2 + sp.cos(x)**2 + (x**2 + 2*x + 1) / (x + 1)
print("simplify :", sp.simplify(messy))

f = sp.exp(-x) * sp.sin(x)
print()
print(sp.pretty(sp.Integral(f, x), use_unicode=False))
print("  =", sp.integrate(f, x))`,
          },
        ],
      },
    ],
  },

  // ----------------------------------------------------------- calculus
  {
    id: 'calculus',
    docAnchor: 'classic-executeasync',
    title: 'Exact calculus',
    blurb: 'Limits, derivatives, series expansions and infinite sums, all '
      + 'exact. The Basel problem really returns pi**2/6, not 1.6449.',
    flow: `executeAsync("calculus.py", code)
        |
        v
+------------------------------+
| worker                       |
| limit, diff, series, sums    |
| computed exactly by sympy    |
+------------------------------+
        |
        v
exact results, no floats involved`,
    demos: [
      {
        id: 'calculus-exact',
        js: `const result = await manager.executeAsync('calculus.py', code, undefined, 60000);
console.log(result.stdout);   // exact symbolic results, printed by python`,
        steps: [
          {
            file: 'calculus.py',
            button: 'Run',
            code: `import sympy as sp

x, n = sp.symbols("x n")

f = sp.sin(x) / x
print("limit x->0 of sin(x)/x :", sp.limit(f, x, 0))
print("derivative             :", sp.diff(f, x))
print("series at 0            :", sp.series(f, x, 0, 8))

print()
basel = sp.summation(1 / n**2, (n, 1, sp.oo))
print("sum 1/n**2, n=1..oo    :", basel)
print("float value            :", float(basel))`,
          },
        ],
      },
    ],
  },

  // -------------------------------------------------------------- solve
  {
    id: 'solve',
    docAnchor: 'the-missive-channel',
    title: 'Equations and systems',
    blurb: 'solve() returns exact roots (radicals included), nsolve() takes '
      + 'over when no closed form exists. The LaTeX of every result ships '
      + 'through the missive channel as structured data, ready for a math '
      + 'renderer on the page side.',
    flow: `executeAsync("solve.py", code)
        |
        v
+------------------------------+
| worker                       |
| solve() returns exact roots  |
| nsolve() polishes a numeric  |
| root when exactness ends     |
+------------------------------+
        |
        | missive: latex payload
        v
result.stdout + result.missive`,
    demos: [
      {
        id: 'solve-exact',
        js: `const result = await manager.executeAsync('solve.py', code, undefined, 60000);

// pyodide backend: result.missive is a JSON string
const data = JSON.parse(result.missive);
console.log(data.latex);   // feed KaTeX / MathJax with this`,
        steps: [
          {
            file: 'solve.py',
            button: 'Run',
            showMissiveRaw: true,
            code: `import sympy as sp

x, y = sp.symbols("x y")

roots = sp.solve(sp.Eq(x**2 - 4*x + 1, 0), x)
print("x**2 - 4x + 1 = 0  ->", roots)

system = sp.solve([sp.Eq(x + y, 6), sp.Eq(x * y, 8)], [x, y])
print("x + y = 6, x*y = 8 ->", system)

fixed = sp.nsolve(sp.cos(x) - x, x, 1)
print("cos(x) = x         ->", fixed)

missive({
    "quadratic": [str(r) for r in roots],
    "latex": sp.latex(roots[0]),
    "cos_fixed_point": float(fixed),
})`,
          },
        ],
      },
    ],
  },

  // --------------------------------------------------------------- plot
  {
    id: 'plot',
    docAnchor: 'figure-capture-matplotlib',
    title: 'Symbolic to figure',
    blurb: 'The full pipeline: a symbolic f, its exact derivative, the '
      + 'tangent line built by substitution, then lambdify turns them into '
      + 'fast numeric functions and matplotlib renders off screen. The PNG '
      + 'arrives in result.figures as base64.',
    flow: `executeAsync("plot.py", code)
        |
        v
+------------------------------+
| worker                       |
| lambdify turns the symbolic  |
| f and its tangent into fast  |
| numeric functions, then      |
| matplotlib draws off screen  |
+------------------------------+
        |
        | result: id, figures list
        v
img.src = "data:image/png;base64," + b64`,
    demos: [
      {
        id: 'plot-tangent',
        js: `const result = await manager.executeAsync('plot.py', code, undefined, 60000);

for (const b64 of result.figures) {
  const img = document.createElement('img');
  img.src = 'data:image/png;base64,' + b64;
  target.appendChild(img);
}`,
        steps: [
          {
            file: 'plot.py',
            button: 'Run',
            code: `import sympy as sp
import matplotlib.pyplot as plt

x = sp.symbols("x")
f = sp.sin(x) * sp.exp(-x / 3)
df = sp.diff(f, x)

a = 2
tangent = f.subs(x, a) + df.subs(x, a) * (x - a)
print("f       =", f)
print("f'      =", sp.simplify(df))
print("tangent =", sp.simplify(tangent), "at x =", a)

F = sp.lambdify(x, f)
T = sp.lambdify(x, tangent)
xs = [i / 20 for i in range(0, 181)]

BG, GRID, FG = "#0e0f12", "#1d2025", "#d7dde2"
fig, ax = plt.subplots(figsize=(7.2, 3.8))
fig.patch.set_facecolor(BG)
ax.set_facecolor(BG)
ax.plot(xs, [F(v) for v in xs], color="#00e5a0", lw=1.6, label="f")
ax.plot(xs, [T(v) for v in xs], color="#ff2d3f", lw=1.2, label="tangent")
ax.scatter([a], [F(a)], color="#4cc9f0", zorder=3)
ax.set_title("f and its exact tangent at x = 2",
             color=FG, fontsize=10, loc="left", family="monospace")
ax.legend(facecolor=BG, edgecolor=GRID, labelcolor=FG, fontsize=8)
ax.grid(color=GRID, lw=0.6)
ax.tick_params(colors=FG, labelsize=8)
for side in ax.spines.values():
    side.set_color(GRID)
plt.tight_layout()
plt.show()

print("figure captured into result.figures")`,
          },
        ],
      },
    ],
  },

  // -------------------------------------------------------------- input
  {
    id: 'input',
    docAnchor: 'input-pausing-python-for-the-host',
    title: 'Interactive derivation',
    blurb: 'input() feeds sympify: type any expression of x and the worker '
      + 'differentiates it symbolically. On JSPI browsers input() blocks '
      + 'natively (manager.inputMode is "jspi"); elsewhere the AST rewrite '
      + 'takes over. The page answers through the field below, or from a '
      + 'queue.',
    flow: `executeAsync("derive.py", code)
        |
        v
+------------------------------+
| python: input("f(x) = ")     |
| pauses, worker posts         |
| input_required to the page   |
+------------------------------+
        |
        v
+------------------------------+
| you type an expression;      |
| sympify parses it, sympy     |
| differentiates symbolically  |
+------------------------------+
        |
        v
result + missive with the latex`,
    demos: [
      {
        id: 'input-interactive',
        heading: 'Interactive: type your own f(x)',
        note: 'A field appears when Python reaches input(). Try x**3 * '
          + 'exp(x), sin(x)/x, atan(x)... the run waits for you, so the '
          + 'timeout is raised.',
        js: `// register once: called each time python reaches input()
manager.setInputCallback((prompt) => showFieldFor(prompt));
sendButton.addEventListener('click', () => {
  manager.provideInput(field.value);
});

const result = await manager.executeAsync('derive.py', code, undefined, 180000);`,
        steps: [
          {
            file: 'derive.py',
            button: 'Run',
            timeoutMs: 180000,
            code: `import sympy as sp

x = sp.symbols("x")

f = sp.sympify(input("f(x) = "))
a = sp.sympify(input("evaluate f' at x = "))

df = sp.diff(f, x)
print("f  =", f)
print("f' =", sp.simplify(df))
print("f'({}) = {}".format(a, sp.simplify(df.subs(x, a))))

missive({"f": str(f), "df": str(df), "latex": sp.latex(df)})`,
          },
        ],
      },
      {
        id: 'input-queued',
        heading: 'Programmatic: queue the answers',
        note: 'Two values are queued before the run: the expression and the '
          + 'evaluation point. Each input() consumes one in order.',
        queued: ['x**3 * exp(x)', '1'],
        js: `// queue answers before running: each input() consumes one
manager.queueInput('x**3 * exp(x)');
manager.queueInput('1');

const result = await manager.executeAsync('derive.py', code, undefined, 60000);`,
        steps: [
          {
            file: 'derive.py',
            button: 'Run with queued answers',
            code: `import sympy as sp

x = sp.symbols("x")

f = sp.sympify(input("f(x) = "))
a = sp.sympify(input("evaluate f' at x = "))

df = sp.diff(f, x)
print("f  =", f)
print("f' =", sp.simplify(df))
print("f'({}) = {}".format(a, sp.simplify(df.subs(x, a))))`,
          },
        ],
      },
    ],
  },

  // --------------------------------------------------------------- yaml
  {
    id: 'yaml',
    docAnchor: 'the-missive-channel',
    title: 'strictyaml into sympy',
    blurb: 'strictyaml comes from PyPI through micropip at boot. A typed '
      + 'schema validates the YAML document (floats stay floats, no '
      + 'implicit coercions), then sympy solves the projectile it '
      + 'describes and ships the numbers back through the missive.',
    flow: `executeAsync("yaml.py", code)
        |
        v
+------------------------------+
| strictyaml (micropip, PyPI)  |
| validates the document       |
| against a typed schema       |
+------------------------------+
        |
        v
+------------------------------+
| sympy solves the physics     |
| built from the parsed values |
+------------------------------+
        |
        | missive: structured result
        v
JSON.parse(result.missive)`,
    demos: [
      {
        id: 'yaml-projectile',
        js: `// strictyaml was installed at boot:
// createManager(..., ['sympy', 'matplotlib'], ['strictyaml'], ...)
const result = await manager.executeAsync('yaml.py', code, undefined, 60000);

const report = JSON.parse(result.missive);
console.log(report.flight_time_s, report.max_height_m);`,
        steps: [
          {
            file: 'yaml.py',
            button: 'Run',
            showMissiveRaw: true,
            code: `import strictyaml as sy
import sympy as sp

DOC = """
problem: projectile
gravity: 9.81
v0: 14.0
angle_deg: 45.0
"""

schema = sy.Map({
    "problem": sy.Str(),
    "gravity": sy.Float(),
    "v0": sy.Float(),
    "angle_deg": sy.Float(),
})
data = sy.load(DOC, schema).data
print("validated:", data)

t = sp.symbols("t", positive=True)
g = data["gravity"]
vy = data["v0"] * sp.sin(sp.rad(data["angle_deg"]))

y = vy * t - g * t**2 / 2
flight = sp.solve(sp.Eq(y, 0), t)[0]
apex = y.subs(t, flight / 2)

print("flight time :", sp.nsimplify(flight, rational=False))
print("max height  :", apex)

missive({
    "problem": data["problem"],
    "flight_time_s": float(flight),
    "max_height_m": float(apex),
})`,
          },
        ],
      },
    ],
  },
];
