# Changelog

Toutes les modifications notables de ce projet seront documentées dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère au [Semantic Versioning](https://semver.org/lang/fr/).

## [Unreleased]

### Added
- Système de versioning sémantique
- Git Flow avec branches main/develop/feature
- Conventions de commits (Conventional Commits)
- Templates pour Pull Requests et Issues
- Git hooks pour la qualité du code
- Script de release automatisé
- Documentation de développement complète
- Intégration de la police Manrope
- Page de démonstration des polices

### Changed
- Configuration PostCSS pour la compatibilité ES modules
- Structure du projet avec documentation

### Fixed
- Problème de configuration PostCSS frontend
- Erreurs de linting et formatage

## [0.1.0] - 2025-01-11

### Added
- Configuration initiale du projet LireLibre
- Architecture Docker avec services PostgreSQL, Redis, Symfony, React
- Interface pgAdmin pour la gestion de base de données
- Schéma de base de données complet (users, stories, comments, favorites)
- API Symfony avec endpoints de base
- Frontend React avec Tailwind CSS
- Système d'authentification JWT
- CI/CD avec GitHub Actions
- Documentation technique complète

### Technical
- Docker Compose avec tous les services
- PostgreSQL 15 avec volumes persistants
- Redis pour le cache
- Symfony 7.1 avec PHP 8.3
- React 18 avec TypeScript et Vite
- Tailwind CSS pour le styling
- Configuration CORS et JWT
