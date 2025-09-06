# react-native-ai-quiz

Cross-platform React Native module that generates AI-powered quiz questions dynamically using Azure OpenAI.

## Features

- 🤖 AI-powered quiz generation using Azure OpenAI
- 📱 Cross-platform support (iOS & Android)
- 🎯 Customizable difficulty levels (easy, medium, hard)
- 📝 Multiple question types support
- 🔄 Flexible initialization options
- ✅ Built-in quiz validation and scoring
- 📊 Question shuffling capabilities
- 💯 TypeScript support

## Installation

```bash
npm install react-native-ai-quiz
```

### Dependencies

This package requires the following peer dependencies:

```bash
npm install react react-native
```

## Setup

### Azure OpenAI Configuration

Before using this module, you need to set up Azure OpenAI:

1. Create an Azure OpenAI resource in the Azure portal
2. Deploy a model (e.g., GPT-3.5-turbo or GPT-4)
3. Get your endpoint URL, API key, and deployment name

## Usage

### Basic Usage

```typescript
import { ReactNativeAIQuiz, AzureOpenAIConfig } from 'react-native-ai-quiz';

// Initialize with Azure OpenAI configuration
const azureConfig: AzureOpenAIConfig = {
  endpoint: 'https://your-resource.openai.azure.com',
  apiKey: 'your-api-key',
  deploymentName: 'your-deployment-name',
  apiVersion: '2023-12-01-preview' // optional
};

const aiQuiz = new ReactNativeAIQuiz();
aiQuiz.initialize(azureConfig);

// Generate a quiz
const quiz = await aiQuiz.generateQuiz({
  topic: 'React Native',
  numberOfQuestions: 5,
  difficulty: 'medium'
});

console.log('Generated quiz:', quiz);
```

### Advanced Usage with Inline Configuration

```typescript
import { ReactNativeAIQuiz } from 'react-native-ai-quiz';

const aiQuiz = new ReactNativeAIQuiz();

// Generate quiz with inline Azure configuration
const quiz = await aiQuiz.generateQuiz({
  topic: 'JavaScript ES6',
  numberOfQuestions: 10,
  difficulty: 'hard',
  questionType: 'multiple-choice',
  azureConfig: {
    endpoint: 'https://your-resource.openai.azure.com',
    apiKey: 'your-api-key',
    deploymentName: 'your-deployment-name'
  }
});
```

### Using the Default Instance

```typescript
import { AIQuiz } from 'react-native-ai-quiz';

// Use the default exported instance
AIQuiz.initialize(azureConfig);
const quiz = await AIQuiz.generateQuiz({
  topic: 'Python Programming',
  numberOfQuestions: 8,
  difficulty: 'easy'
});
```

### Quiz Validation and Scoring

```typescript
import { ReactNativeAIQuiz } from 'react-native-ai-quiz';

// Validate individual questions
const isValid = ReactNativeAIQuiz.validateQuestion(question);

// Calculate quiz score
const userAnswers = [0, 2, 1, 3, 0]; // User's selected answer indices
const results = ReactNativeAIQuiz.calculateScore(questions, userAnswers);
console.log(`Score: ${results.correct}/${results.total} (${results.percentage}%)`);

// Shuffle questions
const shuffledQuestions = ReactNativeAIQuiz.shuffleQuestions(questions);
```

### Testing Connection

```typescript
const aiQuiz = new ReactNativeAIQuiz();
aiQuiz.initialize(azureConfig);

const isConnected = await aiQuiz.testConnection();
if (isConnected) {
  console.log('Successfully connected to Azure OpenAI');
} else {
  console.log('Failed to connect to Azure OpenAI');
}
```

## API Reference

### Types

#### `QuizQuestion`
```typescript
interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}
```

#### `QuizConfig`
```typescript
interface QuizConfig {
  topic: string;
  numberOfQuestions: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  questionType?: 'multiple-choice' | 'true-false' | 'mixed';
}
```

#### `AzureOpenAIConfig`
```typescript
interface AzureOpenAIConfig {
  endpoint: string;
  apiKey: string;
  deploymentName: string;
  apiVersion?: string;
}
```

#### `QuizResponse`
```typescript
interface QuizResponse {
  questions: QuizQuestion[];
  topic: string;
  totalQuestions: number;
}
```

### Methods

#### `initialize(config: AzureOpenAIConfig): void`
Initialize the quiz generator with Azure OpenAI configuration.

#### `generateQuiz(config: QuizConfig | GenerateQuizOptions): Promise<QuizResponse>`
Generate quiz questions based on the provided configuration.

#### `testConnection(): Promise<boolean>`
Test the connection to Azure OpenAI.

#### `validateQuestion(question: QuizQuestion): boolean` (Static)
Validate a quiz question structure.

#### `shuffleQuestions(questions: QuizQuestion[]): QuizQuestion[]` (Static)
Shuffle an array of quiz questions.

#### `calculateScore(questions: QuizQuestion[], userAnswers: number[]): ScoreResult` (Static)
Calculate the quiz score based on user answers.

## Example App

Check out the example app in the `example/` directory for a complete implementation:

```bash
cd example
npm install
npm run start
```

The example app demonstrates:
- Azure OpenAI configuration
- Quiz generation with different topics and difficulties
- Interactive quiz taking with answer selection
- Score calculation and result display
- Question explanations

## Error Handling

The module provides detailed error messages for common issues:

```typescript
try {
  const quiz = await aiQuiz.generateQuiz(config);
} catch (error) {
  if (error.message.includes('Azure OpenAI API Error')) {
    // Handle API-related errors
  } else if (error.message.includes('Invalid response format')) {
    // Handle parsing errors
  } else {
    // Handle other errors
  }
}
```

## Security Notes

- Never expose your Azure OpenAI API key in client-side code
- Store API keys securely using environment variables or secure storage
- Consider implementing server-side proxy for production apps
- Validate and sanitize user inputs before generating quizzes

## Troubleshooting

### Common Issues

1. **Connection Failed**: Verify your Azure OpenAI endpoint, API key, and deployment name
2. **Invalid JSON Response**: The AI model might return malformed JSON. Try adjusting the prompt or using a different model
3. **Rate Limiting**: Azure OpenAI has rate limits. Implement retry logic with exponential backoff
4. **Network Errors**: Ensure your app has internet connectivity

### Debug Mode

Enable detailed logging by checking error messages:

```typescript
try {
  const quiz = await aiQuiz.generateQuiz(config);
} catch (error) {
  console.error('Quiz generation failed:', error.message);
}
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue on the [GitHub repository](https://github.com/anupriya13/react-native-ai-quiz/issues).

## Changelog

### v1.0.0
- Initial release
- Azure OpenAI integration
- Cross-platform React Native support
- TypeScript support
- Example app included
