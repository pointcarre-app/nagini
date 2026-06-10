/**
 * Snippets data engineering : SQL avancé et entrepôt, niveau semaine 04.
 * Transactions, index et EXPLAIN, fonctions de fenêtre, vues, triggers,
 * normalisation, pandas vers SQL, surrogate keys, requêtes OLAP.
 */

export const SQL_AVANCE = [
  {
    id: 'sql-transactions',
    section: 'SQL et bases de données',
    titre: 'Transactions : tout ou rien',
    competences: 'C11, C15',
    contexte: 'Transactions atomiques (BEGIN/COMMIT/ROLLBACK) : un chargement interrompu ne doit jamais laisser la base à moitié modifiée.',
    objectif: 'Voir une transaction protéger réellement les données : un transfert qui échoue au milieu est annulé en entier, la base reste cohérente.',
    idee: 'Une transaction regroupe plusieurs écritures en une opération indivisible : soit tout est validé (COMMIT), soit tout est annulé (ROLLBACK). En Python, le bloc with conn fait le commit en sortie normale et le rollback si une exception traverse le bloc.',
    retenir: 'La question test : « si le script meurt à la ligne 3 sur 5, dans quel état est la base ? ». Avec une transaction, la réponse est toujours : dans l\'état d\'avant. Tout chargement multi-tables (dimensions puis faits) se fait dans une transaction.',
    variantes: [
      {
        label: 'SNIPPET',
        code: `# Le transfert bancaire : l'exemple canonique de l'atomicité
import sqlite3

conn = sqlite3.connect(":memory:")
conn.executescript("""
    CREATE TABLE comptes (
        nom TEXT PRIMARY KEY,
        solde REAL NOT NULL CHECK (solde >= 0)   -- jamais à découvert
    );
    INSERT INTO comptes VALUES ('ada', 100.0), ('grace', 50.0);
""")

def soldes():
    return dict(conn.execute("SELECT nom, solde FROM comptes"))

def transferer(de, vers, montant):
    """Deux UPDATE indivisibles : le with ouvre une transaction."""
    with conn:                                   # commit si OK, rollback sinon
        conn.execute("UPDATE comptes SET solde = solde - ? WHERE nom = ?",
                     (montant, de))
        # si la ligne ci-dessus a violé le CHECK, on n'arrive jamais ici
        conn.execute("UPDATE comptes SET solde = solde + ? WHERE nom = ?",
                     (montant, vers))

print("départ          :", soldes())

transferer("ada", "grace", 30)
print("après 30 € OK   :", soldes())

# transfert impossible : ada n'a pas 500 €, le CHECK refuse
try:
    transferer("ada", "grace", 500)
except sqlite3.IntegrityError as e:
    print("refusé          :", e)

print("après échec     :", soldes())
print()
print("L'échec n'a RIEN modifié : pas de débit sans crédit, pas d'argent")
print("évaporé. Sans transaction, le premier UPDATE serait resté seul.")
print()
print("Même logique pour un chargement d'entrepôt : dimensions et faits")
print("dans la même transaction, ou rien du tout.")`,
      },
    ],
  },

  {
    id: 'sql-index-explain',
    section: 'SQL et bases de données',
    titre: 'Index et EXPLAIN : pourquoi c\'est lent',
    competences: 'C9, C16',
    contexte: 'Indexes et EXPLAIN ANALYZE : diagnostiquer une requête lente, poser le bon index, mesurer le gain.',
    objectif: 'Mesurer sur 100 000 lignes ce qu\'un index change vraiment, et lire le plan d\'exécution qui dit si la base balaie tout (SCAN) ou vise juste (SEARCH).',
    idee: 'Sans index, chaque WHERE force un parcours complet de la table. Un index est un annuaire trié sur une colonne : la base y trouve directement les lignes. EXPLAIN montre le plan choisi avant d\'exécuter : c\'est l\'outil de diagnostic numéro un.',
    retenir: 'On indexe les colonnes des WHERE et des JOIN fréquents, pas tout : chaque index ralentit les écritures et occupe de l\'espace. Le réflexe face à une requête lente : EXPLAIN d\'abord, index ensuite, mesure après. En PostgreSQL : EXPLAIN ANALYZE donne aussi les temps réels.',
    variantes: [
      {
        label: 'SNIPPET',
        code: `# 100 000 lignes : la même requête avec et sans index, chronométrée
import sqlite3
import time

conn = sqlite3.connect(":memory:")
conn.execute("""CREATE TABLE mesures (
    id INTEGER PRIMARY KEY, capteur INTEGER, valeur REAL)""")

N = 100_000
conn.executemany(
    "INSERT INTO mesures (capteur, valeur) VALUES (?, ?)",
    ((i % 500, (i * 37) % 1000 / 10) for i in range(N)))
conn.commit()

REQUETE = "SELECT COUNT(*), AVG(valeur) FROM mesures WHERE capteur = 42"

def chronometre(fois=200):
    debut = time.perf_counter()
    for _ in range(fois):
        conn.execute(REQUETE).fetchone()
    return (time.perf_counter() - debut) / fois * 1000   # ms par requête

# --- sans index : la base balaie tout --------------------------------
plan = conn.execute("EXPLAIN QUERY PLAN " + REQUETE).fetchall()
print("plan sans index :", plan[0][3])
t_sans = chronometre()
print(f"temps moyen     : {t_sans:.3f} ms")

# --- avec index : la base vise juste ----------------------------------
conn.execute("CREATE INDEX idx_mesures_capteur ON mesures (capteur)")
plan = conn.execute("EXPLAIN QUERY PLAN " + REQUETE).fetchall()
print()
print("plan avec index :", plan[0][3])
t_avec = chronometre()
print(f"temps moyen     : {t_avec:.3f} ms")

print()
print(f"gain : x{t_sans / t_avec:.0f} sur {N:,} lignes."
      " Sur des millions de lignes, c'est la différence entre")
print("une requête instantanée et un tableau de bord qui rame.")
print()
print("En PostgreSQL : EXPLAIN ANALYZE SELECT ... donne le plan ET les")
print("temps réels de chaque étape (Seq Scan contre Index Scan).")`,
      },
    ],
  },

  {
    id: 'sql-fenetres',
    section: 'SQL et bases de données',
    titre: 'Fonctions de fenêtre : LAG, cumuls, moyennes mobiles',
    competences: 'C9',
    contexte: 'Window functions (ROW_NUMBER, LAG, LEAD) : analyser sans agréger, garder les lignes détaillées tout en calculant sur des groupes.',
    objectif: 'Les calculs analytiques que GROUP BY ne sait pas faire : comparer chaque jour au précédent, cumuler depuis le début, lisser sur trois jours.',
    idee: 'Une fonction de fenêtre calcule sur un ensemble de lignes (la fenêtre) sans les fusionner : chaque ligne garde son détail et reçoit le résultat. OVER (ORDER BY ...) définit l\'ordre, ROWS BETWEEN délimite la fenêtre glissante, PARTITION BY redémarre le calcul par groupe.',
    retenir: 'GROUP BY fusionne les lignes, OVER les conserve : c\'est LA distinction. LAG/LEAD pour comparer au voisin, SUM OVER pour les cumuls, AVG OVER ROWS BETWEEN pour les moyennes mobiles : ces trois motifs couvrent l\'essentiel du reporting temporel.',
    variantes: [
      {
        label: 'SNIPPET',
        code: `# Le chiffre d'affaires quotidien sous toutes ses coutures
import sqlite3

conn = sqlite3.connect(":memory:")
conn.executescript("""
    CREATE TABLE ca_jour (jour TEXT PRIMARY KEY, ca REAL);
    INSERT INTO ca_jour VALUES
        ('2026-01-05', 120), ('2026-01-06', 150), ('2026-01-07',  90),
        ('2026-01-08', 200), ('2026-01-09', 170), ('2026-01-10', 210),
        ('2026-01-11',  60);
""")

print("jour        ca   veille  variation  cumul   moy.mobile(3j)")
for r in conn.execute("""
    SELECT jour, ca,
           LAG(ca) OVER w                                   AS veille,
           ca - LAG(ca) OVER w                              AS variation,
           SUM(ca) OVER (ORDER BY jour)                     AS cumul,
           ROUND(AVG(ca) OVER (ORDER BY jour
                 ROWS BETWEEN 2 PRECEDING AND CURRENT ROW), 1) AS mobile
    FROM ca_jour
    WINDOW w AS (ORDER BY jour)
    ORDER BY jour
"""):
    jour, ca, veille, var, cumul, mobile = r
    fleche = "" if var is None else ("+" if var >= 0 else "")
    print(f"{jour}  {ca:>4.0f}   {veille if veille else '':>5}"
          f"   {fleche}{var if var is not None else '':>6}"
          f"   {cumul:>5.0f}   {mobile:>6}")

print()
print("Chaque ligne garde son détail ET reçoit ses calculs de fenêtre :")
print("LAG (la veille), le cumul depuis le début, la moyenne lissée 3 jours.")
print()

# sous-totaux : SQLite n'a pas ROLLUP, on l'émule avec UNION ALL
print("=== sous-totaux par semaine + total (ROLLUP émulé) ===")
for r in conn.execute("""
    SELECT strftime('%W', jour) AS semaine, SUM(ca) AS ca FROM ca_jour
    GROUP BY semaine
    UNION ALL
    SELECT 'TOTAL', SUM(ca) FROM ca_jour
"""):
    print(" ", r)`,
      },
      {
        label: 'POSTGRESQL',
        runnable: false,
        code: `-- En PostgreSQL, les sous-totaux hiérarchiques sont natifs : ROLLUP

-- CA par région, département, et tous les sous-totaux, en UNE requête
SELECT
    region,
    departement,
    SUM(ca) AS ca
FROM ventes
GROUP BY ROLLUP (region, departement)
ORDER BY region NULLS LAST, departement NULLS LAST;
-- les lignes où departement IS NULL sont les sous-totaux de région,
-- la ligne où tout est NULL est le total général

-- GROUPING SETS : choisir exactement les combinaisons voulues
SELECT region, type_produit, SUM(ca)
FROM ventes
GROUP BY GROUPING SETS ((region), (type_produit), ());

-- et les fenêtres avancées du reporting
SELECT
    jour,
    ca,
    RANK()        OVER (ORDER BY ca DESC)          AS rang_du_jour,
    NTILE(4)      OVER (ORDER BY ca)               AS quartile,
    FIRST_VALUE(ca) OVER (PARTITION BY date_trunc('month', jour)
                          ORDER BY jour)           AS ca_debut_de_mois
FROM ca_jour;`,
      },
    ],
  },

  {
    id: 'sql-vues',
    section: 'SQL et bases de données',
    titre: 'Vues et vues matérialisées',
    competences: 'C9, C16',
    contexte: 'Vue : requête nommée, recalculée à chaque lecture. Vue matérialisée : résultat stocké, figé jusqu\'au REFRESH. Aussi un outil de droits.',
    objectif: 'Comprendre par l\'exemple la différence vue / vue matérialisée : l\'une est toujours à jour, l\'autre est rapide mais périmable.',
    idee: 'Une vue est une requête à laquelle on a donné un nom de table : chaque lecture la ré-exécute. Une vue matérialisée stocke le résultat : lecture instantanée, mais il faut la rafraîchir. Le choix : fraîcheur contre coût de lecture.',
    retenir: 'La vue sert aussi de contrat et de filtre de sécurité : on donne accès à v_contacts_prospectables (qui exclut les oppositions RGPD) sans jamais donner la table brute. En PostgreSQL : GRANT SELECT sur la vue, rien sur la table.',
    variantes: [
      {
        label: 'SNIPPET',
        code: `# Vue contre vue matérialisée : la fraîcheur en direct
import sqlite3

conn = sqlite3.connect(":memory:")
conn.executescript("""
    CREATE TABLE ventes (jour TEXT, produit TEXT, ca REAL);
    INSERT INTO ventes VALUES
        ('2026-01-05', 'clavier', 149.7), ('2026-01-05', 'souris', 99.5),
        ('2026-01-06', 'ecran', 358.0);
""")

# 1) la VUE : une requête nommée, toujours à jour
conn.execute("""
    CREATE VIEW v_ca_produit AS
    SELECT produit, ROUND(SUM(ca), 1) AS ca FROM ventes GROUP BY produit
""")

# 2) la "MATÉRIALISÉE" : résultat stocké (émulée ici par CREATE TABLE AS ;
#    native en PostgreSQL : CREATE MATERIALIZED VIEW)
conn.execute("""
    CREATE TABLE mat_ca_produit AS
    SELECT produit, ROUND(SUM(ca), 1) AS ca FROM ventes GROUP BY produit
""")

def afficher(titre):
    vue = conn.execute("SELECT * FROM v_ca_produit ORDER BY produit").fetchall()
    mat = conn.execute("SELECT * FROM mat_ca_produit ORDER BY produit").fetchall()
    print(f"{titre}")
    print("  vue (recalculée)   :", vue)
    print("  matérialisée       :", mat)

afficher("au départ : identiques")

# une vente arrive...
conn.execute("INSERT INTO ventes VALUES ('2026-01-07', 'clavier', 89.9)")
print()
afficher("après une nouvelle vente")
print("  -> la vue a bougé, la matérialisée est PÉRIMÉE")

# le REFRESH : on recalcule le stock
conn.execute("DELETE FROM mat_ca_produit")
conn.execute("""INSERT INTO mat_ca_produit
                SELECT produit, ROUND(SUM(ca), 1) FROM ventes GROUP BY produit""")
print()
afficher("après REFRESH de la matérialisée")
print()
print("Arbitrage : agrégat lourd lu cent fois par jour -> matérialisée +")
print("REFRESH en fin de pipeline ; filtre RGPD vivant -> vue simple.")`,
      },
    ],
  },

  {
    id: 'sql-triggers',
    section: 'SQL et bases de données',
    titre: 'Triggers : la base qui réagit toute seule',
    competences: 'C11, C16, C21',
    contexte: 'Triggers et fonctions : audit RGPD de la table contact, updated_at automatique, validation des règles métier en base.',
    objectif: 'Trois triggers du projet fil rouge, qui tournent ici pour de vrai : journaliser chaque écriture sensible (audit RGPD), horodater les modifications, refuser une donnée invalide.',
    idee: 'Un trigger attache du code à un événement (INSERT, UPDATE, DELETE) sur une table : la logique s\'exécute dans la base, quelle que soit l\'application qui écrit. NEW et OLD donnent accès à la ligne entrante et sortante ; RAISE(ABORT) bloque l\'opération.',
    retenir: 'Le réflexe d\'architecte : si une contrainte déclarative suffit (CHECK, UNIQUE, NOT NULL), pas de trigger. Le trigger est pour la logique (journaliser, propager, horodater), la contrainte pour la règle. Un trigger oublié qui fait de la magie est une dette : documentez-les.',
    variantes: [
      {
        label: 'SNIPPET',
        code: `# Trois triggers : audit RGPD, updated_at, validation
import sqlite3

conn = sqlite3.connect(":memory:")
conn.executescript("""
    CREATE TABLE contact (
        id INTEGER PRIMARY KEY, email TEXT, telephone TEXT,
        updated_at TEXT
    );
    CREATE TABLE journal_audit (
        ts TEXT DEFAULT (datetime('now')),
        operation TEXT, detail TEXT
    );

    -- 1) AUDIT RGPD : toute écriture sur contact laisse une trace
    CREATE TRIGGER trg_audit_insert AFTER INSERT ON contact
    BEGIN
        INSERT INTO journal_audit (operation, detail)
        VALUES ('INSERT', 'contact ' || NEW.id || ' : ' || NEW.email);
    END;
    CREATE TRIGGER trg_audit_delete AFTER DELETE ON contact
    BEGIN
        INSERT INTO journal_audit (operation, detail)
        VALUES ('DELETE', 'contact ' || OLD.id || ' : ' || OLD.email);
    END;

    -- 2) UPDATED_AT : personne n'a à y penser, la base s'en charge
    CREATE TRIGGER trg_updated_at AFTER UPDATE ON contact
    BEGIN
        UPDATE contact SET updated_at = datetime('now') WHERE id = NEW.id;
    END;

    -- 3) VALIDATION : un email sans @ ne rentre pas, point
    CREATE TRIGGER trg_email_valide BEFORE INSERT ON contact
    WHEN NEW.email NOT LIKE '%_@_%.__%'
    BEGIN
        SELECT RAISE(ABORT, 'email invalide');
    END;
""")

conn.execute("INSERT INTO contact (email, telephone) VALUES (?, ?)",
             ("ada@calc.uk", "0612345678"))
conn.execute("UPDATE contact SET telephone = ? WHERE email = ?",
             ("0698765432", "ada@calc.uk"))
conn.execute("DELETE FROM contact WHERE email = ?", ("ada@calc.uk",))

try:
    conn.execute("INSERT INTO contact (email) VALUES (?)", ("pas-un-email",))
except sqlite3.IntegrityError as e:
    print("insertion bloquée par le trigger :", e)

print()
print("journal d'audit (l'historique RGPD des accès en écriture) :")
for r in conn.execute("SELECT ts, operation, detail FROM journal_audit"):
    print(" ", r)
print()
print("L'application ne peut pas oublier d'auditer : c'est la base qui le fait.")`,
      },
      {
        label: 'PL/PGSQL',
        runnable: false,
        code: `-- Les mêmes triggers en PostgreSQL : une fonction + un trigger

-- 1) updated_at automatique
CREATE OR REPLACE FUNCTION maj_updated_at()
RETURNS trigger AS $$
BEGIN
    NEW.updated_at := now();      -- BEFORE : on modifie la ligne entrante
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_updated_at
BEFORE UPDATE ON dwh.dim_etablissement
FOR EACH ROW
EXECUTE FUNCTION maj_updated_at();

-- 2) audit RGPD : la ligne complète en JSON dans le journal
CREATE OR REPLACE FUNCTION audit_contact()
RETURNS trigger AS $$
BEGIN
    INSERT INTO journal_audit (table_cible, operation, detail)
    VALUES ('contact', TG_OP, to_jsonb(COALESCE(NEW, OLD)));
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_audit
AFTER INSERT OR UPDATE OR DELETE ON contact
FOR EACH ROW EXECUTE FUNCTION audit_contact();

-- 3) validation métier : bloquer avec un message clair
CREATE OR REPLACE FUNCTION valide_scd2()
RETURNS trigger AS $$
BEGIN
    IF NEW.date_fin IS NOT NULL AND NEW.date_fin <= NEW.date_debut THEN
        RAISE EXCEPTION 'version fermée avant d''être ouverte (%)',
                        NEW.code_metier;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- BEFORE pour modifier ou bloquer, AFTER pour constater et journaliser ;
-- TG_OP vaut 'INSERT', 'UPDATE' ou 'DELETE' dans la fonction.`,
      },
    ],
  },

  {
    id: 'normalisation',
    section: 'SQL et bases de données',
    titre: 'Normalisation : de la table fourre-tout à la 3NF',
    competences: 'C11',
    contexte: 'Formes normales et normalisation : éliminer la redondance qui produit des anomalies de mise à jour.',
    objectif: 'Partir d\'une table à plat pleine de redondance, constater l\'anomalie de mise à jour qu\'elle provoque, puis la décomposer en troisième forme normale.',
    idee: 'Dans la table à plat, l\'email d\'Ada est recopié sur chacune de ses commandes : corriger son email exige de retrouver toutes les copies, en oublier une crée une incohérence. La normalisation range chaque fait à un seul endroit : un client, une ligne dans clients. La 3NF en résumé : chaque colonne dépend de la clé, de toute la clé, et de rien que la clé.',
    retenir: 'La redondance n\'est pas un péché esthétique : c\'est une bombe à retardement d\'incohérences. On normalise l\'OLTP (écritures sûres) et on dénormalise l\'entrepôt (lectures rapides) : les deux choix sont justes, chacun chez soi.',
    variantes: [
      {
        label: 'SNIPPET',
        code: `# L'anomalie de mise à jour, puis la décomposition en 3NF
import sqlite3

conn = sqlite3.connect(":memory:")

# --- la table à plat (0NF dans l'esprit) ------------------------------
conn.executescript("""
    CREATE TABLE commandes_plat (
        commande INTEGER, client TEXT, email TEXT, produit TEXT, prix REAL
    );
    INSERT INTO commandes_plat VALUES
        (1, 'Ada', 'ada@calc.uk',  'clavier', 49.9),
        (2, 'Ada', 'ada@calc.uk',  'souris',  19.9),
        (3, 'Grace', 'grace@navy.mil', 'ecran', 179.0);
""")

# l'email d'Ada change ; on le corrige... en oubliant une ligne
conn.execute("""UPDATE commandes_plat SET email = 'ada@lovelace.uk'
                WHERE commande = 1""")
print("ANOMALIE : deux emails différents pour la même personne")
for r in conn.execute("""SELECT DISTINCT client, email FROM commandes_plat
                         WHERE client = 'Ada'"""):
    print(" ", r)

# --- la décomposition 3NF ---------------------------------------------
conn.executescript("""
    CREATE TABLE clients (
        id INTEGER PRIMARY KEY, nom TEXT, email TEXT UNIQUE);
    CREATE TABLE produits (
        id INTEGER PRIMARY KEY, nom TEXT UNIQUE, prix REAL);
    CREATE TABLE commandes (
        id INTEGER PRIMARY KEY,
        client_id INTEGER REFERENCES clients(id),
        produit_id INTEGER REFERENCES produits(id));

    INSERT INTO clients VALUES (1, 'Ada', 'ada@calc.uk'),
                               (2, 'Grace', 'grace@navy.mil');
    INSERT INTO produits VALUES (1, 'clavier', 49.9), (2, 'souris', 19.9),
                                (3, 'ecran', 179.0);
    INSERT INTO commandes VALUES (1, 1, 1), (2, 1, 2), (3, 2, 3);
""")

# corriger l'email : UNE ligne, UNE seule vérité
conn.execute("UPDATE clients SET email = 'ada@lovelace.uk' WHERE nom = 'Ada'")

print()
print("EN 3NF : la correction est faite partout d'un coup")
for r in conn.execute("""
    SELECT c.id, cl.nom, cl.email, p.nom, p.prix
    FROM commandes c
    JOIN clients cl ON cl.id = c.client_id
    JOIN produits p ON p.id = c.produit_id
"""):
    print(" ", r)
print()
print("Chaque fait vit à un seul endroit ; la jointure reconstruit la vue")
print("à plat quand on en a besoin. C'est tout l'esprit de la 3NF.")`,
      },
    ],
  },

  {
    id: 'pandas-sql',
    section: 'SQL et bases de données',
    titre: 'pandas et SQL : to_sql, read_sql',
    competences: 'C8, C10, C15',
    contexte: 'Connexion programmatique à un SGBD : pandas to_sql pour charger, read_sql pour extraire, le pont entre les deux mondes.',
    objectif: 'Faire circuler les données entre DataFrame et base dans les deux sens : charger un nettoyage pandas en base, ramener un agrégat SQL dans pandas pour l\'export.',
    idee: 'df.to_sql écrit un DataFrame en table (en créant ou remplaçant), pd.read_sql exécute une requête et rend un DataFrame. La bonne répartition du travail : SQL pour filtrer, joindre et agréger (la base est faite pour ça), pandas pour les transformations fines et les exports.',
    retenir: 'to_sql ne crée ni clés ni contraintes : c\'est un chargement, pas une modélisation ; le schéma se crée en SQL avant. Et toujours des requêtes paramétrées dans read_sql (params=), même depuis pandas : l\'injection SQL ne disparaît pas parce qu\'on passe par un DataFrame.',
    variantes: [
      {
        label: 'SNIPPET',
        code: `# L'aller-retour DataFrame <-> base
import io
import sqlite3
import pandas as pd

conn = sqlite3.connect(":memory:")

# 1) un nettoyage pandas... (cf. la section nettoyage)
brut = """jour;magasin;ca
2026-01-05;Lyon;149,70
2026-01-05;Paris;99,50
2026-01-06;Lyon;358,00
2026-01-06;Paris;49,90
2026-01-07;Lyon;89,90
"""
df = pd.read_csv(io.StringIO(brut), sep=";", decimal=",")

# 2) ... chargé en base d'un coup : to_sql
df.to_sql("ventes", conn, if_exists="replace", index=False)
n = conn.execute("SELECT COUNT(*) FROM ventes").fetchone()[0]
print(f"{n} lignes chargées dans la table ventes")

# 3) la base fait ce qu'elle fait le mieux : agréger, paramétré
agrege = pd.read_sql(
    """SELECT magasin, COUNT(*) AS nb, ROUND(SUM(ca), 2) AS ca_total
       FROM ventes
       WHERE jour >= ?
       GROUP BY magasin ORDER BY ca_total DESC""",
    conn,
    params=("2026-01-05",),       # paramètre : jamais de f-string ici non plus
)
print()
print(agrege.to_string(index=False))

# 4) pandas reprend la main pour la mise en forme finale
agrege["part"] = (agrege["ca_total"] / agrege["ca_total"].sum() * 100).round(1)
print()
print("avec la part de chaque magasin :")
print(agrege.to_string(index=False))
print()
print("Division du travail : SQL filtre, joint et agrège ;")
print("pandas transforme finement et exporte. Chacun son métier.")`,
      },
      {
        label: 'EN PRODUCTION',
        runnable: false,
        code: `# Vers PostgreSQL : SQLAlchemy fait le pont pour pandas
import os
import pandas as pd
from sqlalchemy import create_engine, text

engine = create_engine(os.environ["DATABASE_URL"])
# postgresql+psycopg://user:motdepasse@hote:5432/base

# chargement : par paquets, dans le schéma staging
df.to_sql(
    "ventes_brutes",
    engine,
    schema="staging",
    if_exists="append",
    index=False,
    chunksize=10_000,        # par paquets : la mémoire dit merci
    method="multi",          # INSERT multi-lignes : bien plus rapide
)

# extraction paramétrée
agrege = pd.read_sql(
    text("""SELECT magasin, SUM(ca) AS ca_total
            FROM dwh.fait_ventes
            WHERE jour >= :debut
            GROUP BY magasin"""),
    engine,
    params={"debut": "2026-01-01"},
)

# pour les gros volumes, COPY bat to_sql de très loin :
# avec psycopg :
#   with conn.cursor() as cur:
#       with cur.copy("COPY staging.ventes FROM STDIN WITH CSV") as copie:
#           copie.write(df.to_csv(index=False, header=False))
# c'est le chemin de chargement massif natif de PostgreSQL.`,
      },
    ],
  },

  {
    id: 'sk-lookup',
    section: 'Entrepôt de données',
    titre: 'Surrogate keys : le lookup et la table d\'écarts',
    competences: 'C13, C15',
    contexte: 'Chargement des faits : le fait arrive avec un code métier, on l\'enrichit en clé de substitution par jointure sur la dimension ; les écarts sont rejetés et comptés, jamais avalés en silence.',
    objectif: 'Le geste central du chargement d\'entrepôt : traduire le code métier du fait entrant en clé de substitution de la dimension, et mettre de côté, visiblement, tout ce qui ne se traduit pas.',
    idee: 'Les faits arrivent du monde réel avec des codes métier (UAI, SIRET, référence produit). L\'entrepôt, lui, joint sur des clés de substitution. Le lookup est un simple JOIN sur le code métier ; le LEFT JOIN ... IS NULL attrape les orphelins, qui partent dans une table d\'écarts avec leur motif.',
    retenir: 'La règle absolue : un fait sans dimension ne disparaît jamais en silence. Il est rejeté, compté, journalisé, et quelqu\'un regarde la table d\'écarts. Un pipeline qui avale 3 % des lignes sans le dire produit des chiffres faux ET la confiance avec.',
    variantes: [
      {
        label: 'SNIPPET',
        code: `# Lookup de surrogate key + table d'écarts
import sqlite3

conn = sqlite3.connect(":memory:")
conn.executescript("""
    -- la dimension, avec sa clé de substitution et son code métier
    CREATE TABLE dim_produit (
        sk INTEGER PRIMARY KEY,
        code_metier TEXT UNIQUE, nom TEXT);
    INSERT INTO dim_produit VALUES
        (1, 'K-100', 'clavier'), (2, 'S-200', 'souris'), (3, 'E-300', 'ecran');

    -- les faits entrants (staging) : ils parlent en code métier
    CREATE TABLE staging_ventes (code_produit TEXT, jour TEXT, montant REAL);
    INSERT INTO staging_ventes VALUES
        ('K-100', '2026-01-05', 149.7),
        ('S-200', '2026-01-05', 99.5),
        ('X-999', '2026-01-06', 42.0),     -- code INCONNU de la dimension !
        ('E-300', '2026-01-06', 358.0);

    -- la cible et la table d'écarts
    CREATE TABLE fait_ventes (produit_sk INTEGER, jour TEXT, montant REAL);
    CREATE TABLE ecarts (source TEXT, motif TEXT, detail TEXT,
                         ts TEXT DEFAULT (datetime('now')));
""")

with conn:
    # 1) le lookup : JOIN sur le code métier -> la SK entre dans le fait
    charges = conn.execute("""
        INSERT INTO fait_ventes (produit_sk, jour, montant)
        SELECT d.sk, s.jour, s.montant
        FROM staging_ventes s
        JOIN dim_produit d ON d.code_metier = s.code_produit
    """).rowcount

    # 2) les orphelins : LEFT JOIN ... IS NULL -> table d'écarts
    rejetes = conn.execute("""
        INSERT INTO ecarts (source, motif, detail)
        SELECT 'staging_ventes', 'code produit inconnu',
               s.code_produit || ' / ' || s.jour || ' / ' || s.montant
        FROM staging_ventes s
        LEFT JOIN dim_produit d ON d.code_metier = s.code_produit
        WHERE d.sk IS NULL
    """).rowcount

print(f"{charges} faits chargés, {rejetes} rejeté(s) : le compte est bon"
      f" ({charges + rejetes} entrants)")
print()
print("faits chargés (la SK a remplacé le code métier) :")
for r in conn.execute("SELECT * FROM fait_ventes"):
    print(" ", r)
print()
print("table d'écarts (visible, datée, actionnable) :")
for r in conn.execute("SELECT motif, detail FROM ecarts"):
    print(" ", r)
print()
print("X-999 est peut-être un nouveau produit pas encore dans la dimension :")
print("l'écart le rend visible AVANT que le métier ne voie un CA faux.")`,
      },
    ],
  },

  {
    id: 'olap-requetes',
    section: 'Entrepôt de données',
    titre: 'Le vocabulaire OLAP en pratique : slice, dice, drill',
    competences: 'C9, C13',
    contexte: 'Vocabulaire OLAP : slice, dice, drill-down, roll-up, pivot. Les cinq gestes de l\'analyse multidimensionnelle.',
    objectif: 'Mettre du SQL concret derrière chaque mot du vocabulaire OLAP, sur un petit cube ventes × temps × géographie × produit.',
    idee: 'Le cube est une image : les dimensions sont les axes, les mesures remplissent les cellules. Slice fixe un axe (WHERE), dice en fixe plusieurs, drill-down descend dans la hiérarchie d\'un axe (GROUP BY plus fin), roll-up remonte (GROUP BY plus grossier), pivot croise deux axes en tableau.',
    retenir: 'Ce vocabulaire est l\'interface avec le métier : « peux-tu drill-downer le CA de la région AURA par ville ? » est une phrase normale en réunion. Derrière, c\'est toujours le même motif SQL sur le schéma en étoile : la maîtrise du GROUP BY est la vraie compétence.',
    variantes: [
      {
        label: 'SNIPPET',
        code: `# Les cinq gestes OLAP sur un mini-cube
import sqlite3
import pandas as pd

conn = sqlite3.connect(":memory:")
conn.executescript("""
    CREATE TABLE ventes (
        mois TEXT, region TEXT, ville TEXT, famille TEXT, ca REAL);
    INSERT INTO ventes VALUES
        ('2026-01','AURA','Lyon','peripheriques',249.2),
        ('2026-01','AURA','Grenoble','peripheriques',120.0),
        ('2026-01','AURA','Lyon','affichage',358.0),
        ('2026-01','IDF','Paris','peripheriques',49.9),
        ('2026-02','AURA','Lyon','peripheriques',199.0),
        ('2026-02','IDF','Paris','affichage',716.0),
        ('2026-02','AURA','Grenoble','affichage',89.9);
""")

print("=== SLICE : on fixe UNE dimension (janvier seulement) ===")
for r in conn.execute("""SELECT region, ROUND(SUM(ca),1) FROM ventes
                         WHERE mois = '2026-01' GROUP BY region"""):
    print(" ", r)

print()
print("=== DICE : on fixe PLUSIEURS dimensions (AURA + périphériques) ===")
for r in conn.execute("""SELECT mois, ROUND(SUM(ca),1) FROM ventes
                         WHERE region = 'AURA' AND famille = 'peripheriques'
                         GROUP BY mois"""):
    print(" ", r)

print()
print("=== ROLL-UP : vision agrégée (par région) ===")
for r in conn.execute("""SELECT region, ROUND(SUM(ca),1) FROM ventes
                         GROUP BY region"""):
    print(" ", r)

print()
print("=== DRILL-DOWN : on descend la hiérarchie (région -> ville) ===")
for r in conn.execute("""SELECT region, ville, ROUND(SUM(ca),1) FROM ventes
                         GROUP BY region, ville ORDER BY region, 3 DESC"""):
    print(" ", r)

print()
print("=== PIVOT : deux dimensions croisées en tableau ===")
pivot = pd.read_sql("SELECT mois, famille, ca FROM ventes", conn) \\
    .pivot_table(values="ca", index="mois", columns="famille",
                 aggfunc="sum", fill_value=0, margins=True,
                 margins_name="TOTAL")
print(pivot.round(1).to_string())
print()
print("Cinq mots, un seul moteur : WHERE et GROUP BY sur l'étoile.")`,
      },
    ],
  },
];
