# react-native-ai-quiz

Cross-platform React Native module that generates AI-powered quiz questions dynamically using Azure OpenAI.

## Features

- 🤖 AI-powered quiz generation using Azure OpenAI
- 📱 Cross-platform support (iOS & Android)
- 🔐 **Secure configuration** with environment variables
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

### Platform Compatibility

This module works on all React Native platforms:

- ✅ **iOS** - Full support
- ✅ **Android** - Full support  
- ✅ **Windows** - Full support with standard React Native CLI
- ✅ **macOS** - Compatible with React Native macOS
- ✅ **Web** - Compatible with React Native Web

## 🪟 Windows Development Guide

**🚀 One-Command Setup for Windows:**
```bash
git clone https://github.com/anupriya13/react-native-ai-quiz.git
cd react-native-ai-quiz
npm run setup:windows  # Automated Windows setup with all dependencies
```

**⚡ Quick Start Options:**
```bash
# Option 1: Automated (Recommended)
npm run setup:windows          # Complete Windows setup
npm run example:start           # Start Metro bundler
npm run example:android         # Run on Android (new terminal)

# Option 2: Manual Setup
cd example
npm install --legacy-peer-deps  # Windows-compatible dependency installation
npm start                       # Start Metro
npm run android                 # Run app (new terminal)

# Option 3: All-in-one (starts setup + Metro)
npm run example:windows
```

**Configure Azure OpenAI:**
Edit `example/App.tsx` lines 28-33 with your Azure OpenAI credentials:
```typescript
const azureConfig: AzureOpenAIConfig = {
  endpoint: 'https://your-resource.openai.azure.com',
  apiKey: 'your-api-key-here',
  deploymentName: 'gpt-35-turbo',
  apiVersion: '2023-12-01-preview',
};
```

**🔧 Windows Compatibility Features:**
- ✅ **Windows-specific setup script** (`setup:windows`) handles all dependencies
- ✅ **Metro config optimized** for Windows with proper path handling
- ✅ **Legacy peer deps support** for Windows dependency resolution  
- ✅ **Multiple setup options** (automated, manual, step-by-step)
- ✅ **Comprehensive troubleshooting** for common Windows issues
- ✅ **Works with Command Prompt and PowerShell**

**🆘 Common Windows Issues:**
- **"No Metro config found"**: Fixed with included metro.config.js
- **npm install fails**: Use `npm install --legacy-peer-deps`
- **Port 8081 busy**: Run `npx kill-port 8081`
- **Android issues**: Ensure Android Studio and emulator are properly configured

📚 **Complete Windows guide**: [WINDOWS_GUIDE.md](WINDOWS_GUIDE.md) - Comprehensive setup, troubleshooting, and development workflow for Windows users.

## 🔐 Secure Setup

### Azure OpenAI Configuration

Before using this module, you need to set up Azure OpenAI:

1. Create an Azure OpenAI resource in the Azure portal
2. Deploy a model (e.g., GPT-3.5-turbo or GPT-4)
3. Get your endpoint URL, API key, and deployment name

### Environment Variables (Recommended)

For production apps, use environment variables:

```bash
# .env
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com
AZURE_OPENAI_API_KEY=your-api-key-here
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-35-turbo
AZURE_OPENAI_API_VERSION=2023-12-01-preview
```

See [SECURITY.md](SECURITY.md) for complete security setup guide.

## Usage

### Secure Usage (Recommended)

```typescript
import { ReactNativeAIQuiz } from 'react-native-ai-quiz';
import { AZURE_OPENAI_ENDPOINT, AZURE_OPENAI_API_KEY, AZURE_OPENAI_DEPLOYMENT_NAME } from '@env';

// Configure securely with environment variables
const azureConfig = {
  endpoint: AZURE_OPENAI_ENDPOINT,
  apiKey: AZURE_OPENAI_API_KEY,
  deploymentName: AZURE_OPENAI_DEPLOYMENT_NAME,
  apiVersion: '2023-12-01-preview',
};

const aiQuiz = new ReactNativeAIQuiz();
const quiz = await aiQuiz.generateQuiz({
  topic: 'React Native',
  numberOfQuestions: 5,
  difficulty: 'medium',
  azureConfig,
});
```

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

## Local Testing

Want to test the module locally? We've made it super easy! 🚀

### 🎮 Quick Demo (No Azure OpenAI needed)
```bash
git clone https://github.com/anupriya13/react-native-ai-quiz.git
cd react-native-ai-quiz
npm run setup
npm run demo  # Tests all features with sample data
```

### 🧪 Full Testing (With your Azure OpenAI)
```bash
# 1. Update credentials in test-local.js
# 2. Test the core module
npm run test-local

# 3. Test the React Native app
npm run example
cd example && npm run android
```

