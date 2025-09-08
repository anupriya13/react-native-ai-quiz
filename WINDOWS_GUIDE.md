# Windows Development Guide

This guide provides comprehensive instructions for setting up and running the React Native AI Quiz module on Windows.

## 🚀 Quick Start Options

### Option 1: Automated Windows Setup (Recommended)
```bash
git clone https://github.com/anupriya13/react-native-ai-quiz.git
cd react-native-ai-quiz
npm run setup:windows
```
This runs a Windows-optimized setup script that handles all dependencies and common issues.

### Option 2: Manual Setup
```bash
git clone https://github.com/anupriya13/react-native-ai-quiz.git
cd react-native-ai-quiz
npm install
cd example
npm install --legacy-peer-deps
npm start
```

### Option 3: Step-by-Step Commands
```bash
# Navigate to example directory
cd react-native-ai-quiz/example

# Install dependencies with Windows compatibility
npm install --legacy-peer-deps

# Start Metro bundler
npm start

# In a new Command Prompt or PowerShell window (keep Metro running):
npm run android
```

## 📱 Launching the App

**Important**: The Metro bundler starting doesn't mean the app is running! You need to launch it on a device/emulator:

### After Metro Starts:
1. **Option A**: In the Metro terminal, press `a` to run on Android
2. **Option B**: Open a new terminal and run:
   ```bash
   cd react-native-ai-quiz/example
   npm run android
   ```
3. **Option C**: Use the quick command from root:
   ```bash
   npm run example:launch-android
   ```

### Prerequisites for App Launch:
- Android emulator running (from Android Studio)
- OR physical Android device connected with USB debugging enabled
- Run `adb devices` to verify device is connected

## 🔧 Windows-Specific Requirements

### Prerequisites
1. **Node.js**: Version 16 or higher
2. **npm**: Version 7 or higher
3. **Android Studio**: With Android SDK configured
4. **React Native CLI**: `npm install -g react-native-cli`
5. **Java Development Kit (JDK)**: Version 11 or higher

### Environment Setup
1. **Set ANDROID_HOME environment variable**:
   ```
   ANDROID_HOME=C:\Users\YourUsername\AppData\Local\Android\Sdk
   ```

2. **Add Android SDK to PATH**:
   ```
   %ANDROID_HOME%\platform-tools
   %ANDROID_HOME%\tools
   %ANDROID_HOME%\tools\bin
   ```

3. **Verify setup**:
   ```bash
   adb --version
   react-native --version
   ```

## 📱 Running the App

### Start Metro Bundler
```bash
cd react-native-ai-quiz
npm run example:start
```

### Run on Android Device/Emulator
In a new terminal window:
```bash
npm run example:android
```

### Run on iOS (if on macOS via Windows Subsystem)
```bash
npm run example:ios
```

## 🛠️ Windows-Specific Scripts

We've added several Windows-optimized npm scripts:

```bash
npm run setup:windows      # Complete Windows setup
npm run example:setup      # Install example dependencies only
npm run example:start      # Start Metro bundler
npm run example:android    # Run on Android
npm run example:windows    # Setup + start (one command)
```

## 🔧 Common Windows Issues & Solutions

### 1. "No Metro config found" Error
**Solution**: The example app includes `metro.config.js`. If you still see this error:
```bash
# Ensure you're in the example directory
cd react-native-ai-quiz/example
npm start

# Or clear Metro cache
npx react-native start --reset-cache
```

### 2. npm install Fails
**Solution**: Use legacy peer dependencies:
```bash
npm install --legacy-peer-deps
```

### 3. Command Not Found Errors
**Solution**: Check your PATH environment variables and ensure:
- Node.js is in PATH
- Android SDK tools are in PATH
- React Native CLI is globally installed

### 4. Port Already in Use (8081)
**Solution**: Kill the process or use a different port:
```bash
# Kill process on port 8081
npx kill-port 8081

# Or start Metro on different port
npx react-native start --port 8082
```

### 5. Android Emulator Issues
**Solutions**:
- Ensure Android Studio AVD is running
- Check Android SDK installation
- Verify USB debugging is enabled (for physical devices)
- Try: `adb devices` to list connected devices

### 6. Building for Release
```bash
cd android
./gradlew assembleRelease
```

### 7. Clear All Caches
```bash
# Clear npm cache
npm cache clean --force

# Clear Metro cache
npx react-native start --reset-cache

# Clear React Native cache
npx react-native clean

# Clean and rebuild (in android directory)
cd android && ./gradlew clean && cd ..
```

## 🔐 Azure OpenAI Configuration

Edit `example/App.tsx` (lines 28-33) with your Azure OpenAI credentials:

```typescript
const azureConfig: AzureOpenAIConfig = {
  endpoint: 'https://your-resource.openai.azure.com',
  apiKey: 'your-api-key-here',
  deploymentName: 'gpt-35-turbo',
  apiVersion: '2023-12-01-preview',
};
```

## 🪟 Windows Command Prompt vs PowerShell

Both work, but PowerShell is recommended for better Unicode support and modern features.

### Command Prompt
```cmd
cd react-native-ai-quiz
npm run setup:windows
```

### PowerShell
```powershell
Set-Location react-native-ai-quiz
npm run setup:windows
```

## 📂 File Paths and Windows

The metro.config.js uses `path.resolve()` for proper Windows path handling. All file operations should work correctly with Windows backslash paths.

## 🔄 Development Workflow

1. **Initial Setup** (once):
   ```bash
   git clone https://github.com/anupriya13/react-native-ai-quiz.git
   cd react-native-ai-quiz
   npm run setup:windows
   ```

2. **Daily Development**:
   ```bash
   npm run example:start    # Terminal 1: Start Metro
   npm run example:android  # Terminal 2: Run on Android
   ```

3. **Testing Changes**:
   ```bash
   # Test core module
   npm run demo
   
   # Test with real Azure OpenAI
   npm run test-local
   ```

## 🆘 Getting Help

If you're still having issues:

1. **Check the logs**: Look for specific error messages
2. **Verify environment**: Run `npm run setup:windows` again
3. **Clear caches**: Run cache clearing commands above
4. **Check GitHub Issues**: [Report new issues](https://github.com/anupriya13/react-native-ai-quiz/issues)

## 🎯 Success Checklist

- [ ] Node.js and npm installed and in PATH
- [ ] Android Studio configured with SDK
- [ ] React Native CLI installed globally
- [ ] Environment variables set (ANDROID_HOME, PATH)
- [ ] Dependencies installed with `--legacy-peer-deps`
- [ ] Metro bundler starts without errors
- [ ] Android emulator/device connected
- [ ] App builds and runs successfully

## 📱 Supported Windows Versions

- ✅ Windows 10 (version 1903 or higher)
- ✅ Windows 11
- ✅ Windows Server 2019/2022
- ⚠️  Windows 8.1 (limited support)

## 🔗 Useful Links

- [React Native Environment Setup](https://reactnative.dev/docs/environment-setup)
- [Android Studio Download](https://developer.android.com/studio)
- [Node.js Download](https://nodejs.org/)
- [Git for Windows](https://git-scm.com/download/win)