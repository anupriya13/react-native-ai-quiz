#!/usr/bin/env node

/**
 * Security Configuration Test
 * Tests the secure environment variable setup for Azure OpenAI
 */

const fs = require('fs');
const path = require('path');

console.log('🔐 Testing Security Configuration Setup...\n');

// Check if example directory exists
const exampleDir = path.join(__dirname, 'example');
if (!fs.existsSync(exampleDir)) {
  console.error('❌ Example directory not found');
  process.exit(1);
}

// Check .env.example exists
const envExamplePath = path.join(exampleDir, '.env.example');
if (!fs.existsSync(envExamplePath)) {
  console.error('❌ .env.example file not found');
  process.exit(1);
}
console.log('✅ .env.example file exists');

// Check .env file exists
const envPath = path.join(exampleDir, '.env');
if (!fs.existsSync(envPath)) {
  console.log('⚠️  .env file not found (this is expected for first-time setup)');
  console.log('   Run: cp example/.env.example example/.env');
} else {
  console.log('✅ .env file exists');
  
  // Check if it has placeholder values
  const envContent = fs.readFileSync(envPath, 'utf8');
  if (envContent.includes('your-resource.openai.azure.com') || envContent.includes('your-api-key-here')) {
    console.log('⚠️  .env file contains placeholder values');
    console.log('   Update with your actual Azure OpenAI credentials');
  } else {
    console.log('✅ .env file appears to be configured');
  }
}

// Check babel.config.js includes dotenv plugin
const babelConfigPath = path.join(exampleDir, 'babel.config.js');
if (!fs.existsSync(babelConfigPath)) {
  console.error('❌ babel.config.js not found');
  process.exit(1);
}

const babelContent = fs.readFileSync(babelConfigPath, 'utf8');
if (!babelContent.includes('react-native-dotenv')) {
  console.error('❌ babel.config.js missing react-native-dotenv plugin');
  process.exit(1);
}
console.log('✅ babel.config.js configured for environment variables');

// Check TypeScript declarations
const typesPath = path.join(exampleDir, 'types', 'env.d.ts');
if (!fs.existsSync(typesPath)) {
  console.error('❌ TypeScript environment declarations not found');
  process.exit(1);
}
console.log('✅ TypeScript environment declarations exist');

// Check tsconfig.json includes types
const tsconfigPath = path.join(exampleDir, 'tsconfig.json');
if (fs.existsSync(tsconfigPath)) {
  const tsconfigContent = fs.readFileSync(tsconfigPath, 'utf8');
  if (tsconfigContent.includes('types')) {
    console.log('✅ tsconfig.json configured for custom types');
  } else {
    console.log('⚠️  tsconfig.json may need types configuration');
  }
}

// Check .gitignore includes .env
const gitignorePath = path.join(__dirname, '.gitignore');
if (fs.existsSync(gitignorePath)) {
  const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
  if (gitignoreContent.includes('.env')) {
    console.log('✅ .gitignore configured to exclude .env files');
  } else {
    console.log('⚠️  .gitignore may not exclude .env files');
  }
}

// Check package.json includes react-native-dotenv
const packageJsonPath = path.join(exampleDir, 'package.json');
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  if (packageJson.dependencies && packageJson.dependencies['react-native-dotenv']) {
    console.log('✅ react-native-dotenv dependency installed');
  } else {
    console.error('❌ react-native-dotenv dependency missing');
    console.log('   Run: npm install react-native-dotenv');
  }
}

console.log('\n🔐 Security Configuration Test Complete!');
console.log('\nNext steps:');
console.log('1. Copy .env.example to .env: cp example/.env.example example/.env');
console.log('2. Update .env with your Azure OpenAI credentials');
console.log('3. Run the example app: cd example && npm run start');

console.log('\nSecurity reminders:');
console.log('❗ Never commit .env files to version control');
console.log('❗ Keep your API keys secure and rotate them regularly');
console.log('❗ Use different credentials for development and production');