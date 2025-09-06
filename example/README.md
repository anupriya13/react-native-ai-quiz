# React Native AI Quiz Example

This is a simple React Native example app demonstrating how to use the `react-native-ai-quiz` module.

## Features Demonstrated

- Configuring Azure OpenAI credentials
- Generating quiz questions from a theme
- Displaying questions with multiple-choice options
- Highlighting correct answers
- Error handling and loading states

## Setup

1. Make sure you have React Native development environment set up
2. Install dependencies:
   ```bash
   npm install
   ```
3. For iOS:
   ```bash
   npx pod-install ios
   npm run ios
   ```
4. For Android:
   ```bash
   npm run android
   ```

## Configuration

1. Launch the app
2. Enter your Azure OpenAI API key and endpoint
3. Tap "Configure" to set up the connection
4. Enter a theme for your quiz (e.g., "help user learn English")
5. Set the number of questions (1-10)
6. Tap "Generate Quiz" to create questions

## Note

You'll need valid Azure OpenAI credentials to use this example. The app will guide you through the configuration process.