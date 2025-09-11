#!/usr/bin/env node

/**
 * Windows App Launch Script
 * Helps Windows users launch the React Native app after Metro starts
 */

const { spawn, exec } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🪟 React Native AI Quiz - Windows App Launcher');
console.log('=====================================');

const exampleDir = path.join(__dirname, 'example');

// Check if we're in the right directory
if (!fs.existsSync(exampleDir)) {
  console.error('❌ Error: Cannot find example directory');
  console.log('Please run this from the react-native-ai-quiz root directory');
  process.exit(1);
}

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
  console.log('🚀 Launching React Native app...');

  // Navigate to example directory and run android
  const androidProcess = spawn('npm', ['run', 'android'], {
    cwd: exampleDir,
    stdio: 'inherit',
    shell: true
  });

  androidProcess.on('close', (code) => {
    if (code === 0) {
      console.log('✅ App launched successfully!');
    } else {
      console.log(`❌ Launch failed with code ${code}`);
      console.log('\nTroubleshooting tips:');
      console.log('1. Ensure Metro bundler is running');
      console.log('2. Check Android emulator is running');
      console.log('3. Try: npm run troubleshoot');
    }
  });
});