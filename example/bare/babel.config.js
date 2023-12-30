const path = require('path');

const rootDir = path.resolve(__dirname, '../..');
const rootPkg = require(path.join(rootDir, 'package.json'));

const appDir = path.resolve(__dirname, '../app');
const appPkg = require(path.join(appDir, 'package.json'));

module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['module:metro-react-native-babel-preset'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          extensions: ['.ts', '.tsx', '.svg', '.json'],
          alias: {
            [rootPkg.name]: path.join(rootDir, rootPkg['react-native']),
            [appPkg.name]: path.join(appDir, appPkg['react-native'])
          }
        }
      ]
    ]
  };
};
