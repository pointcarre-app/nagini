/**
 * Snippets data engineering : collecte, nettoyage, agrégation.
 * Aligné sur le parcours Data Engineer 805 h (Simplon, RNCP-37638) :
 * compétences C8 (extraction), C10 (agrégation, nettoyage).
 * variantes : runnable false = à exécuter sur votre machine, pas dans le navigateur.
 */

export const COLLECTE = [
  {
    id: 'lire-fichiers',
    section: 'Collecte',
    titre: 'Lire des fichiers de données (CSV, JSON)',
    competences: 'C8',
    contexte: 'Lecture d\'un fichier de données dans un script. Le point de départ de presque tous les ETL.',
    objectif: 'Charger proprement un CSV ou un JSON, en maîtrisant les trois pièges classiques : le séparateur, l\'encodage et la virgule décimale française.',
    idee: 'pandas fait 90 % du travail si on lui décrit le format : sep, decimal, encoding, dtype, parse_dates. Le module csv de la bibliothèque standard reste utile pour les très gros fichiers à traiter ligne par ligne, sans tout charger en mémoire.',
    retenir: 'Ne laissez jamais pandas deviner : un read_csv sans sep ni dtype explicite fonctionne en dev et casse en production le jour où un fichier change. Et un CSV exporté d\'Excel France est presque toujours en sep=";" avec decimal=",".',
    variantes: [
      {
        label: 'SNIPPET',
        code: `# Lire un CSV « à la française » : séparateur ;, décimale ,
import io
import pandas as pd

# en production : pd.read_csv("ventes.csv", sep=";", ...)
brut = """date;magasin;produit;quantite;prix_unitaire
2026-01-05;Lyon;clavier;3;49,90
2026-01-05;Paris;souris;10;19,90
2026-01-06;Lyon;ecran;2;179,00
2026-01-07;Lille;clavier;1;49,90
"""

df = pd.read_csv(
    io.StringIO(brut),
    sep=";",              # séparateur explicite, jamais deviné
    decimal=",",          # 49,90 doit devenir 49.90
    parse_dates=["date"], # la colonne date devient un vrai datetime
    dtype={"magasin": "string", "produit": "string"},
)

print(df)
print()
print("types des colonnes :")
print(df.dtypes)
print()
df["ca"] = df["quantite"] * df["prix_unitaire"]
print("chiffre d'affaires total :", round(df["ca"].sum(), 2), "€")`,
      },
      {
        label: 'STDLIB',
        code: `# Sans pandas : csv et json de la bibliothèque standard.
# Indispensable pour traiter un gros fichier ligne par ligne (streaming).
import csv
import json
import io

brut = """date;magasin;produit;quantite;prix_unitaire
2026-01-05;Lyon;clavier;3;49,90
2026-01-05;Paris;souris;10;19,90
2026-01-06;Lyon;ecran;2;179,00
"""

total = 0.0
lecteur = csv.DictReader(io.StringIO(brut), delimiter=";")
for ligne in lecteur:
    # chaque ligne est un dict : conversion manuelle des types
    quantite = int(ligne["quantite"])
    prix = float(ligne["prix_unitaire"].replace(",", "."))
    total += quantite * prix
    print(ligne["date"], ligne["produit"], quantite, "x", prix)

print()
print("total :", round(total, 2), "€")

# JSON : json.loads (depuis une chaîne) et json.dumps (vers une chaîne)
payload = '{"magasin": "Lyon", "stock": {"clavier": 12, "souris": 40}}'
doc = json.loads(payload)
print()
print("stock claviers à", doc["magasin"], ":", doc["stock"]["clavier"])
print(json.dumps(doc, indent=2, ensure_ascii=False))`,
      },
    ],
  },

  {
    id: 'api-rest',
    section: 'Collecte',
    titre: 'Consommer une API REST paginée',
    competences: 'C8',
    contexte: 'Requêtes HTTP pour la récupération des données depuis un service web (REST). Programmation des filtrages et parsing des résultats obtenus depuis une API.',
    objectif: 'Récupérer toutes les pages d\'une API, aplatir le JSON imbriqué en lignes tabulaires, et écrire le code production qui résiste aux pannes réseau.',
    idee: 'Une API paginée se consomme avec une boucle while : tant que la réponse indique une page suivante, on continue. Le JSON renvoyé est rarement plat : on le normalise avec .get() et des valeurs par défaut, jamais avec un accès direct qui plantera sur le premier champ absent.',
    retenir: 'Le navigateur ne peut pas faire d\'appels réseau depuis ce bac à sable : le snippet simule les réponses, la logique est identique. En production, trois réflexes non négociables : timeout sur chaque requête, retry avec attente croissante, et raise_for_status pour ne jamais parser une page d\'erreur.',
    variantes: [
      {
        label: 'SNIPPET',
        code: `# Pagination et aplatissement d'un JSON d'API
# (réponses simulées ici ; en production : requests, voir l'autre onglet)
import json

REPONSES = {
    1: '{"resultats": [{"id": 1, "nom": "Ada", "adresse": {"ville": "Lyon"}},'
       ' {"id": 2, "nom": "Linus", "adresse": {"ville": "Paris"}}],'
       ' "page_suivante": 2}',
    2: '{"resultats": [{"id": 3, "nom": "Grace", "adresse": null}],'
       ' "page_suivante": null}',
}

def appeler_api(page):
    """En production : requests.get(URL, params={"page": page}).json()"""
    return json.loads(REPONSES[page])

# 1) boucle de pagination
clients = []
page = 1
while page is not None:
    reponse = appeler_api(page)
    clients.extend(reponse["resultats"])
    page = reponse["page_suivante"]
    print(f"page récupérée, total cumulé : {len(clients)} enregistrements")

# 2) aplatissement : du JSON imbriqué vers des lignes tabulaires
lignes = []
for c in clients:
    adresse = c.get("adresse") or {}      # null devient un dict vide
    lignes.append({
        "id": c["id"],
        "nom": c.get("nom", ""),
        "ville": adresse.get("ville", "INCONNUE"),
    })

print()
for ligne in lignes:
    print(ligne)
print()
print("Le .get() avec valeur par défaut absorbe les champs absents :")
print("c'est lui qui évite le KeyError à 3 h du matin.")`,
      },
      {
        label: 'EN PRODUCTION',
        runnable: false,
        code: `# Le même appel, version production : requests + robustesse
import time
import requests

BASE_URL = "https://api.exemple.com/v1/clients"
session = requests.Session()
session.headers.update({
    "Authorization": "Bearer " + "VOTRE_TOKEN",   # jamais en dur : variable d'env
    "User-Agent": "etl-clients/1.0 (data@entreprise.fr)",
})

def appeler_api(page, tentatives=4):
    """GET avec timeout, retry et attente exponentielle."""
    for tentative in range(tentatives):
        try:
            reponse = session.get(BASE_URL, params={"page": page}, timeout=10)
            if reponse.status_code == 429:          # rate limit : on respecte
                attente = int(reponse.headers.get("Retry-After", 5))
                time.sleep(attente)
                continue
            reponse.raise_for_status()              # 4xx/5xx -> exception
            return reponse.json()
        except requests.RequestException as e:
            if tentative == tentatives - 1:
                raise
            time.sleep(2 ** tentative)              # 1 s, 2 s, 4 s...
            print(f"nouvelle tentative après erreur : {e}")

clients = []
page = 1
while page is not None:
    data = appeler_api(page)
    clients.extend(data["resultats"])
    page = data["page_suivante"]

# Les secrets (token) viennent de l'environnement, jamais du code :
#   import os ; token = os.environ["API_TOKEN"]`,
      },
    ],
  },

  {
    id: 'scraping',
    section: 'Collecte',
    titre: 'Extraire des données d\'une page web (scraping)',
    competences: 'C8',
    contexte: 'Règles de scraping sur de nouvelles pages web. Parsing des données utiles depuis l\'HTML collecté d\'un site web.',
    objectif: 'Transformer un tableau HTML en données exploitables, et connaître les règles de politesse qui séparent le scraping professionnel du pillage.',
    idee: 'Le HTML est un arbre : on le parcourt avec un parseur, jamais avec des expressions régulières. Ici, la bibliothèque standard (html.parser) suffit pour un tableau ; en production, BeautifulSoup rend le ciblage par balise, classe ou id beaucoup plus confortable.',
    retenir: 'Avant de scraper : lire robots.txt et les CGU, s\'identifier avec un User-Agent honnête, espacer les requêtes, et mettre en cache le HTML téléchargé pour ne pas re-télécharger à chaque essai de parsing. Le scraping casse quand le site change : isolez le parsing dans une fonction testable.',
    variantes: [
      {
        label: 'SNIPPET',
        code: `# Parser un tableau HTML avec la bibliothèque standard
from html.parser import HTMLParser

HTML = """
<html><body>
  <h1>Catalogue</h1>
  <table id="produits">
    <tr><th>Produit</th><th>Prix</th><th>Stock</th></tr>
    <tr><td>Clavier mécanique</td><td>89,90</td><td>12</td></tr>
    <tr><td>Souris sans fil</td><td>24,50</td><td>40</td></tr>
    <tr><td>Écran 27 pouces</td><td>249,00</td><td>5</td></tr>
  </table>
</body></html>
"""

class ExtracteurTable(HTMLParser):
    """Collecte le texte des cellules td/th, ligne par ligne."""

    def __init__(self):
        super().__init__()
        self.dans_cellule = False
        self.ligne = []
        self.lignes = []

    def handle_starttag(self, tag, attrs):
        if tag in ("td", "th"):
            self.dans_cellule = True

    def handle_endtag(self, tag):
        if tag in ("td", "th"):
            self.dans_cellule = False
        if tag == "tr" and self.ligne:
            self.lignes.append(self.ligne)
            self.ligne = []

    def handle_data(self, data):
        if self.dans_cellule and data.strip():
            self.ligne.append(data.strip())

parseur = ExtracteurTable()
parseur.feed(HTML)

entetes, *donnees = parseur.lignes
print("colonnes :", entetes)
produits = []
for ligne in donnees:
    produits.append({
        "produit": ligne[0],
        "prix": float(ligne[1].replace(",", ".")),
        "stock": int(ligne[2]),
    })
    print(produits[-1])

valeur = sum(p["prix"] * p["stock"] for p in produits)
print()
print(f"valeur du stock : {valeur:.2f} €")`,
      },
      {
        label: 'EN PRODUCTION',
        runnable: false,
        code: `# Version production : requests + BeautifulSoup + politesse
import time
import requests
from bs4 import BeautifulSoup

URL = "https://exemple.com/catalogue"

# 1) s'identifier honnêtement et respecter le site
session = requests.Session()
session.headers["User-Agent"] = "veille-prix/1.0 (data@entreprise.fr)"
# vérifier https://exemple.com/robots.txt avant toute collecte

# 2) télécharger UNE fois, parser autant qu'on veut
reponse = session.get(URL, timeout=10)
reponse.raise_for_status()
html = reponse.text          # à mettre en cache sur disque pendant le dev

# 3) parser : cibler par id, classe, attribut
soup = BeautifulSoup(html, "html.parser")
table = soup.find("table", id="produits")

produits = []
for tr in table.find_all("tr")[1:]:          # on saute l'en-tête
    cellules = [td.get_text(strip=True) for td in tr.find_all("td")]
    produits.append({
        "produit": cellules[0],
        "prix": float(cellules[1].replace(",", ".")),
        "stock": int(cellules[2]),
    })

# 4) entre deux pages : on respire
time.sleep(1.5)

# Le parsing casse quand le site change de maquette :
# isolez-le dans une fonction, écrivez un test avec un HTML figé.`,
      },
    ],
  },

  {
    id: 'nettoyage',
    section: 'Nettoyage et agrégation',
    titre: 'Nettoyer un jeu de données',
    competences: 'C10',
    contexte: 'Identification des entrées corrompues (données partielles, manquantes), suppression des entrées corrompues, homogénéisation des formats (dates, unités).',
    objectif: 'Le quotidien du data engineer : valeurs manquantes, doublons, dates dans trois formats, prix avec le symbole euro. En sortie : un jeu propre et un rapport de ce qui a été corrigé.',
    idee: 'On ne nettoie jamais en silence : chaque règle compte ce qu\'elle a corrigé ou supprimé. L\'ordre des opérations a un sens : d\'abord homogénéiser les formats (sinon les doublons ne se voient pas), puis dédupliquer, puis traiter les manquants.',
    retenir: 'Supprimer une ligne est une décision métier, pas technique : un montant manquant n\'a pas le même sens qu\'une ville manquante. Documentez chaque règle, et gardez le brut : on doit toujours pouvoir rejouer le nettoyage depuis la source.',
    variantes: [
      {
        label: 'SNIPPET',
        code: `# Nettoyage : formats, doublons, manquants, avec rapport
import io
import pandas as pd

brut = """commande,date,client,ville,montant
1001,2026-01-05,Ada Lovelace,Lyon,"49,90 €"
1002,05/01/2026,Linus T,paris,"19,90 €"
1003,2026-01-06,Grace Hopper,LYON,
1002,05/01/2026,Linus T,paris,"19,90 €"
1004,06/01/2026,Ada Lovelace,Lyon,"1 249,00 €"
1005,2026-01-07,,Lille,"15,00 €"
"""
df = pd.read_csv(io.StringIO(brut))
print(f"en entrée : {len(df)} lignes")

# 1) homogénéiser les formats AVANT tout le reste
df["date"] = pd.to_datetime(df["date"], format="mixed", dayfirst=True)
df["ville"] = df["ville"].str.strip().str.title()        # paris, LYON -> Paris, Lyon
df["montant"] = (
    df["montant"]
    .str.replace("€", "", regex=False)
    .str.replace(" ", "", regex=False)     # 1 249,00 -> 1249,00
    .str.replace(",", ".", regex=False)
    .astype(float)
)

# 2) doublons : visibles seulement maintenant que les formats sont propres
doublons = df.duplicated(subset=["commande"]).sum()
df = df.drop_duplicates(subset=["commande"], keep="first")
print(f"doublons supprimés : {doublons}")

# 3) manquants : décision par colonne, jamais un dropna() global
sans_client = df["client"].isna().sum()
df = df.dropna(subset=["client"])          # client inconnu : ligne inexploitable
print(f"lignes sans client supprimées : {sans_client}")

sans_montant = df["montant"].isna().sum()
print(f"montants manquants conservés (à arbitrer avec le métier) : {sans_montant}")

print()
print(df.to_string(index=False))
print()
print(f"en sortie : {len(df)} lignes propres")`,
      },
      {
        label: 'VALIDATION',
        code: `# Valider champ par champ avec des règles explicites
# (le même esprit que pydantic ou great expectations, en pur Python)
import re
from datetime import date

REGLE_EMAIL = re.compile(r"^[\\w.+-]+@[\\w-]+\\.[\\w.]+$")

def valider_client(d):
    """Renvoie la liste des erreurs du dict d (vide si tout va bien)."""
    erreurs = []
    if not d.get("nom", "").strip():
        erreurs.append("nom vide")
    if not REGLE_EMAIL.match(d.get("email", "")):
        erreurs.append(f"email invalide : {d.get('email')!r}")
    if not isinstance(d.get("age"), int) or not 0 <= d["age"] <= 120:
        erreurs.append(f"âge hors domaine : {d.get('age')!r}")
    if d.get("inscription", "") > date.today().isoformat():
        erreurs.append("inscription dans le futur")
    return erreurs

clients = [
    {"nom": "Ada", "email": "ada@calc.uk", "age": 36, "inscription": "2025-11-02"},
    {"nom": "", "email": "pas-un-email", "age": 250, "inscription": "2030-01-01"},
    {"nom": "Grace", "email": "grace@navy.mil", "age": 79, "inscription": "2026-01-15"},
]

valides, rejets = [], []
for c in clients:
    erreurs = valider_client(c)
    if erreurs:
        rejets.append((c, erreurs))
    else:
        valides.append(c)

print(f"{len(valides)} valides, {len(rejets)} rejetés")
print()
for c, erreurs in rejets:
    print("rejeté :", c.get("nom") or "(sans nom)")
    for e in erreurs:
        print("   -", e)
print()
print("Les rejets partent dans une table à part avec leurs motifs :")
print("on ne jette jamais une donnée sans laisser de trace.")`,
      },
    ],
  },

  {
    id: 'agregation',
    section: 'Nettoyage et agrégation',
    titre: 'Agréger plusieurs sources en un jeu unique',
    competences: 'C10',
    contexte: 'Programmation des règles d\'agrégation des données collectées depuis chaque source en un jeu de données brutes unique.',
    objectif: 'Réunir les ventes magasin (CSV) et les ventes web (JSON) dans un référentiel commun, puis produire les agrégats que le métier attend.',
    idee: 'Avant de concaténer, on aligne : mêmes noms de colonnes, mêmes types, mêmes unités, et une colonne source pour tracer l\'origine de chaque ligne. Ensuite groupby et pivot_table font les totaux.',
    retenir: 'La colonne source ne coûte rien et sauve des heures : quand un chiffre paraît faux, on sait immédiatement de quel système il vient. Et un agrégat sans sa définition écrite (CA = quantité × prix unitaire HT ?) finira par être contesté.',
    variantes: [
      {
        label: 'SNIPPET',
        code: `# Deux sources, deux formats, un seul jeu de données
import io
import json
import pandas as pd

# source 1 : les magasins exportent un CSV
csv_magasins = """jour;boutique;article;qte;pu
2026-01-05;Lyon;clavier;3;49.90
2026-01-05;Paris;souris;10;19.90
2026-01-06;Lyon;ecran;2;179.00
"""
magasins = pd.read_csv(io.StringIO(csv_magasins), sep=";", parse_dates=["jour"])
magasins = magasins.rename(columns={
    "jour": "date", "boutique": "canal", "article": "produit",
    "qte": "quantite", "pu": "prix_unitaire",
})
magasins["source"] = "magasin"

# source 2 : le site web pousse du JSON
json_web = """[
  {"ts": "2026-01-05T14:02:11", "sku": "clavier", "n": 2, "prix_cents": 4990},
  {"ts": "2026-01-06T09:30:00", "sku": "souris", "n": 5, "prix_cents": 1990},
  {"ts": "2026-01-07T18:45:59", "sku": "ecran", "n": 1, "prix_cents": 17900}
]"""
web = pd.DataFrame(json.loads(json_web))
web = pd.DataFrame({
    "date": pd.to_datetime(web["ts"]).dt.normalize(),  # on garde le jour
    "canal": "web",
    "produit": web["sku"],
    "quantite": web["n"],
    "prix_unitaire": web["prix_cents"] / 100,          # centimes -> euros !
    "source": "ecommerce",
})

# concaténation : possible uniquement parce que tout est aligné
ventes = pd.concat([magasins, web], ignore_index=True)
ventes["ca"] = ventes["quantite"] * ventes["prix_unitaire"]
print(ventes.to_string(index=False))

print()
print("=== CA par produit ===")
print(ventes.groupby("produit")["ca"].sum().round(2).to_string())

print()
print("=== CA par jour et par canal (pivot) ===")
pivot = ventes.pivot_table(values="ca", index="date", columns="canal",
                           aggfunc="sum", fill_value=0)
print(pivot.round(2).to_string())`,
      },
    ],
  },

  {
    id: 'referentiels',
    section: 'Nettoyage et agrégation',
    titre: 'Croiser sur un référentiel : merge et orphelins',
    competences: 'C10',
    contexte: 'Croisement sur référentiels officiels (code INSEE, UAI, SIRET) : on ne joint jamais sur un nom, on joint sur un code.',
    objectif: 'Enrichir un jeu de données avec un référentiel officiel, vérifier la cardinalité de la jointure avec validate, et isoler les orphelins au lieu de les perdre.',
    idee: 'Les noms divergent (Lyon, LYON, Lyon 3e) ; les codes officiels, eux, sont stables : c\'est leur raison d\'être. Le merge se fait donc sur le code, avec validate="many_to_one" qui fait vérifier par pandas que le référentiel n\'a pas de doublon. Le how="left" garde tout, et les lignes sans correspondance se repèrent au NaN.',
    retenir: 'validate= est une assertion gratuite : si la cardinalité attendue est violée (un code en double dans le référentiel), pandas lève une erreur au lieu de dupliquer silencieusement vos lignes. Les orphelins partent dans un fichier d\'écarts : un croisement qui perd des lignes sans le dire est un bug.',
    variantes: [
      {
        label: 'SNIPPET',
        code: `# Enrichir des ventes avec le référentiel des communes (code INSEE)
import io
import pandas as pd

ventes = pd.read_csv(io.StringIO("""code_insee,ca
69383,149.7
75056,99.5
69266,358.0
99999,42.0
"""), dtype={"code_insee": str})           # un code est un TEXTE, pas un nombre !

referentiel = pd.read_csv(io.StringIO("""code_insee,commune,departement
69383,Lyon 3e,Rhône
69266,Villeurbanne,Rhône
75056,Paris,Paris
"""), dtype={"code_insee": str})

# le merge : sur le CODE, jamais sur le nom, avec contrôle de cardinalité
enrichi = ventes.merge(
    referentiel,
    on="code_insee",
    how="left",                 # on garde TOUTES les ventes
    validate="many_to_one",     # le référentiel doit être unique par code
)
print(enrichi.to_string(index=False))

# les orphelins : visibles, isolés, jamais perdus en silence
orphelins = enrichi[enrichi["commune"].isna()]
print()
print(f"{len(orphelins)} orphelin(s) à examiner (code inconnu du référentiel) :")
print(orphelins[["code_insee", "ca"]].to_string(index=False))

# ce que validate attrape : un doublon dans le référentiel
referentiel_casse = pd.concat([referentiel, referentiel.iloc[[0]]])
try:
    ventes.merge(referentiel_casse, on="code_insee",
                 how="left", validate="many_to_one")
except pd.errors.MergeError as e:
    print()
    print("validate a bloqué un référentiel corrompu :", str(e)[:60], "...")
    print("Sans lui, la vente de Lyon 3e aurait été DUPLIQUÉE en silence.")`,
      },
    ],
  },

  {
    id: 'qualite',
    section: 'Nettoyage et agrégation',
    titre: 'Contrôles qualité automatisés',
    competences: 'C10, C16',
    contexte: 'Démarche DataOps : monitorage de la chaîne de transformation de la donnée, tests automatisés pour l\'intégration des évolutions.',
    objectif: 'Écrire des contrôles qualité qui tournent à chaque chargement et bloquent le pipeline avant que les données fausses n\'atteignent les tableaux de bord.',
    idee: 'Chaque attente sur les données devient une règle nommée et testable : volume minimal, clé unique, taux de nulls borné, valeurs dans un domaine, fraîcheur. Le rapport liste règle par règle ce qui passe et ce qui casse, comme une suite de tests.',
    retenir: 'C\'est exactement le principe d\'outils comme great expectations, dbt tests ou soda : déclarer les attentes, les exécuter à chaque run, échouer bruyamment. Une règle qui n\'a jamais cassé ne prouve pas qu\'elle est inutile : elle prouve que le jour où elle cassera, vous le saurez.',
    variantes: [
      {
        label: 'SNIPPET',
        code: `# Une mini-suite de tests qualité, dans l'esprit de great expectations
import io
import pandas as pd

brut = """commande,date,client,montant,statut
1001,2026-01-05,Ada,49.9,payee
1002,2026-01-05,Linus,19.9,payee
1003,2026-01-06,Grace,,en_attente
1004,2026-01-06,Ada,1249.0,payee
1004,2026-01-07,Tim,15.0,annulee
1005,2026-01-07,Ada,-5.0,payee
"""
df = pd.read_csv(io.StringIO(brut), parse_dates=["date"])

STATUTS_VALIDES = {"payee", "en_attente", "annulee"}

# chaque règle : (nom, fonction qui renvoie le nombre de violations)
REGLES = [
    ("volume minimal (>= 5 lignes)",
     lambda d: 0 if len(d) >= 5 else 1),
    ("clé commande unique",
     lambda d: int(d["commande"].duplicated().sum())),
    ("montant jamais négatif",
     lambda d: int((d["montant"] < 0).sum())),
    ("taux de montants nuls <= 10 %",
     lambda d: 0 if d["montant"].isna().mean() <= 0.10 else 1),
    ("statut dans le domaine autorisé",
     lambda d: int((~d["statut"].isin(STATUTS_VALIDES)).sum())),
    ("fraîcheur : données de moins de 365 jours",
     lambda d: int((pd.Timestamp("2026-06-10") - d["date"].max()).days > 365)),
]

print("rapport qualité")
print("=" * 52)
echecs = 0
for nom, regle in REGLES:
    violations = regle(df)
    statut = "OK  " if violations == 0 else "FAIL"
    if violations:
        echecs += 1
    print(f"[{statut}] {nom}" + (f"   ({violations} violation(s))" if violations else ""))

print("=" * 52)
if echecs:
    print(f"{echecs} règle(s) en échec : en production, le pipeline s'arrête ici")
    # raise SystemExit(1)   <- c'est ce code retour qui bloque l'orchestrateur
else:
    print("tout est vert : on charge")`,
      },
      {
        label: 'EN PRODUCTION',
        runnable: false,
        code: `# Les mêmes attentes, déclarées dans les outils du marché

# --- dbt : fichier models/schema.yml ----------------------------
# models:
#   - name: commandes
#     columns:
#       - name: commande
#         tests: [unique, not_null]
#       - name: statut
#         tests:
#           - accepted_values:
#               values: ['payee', 'en_attente', 'annulee']
#       - name: montant
#         tests:
#           - dbt_utils.accepted_range:
#               min_value: 0

# --- great expectations : suite python --------------------------
import great_expectations as gx

contexte = gx.get_context()
validator = contexte.sources.pandas_default.read_csv("commandes.csv")

validator.expect_column_values_to_be_unique("commande")
validator.expect_column_values_to_not_be_null("client")
validator.expect_column_values_to_be_between("montant", min_value=0)
validator.expect_column_values_to_be_in_set(
    "statut", ["payee", "en_attente", "annulee"])

resultat = validator.validate()
print(resultat.success)        # False -> on bloque le pipeline

# Le principe ne change pas : des attentes nommées, exécutées
# à chaque chargement, qui échouent bruyamment.`,
      },
    ],
  },
];
