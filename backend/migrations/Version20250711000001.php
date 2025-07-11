<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Initial migration for LireLibre project
 */
final class Version20250711000001 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Create initial tables for LireLibre: users, stories, comments, favorites';
    }

    public function up(Schema $schema): void
    {
        // Create users table
        $this->addSql('CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            email VARCHAR(180) NOT NULL UNIQUE,
            username VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            roles JSON NOT NULL,
            created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
            updated_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL
        )');
        
        // Create stories table
        $this->addSql('CREATE TABLE stories (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            content TEXT NOT NULL,
            slug VARCHAR(255) NOT NULL UNIQUE,
            status VARCHAR(20) NOT NULL DEFAULT \'draft\',
            author_id INTEGER NOT NULL,
            created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
            updated_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
            CONSTRAINT FK_stories_author FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
        )');
        
        // Create comments table
        $this->addSql('CREATE TABLE comments (
            id SERIAL PRIMARY KEY,
            content TEXT NOT NULL,
            author_id INTEGER NOT NULL,
            story_id INTEGER NOT NULL,
            created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
            updated_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
            CONSTRAINT FK_comments_author FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
            CONSTRAINT FK_comments_story FOREIGN KEY (story_id) REFERENCES stories(id) ON DELETE CASCADE
        )');
        
        // Create favorites table
        $this->addSql('CREATE TABLE favorites (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL,
            story_id INTEGER NOT NULL,
            created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
            CONSTRAINT FK_favorites_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            CONSTRAINT FK_favorites_story FOREIGN KEY (story_id) REFERENCES stories(id) ON DELETE CASCADE,
            UNIQUE(user_id, story_id)
        )');
        
        // Create indexes for better performance
        $this->addSql('CREATE INDEX IDX_stories_author_id ON stories (author_id)');
        $this->addSql('CREATE INDEX IDX_stories_status ON stories (status)');
        $this->addSql('CREATE INDEX IDX_stories_created_at ON stories (created_at)');
        $this->addSql('CREATE INDEX IDX_comments_author_id ON comments (author_id)');
        $this->addSql('CREATE INDEX IDX_comments_story_id ON comments (story_id)');
        $this->addSql('CREATE INDEX IDX_favorites_user_id ON favorites (user_id)');
        $this->addSql('CREATE INDEX IDX_favorites_story_id ON favorites (story_id)');
    }

    public function down(Schema $schema): void
    {
        // Drop tables in reverse order (due to foreign key constraints)
        $this->addSql('DROP TABLE IF EXISTS favorites');
        $this->addSql('DROP TABLE IF EXISTS comments');
        $this->addSql('DROP TABLE IF EXISTS stories');
        $this->addSql('DROP TABLE IF EXISTS users');
    }
}
