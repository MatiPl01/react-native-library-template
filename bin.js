#!/usr/bin/env node

const AUTHOR = 'MatiPl01';
const REPOSITORY = 'react-native-library-template';
const TEMPLATE_DIR = 'template';

const degit = require('degit');

const emitter = degit(`${AUTHOR}/${REPOSITORY}/${TEMPLATE_DIR}`, {
  force: true,
  verbose: true
});

emitter.on('info', info => {
  console.log(info.message);
});

emitter.clone(REPOSITORY).then(() => {
  console.log('done');
});
