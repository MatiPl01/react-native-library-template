import path from 'path';
import degit from 'degit';
import logger from './logger.js';
import { readJSON, writeJSON } from './utils.js';
import { execSync } from 'child_process';

const AUTHOR = 'MatiPl01';
const REPOSITORY = 'react-native-library-template';
const TEMPLATE_DIR = 'template';

const renamePackage = (projectPath, projectName, verbose) => {
  if (verbose) {
    logger.info(`Setting library name to '${projectName}'...`);
  }
  const packageJsonPath = path.resolve(projectPath, 'package.json');
  const packageJson = readJSON(packageJsonPath);
  packageJson.name = projectName;
  writeJSON(packageJsonPath, packageJson);
  if (verbose) {
    logger.info(`Library name was set to '${projectName}' in package.json`);
  }
};

const installPackages = (projectPath, verbose) => {
  if (verbose) {
    logger.info('Installing packages...');
  }
  process.chdir(projectPath);
  execSync('yarn install');
  logger.info('Packages were installed');
};

const init = (projectName, verbose = false, directory = '.') => {
  logger.info(`Initializing a new project: ${projectName}`);

  const emitter = degit(`${AUTHOR}/${REPOSITORY}/${TEMPLATE_DIR}`, {
    force: true,
    verbose
  });

  emitter.on('info', info => {
    logger.info(info.message);
  });

  emitter.on('warn', info => {
    logger.warning(info.message);
  });

  const projectPath = path.resolve(directory, projectName);

  emitter.clone(projectPath).then(async () => {
    if (verbose) {
      logger.info('Template files were copied.');
    }
    renamePackage(projectPath, projectName, verbose);
    logger.success('Temaplate was successfully cloned!');
    installPackages(projectPath, verbose);
    logger.success('🎉 Project was successfully initialized!');
  });
};

export default init;
