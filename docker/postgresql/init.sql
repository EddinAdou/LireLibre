-- Script d'initialisation PostgreSQL pour LireLibre
-- Ce script s'exécute automatiquement lors de la création du conteneur

-- Création de l'utilisateur et de la base si pas déjà fait
-- (généralement fait automatiquement par les variables d'environnement Docker)

-- Configuration des permissions et optimisations
ALTER SYSTEM SET shared_preload_libraries = 'pg_stat_statements';
ALTER SYSTEM SET log_statement = 'all';
ALTER SYSTEM SET log_destination = 'stderr';
ALTER SYSTEM SET logging_collector = on;
ALTER SYSTEM SET log_filename = 'postgresql-%Y-%m-%d_%H%M%S.log';
ALTER SYSTEM SET log_rotation_age = '1d';
ALTER SYSTEM SET log_rotation_size = '100MB';

-- Recharger la configuration
SELECT pg_reload_conf();

-- Créer l'extension pg_stat_statements si elle n'existe pas
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- Message de confirmation
DO $$
BEGIN
    RAISE NOTICE 'LireLibre PostgreSQL database initialized successfully!';
    RAISE NOTICE 'Database: lirelibre';
    RAISE NOTICE 'User: lirelibre';
    RAISE NOTICE 'Access via pgAdmin: http://localhost:5050';
END $$;
