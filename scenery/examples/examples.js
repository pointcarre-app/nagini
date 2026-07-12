/**
 * Example catalog for the Nagini showcase page.
 * Each entry: { id, tab, title, desc, code, timeoutMs? }
 * All examples run against one manager preloaded with numpy, matplotlib,
 * sympy. Figures use a shared dark palette matching the page.
 */

const BG = '#0a0a0c';

export const EXAMPLES = [
  {
    id: 'signal-tap',
    tab: 'TAP',
    title: 'Passive bus tap',
    desc: 'Three traces on one oscilloscope, neon halo done with layered line widths.',
    code: `# oscilloscope :: passive tap on bus 0x3F
import numpy as np
import matplotlib.pyplot as plt

BG, GRID, FG = "${BG}", "#16181d", "#d7dde2"

t = np.linspace(0, 4 * np.pi, 2400)
taps = [
    ("uplink",  np.sin(t) * np.exp(-t / 14),      "#ff2d3f"),
    ("carrier", 0.62 * np.sin(2.3 * t + 0.7),     "#00e5a0"),
    ("clock",   0.34 * np.sign(np.sin(0.8 * t)),  "#4cc9f0"),
]

fig, ax = plt.subplots(figsize=(9.4, 4.6))
fig.patch.set_facecolor(BG)
ax.set_facecolor(BG)

for name, y, c in taps:
    # halo: same curve three times, wide and faint to thin and bright
    for lw, a in [(7, 0.05), (3, 0.18), (1.3, 1.0)]:
        ax.plot(t, y, color=c, lw=lw, alpha=a,
                label=name if lw < 2 else None)

ax.grid(color=GRID, lw=0.7)
ax.set_xlim(t[0], t[-1])
ax.tick_params(colors=FG, labelsize=8)
for s in ax.spines.values():
    s.set_color(GRID)
ax.set_title("BUS 0x3F :: PASSIVE TAP", color=FG, fontsize=11,
             loc="left", family="monospace")
ax.legend(loc="upper right", facecolor=BG, edgecolor=GRID, labelcolor=FG)
plt.tight_layout()
plt.show()

print("3 traces rendered, 0 packets dropped")`,
  },

  {
    id: 'mandelbrot',
    tab: 'FRACTAL',
    title: 'Escape-time Mandelbrot',
    desc: 'Pure numpy, no loop over pixels: the whole grid iterates at once.',
    code: `# fractal recon :: escape-time mandelbrot, pure numpy
import numpy as np
import matplotlib.pyplot as plt

W, H, IT = 880, 560, 90
x = np.linspace(-2.35, 0.95, W)
y = np.linspace(-1.15, 1.15, H)
c = x[None, :] + 1j * y[:, None]
z = np.zeros_like(c)
depth = np.zeros(c.shape)

for _ in range(IT):
    alive = np.abs(z) <= 2
    z[alive] = z[alive] ** 2 + c[alive]
    depth += alive

fig, ax = plt.subplots(figsize=(8.8, 5.6))
fig.patch.set_facecolor("${BG}")
ax.imshow(np.log1p(depth), cmap="magma",
          extent=[x[0], x[-1], y[0], y[-1]], origin="lower")
ax.set_title("Z = Z**2 + C :: %d ITERATIONS" % IT, color="#d7dde2",
             fontsize=11, loc="left", family="monospace")
ax.tick_params(colors="#d7dde2", labelsize=8)
for s in ax.spines.values():
    s.set_color("#16181d")
plt.tight_layout()
plt.show()

print(f"{W * H:,} cells iterated {IT} times")`,
  },

  {
    id: 'lissajous',
    tab: 'LISSAJOUS',
    title: 'Lissajous matrix',
    desc: 'A 3 by 3 grid of frequency ratios, the classic CRT calibration figures.',
    code: `# lissajous :: frequency ratio matrix, like an old CRT bench
import numpy as np
import matplotlib.pyplot as plt

BG, FG = "${BG}", "#d7dde2"
t = np.linspace(0, 2 * np.pi, 3000)
ratios = [(1, 1), (1, 2), (1, 3),
          (2, 3), (3, 4), (3, 5),
          (4, 5), (5, 6), (5, 7)]

fig, axes = plt.subplots(3, 3, figsize=(7.6, 7.6))
fig.patch.set_facecolor(BG)

for ax, (a, b) in zip(axes.flat, ratios):
    ax.set_facecolor(BG)
    ax.plot(np.sin(a * t + np.pi / 2), np.sin(b * t),
            color="#00e5a0", lw=0.9)
    ax.set_title(f"{a}:{b}", color=FG, fontsize=9, family="monospace")
    ax.set_xticks([]); ax.set_yticks([])
    for s in ax.spines.values():
        s.set_color("#16181d")

plt.tight_layout()
plt.show()
print("9 ratios traced")`,
  },

  {
    id: 'walks',
    tab: 'WALKS',
    title: 'Random walk swarm',
    desc: 'Eight 2D random walks from the same origin, endpoints flagged.',
    code: `# drift :: 8 random walks leaving the same safehouse
import numpy as np
import matplotlib.pyplot as plt

BG, GRID, FG = "${BG}", "#16181d", "#d7dde2"
rng = np.random.default_rng(11)
palette = ["#ff2d3f", "#00e5a0", "#4cc9f0", "#ffb454",
           "#b388ff", "#ff6f91", "#7fdbca", "#e6e6e6"]

fig, ax = plt.subplots(figsize=(8.6, 6.2))
fig.patch.set_facecolor(BG)
ax.set_facecolor(BG)

for k, c in enumerate(palette):
    steps = rng.normal(size=(1500, 2))
    path = np.cumsum(steps, axis=0)
    ax.plot(path[:, 0], path[:, 1], color=c, lw=0.8, alpha=0.85)
    ax.scatter(*path[-1], color=c, s=42, zorder=3,
               edgecolors=BG, linewidths=1.2)

ax.scatter(0, 0, marker="s", s=90, color=FG, zorder=4)
ax.annotate("origin", (0, 0), xytext=(8, 8),
            textcoords="offset points", color=FG, fontsize=8)
ax.grid(color=GRID, lw=0.6)
ax.tick_params(colors=FG, labelsize=8)
for s in ax.spines.values():
    s.set_color(GRID)
ax.set_title("DRIFT :: 8 AGENTS, 1500 STEPS", color=FG, fontsize=11,
             loc="left", family="monospace")
plt.tight_layout()
plt.show()
print("8 agents dispersed")`,
  },

  {
    id: 'roses',
    tab: 'ROSES',
    title: 'Polar roses',
    desc: 'Rose curves r = cos(k * theta) on polar axes, four values of k.',
    code: `# botanics :: rose curves on polar axes
import numpy as np
import matplotlib.pyplot as plt

BG, GRID, FG = "${BG}", "#16181d", "#d7dde2"
theta = np.linspace(0, 12 * np.pi, 6000)
ks = [(2, "#ff2d3f"), (5, "#00e5a0"), (7 / 3, "#4cc9f0"), (9 / 4, "#ffb454")]

fig, axes = plt.subplots(1, 4, figsize=(12, 3.4),
                         subplot_kw={"projection": "polar"})
fig.patch.set_facecolor(BG)

for ax, (k, c) in zip(axes, ks):
    ax.set_facecolor(BG)
    ax.plot(theta, np.cos(k * theta), color=c, lw=0.7)
    ax.set_title(f"k = {k}", color=FG, fontsize=9, family="monospace", pad=12)
    ax.set_xticklabels([]); ax.set_yticklabels([])
    ax.grid(color=GRID, lw=0.5)
    ax.spines["polar"].set_color(GRID)

plt.tight_layout()
plt.show()
print("4 roses, petals counted by k")`,
  },

  {
    id: 'matrix',
    tab: 'MATRIX',
    title: 'Traffic anomaly matrix',
    desc: 'Node-to-node traffic heatmap with one injected anomaly, boxed in red.',
    code: `# netwatch :: node-to-node traffic, one cell is lying
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.patches as patches

BG, FG = "${BG}", "#d7dde2"
rng = np.random.default_rng(42)
n = 12
traffic = rng.gamma(2.0, 1.0, (n, n))
traffic += np.diag(rng.gamma(6.0, 1.0, n))   # nodes talk to themselves
anomaly = (3, 9)
traffic[anomaly] *= 6                          # exfiltration spike

fig, ax = plt.subplots(figsize=(8.2, 6.6))
fig.patch.set_facecolor(BG)
im = ax.imshow(traffic, cmap="inferno")

labels = [f"N{i:02d}" for i in range(n)]
ax.set_xticks(range(n), labels, rotation=45, ha="right",
              color=FG, fontsize=8, family="monospace")
ax.set_yticks(range(n), labels, color=FG, fontsize=8, family="monospace")
ax.set_title("TRAFFIC MATRIX :: GB / 24H", color=FG, fontsize=11,
             loc="left", family="monospace")

ax.add_patch(patches.Rectangle((anomaly[1] - 0.5, anomaly[0] - 0.5), 1, 1,
                               fill=False, edgecolor="#ff2d3f", lw=2))
ax.annotate("ANOMALY", (anomaly[1], anomaly[0]), xytext=(20, -25),
            textcoords="offset points", color="#ff2d3f", fontsize=9,
            family="monospace",
            arrowprops={"arrowstyle": "-", "color": "#ff2d3f", "lw": 1})

cb = fig.colorbar(im, ax=ax)
cb.ax.tick_params(colors=FG, labelsize=8)
cb.outline.set_edgecolor("#16181d")
plt.tight_layout()
plt.show()

src, dst = anomaly
print(f"flagged: N{src:02d} -> N{dst:02d} at {traffic[anomaly]:.1f} GB/24h")`,
  },

  {
    id: 'life',
    tab: 'LIFE',
    title: 'Game of life',
    desc: 'Conway on a torus with np.roll, five generations side by side.',
    code: `# automaton :: conway on a 64x64 torus
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.colors import ListedColormap

rng = np.random.default_rng(3)
grid = (rng.random((64, 64)) < 0.18).astype(int)

def step(g):
    n = sum(np.roll(np.roll(g, i, 0), j, 1)
            for i in (-1, 0, 1) for j in (-1, 0, 1)
            if (i, j) != (0, 0))
    return ((n == 3) | ((g == 1) & (n == 2))).astype(int)

snapshots, gens = [], [0, 6, 14, 26, 40]
g, t = grid.copy(), 0
for target in gens:
    while t < target:
        g = step(g); t += 1
    snapshots.append(g.copy())

cmap = ListedColormap(["${BG}", "#00e5a0"])
fig, axes = plt.subplots(1, len(gens), figsize=(13, 3))
fig.patch.set_facecolor("${BG}")
for ax, snap, gen in zip(axes, snapshots, gens):
    ax.imshow(snap, cmap=cmap, interpolation="nearest")
    ax.set_title(f"t = {gen}", color="#d7dde2", fontsize=9, family="monospace")
    ax.set_xticks([]); ax.set_yticks([])
    for s in ax.spines.values():
        s.set_color("#16181d")
plt.tight_layout()
plt.show()

print(f"alive cells at t={gens[-1]}: {int(snapshots[-1].sum())}")`,
  },

  {
    id: 'symbolic',
    tab: 'SYMBOLIC',
    title: 'Symbolic analysis',
    desc: 'Sympy derives a damped oscillation, then matplotlib plots f and its derivative.',
    code: `# calculus :: sympy does the algebra, matplotlib draws it
import sympy as sp
import numpy as np
import matplotlib.pyplot as plt

xs = sp.symbols("x")
f = sp.sin(xs) * sp.exp(-xs / 5)
df = sp.simplify(sp.diff(f, xs))
F = sp.simplify(sp.integrate(f, xs))

print("f(x)   =", f)
print("f'(x)  =", df)
print("F(x)   =", F)
x0 = float(sp.nsolve(df, xs, 1.3))
print(f"first maximum at x = {x0:.4f}")

fn, dfn = sp.lambdify(xs, f), sp.lambdify(xs, df)
X = np.linspace(0, 15, 1200)

BG, GRID, FG = "${BG}", "#16181d", "#d7dde2"
fig, ax = plt.subplots(figsize=(9.2, 4.6))
fig.patch.set_facecolor(BG)
ax.set_facecolor(BG)
ax.plot(X, fn(X), color="#00e5a0", lw=1.6, label="f(x)")
ax.plot(X, dfn(X), color="#ff2d3f", lw=1.2, ls="--", label="f'(x)")
ax.axvline(x0, color="#4cc9f0", lw=0.9, alpha=0.7)
ax.scatter([x0], [fn(x0)], color="#4cc9f0", s=50, zorder=3)
ax.axhline(0, color=GRID, lw=0.8)
ax.grid(color=GRID, lw=0.6)
ax.tick_params(colors=FG, labelsize=8)
for s in ax.spines.values():
    s.set_color(GRID)
ax.set_title("DAMPED OSCILLATION :: f AND f'", color=FG, fontsize=11,
             loc="left", family="monospace")
ax.legend(facecolor=BG, edgecolor=GRID, labelcolor=FG)
plt.tight_layout()
plt.show()`,
  },

  {
    id: 'spectrum',
    tab: 'SPECTRUM',
    title: 'FFT spectrum analyzer',
    desc: 'A synthetic chord buried in noise, recovered by the FFT, peaks labelled.',
    code: `# sigint :: A-major chord under noise, FFT pulls it back out
import numpy as np
import matplotlib.pyplot as plt

fs = 4000
t = np.arange(0, 1.0, 1 / fs)
chord = [(440.0, 1.0), (554.37, 0.8), (659.25, 0.6)]
rng = np.random.default_rng(0)

sig = sum(a * np.sin(2 * np.pi * f * t) for f, a in chord)
sig += rng.normal(0, 0.9, t.size)

spec = np.abs(np.fft.rfft(sig)) / t.size * 2
freqs = np.fft.rfftfreq(t.size, 1 / fs)

BG, GRID, FG = "${BG}", "#16181d", "#d7dde2"
fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(9.4, 6.2))
fig.patch.set_facecolor(BG)

ax1.set_facecolor(BG)
ax1.plot(t[:240] * 1000, sig[:240], color="#4cc9f0", lw=0.9)
ax1.set_title("RAW CAPTURE :: FIRST 60 MS", color=FG, fontsize=10,
              loc="left", family="monospace")
ax1.set_xlabel("ms", color=FG, fontsize=8)

ax2.set_facecolor(BG)
mask = freqs <= 1000
ax2.plot(freqs[mask], spec[mask], color="#00e5a0", lw=1.0)
for f, a in chord:
    k = np.argmin(np.abs(freqs - f))
    ax2.annotate(f"{f:.0f} Hz", (freqs[k], spec[k]), xytext=(0, 10),
                 textcoords="offset points", ha="center",
                 color="#ff2d3f", fontsize=8, family="monospace")
ax2.set_title("FFT MAGNITUDE :: 0-1000 HZ", color=FG, fontsize=10,
              loc="left", family="monospace")
ax2.set_xlabel("Hz", color=FG, fontsize=8)

for ax in (ax1, ax2):
    ax.grid(color=GRID, lw=0.6)
    ax.tick_params(colors=FG, labelsize=8)
    for s in ax.spines.values():
        s.set_color(GRID)

plt.tight_layout()
plt.show()
print("3 carriers recovered from the noise floor")`,
  },

  {
    id: 'missive',
    tab: 'MISSIVE',
    title: 'Structured report via missive()',
    desc: 'Monte-Carlo estimation of pi, plot plus a structured JSON report for the front.',
    code: `# courier :: monte-carlo pi, results shipped as structured JSON
import time
import numpy as np
import matplotlib.pyplot as plt

t0 = time.time()
rng = np.random.default_rng(2026)
N = 200_000
pts = rng.random((N, 2))
inside = (pts ** 2).sum(axis=1) <= 1.0
pi_hat = 4 * inside.mean()

# plot a readable subsample only
show = 4000
sub, sub_in = pts[:show], inside[:show]
BG, FG = "${BG}", "#d7dde2"
fig, ax = plt.subplots(figsize=(6.4, 6.4))
fig.patch.set_facecolor(BG)
ax.set_facecolor(BG)
ax.scatter(*sub[sub_in].T, s=2, color="#00e5a0", alpha=0.7)
ax.scatter(*sub[~sub_in].T, s=2, color="#ff2d3f", alpha=0.7)
ax.add_patch(plt.Circle((0, 0), 1, fill=False, color=FG, lw=0.8))
ax.set_xlim(0, 1); ax.set_ylim(0, 1)
ax.set_xticks([]); ax.set_yticks([])
for s in ax.spines.values():
    s.set_color("#16181d")
ax.set_title(f"PI ~ {pi_hat:.5f} :: {N:,} DARTS", color=FG,
             fontsize=11, loc="left", family="monospace")
plt.tight_layout()
plt.show()

missive({
    "estimate": round(float(pi_hat), 6),
    "abs_error": round(abs(float(pi_hat) - np.pi), 6),
    "darts": N,
    "inside": int(inside.sum()),
    "elapsed_ms": round((time.time() - t0) * 1000, 1),
})
print("report dispatched, check the MISSIVE panel")`,
  },

  {
    id: 'stdin',
    tab: 'STDIN',
    title: 'Interactive stdin',
    desc: 'Real input() from the page: a prompt bar appears below, you have 120 seconds.',
    timeoutMs: 120000,
    code: `# handshake :: this one talks back, answer in the bar below
codename = input("operator codename: ")
target = input("target system: ")

print()
print(f"  operator  {codename}")
print(f"  target    {target}")
print(f"  channel   established")

missive({"operator": codename, "target": target, "status": "linked"})`,
  },
];
