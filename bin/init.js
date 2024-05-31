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

const initGitRepository = (projectPath, verbose) => {
  if (verbose) {
    logger.info('Initializing git repository...');
  }
  process.chdir(projectPath);
  execSync('git init');
  logger.info('Git repository was initialized');
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
  const currentPath = process.cwd();
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
    initGitRepository(projectPath, verbose);
    installPackages(projectPath, verbose);
    logger.success('🎉 Project was successfully initialized!');
    logger.info('⌛ Wait until process finishes...');

    logger.info('\n\n💡 A few tips:');
    logger.info(
      '1. Put your library code in src/ directory. It contains example code that can be removed.'
    );
    logger.info(
      '2. Add usage examples to the example/app/src/ directory. You can also use this example app while developing your library.'
    );
    logger.info(
      '3. Develop your library with react-native CLI (bare example app) or Expo Go (expo example app).'
    );
    logger.info(
      '4. Don\'t modify example/bare/ and example/expo/ directories if you don\'t have to. These apps use shared configuration from the top-level babel config and shared code from the example/app/ directory.'
    );

    logger.info('\n\n💻 Useful commands:');
    logger.info('1. Bare example app:');
    logger.info('   - yarn example:bare pod - install pods for iOS');
    logger.info('   - yarn example:bare start - start the Metro bundler');
    logger.info('   - yarn example:bare android - run the Android app');
    logger.info('   - yarn example:bare ios - run the iOS app');

    logger.info('\n2. Expo example app:');
    logger.info('   - yarn example:expo start - start the Expo Go app');
    logger.info('   - yarn example:expo android - run the Android app');
    logger.info('   - yarn example:expo ios - run the iOS app');

    logger.info('\n3. Code quality:');
    logger.info('   - yarn lint - check code quality');
    logger.info('   - yarn lint:fix - fix code quality issues');
    logger.info('   - yarn test - run tests');
    logger.info('   - yarn typecheck - check types');

    logger.info('\n4. Publish:');
    logger.info(
      'To publish your library, use the Release Github Action. It will publish your library, automatically detect the version, and create a release on Github.'
    );

    const relativePath = path.relative(currentPath, projectPath);
    logger.success(
      `\n🚀 cd to the '${relativePath}' directory and start coding!`
    );
  });
};

export default init;
