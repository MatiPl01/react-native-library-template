/**
 * This file is required to properly resolve native dependencies
 */
const path = require('path');

const rootDir = path.resolve(__dirname, '../..');
const rootPkg = require(path.join(rootDir, 'package.json'));

const appDir = path.resolve(__dirname, '../app');
const appPkg = require(path.resolve(appDir, 'package.json'));

let dependencies = {};

[
  ...Object.keys(appPkg.dependencies || {}),
  ...Object.keys(rootPkg.dependencies || {})
].forEach(dep => {
  dependencies[dep] = {
    root: path.resolve(__dirname, `../../node_modules/${dep}`)
  };
});

module.exports = { dependencies };
