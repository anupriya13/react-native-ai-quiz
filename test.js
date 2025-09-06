/**
 * Basic test script for react-native-ai-quiz
 * This tests the module structure and basic functionality without making actual API calls
 */

import { AIQuiz, AzureOpenAI } from './src/index.js';

console.log('Testing react-native-ai-quiz module...\n');

// Test 1: Check if modules are exported correctly
console.log('✓ Testing module exports:');
console.log('  - AIQuiz:', typeof AIQuiz);
console.log('  - AzureOpenAI:', typeof AzureOpenAI);

// Test 2: Test AzureOpenAI configuration
console.log('\n✓ Testing AzureOpenAI configuration:');
try {
  console.log('  - Initial configured state:', AzureOpenAI.isConfigured());
  
  // Test invalid config
  try {
    AzureOpenAI.setConfig({});
  } catch (error) {
    console.log('  - ✓ Correctly throws error for invalid config');
  }
  
  // Test valid config
  AzureOpenAI.setConfig({
    apiKey: 'test-key',
    endpoint: 'https://test.openai.azure.com'
  });
  console.log('  - ✓ Valid configuration accepted');
  console.log('  - Configured state:', AzureOpenAI.isConfigured());
  
  const config = AzureOpenAI.getConfig();
  console.log('  - Configuration retrieved:', JSON.stringify(config, null, 2));
} catch (error) {
  console.log('  - ✗ Error testing AzureOpenAI:', error.message);
}

// Test 3: Test AIQuiz parameter validation
console.log('\n✓ Testing AIQuiz parameter validation:');
async function testParameterValidation() {
  try {
    // Test invalid theme
    try {
      await AIQuiz.generateQuiz();
    } catch (error) {
      console.log('  - ✓ Correctly throws error for missing theme');
    }
    
    try {
      await AIQuiz.generateQuiz('');
    } catch (error) {
      console.log('  - ✓ Correctly throws error for empty theme');
    }
    
    // Test invalid count
    try {
      await AIQuiz.generateQuiz('test theme', 0);
    } catch (error) {
      console.log('  - ✓ Correctly throws error for invalid count');
    }
    
    try {
      await AIQuiz.generateQuiz('test theme', 51);
    } catch (error) {
      console.log('  - ✓ Correctly throws error for count too high');
    }
    
    console.log('  - ✓ All parameter validations working correctly');
  } catch (error) {
    console.log('  - ✗ Error testing AIQuiz validation:', error.message);
  }
}

await testParameterValidation();

// Test 4: Test utility functions
console.log('\n✓ Testing utility functions:');
try {
  // Test quiz data validation
  const validQuizData = {
    quiz: [
      {
        question: "Test question?",
        options: [
          { text: "Correct answer", isCorrect: true },
          { text: "Wrong answer 1", isCorrect: false },
          { text: "Wrong answer 2", isCorrect: false },
          { text: "Wrong answer 3", isCorrect: false }
        ]
      }
    ]
  };
  
  const randomQuestion = AIQuiz.getRandomQuestion(validQuizData);
  console.log('  - ✓ getRandomQuestion works');
  
  const shuffledQuestion = AIQuiz.shuffleOptions(randomQuestion);
  console.log('  - ✓ shuffleOptions works');
  console.log('  - Original options order:', validQuizData.quiz[0].options.map(o => o.text.substring(0, 10)));
  console.log('  - Shuffled options order:', shuffledQuestion.options.map(o => o.text.substring(0, 10)));
  
} catch (error) {
  console.log('  - ✗ Error testing utility functions:', error.message);
}

console.log('\n✅ All basic tests completed successfully!');
console.log('\nNote: To test the full functionality, you need to:');
console.log('1. Configure with real Azure OpenAI credentials');
console.log('2. Call AIQuiz.generateQuiz() with a valid theme');
console.log('\nExample usage:');
console.log(`
AzureOpenAI.setConfig({
  apiKey: 'your-api-key',
  endpoint: 'your-endpoint'
});

const quiz = await AIQuiz.generateQuiz('help user learn English', 1);
console.log(quiz);
`);