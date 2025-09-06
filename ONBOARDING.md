# React Native AI Quiz - Onboarding Guide

This guide will help you get started with the React Native AI Quiz module in just a few simple steps.

## 🚀 Quick Setup (5 minutes)

### Step 1: Install the Package

```bash
npm install react-native-ai-quiz
```

### Step 2: Install Required Dependencies

```bash
npm install react react-native axios
```

### Step 3: Set Up Azure OpenAI (If you don't have it already)

1. **Go to Azure Portal**: Visit [portal.azure.com](https://portal.azure.com)
2. **Create Resource**: Search for "Azure OpenAI" and create a new resource
3. **Deploy Model**: In your Azure OpenAI resource, go to "Model deployments" and deploy `gpt-35-turbo` or `gpt-4`
4. **Get Credentials**: Note down your:
   - Endpoint URL (e.g., `https://your-resource.openai.azure.com`)
   - API Key (from "Keys and Endpoint" section)
   - Deployment Name (what you named your model deployment)

### Step 4: Basic Implementation

Here's a complete working example:

```javascript
import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import AIQuiz from 'react-native-ai-quiz';

const MyQuizApp = () => {
  // Configure your Azure OpenAI settings
  const azureConfig = {
    endpoint: 'https://your-resource.openai.azure.com',  // Replace with your endpoint
    apiKey: 'your-api-key-here',                        // Replace with your API key
    deploymentName: 'gpt-35-turbo',                     // Replace with your deployment name
    apiVersion: '2024-02-15-preview',                   // Optional: API version
  };

  const handleQuizComplete = (results) => {
    Alert.alert(
      'Quiz Complete!', 
      `You scored ${results.score}/${results.total} (${results.percentage}%)`
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <AIQuiz
        azureConfig={azureConfig}
        topic="JavaScript Programming"
        difficulty="medium"
        numberOfQuestions={5}
        onQuizComplete={handleQuizComplete}
      />
    </View>
  );
};

export default MyQuizApp;
```

## 📋 Configuration Details

### azureConfig Object Format

```javascript
const azureConfig = {
  endpoint: 'https://your-resource.openai.azure.com',  // Required: Your Azure OpenAI endpoint
  apiKey: 'your-api-key',                             // Required: Your API key
  deploymentName: 'gpt-35-turbo',                     // Optional: Default is 'gpt-35-turbo'
  apiVersion: '2024-02-15-preview'                    // Optional: Default is '2024-02-15-preview'
};
```

### Where to Find Your Azure OpenAI Credentials

1. **Endpoint URL**: 
   - Go to your Azure OpenAI resource in Azure Portal
   - Look in the "Keys and Endpoint" section
   - Copy the "Endpoint" URL (e.g., `https://myresource.openai.azure.com`)

2. **API Key**:
   - In the same "Keys and Endpoint" section
   - Copy either "KEY 1" or "KEY 2"

3. **Deployment Name**:
   - Go to "Model deployments" in your Azure OpenAI resource
   - This is the name you gave when deploying the model (e.g., "gpt-35-turbo", "my-gpt4-deployment")

### Supported Azure OpenAI Models

- `gpt-35-turbo` (recommended for cost-effectiveness)
- `gpt-4` (better quality, higher cost)
- `gpt-4-32k` (for longer conversations)

## 🎯 Component Props

| Prop | Type | Required | Example | Description |
|------|------|----------|---------|-------------|
| `azureConfig` | Object | ✅ Yes | See above | Azure OpenAI configuration |
| `topic` | String | ✅ Yes | `"React Native"` | Subject for the quiz |
| `difficulty` | String | No | `"medium"` | `"easy"`, `"medium"`, or `"hard"` |
| `numberOfQuestions` | Number | No | `5` | Number of questions (1-20) |
| `onQuizComplete` | Function | No | `(results) => {}` | Called when quiz finishes |
| `onQuizStart` | Function | No | `(quiz) => {}` | Called when quiz starts |

## 🎨 Styling Example

```javascript
<AIQuiz
  azureConfig={azureConfig}
  topic="Python Programming"
  style={{ backgroundColor: '#f0f8ff' }}
  questionStyle={{ fontSize: 20, color: '#2c3e50' }}
  optionStyle={{ backgroundColor: '#ecf0f1', borderRadius: 10 }}
  selectedOptionStyle={{ backgroundColor: '#3498db' }}
  correctOptionStyle={{ backgroundColor: '#2ecc71' }}
  incorrectOptionStyle={{ backgroundColor: '#e74c3c' }}
  buttonStyle={{ backgroundColor: '#9b59b6' }}
/>
```

## 🔧 Advanced Configuration Example

```javascript
import React, { useState } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import AIQuiz from 'react-native-ai-quiz';

const AdvancedQuizApp = () => {
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizConfig, setQuizConfig] = useState({
    topic: 'Machine Learning',
    difficulty: 'hard',
    numberOfQuestions: 10
  });

  const azureConfig = {
    endpoint: process.env.AZURE_OPENAI_ENDPOINT,  // Use environment variables for security
    apiKey: process.env.AZURE_OPENAI_API_KEY,
    deploymentName: 'gpt-4',
  };

  const handleQuizStart = (quiz) => {
    console.log('Quiz started with', quiz.questions.length, 'questions');
  };

  const handleQuizComplete = (results) => {
    console.log('Detailed results:', results.detailed);
    Alert.alert(
      'Quiz Results',
      `Score: ${results.percentage}%\n\nCorrect: ${results.score}\nIncorrect: ${results.total - results.score}`,
      [
        { text: 'Take Another Quiz', onPress: () => setShowQuiz(false) },
        { text: 'View Details', onPress: () => showDetailedResults(results) }
      ]
    );
  };

  const showDetailedResults = (results) => {
    results.detailed.forEach((result, index) => {
      console.log(`Question ${index + 1}: ${result.isCorrect ? '✅' : '❌'}`);
      console.log(`Q: ${result.question}`);
      console.log(`Your answer: ${result.userAnswer}`);
      console.log(`Correct answer: ${result.correctAnswer}`);
      console.log(`Explanation: ${result.explanation}\n`);
    });
  };

  if (showQuiz) {
    return (
      <View style={{ flex: 1 }}>
        <AIQuiz
          azureConfig={azureConfig}
          topic={quizConfig.topic}
          difficulty={quizConfig.difficulty}
          numberOfQuestions={quizConfig.numberOfQuestions}
          onQuizStart={handleQuizStart}
          onQuizComplete={handleQuizComplete}
        />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <Text style={{ fontSize: 24, textAlign: 'center', marginBottom: 30 }}>
        AI Quiz App
      </Text>
      <Button
        title="Start Machine Learning Quiz"
        onPress={() => setShowQuiz(true)}
      />
    </View>
  );
};

export default AdvancedQuizApp;
```

## 🚨 Common Issues & Solutions

### Error: "Azure OpenAI endpoint and API key are required"

**Problem**: Missing or incorrect configuration.

**Solution**: 
```javascript
// ❌ Wrong - String format
azureConfig="endpoint: https://..."

// ✅ Correct - Object format
azureConfig={{
  endpoint: 'https://your-resource.openai.azure.com',
  apiKey: 'your-api-key'
}}
```

### Error: "Failed to generate quiz: Request failed"

**Solutions**:
1. Check your Azure OpenAI deployment is active
2. Verify API key permissions
3. Ensure deployment name matches your Azure configuration
4. Check network connectivity

### Error: "Deployment not found"

**Solution**: Make sure the `deploymentName` in your config matches exactly the deployment name in Azure:

```javascript
// In Azure Portal, if your deployment is named "my-gpt35-turbo"
const azureConfig = {
  endpoint: 'https://your-resource.openai.azure.com',
  apiKey: 'your-api-key',
  deploymentName: 'my-gpt35-turbo',  // Must match exactly
};
```

### Network Timeout

**Solution**: The component uses a 30-second timeout. Check:
- Your internet connection
- Azure OpenAI service status
- Firewall/proxy settings

## 🔒 Security Best Practices

### 1. Use Environment Variables

```javascript
// .env file
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com
AZURE_OPENAI_API_KEY=your-api-key

// In your app
const azureConfig = {
  endpoint: process.env.AZURE_OPENAI_ENDPOINT,
  apiKey: process.env.AZURE_OPENAI_API_KEY,
};
```

### 2. Never Commit API Keys

Add to `.gitignore`:
```
.env
.env.local
.env.production
```

### 3. Use Azure Key Vault (Production)

For production apps, consider using Azure Key Vault to manage secrets securely.

## 📱 Testing Your Implementation

### 1. Basic Test

```javascript
// Simple test to verify configuration
const testConfig = async () => {
  try {
    const azureConfig = {
      endpoint: 'your-endpoint',
      apiKey: 'your-key',
      deploymentName: 'gpt-35-turbo'
    };
    
    // The AIQuiz component will validate the config automatically
    console.log('Configuration looks good!');
  } catch (error) {
    console.error('Configuration error:', error.message);
  }
};
```

### 2. Run the Example App

```bash
# Clone the repository
git clone https://github.com/anupriya13/react-native-ai-quiz.git
cd react-native-ai-quiz/example

# Install dependencies
npm install

# Add your Azure credentials to the app and run
npx react-native run-android
# or
npx react-native run-ios
```

## 🆘 Need More Help?

1. **Check Example App**: The `example/App.js` shows a complete implementation
2. **Read Documentation**: See `README.md` for full API reference
3. **View Tests**: Check `src/__tests__/` for usage examples
4. **Open an Issue**: [GitHub Issues](https://github.com/anupriya13/react-native-ai-quiz/issues)

## ✅ Quick Checklist

Before using the component, make sure you have:

- [ ] Azure OpenAI resource created
- [ ] Model deployed (gpt-35-turbo or gpt-4)
- [ ] Endpoint URL copied
- [ ] API key copied
- [ ] Deployment name noted
- [ ] Package installed: `npm install react-native-ai-quiz`
- [ ] Dependencies installed: `npm install react react-native axios`
- [ ] Configuration object created correctly (as JavaScript object, not string)

## 🎉 You're Ready!

Once you have all the above, your basic implementation should work:

```javascript
import AIQuiz from 'react-native-ai-quiz';

const azureConfig = {
  endpoint: 'https://your-resource.openai.azure.com',
  apiKey: 'your-api-key',
  deploymentName: 'gpt-35-turbo',
};

// In your render method:
<AIQuiz
  azureConfig={azureConfig}
  topic="Any topic you want"
  onQuizComplete={(results) => console.log(results)}
/>
```

Happy quizzing! 🎯