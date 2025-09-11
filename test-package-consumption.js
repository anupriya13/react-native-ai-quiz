#!/usr/bin/env node

/**
 * Test script to verify the npm package can be successfully imported and used
 * This simulates how users would consume the published package
 */

const path = require('path');

console.log('🧪 Testing react-native-ai-quiz package consumption...\n');

try {
  // Test CommonJS import
  console.log('1️⃣ Testing CommonJS import...');
  const { ReactNativeAIQuiz, AIQuiz } = require('./lib/index.js');
  
  if (typeof ReactNativeAIQuiz === 'function') {
    console.log('   ✅ ReactNativeAIQuiz class imported successfully');
  } else {
    throw new Error('ReactNativeAIQuiz not properly exported');
  }
  
  if (typeof AIQuiz === 'object') {
    console.log('   ✅ AIQuiz instance imported successfully');
  } else {
    throw new Error('AIQuiz instance not properly exported');
  }

  // Test static methods
  console.log('\n2️⃣ Testing static methods...');
  
  const sampleQuestion = {
    question: "What is React Native?",
    options: ["Web framework", "Mobile framework", "Desktop app", "Database"],
    correctAnswer: 1
  };
  
  const isValid = ReactNativeAIQuiz.validateQuestion(sampleQuestion);
  if (isValid) {
    console.log('   ✅ validateQuestion() works correctly');
  } else {
    throw new Error('validateQuestion() failed');
  }
  
  const questions = [sampleQuestion];
  const userAnswers = [1];
  const score = ReactNativeAIQuiz.calculateScore(questions, userAnswers);
  
  if (score.percentage === 100) {
    console.log('   ✅ calculateScore() works correctly');
  } else {
    throw new Error('calculateScore() failed');
  }
  
  const shuffled = ReactNativeAIQuiz.shuffleQuestions(questions);
  if (Array.isArray(shuffled) && shuffled.length === 1) {
    console.log('   ✅ shuffleQuestions() works correctly');
  } else {
    throw new Error('shuffleQuestions() failed');
  }

  // Test TypeScript declarations
  console.log('\n3️⃣ Testing TypeScript declarations...');
  const fs = require('fs');
  
  if (fs.existsSync('./lib/index.d.ts')) {
    console.log('   ✅ TypeScript declarations file exists');
    
    const dtsContent = fs.readFileSync('./lib/index.d.ts', 'utf8');
    if (dtsContent.includes('export declare class ReactNativeAIQuiz')) {
      console.log('   ✅ TypeScript declarations include main class');
    } else {
      throw new Error('TypeScript declarations incomplete');
    }
  } else {
    throw new Error('TypeScript declarations missing');
  }

  // Test package.json exports
  console.log('\n4️⃣ Testing package.json configuration...');
  const packageJson = require('./package.json');
  
  if (packageJson.main === 'lib/index.js') {
    console.log('   ✅ Main entry point correctly configured');
  } else {
    throw new Error('Main entry point misconfigured');
  }
  
  if (packageJson.types === 'lib/index.d.ts') {
    console.log('   ✅ TypeScript entry point correctly configured');
  } else {
    throw new Error('TypeScript entry point misconfigured');
  }

  // Test that essential files are included
  console.log('\n5️⃣ Testing file inclusion...');
  const requiredFiles = ['lib/index.js', 'lib/index.d.ts', 'README.md', 'LICENSE'];
  
  for (const file of requiredFiles) {
    if (fs.existsSync(file)) {
      console.log(`   ✅ ${file} exists`);
    } else {
      throw new Error(`Required file ${file} missing`);
    }
  }

  console.log('\n🎉 Package consumption test completed successfully!');
  console.log('\n📦 The package is ready for npm publishing and will work correctly when installed by users.');
  console.log('\nTo publish:');
  console.log('1. npm login');
  console.log('2. npm publish');
  console.log('3. npm view react-native-ai-quiz');

} catch (error) {
  console.error('\n❌ Package consumption test failed:', error.message);
  process.exit(1);
}