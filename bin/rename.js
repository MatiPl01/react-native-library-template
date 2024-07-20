import fs from 'fs';
import path from 'path';

import logger from './logger.js';
import {
  toCamelCase,
  replacePlaceholdersInFile,
  replacePlaceholdersInDirectory
} from './utils.js';
import { findFilesByName, findFilesByExtension } from './find.js';

const LIB_CAMEL_CASE_NAME = '__libraryName__';
const LIB_KEBAB_CASE_NAME = '__library-name__';

const renameLibraryPackageDirectory = (projectPath, projectName, verbose) => {
  if (verbose) {
    logger.info('Setting library directory name...');
  }

  const dirPath = path.resolve(projectPath, 'packages', LIB_KEBAB_CASE_NAME);
  const newDirPath = path.resolve(projectPath, 'packages', projectName);
  fs.renameSync(dirPath, newDirPath);

  if (verbose) {
    logger.info('Library directory name was set');
  }
};

const renamePackages = (projectPath, projectName, verbose) => {
  const packagePaths = findFilesByName(projectPath, 'package.json', [
    'node_modules'
  ]);
  const replacements = [
    [LIB_KEBAB_CASE_NAME, projectName],
    [LIB_CAMEL_CASE_NAME, toCamelCase(projectName)]
  ];

  if (verbose) {
    logger.info(
      `Found ${packagePaths.length} package.json files. Updating package names...`
    );
  }

  packagePaths.forEach(packagePath => {
    replacePlaceholdersInFile(packagePath, replacements, verbose);
  });

  if (verbose) {
    logger.info('Package names were updated successfully.');
  }
};

const renameTSconfigs = (projectPath, projectName, verbose) => {
  const tsconfigPaths = findFilesByName(projectPath, 'tsconfig.json', [
    'node_modules'
  ]);
  const replacements = [
    [LIB_KEBAB_CASE_NAME, projectName],
    [LIB_CAMEL_CASE_NAME, toCamelCase(projectName)]
  ];

  if (verbose) {
    logger.info(
      `Found ${tsconfigPaths.length} tsconfig.json files. Updating placeholders...`
    );
  }

  tsconfigPaths.forEach(tsconfigPath => {
    replacePlaceholdersInFile(tsconfigPath, replacements, verbose);
  });

  if (verbose) {
    logger.info(
      'Placeholders in tsconfig.json files were updated successfully.'
    );
  }
};

const renamePlaceholdersInExampleApp = (projectPath, projectName, verbose) => {
  const exampleAppSrcPath = path.resolve(projectPath, 'example', 'app', 'src');
  const fileExtensions = ['.ts', '.tsx', '.js', '.jsx'];
  const files = findFilesByExtension(exampleAppSrcPath, fileExtensions, [
    'node_modules'
  ]);
  const replacements = [
    [LIB_KEBAB_CASE_NAME, projectName],
    [LIB_CAMEL_CASE_NAME, toCamelCase(projectName)]
  ];

  if (verbose) {
    logger.info(
      `Found ${files.length} files to update in example app. Setting library name...`
    );
  }

  files.forEach(filePath => {
    replacePlaceholdersInFile(filePath, replacements, verbose);
  });

  if (verbose) {
    logger.info('Placeholder names were replaced in example app files.');
  }
};

const renamePlaceholdersInGithubWorkflows = (
  projectPath,
  projectName,
  verbose
) => {
  const workflowsPath = path.resolve(projectPath, '.github', 'workflows');
  const yamlFiles = findFilesByExtension(
    workflowsPath,
    ['.yml', '.yaml'],
    ['node_modules']
  );
  const replacements = [
    [LIB_KEBAB_CASE_NAME, projectName],
    [LIB_CAMEL_CASE_NAME, toCamelCase(projectName)]
  ];

  if (verbose) {
    logger.info(
      `Found ${yamlFiles.length} YAML files in .github/workflows. Updating placeholders...`
    );
  }

  yamlFiles.forEach(filePath => {
    replacePlaceholdersInFile(filePath, replacements, verbose);
  });

  if (verbose) {
    logger.info(
      'Placeholder names were replaced in .github/workflows YAML files.'
    );
  }
};

const renameExpoApp = (projectPath, projectName, verbose) => {
  const appJsonPath = path.resolve(projectPath, 'example', 'expo', 'app.json');
  const replacements = [
    [LIB_KEBAB_CASE_NAME, projectName],
    [LIB_CAMEL_CASE_NAME, toCamelCase(projectName)]
  ];

  if (verbose) {
    logger.info(`Updating app.json in Expo project at ${appJsonPath}`);
  }

  replacePlaceholdersInFile(appJsonPath, replacements, verbose);

  if (verbose) {
    logger.info('Placeholders in app.json were renamed successfully.');
  }
};

const renameBareApp = (projectPath, projectName, verbose) => {
  const iosPath = path.resolve(projectPath, 'example', 'bare', 'ios');
  const androidPath = path.resolve(projectPath, 'example', 'bare', 'android');
  const appJsonPath = path.resolve(projectPath, 'example', 'bare', 'app.json');
  const replacements = [
    [LIB_KEBAB_CASE_NAME, projectName],
    [LIB_CAMEL_CASE_NAME, toCamelCase(projectName)]
  ];

  if (verbose) {
    logger.info(`Updating app.json in bare project at ${appJsonPath}`);
  }

  replacePlaceholdersInFile(appJsonPath, replacements, verbose);

  if (verbose) {
    logger.info('Renaming placeholders in iOS and Android directories');
  }

  replacePlaceholdersInDirectory(iosPath, replacements, verbose);
  replacePlaceholdersInDirectory(androidPath, replacements, verbose);

  if (verbose) {
    logger.info(
      'Placeholders in iOS and Android directories were renamed successfully.'
    );
  }
};

export default (projectPath, projectName, verbose) => {
  logger.info('Setting names in template files...');
  renameLibraryPackageDirectory(projectPath, projectName, verbose);
  renamePackages(projectPath, projectName, verbose);
  renameTSconfigs(projectPath, projectName, verbose);
  renamePlaceholdersInExampleApp(projectPath, projectName, verbose);
  renamePlaceholdersInGithubWorkflows(projectPath, projectName, verbose);
  renameExpoApp(projectPath, projectName, verbose);
  renameBareApp(projectPath, projectName, verbose);
  logger.success('All renaming steps completed successfully.');
};
