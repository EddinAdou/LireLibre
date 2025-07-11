<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Migration initiale pour créer toutes les tables de LireLibre
 */
final class Version20250711103500 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Création des tables users, stories, comments et favorites';
    }

    public function up(Schema $schema): void
    {
        // Table users
        $this->addSql('CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            email VARCHAR(180) NOT NULL UNIQUE,
            username VARCHAR(50) NOT NULL UNIQUE,
            first_name VARCHAR(100),
            last_name VARCHAR(100),
            avatar VARCHAR(255),
            bio TEXT,
            roles JSON NOT NULL DEFAULT \'["ROLE_USER"]\',
            password VARCHAR(255) NOT NULL,
            is_verified BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
        )');

        // Table stories
        $this->addSql('CREATE TABLE stories (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            content TEXT NOT NULL,
            summary TEXT,
            genre VARCHAR(100),
            cover_image VARCHAR(255),
            is_published BOOLEAN DEFAULT FALSE,
            view_count INTEGER DEFAULT 0,
            like_count INTEGER DEFAULT 0,
            tags JSON,
            author_id INTEGER NOT NULL,
            created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
        )');

        // Table comments
        $this->addSql('CREATE TABLE comments (
            id SERIAL PRIMARY KEY,
            content TEXT NOT NULL,
            author_id INTEGER NOT NULL,
            story_id INTEGER NOT NULL,
            created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (story_id) REFERENCES stories(id) ON DELETE CASCADE
        )');

        // Table favorites
        $this->addSql('CREATE TABLE favorites (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL,
            story_id INTEGER NOT NULL,
            created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (story_id) REFERENCES stories(id) ON DELETE CASCADE,
            UNIQUE(user_id, story_id)
        )');

        // Index pour optimiser les requêtes
        $this->addSql('CREATE INDEX idx_stories_author ON stories(author_id)');
        $this->addSql('CREATE INDEX idx_stories_created_at ON stories(created_at)');
        $this->addSql('CREATE INDEX idx_stories_published ON stories(is_published)');
        $this->addSql('CREATE INDEX idx_comments_story ON comments(story_id)');
        $this->addSql('CREATE INDEX idx_comments_author ON comments(author_id)');
        $this->addSql('CREATE INDEX idx_favorites_user ON favorites(user_id)');
        $this->addSql('CREATE INDEX idx_favorites_story ON favorites(story_id)');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('DROP TABLE IF EXISTS favorites');
        $this->addSql('DROP TABLE IF EXISTS comments');
        $this->addSql('DROP TABLE IF EXISTS stories');
        $this->addSql('DROP TABLE IF EXISTS users');
    }
}
