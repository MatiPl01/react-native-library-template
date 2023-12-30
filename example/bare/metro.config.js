const path = require('path');
const getWorkspaces = require('get-yarn-workspaces');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const workspaces = getWorkspaces(__dirname).filter(
  workspaceDir => workspaceDir !== __dirname
);

const customConfig = {
  watchFolders: [path.resolve(__dirname, '../../node_modules'), ...workspaces],
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false
      }
    })
  }
};

module.exports = mergeConfig(getDefaultConfig(__dirname), customConfig);
