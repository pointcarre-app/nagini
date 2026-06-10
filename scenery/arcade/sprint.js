/**
 * Mode sprint : compléter le trou (____) le plus vite possible.
 * Réponses : liste des formes acceptées (comparaison insensible aux
 * espaces superflus). Chaque partie tire 10 questions au hasard.
 */

export const SPRINT = [
  {
    code: `# la mémoire du dédoublonnage
vus = ____()
for ligne in lignes:
    if ligne not in vus:
        vus.add(ligne)`,
    reponses: ['set'],
    explication: 'Un set : test d\'appartenance en temps constant.',
  },
  {
    code: `# ne garder que les jamais-vus
if ligne ____ vus:
    vus.add(ligne)
    resultat.append(ligne)`,
    reponses: ['not in'],
    explication: 'not in : l\'opérateur d\'appartenance, négué.',
  },
  {
    code: `# compter sans KeyError, même la première fois
compte[mot] = compte.____(mot, 0) + 1`,
    reponses: ['get'],
    explication: 'dict.get(cle, defaut) : la valeur, ou 0 si absente.',
  },
  {
    code: `# ranger chaque ligne dans son groupe (GROUP BY maison)
groupes.____(cle, []).append(ligne)`,
    reponses: ['setdefault'],
    explication: 'setdefault crée la liste vide au premier passage.',
  },
  {
    code: `# découper en lots de 500 pour la base
for i in ____(0, len(lignes), 500):
    inserer(lignes[i:i + 500])`,
    reponses: ['range'],
    explication: 'range(début, fin, pas) : les indices de début de lot.',
  },
  {
    code: `# trier les clients du plus gros CA au plus petit
clients.sort(____=lambda c: c["ca"], reverse=True)`,
    reponses: ['key'],
    explication: 'key : la fonction qui extrait la valeur de tri.',
  },
  {
    code: `# le chiffre d'affaires total
total = ____(l["ca"] for l in lignes)`,
    reponses: ['sum'],
    explication: 'sum sur une expression génératrice : pas de liste intermédiaire.',
  },
  {
    code: `# nettoyer les bords d'une saisie utilisateur
ville = "  Lyon  ".____()`,
    reponses: ['strip'],
    explication: 'strip() : espaces (et sauts de ligne) de tête et de queue.',
  },
  {
    code: `# recoller des champs en une ligne CSV
ligne = ";".____(["Ada", "Lyon", "36"])`,
    reponses: ['join'],
    explication: 'separateur.join(liste) : l\'inverse de split.',
  },
  {
    code: `# combien de lignes dans le fichier ?
n = ____(lignes)`,
    reponses: ['len'],
    explication: 'len : la taille, en temps constant.',
  },
  {
    code: `# fermer le fichier quoi qu'il arrive
____ open("ventes.csv", encoding="utf-8") as f:
    contenu = f.read()`,
    reponses: ['with'],
    explication: 'Le bloc with ferme le fichier, même en cas d\'exception.',
  },
  {
    code: `# ne garder que les chiffres d'un téléphone
tel = "".join(c for c in brut if c.____())`,
    reponses: ['isdigit'],
    explication: 'isdigit() : True pour 0 à 9, le filtre des numéros.',
  },
  {
    code: `# requête SQL paramétrée : jamais de f-string !
cur.execute("SELECT * FROM clients WHERE ville = ____", (ville,))`,
    reponses: ['?'],
    explication: 'Le ? (sqlite) ou %s (psycopg) : la parade à l\'injection SQL.',
  },
  {
    code: `# un appel HTTP qui n'attend pas indéfiniment
r = requests.get(url, ____=10)`,
    reponses: ['timeout'],
    explication: 'timeout : sans lui, un serveur muet gèle le pipeline.',
  },
  {
    code: `# parser la réponse de l'API
donnees = r.____()`,
    reponses: ['json'],
    explication: '.json() : le corps de la réponse, désérialisé.',
  },
  {
    code: `# dédoublonner un DataFrame sur la clé métier
df = df.drop_duplicates(____=["siret"])`,
    reponses: ['subset'],
    explication: 'subset : les colonnes qui définissent le doublon.',
  },
  {
    code: `# les lignes au montant manquant
manquants = df[df["montant"].____()]`,
    reponses: ['isna'],
    explication: 'isna() : le masque booléen des valeurs absentes.',
  },
  {
    code: `# agréger le CA par ville
ca = df.____("ville")["ca"].sum()`,
    reponses: ['groupby'],
    explication: 'groupby : le GROUP BY de pandas.',
  },
  {
    code: `# l'index inversé : id -> client, pour le hash join
index = {c["id"]: c ____ c in clients}`,
    reponses: ['for'],
    explication: 'La compréhension de dict : {cle: valeur for ...}.',
  },
  {
    code: `# valeur absolue de l'écart, pour le z-score
z = ____(x - moyenne) / ecart_type`,
    reponses: ['abs'],
    explication: 'abs : un écart se mesure dans les deux sens.',
  },
  {
    code: `# tout ou rien : le chargement est atomique
____ conn:
    conn.executemany("INSERT INTO ventes VALUES (?, ?)", lignes)`,
    reponses: ['with'],
    explication: 'with conn : commit si tout passe, rollback sinon.',
  },
  {
    code: `# l'intersection des trigrammes (similarité de Jaccard)
commun = trigrammes_a ____ trigrammes_b`,
    reponses: ['&'],
    explication: '& : intersection de sets ; | pour l\'union.',
  },
  {
    code: `# énumérer avec l'indice, sans compteur manuel
for i, valeur in ____(mesures):
    ...`,
    reponses: ['enumerate'],
    explication: 'enumerate : l\'indice et la valeur, proprement.',
  },
  {
    code: `# lire un CSV français : séparateur point-virgule
df = pd.read_csv("ventes.csv", ____=";")`,
    reponses: ['sep'],
    explication: 'sep=";" : le réflexe des exports Excel français.',
  },
];
