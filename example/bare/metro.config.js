const path = require('path');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const rootDir = path.resolve(__dirname, '../..');
const rootPkg = require(path.join(rootDir, 'package.json'));

const appDir = path.resolve(__dirname, '../app');
const appPkg = require(path.join(appDir, 'package.json'));

const modules = [
  '@babel/runtime',
  ...Object.keys({
    ...rootPkg.dependencies,
    ...rootPkg.peerDependencies,
    ...appPkg.dependencies,
    ...appPkg.peerDependencies
  })
];

const externalNodeModules = modules.reduce((acc, name) => {
  acc[name] = path.join(__dirname, 'node_modules', name);
  return acc;
}, {});

const defaultConfig = getDefaultConfig(__dirname);

module.exports = mergeConfig(defaultConfig, {
  projectRoot: __dirname,

  resolver: {
    nodeModulesPaths: [`${rootDir}/node_modules`],
    extraNodeModules: {
      ...externalNodeModules
    }
  },

  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true
      }
    })
  }
});
