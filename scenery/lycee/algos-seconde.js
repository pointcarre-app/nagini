/**
 * Algorithmes du programme officiel de seconde (BO 2019).
 * Chaque entrée : l'algorithme tel qu'on l'écrit en classe, une
 * visualisation matplotlib, parfois un prolongement.
 */

export const SECONDE = [
  {
    id: 'balayage-racine2',
    niveau: 'Seconde',
    theme: 'Nombres et calculs',
    titre: 'Encadrer √2 par balayage',
    bo: 'Déterminer par balayage un encadrement de √2 d\'amplitude inférieure ou égale à 10⁻ⁿ.',
    objectif: 'Construire un encadrement décimal de √2 aussi fin que l\'on veut, sans calculatrice : uniquement des comparaisons de carrés.',
    idee: 'On sait que 1 < √2 < 2. On avance par pas de 0,1 tant que le carré reste inférieur à 2 : on obtient 1,4 < √2 < 1,5. On recommence avec un pas de 0,01 à partir de 1,4, et ainsi de suite. Chaque passage divise l\'amplitude par 10.',
    retenir: 'Le balayage est lent mais ne demande que de savoir comparer. Remarquez le test (a + pas)² ≤ 2 : on compare des carrés, jamais des racines, car la racine est justement ce que l\'on cherche.',
    variantes: [
      {
        label: 'ALGORITHME',
        code: `# Encadrement de √2 par balayage, à 10**-n près
# On ne calcule jamais de racine : on compare des carrés.

n = 5            # précision demandée : amplitude 10**-n

a = 1.0          # borne basse, on part de 1 < √2 < 2
pas = 1.0
for k in range(n):
    pas = pas / 10
    # on avance tant que le carré ne dépasse pas 2
    while (a + pas) ** 2 <= 2:
        a = a + pas
    print(f"amplitude 10^-{k+1} : {a:.{k+1}f} < √2 < {a + pas:.{k+1}f}")

print()
print("vérification :", a, "au carré vaut", a * a)`,
      },
      {
        label: 'VISUALISATION',
        code: `# Le balayage vu comme un zoom successif sur la droite numérique
import math
import matplotlib.pyplot as plt

# on rejoue le balayage en mémorisant chaque encadrement
encadrements = []
a, pas = 1.0, 1.0
for k in range(5):
    pas /= 10
    while (a + pas) ** 2 <= 2:
        a += pas
    encadrements.append((a, a + pas))

fig, ax = plt.subplots(figsize=(9, 4))
for i, (lo, hi) in enumerate(encadrements):
    ax.plot([lo, hi], [-i, -i], lw=6, color="tab:blue", solid_capstyle="butt")
    ax.annotate(f"[{lo:.{i+1}f} ; {hi:.{i+1}f}]  amplitude 10^-{i+1}",
                (hi, -i), xytext=(10, -3), textcoords="offset points",
                fontsize=9)

ax.axvline(math.sqrt(2), color="tab:red", ls="--", lw=1)
ax.annotate("√2", (math.sqrt(2), 0.45), color="tab:red", fontsize=12,
            ha="center")
ax.set_xlim(0.95, 2.15)
ax.set_yticks([])
ax.set_title("Encadrements successifs de √2 : chaque ligne est un zoom x10")
plt.tight_layout()
plt.show()
print("Chaque segment bleu contient √2, et il est 10 fois plus court que le précédent.")`,
      },
    ],
  },

  {
    id: 'multiples-premiers',
    niveau: 'Seconde',
    theme: 'Nombres et calculs',
    titre: 'Multiples, diviseurs, nombres premiers',
    bo: 'Déterminer si a est multiple de b. Plus grand multiple de a inférieur ou égal à b. Déterminer si un entier naturel est premier.',
    objectif: 'Trois petites fonctions qui traduisent les définitions du cours : multiple, division euclidienne, nombre premier.',
    idee: 'Tout repose sur le reste de la division euclidienne, l\'opérateur % en Python. a est multiple de b quand le reste de a par b vaut 0. Pour la primalité, on essaie tous les diviseurs possibles, et on peut s\'arrêter à √n : si n = d × q avec d ≤ q, alors d² ≤ n.',
    retenir: 'L\'astuce d × d ≤ n évite de calculer une racine et accélère énormément le test : pour n = 10⁹ on fait environ 31 623 essais au lieu d\'un milliard.',
    variantes: [
      {
        label: 'ALGORITHME',
        code: `# Trois algorithmes du programme, fondés sur la division euclidienne

def est_multiple(a, b):
    """Renvoie True si a est un multiple de b."""
    return a % b == 0

def plus_grand_multiple(a, b):
    """Renvoie le plus grand multiple de a inférieur ou égal à b."""
    return (b // a) * a

def est_premier(n):
    """Renvoie True si n est premier, par essais de division."""
    if n < 2:
        return False
    d = 2
    while d * d <= n:     # inutile d'aller au-delà de √n
        if n % d == 0:
            return False  # on a trouvé un diviseur : pas premier
        d = d + 1
    return True

print("91 multiple de 7 ?", est_multiple(91, 7))
print("plus grand multiple de 17 inférieur à 1000 :", plus_grand_multiple(17, 1000))
print("17 premier ?", est_premier(17), "   91 premier ?", est_premier(91))
print()
print("nombres premiers inférieurs à 60 :")
print([n for n in range(2, 60) if est_premier(n)])`,
      },
      {
        label: 'VISUALISATION',
        code: `# La table des 100 premiers entiers : premiers en couleur
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.colors import ListedColormap

def est_premier(n):
    if n < 2:
        return False
    d = 2
    while d * d <= n:
        if n % d == 0:
            return False
        d += 1
    return True

grille = np.zeros((10, 10))
for n in range(1, 101):
    i, j = divmod(n - 1, 10)
    grille[i, j] = 1 if est_premier(n) else 0

fig, ax = plt.subplots(figsize=(7, 7))
ax.imshow(grille, cmap=ListedColormap(["#f0f0f0", "#4c72b0"]))
for n in range(1, 101):
    i, j = divmod(n - 1, 10)
    couleur = "white" if grille[i, j] else "#555555"
    ax.text(j, i, str(n), ha="center", va="center",
            color=couleur, fontsize=10)
ax.set_xticks([]); ax.set_yticks([])
ax.set_title("Les nombres premiers jusqu'à 100")
plt.tight_layout()
plt.show()
print("25 nombres premiers inférieurs à 100.")
print("Remarquez : à part 2 et 5, ils finissent tous par 1, 3, 7 ou 9.")`,
      },
    ],
  },

  {
    id: 'premiere-puissance',
    niveau: 'Seconde',
    theme: 'Nombres et calculs',
    titre: 'Première puissance dépassant un seuil',
    bo: 'Déterminer la première puissance d\'un nombre positif donné supérieure ou inférieure à une valeur donnée.',
    objectif: 'Trouver le plus petit exposant n tel que qⁿ dépasse un seuil S : c\'est le modèle de tous les problèmes de doublement de capital, de population, d\'épidémie.',
    idee: 'On multiplie par q en comptant les étapes, tant que le seuil n\'est pas atteint. Une boucle while s\'impose : on ne connaît pas le nombre de tours à l\'avance, c\'est précisément ce qu\'on cherche.',
    retenir: 'Si q > 1 la suite des puissances finit toujours par dépasser S : la boucle se termine. Si 0 < q < 1, c\'est l\'inverse : on cherche quand qⁿ passe sous le seuil. Vérifiez toujours que votre boucle while peut s\'arrêter.',
    variantes: [
      {
        label: 'ALGORITHME',
        code: `# Un capital augmente de 5 % par an : quand aura-t-il doublé ?
# On cherche le plus petit n tel que 1.05**n >= 2.

q = 1.05
S = 2

n = 0
p = 1.0
while p < S:
    p = p * q
    n = n + 1

print(f"au bout de {n} ans : x {p:.4f}")
print()

# Cas 0 < q < 1 : une grandeur perd 12 % par étape.
# Quand passe-t-elle sous 1 % de sa valeur initiale ?
q = 0.88
S = 0.01
n, p = 0, 1.0
while p > S:
    p = p * q
    n = n + 1
print(f"sous 1 % au bout de {n} étapes ({p:.5f})")`,
      },
      {
        label: 'VISUALISATION',
        code: `# La croissance des puissances de q et le seuil
import matplotlib.pyplot as plt

q, S = 1.05, 2
puissances = [q ** n for n in range(25)]
seuil_atteint = next(n for n, p in enumerate(puissances) if p >= S)

fig, ax = plt.subplots(figsize=(9, 4.5))
ax.plot(range(25), puissances, "o-", color="tab:blue", ms=4, label="q^n")
ax.axhline(S, color="tab:red", ls="--", label=f"seuil S = {S}")
ax.plot(seuil_atteint, puissances[seuil_atteint], "o", ms=10,
        color="tab:red", zorder=3)
ax.annotate(f"premier dépassement : n = {seuil_atteint}",
            (seuil_atteint, puissances[seuil_atteint]),
            xytext=(-10, 18), textcoords="offset points", color="tab:red")
ax.set_xlabel("n"); ax.set_ylabel("q^n")
ax.set_title(f"Puissances de q = {q} : quand double-t-on ?")
ax.legend()
ax.grid(alpha=0.3)
plt.tight_layout()
plt.show()
print(f"Réponse : n = {seuil_atteint}.",
      "La croissance est d'abord discrète, puis s'emballe : c'est l'exponentielle.")`,
      },
    ],
  },

  {
    id: 'droites-alignement',
    niveau: 'Seconde',
    theme: 'Géométrie',
    titre: 'Alignement et équation de droite',
    bo: 'Étudier l\'alignement de trois points dans le plan. Déterminer une équation de droite passant par deux points donnés.',
    objectif: 'Passer de la géométrie au calcul : trois points sont alignés si et seulement si deux vecteurs sont colinéaires, et une droite est un objet qu\'on peut décrire par une équation.',
    idee: 'A, B, C sont alignés quand les vecteurs AB et AC sont colinéaires, c\'est-à-dire quand x_AB × y_AC − y_AB × x_AC = 0. Pour l\'équation de (AB), la forme ax + by + c = 0 avec a = y_B − y_A et b = x_A − x_B marche dans tous les cas, y compris pour les droites verticales.',
    retenir: 'Préférez la forme ax + by + c = 0 à y = mx + p : elle n\'exclut aucune droite. Et attention aux nombres à virgule : avec des flottants, testez plutôt |déterminant| < 10⁻⁹ que l\'égalité stricte à 0.',
    variantes: [
      {
        label: 'ALGORITHME',
        code: `# Alignement de trois points et équation de droite

def alignes(A, B, C):
    """True si A, B, C sont alignés (déterminant nul)."""
    xa, ya = A
    xb, yb = B
    xc, yc = C
    det = (xb - xa) * (yc - ya) - (yb - ya) * (xc - xa)
    return det == 0

def equation_droite(A, B):
    """Renvoie (a, b, c) tels que ax + by + c = 0 soit la droite (AB)."""
    xa, ya = A
    xb, yb = B
    a = yb - ya
    b = xa - xb
    c = -(a * xa + b * ya)
    return a, b, c

A, B, C, D = (1, 2), (3, 5), (7, 11), (5, 9)

print("A, B, C alignés ?", alignes(A, B, C))   # (3-1)(11-2)-(5-2)(7-1) = 18-18
print("A, B, D alignés ?", alignes(A, B, D))

a, b, c = equation_droite(A, B)
print(f"droite (AB) : {a}x + {b}y + {c} = 0")
# contrôle : C doit vérifier l'équation
xc, yc = C
print("contrôle avec C :", a * xc + b * yc + c)`,
      },
      {
        label: 'VISUALISATION',
        code: `# Les points, la droite, et le point qui dépasse
import matplotlib.pyplot as plt

A, B, C, D = (1, 2), (3, 5), (7, 11), (5, 9)

def equation_droite(P, Q):
    a = Q[1] - P[1]
    b = P[0] - Q[0]
    c = -(a * P[0] + b * P[1])
    return a, b, c

a, b, c = equation_droite(A, B)

fig, ax = plt.subplots(figsize=(7.5, 6))
xs = [0, 8]
# y = (-c - ax) / b  (ici b n'est pas nul)
ax.plot(xs, [(-c - a * x) / b for x in xs], color="tab:blue",
        label=f"(AB) : {a}x + {b}y + {c} = 0")

for nom, P, coul in [("A", A, "tab:blue"), ("B", B, "tab:blue"),
                     ("C", C, "tab:green"), ("D", D, "tab:red")]:
    ax.plot(*P, "o", ms=8, color=coul)
    ax.annotate(nom, P, xytext=(8, 4), textcoords="offset points",
                fontsize=12, color=coul)

ax.annotate("D n'est pas sur la droite", D, xytext=(15, -20),
            textcoords="offset points", color="tab:red",
            arrowprops={"arrowstyle": "->", "color": "tab:red"})
ax.grid(alpha=0.3)
ax.set_title("C est aligné avec A et B, D ne l'est pas")
ax.legend()
plt.tight_layout()
plt.show()
print("Le déterminant mesure l'aire du parallélogramme construit sur AB et AC :")
print("aire nulle = vecteurs colinéaires = points alignés.")`,
      },
    ],
  },

  {
    id: 'extremum-longueur',
    niveau: 'Seconde',
    theme: 'Fonctions',
    titre: 'Extremum par balayage, longueur d\'une courbe',
    bo: 'Algorithmes d\'approximation numérique d\'un extremum (balayage, dichotomie). Calcul approché de la longueur d\'une portion de courbe.',
    objectif: 'Deux problèmes continus résolus par discrétisation : trouver un minimum en essayant beaucoup de valeurs, mesurer une courbe en la remplaçant par une ligne brisée.',
    idee: 'Pour l\'extremum : on parcourt [a, b] avec un pas fixe en retenant la plus petite valeur rencontrée, puis on raffine autour du gagnant avec un pas plus fin. Pour la longueur : on découpe la courbe en n petits morceaux et on additionne les longueurs des segments, calculées avec Pythagore.',
    retenir: 'La précision du balayage est limitée par le pas : raffiner localement coûte beaucoup moins cher que de balayer finement partout. Pour la longueur, testez sur le quart de cercle : vous devez retrouver π/2 ≈ 1,5708.',
    variantes: [
      {
        label: 'ALGORITHME',
        code: `# 1) Minimum approché par balayage, puis raffinement
from math import sqrt

def f(x):
    return x ** 2 - 4 * x + 1   # minimum exact en x = 2, f(2) = -3

def minimum_balayage(f, a, b, pas):
    x = a
    xm, m = a, f(a)
    while x <= b:
        if f(x) < m:
            xm, m = x, f(x)
        x = x + pas
    return xm, m

a, b, pas = 0.0, 5.0, 0.1
for etape in range(3):
    xm, m = minimum_balayage(f, a, b, pas)
    print(f"pas {pas:<7} : minimum ~ {m:.6f} atteint vers x = {xm:.4f}")
    # on resserre l'intervalle autour du minimum trouvé
    a, b, pas = xm - pas, xm + pas, pas / 10

# 2) Longueur approchée d'une courbe par une ligne brisée
def longueur(f, a, b, n):
    L = 0.0
    pas = (b - a) / n
    x = a
    for _ in range(n):
        L += sqrt(pas ** 2 + (f(x + pas) - f(x)) ** 2)
        x += pas
    return L

def quart_cercle(x):
    return sqrt(max(0.0, 1 - x * x))

print()
print("longueur du quart de cercle (valeur exacte : pi/2 = 1.570796...)")
for n in [10, 100, 1000, 10000]:
    print(f"  n = {n:<6} : {longueur(quart_cercle, 0, 1, n):.6f}")`,
      },
      {
        label: 'VISUALISATION',
        code: `# La ligne brisée qui approche le quart de cercle
import numpy as np
import matplotlib.pyplot as plt

def quart_cercle(x):
    return np.sqrt(np.clip(1 - x * x, 0, None))

X = np.linspace(0, 1, 400)

fig, axes = plt.subplots(1, 3, figsize=(12, 4.2))
for ax, n in zip(axes, [3, 6, 16]):
    xs = np.linspace(0, 1, n + 1)
    ys = quart_cercle(xs)
    L = np.sum(np.hypot(np.diff(xs), np.diff(ys)))
    ax.plot(X, quart_cercle(X), color="#cccccc", lw=4)
    ax.plot(xs, ys, "o-", color="tab:red", ms=4, lw=1.5)
    ax.set_title(f"n = {n} segments\\nL ~ {L:.5f}")
    ax.set_aspect("equal")
    ax.grid(alpha=0.3)

fig.suptitle("La ligne brisée se colle à la courbe : L tend vers pi/2 = 1.57080")
plt.tight_layout()
plt.show()
print("Doubler n divise grossièrement l'erreur par 4 ici :")
print("la corde épouse d'autant mieux l'arc que celui-ci est court.")`,
      },
    ],
  },
];
