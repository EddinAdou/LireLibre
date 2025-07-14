#!/usr/bin/env node

const fs = require('fs');
const { execSync } = require('child_process');
const semver = require('semver');

// Couleurs pour la console
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function getCurrentVersion() {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  return packageJson.version;
}

function updateVersion(newVersion) {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  packageJson.version = newVersion;
  fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2) + '\n');
  
  // Mettre à jour aussi le frontend/package.json
  if (fs.existsSync('frontend/package.json')) {
    const frontendPackage = JSON.parse(fs.readFileSync('frontend/package.json', 'utf8'));
    frontendPackage.version = newVersion;
    fs.writeFileSync('frontend/package.json', JSON.stringify(frontendPackage, null, 2) + '\n');
  }
}

function generateChangelog() {
  try {
    execSync('npx conventional-changelog -p angular -i CHANGELOG.md -s', { stdio: 'inherit' });
  } catch (error) {
    log('Erreur lors de la génération du changelog', 'red');
  }
}

function createGitTag(version) {
  try {
    execSync(`git add .`, { stdio: 'inherit' });
    execSync(`git commit -m "chore(release): version ${version}"`, { stdio: 'inherit' });
    execSync(`git tag -a v${version} -m "Release version ${version}"`, { stdio: 'inherit' });
    log(`✅ Tag v${version} créé avec succès`, 'green');
  } catch (error) {
    log('Erreur lors de la création du tag Git', 'red');
    throw error;
  }
}

function main() {
  const args = process.argv.slice(2);
  const releaseType = args[0] || 'patch'; // patch, minor, major
  
  if (!['patch', 'minor', 'major'].includes(releaseType)) {
    log('Type de release invalide. Utilisez: patch, minor, ou major', 'red');
    process.exit(1);
  }
  
  log('🚀 Démarrage du processus de release...', 'cyan');
  
  const currentVersion = getCurrentVersion();
  log(`Version actuelle: ${currentVersion}`, 'blue');
  
  const newVersion = semver.inc(currentVersion, releaseType);
  log(`Nouvelle version: ${newVersion}`, 'green');
  
  // Confirmer la release
  log(`Voulez-vous créer une release ${releaseType} (${currentVersion} → ${newVersion}) ? (y/N)`, 'yellow');
  
  // En mode automatique pour le script
  log('Mise à jour de la version...', 'cyan');
  updateVersion(newVersion);
  
  log('Génération du changelog...', 'cyan');
  generateChangelog();
  
  log('Création du tag Git...', 'cyan');
  createGitTag(newVersion);
  
  log(`🎉 Release v${newVersion} créée avec succès !`, 'green');
  log('Pour publier:', 'yellow');
  log(`  git push origin main`, 'yellow');
  log(`  git push origin v${newVersion}`, 'yellow');
}

if (require.main === module) {
  main();
}

module.exports = { getCurrentVersion, updateVersion, generateChangelog, createGitTag };
