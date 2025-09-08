#!/usr/bin/env node

/**
 * Windows App Launcher Script with Platform Selection
 * Helps Windows users choose and launch the React Native app on different platforms
 */

const { spawn, exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const readline = require('readline');

console.log('🪟 React Native AI Quiz - Multi-Platform Launcher');
console.log('================================================');

const exampleDir = path.join(__dirname, 'example');

// Check if we're in the right directory
if (!fs.existsSync(exampleDir)) {
  console.error('❌ Error: Cannot find example directory');
  console.log('Please run this from the react-native-ai-quiz root directory');
  process.exit(1);
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('Choose your platform to launch the app:');
console.log('1. 🪟 Windows (Native Windows App - Recommended for Windows users)');
console.log('2. 📱 Android (Requires Android Emulator/Device)');
console.log('3. 🍎 iOS (Mac only, requires iOS Simulator)');

rl.question('\nEnter your choice (1-3): ', (choice) => {
  rl.close();
  
  switch (choice.trim()) {
    case '1':
      launchWindows();
      break;
    case '2':
      launchAndroid();
      break;
    case '3':
      launchIOS();
      break;
    default:
      console.log('❌ Invalid choice. Please run the script again and choose 1, 2, or 3.');
      process.exit(1);
  }
});

function launchWindows() {
  console.log('🪟 Launching Windows app...');
  console.log('✅ This will launch a native Windows app - no emulator required!');
  console.log('📝 Make sure Metro bundler is running in another terminal (npm start)');
  
  const windowsProcess = spawn('npm', ['run', 'windows'], {
    cwd: exampleDir,
    stdio: 'inherit',
    shell: true
  });

  windowsProcess.on('close', (code) => {
    if (code === 0) {
      console.log('✅ Windows app launched successfully!');
    } else {
      console.log(`❌ Launch failed with code ${code}`);
      console.log('\nTroubleshooting tips:');
      console.log('1. Ensure Metro bundler is running in another terminal (npm start)');
      console.log('2. Make sure Visual Studio or Build Tools are installed');
      console.log('3. Try: npm run troubleshoot');
      console.log('4. Check Windows development requirements in WINDOWS_GUIDE.md');
    }
  });
}

function launchAndroid() {
  console.log('📱 Checking Android setup...');

  // Check if Android emulator or device is connected
  exec('adb devices', (error, stdout, stderr) => {
    if (error) {
      console.log('⚠️  ADB not found. Please ensure Android SDK is installed.');
      console.log('   Install Android Studio and set up Android SDK');
      process.exit(1);
    }

    const devices = stdout.split('\n').filter(line => 
      line.includes('\tdevice') || line.includes('\temulator')
    );

    if (devices.length === 0) {
      console.log('⚠️  No Android devices or emulators found.');
      console.log('   Please start an Android emulator or connect a device');
      console.log('   Run: adb devices  to check connected devices');
      process.exit(1);
    }

    console.log(`✅ Found ${devices.length} Android device(s)`);
    console.log('🚀 Launching React Native app on Android...');

    // Navigate to example directory and run android
    const androidProcess = spawn('npm', ['run', 'android'], {
      cwd: exampleDir,
      stdio: 'inherit',
      shell: true
    });

    androidProcess.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Android app launched successfully!');
      } else {
        console.log(`❌ Launch failed with code ${code}`);
        console.log('\nTroubleshooting tips:');
        console.log('1. Ensure Metro bundler is running');
        console.log('2. Check Android emulator is running');
        console.log('3. Try: npm run troubleshoot');
      }
    });
  });
}

function launchIOS() {
  console.log('🍎 Launching iOS app...');
  
  if (process.platform !== 'darwin') {
    console.log('⚠️  iOS development is only supported on macOS');
    console.log('   Please use Windows or Android platform instead');
    process.exit(1);
  }
  
  const iosProcess = spawn('npm', ['run', 'ios'], {
    cwd: exampleDir,
    stdio: 'inherit',
    shell: true
  });

  iosProcess.on('close', (code) => {
    if (code === 0) {
      console.log('✅ iOS app launched successfully!');
    } else {
      console.log(`❌ Launch failed with code ${code}`);
      console.log('\nTroubleshooting tips:');
      console.log('1. Ensure Metro bundler is running');
      console.log('2. Check iOS Simulator is available');
      console.log('3. Make sure Xcode is installed');
    }
  });
}