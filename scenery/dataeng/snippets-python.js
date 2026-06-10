/**
 * Snippets data engineering : Python pour la data.
 * Aligné sur la semaine Python du parcours (TP 01 à 10) : collections,
 * fichiers, dates, regex, classes, et le passage du notebook au script
 * de production (argparse, logging, pathlib).
 */

export const PYTHON = [
  {
    id: 'python-collections',
    section: 'Python pour la data',
    titre: 'Collections : listes, dicts, compréhensions',
    competences: 'C8, C10',
    contexte: 'Fondamentaux Python : types, listes, dictionnaires, boucles, fonctions (TP 01 à 03 de la semaine Python).',
    objectif: 'Les structures qui portent 90 % du code data : la liste de dicts (des lignes), le dict de listes (des colonnes), et les compréhensions qui transforment l\'une en l\'autre.',
    idee: 'Une ligne de données se représente naturellement en dict, un jeu de données en liste de dicts. Filtrer, transformer, agréger se font alors en compréhensions et avec sorted(key=...), avant même de sortir pandas.',
    retenir: 'La compréhension remplace la boucle d\'accumulation dans la plupart des cas, et dict.get(cle, defaut) remplace le if-in. Pour trier sur un champ : sorted(lignes, key=lambda l: l["champ"]) ; le tri Python est stable, on peut enchaîner les critères.',
    variantes: [
      {
        label: 'SNIPPET',
        code: `# La liste de dicts : le format universel d'une donnée en Python pur
ventes = [
    {"jour": "2026-01-05", "produit": "clavier", "qte": 3, "pu": 49.90},
    {"jour": "2026-01-05", "produit": "souris", "qte": 10, "pu": 19.90},
    {"jour": "2026-01-06", "produit": "ecran", "qte": 2, "pu": 179.00},
    {"jour": "2026-01-06", "produit": "clavier", "qte": 1, "pu": 49.90},
]

# 1) transformer : une compréhension par ligne dérivée
lignes_ca = [
    {**v, "ca": round(v["qte"] * v["pu"], 2)}     # ** : copie + ajout de champ
    for v in ventes
]

# 2) filtrer : la condition à la fin de la compréhension
grosses_ventes = [l for l in lignes_ca if l["ca"] > 100]
print("ventes > 100 € :", [(l["produit"], l["ca"]) for l in grosses_ventes])

# 3) agréger : le dict accumulateur avec .get(cle, defaut)
ca_par_produit = {}
for l in lignes_ca:
    ca_par_produit[l["produit"]] = ca_par_produit.get(l["produit"], 0) + l["ca"]
print("CA par produit :", ca_par_produit)

# 4) trier : sorted + key, du plus gros au plus petit
classement = sorted(ca_par_produit.items(), key=lambda kv: kv[1], reverse=True)
for produit, ca in classement:
    print(f"  {produit:<10} {ca:>8.2f} €")

# 5) le dépaquetage de tuples, partout en data
jour, produit = ventes[0]["jour"], ventes[0]["produit"]
premier, *reste = classement       # tête et queue d'une liste
print()
print("meilleur produit :", premier[0], "; les autres :", [r[0] for r in reste])`,
      },
    ],
  },

  {
    id: 'python-fichiers',
    section: 'Python pour la data',
    titre: 'Fichiers : with, csv, pickle, pathlib',
    competences: 'C8',
    contexte: 'Entrées/sorties fichier : open, modes, context manager with, module csv, sérialisation (TP 04).',
    objectif: 'Lire et écrire des fichiers sans fuite ni chemin en dur : le bloc with qui ferme toujours, le module csv qui échappe correctement, pathlib qui compose les chemins.',
    idee: 'open() rend un fichier qu\'il faut fermer : le bloc with le garantit même en cas d\'exception. Le module csv gère les cas que le split(",") naïf rate (virgules dans les champs, guillemets). pickle sérialise n\'importe quel objet Python, mais ne se déspickle jamais depuis une source non fiable.',
    retenir: 'Jamais de chemin en dur avec des / collés dans des chaînes : Path("data") / "clean" / "ventes.csv" est lisible et portable. Et mkdir(parents=True, exist_ok=True) avant d\'écrire : le script qui plante parce que le dossier n\'existe pas est un grand classique.',
    variantes: [
      {
        label: 'SNIPPET',
        code: `# Écrire puis relire : texte, CSV, pickle, avec pathlib
import csv
import pickle
from pathlib import Path

dossier = Path("data") / "demo"
dossier.mkdir(parents=True, exist_ok=True)    # le réflexe avant d'écrire

# 1) texte : le bloc with ferme le fichier, même si ça plante au milieu
journal = dossier / "run.log"
with open(journal, "w", encoding="utf-8") as f:
    f.write("run du 2026-06-10 : 4 lignes traitées\\n")

with open(journal, encoding="utf-8") as f:
    print("journal :", f.read().strip())

# 2) CSV : le module csv échappe ce que split(',') casserait
ventes = [
    {"produit": "clavier, mécanique", "qte": 3},   # virgule DANS le champ !
    {"produit": "souris", "qte": 10},
]
chemin_csv = dossier / "ventes.csv"
with open(chemin_csv, "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=["produit", "qte"])
    writer.writeheader()
    writer.writerows(ventes)

print()
print("contenu brut du CSV (regardez les guillemets ajoutés) :")
print(chemin_csv.read_text(encoding="utf-8").strip())

with open(chemin_csv, newline="", encoding="utf-8") as f:
    relu = list(csv.DictReader(f))
print("relu correctement :", relu[0])

# 3) pickle : sérialiser un objet Python tel quel (cache intermédiaire)
etat = {"page": 7, "vus": {101, 102, 205}, "depuis": (2026, 1, 5)}
with open(dossier / "etat.pkl", "wb") as f:
    pickle.dump(etat, f)
with open(dossier / "etat.pkl", "rb") as f:
    print()
    print("état restauré :", pickle.load(f))
print("(pickle : jamais sur des données venues de l'extérieur, code exécutable)")

# 4) pathlib pour inspecter
print()
for p in sorted(dossier.iterdir()):
    print(f"  {p.name:<12} {p.stat().st_size} octets")`,
      },
    ],
  },

  {
    id: 'python-dates',
    section: 'Python pour la data',
    titre: 'Dates : parser, calculer, normaliser en ISO 8601',
    competences: 'C10',
    contexte: 'Homogénéisation des formats de dates ; en base et dans les échanges, le format pivot est ISO 8601 (AAAA-MM-JJ).',
    objectif: 'Le trio strptime/strftime/timedelta, et la règle d\'or du data engineer : tout converger vers ISO 8601 dès l\'entrée du pipeline.',
    idee: 'strptime parse un texte vers un datetime avec un format explicite, strftime fait l\'inverse, timedelta fait l\'arithmétique. ISO 8601 a une propriété précieuse : l\'ordre alphabétique des chaînes est l\'ordre chronologique, donc les tris, les comparaisons et les noms de fichiers fonctionnent sans rien parser.',
    retenir: 'Le piège franco-américain : 03/04/2026 est le 3 avril en France, le 4 mars aux États-Unis. Un format explicite à chaque parsing, et de l\'ISO partout en interne : ce sont les deux règles qui évitent ce bug silencieux, le pire de tous.',
    variantes: [
      {
        label: 'SNIPPET',
        code: `# Dates : du format source vers l'ISO 8601, puis les calculs
from datetime import datetime, date, timedelta

# 1) parser : un format EXPLICITE par source
formats_sources = [
    ("05/01/2026", "%d/%m/%Y"),          # export FR
    ("2026-01-06T14:30:00", "%Y-%m-%dT%H:%M:%S"),  # API
    ("06 Jan 2026", "%d %b %Y"),         # log anglo-saxon
]
dates = []
for texte, fmt in formats_sources:
    d = datetime.strptime(texte, fmt)
    dates.append(d)
    print(f"{texte:<22} -> {d.date().isoformat()}   (pivot ISO 8601)")

# 2) le piège franco-américain, rendu visible
texte = "03/04/2026"
fr = datetime.strptime(texte, "%d/%m/%Y")
us = datetime.strptime(texte, "%m/%d/%Y")
print()
print(f"{texte} : {fr:%d %B} en France, {us:%d %B} aux États-Unis !")

# 3) l'arithmétique : timedelta
derniere_collecte = date(2026, 5, 28)
aujourd_hui = date(2026, 6, 10)
age = aujourd_hui - derniere_collecte
print()
print(f"dernière collecte il y a {age.days} jours")
print("prochaine collecte :", (aujourd_hui + timedelta(weeks=1)).isoformat())
print("données fraîches ?", age.days <= 7)

# 4) côté pandas : to_datetime + l'accessor .dt
import pandas as pd
s = pd.Series(["05/01/2026", "12/01/2026", "03/02/2026"])
d = pd.to_datetime(s, format="%d/%m/%Y")
print()
print("mois extraits :", list(d.dt.strftime("%Y-%m")))
print("jour de semaine :", list(d.dt.day_name()))`,
      },
    ],
  },

  {
    id: 'python-regex',
    section: 'Python pour la data',
    titre: 'Expressions régulières : valider et extraire',
    competences: 'C10',
    contexte: 'Identification des entrées au format non normalisé ; validation et extraction de motifs dans les données textuelles.',
    objectif: 'Les quatre gestes regex du quotidien data : valider un format (fullmatch), extraire des morceaux (groupes), trouver toutes les occurrences (findall), nettoyer (sub).',
    idee: 'Une regex décrit un motif : \\d pour un chiffre, {5} pour une répétition, () pour capturer. Les groupes nommés (?P<nom>...) rendent l\'extraction lisible. On compile une fois (re.compile) et on réutilise.',
    retenir: 'fullmatch pour valider (tout le champ doit correspondre), search pour trouver. Et la regex a ses limites : un email se valide grossièrement, un HTML ne se parse jamais en regex, et un SIRET valide au format peut quand même ne pas exister : la regex contrôle la forme, pas la vérité.',
    variantes: [
      {
        label: 'SNIPPET',
        code: `# Regex : la boîte à outils du nettoyage de texte
import re

# 1) VALIDER un format : fullmatch (tout le champ, pas un bout)
CODE_POSTAL = re.compile(r"\\d{5}")
SIRET = re.compile(r"\\d{14}")

for cp in ["69003", "6900", "69003 Lyon"]:
    ok = CODE_POSTAL.fullmatch(cp) is not None
    print(f"code postal {cp!r:<14} valide : {ok}")

# 2) EXTRAIRE avec des groupes nommés
LIGNE_LOG = re.compile(
    r"(?P<date>\\d{4}-\\d{2}-\\d{2}) (?P<niveau>INFO|WARN|ERROR) (?P<msg>.+)")
log = "2026-06-10 ERROR connexion refusée par la base"
m = LIGNE_LOG.fullmatch(log)
print()
print("extraction :", m.group("date"), "|", m.group("niveau"), "|", m.group("msg"))

# 3) TROUVER TOUT : findall sur du texte libre
texte = "Contacts : ada@calc.uk et grace@navy.mil, siret 13002526500013."
emails = re.findall(r"[\\w.+-]+@[\\w-]+\\.[\\w.]+", texte)
sirets = re.findall(r"\\b\\d{14}\\b", texte)
print()
print("emails trouvés :", emails)
print("sirets trouvés :", sirets)

# 4) NETTOYER : sub remplace le motif
sale = "  Lyon   3e   arrondissement \\t"
propre = re.sub(r"\\s+", " ", sale).strip()    # espaces multiples -> un seul
print()
print(f"avant : {sale!r}")
print(f"après : {propre!r}")

# normaliser un numéro de téléphone : on ne garde que les chiffres
tel = "+33 (0)6 12-34-56-78"
chiffres = re.sub(r"\\D", "", tel)             # \\D : tout sauf un chiffre
print(f"téléphone {tel!r} -> {chiffres}")`,
      },
    ],
  },

  {
    id: 'python-classes',
    section: 'Python pour la data',
    titre: 'Classes : structurer un pipeline en objets',
    competences: 'C8, C10',
    contexte: 'Programmation orientée objet (TP 07) et architecture du projet : retriever, processor, loader, chacun sa responsabilité.',
    objectif: 'L\'architecture en trois classes qui sert de squelette à tous les projets du parcours : un Retriever qui collecte, un Processor qui transforme, un Loader qui charge.',
    idee: 'Chaque classe a une responsabilité unique et une méthode principale. Le pipeline les enchaîne sans savoir comment elles travaillent : on peut remplacer le Retriever API par un Retriever fichier sans toucher au reste. C\'est la version objet de la séparation extract/transform/load.',
    retenir: '__init__ reçoit la configuration, les méthodes reçoivent les données : ne mélangez pas les deux. Et __repr__ rend le débogage humain : print(objet) doit dire quelque chose d\'utile.',
    variantes: [
      {
        label: 'SNIPPET',
        code: `# Le squelette retriever / processor / loader, en classes

class Retriever:
    """Collecte les données brutes (ici simulées ; API ou fichier en vrai)."""

    def __init__(self, source):
        self.source = source

    def __repr__(self):
        return f"Retriever(source={self.source!r})"

    def fetch(self):
        return [
            {"station": "part-dieu", "velos": "12", "ts": "2026-06-10 09:00"},
            {"station": "bellecour", "velos": "0", "ts": "2026-06-10 09:00"},
            {"station": "part-dieu", "velos": "abc", "ts": "2026-06-10 09:05"},
        ]

class Processor:
    """Transforme et valide : types, rejets comptés."""

    def __init__(self):
        self.rejets = []

    def process(self, brut):
        propres = []
        for ligne in brut:
            try:
                propres.append({
                    "station": ligne["station"].strip().title(),
                    "velos": int(ligne["velos"]),
                    "ts": ligne["ts"],
                })
            except (ValueError, KeyError) as e:
                self.rejets.append((ligne, str(e)))
        return propres

class Loader:
    """Charge vers la cible (ici : affichage ; sqlite ou PostgreSQL en vrai)."""

    def load(self, lignes):
        for l in lignes:
            print(f"  INSERT {l}")
        return len(lignes)

# le pipeline : trois objets, trois responsabilités, zéro mélange
retriever = Retriever("api://velov/stations")
processor = Processor()
loader = Loader()
print(retriever)

brut = retriever.fetch()
propres = processor.process(brut)
print(f"\\n{len(brut)} lignes brutes -> {len(propres)} propres,"
      f" {len(processor.rejets)} rejet(s)")
charge = loader.load(propres)
print(f"\\n{charge} lignes chargées ; rejets à examiner :")
for ligne, erreur in processor.rejets:
    print(f"  {ligne} ({erreur})")`,
      },
    ],
  },

  {
    id: 'python-projet',
    section: 'Python pour la data',
    titre: 'Du notebook au script : argparse, logging, pathlib',
    competences: 'C8, C15',
    contexte: 'Passer du notebook au code de production : script paramétré (argparse), journal (logging), chemins propres (pathlib), secrets hors du code.',
    objectif: 'Les trois modules qui transforment un notebook en script qu\'on peut planifier dans un cron ou un orchestrateur : des paramètres en ligne de commande, un journal horodaté, des chemins composés proprement.',
    idee: 'argparse déclare les paramètres et fabrique l\'aide automatiquement ; logging remplace les print par des messages datés et filtrables par niveau ; pathlib compose les chemins de sortie. Le script devient rejouable avec d\'autres paramètres sans toucher au code.',
    retenir: 'Un script de production se reconnaît à trois choses : on peut le lancer avec --help et comprendre, son journal dit ce qu\'il a fait et quand, et aucun secret ni chemin absolu ne traîne dans le code (variables d\'environnement et .env pour les secrets).',
    variantes: [
      {
        label: 'SNIPPET',
        code: `# Un script paramétré et journalisé (argv simulé ici, réel en CLI)
import argparse
import logging
import sys
from pathlib import Path

# --- 1) les paramètres : déclarés, typés, documentés -----------------
parser = argparse.ArgumentParser(description="Collecte des ventes d'un département")
parser.add_argument("--departement", required=True, help="code à deux chiffres")
parser.add_argument("--limite", type=int, default=100, help="nb max de lignes")
parser.add_argument("--verbose", action="store_true")

# en ligne de commande réelle : args = parser.parse_args()
args = parser.parse_args(["--departement", "69", "--limite", "50", "--verbose"])

# --- 2) le journal : daté, filtrable, jamais un print ----------------
logging.basicConfig(
    level=logging.DEBUG if args.verbose else logging.INFO,
    format="%(asctime)s %(levelname)-7s %(message)s",
    datefmt="%H:%M:%S",
    stream=sys.stdout,        # par défaut logging écrit sur stderr
)
log = logging.getLogger("collecte")

# --- 3) les chemins : composés, créés, jamais en dur ------------------
sortie = Path("data") / "out" / f"ventes_dep{args.departement}.csv"
sortie.parent.mkdir(parents=True, exist_ok=True)

log.info(f"démarrage : département {args.departement}, limite {args.limite}")
log.debug("mode verbeux activé (visible seulement avec --verbose)")

lignes = [f"2026-06-{j:02d};dep{args.departement};{100 + j}" for j in range(1, 6)]
sortie.write_text("jour;departement;ca\\n" + "\\n".join(lignes), encoding="utf-8")

log.info(f"{len(lignes)} lignes écrites dans {sortie}")
log.info("terminé sans erreur")
print()
print(sortie.read_text(encoding="utf-8"))`,
      },
      {
        label: 'EN PRODUCTION',
        runnable: false,
        code: `# La structure de projet complète, telle qu'attendue en entreprise

# mon_pipeline/
# ├── main.py            # point d'entrée : argparse + orchestration
# ├── retriever.py       # extraction (API, fichiers, BDD)
# ├── processor.py       # transformation, validation
# ├── loader.py          # chargement en base
# ├── requirements.txt   # dépendances épinglées
# ├── .env               # secrets : JAMAIS commité (.gitignore)
# └── data/              # caches et sorties : JAMAIS commités

# --- requirements.txt -------------------------------------------------
# requests==2.32.4
# pandas==2.2.3
# psycopg[binary]==3.2.4
# python-dotenv==1.1.1

# --- les secrets : .env + python-dotenv -------------------------------
# fichier .env :
#   DATABASE_URL=postgresql://user:motdepasse@hote:5432/base
#   API_KEY=la-cle-fournie-par-le-service

from dotenv import load_dotenv
import os

load_dotenv()                              # charge .env dans l'environnement
DATABASE_URL = os.environ["DATABASE_URL"]  # KeyError si absent : tant mieux,
API_KEY = os.environ["API_KEY"]            # on échoue tôt et clairement

# --- main.py : le chef d'orchestre ------------------------------------
# import argparse, logging
# from retriever import Retriever
# from processor import Processor
# from loader import Loader
#
# def main():
#     args = parser.parse_args()
#     brut = Retriever(API_KEY).fetch(args.departement)
#     propres = Processor().process(brut)
#     Loader(DATABASE_URL).load(propres)
#
# if __name__ == "__main__":
#     main()
#
# lancement :  python main.py --departement 69 --verbose
# cron :       0 6 * * *  cd /opt/pipeline && ./env/bin/python main.py ...`,
      },
    ],
  },
];
