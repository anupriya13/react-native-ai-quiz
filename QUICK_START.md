# Quick Start Guide - Local Testing

## 🚀 Getting Started (3 Simple Steps)

### 1. Setup the Project
```bash
git clone https://github.com/anupriya13/react-native-ai-quiz.git
cd react-native-ai-quiz
npm run setup
```

### 2. Test Without Azure OpenAI (Demo Mode)
```bash
npm run demo
```
This tests all module features using sample data - **no Azure OpenAI required!**

### 3. Test With Your Azure OpenAI
```bash
# Edit test-local.js with your Azure OpenAI credentials
npm run test-local
```

## 📱 Testing the React Native App

```bash
# Setup and start
npm run example

# In another terminal (Android)
cd example && npm run android

# In another terminal (iOS - macOS only)
cd example && npm run ios
```

**Before running the app**: Update your Azure OpenAI config in `example/App.tsx` (lines 28-33)

## 🔧 What You Need

### For Demo Testing (npm run demo)
- Just Node.js - **no Azure OpenAI needed!**

### For Full Testing (npm run test-local)
- Azure OpenAI resource
- Model deployment (GPT-3.5-turbo or GPT-4)
- API credentials (endpoint, key, deployment name)

### For React Native App
- React Native development environment
- Android Studio or Xcode
- Device/emulator

## 📝 Configuration Template

Copy this template for your Azure OpenAI config:

```typescript
const azureConfig = {
  endpoint: 'https://your-resource.openai.azure.com',
  apiKey: 'your-api-key-here',
  deploymentName: 'your-deployment-name',
  apiVersion: '2023-12-01-preview'
};
```

Get these values from:
1. [Azure Portal](https://portal.azure.com) → Your OpenAI Resource
2. "Keys and Endpoint" section

## 🆘 Need Help?

- **Demo fails**: Run `npm run build` first
- **Connection issues**: Check your Azure OpenAI credentials
- **App crashes**: Update config in `example/App.tsx`
- **Build errors**: See `LOCAL_TESTING_GUIDE.md` for detailed troubleshooting

## 📚 More Information

- **Detailed guide**: `LOCAL_TESTING_GUIDE.md`
- **Full documentation**: `README.md`
- **Example screenshots**: See PR description

---

**Ready to start?** Just run `npm run demo` to test without any setup! 🎉