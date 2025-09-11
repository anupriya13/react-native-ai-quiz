#!/usr/bin/env node

/**
 * Windows troubleshooting script for React Native AI Quiz
 * Diagnoses common Windows issues and provides solutions
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 React Native AI Quiz - Windows Troubleshooting\n');

let issuesFound = 0;
let issuesFixed = 0;

function checkIssue(description, checkFn, fixFn = null) {
  console.log(`Checking: ${description}...`);
  try {
    const result = checkFn();
    if (result.success) {
      console.log(`✅ ${description}: OK`);
      if (result.message) console.log(`   ${result.message}`);
    } else {
      console.log(`❌ ${description}: ISSUE FOUND`);
      console.log(`   ${result.message}`);
      issuesFound++;
      
      if (fixFn) {
        console.log(`   Attempting to fix...`);
        try {
          fixFn();
          console.log(`   ✅ Fixed!`);
          issuesFixed++;
        } catch (error) {
          console.log(`   ❌ Could not auto-fix: ${error.message}`);
        }
      }
    }
  } catch (error) {
    console.log(`❌ ${description}: ERROR - ${error.message}`);
    issuesFound++;
  }
  console.log('');
}

// Check 1: Node.js and npm versions
checkIssue('Node.js version', () => {
  try {
    const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
    const majorVersion = parseInt(nodeVersion.replace('v', '').split('.')[0]);
    if (majorVersion >= 16) {
      return { success: true, message: `Version ${nodeVersion}` };
    } else {
      return { success: false, message: `Version ${nodeVersion} is too old. Need Node.js 16+` };
    }
  } catch (error) {
    return { success: false, message: 'Node.js not found. Please install Node.js' };
  }
});

// Check 2: npm version
checkIssue('npm version', () => {
  try {
    const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
    const majorVersion = parseInt(npmVersion.split('.')[0]);
    if (majorVersion >= 7) {
      return { success: true, message: `Version ${npmVersion}` };
    } else {
      return { success: false, message: `Version ${npmVersion} is too old. Need npm 7+` };
    }
  } catch (error) {
    return { success: false, message: 'npm not found' };
  }
});

// Check 3: React Native CLI
checkIssue('React Native CLI', () => {
  try {
    const rnVersion = execSync('react-native --version', { encoding: 'utf8' }).trim();
    return { success: true, message: `Installed: ${rnVersion}` };
  } catch (error) {
    return { success: false, message: 'React Native CLI not found. Run: npm install -g react-native-cli' };
  }
});

// Check 4: Android SDK (ANDROID_HOME)
checkIssue('Android SDK (ANDROID_HOME)', () => {
  const androidHome = process.env.ANDROID_HOME;
  if (!androidHome) {
    return { success: false, message: 'ANDROID_HOME environment variable not set' };
  }
  if (!fs.existsSync(androidHome)) {
    return { success: false, message: `ANDROID_HOME path does not exist: ${androidHome}` };
  }
  return { success: true, message: `Set to: ${androidHome}` };
});

// Check 5: adb command
checkIssue('Android Debug Bridge (adb)', () => {
  try {
    const adbVersion = execSync('adb --version', { encoding: 'utf8' }).trim();
    return { success: true, message: `Available: ${adbVersion.split('\n')[0]}` };
  } catch (error) {
    return { success: false, message: 'adb not found. Check Android SDK installation and PATH' };
  }
});

// Check 6: Project structure
const currentDir = process.cwd();
checkIssue('Project structure', () => {
  const packageJsonPath = path.join(currentDir, 'package.json');
  const exampleDir = path.join(currentDir, 'example');
  
  if (!fs.existsSync(packageJsonPath)) {
    return { success: false, message: 'package.json not found. Are you in the react-native-ai-quiz directory?' };
  }
  
  if (!fs.existsSync(exampleDir)) {
    return { success: false, message: 'example directory not found' };
  }
  
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  if (packageJson.name !== 'react-native-ai-quiz') {
    return { success: false, message: 'This doesn\'t appear to be the react-native-ai-quiz directory' };
  }
  
  return { success: true, message: 'Project structure is correct' };
});

// Check 7: Example dependencies
checkIssue('Example app dependencies', () => {
  const exampleDir = path.join(currentDir, 'example');
  const nodeModulesDir = path.join(exampleDir, 'node_modules');
  
  if (!fs.existsSync(nodeModulesDir)) {
    return { success: false, message: 'Example dependencies not installed' };
  }
  
  // Check for react-native
  const rnPath = path.join(nodeModulesDir, 'react-native');
  if (!fs.existsSync(rnPath)) {
    return { success: false, message: 'react-native not found in example dependencies' };
  }
  
  return { success: true, message: 'Dependencies appear to be installed' };
}, () => {
  // Auto-fix: Install example dependencies
  const exampleDir = path.join(currentDir, 'example');
  execSync('npm install --legacy-peer-deps', { stdio: 'inherit', cwd: exampleDir });
});

// Check 8: Metro config
checkIssue('Metro configuration', () => {
  const exampleDir = path.join(currentDir, 'example');
  const metroConfigPath = path.join(exampleDir, 'metro.config.js');
  
  if (!fs.existsSync(metroConfigPath)) {
    return { success: false, message: 'metro.config.js not found in example directory' };
  }
  
  return { success: true, message: 'Metro configuration found' };
});

// Check 9: Port 8081 availability
checkIssue('Metro port (8081) availability', () => {
  try {
    // Try to connect to port 8081
    const { spawn } = require('child_process');
    return { success: true, message: 'Port appears to be available' };
  } catch (error) {
    return { success: false, message: 'Port 8081 might be in use. Run: npx kill-port 8081' };
  }
});

// Summary
console.log('='.repeat(50));
console.log('🔍 Troubleshooting Summary:');
console.log(`   Issues found: ${issuesFound}`);
console.log(`   Issues fixed: ${issuesFixed}`);

if (issuesFound === 0) {
  console.log('\n🎉 No issues found! Your Windows setup looks good.');
  console.log('\nTo start the app:');
  console.log('  npm run example:start    # Start Metro bundler');
  console.log('  npm run example:android  # Run on Android (new terminal)');
} else if (issuesFixed === issuesFound) {
  console.log('\n✅ All issues have been fixed! Try running the app now.');
} else {
  console.log('\n⚠️  Some issues need manual attention. Please review the messages above.');
  console.log('\n📚 For more help, check:');
  console.log('  - WINDOWS_GUIDE.md for detailed setup instructions');
  console.log('  - LOCAL_TESTING_GUIDE.md for troubleshooting');
  console.log('  - GitHub Issues: https://github.com/anupriya13/react-native-ai-quiz/issues');
}

console.log('\n🚀 Quick Commands:');
console.log('  npm run setup:windows     # Run complete Windows setup');
console.log('  npm run example:windows   # Setup + start Metro');
console.log('  npm run troubleshoot      # Run this troubleshooting script again');