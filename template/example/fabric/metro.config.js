const path = require('path');
const fs = require('fs');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const getWorkspaces = require('get-yarn-workspaces');

const exampleDir = path.resolve(__dirname, '..');
const excludeRegex = new RegExp(
  fs
    .readdirSync(exampleDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)
    .filter(dirName => !['app', path.basename(__dirname)].includes(dirName))
    .map(dirName => `${exampleDir}/${dirName}`)
    .join('|')
);

const customConfig = {
  watchFolders: [
    path.resolve(__dirname, '../../node_modules'),
    ...getWorkspaces(__dirname).filter(
      workspaceDir => !excludeRegex.test(workspaceDir)
    )
  ]
};

module.exports = mergeConfig(getDefaultConfig(__dirname), customConfig);
