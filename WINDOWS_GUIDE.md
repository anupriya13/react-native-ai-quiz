# Windows Development Guide

This guide provides comprehensive instructions for setting up and running the React Native AI Quiz module on Windows with **Native Windows App Support**.

## 🪟 Platform Options

You can now run the app on multiple platforms:

1. **🪟 Native Windows App (Recommended)** - No emulator needed, runs as a native Windows application
2. **📱 Android** - Requires Android emulator or device
3. **🍎 iOS** - Mac only, requires iOS Simulator

## 🚀 Quick Start Options

### Option 1: Native Windows App (Recommended)
```bash
git clone https://github.com/anupriya13/react-native-ai-quiz.git
cd react-native-ai-quiz
npm run setup:windows

# Start Metro bundler (in one terminal)
npm run example:start

# Launch Windows app (in another terminal)
npm run windows:run
```

### Option 2: Interactive Platform Chooser
```bash
git clone https://github.com/anupriya13/react-native-ai-quiz.git
cd react-native-ai-quiz
npm run setup:windows

# Interactive launcher - choose your platform
npm run windows:launcher
```

### Option 3: Android (Traditional Method)
```bash
git clone https://github.com/anupriya13/react-native-ai-quiz.git
cd react-native-ai-quiz
npm run setup:windows

# Start Metro bundler
npm run example:start

# Launch Android app (new terminal)
npm run example:android
```

## 🪟 Windows Platform Prerequisites

Before running the native Windows app, ensure you have:

- **Windows 10** version 1809 (October 2018 Update) or higher
- **Visual Studio 2019 or 2022** with:
  - MSVC v142/v143 - VS 2019/2022 C++ x64/x86 build tools
  - Windows 10/11 SDK (latest version)
- **Or alternatively**: Build Tools for Visual Studio with C++ tools
- **PowerShell 5** or higher
- **Node.js** 16 or higher
- **React Native** 0.79.0 or higher
- **react-native-windows** 0.79.0 or higher

## 📱 Launching the App

**Important**: The Metro bundler starting doesn't mean the app is running! You need to launch it on a platform:

### Native Windows App (No Emulator Required):
```bash
# After Metro starts
npm run windows:run

# Or use the interactive launcher
npm run windows:launcher  # Choose option 1 for Windows
```

### Android (Requires Emulator/Device):
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

You have multiple platform options for running the app:

### 🪟 Option 1: Native Windows App (Recommended)

**Prerequisites**: 
- Visual Studio 2019/2022 with C++ tools or Build Tools for Visual Studio
- Windows 10 SDK (latest version)

**Steps:**
```bash
# Start Metro bundler (keep this running)
cd react-native-ai-quiz
npm run example:start

# In a new terminal, launch Windows app
npm run windows:run
```

**Advantages:**
- ✅ No emulator required
- ✅ Native Windows performance
- ✅ Direct access to Windows APIs
- ✅ Better debugging experience

### 📱 Option 2: Android (Traditional Method)

**Prerequisites**:
- Android Studio installed
- Android emulator running or device connected

**Steps:**
```bash
# Start Metro bundler
cd react-native-ai-quiz
npm run example:start

# In a new terminal, run on Android
npm run example:android
```

### 🍎 Option 3: iOS (Mac Required)
```bash
npm run example:ios
```

### 🔄 Interactive Platform Chooser
```bash
npm run windows:launcher
```
This script provides an interactive menu to choose your preferred platform.

## 🛠️ Windows-Specific Scripts

We've added several Windows-optimized npm scripts:

```bash
npm run setup:windows          # Complete Windows setup
npm run windows:run            # Run native Windows app
npm run windows:launcher       # Interactive platform chooser
npm run example:setup          # Install example dependencies only
npm run example:start          # Start Metro bundler
npm run example:android        # Run on Android
npm run example:windows        # Setup + start Metro (legacy)
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