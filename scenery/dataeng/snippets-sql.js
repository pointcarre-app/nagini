/**
 * Snippets data engineering : SQL, bases de données, entrepôt de données.
 * Compétences C9 (requêtes SQL), C11 (créer une BDD), C13-C17 (data warehouse).
 * Tout s'exécute réellement ici : Pyodide embarque sqlite3.
 * Les différences PostgreSQL sont signalées dans les variantes production.
 */

export const SQL = [
  {
    id: 'sql-fondamentaux',
    section: 'SQL et bases de données',
    titre: 'CRUD et requêtes paramétrées',
    competences: 'C9, C11',
    contexte: 'Maîtriser SQL à un niveau fondamental : CRUD (create, read, update, delete), création de table, imports.',
    objectif: 'Les quatre opérations de base, et surtout la seule bonne façon de passer des valeurs à une requête : les paramètres, jamais la concaténation de chaînes.',
    idee: 'Ce snippet tourne pour de vrai : sqlite3 est embarqué dans le navigateur. La syntaxe est du SQL standard à 95 % ; ce que vous écrivez ici fonctionne presque tel quel sur PostgreSQL.',
    retenir: 'La concaténation f"...{valeur}..." dans une requête SQL est LA faille classique (injection SQL) et elle casse aussi sur un simple apostrophe dans un nom. Les requêtes paramétrées (? en sqlite, %s en psycopg) règlent les deux problèmes d\'un coup.',
    variantes: [
      {
        label: 'SNIPPET',
        code: `# CRUD complet sur une base réelle (sqlite, en mémoire)
import sqlite3

conn = sqlite3.connect(":memory:")
conn.execute("PRAGMA foreign_keys = ON")

# CREATE : le schéma avec ses contraintes
conn.execute("""
    CREATE TABLE clients (
        id     INTEGER PRIMARY KEY,
        nom    TEXT NOT NULL,
        email  TEXT UNIQUE NOT NULL,
        ville  TEXT DEFAULT 'inconnue'
    )
""")

# INSERT : TOUJOURS des paramètres (?), jamais de f-string
clients = [
    ("Ada Lovelace", "ada@calc.uk", "Lyon"),
    ("Grace Hopper", "grace@navy.mil", "Paris"),
    ("Linus Torvalds", "linus@kernel.org", "Lille"),
]
conn.executemany(
    "INSERT INTO clients (nom, email, ville) VALUES (?, ?, ?)", clients)
conn.commit()

# READ
for ligne in conn.execute("SELECT id, nom, ville FROM clients ORDER BY nom"):
    print(ligne)

# UPDATE : le WHERE d'abord, toujours (sans lui, tout est modifié)
conn.execute("UPDATE clients SET ville = ? WHERE email = ?",
             ("Villeurbanne", "ada@calc.uk"))

# DELETE
conn.execute("DELETE FROM clients WHERE ville = ?", ("Lille",))
conn.commit()

print()
print("après update + delete :")
for ligne in conn.execute("SELECT nom, ville FROM clients"):
    print(ligne)

# la contrainte UNIQUE travaille pour vous
try:
    conn.execute("INSERT INTO clients (nom, email) VALUES (?, ?)",
                 ("Imposteur", "ada@calc.uk"))
except sqlite3.IntegrityError as e:
    print()
    print("refusé par la base :", e)`,
      },
      {
        label: 'EN PRODUCTION',
        runnable: false,
        code: `# La même chose sur PostgreSQL avec psycopg
import os
import psycopg

# la connexion vient de l'environnement, jamais du code
conn = psycopg.connect(os.environ["DATABASE_URL"])
# postgresql://user:motdepasse@hote:5432/base

with conn:                       # commit automatique en sortie de bloc
    with conn.cursor() as cur:
        cur.execute("""
            CREATE TABLE IF NOT EXISTS clients (
                id     BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                nom    TEXT NOT NULL,
                email  TEXT UNIQUE NOT NULL,
                ville  TEXT DEFAULT 'inconnue',
                cree_le TIMESTAMPTZ DEFAULT now()
            )
        """)
        # paramètres : %s chez psycopg (le rôle est le même que ? en sqlite)
        cur.execute(
            "INSERT INTO clients (nom, email, ville) VALUES (%s, %s, %s)",
            ("Ada Lovelace", "ada@calc.uk", "Lyon"),
        )
        cur.execute("SELECT id, nom FROM clients WHERE ville = %s", ("Lyon",))
        for ligne in cur.fetchall():
            print(ligne)

# Différences à connaître en passant de sqlite à PostgreSQL :
# - types riches : TIMESTAMPTZ, NUMERIC(12,2), JSONB, UUID
# - IDENTITY (ou SERIAL) pour les clés auto-incrémentées
# - vrais droits utilisateurs (GRANT/REVOKE), schémas, rôles`,
      },
    ],
  },

  {
    id: 'sql-extraction',
    section: 'SQL et bases de données',
    titre: 'Requêtes d\'extraction : JOIN, GROUP BY, CTE, fenêtres',
    competences: 'C9',
    contexte: 'Écriture des requêtes d\'extraction de type SQL de récupération de données stockées en base. Le cœur de la compétence C9.',
    objectif: 'Les quatre outils qui couvrent l\'essentiel de l\'extraction analytique : jointures, agrégats filtrés, CTE pour structurer, fonctions de fenêtre pour les classements.',
    idee: 'On monte en puissance sur une vraie base : d\'abord JOIN pour recoller commandes et clients, puis GROUP BY et HAVING pour les totaux, puis WITH (CTE) pour nommer les étapes, et enfin RANK() OVER pour répondre à la question piège du « meilleur client par ville ».',
    retenir: 'WHERE filtre les lignes avant agrégation, HAVING filtre les groupes après : les confondre est l\'erreur d\'entretien classique. Et dès qu\'une requête dépasse deux niveaux d\'imbrication, une CTE la rend lisible : c\'est gratuit, profitez-en.',
    variantes: [
      {
        label: 'SNIPPET',
        code: `# Extraction analytique sur une base de démonstration
import sqlite3

conn = sqlite3.connect(":memory:")
conn.executescript("""
    CREATE TABLE clients (id INTEGER PRIMARY KEY, nom TEXT, ville TEXT);
    CREATE TABLE commandes (
        id INTEGER PRIMARY KEY, client_id INTEGER REFERENCES clients(id),
        montant REAL, jour TEXT);
    INSERT INTO clients VALUES
        (1,'Ada','Lyon'),(2,'Grace','Paris'),(3,'Linus','Lyon'),(4,'Tim','Paris');
    INSERT INTO commandes VALUES
        (1,1,120.0,'2026-01-05'),(2,1,80.0,'2026-01-12'),(3,2,200.0,'2026-01-08'),
        (4,3,40.0,'2026-01-09'),(5,3,310.0,'2026-01-15'),(6,2,90.0,'2026-01-20'),
        (7,4,55.0,'2026-01-21');
""")

print("=== 1) JOIN : qui a commandé quoi ===")
for r in conn.execute("""
    SELECT cl.nom, cl.ville, co.montant
    FROM commandes AS co
    JOIN clients   AS cl ON cl.id = co.client_id
    ORDER BY co.jour
"""):
    print(r)

print()
print("=== 2) GROUP BY + HAVING : villes à plus de 300 € de CA ===")
for r in conn.execute("""
    SELECT cl.ville, COUNT(*) AS nb, ROUND(SUM(co.montant), 2) AS ca
    FROM commandes co
    JOIN clients cl ON cl.id = co.client_id
    GROUP BY cl.ville
    HAVING SUM(co.montant) > 300        -- filtre APRÈS agrégation
    ORDER BY ca DESC
"""):
    print(r)

print()
print("=== 3) CTE + fenêtre : le meilleur client de chaque ville ===")
for r in conn.execute("""
    WITH ca_client AS (                  -- étape 1, nommée et lisible
        SELECT cl.ville, cl.nom, SUM(co.montant) AS ca
        FROM commandes co
        JOIN clients cl ON cl.id = co.client_id
        GROUP BY cl.ville, cl.nom
    )
    SELECT ville, nom, ca,
           RANK() OVER (PARTITION BY ville ORDER BY ca DESC) AS rang
    FROM ca_client
    ORDER BY ville, rang
"""):
    print(r)

print()
print("Le RANK() OVER (PARTITION BY ...) répond en une requête à la question")
print("« top N par groupe », impossible avec un simple GROUP BY.")`,
      },
      {
        label: 'LEFT JOIN ET PIÈGES',
        code: `# Le piège le plus fréquent en entretien comme en production :
# INNER JOIN fait disparaître silencieusement des lignes.
import sqlite3

conn = sqlite3.connect(":memory:")
conn.executescript("""
    CREATE TABLE clients (id INTEGER PRIMARY KEY, nom TEXT);
    CREATE TABLE commandes (id INTEGER PRIMARY KEY, client_id INTEGER, montant REAL);
    INSERT INTO clients VALUES (1,'Ada'),(2,'Grace'),(3,'Linus');
    INSERT INTO commandes VALUES (1,1,120.0),(2,1,80.0),(3,2,200.0);
    -- Linus n'a jamais commandé
""")

print("INNER JOIN : Linus disparaît")
for r in conn.execute("""
    SELECT cl.nom, COUNT(co.id) AS nb
    FROM clients cl JOIN commandes co ON co.client_id = cl.id
    GROUP BY cl.nom
"""):
    print(" ", r)

print()
print("LEFT JOIN : tous les clients, même sans commande")
for r in conn.execute("""
    SELECT cl.nom, COUNT(co.id) AS nb, COALESCE(SUM(co.montant), 0) AS ca
    FROM clients cl LEFT JOIN commandes co ON co.client_id = cl.id
    GROUP BY cl.nom
    ORDER BY ca DESC
"""):
    print(" ", r)

print()
print("Deux réflexes : COUNT(co.id) et pas COUNT(*) (sinon Linus compte 1),")
print("et COALESCE pour transformer le NULL du LEFT JOIN en 0.")
print()
print("Question à se poser à chaque jointure : « est-ce que je veux")
print("perdre les lignes sans correspondance ? ». Si non : LEFT JOIN.")`,
      },
    ],
  },

  {
    id: 'modelisation',
    section: 'SQL et bases de données',
    titre: 'Modéliser : de MERISE au schéma SQL',
    competences: 'C11',
    contexte: 'Modélisation de la structure des données de la base de données selon la méthode MERISE : MCD, MLD, puis création dans le SGBD.',
    objectif: 'Dérouler la chaîne complète : entités et associations (MCD), traduction en tables et clés étrangères (MLD), puis le CREATE TABLE qui fait respecter le modèle par la base elle-même.',
    idee: 'Le MCD dit le métier : un CLIENT passe des COMMANDES, une COMMANDE contient des PRODUITS. Les cardinalités (1,N et N,N) déterminent mécaniquement le MLD : une association N,N devient une table de liaison avec une clé composée. La base devient alors le gardien du modèle : clés étrangères et contraintes refusent les données incohérentes.',
    retenir: 'La règle de passage à connaître par cœur : association 1,N, la clé migre côté N ; association N,N, table de liaison avec les deux clés. Et activez toujours les clés étrangères : une base sans contraintes est un dossier de fichiers qui s\'ignore.',
    variantes: [
      {
        label: 'SNIPPET',
        code: `# MCD (en commentaire) -> MLD -> SQL, et la base qui défend le modèle
import sqlite3

# MCD :
#   CLIENT (1,N) --- passer --- (1,1) COMMANDE
#   COMMANDE (1,N) --- contenir --- (0,N) PRODUIT   [avec quantité]
#
# MLD (règles de passage) :
#   passer (1,N / 1,1)  -> client_id migre dans commandes
#   contenir (N,N)      -> table de liaison lignes_commande(commande, produit)

conn = sqlite3.connect(":memory:")
conn.execute("PRAGMA foreign_keys = ON")     # indispensable en sqlite !
conn.executescript("""
    CREATE TABLE clients (
        id    INTEGER PRIMARY KEY,
        nom   TEXT NOT NULL
    );
    CREATE TABLE produits (
        id    INTEGER PRIMARY KEY,
        nom   TEXT NOT NULL,
        prix  REAL NOT NULL CHECK (prix >= 0)
    );
    CREATE TABLE commandes (
        id        INTEGER PRIMARY KEY,
        client_id INTEGER NOT NULL REFERENCES clients(id),
        jour      TEXT NOT NULL
    );
    CREATE TABLE lignes_commande (        -- l'association N,N devenue table
        commande_id INTEGER NOT NULL REFERENCES commandes(id),
        produit_id  INTEGER NOT NULL REFERENCES produits(id),
        quantite    INTEGER NOT NULL CHECK (quantite > 0),
        PRIMARY KEY (commande_id, produit_id)
    );
""")

conn.executescript("""
    INSERT INTO clients VALUES (1, 'Ada');
    INSERT INTO produits VALUES (1, 'clavier', 49.90), (2, 'souris', 19.90);
    INSERT INTO commandes VALUES (10, 1, '2026-01-05');
    INSERT INTO lignes_commande VALUES (10, 1, 2), (10, 2, 1);
""")

print("total de la commande 10 :")
for r in conn.execute("""
    SELECT c.id, cl.nom, ROUND(SUM(l.quantite * p.prix), 2) AS total
    FROM commandes c
    JOIN clients cl ON cl.id = c.client_id
    JOIN lignes_commande l ON l.commande_id = c.id
    JOIN produits p ON p.id = l.produit_id
    GROUP BY c.id, cl.nom
"""):
    print(" ", r)

# la base refuse une commande d'un client qui n'existe pas
print()
try:
    conn.execute("INSERT INTO commandes VALUES (11, 999, '2026-01-06')")
except sqlite3.IntegrityError as e:
    print("refusé par la clé étrangère :", e)
print("Le modèle n'est pas un dessin : la base le fait respecter.")`,
      },
      {
        label: 'DDL POSTGRESQL',
        runnable: false,
        code: `-- Le même MLD en PostgreSQL, avec les types et outils de production

CREATE TABLE clients (
    id      BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nom     TEXT NOT NULL,
    email   TEXT UNIQUE,
    cree_le TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE produits (
    id   BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nom  TEXT NOT NULL,
    prix NUMERIC(10, 2) NOT NULL CHECK (prix >= 0)
    -- NUMERIC pour l'argent : jamais de FLOAT (arrondis binaires)
);

CREATE TABLE commandes (
    id        BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    client_id BIGINT NOT NULL REFERENCES clients (id),
    jour      DATE NOT NULL
);

CREATE TABLE lignes_commande (
    commande_id BIGINT NOT NULL REFERENCES commandes (id) ON DELETE CASCADE,
    produit_id  BIGINT NOT NULL REFERENCES produits (id),
    quantite    INTEGER NOT NULL CHECK (quantite > 0),
    PRIMARY KEY (commande_id, produit_id)
);

-- les index qui servent les jointures et les filtres fréquents
CREATE INDEX idx_commandes_client ON commandes (client_id);
CREATE INDEX idx_commandes_jour   ON commandes (jour);

-- ON DELETE CASCADE : supprimer une commande emporte ses lignes ;
-- à utiliser en conscience, jamais par défaut sur les données métier.`,
      },
    ],
  },

  {
    id: 'import-bdd',
    section: 'SQL et bases de données',
    titre: 'Script d\'import idempotent',
    competences: 'C10, C11',
    contexte: 'Programmation du script d\'import des données en base de données. Mise à jour du script d\'import suite aux évolutions.',
    objectif: 'Écrire l\'import qu\'on peut relancer dix fois sans créer dix fois les données : transaction, UPSERT, et contrôles avant/après.',
    idee: 'Un import de production a trois propriétés : il est transactionnel (tout ou rien), idempotent (le relancer ne duplique rien, grâce à ON CONFLICT), et il rend des comptes (combien de lignes lues, insérées, mises à jour, rejetées).',
    retenir: 'L\'idempotence n\'est pas un luxe : c\'est ce qui permet de relancer sereinement après un plantage à la ligne 80 000. La clé naturelle déclarée UNIQUE plus un ON CONFLICT DO UPDATE font tout le travail.',
    variantes: [
      {
        label: 'SNIPPET',
        code: `# Import CSV -> base : transactionnel, idempotent, qui rend des comptes
import csv
import io
import sqlite3

CSV = """ref;nom;prix
K-100;clavier;49.90
S-200;souris;19.90
E-300;ecran;179.00
K-100;clavier mécanique;89.90
X-999;produit douteux;pas_un_prix
"""

conn = sqlite3.connect(":memory:")
conn.execute("""
    CREATE TABLE produits (
        ref  TEXT PRIMARY KEY,      -- la clé naturelle qui rend l'import idempotent
        nom  TEXT NOT NULL,
        prix REAL NOT NULL
    )
""")

def importer(contenu_csv):
    lus = inserts = rejets = 0
    rejetes = []
    with conn:                       # transaction : tout ou rien
        for ligne in csv.DictReader(io.StringIO(contenu_csv), delimiter=";"):
            lus += 1
            try:
                prix = float(ligne["prix"])
            except ValueError:
                rejets += 1
                rejetes.append((ligne["ref"], "prix invalide : " + ligne["prix"]))
                continue
            # UPSERT : insère, ou met à jour si la ref existe déjà
            conn.execute("""
                INSERT INTO produits (ref, nom, prix) VALUES (?, ?, ?)
                ON CONFLICT(ref) DO UPDATE SET nom = excluded.nom,
                                               prix = excluded.prix
            """, (ligne["ref"], ligne["nom"], prix))
            inserts += 1
    return lus, inserts, rejets, rejetes

for tentative in (1, 2):             # on lance DEUX fois : même résultat
    lus, ok, rejets, rejetes = importer(CSV)
    total = conn.execute("SELECT COUNT(*) FROM produits").fetchone()[0]
    print(f"run {tentative} : {lus} lus, {ok} upserts, {rejets} rejets"
          f" -> {total} lignes en base")

print()
print("contenu final (le doublon K-100 a mis à jour, pas dupliqué) :")
for r in conn.execute("SELECT * FROM produits ORDER BY ref"):
    print(" ", r)

print()
print("rejets à examiner :")
for ref, motif in rejetes:
    print(" ", ref, ":", motif)`,
      },
    ],
  },

  {
    id: 'etoile',
    section: 'Entrepôt de données',
    titre: 'Le schéma en étoile : faits et dimensions',
    competences: 'C13, C14',
    contexte: 'Production des schémas des structures de données en faits et dimensions selon les besoins d\'analyse. Modélisation en étoile.',
    objectif: 'Construire un vrai mini data warehouse : une table de faits (les ventes, au grain ligne de ticket) entourée de ses dimensions (date, produit, magasin), puis l\'interroger comme un analyste.',
    idee: 'La table de faits ne contient que des mesures (quantité, montant) et des clés vers les dimensions. Les dimensions portent les axes d\'analyse en clair (mois, famille de produit, région) et sont volontairement dénormalisées : on optimise pour la lecture, pas pour l\'écriture. C\'est l\'inverse exact du modèle OLTP normalisé.',
    retenir: 'La première décision, la plus importante : le grain de la table de faits (ici, une ligne = un produit dans un ticket). Tout le reste en découle. Et les clés des dimensions sont des clés de substitution (entiers techniques), pas les codes métier qui changent au gré des refontes.',
    variantes: [
      {
        label: 'SNIPPET',
        code: `# Un mini data warehouse en étoile, qui répond comme un analyste
import sqlite3

conn = sqlite3.connect(":memory:")
conn.executescript("""
    -- DIMENSIONS : les axes d'analyse, dénormalisés exprès
    CREATE TABLE dim_date (
        date_id INTEGER PRIMARY KEY,   -- format AAAAMMJJ
        jour TEXT, mois TEXT, trimestre TEXT, annee INTEGER
    );
    CREATE TABLE dim_produit (
        produit_id INTEGER PRIMARY KEY,
        code TEXT, nom TEXT, famille TEXT
    );
    CREATE TABLE dim_magasin (
        magasin_id INTEGER PRIMARY KEY,
        nom TEXT, ville TEXT, region TEXT
    );
    -- FAITS : que des clés et des mesures.
    -- Grain : une ligne = un produit dans un ticket.
    CREATE TABLE fait_ventes (
        date_id INTEGER REFERENCES dim_date(date_id),
        produit_id INTEGER REFERENCES dim_produit(produit_id),
        magasin_id INTEGER REFERENCES dim_magasin(magasin_id),
        quantite INTEGER, montant REAL
    );

    INSERT INTO dim_date VALUES
        (20260105,'2026-01-05','2026-01','2026-T1',2026),
        (20260112,'2026-01-12','2026-01','2026-T1',2026),
        (20260203,'2026-02-03','2026-02','2026-T1',2026);
    INSERT INTO dim_produit VALUES
        (1,'K-100','clavier','peripheriques'),
        (2,'S-200','souris','peripheriques'),
        (3,'E-300','ecran','affichage');
    INSERT INTO dim_magasin VALUES
        (1,'Part-Dieu','Lyon','AURA'), (2,'Bellecour','Lyon','AURA'),
        (3,'Rivoli','Paris','IDF');
    INSERT INTO fait_ventes VALUES
        (20260105,1,1,3,149.70), (20260105,2,1,5,99.50),
        (20260112,3,2,2,358.00), (20260112,1,3,1,49.90),
        (20260203,3,3,4,716.00), (20260203,2,2,10,199.00);
""")

print("=== CA par mois et par famille (le classique du reporting) ===")
for r in conn.execute("""
    SELECT d.mois, p.famille, ROUND(SUM(f.montant), 2) AS ca
    FROM fait_ventes f
    JOIN dim_date d    ON d.date_id = f.date_id
    JOIN dim_produit p ON p.produit_id = f.produit_id
    GROUP BY d.mois, p.famille
    ORDER BY d.mois, ca DESC
"""):
    print(" ", r)

print()
print("=== drill-down : la région AURA, magasin par magasin ===")
for r in conn.execute("""
    SELECT m.nom, m.ville, ROUND(SUM(f.montant), 2) AS ca
    FROM fait_ventes f
    JOIN dim_magasin m ON m.magasin_id = f.magasin_id
    WHERE m.region = 'AURA'
    GROUP BY m.nom, m.ville
    ORDER BY ca DESC
"""):
    print(" ", r)

print()
print("Toutes les questions du métier deviennent le même motif :")
print("JOIN sur les dimensions, GROUP BY sur les axes, SUM sur les mesures.")`,
      },
    ],
  },

  {
    id: 'etl-pipeline',
    section: 'Entrepôt de données',
    titre: 'Un ETL complet : extract, transform, load',
    competences: 'C10, C15',
    contexte: 'Intégrer les ETL nécessaires en entrée et en sortie d\'un entrepôt de données. Mise à jour de la procédure d\'ETL vers un datamart.',
    objectif: 'La chaîne complète et rejouable : extraire de la base opérationnelle (OLTP), transformer vers le modèle en étoile, charger dans l\'entrepôt, avec journal de bord et idempotence par période.',
    idee: 'Chaque étape est une fonction qui loggue ce qu\'elle fait. Le load commence par effacer la période rechargée (DELETE puis INSERT) : c\'est le moyen le plus simple d\'être idempotent par partition de date. Relancer le pipeline du jour ne double jamais les chiffres.',
    retenir: 'Le logging n\'est pas du décor : en production, c\'est la seule fenêtre sur un pipeline qui tourne à 3 h du matin. Notez le motif delete-insert par période : c\'est lui qu\'on retrouve, industrialisé, dans les partitions de BigQuery ou les incremental models de dbt.',
    variantes: [
      {
        label: 'SNIPPET',
        code: `# ETL rejouable : OLTP -> transformation -> entrepôt
import sqlite3
import sys
import logging

# par défaut logging écrit sur stderr ; ici on choisit stdout pour l'affichage
logging.basicConfig(level=logging.INFO, format="%(levelname)s  %(message)s",
                    stream=sys.stdout)
log = logging.getLogger("etl")

# --- la base opérationnelle (source, normalisée) -------------------
src = sqlite3.connect(":memory:")
src.executescript("""
    CREATE TABLE commandes (id INTEGER, client TEXT, produit TEXT,
                            quantite INTEGER, pu REAL, jour TEXT);
    INSERT INTO commandes VALUES
        (1,'Ada','clavier',3,49.90,'2026-01-05'),
        (2,'Linus','souris',5,19.90,'2026-01-05'),
        (3,'Grace','ecran',1,179.00,'2026-01-06'),
        (4,'Ada','souris',2,19.90,'2026-01-06');
""")

# --- l'entrepôt (cible, en étoile simplifiée) -----------------------
dwh = sqlite3.connect(":memory:")
dwh.execute("""CREATE TABLE fait_ventes_jour (
    jour TEXT, produit TEXT, quantite INTEGER, ca REAL)""")

def extract(jour):
    lignes = src.execute(
        "SELECT produit, quantite, pu FROM commandes WHERE jour = ?",
        (jour,)).fetchall()
    log.info(f"extract  : {len(lignes)} lignes pour le {jour}")
    return lignes

def transform(jour, lignes):
    agrege = {}
    for produit, quantite, pu in lignes:
        qte, ca = agrege.get(produit, (0, 0.0))
        agrege[produit] = (qte + quantite, ca + quantite * pu)
    resultat = [(jour, p, q, round(ca, 2)) for p, (q, ca) in agrege.items()]
    log.info(f"transform: {len(resultat)} agrégats produit")
    return resultat

def load(jour, agregats):
    with dwh:
        # idempotence : on efface la période avant de la recharger
        efface = dwh.execute(
            "DELETE FROM fait_ventes_jour WHERE jour = ?", (jour,)).rowcount
        dwh.executemany(
            "INSERT INTO fait_ventes_jour VALUES (?, ?, ?, ?)", agregats)
    log.info(f"load     : {efface} effacées, {len(agregats)} chargées")

def pipeline(jour):
    log.info(f"=== pipeline du {jour} ===")
    load(jour, transform(jour, extract(jour)))

pipeline("2026-01-05")
pipeline("2026-01-06")
pipeline("2026-01-06")      # relance volontaire : aucun doublon

print()
print("contenu de l'entrepôt :")
for r in dwh.execute("SELECT * FROM fait_ventes_jour ORDER BY jour, produit"):
    print(" ", r)`,
      },
      {
        label: 'ELT MODERNE',
        runnable: false,
        code: `-- La variante ELT : on charge le brut, on transforme DANS l'entrepôt.
-- C'est le monde dbt : chaque transformation est un modèle SQL versionné.

-- models/staging/stg_commandes.sql
--   (nettoyage léger, typage, renommage : la couche « staging »)
SELECT
    id              AS commande_id,
    LOWER(client)   AS client,
    produit,
    quantite,
    pu              AS prix_unitaire,
    CAST(jour AS DATE) AS jour
FROM {{ source('oltp', 'commandes') }}

-- models/marts/fait_ventes_jour.sql
--   (l'agrégat métier, matérialisé en incrémental par jour)
{{ config(materialized='incremental', unique_key=['jour', 'produit']) }}
SELECT
    jour,
    produit,
    SUM(quantite)                  AS quantite,
    ROUND(SUM(quantite * prix_unitaire), 2) AS ca
FROM {{ ref('stg_commandes') }}
{% if is_incremental() %}
WHERE jour >= (SELECT MAX(jour) FROM {{ this }})
{% endif %}
GROUP BY jour, produit

-- Même logique que l'onglet exécutable : extraction, agrégation,
-- idempotence par période. dbt ajoute : versionnement, tests (schema.yml),
-- documentation et graphe de dépendances automatique entre modèles.`,
      },
    ],
  },

  {
    id: 'scd',
    section: 'Entrepôt de données',
    titre: 'Dimensions à variation lente (SCD)',
    competences: 'C17',
    contexte: 'Implémenter des variations dans les dimensions de l\'entrepôt de données afin d\'historiser les évolutions de l\'activité.',
    objectif: 'Un client déménage de Lyon à Paris : faut-il réécrire l\'histoire (SCD type 1) ou la conserver (SCD type 2) ? Implémenter les deux et voir la différence dans les chiffres.',
    idee: 'SCD type 1 : UPDATE, simple mais le passé est réécrit, les ventes 2025 de ce client deviennent des ventes « Paris ». SCD type 2 : on ferme la ligne courante (date de fin) et on en insère une nouvelle ; chaque fait pointe vers la version de la dimension valide à sa date. L\'histoire est préservée.',
    retenir: 'Le choix type 1 ou type 2 est une décision métier par attribut : une faute de frappe corrigée mérite un type 1, un déménagement ou un changement de segment mérite un type 2. Les trois colonnes du type 2 (valide_de, valide_a, courant) sont un standard à connaître par cœur.',
    variantes: [
      {
        label: 'SNIPPET',
        code: `# SCD type 2 : historiser un déménagement sans réécrire le passé
import sqlite3

conn = sqlite3.connect(":memory:")
conn.executescript("""
    CREATE TABLE dim_client (
        sk INTEGER PRIMARY KEY,          -- clé de substitution (technique)
        code TEXT,                       -- clé métier, stable
        nom TEXT, ville TEXT,
        valide_de TEXT, valide_a TEXT,   -- période de validité
        courant INTEGER                  -- 1 = version actuelle
    );
    INSERT INTO dim_client VALUES
        (1, 'C-001', 'Ada', 'Lyon', '2024-01-01', '9999-12-31', 1);

    CREATE TABLE fait_ventes (client_sk INTEGER, jour TEXT, montant REAL);
    INSERT INTO fait_ventes VALUES (1, '2025-06-10', 120.0);  -- vendu à Lyon
""")

def demenagement_scd2(code, nouvelle_ville, jour):
    """Ferme la version courante, ouvre la nouvelle."""
    with conn:
        ancienne = conn.execute(
            "SELECT sk, nom FROM dim_client WHERE code = ? AND courant = 1",
            (code,)).fetchone()
        conn.execute("""UPDATE dim_client
                        SET valide_a = ?, courant = 0 WHERE sk = ?""",
                     (jour, ancienne[0]))
        conn.execute("""INSERT INTO dim_client
                        (code, nom, ville, valide_de, valide_a, courant)
                        VALUES (?, ?, ?, ?, '9999-12-31', 1)""",
                     (code, ancienne[1], nouvelle_ville, jour))

demenagement_scd2("C-001", "Paris", "2026-01-01")

# une vente après le déménagement pointe vers la NOUVELLE version
sk_courant = conn.execute(
    "SELECT sk FROM dim_client WHERE code = 'C-001' AND courant = 1"
).fetchone()[0]
conn.execute("INSERT INTO fait_ventes VALUES (?, '2026-02-15', 200.0)",
             (sk_courant,))

print("la dimension, avec son histoire :")
for r in conn.execute("SELECT * FROM dim_client ORDER BY valide_de"):
    print(" ", r)

print()
print("CA par ville : le passé reste à Lyon, le présent est à Paris")
for r in conn.execute("""
    SELECT d.ville, SUM(f.montant) AS ca
    FROM fait_ventes f JOIN dim_client d ON d.sk = f.client_sk
    GROUP BY d.ville
"""):
    print(" ", r)

print()
print("En SCD type 1 (un simple UPDATE de la ville), les 120 € de 2025")
print("auraient été comptés à Paris : l'histoire aurait été réécrite.")`,
      },
    ],
  },
];
