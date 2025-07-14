<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250711204714 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // Ajouter les nouveaux champs pour les statistiques
        $this->addSql('ALTER TABLE stories ADD word_count INT DEFAULT NULL');
        $this->addSql('ALTER TABLE stories ADD character_count INT DEFAULT NULL');
        $this->addSql('ALTER TABLE stories ADD reading_time INT DEFAULT NULL');
        $this->addSql('ALTER TABLE stories ADD language VARCHAR(10) DEFAULT \'fr\'');
    }

    public function down(Schema $schema): void
    {
        // Supprimer les champs ajoutés
        $this->addSql('ALTER TABLE stories DROP word_count');
        $this->addSql('ALTER TABLE stories DROP character_count');
        $this->addSql('ALTER TABLE stories DROP reading_time');
        $this->addSql('ALTER TABLE stories DROP language');
    }
}
