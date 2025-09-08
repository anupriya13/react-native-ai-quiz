# Security Configuration Guide

This guide explains how to securely configure Azure OpenAI credentials for the React Native AI Quiz module.

## ⚠️ Security Best Practices

### Never Hardcode Credentials
- **DON'T** put API keys directly in your source code
- **DON'T** commit `.env` files to version control
- **DO** use environment variables for sensitive configuration
- **DO** use different credentials for development, staging, and production

## Environment Variable Setup

### 1. Create Environment File
Copy the example environment file and configure your credentials:

```bash
# In the example/ directory
cp .env.example .env
```

### 2. Configure Your Credentials
Edit the `.env` file with your actual Azure OpenAI credentials:

```bash
# .env
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com
AZURE_OPENAI_API_KEY=your-api-key-here
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-35-turbo
AZURE_OPENAI_API_VERSION=2023-12-01-preview
```

### 3. How to Get These Values

#### Azure OpenAI Endpoint
1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to your Azure OpenAI resource
3. Go to "Keys and Endpoint" section
4. Copy the **Endpoint** URL

#### API Key
1. In the same "Keys and Endpoint" section
2. Copy either **KEY 1** or **KEY 2**

#### Deployment Name
1. Go to "Model deployments" or [Azure OpenAI Studio](https://oai.azure.com)
2. Note the deployment name you created (e.g., `gpt-35-turbo`, `my-chat-model`)

#### API Version
- Use `2024-02-15-preview` for latest features
- Use `2023-12-01-preview` for stable preview (default)
- Use `2023-05-15` for stable GA version

## Code Integration

The module automatically loads configuration from environment variables:

```typescript
import { ReactNativeAIQuiz } from 'react-native-ai-quiz';

// Configuration is automatically loaded from environment variables
const aiQuiz = new ReactNativeAIQuiz();

// Generate quiz - no need to pass credentials
const quiz = await aiQuiz.generateQuiz({
  topic: 'React Native',
  numberOfQuestions: 5,
  difficulty: 'medium'
});
```

## Production Deployment

### React Native Apps
For production React Native apps, consider using:

1. **react-native-config** - For build-time environment variables
2. **@react-native-async-storage/async-storage** - For runtime secure storage
3. **react-native-keychain** - For maximum security with iOS Keychain/Android Keystore

### Example with react-native-config:
```typescript
import Config from 'react-native-config';

const azureConfig = {
  endpoint: Config.AZURE_OPENAI_ENDPOINT,
  apiKey: Config.AZURE_OPENAI_API_KEY,
  deploymentName: Config.AZURE_OPENAI_DEPLOYMENT_NAME,
  apiVersion: Config.AZURE_OPENAI_API_VERSION,
};
```

## Security Checklist

- [ ] `.env` file is in `.gitignore`
- [ ] No API keys in source code
- [ ] Different credentials for dev/staging/prod
- [ ] API keys rotated regularly
- [ ] Network security (HTTPS only)
- [ ] Rate limiting implemented
- [ ] Error handling doesn't expose sensitive data
- [ ] Logs don't contain API keys

## Troubleshooting

### Configuration Not Detected
If you see "Configuration Required" warning:
1. Ensure `.env` file exists in the `example/` directory
2. Check that all environment variables are set
3. Restart Metro bundler: `npx react-native start --reset-cache`
4. Verify babel configuration includes react-native-dotenv plugin

### Environment Variables Not Loading
1. Check babel.config.js includes the dotenv plugin
2. Ensure TypeScript declarations are in `types/env.d.ts`
3. Restart the Metro bundler
4. Verify `.env` file format (no quotes around values)

### Build Errors
If you see TypeScript errors about `@env`:
1. Check `types/env.d.ts` exists and declares the module
2. Update `tsconfig.json` to include the types directory
3. Restart TypeScript language server

## Alternative Configuration Methods

### 1. Direct Configuration (Less Secure)
```typescript
const azureConfig = {
  endpoint: 'https://your-resource.openai.azure.com',
  apiKey: 'your-api-key',
  deploymentName: 'gpt-35-turbo',
  apiVersion: '2023-12-01-preview',
};

const quiz = await aiQuiz.generateQuiz({
  topic: 'JavaScript',
  numberOfQuestions: 5,
  difficulty: 'medium',
  azureConfig, // Pass configuration explicitly
});
```

### 2. Runtime Configuration
```typescript
// Configure once when app starts
aiQuiz.configure(azureConfig);

// Use without passing config each time
const quiz = await aiQuiz.generateQuiz({
  topic: 'React Native',
  numberOfQuestions: 5,
  difficulty: 'medium',
});
```

## Support

For security-related questions or issues:
1. Check this guide first
2. Review the main README.md
3. Open an issue (without including sensitive data)
4. For urgent security matters, contact the maintainers directly