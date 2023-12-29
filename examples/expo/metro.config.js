const path = require('path');
const { getDefaultConfig } = require('@expo/metro-config');

const currentRoot = path.resolve(__dirname);
const workspaceRoot = path.resolve(__dirname, '../..');

const watchFolders = [
  currentRoot,
  `${workspaceRoot}/examples/app`,
  `${workspaceRoot}/node_modules`
];

const defaultConfig = getDefaultConfig(__dirname);

module.exports = {
  ...defaultConfig,

  projectRoot: __dirname,

  resolver: {
    ...defaultConfig.resolver,
    nodeModulesPaths: [`${workspaceRoot}/node_modules`]
  },

  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true
      }
    })
  },

  watchFolders
};
