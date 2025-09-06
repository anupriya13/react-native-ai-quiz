# react-native-ai-quiz

[![npm version](https://badge.fury.io/js/react-native-ai-quiz.svg)](https://badge.fury.io/js/react-native-ai-quiz)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Cross-platform React Native module that generates AI-powered quiz questions dynamically using Azure OpenAI (GPT-4/3.5). Create engaging, multiple-choice quizzes on any topic with customizable difficulty levels and styling.

## Features

- 🧠 **AI-Powered**: Generates quiz questions using Azure OpenAI (GPT-4/3.5)
- 📱 **Cross-Platform**: Works on both iOS and Android
- 🎨 **Customizable**: Extensive styling options for UI components
- 🔧 **Flexible**: Configurable difficulty levels and question counts
- 📊 **Results Tracking**: Detailed quiz results with explanations
- ⚡ **Easy Integration**: Simple API with minimal setup required

## Installation

```bash
npm install react-native-ai-quiz
```

### Dependencies

This package requires the following peer dependencies:

```bash
npm install react react-native axios
```

## Prerequisites

You'll need an Azure OpenAI resource with a deployed model. Follow these steps:

1. Create an Azure OpenAI resource in the Azure portal
2. Deploy a model (e.g., `gpt-35-turbo` or `gpt-4`)
3. Get your endpoint URL and API key from the Azure portal

## Quick Start

> 📚 **New to the library?** Check out our [Complete Onboarding Guide](ONBOARDING.md) for step-by-step setup instructions!

```javascript
import React from 'react';
import { View } from 'react-native';
import AIQuiz from 'react-native-ai-quiz';

const MyApp = () => {
  // ⚠️ Replace these with your actual Azure OpenAI credentials
  const azureConfig = {
    endpoint: 'https://your-resource.openai.azure.com',  // From Azure Portal
    apiKey: 'your-api-key',                             // From Keys and Endpoint section
    deploymentName: 'gpt-35-turbo',                     // Your model deployment name
    apiVersion: '2024-02-15-preview',                   // Optional
  };

  const handleQuizComplete = (results) => {
    console.log(`Score: ${results.score}/${results.total} (${results.percentage}%)`);
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
```

### ⚡ Need Help Getting Started?

- **First time setup**: [Complete Onboarding Guide](ONBOARDING.md)
- **Azure OpenAI setup**: [Prerequisites section](#prerequisites)
- **API Reference**: [Full documentation below](#api-reference)

## API Reference

### AIQuiz Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `azureConfig` | Object | Yes | - | Azure OpenAI configuration |
| `topic` | String | Yes | - | Quiz topic/subject |
| `difficulty` | String | No | 'medium' | Difficulty level ('easy', 'medium', 'hard') |
| `numberOfQuestions` | Number | No | 5 | Number of questions to generate |
| `onQuizStart` | Function | No | - | Callback when quiz starts |
| `onQuizComplete` | Function | No | - | Callback when quiz completes |
| `style` | Object | No | - | Container style |
| `questionStyle` | Object | No | - | Question text style |
| `optionStyle` | Object | No | - | Option button style |
| `selectedOptionStyle` | Object | No | - | Selected option style |
| `correctOptionStyle` | Object | No | - | Correct answer style |
| `incorrectOptionStyle` | Object | No | - | Incorrect answer style |
| `buttonStyle` | Object | No | - | Navigation button style |
| `loadingStyle` | Object | No | - | Loading container style |

### Azure Config Object

The `azureConfig` prop must be a JavaScript object (not a string). Here's the correct format:

```javascript
// ✅ Correct - Object format
const azureConfig = {
  endpoint: 'https://your-resource.openai.azure.com',  // Required: Your Azure OpenAI endpoint URL
  apiKey: 'your-api-key',                             // Required: Your API key from Azure Portal
  deploymentName: 'gpt-35-turbo',                     // Optional: Default is 'gpt-35-turbo'
  apiVersion: '2024-02-15-preview'                    // Optional: Default is '2024-02-15-preview'
};

// Then pass it to the component:
<AIQuiz azureConfig={azureConfig} ... />
```

**❌ Common Mistakes:**
```javascript
// Wrong - String format
azureConfig="endpoint: https://..."

// Wrong - Template literal confusion  
azureConfig={{endpoint: https://your-resource.openai.azure.com}}

// Wrong - Missing quotes around values
azureConfig={{endpoint: https://your-resource.openai.azure.com, apiKey: your-key}}
```

**✅ Where to get these values:**
- **endpoint**: Azure Portal → Your OpenAI Resource → Keys and Endpoint → Endpoint
- **apiKey**: Azure Portal → Your OpenAI Resource → Keys and Endpoint → Key 1 or Key 2  
- **deploymentName**: Azure Portal → Your OpenAI Resource → Model deployments → Your deployment name

### Quiz Results Object

```javascript
{
  score: 4,                    // Number of correct answers
  total: 5,                    // Total number of questions
  percentage: 80,              // Score percentage
  detailed: [                  // Detailed results for each question
    {
      questionId: 1,
      question: "What is a closure in JavaScript?",
      userAnswer: "A",
      correctAnswer: "A",
      isCorrect: true,
      explanation: "A closure gives you access to an outer function's scope..."
    },
    // ... more questions
  ]
}
```

## Advanced Usage

### Custom Styling

```javascript
<AIQuiz
  azureConfig={azureConfig}
  topic="React Native Development"
  style={{ backgroundColor: '#f0f0f0' }}
  questionStyle={{ 
    fontSize: 20, 
    color: '#2c3e50',
    fontWeight: 'bold' 
  }}
  optionStyle={{ 
    backgroundColor: '#ecf0f1',
    borderRadius: 10 
  }}
  selectedOptionStyle={{ 
    backgroundColor: '#3498db',
    borderColor: '#2980b9' 
  }}
  correctOptionStyle={{ 
    backgroundColor: '#2ecc71' 
  }}
  incorrectOptionStyle={{ 
    backgroundColor: '#e74c3c' 
  }}
  buttonStyle={{ 
    backgroundColor: '#9b59b6' 
  }}
/>
```

### Handling Quiz Events

```javascript
const handleQuizStart = (quiz) => {
  console.log('Quiz started:', quiz.topic);
  console.log('Number of questions:', quiz.questions.length);
};

const handleQuizComplete = (results) => {
  console.log(`Final Score: ${results.percentage}%`);
  
  // Save results to storage or send to analytics
  results.detailed.forEach((result, index) => {
    console.log(`Q${index + 1}: ${result.isCorrect ? '✓' : '✗'}`);
  });
};
```

### Using the AzureOpenAI Service Directly

```javascript
import { AzureOpenAI } from 'react-native-ai-quiz';

const azureClient = new AzureOpenAI({
  endpoint: 'https://your-resource.openai.azure.com',
  apiKey: 'your-api-key',
  deploymentName: 'gpt-4',
});

// Generate quiz programmatically
const quiz = await azureClient.generateQuiz('Machine Learning', 'hard', 10);
console.log(quiz);
```

## Example App

Check out the complete example app in the `example/` directory:

```javascript
import App from 'react-native-ai-quiz/example/App';
```

The example app includes:
- Configuration form for Azure OpenAI settings
- Topic and difficulty selection
- Full quiz flow demonstration
- Results display

## Error Handling

The component handles various error scenarios:

- Invalid Azure OpenAI configuration
- Network connectivity issues
- API rate limiting
- Malformed responses from OpenAI

```javascript
// Monitor for errors
const handleQuizStart = (quiz) => {
  if (!quiz) {
    console.error('Failed to generate quiz');
  }
};
```

## Troubleshooting

### Common Issues

1. **"Azure OpenAI endpoint and API key are required"**
   - Ensure you've provided valid `endpoint` and `apiKey` in the config
   - Make sure `azureConfig` is a JavaScript object, not a string:
   ```javascript
   // ❌ Wrong
   azureConfig="endpoint: https://..."
   
   // ✅ Correct  
   azureConfig={{
     endpoint: 'https://your-resource.openai.azure.com',
     apiKey: 'your-api-key'
   }}
   ```

2. **"Failed to generate quiz: Request failed"**
   - Check your Azure OpenAI deployment is active
   - Verify your API key has the correct permissions
   - Ensure your deployment name matches your Azure configuration
   - Verify the endpoint URL is correct (should end with `.openai.azure.com`)

3. **Network timeout errors**
   - The component uses a 30-second timeout for API calls
   - Check your network connectivity
   - Verify your Azure OpenAI endpoint URL is correct

4. **"Deployment not found"**
   - Make sure `deploymentName` matches exactly what you named your deployment in Azure
   - Check that your model deployment is in "Succeeded" state in Azure Portal

### Azure OpenAI Setup

1. Go to [Azure Portal](https://portal.azure.com)
2. Create an "Azure OpenAI" resource
3. Deploy a model (gpt-35-turbo or gpt-4)
4. Get your endpoint and keys from the resource overview
5. Use the endpoint URL and one of the keys in your config

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## License

MIT © [Anupriya Verma](https://github.com/anupriya13)

## Support

- 📚 [Documentation](https://github.com/anupriya13/react-native-ai-quiz#readme)
- 🐛 [Issue Tracker](https://github.com/anupriya13/react-native-ai-quiz/issues)
- 💬 [Discussions](https://github.com/anupriya13/react-native-ai-quiz/discussions)
