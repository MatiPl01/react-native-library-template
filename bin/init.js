import path from 'path';
import degit from 'degit';
import logger from './logger.js';
import { readJSON, writeJSON } from './utils.js';

const AUTHOR = 'MatiPl01';
const REPOSITORY = 'react-native-library-template';
const TEMPLATE_DIR = 'template';

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
      logger.info(
        'Template files were copied. Changing name in package.json...'
      );
    }
    const packageJsonPath = path.resolve(projectPath, 'package.json');
    const packageJson = readJSON(packageJsonPath);
    packageJson.name = projectName;
    writeJSON(packageJsonPath, packageJson);
    if (verbose) {
      logger.info(`Library name was set to '${projectName}' in package.json`);
    }

    logger.success('Temaplate initialization completed successfully!');
  });
};

export default init;
