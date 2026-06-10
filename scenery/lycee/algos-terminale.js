/**
 * Algorithmes du programme officiel de terminale spécialité (BO 2019).
 */

export const TERMINALE = [
  {
    id: 'pascal',
    niveau: 'Terminale',
    theme: 'Combinatoire et dénombrement',
    titre: 'Coefficients binomiaux par la relation de Pascal',
    bo: 'Pour un entier n donné, génération de la liste des coefficients (n parmi k) à l\'aide de la relation de Pascal.',
    objectif: 'Construire les coefficients binomiaux sans factorielle, uniquement par additions, exactement comme dans le triangle de Pascal.',
    idee: 'Chaque ligne du triangle se déduit de la précédente : un coefficient est la somme des deux qui le surplombent. C\'est la relation de Pascal, (n k) = (n−1 k−1) + (n−1 k). On part de [1] et on itère.',
    retenir: 'Cette construction n\'utilise que des entiers : aucun arrondi, aucun dépassement intermédiaire, contrairement à la formule avec factorielles. La somme d\'une ligne vaut 2ⁿ : c\'est le nombre de parties d\'un ensemble à n éléments.',
    variantes: [
      {
        label: 'ALGORITHME',
        code: `# Triangle de Pascal : chaque ligne se déduit de la précédente

def ligne_suivante(L):
    """De la ligne n, fabrique la ligne n+1 par la relation de Pascal."""
    return [1] + [L[i] + L[i + 1] for i in range(len(L) - 1)] + [1]

def coefficients(n):
    """Liste des (n parmi k) pour k de 0 à n."""
    L = [1]
    for _ in range(n):
        L = ligne_suivante(L)
    return L

# le triangle, joliment centré
for n in range(11):
    ligne = coefficients(n)
    print(" ".join(f"{c}" for c in ligne).center(60))

print()
L = coefficients(20)
print("ligne n = 20 :", L)
print("somme de la ligne :", sum(L), "= 2^20 =", 2 ** 20)`,
      },
      {
        label: 'VISUALISATION',
        code: `# La parité des coefficients dessine le triangle de Sierpinski
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.colors import ListedColormap

N = 128
grille = np.zeros((N, N))
L = [1]
for n in range(N):
    for k, c in enumerate(L):
        grille[n, k] = c % 2          # 1 si impair, 0 si pair
    L = [1] + [L[i] + L[i + 1] for i in range(len(L) - 1)] + [1]

fig, ax = plt.subplots(figsize=(8, 8))
ax.imshow(grille, cmap=ListedColormap(["white", "tab:blue"]),
          interpolation="nearest")
ax.set_xlabel("k"); ax.set_ylabel("n")
ax.set_title("Coefficients binomiaux impairs : une fractale dans le triangle de Pascal")
plt.tight_layout()
plt.show()
print("Personne ne demande ça au bac, mais regardez :")
print("l'arithmétique modulo 2 fait surgir le triangle de Sierpinski.")`,
      },
    ],
  },

  {
    id: 'permutations',
    niveau: 'Terminale',
    theme: 'Combinatoire et dénombrement',
    titre: 'Permutations et parties d\'un ensemble',
    bo: 'Génération des permutations d\'un ensemble fini, ou tirage aléatoire d\'une permutation. Génération des parties à 2, 3 éléments.',
    objectif: 'Énumérer effectivement ce que la combinatoire compte : les n! permutations, les (n 2) paires, les (n 3) triplets.',
    idee: 'Pour générer toutes les permutations : on choisit chaque élément comme premier, et on permute récursivement le reste. Pour tirer une permutation au hasard uniformément : le mélange de Fisher-Yates, qui échange chaque position avec une position aléatoire parmi les précédentes. Pour les paires : deux boucles imbriquées avec j > i, ce qui évite les doublons.',
    retenir: 'La condition j > i dans les boucles est exactement ce qui fait qu\'on compte chaque partie une seule fois : une partie n\'est pas ordonnée. Et méfiez-vous des mélanges naïfs : Fisher-Yates est le seul qui donne toutes les permutations équiprobables.',
    variantes: [
      {
        label: 'ALGORITHME',
        code: `# Générer, mélanger, énumérer

def permutations(L):
    """Toutes les permutations de L, par récursivité."""
    if len(L) <= 1:
        return [L[:]]
    resultat = []
    for i in range(len(L)):
        reste = L[:i] + L[i + 1:]
        for p in permutations(reste):
            resultat.append([L[i]] + p)
    return resultat

from random import randint

def melange(L):
    """Tirage uniforme d'une permutation : Fisher-Yates."""
    L = L[:]
    for i in range(len(L) - 1, 0, -1):
        j = randint(0, i)
        L[i], L[j] = L[j], L[i]
    return L

def paires(L):
    return [(L[i], L[j]) for i in range(len(L)) for j in range(i + 1, len(L))]

def triplets(L):
    n = len(L)
    return [(L[i], L[j], L[k]) for i in range(n)
            for j in range(i + 1, n) for k in range(j + 1, n)]

E = ["a", "b", "c", "d"]
P = permutations(E)
print(len(P), "permutations de", E, ":")
print(P)
print()
print("un mélange au hasard :", melange(E))
print()
print(len(paires(E)), "paires :", paires(E))
print(len(triplets(E)), "triplets :", triplets(E))
print("on vérifie : (4 parmi 2) = 6 et (4 parmi 3) = 4")`,
      },
      {
        label: 'VISUALISATION',
        code: `# Fisher-Yates est-il vraiment uniforme ? On le met à l'épreuve.
import matplotlib.pyplot as plt
from random import randint

def melange(L):
    L = L[:]
    for i in range(len(L) - 1, 0, -1):
        j = randint(0, i)
        L[i], L[j] = L[j], L[i]
    return L

N = 60_000
compte = {}
for _ in range(N):
    p = "".join(melange(list("abc")))
    compte[p] = compte.get(p, 0) + 1

perms = sorted(compte)
freqs = [compte[p] / N for p in perms]

fig, ax = plt.subplots(figsize=(8.5, 4.5))
ax.bar(perms, freqs, color="tab:blue")
ax.axhline(1 / 6, color="tab:red", ls="--", label="1/6 attendu")
ax.set_ylim(0, 0.25)
ax.set_title(f"{N} mélanges de 'abc' : les 6 permutations sortent équitablement")
ax.legend()
plt.tight_layout()
plt.show()
print("Les six barres frôlent 1/6 : le mélange est uniforme.")
print("Un mélange naïf (échanger chaque case avec une case quelconque)")
print("échouerait à ce test : essayez !")`,
      },
    ],
  },

  {
    id: 'approx-constantes',
    niveau: 'Terminale',
    theme: 'Suites',
    titre: 'Valeurs approchées de π, e, √2, φ, ln 2',
    bo: 'Recherche de seuils. Recherche de valeurs approchées de π, e, √2, (1+√5)/2, ln(2).',
    objectif: 'Approcher les grandes constantes par des suites, et surtout comparer les vitesses de convergence : toutes les suites ne se valent pas.',
    idee: 'Héron pour √2 (chaque étape double les décimales), la somme des 1/k! pour e (très rapide), u(n+1) = 1 + 1/u(n) pour le nombre d\'or, et les séries de Leibniz et harmonique alternée pour π et ln 2, terriblement lentes. Pour chacune, on cherche le seuil : combien d\'itérations pour une précision donnée.',
    retenir: 'Le critère honnête pour comparer des méthodes, c\'est le nombre d\'itérations pour atteindre une précision fixée. Héron : 5 étapes pour 12 décimales. Leibniz : un million de termes pour 6 décimales. Même limite, mondes différents.',
    variantes: [
      {
        label: 'ALGORITHME',
        code: `# Cinq constantes, cinq suites, des vitesses très inégales
from math import sqrt, e, pi, log

eps = 1e-10

# √2 par Héron : u(n+1) = (u + 2/u) / 2
u, n = 2.0, 0
while abs(u * u - 2) > eps:
    u = (u + 2 / u) / 2
    n += 1
print(f"√2  par Héron        : {u:.12f} en {n} itérations")

# e par la somme des 1/k!
s, terme, k = 1.0, 1.0, 0
while terme > eps:
    k += 1
    terme = terme / k
    s += terme
print(f"e   par somme 1/k!   : {s:.12f} en {k} termes")

# nombre d'or par u(n+1) = 1 + 1/u(n)
u, n = 1.0, 0
while abs(u * u - u - 1) > eps:     # φ vérifie x² = x + 1
    u = 1 + 1 / u
    n += 1
print(f"φ   par 1 + 1/u      : {u:.12f} en {n} itérations")

# ln 2 par la série alternée 1 - 1/2 + 1/3 - ... (lente !)
s = 0.0
N = 100_000
for k in range(1, N + 1):
    s += (-1) ** (k + 1) / k
print(f"ln2 série alternée   : {s:.12f} avec {N} termes (erreur {abs(s - log(2)):.2e})")

# π par la série de Leibniz 4(1 - 1/3 + 1/5 - ...) (lente aussi)
s = 0.0
for k in range(N):
    s += (-1) ** k / (2 * k + 1)
print(f"π   série de Leibniz : {4 * s:.12f} avec {N} termes (erreur {abs(4 * s - pi):.2e})")`,
      },
      {
        label: 'VISUALISATION',
        code: `# L'erreur en fonction du nombre d'itérations, en échelle log
import numpy as np
import matplotlib.pyplot as plt
from math import sqrt, e, pi, log

phi = (1 + sqrt(5)) / 2

# Héron
err_heron, u = [], 2.0
for _ in range(8):
    u = (u + 2 / u) / 2
    err_heron.append(abs(u - sqrt(2)) + 1e-17)

# somme des 1/k!
err_e, s, terme = [], 1.0, 1.0
for k in range(1, 18):
    terme /= k
    s += terme
    err_e.append(abs(s - e) + 1e-17)

# 1 + 1/u
err_phi, u = [], 1.0
for _ in range(40):
    u = 1 + 1 / u
    err_phi.append(abs(u - phi) + 1e-17)

# Leibniz
err_pi, s = [], 0.0
for k in range(2000):
    s += (-1) ** k / (2 * k + 1)
    err_pi.append(abs(4 * s - pi))

fig, ax = plt.subplots(figsize=(9.5, 5.5))
ax.semilogy(range(1, 9), err_heron, "o-", label="√2, Héron")
ax.semilogy(range(1, 18), err_e, "s-", label="e, somme 1/k!")
ax.semilogy(range(1, 41), err_phi, "^-", ms=3, label="φ, 1 + 1/u")
ax.semilogy(range(1, 2001), err_pi, "-", label="π, Leibniz")
ax.set_xlim(0, 60)
ax.set_xlabel("itérations")
ax.set_ylabel("erreur")
ax.set_title("Quatre suites, quatre vitesses : l'échelle est logarithmique")
ax.legend()
ax.grid(alpha=0.3, which="both")
plt.tight_layout()
plt.show()
print("Héron plonge verticalement : convergence quadratique.")
print("Leibniz traverse le graphique presque à plat : convergence en 1/n.")`,
      },
    ],
  },

  {
    id: 'dichotomie',
    niveau: 'Terminale',
    theme: 'Continuité',
    titre: 'Méthode de dichotomie',
    bo: 'Méthode de dichotomie.',
    objectif: 'Résoudre f(x) = 0 avec une garantie absolue de précision, en coupant l\'intervalle en deux à chaque étape.',
    idee: 'Si f est continue et change de signe sur [a, b], le théorème des valeurs intermédiaires garantit une solution. On regarde le milieu m : la solution est dans la moitié où f change de signe. On répète : l\'intervalle est divisé par 2 à chaque tour.',
    retenir: 'La dichotomie est lente mais infaillible : l\'erreur est divisée par 2 à chaque étape, donc il faut log₂((b−a)/ε) étapes, ni plus ni moins. Le test f(a)·f(m) ≤ 0 encode « f change de signe sur [a, m] ».',
    variantes: [
      {
        label: 'ALGORITHME',
        code: `# Dichotomie pour f(x) = x³ + x - 1 sur [0, 1]
from math import log2, ceil

def f(x):
    return x ** 3 + x - 1

def dichotomie(f, a, b, eps):
    """Encadrement de la solution de f(x) = 0 à eps près.
    Hypothèse : f continue et f(a) * f(b) <= 0."""
    etapes = 0
    while b - a > eps:
        m = (a + b) / 2
        if f(a) * f(m) <= 0:
            b = m      # la solution est dans [a, m]
        else:
            a = m      # la solution est dans [m, b]
        etapes += 1
    return a, b, etapes

for eps in [1e-2, 1e-6, 1e-12]:
    a, b, n = dichotomie(f, 0, 1, eps)
    prevu = ceil(log2(1 / eps))
    print(f"eps = {eps:<7} : {a:.13f} < x < {b:.13f}")
    print(f"            {n} étapes (théorie : {prevu})")
print()
print("Le nombre d'étapes était prévisible avant de commencer :")
print("c'est la grande force de la dichotomie.")`,
      },
      {
        label: 'VISUALISATION',
        code: `# L'intervalle qui se referme sur la solution
import numpy as np
import matplotlib.pyplot as plt

f = lambda x: x ** 3 + x - 1

X = np.linspace(0, 1, 200)
fig, ax = plt.subplots(figsize=(8.5, 6))
ax.plot(X, f(X), color="black", lw=1.5, label="y = x³ + x - 1")
ax.axhline(0, color="#888888", lw=1)

a, b = 0.0, 1.0
for i in range(7):
    ax.plot([a, b], [-1.1 + 0.08 * i] * 2, lw=4, color="tab:blue",
            alpha=0.35 + 0.09 * i, solid_capstyle="butt")
    m = (a + b) / 2
    if f(a) * f(m) <= 0:
        b = m
    else:
        a = m

ax.plot([a], [0], "*", ms=15, color="tab:red", zorder=3,
        label=f"solution ~ {a:.4f}")
ax.set_title("Chaque barre bleue est l'intervalle d'une étape : il est divisé par 2")
ax.legend()
ax.grid(alpha=0.3)
plt.tight_layout()
plt.show()
print("Sept étapes : l'intervalle a été divisé par 2^7 = 128.")`,
      },
    ],
  },

  {
    id: 'newton-secante',
    niveau: 'Terminale',
    theme: 'Continuité',
    titre: 'Newton et la sécante, le match',
    bo: 'Méthode de Newton, méthode de la sécante.',
    objectif: 'Deux accélérations de la dichotomie : suivre la tangente (Newton) ou la corde (sécante), et mesurer qui converge le plus vite.',
    idee: 'Newton remplace la courbe par sa tangente : x devient x − f(x)/f\'(x), il faut connaître la dérivée. La sécante fait pareil avec la droite passant par les deux derniers points : pas besoin de dérivée. On compare les trois méthodes sur la même équation x³ + x − 1 = 0.',
    retenir: 'Ordres de convergence : dichotomie 1 (l\'erreur est divisée par 2), sécante environ 1,618 (le nombre d\'or, authentique), Newton 2 (les décimales doublent). En pratique la sécante est souvent le meilleur compromis : presque aussi rapide que Newton, sans calculer de dérivée.',
    variantes: [
      {
        label: 'ALGORITHME',
        code: `# Trois méthodes sur f(x) = x³ + x - 1

def f(x):
    return x ** 3 + x - 1

def f_prime(x):
    return 3 * x ** 2 + 1

# la solution de référence, obtenue par Newton poussé à fond
ref = 1.0
for _ in range(60):
    ref = ref - f(ref) / f_prime(ref)

print("solution de référence :", ref)
print()

# Newton
x = 1.0
print("Newton :")
for k in range(1, 6):
    x = x - f(x) / f_prime(x)
    print(f"  étape {k} : erreur {abs(x - ref):.2e}")

# Sécante : on garde les deux derniers points
x0, x1 = 0.0, 1.0
print("Sécante :")
for k in range(1, 8):
    x2 = x1 - f(x1) * (x1 - x0) / (f(x1) - f(x0))
    x0, x1 = x1, x2
    print(f"  étape {k} : erreur {abs(x1 - ref):.2e}")

# Dichotomie, pour comparaison
a, b = 0.0, 1.0
print("Dichotomie :")
for k in range(1, 8):
    m = (a + b) / 2
    if f(a) * f(m) <= 0:
        b = m
    else:
        a = m
    print(f"  étape {k} : erreur {abs(m - ref):.2e}")`,
      },
      {
        label: 'VISUALISATION',
        code: `# La course des erreurs, en échelle logarithmique
import matplotlib.pyplot as plt

f = lambda x: x ** 3 + x - 1
fp = lambda x: 3 * x ** 2 + 1

ref = 1.0
for _ in range(60):
    ref = ref - f(ref) / fp(ref)

err_newton, x = [], 1.0
for _ in range(7):
    x = x - f(x) / fp(x)
    err_newton.append(max(abs(x - ref), 1e-17))

err_secante, x0, x1 = [], 0.0, 1.0
for _ in range(9):
    x2 = x1 - f(x1) * (x1 - x0) / (f(x1) - f(x0))
    x0, x1 = x1, x2
    err_secante.append(max(abs(x1 - ref), 1e-17))

err_dicho, a, b = [], 0.0, 1.0
for _ in range(40):
    m = (a + b) / 2
    if f(a) * f(m) <= 0:
        b = m
    else:
        a = m
    err_dicho.append(max(abs(m - ref), 1e-17))

fig, ax = plt.subplots(figsize=(9, 5.5))
ax.semilogy(range(1, 41), err_dicho, "o-", ms=3, label="dichotomie (ordre 1)")
ax.semilogy(range(1, 10), err_secante, "s-", label="sécante (ordre ~1.618)")
ax.semilogy(range(1, 8), err_newton, "^-", label="Newton (ordre 2)")
ax.axhline(1e-15, color="#aaaaaa", ls=":", label="précision des flottants")
ax.set_xlabel("itérations")
ax.set_ylabel("erreur")
ax.set_title("x³ + x - 1 = 0 : la pente du nuage de points, c'est l'ordre de convergence")
ax.legend()
ax.grid(alpha=0.3, which="both")
plt.tight_layout()
plt.show()
print("Newton touche le plancher des flottants en 5 étapes, la sécante en 8,")
print("la dichotomie y serait encore dans 10 étapes. Et l'ordre de la sécante")
print("est le nombre d'or : la combinatoire de Fibonacci se cache dedans.")`,
      },
    ],
  },

  {
    id: 'briggs',
    niveau: 'Terminale',
    theme: 'Fonction logarithme',
    titre: 'Algorithme de Briggs pour le logarithme',
    bo: 'Algorithme de Briggs pour le calcul du logarithme.',
    objectif: 'Calculer un logarithme comme en 1617 : uniquement avec des racines carrées, comme Henry Briggs pour ses tables.',
    idee: 'En prenant n fois la racine carrée de x, on obtient y = x^(1/2ⁿ), très proche de 1. Or pour y proche de 1, ln(y) ≈ y − 1. Donc ln(x) ≈ 2ⁿ × (x^(1/2ⁿ) − 1) : on compense les n racines en multipliant par 2ⁿ.',
    retenir: 'Briggs illustre les deux faces du calcul numérique : l\'erreur de méthode diminue quand n grandit, mais l\'erreur d\'arrondi explose car y − 1 devient minuscule. Il existe un n optimal, ni trop petit ni trop grand : c\'est une leçon générale.',
    variantes: [
      {
        label: 'ALGORITHME',
        code: `# Briggs : le logarithme avec la seule touche racine carrée
from math import sqrt, log

def briggs(x, n):
    """Valeur approchée de ln(x) avec n racines carrées successives."""
    y = x
    for _ in range(n):
        y = sqrt(y)
    # y = x**(1/2**n) est proche de 1, et ln(y) ~ y - 1
    return (y - 1) * 2 ** n

x = 2
print("ln(2) exact :", log(2))
print()
print(" n   approximation       erreur")
for n in [2, 5, 10, 15, 20, 25, 30, 35, 40]:
    approx = briggs(x, n)
    print(f"{n:>2}   {approx:.12f}   {abs(approx - log(2)):.2e}")

print()
print("L'erreur diminue jusqu'à n ~ 25 puis remonte : les arrondis")
print("sur y - 1, devenu minuscule, finissent par tout gâcher.")
print()
print("log10(2) = ln(2)/ln(10) ~", briggs(2, 20) / briggs(10, 20))`,
      },
      {
        label: 'VISUALISATION',
        code: `# Le n optimal : erreur de méthode contre erreur d'arrondi
import matplotlib.pyplot as plt
from math import sqrt, log

def briggs(x, n):
    y = x
    for _ in range(n):
        y = sqrt(y)
    return (y - 1) * 2 ** n

ns = list(range(1, 49))
erreurs = [max(abs(briggs(2, n) - log(2)), 1e-18) for n in ns]

fig, ax = plt.subplots(figsize=(9, 5))
ax.semilogy(ns, erreurs, "o-", ms=4, color="tab:blue")
n_opt = ns[erreurs.index(min(erreurs))]
ax.axvline(n_opt, color="tab:red", ls="--",
           label=f"optimum vers n = {n_opt}")
ax.set_xlabel("n (nombre de racines carrées)")
ax.set_ylabel("erreur sur ln(2)")
ax.set_title("Briggs : la vallée entre l'erreur de méthode et l'erreur d'arrondi")
ax.legend()
ax.grid(alpha=0.3, which="both")
plt.tight_layout()
plt.show()
print("À gauche de la vallée : l'approximation ln(y) ~ y - 1 est trop grossière.")
print("À droite : y - 1 est si petit que les flottants ne le représentent plus.")
print("Tout calcul numérique vit entre ces deux pentes.")`,
      },
    ],
  },

  {
    id: 'euler-edo',
    niveau: 'Terminale',
    theme: 'Équations différentielles',
    titre: 'Méthode d\'Euler pour y\' = f et y\' = ay + b',
    bo: 'Résolution par la méthode d\'Euler de y\' = f, de y\' = ay + b.',
    objectif: 'Résoudre numériquement une équation différentielle : la loi de refroidissement de Newton, sans connaître la solution exacte.',
    idee: 'L\'équation y\' = ay + b dit dans quelle direction part la courbe en chaque point. Euler avance par petits pas dans cette direction : y devient y + h(ay + b). Exemple : un café à 80 °C dans une pièce à 20 °C, y\' = −0,1(y − 20).',
    retenir: 'L\'erreur d\'Euler est proportionnelle au pas h : diviser h par 10 divise l\'erreur par 10. La solution exacte de y\' = ay + b est y(t) = (y₀ + b/a)e^(at) − b/a : comparez, le code le fait pour vous.',
    variantes: [
      {
        label: 'ALGORITHME',
        code: `# Refroidissement d'un café : y' = -0.1 (y - 20), y(0) = 80
# forme y' = ay + b avec a = -0.1 et b = 2
from math import exp

a, b = -0.1, 2.0
y0 = 80.0

def euler(h, t_fin):
    t, y = 0.0, y0
    while t < t_fin - h / 2:
        y = y + h * (a * y + b)
        t = t + h
    return y

def exacte(t):
    # solution de y' = ay + b : y(t) = (y0 + b/a) e^(at) - b/a
    return (y0 + b / a) * exp(a * t) - b / a

t_fin = 10   # température du café au bout de 10 minutes
print("valeur exacte :", round(exacte(t_fin), 6), "°C")
print()
print(" pas h     Euler        erreur")
for h in [2, 1, 0.5, 0.1, 0.01, 0.001]:
    approx = euler(h, t_fin)
    print(f"{h:>6}   {approx:.6f}   {abs(approx - exacte(t_fin)):.2e}")
print()
print("Diviser h par 10 divise l'erreur par 10 environ : Euler est d'ordre 1.")`,
      },
      {
        label: 'VISUALISATION',
        code: `# Le champ des pentes et les lignes brisées d'Euler
import numpy as np
import matplotlib.pyplot as plt

a, b, y0 = -0.1, 2.0, 80.0
exacte = lambda t: (y0 + b / a) * np.exp(a * t) - b / a

fig, ax = plt.subplots(figsize=(9.5, 5.5))

# champ des directions : en chaque point, la pente vaut ay + b
for t in np.linspace(0, 30, 16):
    for y in np.linspace(15, 85, 12):
        pente = a * y + b
        dt = 0.8
        ax.plot([t, t + dt], [y, y + pente * dt], color="#bbbbbb", lw=0.8)

T = np.linspace(0, 30, 200)
ax.plot(T, exacte(T), color="black", lw=2, label="solution exacte")

for h, c in [(4, "tab:red"), (1, "tab:green")]:
    ts, ys = [0.0], [y0]
    while ts[-1] < 30 - h / 2:
        ys.append(ys[-1] + h * (a * ys[-1] + b))
        ts.append(ts[-1] + h)
    ax.plot(ts, ys, "o-", ms=3, lw=1.2, color=c, label=f"Euler, h = {h}")

ax.axhline(20, color="tab:blue", ls=":", label="température de la pièce")
ax.set_xlabel("temps (min)")
ax.set_ylabel("température (°C)")
ax.set_title("y' = -0.1(y - 20) : le café suit le champ des pentes")
ax.legend()
plt.tight_layout()
plt.show()
print("Les petits segments gris montrent la pente imposée par l'équation ;")
print("Euler ne fait que les suivre, pas après pas.")`,
      },
    ],
  },

  {
    id: 'integration',
    niveau: 'Terminale',
    theme: 'Calcul intégral',
    titre: 'Rectangles, milieux, trapèzes, Monte-Carlo',
    bo: 'Méthodes des rectangles, des milieux, des trapèzes. Méthode de Monte-Carlo. Algorithme de Brouncker pour le calcul de ln(2).',
    objectif: 'Calculer une intégrale numériquement par quatre méthodes et les départager, sur ∫₀¹ dx/(1+x) dont la valeur exacte est ln 2.',
    idee: 'Rectangles : on remplace f par une fonction en escalier. Milieux : même chose mais on évalue f au centre de chaque marche. Trapèzes : on relie les points par des segments. Monte-Carlo : on tire des points et on compte. Les trois premières sont des sommes de n termes, leurs erreurs décroissent en 1/n, 1/n² et 1/n².',
    retenir: 'La méthode des milieux est deux fois plus précise que celle des trapèzes pour le même travail, et toutes deux écrasent les rectangles. Brouncker, en prime, calcule ln 2 par la série 1/(1·2) + 1/(3·4) + 1/(5·6) + ..., qui n\'est rien d\'autre que la méthode des rectangles réorganisée.',
    variantes: [
      {
        label: 'ALGORITHME',
        code: `# Quatre méthodes pour ∫ de 0 à 1 de 1/(1+x) dx = ln(2)
from math import log
from random import random

def f(x):
    return 1 / (1 + x)

def rectangles_gauche(f, a, b, n):
    h = (b - a) / n
    return h * sum(f(a + k * h) for k in range(n))

def milieux(f, a, b, n):
    h = (b - a) / n
    return h * sum(f(a + (k + 0.5) * h) for k in range(n))

def trapezes(f, a, b, n):
    h = (b - a) / n
    return h * (f(a) / 2 + sum(f(a + k * h) for k in range(1, n)) + f(b) / 2)

def monte_carlo(f, a, b, n):
    return (b - a) * sum(f(a + (b - a) * random()) for _ in range(n)) / n

exact = log(2)
print("valeur exacte : ln(2) =", exact)
print()
print("   n      rectangles      milieux        trapèzes       Monte-Carlo")
for n in [10, 100, 1000]:
    r = rectangles_gauche(f, 0, 1, n)
    m = milieux(f, 0, 1, n)
    t = trapezes(f, 0, 1, n)
    mc = monte_carlo(f, 0, 1, n)
    print(f"{n:>5}   {r:.8f}    {m:.8f}    {t:.8f}    {mc:.8f}")
print()
print("Erreurs pour n = 1000 :")
print(f"  rectangles : {abs(rectangles_gauche(f, 0, 1, 1000) - exact):.2e}")
print(f"  milieux    : {abs(milieux(f, 0, 1, 1000) - exact):.2e}")
print(f"  trapèzes   : {abs(trapezes(f, 0, 1, 1000) - exact):.2e}")`,
      },
      {
        label: 'VISUALISATION',
        code: `# Voir ce que chaque méthode additionne réellement
import numpy as np
import matplotlib.pyplot as plt

f = lambda x: 1 / (1 + x)
X = np.linspace(0, 1, 200)
n = 6
h = 1 / n
xs = np.arange(n) * h

fig, axes = plt.subplots(1, 3, figsize=(12.5, 4.2))

axes[0].bar(xs, f(xs), width=h, align="edge", color="tab:blue",
            alpha=0.4, edgecolor="tab:blue")
axes[0].set_title("rectangles à gauche")

axes[1].bar(xs, f(xs + h / 2), width=h, align="edge", color="tab:green",
            alpha=0.4, edgecolor="tab:green")
axes[1].plot(xs + h / 2, f(xs + h / 2), "o", color="tab:green", ms=4)
axes[1].set_title("milieux")

for k in range(n):
    axes[2].fill_between([k * h, (k + 1) * h], [f(k * h), f((k + 1) * h)],
                         color="tab:red", alpha=0.4, edgecolor="tab:red")
axes[2].set_title("trapèzes")

for ax in axes:
    ax.plot(X, f(X), color="black", lw=1.5)
    ax.set_ylim(0, 1.1)
    ax.grid(alpha=0.3)

fig.suptitle("∫ 1/(1+x) sur [0, 1] avec n = 6 morceaux : trois manières de remplir l'aire")
plt.tight_layout()
plt.show()
print("Les rectangles à gauche débordent systématiquement (f décroît) ;")
print("milieux et trapèzes se trompent beaucoup moins, et en sens opposés.")`,
      },
      {
        label: 'PLUS LOIN',
        code: `# Brouncker (1668) : ln(2) = 1/(1*2) + 1/(3*4) + 1/(5*6) + ...
from math import log

def brouncker(n):
    return sum(1 / ((2 * k + 1) * (2 * k + 2)) for k in range(n))

print("ln(2) exact :", log(2))
print()
for n in [10, 100, 1000, 10000]:
    s = brouncker(n)
    print(f"n = {n:<6} : {s:.10f}   erreur {abs(s - log(2)):.2e}")

print()
print("Chaque terme 1/((2k+1)(2k+2)) = 1/(2k+1) - 1/(2k+2) :")
print("la série de Brouncker est la série harmonique alternée,")
print("regroupée deux par deux pour ne plus osciller.")`,
      },
    ],
  },

  {
    id: 'galton-surreservation',
    niveau: 'Terminale',
    theme: 'Loi binomiale',
    titre: 'Planche de Galton et surréservation',
    bo: 'Simulation de la planche de Galton. Problème de la surréservation : plus petit k tel que P(X > k) ≤ α. Simulation d\'un échantillon d\'une variable aléatoire.',
    objectif: 'Deux visages de la loi binomiale : une bille qui rebondit n fois (Galton), et une compagnie aérienne qui vend plus de billets que de sièges.',
    idee: 'Galton : chaque bille subit n chocs équiprobables gauche/droite, sa case finale est le nombre de droites, donc suit B(n, 1/2). Surréservation : si chaque passager se présente avec probabilité p, le nombre de présents suit B(n, p), et on cherche le plus petit nombre de sièges k tel que P(X > k) ≤ α.',
    retenir: 'La cloche de Galton n\'est pas un hasard : c\'est la loi binomiale qui se dessine, et derrière elle la loi normale. Pour la surréservation, on accumule les probabilités jusqu\'à dépasser 1 − α : c\'est un calcul de quantile.',
    variantes: [
      {
        label: 'ALGORITHME',
        code: `# 1) Planche de Galton : simulation brute
from random import random
from math import comb, sqrt

def galton(n_billes, n_etages):
    cases = [0] * (n_etages + 1)
    for _ in range(n_billes):
        position = sum(1 for _ in range(n_etages) if random() < 0.5)
        cases[position] += 1
    return cases

cases = galton(10_000, 12)
print("répartition de 10 000 billes sur 13 cases :")
for k, c in enumerate(cases):
    print(f"  case {k:>2} : {'#' * (c // 60)} {c}")

# 2) Surréservation : n billets vendus, p proba de venir, alpha le risque
n, p, alpha = 220, 0.9, 0.05

def P(X_egal_k, n=n, p=p):
    k = X_egal_k
    return comb(n, k) * p ** k * (1 - p) ** (n - k)

# plus petit k tel que P(X > k) <= alpha, soit P(X <= k) >= 1 - alpha
cumul, k = 0.0, -1
while cumul < 1 - alpha:
    k += 1
    cumul += P(k)

print()
print(f"{n} billets vendus, chaque passager vient avec p = {p}")
print(f"plus petit k tel que P(X > k) <= {alpha} : k = {k}")
print(f"avec {k} sièges, le risque de surbooking est {1 - cumul + P(k):.4f}")
print(f"espérance de passagers présents : {n * p:.0f}, écart type : {sqrt(n * p * (1 - p)):.1f}")`,
      },
      {
        label: 'VISUALISATION',
        code: `# La cloche de Galton contre la loi binomiale théorique
import numpy as np
import matplotlib.pyplot as plt
from math import comb

n_etages, n_billes = 12, 10_000
rng = np.random.default_rng()
positions = rng.binomial(n_etages, 0.5, size=n_billes)

ks = np.arange(n_etages + 1)
theorie = np.array([comb(n_etages, int(k)) / 2 ** n_etages for k in ks])

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 4.8))

freq = np.bincount(positions, minlength=n_etages + 1) / n_billes
ax1.bar(ks, freq, color="tab:blue", alpha=0.6, label="simulation")
ax1.plot(ks, theorie, "o-", color="tab:red", ms=5, label="binomiale B(12, 1/2)")
ax1.set_title(f"Galton : {n_billes} billes, {n_etages} étages")
ax1.set_xlabel("case d'arrivée")
ax1.legend()

# surréservation : distribution de B(220, 0.9) et le seuil de sièges
n, p, alpha = 220, 0.9, 0.05
ks2 = np.arange(170, 221)
probs = [comb(n, int(k)) * p ** k * (1 - p) ** (n - k) for k in ks2]
cumul, seuil = 0.0, -1
while cumul < 1 - alpha:
    seuil += 1
    cumul += comb(n, seuil) * p ** seuil * (1 - p) ** (n - seuil)

couleurs = ["tab:red" if k > seuil else "tab:blue" for k in ks2]
ax2.bar(ks2, probs, color=couleurs)
ax2.axvline(seuil + 0.5, color="black", ls="--")
ax2.annotate(f"{seuil} sièges suffisent\\n(zone rouge : P <= {alpha})",
             (seuil + 1, max(probs) * 0.75), fontsize=9)
ax2.set_title(f"Surréservation : {n} billets vendus, p = {p}")
ax2.set_xlabel("passagers présents")

plt.tight_layout()
plt.show()
print("À gauche, l'expérience colle à la théorie.")
print("À droite, vendre 220 billets pour", seuil, "sièges ne déborde")
print("qu'avec une probabilité inférieure à 5 %.")`,
      },
    ],
  },

  {
    id: 'lgn-marche',
    niveau: 'Terminale',
    theme: 'Loi des grands nombres',
    titre: 'Concentration, marche aléatoire, loi des grands nombres',
    bo: 'Calculer P(|Sn − pn| > √n) pour Sn de loi B(n, p), comparer avec Bienaymé-Tchebychev. Simulation d\'une marche aléatoire. Écart type des moyennes de N échantillons, à comparer à σ/√n.',
    objectif: 'Trois expériences sur la même idée : le hasard se concentre. La somme s\'écarte peu de son espérance, et l\'inégalité de Bienaymé-Tchebychev en donne une garantie, grossière mais universelle.',
    idee: 'On calcule exactement P(|Sn − np| > √n) pour une binomiale et on la compare à la borne de Tchebychev p(1−p). On simule des marches aléatoires pour voir que l\'écart typique croît comme √n, pas comme n. Enfin on vérifie que l\'écart type de la moyenne de n tirages vaut σ/√n.',
    retenir: 'Tchebychev majore sans rien savoir de la loi : le prix de cette généralité, c\'est une borne très pessimiste (ici environ 8 fois trop grande). Et le facteur √n est la signature du hasard : pour diviser l\'incertitude par 10, il faut 100 fois plus de données.',
    variantes: [
      {
        label: 'ALGORITHME',
        code: `# Concentration exacte contre la borne de Tchebychev
from math import comb, sqrt

def proba_ecart(n, p):
    """P(|Sn - np| > sqrt(n)) calculée exactement, Sn de loi B(n, p)."""
    total = 0.0
    for k in range(n + 1):
        if abs(k - n * p) > sqrt(n):
            total += comb(n, k) * p ** k * (1 - p) ** (n - k)
    return total

p = 0.5
print("Borne de Tchebychev avec a = √n : V(Sn)/n = p(1-p) =", p * (1 - p))
print()
print("   n     P(|Sn - np| > √n)   rapport borne/exact")
# au-delà de n ~ 1000, comb(n, k) dépasse ce qu'un flottant sait représenter
for n in [20, 100, 400, 1000]:
    exact = proba_ecart(n, p)
    print(f"{n:>5}      {exact:.5f}            {p * (1 - p) / exact:.1f}")
print()
print("La probabilité exacte se stabilise vers 0.046 (la loi normale n'est")
print("pas loin : P(|Z| > 2) ~ 0.0455). Tchebychev garantit 0.25 : vrai,")
print("mais environ 5 fois trop prudent. C'est le prix de l'universalité.")`,
      },
      {
        label: 'VISUALISATION',
        code: `# Des marches aléatoires dans le tube en √n
import numpy as np
import matplotlib.pyplot as plt

rng = np.random.default_rng()
n, nb_marches = 2000, 12

pas = rng.choice([-1, 1], size=(nb_marches, n))
marches = np.cumsum(pas, axis=1)
T = np.arange(1, n + 1)

fig, ax = plt.subplots(figsize=(10, 5.5))
for m in marches:
    ax.plot(T, m, lw=0.7, alpha=0.7)
ax.plot(T, 2 * np.sqrt(T), color="black", ls="--", lw=1.5,
        label="± 2√n")
ax.plot(T, -2 * np.sqrt(T), color="black", ls="--", lw=1.5)
ax.set_xlabel("nombre de pas n")
ax.set_ylabel("position")
ax.set_title(f"{nb_marches} marches aléatoires : presque toutes restent dans le tube ± 2√n")
ax.legend()
ax.grid(alpha=0.3)
plt.tight_layout()
plt.show()
print("Après n pas de ±1, la position est d'espérance 0 et d'écart type √n :")
print("le tube parabolique contient environ 95 % des trajectoires à chaque instant.")`,
      },
      {
        label: 'PLUS LOIN',
        code: `# L'écart type de la moyenne vaut sigma / √n : vérification
import numpy as np

rng = np.random.default_rng()
p = 0.3                       # pièce truquée : Bernoulli(0.3)
sigma = np.sqrt(p * (1 - p))  # écart type d'un tirage

N = 2000   # nombre d'échantillons
print("taille n    écart type des moyennes    sigma/√n")
for n in [25, 100, 400, 1600]:
    echantillons = rng.random((N, n)) < p
    moyennes = echantillons.mean(axis=1)
    print(f"{n:>7}        {moyennes.std():.5f}              {sigma / np.sqrt(n):.5f}")

print()
print("Multiplier la taille de l'échantillon par 4 divise l'incertitude")
print("par 2 seulement. Les sondages n'y échappent pas : pour deux fois")
print("plus de précision, il faut interroger quatre fois plus de monde.")`,
      },
    ],
  },
];
