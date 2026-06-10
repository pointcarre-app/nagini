/**
 * Algorithmes du programme officiel de première spécialité (BO 2019).
 */

export const PREMIERE = [
  {
    id: 'suites-seuil',
    niveau: 'Première',
    theme: 'Suites numériques',
    titre: 'Termes, somme et seuil d\'une suite',
    bo: 'Calcul de termes d\'une suite, de sommes de termes, de seuil.',
    objectif: 'Les trois gestes de base sur une suite définie par récurrence : calculer un terme, additionner les premiers termes, trouver quand un seuil est franchi.',
    idee: 'On travaille sur u(n+1) = 0,8 u(n) + 3 avec u(0) = 10, une suite arithmético-géométrique qui monte vers 15. Pour un terme : boucle for. Pour un seuil : boucle while, puisqu\'on ignore combien de tours seront nécessaires.',
    retenir: 'Boucle for quand le nombre d\'itérations est connu, boucle while quand c\'est l\'inconnue du problème. Et une seule variable u suffit : inutile de stocker toute la suite pour calculer un terme.',
    variantes: [
      {
        label: 'ALGORITHME',
        code: `# Suite u(n+1) = 0.8*u(n) + 3, u(0) = 10. Limite : 15.

def terme(n):
    """Renvoie u(n)."""
    u = 10
    for _ in range(n):
        u = 0.8 * u + 3
    return u

def somme(n):
    """Renvoie u(0) + u(1) + ... + u(n)."""
    u = 10
    s = u
    for _ in range(n):
        u = 0.8 * u + 3
        s = s + u
    return s

def seuil(S):
    """Renvoie le plus petit n tel que u(n) > S (la suite croît vers 15)."""
    n, u = 0, 10
    while u <= S:
        u = 0.8 * u + 3
        n = n + 1
    return n

for n in [0, 1, 2, 5, 10, 20]:
    print(f"u({n}) = {terme(n):.6f}")
print()
print("somme des 11 premiers termes :", round(somme(10), 6))
print("premier n tel que u(n) > 14.9 :", seuil(14.9))
print("premier n tel que u(n) > 14.999 :", seuil(14.999))`,
      },
      {
        label: 'VISUALISATION',
        code: `# Le diagramme en escalier (ou en toile d'araignée)
import numpy as np
import matplotlib.pyplot as plt

f = lambda x: 0.8 * x + 3      # u(n+1) = f(u(n))
u0, N = 10, 12

X = np.linspace(9, 16, 100)
fig, ax = plt.subplots(figsize=(8, 6.5))
ax.plot(X, f(X), color="tab:blue", label="y = 0.8x + 3")
ax.plot(X, X, color="#888888", lw=1, label="y = x")

# construction de l'escalier
u = u0
for _ in range(N):
    v = f(u)
    ax.plot([u, u], [u, v], color="tab:red", lw=1)   # vertical : vers la courbe
    ax.plot([u, v], [v, v], color="tab:red", lw=1)   # horizontal : vers y = x
    u = v

ax.plot([u0], [u0], "o", color="tab:red")
ax.annotate("u(0)", (u0, u0), xytext=(0, -16), textcoords="offset points",
            color="tab:red", ha="center")
ax.plot([15], [15], "s", color="tab:green", ms=8)
ax.annotate("point fixe : 15", (15, 15), xytext=(10, -14),
            textcoords="offset points", color="tab:green")
ax.set_title("L'escalier converge vers l'intersection des deux droites")
ax.legend()
ax.grid(alpha=0.3)
plt.tight_layout()
plt.show()
print("Le point fixe vérifie x = 0.8x + 3, donc x = 15 :")
print("c'est la limite de la suite, l'escalier s'y écrase.")`,
      },
    ],
  },

  {
    id: 'factorielle',
    niveau: 'Première',
    theme: 'Suites numériques',
    titre: 'Factorielle',
    bo: 'Calcul de factorielle.',
    objectif: 'Programmer n! = 1 × 2 × ... × n et prendre la mesure de sa croissance, plus rapide que toute exponentielle.',
    idee: 'Un accumulateur initialisé à 1, multiplié par chaque entier de 1 à n. C\'est le schéma de toutes les suites définies par produit.',
    retenir: 'Par convention 0! = 1, et le code le respecte naturellement : la boucle ne fait aucun tour. Comparez 2ⁿ, n² et n! : la factorielle finit toujours par écraser les autres.',
    variantes: [
      {
        label: 'ALGORITHME',
        code: `# Factorielle : produit des entiers de 1 à n

def factorielle(n):
    f = 1
    for k in range(1, n + 1):
        f = f * k
    return f

for n in range(13):
    print(f"{n:>2}! = {factorielle(n)}")

print()
print("70! a", len(str(factorielle(70))), "chiffres :")
print(factorielle(70))`,
      },
      {
        label: 'VISUALISATION',
        code: `# n! contre 2^n et n^2 : aucune comparaison possible
import matplotlib.pyplot as plt

def factorielle(n):
    f = 1
    for k in range(1, n + 1):
        f *= k
    return f

N = range(1, 16)
fig, ax = plt.subplots(figsize=(8.5, 5))
ax.semilogy(N, [n ** 2 for n in N], "o-", label="n²")
ax.semilogy(N, [2 ** n for n in N], "s-", label="2^n")
ax.semilogy(N, [factorielle(n) for n in N], "^-", label="n!")
ax.set_xlabel("n")
ax.set_title("Échelle logarithmique : n! devient vite hors catégorie")
ax.legend()
ax.grid(alpha=0.3, which="both")
plt.tight_layout()
plt.show()
print("L'axe vertical est logarithmique : chaque graduation multiplie par 10.")
print("Même 2^n, déjà explosif, paraît plat à côté de n!.")`,
      },
      {
        label: 'PLUS LOIN',
        code: `# Version récursive : la définition mathématique traduite mot à mot
# n! = n * (n-1)!  et  0! = 1

def factorielle(n):
    if n == 0:
        return 1            # cas de base, indispensable
    return n * factorielle(n - 1)

print("10! =", factorielle(10))

# La récursivité est élégante mais a un coût : chaque appel attend
# le résultat du suivant. Python limite la profondeur (environ 1000).
import sys
print("profondeur maximale autorisée :", sys.getrecursionlimit())`,
      },
    ],
  },

  {
    id: 'syracuse-fibonacci',
    niveau: 'Première',
    theme: 'Suites numériques',
    titre: 'Syracuse et Fibonacci',
    bo: 'Liste des premiers termes d\'une suite : suites de Syracuse, suite de Fibonacci.',
    objectif: 'Deux suites célèbres définies par récurrence : l\'une porte une conjecture toujours ouverte, l\'autre cache le nombre d\'or.',
    idee: 'Syracuse : si n est pair on le divise par 2, sinon on calcule 3n + 1 ; la conjecture affirme qu\'on atteint toujours 1. Fibonacci : chaque terme est la somme des deux précédents, et le rapport de deux termes consécutifs converge vers le nombre d\'or φ = (1 + √5)/2.',
    retenir: 'Pour Fibonacci, l\'affectation simultanée a, b = b, a + b évite la variable temporaire et les erreurs classiques. Pour Syracuse, personne n\'a jamais prouvé que la boucle while se termine pour tout n : vous programmez une question ouverte.',
    variantes: [
      {
        label: 'ALGORITHME',
        code: `# Suite de Syracuse : vol du nombre n
def syracuse(n):
    vol = [n]
    while n != 1:
        if n % 2 == 0:
            n = n // 2
        else:
            n = 3 * n + 1
        vol.append(n)
    return vol

vol = syracuse(27)
print("vol de 27 :", vol[:18], "...")
print("temps de vol :", len(vol) - 1, "étapes")
print("altitude maximale :", max(vol))
print()

# Suite de Fibonacci et nombre d'or
def fibonacci(n):
    """Liste des n premiers termes."""
    termes = []
    a, b = 0, 1
    for _ in range(n):
        termes.append(a)
        a, b = b, a + b
    return termes

F = fibonacci(15)
print("Fibonacci :", F)
print()
print("rapports F(n+1)/F(n) :")
for k in range(5, 14):
    print(f"  {F[k + 1]}/{F[k]} = {F[k + 1] / F[k]:.8f}")
print("nombre d'or :", (1 + 5 ** 0.5) / 2)`,
      },
      {
        label: 'VISUALISATION',
        code: `# À gauche le vol chaotique de 27, à droite la convergence vers φ
import matplotlib.pyplot as plt

def syracuse(n):
    vol = [n]
    while n != 1:
        n = n // 2 if n % 2 == 0 else 3 * n + 1
        vol.append(n)
    return vol

def fibonacci(n):
    termes, a, b = [], 0, 1
    for _ in range(n):
        termes.append(a)
        a, b = b, a + b
    return termes

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 4.5))

vol = syracuse(27)
ax1.plot(vol, lw=1, color="tab:blue")
ax1.set_title(f"Vol de Syracuse de 27 : {len(vol) - 1} étapes, sommet {max(vol)}")
ax1.set_xlabel("étape")
ax1.grid(alpha=0.3)

F = fibonacci(20)
ratios = [F[k + 1] / F[k] for k in range(2, 19)]
phi = (1 + 5 ** 0.5) / 2
ax2.plot(range(2, 19), ratios, "o-", color="tab:green")
ax2.axhline(phi, color="tab:red", ls="--", label=f"φ = {phi:.6f}")
ax2.set_title("F(n+1)/F(n) converge vers le nombre d'or")
ax2.set_xlabel("n")
ax2.legend()
ax2.grid(alpha=0.3)

plt.tight_layout()
plt.show()
print("Syracuse oscille violemment avant de retomber sur 1 ;")
print("Fibonacci, lui, s'ordonne immédiatement autour de φ.")`,
      },
      {
        label: 'PLUS LOIN',
        code: `# Temps de vol de tous les entiers de 1 à 200 : aucune régularité visible
import matplotlib.pyplot as plt

def temps_de_vol(n):
    t = 0
    while n != 1:
        n = n // 2 if n % 2 == 0 else 3 * n + 1
        t += 1
    return t

N = range(1, 201)
temps = [temps_de_vol(n) for n in N]

fig, ax = plt.subplots(figsize=(10, 4.5))
ax.bar(N, temps, width=1.0, color="tab:blue")
ax.set_xlabel("n")
ax.set_ylabel("temps de vol")
ax.set_title("Conjecture de Syracuse : vérifiée ici jusqu'à 200, prouvée nulle part")
plt.tight_layout()
plt.show()
record = max(range(1, 201), key=temps_de_vol)
print(f"record sur [1, 200] : n = {record}, {temps_de_vol(record)} étapes.")
print("La conjecture a été vérifiée par ordinateur au-delà de 10^20,")
print("mais aucune démonstration n'existe à ce jour.")`,
      },
    ],
  },

  {
    id: 'secantes',
    niveau: 'Première',
    theme: 'Dérivation',
    titre: 'Coefficients directeurs des sécantes',
    bo: 'Écrire la liste des coefficients directeurs des sécantes pour un pas donné.',
    objectif: 'Voir le nombre dérivé apparaître : les pentes des sécantes se stabilisent quand le pas h se rapproche de 0.',
    idee: 'La sécante entre les points d\'abscisses a et a + h a pour pente le taux de variation (f(a+h) − f(a))/h. On calcule cette pente pour des h de plus en plus petits : la limite est f\'(a).',
    retenir: 'Le taux de variation est une pente de droite, rien de plus. Ne prenez pas h trop petit en machine (en dessous de 10⁻⁸) : les erreurs d\'arrondi finissent par dominer le calcul.',
    variantes: [
      {
        label: 'ALGORITHME',
        code: `# Pentes des sécantes de f en a, pour un pas h de plus en plus fin

def f(x):
    return x ** 2

a = 1   # on devine f'(1) = 2

print("    h          taux (f(a+h)-f(a))/h")
for h in [1, 0.5, 0.1, 0.01, 0.001, 0.0001]:
    taux = (f(a + h) - f(a)) / h
    print(f"{h:>9} : {taux:.6f}")

print()
# Liste des pentes des sécantes successives sur [0, 2] pour un pas donné,
# comme le demande le programme : c'est une dérivée vue en plusieurs points.
h = 0.25
pentes = []
x = 0
while x + h <= 2:
    pentes.append(round((f(x + h) - f(x)) / h, 4))
    x = x + h
print(f"pentes des sécantes sur [0, 2] avec h = {h} :")
print(pentes)
print("on reconnaît environ 2x + h : la dérivée de x² est 2x.")`,
      },
      {
        label: 'VISUALISATION',
        code: `# Les sécantes pivotent vers la tangente quand h diminue
import numpy as np
import matplotlib.pyplot as plt

f = lambda x: x ** 2
a = 1
X = np.linspace(-0.2, 2.4, 200)

fig, ax = plt.subplots(figsize=(8.5, 6))
ax.plot(X, f(X), color="black", lw=1.5, label="y = x²")

couleurs = plt.cm.viridis(np.linspace(0.15, 0.85, 4))
for h, c in zip([1.2, 0.7, 0.35, 0.12], couleurs):
    pente = (f(a + h) - f(a)) / h
    ax.plot(X, f(a) + pente * (X - a), color=c, lw=1,
            label=f"sécante h = {h} (pente {pente:.2f})")
    ax.plot([a + h], [f(a + h)], "o", color=c, ms=5)

# la tangente, pente exacte 2
ax.plot(X, f(a) + 2 * (X - a), color="tab:red", ls="--", lw=1.6,
        label="tangente (pente 2)")
ax.plot([a], [f(a)], "o", color="tab:red", ms=7)

ax.set_ylim(-0.7, 5.2)
ax.set_title("En resserrant h, la sécante devient la tangente")
ax.legend(fontsize=8)
ax.grid(alpha=0.3)
plt.tight_layout()
plt.show()
print("Le nombre dérivé est la pente limite : ici f'(1) = 2.")`,
      },
    ],
  },

  {
    id: 'newton-premiere',
    niveau: 'Première',
    theme: 'Fonctions',
    titre: 'Méthode de Newton (cas favorable)',
    bo: 'Méthode de Newton, en se limitant à des cas favorables.',
    objectif: 'Résoudre f(x) = 0 beaucoup plus vite que par balayage : on suit la tangente.',
    idee: 'Depuis un point x, on trace la tangente à la courbe et on regarde où elle coupe l\'axe des abscisses : c\'est le point suivant, x − f(x)/f\'(x). Sur un cas favorable comme f(x) = x² − 2, chaque étape double environ le nombre de décimales exactes.',
    retenir: 'Newton appliqué à x² − a redonne la méthode de Héron : x devient (x + a/x)/2, connue des Babyloniens. La condition de bon fonctionnement : partir assez près de la solution, avec f\' qui ne s\'annule pas.',
    variantes: [
      {
        label: 'ALGORITHME',
        code: `# Méthode de Newton pour f(x) = x² - 2 : on calcule √2
from math import sqrt

def f(x):
    return x * x - 2

def f_prime(x):
    return 2 * x

x = 2.0          # point de départ
print("étape 0 :", x)
for k in range(1, 7):
    x = x - f(x) / f_prime(x)
    erreur = abs(x - sqrt(2))
    print(f"étape {k} : {x:.15f}   erreur {erreur:.2e}")

print()
print("√2        :", sqrt(2))
print("Le nombre de décimales exactes double presque à chaque étape :")
print("c'est la convergence quadratique.")`,
      },
      {
        label: 'VISUALISATION',
        code: `# La descente le long des tangentes
import numpy as np
import matplotlib.pyplot as plt

f = lambda x: x * x - 2
fp = lambda x: 2 * x

X = np.linspace(0.8, 2.3, 200)
fig, ax = plt.subplots(figsize=(8.5, 6))
ax.plot(X, f(X), color="black", lw=1.5, label="y = x² - 2")
ax.axhline(0, color="#888888", lw=1)

x = 2.0
couleurs = ["tab:red", "tab:orange", "tab:green"]
for k, c in enumerate(couleurs):
    x_suiv = x - f(x) / fp(x)
    ax.plot([x, x], [0, f(x)], color=c, ls=":", lw=1)
    ax.plot(X, f(x) + fp(x) * (X - x), color=c, lw=1,
            label=f"tangente en x{k} = {x:.4f}")
    ax.plot([x_suiv], [0], "o", color=c, ms=6)
    x = x_suiv

ax.plot([2 ** 0.5], [0], "*", color="tab:blue", ms=16, zorder=3,
        label="√2 (solution)")
ax.set_ylim(-1.5, 2.6)
ax.set_title("Chaque tangente envoie son pied bien plus près de la solution")
ax.legend(fontsize=8)
ax.grid(alpha=0.3)
plt.tight_layout()
plt.show()
print("Trois tangentes suffisent pour coller à √2 : comparez au balayage de seconde.")`,
      },
    ],
  },

  {
    id: 'euler-exp',
    niveau: 'Première',
    theme: 'Fonction exponentielle',
    titre: 'Construire exp par la méthode d\'Euler',
    bo: 'Construction de l\'exponentielle par la méthode d\'Euler. Valeur approchée de e à l\'aide de la suite (1 + 1/n)ⁿ.',
    objectif: 'Fabriquer la fonction exponentielle à partir de sa seule définition : elle est égale à sa dérivée et vaut 1 en 0.',
    idee: 'Si y\' = y, alors sur un petit pas h on a y(x + h) ≈ y(x) + h·y(x) = (1 + h)·y(x). En partant de y(0) = 1 et en répétant, on construit une ligne brisée qui approche la courbe de exp. Avec h = 1/n, arriver en x = 1 donne exactement (1 + 1/n)ⁿ, d\'où la suite qui converge vers e.',
    retenir: 'La méthode d\'Euler transforme une équation différentielle en suite géométrique de raison (1 + h). Le lien avec (1 + 1/n)ⁿ n\'est pas une coïncidence : c\'est le même calcul vu deux fois.',
    variantes: [
      {
        label: 'ALGORITHME',
        code: `# Euler pour y' = y, y(0) = 1 : on avance pas à pas jusqu'à x = 1
import math

def euler(h):
    x, y = 0.0, 1.0
    while x < 1 - h / 2:        # on s'arrête en x = 1
        y = (1 + h) * y
        x = x + h
    return y

print("pas h        y(1) approché      e exact :", math.e)
for h in [0.5, 0.1, 0.01, 0.001, 0.0001]:
    print(f"{h:<10} : {euler(h):.8f}")

print()
# La même chose vue comme une suite : (1 + 1/n)^n
print("suite (1 + 1/n)^n :")
for n in [1, 10, 100, 1000, 10 ** 6]:
    print(f"  n = {n:<8} : {(1 + 1 / n) ** n:.8f}")`,
      },
      {
        label: 'VISUALISATION',
        code: `# Les lignes brisées d'Euler se couchent sur la courbe de exp
import numpy as np
import matplotlib.pyplot as plt

X = np.linspace(0, 2, 200)
fig, ax = plt.subplots(figsize=(8.5, 5.5))
ax.plot(X, np.exp(X), color="black", lw=2, label="exp (exacte)")

for h, c in [(0.5, "tab:red"), (0.25, "tab:orange"), (0.05, "tab:green")]:
    xs, ys = [0.0], [1.0]
    while xs[-1] < 2 - h / 2:
        ys.append((1 + h) * ys[-1])
        xs.append(xs[-1] + h)
    ax.plot(xs, ys, "o-", color=c, ms=3, lw=1, label=f"Euler, h = {h}")

ax.set_title("y' = y, y(0) = 1 : la ligne brisée d'Euler approche exp")
ax.legend()
ax.grid(alpha=0.3)
plt.tight_layout()
plt.show()
print("Plus le pas est petit, plus la ligne brisée colle à la courbe.")
print("En x = 1 avec h = 1/n, la valeur construite est (1 + 1/n)^n.")`,
      },
    ],
  },

  {
    id: 'archimede-pi',
    niveau: 'Première',
    theme: 'Fonctions trigonométriques',
    titre: 'Approximation de π par Archimède',
    bo: 'Approximation de π par la méthode d\'Archimède.',
    objectif: 'Encadrer π comme Archimède il y a 2 200 ans : entre les périmètres des polygones inscrits et circonscrits au cercle.',
    idee: 'On part de l\'hexagone : demi-périmètre inscrit b = 3, circonscrit a = 2√3. Quand on double le nombre de côtés, les nouvelles valeurs s\'obtiennent par a\' = 2ab/(a + b) puis b\' = √(a\'b). On répète : b monte vers π, a descend vers π.',
    retenir: 'Archimède s\'est arrêté au polygone à 96 côtés et a obtenu 3 + 10/71 < π < 3 + 1/7. Chaque doublement gagne environ un facteur 4 sur l\'erreur : c\'est déjà bien mieux que le balayage.',
    variantes: [
      {
        label: 'ALGORITHME',
        code: `# Méthode d'Archimède : doublement du nombre de côtés
from math import sqrt, pi

n = 6                 # on part de l'hexagone
a = 2 * sqrt(3)       # demi-périmètre du polygone circonscrit
b = 3.0               # demi-périmètre du polygone inscrit

print(f"{'côtés':>7} : encadrement de pi")
print(f"{n:>7} : {b:.10f} < pi < {a:.10f}")
for _ in range(10):
    a = 2 * a * b / (a + b)    # moyenne harmonique
    b = sqrt(a * b)            # moyenne géométrique
    n = n * 2
    print(f"{n:>7} : {b:.10f} < pi < {a:.10f}")

print()
print(f"pi       : {pi:.10f}")
print("À 96 côtés, on retrouve l'encadrement historique d'Archimède :")
print("3 + 10/71 =", 3 + 10 / 71, " et  3 + 1/7 =", 3 + 1 / 7)`,
      },
      {
        label: 'VISUALISATION',
        code: `# Le cercle pris en étau entre polygones inscrits et circonscrits
import numpy as np
import matplotlib.pyplot as plt

fig, axes = plt.subplots(1, 3, figsize=(12, 4.2))
T = np.linspace(0, 2 * np.pi, 300)

for ax, n in zip(axes, [6, 12, 24]):
    ax.plot(np.cos(T), np.sin(T), color="black", lw=1.5)
    t = np.linspace(0, 2 * np.pi, n + 1)
    # polygone inscrit : sommets sur le cercle
    ax.plot(np.cos(t), np.sin(t), color="tab:blue", lw=1)
    # polygone circonscrit : côtés tangents au cercle
    r = 1 / np.cos(np.pi / n)
    ax.plot(r * np.cos(t + np.pi / n), r * np.sin(t + np.pi / n),
            color="tab:red", lw=1)
    demi_inscrit = n * np.sin(np.pi / n)
    demi_circon = n * np.tan(np.pi / n)
    ax.set_title(f"n = {n}\\n{demi_inscrit:.4f} < pi < {demi_circon:.4f}",
                 fontsize=10)
    ax.set_aspect("equal")
    ax.axis("off")

fig.suptitle("L'étau d'Archimède se resserre : les deux périmètres tendent vers 2pi")
plt.tight_layout()
plt.show()
print("Le cercle est coincé : plus long que tout polygone inscrit,")
print("plus court que tout polygone circonscrit.")`,
      },
    ],
  },

  {
    id: 'montecarlo-aires',
    niveau: 'Première',
    theme: 'Probabilités',
    titre: 'Méthode de Monte-Carlo',
    bo: 'Méthode de Monte-Carlo : estimation de l\'aire sous la parabole, estimation du nombre π.',
    objectif: 'Mesurer une aire en tirant des points au hasard : la proportion de points qui tombent dedans estime l\'aire.',
    idee: 'On tire N points uniformément dans le carré unité. La fréquence des points sous la courbe y = x² estime l\'aire sous la parabole (1/3) ; la fréquence des points dans le quart de disque, multipliée par 4, estime π.',
    retenir: 'La précision croît comme 1/√N : pour gagner une décimale il faut cent fois plus de points. Monte-Carlo n\'est pas la méthode la plus rapide ici, mais elle se généralise à des situations où rien d\'autre ne marche.',
    variantes: [
      {
        label: 'ALGORITHME',
        code: `# Monte-Carlo : deux aires estimées par tirages aléatoires
from random import random

N = 200_000

sous_parabole = 0
dans_disque = 0
for _ in range(N):
    x, y = random(), random()
    if y <= x * x:
        sous_parabole += 1
    if x * x + y * y <= 1:
        dans_disque += 1

print(f"N = {N} points")
print()
print(f"aire sous la parabole : {sous_parabole / N:.5f}   (exact : 1/3 = 0.33333)")
print(f"estimation de pi      : {4 * dans_disque / N:.5f}   (exact : 3.14159)")
print()
print("Relancez : le résultat change un peu à chaque fois,")
print("c'est la fluctuation d'échantillonnage.")`,
      },
      {
        label: 'VISUALISATION',
        code: `# Les points qui votent : dessous en vert, dessus en gris
import numpy as np
import matplotlib.pyplot as plt

rng = np.random.default_rng()
N = 3000
P = rng.random((N, 2))

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(11, 5.2))

X = np.linspace(0, 1, 200)
sous = P[:, 1] <= P[:, 0] ** 2
ax1.scatter(*P[sous].T, s=3, color="tab:green")
ax1.scatter(*P[~sous].T, s=3, color="#cccccc")
ax1.plot(X, X ** 2, color="black", lw=1.5)
ax1.set_title(f"aire sous y = x² : {sous.mean():.4f} (exact 1/3)")
ax1.set_aspect("equal")

dans = (P ** 2).sum(axis=1) <= 1
ax2.scatter(*P[dans].T, s=3, color="tab:blue")
ax2.scatter(*P[~dans].T, s=3, color="#cccccc")
ax2.plot(np.cos(np.linspace(0, np.pi / 2)), np.sin(np.linspace(0, np.pi / 2)),
         color="black", lw=1.5)
ax2.set_title(f"pi estimé : {4 * dans.mean():.4f}")
ax2.set_aspect("equal")

fig.suptitle(f"Monte-Carlo avec N = {N} points")
plt.tight_layout()
plt.show()
print("L'aire est une probabilité déguisée : celle qu'un point uniforme tombe dedans.")`,
      },
    ],
  },

  {
    id: 'esperance-variance',
    niveau: 'Première',
    theme: 'Variables aléatoires',
    titre: 'Espérance, variance, écart type',
    bo: 'Algorithme renvoyant l\'espérance, la variance ou l\'écart type d\'une variable aléatoire.',
    objectif: 'Calculer les trois indicateurs d\'une variable aléatoire donnée par sa loi, puis vérifier par simulation que la moyenne observée s\'approche de l\'espérance.',
    idee: 'L\'espérance est la moyenne des valeurs pondérées par les probabilités. La variance est l\'espérance des carrés des écarts à cette moyenne, et l\'écart type sa racine. La simulation rejoue le jeu un grand nombre de fois et compare.',
    retenir: 'Une espérance positive ne dit pas qu\'on gagne à chaque coup : elle dit ce que rapporte le jeu en moyenne sur le long terme. L\'écart type mesure le risque autour de cette moyenne.',
    variantes: [
      {
        label: 'ALGORITHME',
        code: `# Un jeu : on mise, on peut perdre 2 €, gagner 1 € ou gagner 5 €
from math import sqrt

valeurs = [-2, 1, 5]
probas = [0.5, 0.3, 0.2]

def esperance(valeurs, probas):
    return sum(v * p for v, p in zip(valeurs, probas))

def variance(valeurs, probas):
    m = esperance(valeurs, probas)
    return sum(p * (v - m) ** 2 for v, p in zip(valeurs, probas))

def ecart_type(valeurs, probas):
    return sqrt(variance(valeurs, probas))

E = esperance(valeurs, probas)
print(f"espérance  : {E:.3f} €")
print(f"variance   : {variance(valeurs, probas):.3f}")
print(f"écart type : {ecart_type(valeurs, probas):.3f} €")
print()
print("Le jeu est légèrement favorable au joueur (espérance > 0),")
print("mais l'écart type montre que chaque partie reste très incertaine.")
print()

# Vérification par simulation
from random import choices
N = 100_000
gains = choices(valeurs, weights=probas, k=N)
print(f"moyenne observée sur {N} parties : {sum(gains) / N:.3f} €")`,
      },
      {
        label: 'VISUALISATION',
        code: `# La loi à gauche, la moyenne qui se stabilise à droite
import numpy as np
import matplotlib.pyplot as plt

valeurs = np.array([-2, 1, 5])
probas = np.array([0.5, 0.3, 0.2])
E = float((valeurs * probas).sum())

rng = np.random.default_rng()
N = 5000
gains = rng.choice(valeurs, size=N, p=probas)
moyennes = np.cumsum(gains) / np.arange(1, N + 1)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(11.5, 4.6))

ax1.bar(valeurs, probas, width=0.6, color="tab:blue")
for v, p in zip(valeurs, probas):
    ax1.annotate(str(p), (v, p), xytext=(0, 5),
                 textcoords="offset points", ha="center")
ax1.set_title("La loi de probabilité du gain")
ax1.set_xlabel("gain (€)"); ax1.set_ylabel("probabilité")

ax2.plot(moyennes, lw=0.9, color="tab:green")
ax2.axhline(E, color="tab:red", ls="--", label=f"espérance = {E:.2f} €")
ax2.set_title("Moyenne des gains au fil des parties")
ax2.set_xlabel("nombre de parties")
ax2.legend()
ax2.grid(alpha=0.3)

plt.tight_layout()
plt.show()
print("La moyenne fluctue beaucoup au début puis se range près de l'espérance :")
print("c'est la loi des grands nombres, étudiée en terminale.")`,
      },
    ],
  },

  {
    id: 'frequences-lettres',
    niveau: 'Première',
    theme: 'Variables aléatoires',
    titre: 'Fréquence des lettres d\'un texte',
    bo: 'Fréquence d\'apparition des lettres d\'un texte donné, en français, en anglais.',
    objectif: 'Compter les lettres d\'un texte et comparer les profils du français et de l\'anglais : c\'est le principe qui casse le chiffrement de César.',
    idee: 'Un dictionnaire compte les occurrences de chaque lettre, puis on divise par le total pour obtenir des fréquences. Le « e » domine dans les deux langues, mais les profils diffèrent assez pour identifier une langue, ou décrypter une substitution.',
    retenir: 'La structure dictionnaire {lettre: effectif} est l\'outil naturel du comptage. Et la statistique a une histoire : Al-Kindi décrivait déjà l\'analyse de fréquences au IXᵉ siècle pour casser des codes.',
    variantes: [
      {
        label: 'ALGORITHME',
        code: `# Fréquences des lettres : français contre anglais

texte_fr = """Au commencement les choses se passaient simplement.
La machine comptait les lettres une a une, sans jamais se tromper,
et rendait pour chaque texte le portrait exact de sa langue."""

texte_en = """In the beginning things happened simply. The machine
counted the letters one by one, never making a mistake, and returned
for each text the exact portrait of its language."""

def frequences(texte):
    texte = texte.lower()
    compte = {}
    total = 0
    for c in texte:
        if "a" <= c <= "z":
            compte[c] = compte.get(c, 0) + 1
            total += 1
    return {c: compte[c] / total for c in sorted(compte)}

for nom, texte in [("français", texte_fr), ("anglais", texte_en)]:
    f = frequences(texte)
    tri = sorted(f.items(), key=lambda kv: kv[1], reverse=True)
    print(f"{nom} : 5 lettres les plus fréquentes")
    for lettre, freq in tri[:5]:
        print(f"   {lettre} : {freq * 100:.1f} %")
    print()`,
      },
      {
        label: 'VISUALISATION',
        code: `# Les deux profils côte à côte, lettre par lettre
import numpy as np
import matplotlib.pyplot as plt

texte_fr = """Au commencement les choses se passaient simplement.
La machine comptait les lettres une a une, sans jamais se tromper,
et rendait pour chaque texte le portrait exact de sa langue."""
texte_en = """In the beginning things happened simply. The machine
counted the letters one by one, never making a mistake, and returned
for each text the exact portrait of its language."""

def frequences(texte):
    texte = texte.lower()
    compte = {}
    total = 0
    for c in texte:
        if "a" <= c <= "z":
            compte[c] = compte.get(c, 0) + 1
            total += 1
    return [compte.get(chr(97 + i), 0) / total for i in range(26)]

lettres = [chr(97 + i) for i in range(26)]
x = np.arange(26)

fig, ax = plt.subplots(figsize=(11, 4.5))
ax.bar(x - 0.2, frequences(texte_fr), width=0.4, label="français",
       color="tab:blue")
ax.bar(x + 0.2, frequences(texte_en), width=0.4, label="anglais",
       color="tab:orange")
ax.set_xticks(x, lettres)
ax.set_ylabel("fréquence")
ax.set_title("Chaque langue a sa signature statistique")
ax.legend()
plt.tight_layout()
plt.show()
print("Le e écrase tout dans les deux langues ; regardez ensuite h, t, w :")
print("typiques de l'anglais. C'est la base de la cryptanalyse classique.")`,
      },
    ],
  },
];
