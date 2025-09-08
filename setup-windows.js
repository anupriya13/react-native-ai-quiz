#!/usr/bin/env node

/**
 * Windows-specific setup script for React Native AI Quiz
 * Handles Windows path issues and dependency installation
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🪟 Setting up React Native AI Quiz for Windows...\n');

// Check if we're in the right directory
const currentDir = process.cwd();
const packageJsonPath = path.join(currentDir, 'package.json');

if (!fs.existsSync(packageJsonPath)) {
  console.error('❌ Error: package.json not found. Are you in the react-native-ai-quiz directory?');
  process.exit(1);
}

const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
if (packageJson.name !== 'react-native-ai-quiz') {
  console.error('❌ Error: This doesn\'t appear to be the react-native-ai-quiz directory.');
  process.exit(1);
}

// Step 1: Install root dependencies
console.log('📦 Step 1: Installing root dependencies...');
try {
  execSync('npm install --legacy-peer-deps', { stdio: 'inherit', cwd: currentDir });
  console.log('✅ Root dependencies installed successfully!\n');
} catch (error) {
  console.error('❌ Failed to install root dependencies:', error.message);
  process.exit(1);
}

// Step 2: Navigate to example directory and install dependencies
const exampleDir = path.join(currentDir, 'example');
if (!fs.existsSync(exampleDir)) {
  console.error('❌ Error: example directory not found.');
  process.exit(1);
}

console.log('📦 Step 2: Installing example app dependencies with Windows compatibility...');
try {
  // Use --legacy-peer-deps for Windows compatibility
  execSync('npm install --legacy-peer-deps', { 
    stdio: 'inherit', 
    cwd: exampleDir 
  });
  console.log('✅ Example app dependencies installed successfully!\n');
} catch (error) {
  console.error('❌ Failed to install example dependencies:', error.message);
  console.log('\n🔧 Troubleshooting:');
  console.log('  - Ensure Node.js and npm are properly installed');
  console.log('  - Try running: npm cache clean --force');
  console.log('  - Try running: npm install --legacy-peer-deps manually in the example directory');
  process.exit(1);
}

// Step 3: Verify metro config exists
const metroConfigPath = path.join(exampleDir, 'metro.config.js');
if (!fs.existsSync(metroConfigPath)) {
  console.log('⚠️  Warning: metro.config.js not found in example directory');
  console.log('   This might cause "No Metro config found" errors');
} else {
  console.log('✅ Metro configuration found');
}

// Step 4: Check for Azure OpenAI configuration
const appTsxPath = path.join(exampleDir, 'App.tsx');
if (fs.existsSync(appTsxPath)) {
  const appContent = fs.readFileSync(appTsxPath, 'utf8');
  if (appContent.includes('your-resource.openai.azure.com')) {
    console.log('\n🔧 Next Steps:');
    console.log('1. Configure Azure OpenAI in example/App.tsx (lines 28-33)');
    console.log('2. Update your endpoint, API key, and deployment name');
    console.log('3. Start the app with: npm run example:start');
    console.log('4. In a new terminal, run: npm run example:android');
  } else {
    console.log('✅ Azure OpenAI configuration appears to be set');
  }
}

console.log('\n🚀 Windows Setup Complete!');
console.log('\nTo start the app:');
console.log('  npm run example:start    # Start Metro bundler');
console.log('  npm run example:android  # Run on Android (new terminal)');
console.log('\nOr use the all-in-one command:');
console.log('  npm run example:windows  # Setup + start (Windows optimized)');

console.log('\n📚 Need help? Check LOCAL_TESTING_GUIDE.md for troubleshooting');