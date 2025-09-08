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
    path.resolve(__dirname, '..'),
  ],
  resolver: {
    // Add support for symlinked modules (for local development)
    nodeModulesPaths: [
      path.resolve(__dirname, 'node_modules'),
      path.resolve(__dirname, '..', 'node_modules'),
    ],
  },
};

module.exports = mergeConfig(defaultConfig, config);