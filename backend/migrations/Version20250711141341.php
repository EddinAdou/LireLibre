<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250711141341 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE comments DROP CONSTRAINT fk_comments_author');
        $this->addSql('ALTER TABLE comments DROP CONSTRAINT fk_comments_story');
        $this->addSql('ALTER TABLE comments ADD parent_comment_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE comments ALTER created_at TYPE TIMESTAMP(0) WITHOUT TIME ZONE');
        $this->addSql('ALTER TABLE comments ALTER updated_at TYPE TIMESTAMP(0) WITHOUT TIME ZONE');
        $this->addSql('COMMENT ON COLUMN comments.created_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('COMMENT ON COLUMN comments.updated_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('ALTER TABLE comments ADD CONSTRAINT FK_5F9E962AF675F31B FOREIGN KEY (author_id) REFERENCES users (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE comments ADD CONSTRAINT FK_5F9E962AAA5D4036 FOREIGN KEY (story_id) REFERENCES stories (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE comments ADD CONSTRAINT FK_5F9E962ABF2AF943 FOREIGN KEY (parent_comment_id) REFERENCES comments (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX IDX_5F9E962ABF2AF943 ON comments (parent_comment_id)');
        $this->addSql('ALTER INDEX idx_comments_author_id RENAME TO IDX_5F9E962AF675F31B');
        $this->addSql('ALTER INDEX idx_comments_story_id RENAME TO IDX_5F9E962AAA5D4036');
        $this->addSql('ALTER TABLE favorites DROP CONSTRAINT fk_favorites_story');
        $this->addSql('ALTER TABLE favorites DROP CONSTRAINT fk_favorites_user');
        $this->addSql('DROP INDEX favorites_user_id_story_id_key');
        $this->addSql('ALTER TABLE favorites ALTER created_at TYPE TIMESTAMP(0) WITHOUT TIME ZONE');
        $this->addSql('COMMENT ON COLUMN favorites.created_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('ALTER TABLE favorites ADD CONSTRAINT FK_E46960F5A76ED395 FOREIGN KEY (user_id) REFERENCES users (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE favorites ADD CONSTRAINT FK_E46960F5AA5D4036 FOREIGN KEY (story_id) REFERENCES stories (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER INDEX idx_favorites_user_id RENAME TO IDX_E46960F5A76ED395');
        $this->addSql('ALTER INDEX idx_favorites_story_id RENAME TO IDX_E46960F5AA5D4036');
        $this->addSql('ALTER TABLE stories DROP CONSTRAINT fk_stories_author');
        $this->addSql('DROP INDEX idx_stories_created_at');
        $this->addSql('DROP INDEX idx_stories_status');
        $this->addSql('ALTER TABLE stories ADD summary TEXT DEFAULT NULL');
        $this->addSql('ALTER TABLE stories ADD genre VARCHAR(100) NOT NULL');
        $this->addSql('ALTER TABLE stories ADD cover_image VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE stories ADD is_published BOOLEAN NOT NULL');
        $this->addSql('ALTER TABLE stories ADD view_count INT NOT NULL');
        $this->addSql('ALTER TABLE stories ADD like_count INT NOT NULL');
        $this->addSql('ALTER TABLE stories ADD tags JSON DEFAULT NULL');
        $this->addSql('ALTER TABLE stories ALTER status DROP DEFAULT');
        $this->addSql('ALTER TABLE stories ALTER status TYPE VARCHAR(50)');
        $this->addSql('ALTER TABLE stories ALTER created_at TYPE TIMESTAMP(0) WITHOUT TIME ZONE');
        $this->addSql('ALTER TABLE stories ALTER updated_at TYPE TIMESTAMP(0) WITHOUT TIME ZONE');
        $this->addSql('COMMENT ON COLUMN stories.created_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('COMMENT ON COLUMN stories.updated_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('ALTER TABLE stories ADD CONSTRAINT FK_9C8B9D5FF675F31B FOREIGN KEY (author_id) REFERENCES users (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER INDEX stories_slug_key RENAME TO UNIQ_9C8B9D5F989D9B62');
        $this->addSql('ALTER INDEX idx_stories_author_id RENAME TO IDX_9C8B9D5FF675F31B');
        $this->addSql('ALTER TABLE users ADD first_name VARCHAR(100) DEFAULT NULL');
        $this->addSql('ALTER TABLE users ADD last_name VARCHAR(100) DEFAULT NULL');
        $this->addSql('ALTER TABLE users ADD avatar VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE users ADD bio TEXT DEFAULT NULL');
        $this->addSql('ALTER TABLE users ALTER username TYPE VARCHAR(50)');
        $this->addSql('ALTER TABLE users ALTER created_at TYPE TIMESTAMP(0) WITHOUT TIME ZONE');
        $this->addSql('ALTER TABLE users ALTER updated_at TYPE TIMESTAMP(0) WITHOUT TIME ZONE');
        $this->addSql('COMMENT ON COLUMN users.created_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('COMMENT ON COLUMN users.updated_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('ALTER INDEX users_email_key RENAME TO UNIQ_1483A5E9E7927C74');
        $this->addSql('ALTER INDEX users_username_key RENAME TO UNIQ_1483A5E9F85E0677');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE favorites DROP CONSTRAINT FK_E46960F5A76ED395');
        $this->addSql('ALTER TABLE favorites DROP CONSTRAINT FK_E46960F5AA5D4036');
        $this->addSql('ALTER TABLE favorites ALTER created_at TYPE TIMESTAMP(0) WITHOUT TIME ZONE');
        $this->addSql('COMMENT ON COLUMN favorites.created_at IS NULL');
        $this->addSql('ALTER TABLE favorites ADD CONSTRAINT fk_favorites_story FOREIGN KEY (story_id) REFERENCES stories (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE favorites ADD CONSTRAINT fk_favorites_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE UNIQUE INDEX favorites_user_id_story_id_key ON favorites (user_id, story_id)');
        $this->addSql('ALTER INDEX idx_e46960f5aa5d4036 RENAME TO idx_favorites_story_id');
        $this->addSql('ALTER INDEX idx_e46960f5a76ed395 RENAME TO idx_favorites_user_id');
        $this->addSql('ALTER TABLE comments DROP CONSTRAINT FK_5F9E962AF675F31B');
        $this->addSql('ALTER TABLE comments DROP CONSTRAINT FK_5F9E962AAA5D4036');
        $this->addSql('ALTER TABLE comments DROP CONSTRAINT FK_5F9E962ABF2AF943');
        $this->addSql('DROP INDEX IDX_5F9E962ABF2AF943');
        $this->addSql('ALTER TABLE comments DROP parent_comment_id');
        $this->addSql('ALTER TABLE comments ALTER created_at TYPE TIMESTAMP(0) WITHOUT TIME ZONE');
        $this->addSql('ALTER TABLE comments ALTER updated_at TYPE TIMESTAMP(0) WITHOUT TIME ZONE');
        $this->addSql('COMMENT ON COLUMN comments.created_at IS NULL');
        $this->addSql('COMMENT ON COLUMN comments.updated_at IS NULL');
        $this->addSql('ALTER TABLE comments ADD CONSTRAINT fk_comments_author FOREIGN KEY (author_id) REFERENCES users (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE comments ADD CONSTRAINT fk_comments_story FOREIGN KEY (story_id) REFERENCES stories (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER INDEX idx_5f9e962af675f31b RENAME TO idx_comments_author_id');
        $this->addSql('ALTER INDEX idx_5f9e962aaa5d4036 RENAME TO idx_comments_story_id');
        $this->addSql('ALTER TABLE users DROP first_name');
        $this->addSql('ALTER TABLE users DROP last_name');
        $this->addSql('ALTER TABLE users DROP avatar');
        $this->addSql('ALTER TABLE users DROP bio');
        $this->addSql('ALTER TABLE users ALTER username TYPE VARCHAR(255)');
        $this->addSql('ALTER TABLE users ALTER created_at TYPE TIMESTAMP(0) WITHOUT TIME ZONE');
        $this->addSql('ALTER TABLE users ALTER updated_at TYPE TIMESTAMP(0) WITHOUT TIME ZONE');
        $this->addSql('COMMENT ON COLUMN users.created_at IS NULL');
        $this->addSql('COMMENT ON COLUMN users.updated_at IS NULL');
        $this->addSql('ALTER INDEX uniq_1483a5e9e7927c74 RENAME TO users_email_key');
        $this->addSql('ALTER INDEX uniq_1483a5e9f85e0677 RENAME TO users_username_key');
        $this->addSql('ALTER TABLE stories DROP CONSTRAINT FK_9C8B9D5FF675F31B');
        $this->addSql('ALTER TABLE stories DROP summary');
        $this->addSql('ALTER TABLE stories DROP genre');
        $this->addSql('ALTER TABLE stories DROP cover_image');
        $this->addSql('ALTER TABLE stories DROP is_published');
        $this->addSql('ALTER TABLE stories DROP view_count');
        $this->addSql('ALTER TABLE stories DROP like_count');
        $this->addSql('ALTER TABLE stories DROP tags');
        $this->addSql('ALTER TABLE stories ALTER created_at TYPE TIMESTAMP(0) WITHOUT TIME ZONE');
        $this->addSql('ALTER TABLE stories ALTER updated_at TYPE TIMESTAMP(0) WITHOUT TIME ZONE');
        $this->addSql('ALTER TABLE stories ALTER status SET DEFAULT \'draft\'');
        $this->addSql('ALTER TABLE stories ALTER status TYPE VARCHAR(20)');
        $this->addSql('COMMENT ON COLUMN stories.created_at IS NULL');
        $this->addSql('COMMENT ON COLUMN stories.updated_at IS NULL');
        $this->addSql('ALTER TABLE stories ADD CONSTRAINT fk_stories_author FOREIGN KEY (author_id) REFERENCES users (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX idx_stories_created_at ON stories (created_at)');
        $this->addSql('CREATE INDEX idx_stories_status ON stories (status)');
        $this->addSql('ALTER INDEX idx_9c8b9d5ff675f31b RENAME TO idx_stories_author_id');
        $this->addSql('ALTER INDEX uniq_9c8b9d5f989d9b62 RENAME TO stories_slug_key');
    }
}
