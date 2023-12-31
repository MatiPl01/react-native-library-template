/**
 * This babel config is used by Jest.
 */
const path = require('path');

const rootDir = path.resolve(__dirname);
const rootPkg = require(path.join(rootDir, 'package.json'));

module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./'],
        extensions: ['.ts', '.tsx', '.svg', '.json'],
        alias: {
          // This needs to be mirrored in tsconfig.json
          [rootPkg.name]: path.join(rootDir, rootPkg['react-native'])
        }
      }
    ]
  ]
};
