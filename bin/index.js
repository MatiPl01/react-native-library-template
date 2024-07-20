#!/usr/bin/env node

import yargs from 'yargs';
import init from './init.js';
import logger from './logger.js';
import { hideBin } from 'yargs/helpers';

function validateProjectName(projectName) {
  const kebabCaseRegex = /^[a-z]+(-[a-z]+)*$/;
  return kebabCaseRegex.test(projectName);
}

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
      yargs.option('directory', {
        alias: 'd',
        type: 'string',
        description: 'Directory to initialize the project in'
      });
    },
    argv => {
      if (!validateProjectName(argv.projectName)) {
        logger.error(
          'Invalid project name provided. Project name must be in kebab-case and lowercase.'
        );
        process.exit(1);
      }
      init(argv.projectName, argv.verbose, argv.directory);
    }
  )
  .demandCommand(1, 'You need at least one command before moving on')
  .help()
  .fail(msg => {
    logger.error(msg);
    process.exit(1);
  })
  .strict().argv;
