# AI Quiz Example App

This is an example React Native app demonstrating the usage of `react-native-ai-quiz` module.

## Features Demonstrated

- Azure OpenAI configuration setup
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

Before using the app, you'll need to provide your Azure OpenAI configuration:

1. **Endpoint**: Your Azure OpenAI resource endpoint (e.g., `https://your-resource.openai.azure.com`)
2. **API Key**: Your Azure OpenAI API key
3. **Deployment Name**: The name of your deployed model (e.g., `gpt-35-turbo`)

## Usage

1. Fill in your Azure OpenAI configuration in the app
2. Enter a topic for your quiz (e.g., "React Native", "JavaScript", "Python")
3. Set the number of questions (1-20)
4. Choose difficulty level (easy, medium, hard)
5. Tap "Generate Quiz" to create questions
6. Answer all questions by tapping on the options
7. Tap "Submit Quiz" to see your results

## Features

- **Real-time validation**: The app checks that all required fields are filled
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