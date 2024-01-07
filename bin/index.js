#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import logger from './logger.js';
import init from './init.js';

yargs(hideBin(process.argv))
  .command(
    'init <projectName>',
    'initialize a new project',
    yargs => {
      yargs.positional('projectName', {
        describe: 'name of the project to initialize',
        type: 'string'
      });
      yargs.option('verbose', {
        alias: 'v',
        type: 'boolean',
        description: 'Run with verbose logging'
      });
    },
    argv => init(argv.projectName, argv.verbose)
  )
  .demandCommand(1, 'You need at least one command before moving on')
  .help()
  .fail(msg => {
    logger.error(msg);
    process.exit(1);
  })
  .strict().argv;
