/**
 * Demonstration script showing the complete react-native-ai-quiz workflow
 * This simulates what a real usage would look like
 */

import { AIQuiz, AzureOpenAI } from './src/index.js';

console.log('🚀 React Native AI Quiz - Complete Demonstration\n');

// Step 1: Configuration
console.log('📝 Step 1: Configuring Azure OpenAI');
console.log('   AzureOpenAI.setConfig({');
console.log('     apiKey: "your-azure-openai-api-key",');
console.log('     endpoint: "https://your-resource.openai.azure.com"');
console.log('   });');

// Simulate configuration (without real credentials)
AzureOpenAI.setConfig({
  apiKey: 'demo-api-key-12345',
  endpoint: 'https://demo-resource.openai.azure.com'
});

console.log('   ✅ Configuration complete!');
console.log('   📊 Status:', AzureOpenAI.isConfigured() ? 'Configured' : 'Not configured');

const config = AzureOpenAI.getConfig();
console.log('   🔧 Current config:');
console.log('     - Endpoint:', config.endpoint);
console.log('     - API Version:', config.apiVersion);
console.log('     - Deployment:', config.deploymentName);

// Step 2: Demonstrate parameter validation
console.log('\n🔍 Step 2: Parameter Validation Examples');

const testCases = [
  { name: 'Valid theme and count', theme: 'English vocabulary', count: 2, shouldPass: true },
  { name: 'Missing theme', theme: undefined, count: 1, shouldPass: false },
  { name: 'Empty theme', theme: '', count: 1, shouldPass: false },
  { name: 'Invalid count (0)', theme: 'Math', count: 0, shouldPass: false },
  { name: 'Invalid count (51)', theme: 'Science', count: 51, shouldPass: false },
];

for (const testCase of testCases) {
  try {
    // This will validate parameters but not make an actual API call since we don't have real credentials
    await AIQuiz.generateQuiz(testCase.theme, testCase.count);
    if (testCase.shouldPass) {
      console.log(`   ✅ ${testCase.name}: Would proceed to API call`);
    } else {
      console.log(`   ❌ ${testCase.name}: Should have failed but didn't`);
    }
  } catch (error) {
    if (!testCase.shouldPass) {
      console.log(`   ✅ ${testCase.name}: Correctly rejected - ${error.message}`);
    } else {
      console.log(`   ❌ ${testCase.name}: Unexpected error - ${error.message}`);
    }
  }
}

// Step 3: Utility functions demo
console.log('\n🛠️  Step 3: Utility Functions Demo');

const sampleQuizData = {
  quiz: [
    {
      question: "What is the meaning of 'gregarious'?",
      options: [
        { text: "Sociable and outgoing", isCorrect: true },
        { text: "Shy and reserved", isCorrect: false },
        { text: "Angry or irritable", isCorrect: false },
        { text: "Lazy or slow", isCorrect: false }
      ]
    },
    {
      question: "Which of these is a synonym for 'ubiquitous'?",
      options: [
        { text: "Rare", isCorrect: false },
        { text: "Everywhere", isCorrect: true },
        { text: "Hidden", isCorrect: false },
        { text: "Expensive", isCorrect: false }
      ]
    }
  ]
};

console.log('   📋 Sample quiz data created with 2 questions');

// Test getRandomQuestion
const randomQuestion = AIQuiz.getRandomQuestion(sampleQuizData);
console.log(`   🎲 Random question: "${randomQuestion.question}"`);

// Test shuffleOptions
const originalOrder = randomQuestion.options.map(o => o.text);
const shuffledQuestion = AIQuiz.shuffleOptions(randomQuestion);
const shuffledOrder = shuffledQuestion.options.map(o => o.text);

console.log('   🔀 Options shuffling:');
console.log(`     Original: ${originalOrder.slice(0, 2).join(', ')}...`);
console.log(`     Shuffled: ${shuffledOrder.slice(0, 2).join(', ')}...`);

// Step 4: Expected API flow
console.log('\n🌐 Step 4: Expected API Flow (with real credentials)');
console.log('   📡 When configured with real Azure OpenAI credentials:');
console.log('   1. AIQuiz.generateQuiz("help user learn English", 1)');
console.log('   2. → Sends request to Azure OpenAI API');
console.log('   3. → Receives AI-generated response');
console.log('   4. → Validates JSON structure');
console.log('   5. → Returns formatted quiz data');

console.log('\n📱 Step 5: React Native Integration');
console.log('   In your React Native app:');
console.log('   ```javascript');
console.log('   import { AIQuiz, AzureOpenAI } from "react-native-ai-quiz";');
console.log('   ');
console.log('   // Configure once');
console.log('   AzureOpenAI.setConfig({ apiKey: "...", endpoint: "..." });');
console.log('   ');
console.log('   // Generate quiz');
console.log('   const quiz = await AIQuiz.generateQuiz("English grammar", 5);');
console.log('   ```');

console.log('\n✨ Demonstration Complete!');
console.log('📦 The react-native-ai-quiz module is ready for use.');
console.log('📚 See the example/ folder for a complete React Native app.');
console.log('📖 Check README.md for detailed documentation.');