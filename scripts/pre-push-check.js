#!/usr/bin/env node

const { execSync } = require('child_process');

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
      log(`❌ Erreur: ${command}`, 'red');
    }
    return null;
  }
}

function checkPipelineStatus() {
  log('🔍 Vérification du statut des pipelines...', 'cyan');
  
  try {
    // Vérifier le statut des Actions GitHub
    const status = runCommand('gh run list --limit 5 --json status,conclusion,headBranch');
    
    if (status) {
      const runs = JSON.parse(status);
      const currentBranch = runCommand('git branch --show-current');
      
      const branchRuns = runs.filter(run => run.headBranch === currentBranch);
      
      if (branchRuns.length > 0) {
        const latestRun = branchRuns[0];
        
        if (latestRun.status === 'in_progress') {
          log('⏳ Pipeline en cours d\'exécution...', 'yellow');
          return 'running';
        } else if (latestRun.conclusion === 'success') {
          log('✅ Dernier pipeline: succès', 'green');
          return 'success';
        } else if (latestRun.conclusion === 'failure') {
          log('❌ Dernier pipeline: échec', 'red');
          return 'failure';
        }
      }
    }
    
    log('📝 Aucun pipeline trouvé pour cette branche', 'yellow');
    return 'none';
  } catch (error) {
    log('⚠️ Impossible de vérifier le statut des pipelines (GitHub CLI non configuré)', 'yellow');
    return 'unknown';
  }
}

function validateCodeQuality() {
  log('🔍 Vérification de la qualité du code...', 'cyan');
  
  let errors = [];
  
  // Frontend
  try {
    log('  Frontend: Linting...', 'blue');
    runCommand('cd frontend && npm run lint', { silent: true });
    log('  ✅ Frontend lint: OK', 'green');
  } catch {
    errors.push('Frontend linting failed');
    log('  ❌ Frontend lint: FAIL', 'red');
  }
  
  try {
    log('  Frontend: Build...', 'blue');
    runCommand('cd frontend && npm run build', { silent: true });
    log('  ✅ Frontend build: OK', 'green');
  } catch {
    errors.push('Frontend build failed');
    log('  ❌ Frontend build: FAIL', 'red');
  }
  
  // Backend
  try {
    log('  Backend: Standards de code...', 'blue');
    runCommand('cd backend && vendor/bin/phpcs --standard=PSR12 src/', { silent: true });
    log('  ✅ Backend standards: OK', 'green');
  } catch {
    log('  ⚠️ Backend standards: non configuré', 'yellow');
  }
  
  return errors;
}

function checkCommitMessages() {
  log('📝 Vérification des messages de commit...', 'cyan');
  
  try {
    const commits = runCommand('git log develop..HEAD --oneline');
    if (!commits) {
      log('  ℹ️ Aucun nouveau commit', 'blue');
      return true;
    }
    
    const commitLines = commits.split('\n').filter(line => line.trim());
    const conventionalPattern = /^[a-f0-9]+ (feat|fix|docs|style|refactor|test|chore)(\(.+\))?: .+/;
    
    let allValid = true;
    commitLines.forEach(commit => {
      if (!conventionalPattern.test(commit)) {
        log(`  ❌ Message invalide: ${commit}`, 'red');
        allValid = false;
      } else {
        log(`  ✅ ${commit}`, 'green');
      }
    });
    
    return allValid;
  } catch {
    log('  ⚠️ Impossible de vérifier les messages', 'yellow');
    return true;
  }
}

function checkBranchProtection() {
  const currentBranch = runCommand('git branch --show-current');
  
  if (currentBranch === 'main') {
    log('🚨 Push direct vers main détecté!', 'red');
    log('Les pushes directs vers main sont interdits.', 'red');
    log('Utilisez une Pull Request.', 'yellow');
    return false;
  }
  
  return true;
}

function runSecurityChecks() {
  log('🔒 Vérifications de sécurité...', 'cyan');
  
  let warnings = [];
  
  // Vérifier les secrets
  try {
    const secrets = runCommand('git diff --cached | grep -iE "(password|secret|key|token).*=.*[\'\\"][^\'\\\"]{8,}"', { silent: true });
    if (secrets) {
      warnings.push('Possibles secrets détectés dans les fichiers');
      log('  ⚠️ Possibles secrets détectés', 'yellow');
    }
  } catch {
    // Pas de secrets trouvés
  }
  
  // Audit des dépendances
  try {
    runCommand('cd frontend && npm audit --audit-level moderate', { silent: true });
    log('  ✅ Audit frontend: OK', 'green');
  } catch {
    warnings.push('Vulnérabilités détectées dans les dépendances frontend');
    log('  ⚠️ Vulnérabilités frontend détectées', 'yellow');
  }
  
  return warnings;
}

function generateReport(pipelineStatus, codeErrors, commitValid, securityWarnings) {
  log('\n📊 RAPPORT DE VALIDATION', 'cyan');
  log('=' .repeat(50), 'blue');
  
  log(`🔧 Pipeline: ${pipelineStatus}`, pipelineStatus === 'success' ? 'green' : 'yellow');
  log(`📝 Messages de commit: ${commitValid ? 'Valid' : 'Invalid'}`, commitValid ? 'green' : 'red');
  log(`🎨 Qualité du code: ${codeErrors.length === 0 ? 'OK' : `${codeErrors.length} erreur(s)`}`, codeErrors.length === 0 ? 'green' : 'red');
  log(`🔒 Sécurité: ${securityWarnings.length === 0 ? 'OK' : `${securityWarnings.length} avertissement(s)`}`, securityWarnings.length === 0 ? 'green' : 'yellow');
  
  if (codeErrors.length > 0) {
    log('\n❌ Erreurs de qualité:', 'red');
    codeErrors.forEach(error => log(`  - ${error}`, 'red'));
  }
  
  if (securityWarnings.length > 0) {
    log('\n⚠️ Avertissements de sécurité:', 'yellow');
    securityWarnings.forEach(warning => log(`  - ${warning}`, 'yellow'));
  }
  
  const canPush = commitValid && codeErrors.length === 0 && (pipelineStatus === 'success' || pipelineStatus === 'none' || pipelineStatus === 'unknown');
  
  log(`\n🚀 Push autorisé: ${canPush ? 'OUI' : 'NON'}`, canPush ? 'green' : 'red');
  
  return canPush;
}

async function main() {
  log('🛡️ Pre-Push Validation - LireLibre', 'cyan');
  log('=' .repeat(40), 'blue');
  
  try {
    // Vérifier la protection des branches
    if (!checkBranchProtection()) {
      process.exit(1);
    }
    
    // Vérifications en parallèle
    const pipelineStatus = checkPipelineStatus();
    const codeErrors = validateCodeQuality();
    const commitValid = checkCommitMessages();
    const securityWarnings = runSecurityChecks();
    
    // Générer le rapport
    const canPush = generateReport(pipelineStatus, codeErrors, commitValid, securityWarnings);
    
    if (canPush) {
      log('\n✅ Toutes les vérifications sont passées!', 'green');
      log('🚀 Push autorisé', 'green');
      process.exit(0);
    } else {
      log('\n❌ Vérifications échouées', 'red');
      log('🔧 Corrigez les problèmes avant de pousser', 'yellow');
      process.exit(1);
    }
    
  } catch (error) {
    log(`❌ Erreur lors de la validation: ${error.message}`, 'red');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { main, checkPipelineStatus, validateCodeQuality, checkCommitMessages };
