# AI Quiz Example App

This is an example React Native app demonstrating the usage of `react-native-ai-quiz` module.

## Features Demonstrated

- Azure OpenAI configuration setup (in code)
- Quiz generation with customizable topics and difficulty
- Interactive quiz interface
- Real-time answer selection
- Score calculation and results display
- Question explanations after completion

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the Metro bundler:
```bash
npm run start
```

3. Run on your preferred platform:
```bash
# For Android
npm run android

# For iOS  
npm run ios
```

## Configuration

Before using the app, you'll need to configure your Azure OpenAI credentials in the code:

1. Open `App.tsx` 
2. Find the `azureConfig` object (around line 28)
3. Replace the placeholder values with your actual Azure OpenAI credentials:
   - **Endpoint**: Your Azure OpenAI resource endpoint (e.g., `https://your-resource.openai.azure.com`)
   - **API Key**: Your Azure OpenAI API key
   - **Deployment Name**: The name of your deployed model (e.g., `gpt-35-turbo`)

```typescript
const azureConfig: AzureOpenAIConfig = {
  endpoint: 'https://your-resource.openai.azure.com',
  apiKey: 'your-actual-api-key',
  deploymentName: 'your-deployment-name',
  apiVersion: '2023-12-01-preview',
};
```

## Usage

1. Configure your Azure OpenAI credentials in `App.tsx` (see Configuration section above)
2. Enter a topic for your quiz (e.g., "React Native", "JavaScript", "Python")
3. Set the number of questions (1-20)
4. Choose difficulty level (easy, medium, hard)
5. Tap "Generate Quiz" to create questions
6. Answer all questions by tapping on the options
7. Tap "Submit Quiz" to see your results

## Features

- **Simplified setup**: Configuration is done once in the code, not through UI forms
- **Loading states**: Shows loading indicator while generating questions
- **Answer tracking**: Highlights selected answers and shows correct/incorrect after submission
- **Score calculation**: Displays final score with percentage
- **Explanations**: Shows explanations for each question after completion
- **Responsive design**: Works on both phones and tablets

## Troubleshooting

If you encounter issues:

1. **Quiz generation fails**: Check your Azure OpenAI configuration
2. **Network errors**: Ensure you have internet connectivity
3. **Build issues**: Make sure all dependencies are installed correctly

## Code Structure

- `App.tsx`: Main application component with all quiz functionality
- `package.json`: Dependencies and scripts
- `index.js`: Entry point for React Native
- `babel.config.js`: Babel configuration for React Native
- `tsconfig.json`: TypeScript configuration