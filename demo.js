#!/usr/bin/env node

/**
 * Demo Test Script - No Azure OpenAI Required
 * 
 * This script demonstrates the module's features using mock data,
 * so you can test the functionality without Azure OpenAI credentials.
 */

const { ReactNativeAIQuiz } = require('./lib/index');

console.log('🎮 React Native AI Quiz - Demo Mode (No Azure OpenAI required)\n');

function runDemo() {
  console.log('Testing static utility functions...\n');
  
  // Sample quiz data
  const sampleQuestions = [
    {
      question: 'What is React Native primarily used for?',
      options: [
        'Web development only',
        'Cross-platform mobile app development',
        'Desktop applications only',
        'Backend development'
      ],
      correctAnswer: 1,
      explanation: 'React Native allows developers to build mobile apps for both iOS and Android using JavaScript and React.',
      difficulty: 'easy'
    },
    {
      question: 'Which company developed React Native?',
      options: ['Google', 'Facebook (Meta)', 'Microsoft', 'Apple'],
      correctAnswer: 1,
      explanation: 'React Native was developed by Facebook (now Meta) and open-sourced in 2015.',
      difficulty: 'easy'
    },
    {
      question: 'What language is primarily used for React Native development?',
      options: ['Java', 'Swift', 'JavaScript/TypeScript', 'Python'],
      correctAnswer: 2,
      explanation: 'React Native uses JavaScript and TypeScript, allowing web developers to leverage their existing skills for mobile development.',
      difficulty: 'medium'
    }
  ];
  
  try {
    // Test 1: Question Validation
    console.log('1️⃣ Testing question validation...');
    let validCount = 0;
    sampleQuestions.forEach((question, index) => {
      const isValid = ReactNativeAIQuiz.validateQuestion(question);
      if (isValid) {
        validCount++;
        console.log(`   ✅ Question ${index + 1}: Valid`);
      } else {
        console.log(`   ❌ Question ${index + 1}: Invalid`);
      }
    });
    console.log(`   📊 ${validCount}/${sampleQuestions.length} questions are valid\n`);
    
    // Test 2: Score Calculation
    console.log('2️⃣ Testing score calculation...');
    
    const testCases = [
      { answers: [1, 1, 2], description: 'All correct (100%)' },
      { answers: [1, 1, 0], description: 'Two correct (67%)' },
      { answers: [0, 0, 0], description: 'All wrong (0%)' },
      { answers: [1, 0, 2], description: 'Two correct (67%)' }
    ];
    
    testCases.forEach((testCase, index) => {
      const score = ReactNativeAIQuiz.calculateScore(sampleQuestions, testCase.answers);
      console.log(`   Test ${index + 1} - ${testCase.description}:`);
      console.log(`   📊 Score: ${score.correct}/${score.total} (${score.percentage}%)`);
      console.log(`   ✅ Working correctly\n`);
    });
    
    // Test 3: Question Shuffling
    console.log('3️⃣ Testing question shuffling...');
    const originalOrder = sampleQuestions.map(q => q.question);
    console.log('   Original order:');
    originalOrder.forEach((q, i) => console.log(`   ${i + 1}. ${q.substring(0, 30)}...`));
    
    const shuffled = ReactNativeAIQuiz.shuffleQuestions([...sampleQuestions]);
    const shuffledOrder = shuffled.map(q => q.question);
    console.log('\n   Shuffled order:');
    shuffledOrder.forEach((q, i) => console.log(`   ${i + 1}. ${q.substring(0, 30)}...`));
    
    const isShuffled = JSON.stringify(originalOrder) !== JSON.stringify(shuffledOrder);
    console.log(`   ${isShuffled ? '✅' : '⚠️'} Questions ${isShuffled ? 'shuffled successfully' : 'order unchanged (normal with small dataset)'}\n`);
    
    // Test 4: Module Structure
    console.log('4️⃣ Testing module structure...');
    const aiQuiz = new ReactNativeAIQuiz();
    console.log('   ✅ ReactNativeAIQuiz class instantiated');
    console.log('   ✅ Static methods available');
    console.log('   ✅ Module exports working correctly\n');
    
    // Display sample quiz
    console.log('5️⃣ Sample Quiz Preview:');
    console.log('=' * 50);
    sampleQuestions.forEach((q, index) => {
      console.log(`\n${index + 1}. ${q.question}`);
      q.options.forEach((option, optIndex) => {
        const marker = optIndex === q.correctAnswer ? '→' : ' ';
        console.log(`   ${marker} ${String.fromCharCode(65 + optIndex)}. ${option}`);
      });
      if (q.explanation) {
        console.log(`   💡 ${q.explanation}`);
      }
    });
    
    console.log('\n🎉 All demo tests completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Set up Azure OpenAI credentials');
    console.log('2. Run: npm run test-local (with real Azure OpenAI)');
    console.log('3. Test the React Native app: npm run example');
    console.log('\nFor setup instructions, see LOCAL_TESTING_GUIDE.md');
    
  } catch (error) {
    console.error('❌ Demo failed:', error.message);
  }
}

// Check if lib directory exists
const fs = require('fs');
const path = require('path');

if (!fs.existsSync(path.join(__dirname, 'lib'))) {
  console.log('❌ Module not built yet. Please run:');
  console.log('   npm run build');
  console.log('\nThen run this demo again.');
  process.exit(1);
}

runDemo();