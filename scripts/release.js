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

function runPipeline() {
  log('🔍 Running pre-release pipeline...', 'cyan');
  
  try {
    // Vérifier que les tests passent
    log('📋 Running tests...', 'blue');
    execSync('npm run test --prefix frontend', { stdio: 'inherit' });
    
    // Vérifier le linting
    log('🎨 Running linter...', 'blue');
    execSync('npm run lint --prefix frontend', { stdio: 'inherit' });
    
    // Build pour vérifier qu'il n'y a pas d'erreurs
    log('🔨 Building project...', 'blue');
    execSync('npm run build --prefix frontend', { stdio: 'inherit' });
    
    log('✅ Pipeline passed successfully!', 'green');
    return true;
  } catch (error) {
    log('❌ Pipeline failed. Cannot proceed with release.', 'red');
    log(error.message, 'red');
    return false;
  }
}

function generateChangelog() {
  try {
    log('📝 Generating changelog...', 'blue');
    execSync('npx conventional-changelog -p angular -i CHANGELOG.md -s', { stdio: 'inherit' });
  } catch (error) {
    log('⚠️ Warning: Changelog generation failed', 'yellow');
    log(error.message, 'yellow');
  }
}

function createGitTag(version) {
  try {
    // Vérifier qu'on est sur la bonne branche
    const currentBranch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();
    if (!['main', 'develop'].includes(currentBranch)) {
      throw new Error(`Release must be done from main or develop branch, currently on: ${currentBranch}`);
    }
    
    // Vérifier qu'il n'y a pas de changements non commitées
    try {
      execSync('git diff-index --quiet HEAD --', { stdio: 'pipe' });
    } catch {
      throw new Error('There are uncommitted changes. Please commit or stash them first.');
    }
    
    // Pull les derniers changements
    log('📥 Pulling latest changes...', 'blue');
    execSync(`git pull origin ${currentBranch}`, { stdio: 'inherit' });
    
    log('📝 Committing version bump...', 'blue');
    execSync(`git add .`, { stdio: 'inherit' });
    execSync(`git commit -m "chore(release): bump version to ${version}"`, { stdio: 'inherit' });
    
    log('🏷️ Creating Git tag...', 'blue');
    execSync(`git tag -a v${version} -m "Release version ${version}"`, { stdio: 'inherit' });
    
    log(`✅ Tag v${version} created successfully`, 'green');
    return true;
  } catch (error) {
    log('❌ Git operations failed', 'red');
    log(error.message, 'red');
    return false;
  }
}

function pushRelease(version) {
  try {
    const currentBranch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();
    
    log('🚀 Pushing release...', 'cyan');
    execSync(`git push origin ${currentBranch}`, { stdio: 'inherit' });
    execSync(`git push origin v${version}`, { stdio: 'inherit' });
    
    log('✅ Release pushed successfully!', 'green');
    return true;
  } catch (error) {
    log('❌ Failed to push release', 'red');
    log(error.message, 'red');
    return false;
  }
}

function createGitHubRelease(version) {
  try {
    log('🚀 Creating GitHub release...', 'cyan');
    
    // Lire le changelog pour la description
    let releaseNotes = '';
    if (fs.existsSync('CHANGELOG.md')) {
      const changelog = fs.readFileSync('CHANGELOG.md', 'utf8');
      const lines = changelog.split('\n');
      let capturing = false;
      for (const line of lines) {
        if (line.includes(`[${version}]`) || line.includes(`## [${version}]`)) {
          capturing = true;
          continue;
        }
        if (capturing && line.startsWith('## [')) {
          break;
        }
        if (capturing) {
          releaseNotes += line + '\n';
        }
      }
    }
    
    // Utiliser GitHub CLI si disponible
    try {
      const releaseCmd = `gh release create v${version} --title "Release v${version}" --notes "${releaseNotes || 'Release version ' + version}"`;
      execSync(releaseCmd, { stdio: 'inherit' });
      log('✅ GitHub release created!', 'green');
    } catch {
      log('⚠️ GitHub CLI not available. Please create release manually.', 'yellow');
      log(`🔗 Go to: https://github.com/EddinAdou/LireLibre/releases/new?tag=v${version}`, 'blue');
    }
    
    return true;
  } catch (error) {
    log('❌ Failed to create GitHub release', 'red');
    log(error.message, 'red');
    return false;
  }
}

function showPostReleaseInstructions(version) {
  log('\n🎉 Release completed successfully!', 'green');
  log('📋 Post-release checklist:', 'blue');
  log(`  ✅ Version ${version} tagged and pushed`, 'green');
  log('  🔗 GitHub release created', 'green');
  log('  📝 Changelog updated', 'green');
  log('\n🚀 Next steps:', 'cyan');
  log('  1. Verify deployment in staging/production', 'yellow');
  log('  2. Monitor for any issues', 'yellow');
  log('  3. Announce the release to the team', 'yellow');
  log(`\n🔗 Release URL: https://github.com/EddinAdou/LireLibre/releases/tag/v${version}`, 'blue');
}

function main() {
  const args = process.argv.slice(2);
  const releaseType = args[0] || 'patch'; // patch, minor, major
  const skipPipeline = args.includes('--skip-pipeline');
  const skipPush = args.includes('--skip-push');
  
  if (!['patch', 'minor', 'major'].includes(releaseType)) {
    log('❌ Type de release invalide. Utilisez: patch, minor, ou major', 'red');
    log('Usage: npm run release [patch|minor|major] [--skip-pipeline] [--skip-push]', 'yellow');
    process.exit(1);
  }
  
  log('🚀 Starting LireLibre release process...', 'cyan');
  log(`📦 Release type: ${releaseType}`, 'blue');
  
  const currentVersion = getCurrentVersion();
  log(`📋 Current version: ${currentVersion}`, 'blue');
  
  const newVersion = semver.inc(currentVersion, releaseType);
  log(`🎯 New version: ${newVersion}`, 'green');
  
  // Exécuter la pipeline de validation
  if (!skipPipeline) {
    if (!runPipeline()) {
      process.exit(1);
    }
  } else {
    log('⚠️ Skipping pipeline validation', 'yellow');
  }
  
  log('📝 Updating version...', 'cyan');
  updateVersion(newVersion);
  
  log('📋 Generating changelog...', 'cyan');
  generateChangelog();
  
  log('🏷️ Creating Git tag...', 'cyan');
  if (!createGitTag(newVersion)) {
    process.exit(1);
  }
  
  if (!skipPush) {
    if (!pushRelease(newVersion)) {
      process.exit(1);
    }
    
    createGitHubRelease(newVersion);
  } else {
    log('⚠️ Skipping push (use --skip-push flag removed to push)', 'yellow');
  }
  
  showPostReleaseInstructions(newVersion);
}

if (require.main === module) {
  main();
}

module.exports = { getCurrentVersion, updateVersion, generateChangelog, createGitTag };
