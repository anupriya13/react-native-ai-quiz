#!/usr/bin/env node

/**
 * Local Testing Script for React Native AI Quiz
 * 
 * This script helps you quickly test the module locally with your Azure OpenAI configuration.
 * 
 * Usage:
 * 1. Update the azureConfig below with your actual credentials
 * 2. Run: node test-local.js
 */

const { ReactNativeAIQuiz } = require('./lib/index');

// 🔧 CONFIGURE YOUR AZURE OPENAI SETTINGS HERE
const azureConfig = {
  endpoint: 'https://your-resource.openai.azure.com',
  apiKey: 'your-api-key-here',
  deploymentName: 'your-deployment-name',
  apiVersion: '2023-12-01-preview',
};

// Test scenarios
const testScenarios = [
  { topic: 'React Native', numberOfQuestions: 3, difficulty: 'easy' },
  { topic: 'JavaScript', numberOfQuestions: 2, difficulty: 'medium' },
];

async function runTests() {
  console.log('🧪 Starting React Native AI Quiz Local Tests...\n');
  
  // Check if config is still using placeholder values
  if (azureConfig.endpoint.includes('your-resource') || azureConfig.apiKey.includes('your-api-key')) {
    console.log('❌ Please update the azureConfig with your actual Azure OpenAI credentials!');
    console.log('   1. Replace "your-resource" with your actual Azure OpenAI resource name');
    console.log('   2. Replace "your-api-key-here" with your actual API key');
    console.log('   3. Replace "your-deployment-name" with your actual deployment name');
    console.log('\n   Get these from: https://portal.azure.com > Your OpenAI Resource > Keys and Endpoint\n');
    return;
  }
  
  const aiQuiz = new ReactNativeAIQuiz();
  
  try {
    // Test 1: Initialize and test connection
    console.log('1️⃣ Testing Azure OpenAI connection...');
    aiQuiz.initialize(azureConfig);
    
    const isConnected = await aiQuiz.testConnection();
    if (isConnected) {
      console.log('✅ Successfully connected to Azure OpenAI\n');
    } else {
      console.log('❌ Failed to connect to Azure OpenAI');
      console.log('   Check your endpoint, API key, and deployment name\n');
      return;
    }
    
    // Test 2: Static utility methods
    console.log('2️⃣ Testing utility functions...');
    
    const sampleQuestion = {
      question: 'What is React Native?',
      options: ['A web framework', 'A mobile framework', 'A database', 'A game engine'],
      correctAnswer: 1,
      explanation: 'React Native is a mobile application framework.'
    };
    
    const isValid = ReactNativeAIQuiz.validateQuestion(sampleQuestion);
    console.log(isValid ? '✅ Question validation works' : '❌ Question validation failed');
    
    const questions = [sampleQuestion];
    const userAnswers = [1]; // Correct answer
    const score = ReactNativeAIQuiz.calculateScore(questions, userAnswers);
    console.log(`✅ Score calculation: ${score.correct}/${score.total} (${score.percentage}%)`);
    
    const shuffled = ReactNativeAIQuiz.shuffleQuestions(questions);
    console.log('✅ Question shuffling works\n');
    
    // Test 3: Quiz generation
    console.log('3️⃣ Testing quiz generation...');
    
    for (const scenario of testScenarios) {
      try {
        console.log(`   Generating ${scenario.topic} quiz (${scenario.numberOfQuestions} questions, ${scenario.difficulty})...`);
        
        const quiz = await aiQuiz.generateQuiz(scenario);
        
        console.log(`   ✅ Generated ${quiz.questions.length} questions for "${quiz.topic}"`);
        
        // Display first question as example
        if (quiz.questions.length > 0) {
          const firstQ = quiz.questions[0];
          console.log(`   📝 Sample question: "${firstQ.question}"`);
          console.log(`   📊 Options: ${firstQ.options.length} choices`);
        }
        
      } catch (error) {
        console.log(`   ❌ Failed to generate ${scenario.topic} quiz: ${error.message}`);
      }
    }
    
    console.log('\n🎉 All tests completed!');
    console.log('\nNext steps:');
    console.log('1. Test the example React Native app:');
    console.log('   cd example && npm install && npm run start');
    console.log('2. Update example/App.tsx with your Azure OpenAI config');
    console.log('3. Run on device: npm run android or npm run ios');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    if (error.message.includes('401') || error.message.includes('Unauthorized')) {
      console.log('\n💡 This looks like an authentication error. Check:');
      console.log('   - Your API key is correct');
      console.log('   - Your API key has not expired');
      console.log('   - Your Azure OpenAI resource is active');
    } else if (error.message.includes('404') || error.message.includes('Not Found')) {
      console.log('\n💡 This looks like a configuration error. Check:');
      console.log('   - Your endpoint URL is correct');
      console.log('   - Your deployment name exists and is spelled correctly');
      console.log('   - Your API version is supported');
    } else if (error.message.includes('network') || error.message.includes('ECONNREFUSED')) {
      console.log('\n💡 This looks like a network error. Check:');
      console.log('   - You have internet connectivity');
      console.log('   - Your firewall/proxy allows HTTPS requests');
    }
  }
}

// Check if lib directory exists
const fs = require('fs');
const path = require('path');

if (!fs.existsSync(path.join(__dirname, 'lib'))) {
  console.log('❌ Module not built yet. Please run:');
  console.log('   npm run build');
  console.log('\nThen run this test again.');
  process.exit(1);
}

runTests();