# Local Testing Guide - React Native AI Quiz

This guide will help you test the React Native AI Quiz module locally on your development machine.

## Prerequisites

- Node.js (version 14 or higher)
- npm or yarn
- React Native development environment (for mobile testing)
- Azure OpenAI account with deployed model

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone https://github.com/anupriya13/react-native-ai-quiz.git
cd react-native-ai-quiz

# Install main module dependencies
npm install

# Build the TypeScript module
npm run build
```

### 2. Configure Azure OpenAI

Create your Azure OpenAI resource and get the required credentials:

1. **Create Azure OpenAI Resource**:
   - Go to [Azure Portal](https://portal.azure.com)
   - Create a new "Azure OpenAI" resource
   - Note your resource name and region

2. **Deploy a Model**:
   - Go to [Azure OpenAI Studio](https://oai.azure.com)
   - Create a new deployment with GPT-3.5-turbo or GPT-4
   - Note your deployment name

3. **Get Credentials**:
   - In Azure Portal, go to your OpenAI resource
   - Navigate to "Keys and Endpoint"
   - Copy your endpoint URL and API key

### 3. Test the Core Module

Create a test script to verify the module works:

```bash
# Create a test directory
mkdir test-local
cd test-local

# Initialize a new Node.js project
npm init -y

# Install the local module
npm install ../

# Install additional dependencies
npm install @types/node typescript ts-node
```

Create `test-module.ts`:

```typescript
import { ReactNativeAIQuiz, AzureOpenAIConfig } from 'react-native-ai-quiz';

const azureConfig: AzureOpenAIConfig = {
  endpoint: 'https://your-resource.openai.azure.com',
  apiKey: 'your-api-key-here',
  deploymentName: 'your-deployment-name',
  apiVersion: '2023-12-01-preview',
};

