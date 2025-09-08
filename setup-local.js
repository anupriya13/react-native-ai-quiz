#!/usr/bin/env node

/**
 * Quick Setup Script for React Native AI Quiz
 * 
 * This script helps you set up the project for local testing.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Setting up React Native AI Quiz for local testing...\n');

function runCommand(command, description) {
  console.log(`⚙️  ${description}...`);
  try {
    execSync(command, { stdio: 'inherit', cwd: __dirname });
    console.log('✅ Done\n');
  } catch (error) {
    console.log(`❌ Failed: ${error.message}\n`);
    process.exit(1);
  }
}

function createConfigFile() {
  const configPath = path.join(__dirname, 'azure-config.example.json');
  const config = {
    endpoint: 'https://your-resource.openai.azure.com',
    apiKey: 'your-api-key-here',
    deploymentName: 'your-deployment-name',
    apiVersion: '2023-12-01-preview'
  };
  
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  console.log('✅ Created azure-config.example.json\n');
}

async function setup() {
  try {
    // 1. Install main dependencies
    runCommand('npm install', 'Installing main module dependencies');
    
    // 2. Build the TypeScript module
    runCommand('npm run build', 'Building TypeScript module');
    
    // 3. Set up example app
    runCommand('cd example && npm install', 'Installing example app dependencies');
    
    // 4. Create example config file
    createConfigFile();
    
    console.log('🎉 Setup complete!\n');
    console.log('Next steps:\n');
    console.log('1️⃣ Configure your Azure OpenAI credentials:');
    console.log('   • Open azure-config.example.json');
    console.log('   • Replace placeholder values with your actual Azure OpenAI settings');
    console.log('   • Get these from: https://portal.azure.com > Your OpenAI Resource\n');
    
    console.log('2️⃣ Test the core module:');
    console.log('   • Update the config in test-local.js');
    console.log('   • Run: node test-local.js\n');
    
    console.log('3️⃣ Test the React Native app:');
    console.log('   • Update the config in example/App.tsx');
    console.log('   • Run: cd example && npm run start');
    console.log('   • In another terminal: npm run android (or npm run ios)\n');
    
    console.log('📚 For detailed instructions, see LOCAL_TESTING_GUIDE.md\n');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
}

setup();