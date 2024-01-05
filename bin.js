#!/usr/bin/env node

const AUTHOR = 'MatiPl01';
const REPOSITORY = 'react-native-library-template';

const yargs = require('yargs');
const degit = require('degit');

const emitter = degit(`${AUTHOR}/${REPOSITORY}`, {
  cache: true,
  force: true,
  verbose: true
});

emitter.on('info', info => {
  console.log(info.message);
});

emitter.clone(REPOSITORY).then(() => {
  console.log('done');
});

console.log(yargs.argv); // TODO - improve script