async function testModule() {
  console.log('🧪 Testing React Native AI Quiz Module...\n');
  
  const aiQuiz = new ReactNativeAIQuiz();
  
  try {
    // Test 1: Connection Test
    console.log('1️⃣ Testing Azure OpenAI connection...');
    aiQuiz.initialize(azureConfig);
    const isConnected = await aiQuiz.testConnection();
    console.log(isConnected ? '✅ Connected successfully' : '❌ Connection failed');
    
    if (!isConnected) {
      console.log('❌ Cannot proceed without valid connection');
      return;
    }
    
    // Test 2: Generate Quiz
    console.log('\n2️⃣ Generating a test quiz...');
    const quiz = await aiQuiz.generateQuiz({
      topic: 'JavaScript',
      numberOfQuestions: 3,
      difficulty: 'easy'
    });
    
    console.log('✅ Quiz generated successfully!');
    console.log(`📊 Topic: ${quiz.topic}`);
    console.log(`📝 Questions: ${quiz.totalQuestions}`);
    
    // Test 3: Static Methods
    console.log('\n3️⃣ Testing utility functions...');
    
    // Validate questions
    const allValid = quiz.questions.every(q => ReactNativeAIQuiz.validateQuestion(q));
    console.log(allValid ? '✅ All questions are valid' : '❌ Some questions are invalid');
    
    // Test shuffling
    const shuffled = ReactNativeAIQuiz.shuffleQuestions(quiz.questions);
    console.log('✅ Question shuffling works');
    
    // Test scoring
    const mockAnswers = [0, 1, 0]; // Mock user answers
    const score = ReactNativeAIQuiz.calculateScore(quiz.questions, mockAnswers);
    console.log(`✅ Score calculation: ${score.correct}/${score.total} (${score.percentage}%)`);
    
    console.log('\n🎉 All tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testModule();
```

Run the test:

```bash
npx ts-node test-module.ts
```

### 4. Test the Example React Native App

```bash
# Navigate to the example app
cd ../example

# Install dependencies
npm install

# For React Native CLI setup (if not already done):
# npm install -g @react-native-community/cli

# Configure Azure OpenAI in App.tsx
# Edit the azureConfig object with your credentials
```

**Edit `example/App.tsx`** (lines 28-33):

```typescript
const azureConfig: AzureOpenAIConfig = {
  endpoint: 'https://your-resource.openai.azure.com',    // Your actual endpoint
  apiKey: 'your-actual-api-key',                        // Your actual API key
  deploymentName: 'your-deployment-name',               // Your deployment name
  apiVersion: '2023-12-01-preview',
};
```

**Run the app:**

```bash
# Start Metro bundler
npm run start

# In another terminal, run on your platform:
# For Android (with device/emulator connected)
npm run android

# For iOS (macOS only, with Xcode installed)
npm run ios
```

### 5. Web-based Testing (Alternative)

For quick testing without mobile setup, create a simple web test:

Create `test-web.html`:

```html
<!DOCTYPE html>
<html>
<head>
    <title>AI Quiz Module Test</title>
    <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
</head>
<body>
    <h1>React Native AI Quiz - Web Test</h1>
    <div id="output"></div>
    
    <script>
        // Simulate the module for web testing
        class TestAzureOpenAI {
            constructor(config) {
                this.config = config;
            }
            
            async generateQuiz(topic) {
                const output = document.getElementById('output');
                output.innerHTML = '<p>Testing Azure OpenAI connection...</p>';
                
                try {
                    const response = await axios.post(
                        `${this.config.endpoint}/openai/deployments/${this.config.deploymentName}/chat/completions?api-version=${this.config.apiVersion}`,
                        {
                            messages: [
                                {
                                    role: 'user',
                                    content: `Generate 2 multiple choice questions about ${topic} in JSON format.`
                                }
                            ],
                            max_tokens: 500
                        },
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                'api-key': this.config.apiKey
                            }
                        }
                    );
                    
                    output.innerHTML = '<p>✅ Connection successful!</p><pre>' + 
                                     JSON.stringify(response.data, null, 2) + '</pre>';
                } catch (error) {
                    output.innerHTML = '<p>❌ Connection failed: ' + error.message + '</p>';
                }
            }
        }
        
        // Test with your config
        const config = {
            endpoint: 'https://your-resource.openai.azure.com',
            apiKey: 'your-api-key',
            deploymentName: 'your-deployment-name',
            apiVersion: '2023-12-01-preview'
        };
        
        const tester = new TestAzureOpenAI(config);
        tester.generateQuiz('React Native');
    </script>
</body>
</html>
```

## Troubleshooting

### Common Issues

1. **"Module not found" errors**:
   ```bash
   cd react-native-ai-quiz
   npm run build
   cd example
   npm install
   ```

2. **Azure OpenAI connection issues**:
   - Verify your endpoint URL format: `https://your-resource.openai.azure.com`
   - Check API key is correct and not expired
   - Ensure deployment name matches exactly
   - Try different API version: `2024-02-15-preview`

3. **React Native build issues**:
   ```bash
   # Clear React Native cache
   npx react-native start --reset-cache
   
   # Clean build (Android)
   cd android && ./gradlew clean && cd ..
   
   # Clean build (iOS)
   cd ios && xcodebuild clean && cd ..
   ```

4. **TypeScript compilation errors**:
   ```bash
   npm run build
   # Check for any TypeScript errors
   ```

### Testing Checklist

- [ ] Main module builds successfully (`npm run build`)
- [ ] Dependencies install correctly
- [ ] Azure OpenAI connection works
- [ ] Quiz generation works with different topics
- [ ] Static utility methods work (validation, scoring, shuffling)
- [ ] Example app runs on mobile device/emulator
- [ ] UI responds correctly to user input
- [ ] Error handling works for invalid configurations

### Advanced Testing

Create comprehensive test scenarios:

```typescript
// test-scenarios.ts
const testScenarios = [
  { topic: 'React Native', questions: 5, difficulty: 'easy' },
  { topic: 'JavaScript ES6', questions: 10, difficulty: 'medium' },
  { topic: 'Node.js', questions: 3, difficulty: 'hard' },
];

for (const scenario of testScenarios) {
  try {
    const quiz = await aiQuiz.generateQuiz(scenario);
    console.log(`✅ ${scenario.topic} quiz: ${quiz.questions.length} questions`);
  } catch (error) {
    console.log(`❌ ${scenario.topic} failed: ${error.message}`);
  }
}
```

## Support

If you encounter issues during local testing:

1. Check the [GitHub Issues](https://github.com/anupriya13/react-native-ai-quiz/issues)
2. Verify your Azure OpenAI setup is correct
3. Ensure you have the latest version of dependencies
4. Try the web-based test first to isolate connection issues

Happy testing! 🚀