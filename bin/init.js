import degit from 'degit';
import logger from './logger.js';

const AUTHOR = 'MatiPl01';
const REPOSITORY = 'react-native-library-template';
const TEMPLATE_DIR = 'template';

const init = (projectName, verbose = false) => {
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

  emitter.clone(projectName).then(() => {
    logger.success('Template initialized successfully!');
  });
};

export default init;
