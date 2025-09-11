# AI Quiz Example App

This is an example React Native app demonstrating the usage of `react-native-ai-quiz` module with secure configuration.

## Features Demonstrated

- **🔐 Secure Azure OpenAI configuration** (environment variables)
- Quiz generation with customizable topics and difficulty
- Interactive quiz interface
- Real-time answer selection
- Score calculation and results display
- Question explanations after completion
- Configuration status monitoring

## Setup

1. Install dependencies:
```bash
npm install
```

2. **Configure Azure OpenAI credentials securely**:
```bash
# Copy the environment template
cp .env.example .env

# Edit .env with your actual credentials
# AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com
# AZURE_OPENAI_API_KEY=your-api-key-here
# AZURE_OPENAI_DEPLOYMENT_NAME=gpt-35-turbo
# AZURE_OPENAI_API_VERSION=2023-12-01-preview
```

3. Start the Metro bundler:
```bash
npm run start
```

4. Run on your preferred platform:
```bash
# For Android
npm run android

# For iOS  
npm run ios
```

## 🔐 Secure Configuration

This app uses environment variables to securely store Azure OpenAI credentials:

### Quick Setup
1. **Copy environment template**: `cp .env.example .env`
2. **Update credentials**: Edit `.env` with your Azure OpenAI details
3. **Run the app**: The configuration status will show ✅ if properly configured

### Getting Azure OpenAI Credentials
- **Endpoint**: Azure Portal → Your OpenAI Resource → Keys and Endpoint
- **API Key**: Same section, copy KEY 1 or KEY 2
- **Deployment Name**: Azure OpenAI Studio → Your model deployment name
- **API Version**: Use `2024-02-15-preview` for latest features

### Security Features
- ✅ No hardcoded credentials in source code
- ✅ `.env` files excluded from version control
- ✅ Real-time configuration status monitoring
- ✅ Clear setup instructions and error messages

## Usage

1. **Configure credentials**: Follow the setup instructions above
2. **Enter a topic**: e.g., "React Native", "JavaScript", "Python"
3. **Set question count**: 1-20 questions
4. **Choose difficulty**: easy, medium, or hard
5. **Generate quiz**: App will create questions using Azure OpenAI
6. **Take the quiz**: Answer all questions by tapping options
7. **View results**: See your score with explanations

## Configuration Status

The app displays real-time configuration status:
- ✅ **Azure OpenAI Configured**: Ready to generate quizzes
- ⚠️ **Configuration Required**: Update .env file with credentials

## Features

- **🔐 Secure configuration**: Environment variables for credentials
- **📊 Real-time status**: Shows configuration state
- **⚡ Loading states**: Loading indicator during quiz generation
- **🎯 Answer tracking**: Highlights selected answers
- **📈 Score calculation**: Final score with percentage
- **💡 Explanations**: Detailed explanations after completion
- **📱 Responsive design**: Works on phones and tablets

## Troubleshooting

### Configuration Issues
- **"Configuration Required" warning**: 
  - Ensure `.env` file exists in the example directory
  - Check all environment variables are set correctly
  - Restart Metro bundler: `npx react-native start --reset-cache`

### Quiz Generation Fails
- Verify Azure OpenAI credentials in `.env`
- Check internet connectivity
- Ensure your Azure OpenAI deployment is active

### Build Issues
- Install dependencies: `npm install --legacy-peer-deps`
- Clear Metro cache: `npx react-native start --reset-cache`
- Check TypeScript configuration

## Security

For detailed security information, see [SECURITY.md](../SECURITY.md).

**Important**: Never commit `.env` files to version control!

## Code Structure

- `App.tsx`: Main application with secure configuration
- `.env.example`: Environment template
- `types/env.d.ts`: TypeScript declarations for environment variables
- `babel.config.js`: Configured with react-native-dotenv
- `tsconfig.json`: TypeScript configuration for environment variables

## Support

For issues or questions:
1. Check the [Security Guide](../SECURITY.md)
2. Review the main [README](../README.md)
3. Open an issue (without sensitive data)