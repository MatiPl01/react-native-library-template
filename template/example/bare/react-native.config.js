/**
 * This file is required to properly resolve native dependencies
 * listed in the example/app package.json on Android.
 */
const path = require('path');
const appPackageJSON = require('../app/package.json');

let dependencies = {};

Object.keys(appPackageJSON.dependencies).forEach(dep => {
  dependencies[dep] = {
    root: path.resolve(__dirname, `../../node_modules/${dep}`)
  };
});

module.exports = { dependencies };
