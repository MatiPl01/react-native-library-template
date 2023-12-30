const path = require('path');
const appPackageJSON = require('../app/package.json');

let dependencies = {};

Object.keys(appPackageJSON.dependencies).forEach(dep => {
  dependencies[dep] = {
    root: path.resolve(__dirname, `../../node_modules/${dep}`)
  };
});

module.exports = { dependencies };
