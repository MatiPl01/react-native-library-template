const path = require('path');

const rootDir = path.resolve(__dirname, '../..');
const rootPkg = require(path.join(rootDir, 'package.json'));

const appDir = path.resolve(__dirname, '../app');
const appPkg = require(path.join(appDir, 'package.json'));

module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          extensions: ['.ts', '.tsx', '.svg', '.json'],
          // This needs to be mirrored in ../app/tsconfig.json
          alias: {
            '@lib': path.join(rootDir, rootPkg['react-native']),
            '@app': path.join(appDir, appPkg['react-native'])
          }
        }
      ]
    ]
  };
};
