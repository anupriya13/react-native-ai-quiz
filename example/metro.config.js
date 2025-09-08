const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const path = require('path');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */

const defaultConfig = getDefaultConfig(__dirname);

const config = {
  projectRoot: __dirname,
  watchFolders: [
    // Include the parent directory to watch for changes in the main module
    // Use path.resolve for Windows compatibility
    path.resolve(__dirname, '..'),
  ],
  resolver: {
    // Add support for symlinked modules (for local development)
    // Use path.resolve for Windows path handling
    nodeModulesPaths: [
      path.resolve(__dirname, 'node_modules'),
      path.resolve(__dirname, '..', 'node_modules'),
    ],
    // Windows-specific resolver settings
    platforms: ['native', 'android', 'ios', 'windows', 'web'],
  },
  transformer: {
    // Ensure proper Windows path handling
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
};

module.exports = mergeConfig(defaultConfig, config);