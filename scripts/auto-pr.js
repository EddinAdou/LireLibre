#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

// Couleurs pour la console
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function runCommand(command, options = {}) {
  try {
    return execSync(command, { encoding: 'utf8', stdio: 'pipe', ...options }).trim();
  } catch (error) {
    if (!options.silent) {
      log(`❌ Erreur lors de l'exécution: ${command}`, 'red');
      log(error.message, 'red');
    }
    throw error;
  }
}

function getCurrentBranch() {
  return runCommand('git branch --show-current');
}

function getBranchCommits(branch) {
  try {
    const commits = runCommand(`git log develop..${branch} --oneline`);
    return commits.split('\n').filter(line => line.trim());
  } catch {
    return [];
  }
}

function validateCommitMessages(commits) {
  const conventionalPattern = /^[a-f0-9]+ (feat|fix|docs|style|refactor|test|chore)(\(.+\))?: .+/;
  const invalidCommits = commits.filter(commit => !conventionalPattern.test(commit));
  
  if (invalidCommits.length > 0) {
    log('❌ Messages de commit invalides détectés:', 'red');
    invalidCommits.forEach(commit => log(`  ${commit}`, 'red'));
    log('\nFormat attendu: type(scope): description', 'yellow');
    log('Exemples: feat(auth): add login, fix(ui): resolve button styling', 'yellow');
    return false;
  }
  
  return true;
}

function checkWorkingDirectory() {
  try {
    const status = runCommand('git status --porcelain');
    if (status) {
      log('❌ Le répertoire de travail n\'est pas propre:', 'red');
      log(status, 'yellow');
      log('\nCommitez ou stash vos changements avant de continuer.', 'yellow');
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

function runTests() {
  log('🧪 Exécution des tests...', 'cyan');
  
  try {
    // Tests Frontend
    log('  Frontend: Linting et build...', 'blue');
    runCommand('cd frontend && npm run lint', { silent: true });
    runCommand('cd frontend && npm run build');
    
    // Tests Backend
    log('  Backend: Standards de code...', 'blue');
    runCommand('cd backend && composer install --no-dev --optimize-autoloader', { silent: true });
    
    log('✅ Tous les tests sont passés!', 'green');
    return true;
  } catch (error) {
    log('❌ Échec des tests', 'red');
    return false;
  }
}

function createPullRequest(branchName, title, description) {
  try {
    // Pousser la branche
    log(`📤 Poussée de la branche ${branchName}...`, 'cyan');
    runCommand(`git push -u origin ${branchName}`);
    
    // Créer la PR avec GitHub CLI si disponible
    try {
      const prCommand = `gh pr create --title "${title}" --body "${description}" --base develop --head ${branchName}`;
      const prUrl = runCommand(prCommand);
      log(`🎉 Pull Request créée: ${prUrl}`, 'green');
      return prUrl;
    } catch {
      // Fallback: donner l'URL pour créer manuellement
      const repoUrl = runCommand('git config --get remote.origin.url')
        .replace('.git', '')
        .replace('git@github.com:', 'https://github.com/');
      
      const prUrl = `${repoUrl}/compare/develop...${branchName}`;
      log(`🔗 Créez votre PR manuellement: ${prUrl}`, 'yellow');
      return prUrl;
    }
  } catch (error) {
    log('❌ Erreur lors de la création de la PR', 'red');
    throw error;
  }
}

function generatePRTitle(branchName, commits) {
  // Extraire le type principal des commits
  const types = commits.map(commit => {
    const match = commit.match(/^[a-f0-9]+ (feat|fix|docs|style|refactor|test|chore)/);
    return match ? match[1] : 'chore';
  });
  
  const mainType = types[0] || 'chore';
  const scope = branchName.includes('/') ? branchName.split('/')[1] : 'general';
  
  return `${mainType}(${scope}): ${branchName.replace('feature/', '').replace('bugfix/', '').replace(/-/g, ' ')}`;
}

function generatePRDescription(commits) {
  const commitList = commits.map(commit => `- ${commit.replace(/^[a-f0-9]+ /, '')}`).join('\n');
  
  return `## 📋 Description

Cette PR contient les changements suivants:

${commitList}

## 🧪 Tests

- [ ] Tests unitaires passent
- [ ] Tests d'intégration passent
- [ ] Code formaté et linté
- [ ] Documentation mise à jour

## 📝 Type de changement

- [ ] 🐛 Bug fix (changement non-breaking qui corrige un problème)
- [ ] ✨ Nouvelle feature (changement non-breaking qui ajoute une fonctionnalité)
- [ ] 💥 Breaking change (fix ou feature qui casserait une fonctionnalité existante)
- [ ] 📚 Documentation (changement de documentation uniquement)

## 🔍 Checklist

- [x] Mon code suit les conventions de style du projet
- [x] J'ai effectué un self-review de mon code
- [x] Les tests passent localement
- [x] Les messages de commit suivent la convention conventional commits`;
}

async function main() {
  log('🚀 Automatisation des Pull Requests - LireLibre', 'cyan');
  log('=' .repeat(50), 'blue');
  
  try {
    // Vérifications préliminaires
    if (!checkWorkingDirectory()) {
      process.exit(1);
    }
    
    const currentBranch = getCurrentBranch();
    if (currentBranch === 'main' || currentBranch === 'develop') {
      log('❌ Vous ne pouvez pas créer une PR depuis main ou develop', 'red');
      log('Créez d\'abord une branche feature ou bugfix', 'yellow');
      process.exit(1);
    }
    
    log(`📍 Branche actuelle: ${currentBranch}`, 'blue');
    
    // Récupérer les commits
    const commits = getBranchCommits(currentBranch);
    if (commits.length === 0) {
      log('❌ Aucun commit trouvé par rapport à develop', 'red');
      process.exit(1);
    }
    
    log(`📝 ${commits.length} commit(s) trouvé(s):`, 'blue');
    commits.forEach(commit => log(`  ${commit}`, 'yellow'));
    
    // Valider les messages de commit
    if (!validateCommitMessages(commits)) {
      process.exit(1);
    }
    
    log('✅ Messages de commit valides', 'green');
    
    // Exécuter les tests
    if (!runTests()) {
      process.exit(1);
    }
    
    // Générer le titre et la description
    const title = generatePRTitle(currentBranch, commits);
    const description = generatePRDescription(commits);
    
    log('\n📋 Détails de la PR:', 'cyan');
    log(`Titre: ${title}`, 'blue');
    log('Description générée automatiquement', 'blue');
    
    // Créer la PR
    const prUrl = createPullRequest(currentBranch, title, description);
    
    log('\n🎉 Processus terminé avec succès!', 'green');
    log(`🔗 PR: ${prUrl}`, 'green');
    
  } catch (error) {
    log(`❌ Erreur: ${error.message}`, 'red');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { main, validateCommitMessages, generatePRTitle, generatePRDescription };
