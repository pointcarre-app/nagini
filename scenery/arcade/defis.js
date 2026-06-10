/**
 * L'arcade du data engineer : les défis.
 * Chaque défi : un code à trous (Ellipsis ... à remplacer), des tests
 * cachés exécutés dans Pyodide, une solution, un indice.
 * Niveaux : échauffement, solide, costaud.
 */

export const DEFIS = [
  {
    id: 'doublons-exacts',
    niveau: 'échauffement',
    titre: 'Dédoublonner en gardant l\'ordre',
    brief: 'Le b.a.-ba du nettoyage : supprimer les doublons exacts d\'une liste SANS changer l\'ordre d\'apparition. set(liste) seul ne suffit pas : il perd l\'ordre.',
    indice: 'Un set "vus" pour la mémoire, une liste pour le résultat : on n\'ajoute que ce qu\'on n\'a jamais vu.',
    code: `def dedoublonner(lignes):
    """Renvoie les lignes sans doublons, premier vu premier gardé."""
    vus = ...           # la mémoire des lignes déjà rencontrées
    resultat = []
    for ligne in lignes:
        if ...:         # jamais vue ?
            vus.add(ligne)
            resultat.append(ligne)
    return resultat`,
    solution: `def dedoublonner(lignes):
    """Renvoie les lignes sans doublons, premier vu premier gardé."""
    vus = set()
    resultat = []
    for ligne in lignes:
        if ligne not in vus:
            vus.add(ligne)
            resultat.append(ligne)
    return resultat`,
    tests: `_check("doublons supprimés",
       dedoublonner(["a", "b", "a", "c", "b"]) == ["a", "b", "c"])
_check("ordre d'apparition conservé",
       dedoublonner([3, 1, 3, 2, 1]) == [3, 1, 2])
_check("liste vide", dedoublonner([]) == [])
_check("fonctionne avec des tuples (lignes de CSV)",
       dedoublonner([("ada", 36), ("tim", 58), ("ada", 36)]) == [("ada", 36), ("tim", 58)])`,
  },

  {
    id: 'comptage',
    niveau: 'échauffement',
    titre: 'Compter les occurrences',
    brief: 'L\'histogramme à la main : compter combien de fois chaque valeur apparaît. C\'est le GROUP BY COUNT(*) du pauvre, et la brique de toute analyse de qualité de données.',
    indice: 'dict.get(cle, 0) renvoie 0 si la clé n\'existe pas encore : parfait pour initialiser un compteur.',
    code: `def compter(valeurs):
    """Renvoie un dict valeur -> nombre d'occurrences."""
    compte = {}
    for v in valeurs:
        compte[v] = ...      # incrémenter, même la première fois
    return compte`,
    solution: `def compter(valeurs):
    """Renvoie un dict valeur -> nombre d'occurrences."""
    compte = {}
    for v in valeurs:
        compte[v] = compte.get(v, 0) + 1
    return compte`,
    tests: `_check("comptage simple",
       compter(["a", "b", "a", "a"]) == {"a": 3, "b": 1})
_check("liste vide", compter([]) == {})
_check("valeurs numériques",
       compter([1, 1, 2]) == {1: 2, 2: 1})
_check("toutes les clés présentes",
       sorted(compter("mississippi")) == ["i", "m", "p", "s"])`,
  },

  {
    id: 'normaliser',
    niveau: 'échauffement',
    titre: 'Normaliser une chaîne',
    brief: 'Avant de comparer "  LYON 3e " et "lyon 3e", il faut les amener à la même forme : espaces de tête et de queue supprimés, minuscules, espaces multiples réduits à un seul.',
    indice: 'strip() pour les bords, lower() pour la casse, et le duo split()/join pour les espaces internes : " ".join(s.split()).',
    code: `def normaliser(texte):
    """'  LYON   3e ' -> 'lyon 3e'"""
    texte = texte.strip()
    texte = ...                # minuscules
    texte = ...                # espaces multiples -> un seul
    return texte`,
    solution: `def normaliser(texte):
    """'  LYON   3e ' -> 'lyon 3e'"""
    texte = texte.strip()
    texte = texte.lower()
    texte = " ".join(texte.split())
    return texte`,
    tests: `_check("bords nettoyés", normaliser("  Lyon ") == "lyon")
_check("casse unifiée", normaliser("PARIS") == "paris")
_check("espaces internes réduits",
       normaliser("Lyon   3e   arrondissement") == "lyon 3e arrondissement")
_check("tabulations et retours aussi",
       normaliser("a\\t b\\n c") == "a b c")`,
  },

  {
    id: 'lots',
    niveau: 'échauffement',
    titre: 'Découper en lots (batch)',
    brief: 'Charger 100 000 lignes en une requête fait tomber la base : on envoie par lots de n. Découper une liste en paquets de taille fixe est un geste quotidien du data engineer.',
    indice: 'range(0, len(liste), taille) donne les indices de début de chaque lot ; le slice liste[i:i+taille] fait le reste.',
    code: `def decouper_en_lots(liste, taille):
    """[1,2,3,4,5], 2 -> [[1,2], [3,4], [5]]"""
    lots = []
    for i in range(...):
        lots.append(...)
    return lots`,
    solution: `def decouper_en_lots(liste, taille):
    """[1,2,3,4,5], 2 -> [[1,2], [3,4], [5]]"""
    lots = []
    for i in range(0, len(liste), taille):
        lots.append(liste[i:i + taille])
    return lots`,
    tests: `_check("découpage exact",
       decouper_en_lots([1, 2, 3, 4], 2) == [[1, 2], [3, 4]])
_check("dernier lot partiel",
       decouper_en_lots([1, 2, 3, 4, 5], 2) == [[1, 2], [3, 4], [5]])
_check("taille plus grande que la liste",
       decouper_en_lots([1, 2], 10) == [[1, 2]])
_check("liste vide", decouper_en_lots([], 3) == [])
_check("rien n'est perdu",
       sum(decouper_en_lots(list(range(100)), 7), []) == list(range(100)))`,
  },

  {
    id: 'groupby-manuel',
    niveau: 'solide',
    titre: 'GROUP BY à la main',
    brief: 'Regrouper des lignes par la valeur d\'un champ : c\'est le GROUP BY de SQL, version Python. En sortie : un dict valeur du champ -> liste des lignes.',
    indice: 'dict.setdefault(cle, []) renvoie la liste existante ou en crée une vide : on peut enchaîner .append directement.',
    code: `def grouper_par(lignes, champ):
    """lignes : liste de dicts. Renvoie {valeur: [lignes...]}."""
    groupes = {}
    for ligne in lignes:
        cle = ligne[champ]
        ...                  # ranger la ligne dans son groupe
    return groupes`,
    solution: `def grouper_par(lignes, champ):
    """lignes : liste de dicts. Renvoie {valeur: [lignes...]}."""
    groupes = {}
    for ligne in lignes:
        cle = ligne[champ]
        groupes.setdefault(cle, []).append(ligne)
    return groupes`,
    tests: `ventes = [
    {"ville": "Lyon", "ca": 100},
    {"ville": "Paris", "ca": 200},
    {"ville": "Lyon", "ca": 50},
]
g = grouper_par(ventes, "ville")
_check("deux groupes", sorted(g) == ["Lyon", "Paris"])
_check("Lyon contient ses deux lignes", len(g["Lyon"]) == 2)
_check("les lignes sont intactes", g["Paris"][0]["ca"] == 200)
_check("on peut agréger ensuite",
       sum(l["ca"] for l in g["Lyon"]) == 150)`,
  },

  {
    id: 'jointure-hash',
    niveau: 'solide',
    titre: 'Une jointure à la main (hash join)',
    brief: 'Comment la base fait-elle un JOIN ? Elle indexe la petite table dans un dict (la table de hachage), puis parcourt la grande en cherchant chaque clé. Implémente ce hash join : commandes × clients.',
    indice: 'Étape 1 : index = {c["id"]: c for c in clients}. Étape 2 : pour chaque commande, chercher index.get(commande["client_id"]).',
    code: `def joindre(commandes, clients):
    """INNER JOIN : renvoie [{**commande, "client": nom}, ...].
    Une commande sans client connu est ignorée."""
    index = ...              # id client -> dict client
    resultat = []
    for cmd in commandes:
        client = ...         # chercher dans l'index (None si absent)
        if client is not None:
            resultat.append({**cmd, "client": client["nom"]})
    return resultat`,
    solution: `def joindre(commandes, clients):
    """INNER JOIN : renvoie [{**commande, "client": nom}, ...].
    Une commande sans client connu est ignorée."""
    index = {c["id"]: c for c in clients}
    resultat = []
    for cmd in commandes:
        client = index.get(cmd["client_id"])
        if client is not None:
            resultat.append({**cmd, "client": client["nom"]})
    return resultat`,
    tests: `clients = [{"id": 1, "nom": "Ada"}, {"id": 2, "nom": "Grace"}]
commandes = [
    {"num": 10, "client_id": 1, "ca": 100},
    {"num": 11, "client_id": 2, "ca": 200},
    {"num": 12, "client_id": 99, "ca": 50},    # client inconnu !
]
j = joindre(commandes, clients)
_check("deux commandes jointes (l'orpheline est exclue)", len(j) == 2)
_check("le nom du client est attaché", j[0]["client"] == "Ada")
_check("les champs de la commande survivent", j[1]["ca"] == 200)
_check("jointure vide si aucun client", joindre(commandes, []) == [])`,
  },

  {
    id: 'moyenne-mobile',
    niveau: 'solide',
    titre: 'Moyenne mobile',
    brief: 'Lisser une série temporelle : la moyenne mobile de fenêtre k remplace chaque point par la moyenne des k derniers. C\'est le AVG OVER (ROWS k PRECEDING) de SQL, à la main.',
    indice: 'Pour la position i, la fenêtre est valeurs[max(0, i - k + 1) : i + 1] : elle est plus courte au début, c\'est voulu.',
    code: `def moyenne_mobile(valeurs, k):
    """Moyenne des k dernières valeurs, à chaque position.
    [10, 20, 30, 40], k=2 -> [10.0, 15.0, 25.0, 35.0]"""
    resultat = []
    for i in range(len(valeurs)):
        fenetre = ...        # les k dernières valeurs jusqu'à i inclus
        resultat.append(sum(fenetre) / len(fenetre))
    return resultat`,
    solution: `def moyenne_mobile(valeurs, k):
    """Moyenne des k dernières valeurs, à chaque position.
    [10, 20, 30, 40], k=2 -> [10.0, 15.0, 25.0, 35.0]"""
    resultat = []
    for i in range(len(valeurs)):
        fenetre = valeurs[max(0, i - k + 1):i + 1]
        resultat.append(sum(fenetre) / len(fenetre))
    return resultat`,
    tests: `_check("fenêtre de 2",
       moyenne_mobile([10, 20, 30, 40], 2) == [10.0, 15.0, 25.0, 35.0])
_check("fenêtre de 3",
       moyenne_mobile([3, 6, 9, 12], 3) == [3.0, 4.5, 6.0, 9.0])
_check("k = 1 : la série elle-même",
       moyenne_mobile([5, 7], 1) == [5.0, 7.0])
_check("autant de points qu'en entrée",
       len(moyenne_mobile(list(range(50)), 7)) == 50)`,
  },

  {
    id: 'top-k',
    niveau: 'solide',
    titre: 'Top k sans tout trier',
    brief: 'Les 3 plus gros clients parmi des millions : trier toute la liste est du gâchis. Le module heapq fait le travail en gardant seulement k éléments en mémoire.',
    indice: 'heapq.nlargest(k, lignes, key=...) fait exactement ça. La clé est une fonction qui extrait la valeur à comparer.',
    code: `import heapq

def top_k(lignes, k, champ):
    """Les k lignes au plus grand 'champ', par ordre décroissant."""
    return heapq.nlargest(...)`,
    solution: `import heapq

def top_k(lignes, k, champ):
    """Les k lignes au plus grand 'champ', par ordre décroissant."""
    return heapq.nlargest(k, lignes, key=lambda l: l[champ])`,
    tests: `clients = [{"nom": "a", "ca": 50}, {"nom": "b", "ca": 300},
           {"nom": "c", "ca": 120}, {"nom": "d", "ca": 80}]
t = top_k(clients, 2, "ca")
_check("les deux plus gros", [l["nom"] for l in t] == ["b", "c"])
_check("k plus grand que la liste",
       len(top_k(clients, 10, "ca")) == 4)
_check("ordre décroissant",
       [l["ca"] for l in top_k(clients, 3, "ca")] == [300, 120, 80])`,
  },

  {
    id: 'doublons-logiques',
    niveau: 'solide',
    titre: 'Doublons logiques : la clé de dédoublonnage',
    brief: 'Le vrai problème du dédoublonnage : "Ada LOVELACE / 06 12 34 56 78" et "ada lovelace / 0612345678" sont la même personne. On construit une clé normalisée (nom nettoyé + chiffres du téléphone) et on dédoublonne dessus.',
    indice: 'Pour le téléphone : "".join(c for c in tel if c.isdigit()). Pour le nom : la normalisation du défi précédent.',
    code: `def cle_contact(contact):
    """Clé de dédoublonnage : (nom normalisé, chiffres du téléphone)."""
    nom = " ".join(contact["nom"].strip().lower().split())
    tel = ...                # ne garder que les chiffres
    return (nom, tel)

def dedoublonner_contacts(contacts):
    """Garde le premier exemplaire de chaque contact logique."""
    vus = set()
    resultat = []
    for c in contacts:
        cle = ...
        if cle not in vus:
            vus.add(cle)
            resultat.append(c)
    return resultat`,
    solution: `def cle_contact(contact):
    """Clé de dédoublonnage : (nom normalisé, chiffres du téléphone)."""
    nom = " ".join(contact["nom"].strip().lower().split())
    tel = "".join(c for c in contact["tel"] if c.isdigit())
    return (nom, tel)

def dedoublonner_contacts(contacts):
    """Garde le premier exemplaire de chaque contact logique."""
    vus = set()
    resultat = []
    for c in contacts:
        cle = cle_contact(c)
        if cle not in vus:
            vus.add(cle)
            resultat.append(c)
    return resultat`,
    tests: `contacts = [
    {"nom": "Ada LOVELACE", "tel": "06 12 34 56 78"},
    {"nom": "  ada lovelace ", "tel": "0612345678"},
    {"nom": "Grace Hopper", "tel": "07 00 00 00 00"},
]
_check("même clé pour les deux Ada",
       cle_contact(contacts[0]) == cle_contact(contacts[1]))
d = dedoublonner_contacts(contacts)
_check("deux personnes restent", len(d) == 2)
_check("le premier exemplaire est gardé", d[0]["nom"] == "Ada LOVELACE")
_check("Grace n'est pas touchée", d[1]["nom"] == "Grace Hopper")`,
  },

  {
    id: 'zscore',
    niveau: 'solide',
    titre: 'Détecter les valeurs aberrantes (z-score)',
    brief: 'Un capteur renvoie 20, 21, 19, 22... puis 480. Le z-score mesure à combien d\'écarts types une valeur est de la moyenne : au-delà de 3, on lève le drapeau.',
    indice: 'moyenne = sum(v)/n ; variance = sum((x - moyenne)**2)/n ; ecart_type = variance ** 0.5 ; z = (x - moyenne) / ecart_type.',
    code: `def anomalies(valeurs, seuil=3.0):
    """Renvoie les indices des valeurs dont |z-score| > seuil."""
    n = len(valeurs)
    moyenne = sum(valeurs) / n
    variance = ...           # moyenne des carrés des écarts
    ecart_type = variance ** 0.5
    if ecart_type == 0:
        return []
    return [i for i, x in enumerate(valeurs)
            if ...]          # |z| au-delà du seuil`,
    solution: `def anomalies(valeurs, seuil=3.0):
    """Renvoie les indices des valeurs dont |z-score| > seuil."""
    n = len(valeurs)
    moyenne = sum(valeurs) / n
    variance = sum((x - moyenne) ** 2 for x in valeurs) / n
    ecart_type = variance ** 0.5
    if ecart_type == 0:
        return []
    return [i for i, x in enumerate(valeurs)
            if abs(x - moyenne) / ecart_type > seuil]`,
    tests: `# subtilité statistique : il faut assez de points, car l'aberration
# gonfle elle-même l'écart type (avec n points, |z| <= (n-1)/sqrt(n))
mesures = [20, 21, 19, 22, 20, 21, 20, 480, 19, 21, 22, 20, 19, 21, 20, 22]
_check("le 480 est repéré (indice 7)", anomalies(mesures) == [7])
_check("rien à signaler sur une série calme",
       anomalies([10, 11, 10, 12, 11]) == [])
_check("série constante : pas de division par zéro",
       anomalies([5, 5, 5, 5]) == [])
_check("seuil plus sévère, plus de détections",
       len(anomalies(mesures, seuil=1.0)) >= 1)`,
  },

  {
    id: 'levenshtein',
    niveau: 'costaud',
    titre: 'Distance de Levenshtein',
    brief: 'Combien de modifications (insertion, suppression, substitution) pour passer de "lyon" à "loyn" ? C\'est la distance d\'édition, le moteur du dédoublonnage approximatif et du "did you mean". Programmation dynamique : on remplit un tableau.',
    indice: 'La case D[i][j] vaut le min de : D[i-1][j] + 1 (suppression), D[i][j-1] + 1 (insertion), D[i-1][j-1] + cout (substitution, cout 0 si les caractères sont égaux).',
    code: `def levenshtein(a, b):
    """Nombre minimal d'opérations pour transformer a en b."""
    n, m = len(a), len(b)
    D = [[0] * (m + 1) for _ in range(n + 1)]
    for i in range(n + 1):
        D[i][0] = i
    for j in range(m + 1):
        D[0][j] = j
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            cout = 0 if a[i - 1] == b[j - 1] else 1
            D[i][j] = min(
                D[i - 1][j] + 1,      # suppression
                ...,                  # insertion
                ...,                  # substitution
            )
    return D[n][m]`,
    solution: `def levenshtein(a, b):
    """Nombre minimal d'opérations pour transformer a en b."""
    n, m = len(a), len(b)
    D = [[0] * (m + 1) for _ in range(n + 1)]
    for i in range(n + 1):
        D[i][0] = i
    for j in range(m + 1):
        D[0][j] = j
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            cout = 0 if a[i - 1] == b[j - 1] else 1
            D[i][j] = min(
                D[i - 1][j] + 1,      # suppression
                D[i][j - 1] + 1,      # insertion
                D[i - 1][j - 1] + cout,  # substitution
            )
    return D[n][m]`,
    tests: `_check("identiques : 0", levenshtein("lyon", "lyon") == 0)
_check("une lettre ajoutée : 1", levenshtein("chat", "chats") == 1)
_check("lyon / loyn : 2", levenshtein("lyon", "loyn") == 2)
_check("mot vide : la longueur de l'autre", levenshtein("", "abc") == 3)
_check("symétrique",
       levenshtein("niche", "chien") == levenshtein("chien", "niche"))
_check("villeurbanne / villeurbane : 1",
       levenshtein("villeurbanne", "villeurbane") == 1)`,
  },

  {
    id: 'jaccard',
    niveau: 'costaud',
    titre: 'Similarité de Jaccard sur trigrammes',
    brief: 'L\'autre arme du dédoublonnage flou : découper chaque chaîne en trigrammes (fenêtres de 3 caractères), puis comparer les ensembles : |intersection| / |union|. 1.0 = identiques, 0.0 = rien en commun. C\'est l\'algorithme de pg_trgm dans PostgreSQL.',
    indice: 'Les trigrammes de "lyon" sont {"lyo", "yon"} : ce sont les tranches s[i:i+3]. Les sets Python ont & (intersection) et | (union).',
    code: `def trigrammes(s):
    """Ensemble des fenêtres de 3 caractères de s."""
    return {...}             # toutes les tranches s[i:i+3]

def jaccard(a, b):
    """Similarité entre 0.0 et 1.0 des deux chaînes."""
    ta, tb = trigrammes(a), trigrammes(b)
    if not ta and not tb:
        return 1.0
    return ...               # |intersection| / |union|`,
    solution: `def trigrammes(s):
    """Ensemble des fenêtres de 3 caractères de s."""
    return {s[i:i + 3] for i in range(len(s) - 2)}

def jaccard(a, b):
    """Similarité entre 0.0 et 1.0 des deux chaînes."""
    ta, tb = trigrammes(a), trigrammes(b)
    if not ta and not tb:
        return 1.0
    return len(ta & tb) / len(ta | tb)`,
    tests: `_check("trigrammes de 'lyon'", trigrammes("lyon") == {"lyo", "yon"})
_check("identiques : 1.0", jaccard("hopital", "hopital") == 1.0)
_check("rien en commun : 0.0", jaccard("abc", "xyz") == 0.0)
s = jaccard("boulangerie patisserie", "boulangerie-patisserie")
_check("variantes proches : similarité élevée", s > 0.6)
_check("plus proche que deux mots différents",
       s > jaccard("boulangerie", "pharmacie"))`,
  },

  {
    id: 'haversine',
    niveau: 'costaud',
    titre: 'Matrice de distances GPS (haversine)',
    brief: 'Quel entrepôt est le plus proche de chaque magasin ? Il faut la distance entre points GPS : la formule de haversine donne les kilomètres à vol d\'oiseau sur la sphère terrestre. Puis on bâtit la matrice complète ville × ville.',
    indice: 'La formule est fournie dans a : il reste 2·R·asin(√a). Pour la matrice : deux boucles sur villes.items(), et la distance de v1 à v2 utilise (lat1, lon1, lat2, lon2).',
    code: `from math import radians, sin, cos, asin, sqrt

def haversine(lat1, lon1, lat2, lon2):
    """Distance en km entre deux points GPS (Terre : R = 6371 km)."""
    R = 6371
    dlat = radians(lat2 - lat1)
    dlon = radians(lon2 - lon1)
    a = sin(dlat / 2) ** 2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon / 2) ** 2
    return ...               # 2 * R * arcsin de racine de a

def matrice_distances(villes):
    """villes : {nom: (lat, lon)} -> {nom: {nom: km arrondis à 1 déc.}}"""
    M = {}
    for v1, (lat1, lon1) in villes.items():
        M[v1] = {}
        for v2, (lat2, lon2) in villes.items():
            M[v1][v2] = round(..., 1)
    return M`,
    solution: `from math import radians, sin, cos, asin, sqrt

def haversine(lat1, lon1, lat2, lon2):
    """Distance en km entre deux points GPS (Terre : R = 6371 km)."""
    R = 6371
    dlat = radians(lat2 - lat1)
    dlon = radians(lon2 - lon1)
    a = sin(dlat / 2) ** 2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon / 2) ** 2
    return 2 * R * asin(sqrt(a))

def matrice_distances(villes):
    """villes : {nom: (lat, lon)} -> {nom: {nom: km arrondis à 1 déc.}}"""
    M = {}
    for v1, (lat1, lon1) in villes.items():
        M[v1] = {}
        for v2, (lat2, lon2) in villes.items():
            M[v1][v2] = round(haversine(lat1, lon1, lat2, lon2), 1)
    return M`,
    tests: `VILLES = {
    "Lyon": (45.7640, 4.8357),
    "Paris": (48.8566, 2.3522),
    "Marseille": (43.2965, 5.3698),
}
d = haversine(*VILLES["Lyon"], *VILLES["Paris"])
_check("Lyon-Paris ~ 392 km", abs(d - 392) < 10)
M = matrice_distances(VILLES)
_check("diagonale nulle", M["Lyon"]["Lyon"] == 0.0)
_check("matrice symétrique", M["Lyon"]["Paris"] == M["Paris"]["Lyon"])
_check("Lyon-Marseille ~ 278 km", abs(M["Lyon"]["Marseille"] - 278) < 10)
_check("3 x 3 entrées", len(M) == 3 and all(len(l) == 3 for l in M.values()))`,
  },
];
