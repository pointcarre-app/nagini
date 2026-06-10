/**
 * Snippets data engineering : data lake, flux, orchestration, gouvernance.
 * Compétences C12 (partage), C15-C16 (DataOps), C18-C21 (data lake, RGPD).
 * Les variantes runnable false (PySpark, Kafka, FastAPI, Airflow) montrent
 * le code de production : à exécuter sur votre machine, pas dans le navigateur.
 */

export const FLUX = [
  {
    id: 'pyspark',
    section: 'Data lake et flux',
    titre: 'PySpark : les transformations distribuées',
    competences: 'C8, C9, C19',
    contexte: 'Écriture des requêtes d\'extraction depuis un système big data (Hive, Spark). Stack data lake : Spark (PySpark).',
    objectif: 'Lire le PySpark sans être dépaysé : l\'API DataFrame de Spark est un cousin direct de pandas et du SQL. Comprendre la correspondance, et ce qui change vraiment (le lazy, les partitions).',
    idee: 'Spark ne fait rien tant qu\'on ne demande pas un résultat : filter et groupBy construisent un plan, c\'est show, count ou write qui déclenchent le calcul, distribué sur les machines du cluster. L\'onglet pandas exécute ici la même logique, ligne pour ligne : la traduction est presque mécanique.',
    retenir: 'Le réflexe de traduction : where = filtre booléen pandas, groupBy.agg = groupby.agg, withColumn = assignation de colonne. Ce qui n\'a pas d\'équivalent local : partitionBy à l\'écriture (l\'organisation physique du data lake) et le coût des shuffles entre machines.',
    variantes: [
      {
        label: 'PYSPARK',
        runnable: false,
        code: `# PySpark : à exécuter sur un cluster ou en local (pip install pyspark)
from pyspark.sql import SparkSession, functions as F

spark = SparkSession.builder.appName("ventes").getOrCreate()

# lecture depuis le data lake (parquet : colonne + compression + schéma)
ventes = spark.read.parquet("s3://lake/bronze/ventes/")

# transformations : RIEN ne s'exécute encore (évaluation paresseuse)
ca_par_famille = (
    ventes
    .where(F.col("montant") > 0)                      # filtre
    .withColumn("mois", F.date_format("jour", "yyyy-MM"))
    .groupBy("mois", "famille")
    .agg(
        F.sum("montant").alias("ca"),
        F.countDistinct("client_id").alias("clients"),
    )
    .orderBy("mois", F.desc("ca"))
)

ca_par_famille.show(10)        # ICI le cluster calcule

# écriture vers la zone silver, partitionnée par mois :
# c'est l'organisation physique qui rendra les lectures rapides
(ca_par_famille.write
    .mode("overwrite")
    .partitionBy("mois")
    .parquet("s3://lake/silver/ca_par_famille/"))

# et le même calcul en SQL pur, au choix :
ventes.createOrReplaceTempView("ventes")
spark.sql("""
    SELECT date_format(jour, 'yyyy-MM') AS mois, famille,
           SUM(montant) AS ca
    FROM ventes WHERE montant > 0
    GROUP BY 1, 2 ORDER BY 1, 3 DESC
""").show(10)`,
      },
      {
        label: 'ÉQUIVALENT PANDAS',
        code: `# La même logique, exécutable ici : la traduction Spark -> pandas
import io
import pandas as pd

brut = """jour,famille,client_id,montant
2026-01-05,peripheriques,1,149.70
2026-01-05,peripheriques,2,99.50
2026-01-12,affichage,1,358.00
2026-01-12,peripheriques,3,49.90
2026-02-03,affichage,2,716.00
2026-02-03,peripheriques,2,-10.00
2026-02-03,peripheriques,3,199.00
"""
ventes = pd.read_csv(io.StringIO(brut), parse_dates=["jour"])

# .where(col > 0)            ->  filtre booléen
ventes = ventes[ventes["montant"] > 0]

# .withColumn("mois", ...)   ->  assignation de colonne
ventes["mois"] = ventes["jour"].dt.strftime("%Y-%m")

# .groupBy().agg()           ->  groupby().agg()
ca = (ventes.groupby(["mois", "famille"])
      .agg(ca=("montant", "sum"), clients=("client_id", "nunique"))
      .reset_index()
      .sort_values(["mois", "ca"], ascending=[True, False]))

print(ca.to_string(index=False))
print()
print("Correspondances à mémoriser :")
print("  where        <-> df[condition]")
print("  withColumn   <-> df['col'] = ...")
print("  groupBy.agg  <-> groupby().agg()")
print("  orderBy      <-> sort_values()")
print()
print("Ce que pandas n'a pas : le calcul distribué, le lazy,")
print("et partitionBy à l'écriture. C'est ça qu'on paie avec Spark.")`,
      },
    ],
  },

  {
    id: 'streaming',
    section: 'Data lake et flux',
    titre: 'Flux et micro-lots : agréger en temps réel',
    competences: 'C19',
    contexte: 'Outils streaming d\'acquisition nécessaires à la collecte et l\'alimentation en données (Flume, Kafka). Flux continus contre flux ponctuels.',
    objectif: 'Comprendre la mécanique du streaming en l\'implémentant à la main : des événements qui arrivent au fil de l\'eau, agrégés par fenêtres de temps, avec le problème inévitable des retardataires.',
    idee: 'Un traitement streaming ne voit jamais « toutes » les données : il découpe le temps en fenêtres (ici 10 secondes), agrège chaque fenêtre, et décide quoi faire d\'un événement qui arrive après la clôture de sa fenêtre. Ce dernier point, le watermark, est LA vraie difficulté du temps réel.',
    retenir: 'La question à poser à chaque projet streaming : que fait-on d\'un événement en retard ? L\'ignorer (perte), rouvrir la fenêtre (recalcul), ou le compter à part. Kafka et Spark Structured Streaming industrialisent exactement cette mécanique, fenêtres et watermark compris.',
    variantes: [
      {
        label: 'SNIPPET',
        code: `# Fenêtres temporelles et retardataires, implémentés à la main
from datetime import datetime

# des événements horodatés, dont UN arrive en retard (hors ordre)
EVENEMENTS = [
    ("2026-06-10 09:00:02", "page_vue"),
    ("2026-06-10 09:00:07", "achat"),
    ("2026-06-10 09:00:13", "page_vue"),
    ("2026-06-10 09:00:18", "page_vue"),
    ("2026-06-10 09:00:09", "achat"),      # RETARDATAIRE : fenêtre déjà fermée
    ("2026-06-10 09:00:24", "achat"),
]

TAILLE_FENETRE = 10   # secondes

def debut_fenetre(ts):
    """Rattache un timestamp à sa fenêtre de 10 s (tumbling window)."""
    secondes = ts.minute * 60 + ts.second
    base = (secondes // TAILLE_FENETRE) * TAILLE_FENETRE
    return ts.replace(minute=base // 60, second=base % 60)

fenetres = {}            # debut -> compteurs par type d'événement
fenetre_fermee = None    # la plus tardive déjà émise
retardataires = []

for horodatage, type_evt in EVENEMENTS:
    ts = datetime.fromisoformat(horodatage)
    fenetre = debut_fenetre(ts)

    if fenetre_fermee is not None and fenetre <= fenetre_fermee:
        retardataires.append((horodatage, type_evt))
        continue                       # politique choisie : compter à part

    compteur = fenetres.setdefault(fenetre, {})
    compteur[type_evt] = compteur.get(type_evt, 0) + 1

    # on émet (ferme) les fenêtres dont l'heure est passée
    for debut in sorted(fenetres):
        if debut < fenetre:
            print(f"fenêtre {debut.time()} + {TAILLE_FENETRE}s :",
                  fenetres.pop(debut))
            fenetre_fermee = debut

# fin du flux : on vide ce qui reste
for debut in sorted(fenetres):
    print(f"fenêtre {debut.time()} + {TAILLE_FENETRE}s :", fenetres[debut])

print()
print("retardataires non comptés dans leur fenêtre :", retardataires)
print()
print("C'est exactement le problème que les watermarks de Kafka Streams")
print("ou Spark Structured Streaming résolvent : jusqu'à quand attendre ?")`,
      },
      {
        label: 'EN PRODUCTION',
        runnable: false,
        code: `# Kafka : le producteur et le consommateur minimaux (pip install kafka-python)
import json
from kafka import KafkaProducer, KafkaConsumer

# --- côté producteur : l'application émet des événements -------------
producteur = KafkaProducer(
    bootstrap_servers="localhost:9092",
    value_serializer=lambda d: json.dumps(d).encode("utf-8"),
    acks="all",                      # attendre la réplication : pas de perte
)
producteur.send("evenements-web", {
    "ts": "2026-06-10T09:00:02", "type": "achat", "montant": 49.90,
})
producteur.flush()

# --- côté consommateur : le pipeline lit le flux ----------------------
consommateur = KafkaConsumer(
    "evenements-web",
    bootstrap_servers="localhost:9092",
    group_id="agregation-ventes",    # le groupe répartit les partitions
    auto_offset_reset="earliest",    # au premier démarrage : tout relire
    value_deserializer=lambda b: json.loads(b.decode("utf-8")),
)
for message in consommateur:
    evt = message.value
    print(message.topic, message.partition, message.offset, evt)
    # ici : la logique de fenêtres de l'onglet exécutable

# Ce que Kafka apporte par rapport au snippet artisanal :
# - la persistance du flux (on peut rejouer depuis un offset)
# - le parallélisme par partitions, les groupes de consommateurs
# - le découplage producteurs/consommateurs (ils s'ignorent)`,
      },
    ],
  },

  {
    id: 'nosql',
    section: 'Data lake et flux',
    titre: 'Documents NoSQL : souplesse et pièges',
    competences: 'C18, C19',
    contexte: 'Stack data lake : MongoDB, ElasticSearch. Données volumineuses et non structurées, schéma flexible.',
    objectif: 'Manipuler une collection de documents au schéma hétérogène : filtrer, projeter, agréger, et toucher du doigt le prix de la flexibilité.',
    idee: 'Une collection NoSQL accepte des documents de formes différentes : c\'est sa force à l\'ingestion (on stocke d\'abord, on comprend après) et son danger à la lecture (chaque champ peut manquer). Le snippet implémente find, projection et pipeline d\'agrégation en pur Python : c\'est exactement ce que fait MongoDB, en distribué.',
    retenir: 'Le schéma n\'a pas disparu : il a déménagé de la base vers le code de lecture. Tout accès à un champ optionnel passe par .get() avec défaut, et chaque équipe doit documenter le contrat des documents quelque part : c\'est le rôle du catalogue de données.',
    variantes: [
      {
        label: 'SNIPPET',
        code: `# Une collection de documents hétérogènes, requêtée à la MongoDB
COLLECTION = [
    {"_id": 1, "type": "capteur", "site": "Lyon", "temp": 21.5,
     "tags": ["prod"]},
    {"_id": 2, "type": "capteur", "site": "Paris", "temp": 19.0,
     "humidite": 55},
    {"_id": 3, "type": "automate", "site": "Lyon",
     "erreurs": [{"code": "E42", "grave": True}, {"code": "E07", "grave": False}]},
    {"_id": 4, "type": "capteur", "site": "Lyon", "temp": 23.1,
     "tags": ["prod", "etalonne"]},
    {"_id": 5, "type": "automate", "site": "Paris", "erreurs": []},
]

def find(collection, filtre):
    """Sélection par égalité, comme db.collection.find({...})."""
    return [d for d in collection
            if all(d.get(k) == v for k, v in filtre.items())]

def projeter(documents, champs):
    """Projection avec défauts : le schéma vit dans le code de lecture."""
    return [{c: d.get(c) for c in champs} for d in documents]

print("capteurs de Lyon :")
for d in projeter(find(COLLECTION, {"type": "capteur", "site": "Lyon"}),
                  ["_id", "temp", "tags"]):
    print(" ", d)

# pipeline d'agrégation : température moyenne par site
temperatures = {}
for d in COLLECTION:
    if "temp" in d:                          # champ optionnel !
        temperatures.setdefault(d["site"], []).append(d["temp"])
print()
print("température moyenne par site :")
for site, valeurs in temperatures.items():
    print(f"  {site} : {sum(valeurs) / len(valeurs):.1f} °C"
          f" ({len(valeurs)} capteurs)")

# dérouler un tableau imbriqué (l'unwind de MongoDB)
print()
print("toutes les erreurs d'automates (unwind) :")
for d in COLLECTION:
    for erreur in d.get("erreurs", []):      # .get : le réflexe NoSQL
        print(f"  site {d['site']} : {erreur['code']}"
              + ("  (grave)" if erreur["grave"] else ""))`,
      },
      {
        label: 'EN PRODUCTION',
        runnable: false,
        code: `# MongoDB avec pymongo (pip install pymongo)
from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017")
db = client["usine"]
mesures = db["mesures"]

# insertion : les documents hétérogènes passent tels quels
mesures.insert_many([
    {"type": "capteur", "site": "Lyon", "temp": 21.5, "tags": ["prod"]},
    {"type": "automate", "site": "Lyon",
     "erreurs": [{"code": "E42", "grave": True}]},
])

# find avec filtre et projection
for doc in mesures.find({"type": "capteur", "site": "Lyon"},
                        {"_id": 0, "temp": 1, "tags": 1}):
    print(doc)

# pipeline d'agrégation : moyenne par site
pipeline = [
    {"$match": {"temp": {"$exists": True}}},
    {"$group": {"_id": "$site",
                "temp_moyenne": {"$avg": "$temp"},
                "nb": {"$sum": 1}}},
    {"$sort": {"temp_moyenne": -1}},
]
for ligne in mesures.aggregate(pipeline):
    print(ligne)

# dérouler un tableau : l'étape $unwind
for ligne in mesures.aggregate([
    {"$unwind": "$erreurs"},
    {"$match": {"erreurs.grave": True}},
    {"$project": {"_id": 0, "site": 1, "code": "$erreurs.code"}},
]):
    print(ligne)

# index : la flexibilité du schéma n'exempte pas d'indexer
mesures.create_index([("site", 1), ("type", 1)])`,
      },
    ],
  },

  {
    id: 'orchestration',
    section: 'Data lake et flux',
    titre: 'Orchestrer un pipeline : le DAG',
    competences: 'C15, C16',
    contexte: 'Sélectionner et mettre en place un outil d\'orchestration des traitements (Airflow, Dagster). Monitorage et reprise sur incident.',
    objectif: 'Comprendre ce qu\'un orchestrateur fait vraiment : ordonner des tâches selon leurs dépendances (un graphe orienté acyclique), exécuter, et reprendre proprement après un échec.',
    idee: 'Le snippet implémente le cœur d\'Airflow en quarante lignes : un tri topologique qui trouve un ordre d\'exécution compatible avec les dépendances, puis une exécution qui saute les tâches dont un parent a échoué. Tout orchestrateur, d\'Airflow à Dagster, est une industrialisation de cette boucle.',
    retenir: 'Deux propriétés d\'une bonne tâche orchestrée : idempotente (on peut la relancer) et déterministe pour une date donnée (le « run du 5 janvier » donne toujours pareil). Si vos tâches ont ces deux propriétés, la reprise sur incident devient un simple clic sur retry.',
    variantes: [
      {
        label: 'SNIPPET',
        code: `# Un mini-orchestrateur : tri topologique + exécution avec reprise

# le pipeline : tâche -> liste de ses dépendances
DAG = {
    "extraire_api":     [],
    "extraire_bdd":     [],
    "nettoyer":         ["extraire_api", "extraire_bdd"],
    "charger_dwh":      ["nettoyer"],
    "controles_qualite": ["charger_dwh"],
    "rafraichir_dashboard": ["controles_qualite"],
}

def tri_topologique(dag):
    """Ordonne les tâches : chaque tâche après toutes ses dépendances."""
    ordre, visites = [], set()
    def visiter(tache, pile):
        if tache in pile:
            raise ValueError(f"cycle détecté autour de {tache} !")
        if tache in visites:
            return
        for dep in dag[tache]:
            visiter(dep, pile | {tache})
        visites.add(tache)
        ordre.append(tache)
    for tache in dag:
        visiter(tache, set())
    return ordre

def executer(dag, taches_qui_echouent=()):
    etats = {}
    for tache in tri_topologique(dag):
        if any(etats.get(dep) != "succès" for dep in dag[tache]):
            etats[tache] = "sauté"            # un parent a échoué
        elif tache in taches_qui_echouent:
            etats[tache] = "ÉCHEC"
        else:
            etats[tache] = "succès"           # ici : le vrai travail
        print(f"  {tache:<22} {etats[tache]}")
    return etats

print("ordre calculé :", " -> ".join(tri_topologique(DAG)))
print()
print("=== run 1 : les contrôles qualité échouent ===")
executer(DAG, taches_qui_echouent={"controles_qualite"})
print()
print("=== run 2 : reprise, tout passe ===")
executer(DAG)
print()
print("Remarquez le run 1 : le dashboard n'a PAS été rafraîchi.")
print("L'orchestrateur protège l'aval des échecs de l'amont.")`,
      },
      {
        label: 'EN PRODUCTION',
        runnable: false,
        code: `# Le même pipeline, déclaré dans Airflow (pip install apache-airflow)
from datetime import datetime, timedelta
from airflow.decorators import dag, task

@dag(
    schedule="0 6 * * *",                 # tous les jours à 6 h
    start_date=datetime(2026, 1, 1),
    catchup=False,                        # pas de rattrapage du passé
    default_args={
        "retries": 2,                     # reprise automatique
        "retry_delay": timedelta(minutes=5),
    },
    tags=["ventes"],
)
def pipeline_ventes():

    @task
    def extraire_api():
        ...                               # l'appel REST de la section collecte

    @task
    def extraire_bdd():
        ...

    @task
    def nettoyer(api, bdd):
        ...                               # le nettoyage de la section dédiée

    @task
    def charger_dwh(propre):
        ...                               # l'ETL idempotent par période

    @task
    def controles_qualite(_):
        ...                               # les règles qualité : raise si échec

    # les dépendances, lisibles comme une phrase
    propre = nettoyer(extraire_api(), extraire_bdd())
    controles_qualite(charger_dwh(propre))

pipeline_ventes()

# Ce qu'Airflow ajoute au mini-orchestrateur exécutable :
# le scheduler (cron), les retries, l'interface de suivi des runs,
# les alertes, le backfill par date, et l'historique de chaque tâche.`,
      },
    ],
  },

  {
    id: 'api-exposition',
    section: 'Gouvernance et partage',
    titre: 'Exposer les données : de la base à l\'API',
    competences: 'C12',
    contexte: 'Développement des points de terminaison de l\'API REST exposant les données stockées en base, et des règles d\'autorisation et d\'accès.',
    objectif: 'Le dernier kilomètre du data engineer : transformer une table en réponses JSON paginées et propres, puis monter le vrai service avec FastAPI.',
    idee: 'Une API de données, c\'est trois décisions : la forme du JSON (types sérialisables, noms stables : c\'est un contrat d\'interface), la pagination (jamais de SELECT * intégral vers un client), et l\'autorisation (qui a le droit de voir quoi). Le snippet exécute la première et la deuxième sur une vraie base.',
    retenir: 'La réponse paginée standard contient les données ET les métadonnées de pagination (total, page, taille). Un client ne doit jamais avoir à deviner s\'il a tout reçu. Et les datetime partent toujours en ISO 8601 : c\'est le seul format que tout le monde reparse sans douleur.',
    variantes: [
      {
        label: 'SNIPPET',
        code: `# De la table SQL à la réponse JSON paginée
import json
import sqlite3

conn = sqlite3.connect(":memory:")
conn.executescript("""
    CREATE TABLE ventes (id INTEGER PRIMARY KEY, jour TEXT,
                         produit TEXT, montant REAL);
    INSERT INTO ventes (jour, produit, montant) VALUES
        ('2026-01-05','clavier',149.70), ('2026-01-05','souris',99.50),
        ('2026-01-12','ecran',358.00),   ('2026-01-12','clavier',49.90),
        ('2026-02-03','ecran',716.00),   ('2026-02-03','souris',199.00),
        ('2026-02-04','clavier',89.90);
""")
conn.row_factory = sqlite3.Row      # accès aux colonnes par nom

def get_ventes(page=1, taille=3, produit=None):
    """Ce que ferait le handler GET /ventes?page=&taille=&produit="""
    clauses, params = [], []
    if produit is not None:
        clauses.append("produit = ?")
        params.append(produit)
    where = ("WHERE " + " AND ".join(clauses)) if clauses else ""

    total = conn.execute(
        f"SELECT COUNT(*) FROM ventes {where}", params).fetchone()[0]
    lignes = conn.execute(
        f"""SELECT id, jour, produit, montant FROM ventes {where}
            ORDER BY jour, id LIMIT ? OFFSET ?""",
        params + [taille, (page - 1) * taille]).fetchall()

    return {
        "donnees": [dict(l) for l in lignes],
        "pagination": {
            "page": page, "taille": taille, "total": total,
            "pages": (total + taille - 1) // taille,
        },
    }

print("GET /ventes?page=1&taille=3")
print(json.dumps(get_ventes(1, 3), indent=2, ensure_ascii=False))
print()
print("GET /ventes?page=2&taille=3")
print(json.dumps(get_ventes(2, 3), indent=2, ensure_ascii=False))
print()
print("GET /ventes?produit=ecran")
print(json.dumps(get_ventes(1, 3, produit="ecran"), indent=2,
                 ensure_ascii=False))`,
      },
      {
        label: 'EN PRODUCTION',
        runnable: false,
        code: `# Le vrai service : FastAPI + Pydantic + clé d'API
# pip install fastapi uvicorn ; lancement : uvicorn api:app --reload
import os
import sqlite3
from fastapi import FastAPI, Depends, HTTPException, Header, Query
from pydantic import BaseModel

app = FastAPI(title="API ventes", version="1.0")

class Vente(BaseModel):                  # le contrat d'interface, typé
    id: int
    jour: str
    produit: str
    montant: float

class PageVentes(BaseModel):
    donnees: list[Vente]
    total: int
    page: int

def verifier_cle(x_api_key: str = Header()):
    """Autorisation minimale : une clé d'API dans l'en-tête."""
    if x_api_key != os.environ["API_KEY"]:
        raise HTTPException(status_code=401, detail="clé invalide")

@app.get("/ventes", response_model=PageVentes,
         dependencies=[Depends(verifier_cle)])
def lister_ventes(
    page: int = Query(1, ge=1),
    taille: int = Query(50, ge=1, le=500),    # borne haute : on se protège
    produit: str | None = None,
):
    conn = sqlite3.connect("ventes.db")
    conn.row_factory = sqlite3.Row
    where, params = "", []
    if produit:
        where, params = "WHERE produit = ?", [produit]
    total = conn.execute(f"SELECT COUNT(*) FROM ventes {where}",
                         params).fetchone()[0]
    lignes = conn.execute(
        f"""SELECT id, jour, produit, montant FROM ventes {where}
            ORDER BY jour, id LIMIT ? OFFSET ?""",
        params + [taille, (page - 1) * taille]).fetchall()
    return {"donnees": [dict(l) for l in lignes],
            "total": total, "page": page}

# FastAPI génère la documentation interactive sur /docs :
# le contrat d'interface est publié en même temps que l'API.`,
      },
    ],
  },

  {
    id: 'rgpd',
    section: 'Gouvernance et partage',
    titre: 'RGPD : pseudonymiser, anonymiser, purger',
    competences: 'C20, C21',
    contexte: 'Gérer le catalogue et les règles de gouvernance dans le respect du RGPD : registre des traitements, suppression liée au cycle de vie, données personnelles.',
    objectif: 'Les trois gestes techniques du RGPD côté data : pseudonymiser (réversible avec un secret), anonymiser (irréversible, pour les analyses), et purger automatiquement ce qui dépasse la durée de rétention.',
    idee: 'Pseudonymisation : hacher l\'identifiant avec un sel secret ; les jointures restent possibles, la ré-identification exige le secret. Anonymisation : masquer ou généraliser au point qu\'aucun individu ne soit isolable ; le k-anonymat vérifie qu\'aucune combinaison de quasi-identifiants ne désigne moins de k personnes. Purge : une date d\'expiration et un DELETE planifié.',
    retenir: 'Un hash sans sel n\'est PAS une pseudonymisation sérieuse : un annuaire d\'emails se re-hache en quelques secondes (attaque par dictionnaire). Et des données pseudonymisées restent des données personnelles au sens du RGPD : seule l\'anonymisation véritable sort du règlement.',
    variantes: [
      {
        label: 'SNIPPET',
        code: `# Pseudonymisation, masquage, k-anonymat, purge : la boîte à outils
import hashlib
from datetime import date

SEL = "secret-stocke-dans-un-coffre"      # en prod : variable d'env / vault

def pseudonymiser(identifiant):
    """Hash salé : stable (jointures possibles), réversible par personne."""
    return hashlib.sha256((SEL + identifiant).encode()).hexdigest()[:16]

def masquer_email(email):
    nom, domaine = email.split("@")
    return nom[0] + "***@" + domaine

CLIENTS = [
    {"email": "ada@calc.uk", "ville": "Lyon", "age": 36,
     "dernier_achat": "2026-05-01"},
    {"email": "grace@navy.mil", "ville": "Lyon", "age": 37,
     "dernier_achat": "2023-02-10"},
    {"email": "linus@kernel.org", "ville": "Paris", "age": 55,
     "dernier_achat": "2026-04-22"},
    {"email": "tim@w3.org", "ville": "Paris", "age": 58,
     "dernier_achat": "2022-11-30"},
]

print("=== pseudonymisation + masquage ===")
for c in CLIENTS:
    print(f"  {pseudonymiser(c['email'])}  {masquer_email(c['email']):<22}"
          f" {c['ville']}")

# k-anonymat : la tranche d'âge + ville isole-t-elle quelqu'un ?
print()
print("=== contrôle de k-anonymat (k = 2) sur (ville, tranche d'âge) ===")
groupes = {}
for c in CLIENTS:
    cle = (c["ville"], f"{(c['age'] // 10) * 10}-{(c['age'] // 10) * 10 + 9} ans")
    groupes[cle] = groupes.get(cle, 0) + 1
for cle, n in groupes.items():
    verdict = "ok" if n >= 2 else "RISQUE : individu isolable !"
    print(f"  {cle} : {n} personne(s)  {verdict}")

# purge : la rétention, appliquée mécaniquement
print()
print("=== purge : inactifs depuis plus de 3 ans (nous sommes en 2026-06) ===")
AUJOURD_HUI = date(2026, 6, 10)
conserves = []
for c in CLIENTS:
    anciennete = (AUJOURD_HUI - date.fromisoformat(c["dernier_achat"])).days
    if anciennete > 3 * 365:
        print(f"  purgé : {masquer_email(c['email'])}"
              f" (inactif depuis {anciennete // 365} ans)")
    else:
        conserves.append(c)
print(f"  {len(conserves)} clients conservés sur {len(CLIENTS)}")
print()
print("La purge n'est pas une option : c'est la limitation de conservation")
print("(article 5 du RGPD), et elle se programme, pas elle ne se promet.")`,
      },
      {
        label: 'REGISTRE',
        code: `# Le registre des traitements, version structurée et requêtable
# (l'obligation de l'article 30, trop souvent un document Word perdu)
import json

REGISTRE = [
    {
        "traitement": "pipeline ventes quotidien",
        "finalite": "reporting commercial agrégé",
        "donnees_personnelles": ["email client (pseudonymisé)"],
        "base_legale": "intérêt légitime",
        "retention": "3 ans après dernier achat",
        "destinataires": ["équipe data", "direction commerciale"],
        "mesures": ["pseudonymisation SHA-256 salée", "accès par rôle"],
    },
    {
        "traitement": "flux événements web",
        "finalite": "détection de pannes des automates",
        "donnees_personnelles": [],
        "base_legale": "non applicable (données techniques)",
        "retention": "13 mois",
        "destinataires": ["équipe support"],
        "mesures": ["suppression automatique par cycle de vie"],
    },
]

# le registre vit avec le code : il se requête, il s'audite
print("traitements avec données personnelles :")
for t in REGISTRE:
    if t["donnees_personnelles"]:
        print(f"  - {t['traitement']} ({t['base_legale']},"
              f" rétention {t['retention']})")

print()
print("export pour le DPO :")
print(json.dumps(REGISTRE[0], indent=2, ensure_ascii=False))
print()
print("Un registre en JSON dans le dépôt du pipeline : versionné,")
print("relu en revue de code, et impossible à oublier dans un tiroir.")`,
      },
    ],
  },
];
