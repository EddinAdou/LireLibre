<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250714115347 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE reading_progress (id SERIAL NOT NULL, user_id INT NOT NULL, story_id INT NOT NULL, character_position INT NOT NULL, word_position INT NOT NULL, percentage_read DOUBLE PRECISION NOT NULL, last_read_paragraph TEXT DEFAULT NULL, last_read_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, updated_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, reading_time_minutes INT DEFAULT NULL, bookmarks JSON DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_74F6AFF6A76ED395 ON reading_progress (user_id)');
        $this->addSql('CREATE INDEX IDX_74F6AFF6AA5D4036 ON reading_progress (story_id)');
        $this->addSql('CREATE UNIQUE INDEX user_story_unique ON reading_progress (user_id, story_id)');
        $this->addSql('COMMENT ON COLUMN reading_progress.last_read_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('COMMENT ON COLUMN reading_progress.created_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('COMMENT ON COLUMN reading_progress.updated_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('ALTER TABLE reading_progress ADD CONSTRAINT FK_74F6AFF6A76ED395 FOREIGN KEY (user_id) REFERENCES users (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE reading_progress ADD CONSTRAINT FK_74F6AFF6AA5D4036 FOREIGN KEY (story_id) REFERENCES stories (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE reading_progress DROP CONSTRAINT FK_74F6AFF6A76ED395');
        $this->addSql('ALTER TABLE reading_progress DROP CONSTRAINT FK_74F6AFF6AA5D4036');
        $this->addSql('DROP TABLE reading_progress');
    }
}