📖 **For detailed instructions**: See [QUICK_START.md](QUICK_START.md) or [LOCAL_TESTING_GUIDE.md](LOCAL_TESTING_GUIDE.md)

## Local Testing

Want to test the module locally? We've made it super easy! 🚀

### Quick Start

1. **Clone and setup:**
```bash
git clone https://github.com/anupriya13/react-native-ai-quiz.git
cd react-native-ai-quiz
npm run setup
```

2. **Configure Azure OpenAI:**
   - Update credentials in `test-local.js` and `example/App.tsx`
   - Get your credentials from [Azure Portal](https://portal.azure.com)

3. **Test the module:**
```bash
npm run test-local
```

4. **Test the React Native app:**
```bash
npm run example
# In another terminal: cd example && npm run android
```

### What You'll Need

- **Azure OpenAI Resource**: Create one at [Azure Portal](https://portal.azure.com)
- **Model Deployment**: Deploy GPT-3.5-turbo or GPT-4 in [Azure OpenAI Studio](https://oai.azure.com)
- **Credentials**: Get endpoint URL, API key, and deployment name

### Testing Options

1. **Core Module Test** (`npm run test-local`):
   - Tests connection to Azure OpenAI
   - Validates quiz generation
   - Tests utility functions

2. **React Native App** (`npm run example`):
   - Full interactive demo
   - Mobile UI testing
   - Real-time quiz generation

3. **Manual Testing**: Follow the detailed guide in `LOCAL_TESTING_GUIDE.md`

### Troubleshooting

- **Connection issues**: Check your Azure OpenAI credentials
- **Build errors**: Run `npm run build` first
- **App crashes**: Update config in `example/App.tsx`

For detailed instructions, see [LOCAL_TESTING_GUIDE.md](LOCAL_TESTING_GUIDE.md).

## Example App

Check out the example app in the `example/` directory for a complete implementation:

```bash
# Setup and start Metro bundler
cd example
npm install --legacy-peer-deps
npm start

# In a new terminal: Launch the app on Android
npm run android
```

**Windows Users**: See the comprehensive [Windows Development Guide](WINDOWS_GUIDE.md) for setup instructions.

**Important**: Starting Metro bundler is just the first step. You need to launch the app on a device:
- Press `a` in the Metro terminal to run on Android
- Or run `npm run android` in a separate terminal
- Ensure Android emulator is running or device is connected

The example app demonstrates:
- Azure OpenAI configuration
- Quiz generation with different topics and difficulties
- Interactive quiz taking with answer selection
- Score calculation and result display
- Question explanations

## 🔐 Security

### Important Security Considerations

- **Never expose API keys**: Don't hardcode Azure OpenAI credentials in your source code
- **Use environment variables**: Store sensitive configuration securely
- **Version control**: Ensure `.env` files are in `.gitignore`
- **Production deployment**: Consider server-side proxy for maximum security

### Security Best Practices

```typescript
// ❌ DON'T: Hardcode credentials
const azureConfig = {
  apiKey: 'sk-1234567890abcdef', // Never do this!
};

// ✅ DO: Use environment variables
import { AZURE_OPENAI_API_KEY } from '@env';
const azureConfig = {
  apiKey: AZURE_OPENAI_API_KEY,
};
```

### Complete Security Setup

For detailed security configuration, see [SECURITY.md](SECURITY.md):
- Environment variable setup
- Production deployment strategies
- Security checklist
- Troubleshooting guide

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

> **Important**: See [SECURITY.md](SECURITY.md) for comprehensive security setup guide.

- ✅ Use environment variables for Azure OpenAI credentials
- ✅ Never commit API keys to version control
- ✅ Implement proper error handling to avoid credential exposure
- ✅ Consider server-side proxy for production applications
- ✅ Validate and sanitize user inputs before generating quizzes

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

## Publishing to NPM

This package is ready for NPM publishing with the following setup:

### Package Configuration
- **Entry Point**: `lib/index.js` (compiled TypeScript)
- **TypeScript Definitions**: `lib/index.d.ts`
- **Published Files**: Only essential files (`lib/`, `src/`, `README.md`, `LICENSE`)
- **Version**: Currently v1.0.0

### Publishing Steps

```bash
# 1. Build the package
npm run build

# 2. Update version (if needed)
npm version patch|minor|major

# 3. Publish to NPM
npm publish

# For scoped packages (if moving to @username/react-native-ai-quiz)
npm publish --access public
```

### NPM Scripts
- `npm run build` - Compiles TypeScript to lib/
- `npm run prepare` - Automatically runs build before publishing
- `npm run demo` - Test all features without Azure OpenAI
- `npm run test-local` - Test with Azure OpenAI credentials

### Requirements for Publishing
- NPM account with publishing permissions
- Package name availability on NPM registry
- All dependencies properly declared in package.json
- TypeScript compilation successful

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
