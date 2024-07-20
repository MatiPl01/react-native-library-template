import fs from 'fs';
import path from 'path';

import logger from './logger.js';
import { readJSON, writeJSON } from './utils.js';
import { findFiles, findFilesByExtension } from './find.js';

const LIB_PLACEHOLDER_NAME = '__library-name__';

const renameLibraryPackageDirectory = (projectPath, projectName, verbose) => {
  if (verbose) {
    logger.info('Setting library directory name...');
  }
  const dirPath = path.resolve(projectPath, 'packages', LIB_PLACEHOLDER_NAME);
  const newDirPath = path.resolve(projectPath, 'packages', projectName);
  fs.renameSync(dirPath, newDirPath);
  if (verbose) {
    logger.info('Library directory name was set');
  }
};

const renamePackages = (projectPath, projectName, verbose) => {
  const packagePaths = findFiles(projectPath, 'package.json', ['node_modules']);

  if (verbose) {
    logger.info(
      `Found ${packagePaths.length} package.json files. Updating package names...`
    );
  }

  packagePaths.forEach(packagePath => {
    const packageJSON = readJSON(packagePath);

    const packageJSONString = JSON.stringify(packageJSON);
    const updatedPackageJSONString = packageJSONString.replace(
      new RegExp(LIB_PLACEHOLDER_NAME, 'g'),
      projectName
    );
    const updatedPackageJSON = JSON.parse(updatedPackageJSONString);

    writeJSON(packagePath, updatedPackageJSON);

    if (verbose) {
      logger.info(`Updated ${packagePath}`);
    }
  });

  logger.info('Package names updated successfully.');
};

const getRelativePath = (from, to) => {
  return path.relative(from, to).replace(/\\/g, '/');
};

const renameTSconfigAlias = (projectPath, projectName, verbose) => {
  const tsconfigPaths = findFiles(projectPath, 'tsconfig.json', [
    'node_modules'
  ]);

  if (verbose) {
    logger.info(
      `Found ${tsconfigPaths.length} tsconfig.json files. Setting library name aliases...`
    );
  }

  const librarySrcPath = path.resolve(
    projectPath,
    'packages',
    projectName,
    'src'
  );

  tsconfigPaths.forEach(tsconfigPath => {
    const tsconfig = readJSON(tsconfigPath);
    const tsconfigDir = path.dirname(tsconfigPath);
    const relativeLibrarySrcPath = getRelativePath(tsconfigDir, librarySrcPath);

    if (tsconfig.compilerOptions && tsconfig.compilerOptions.paths) {
      tsconfig.compilerOptions.paths[projectName] = [relativeLibrarySrcPath];
      writeJSON(tsconfigPath, tsconfig);
      if (verbose) {
        logger.info(`Updated ${tsconfigPath}`);
      }
    }
  });

  logger.info('Library name aliases were set in tsconfig.json files.');
};

const renamePlaceholdersInExampleApp = (projectPath, projectName, verbose) => {
  const exampleAppSrcPath = path.resolve(projectPath, 'example', 'app', 'src');
  const fileExtensions = ['.ts', '.tsx', '.js', '.jsx'];
  const files = findFilesByExtension(exampleAppSrcPath, fileExtensions, [
    'node_modules'
  ]);

  if (verbose) {
    logger.info(
      `Found ${files.length} files to update in example app. Setting library name...`
    );
  }

  files.forEach(filePath => {
    if (verbose) {
      logger.info(`Processing file: ${filePath}`);
    }
    const content = fs.readFileSync(filePath, 'utf8');
    const newContent = content.replace(
      new RegExp(LIB_PLACEHOLDER_NAME, 'g'),
      projectName
    );
    fs.writeFileSync(filePath, newContent);
  });

  logger.info('Placeholder names were replaced in example app.');
};

const renamePlaceholdersInGithubWorkflows = (
  projectPath,
  projectName,
  verbose
) => {
  const workflowsPath = path.resolve(projectPath, '.github', 'workflows');
  const yamlFiles = findFilesByExtension(workflowsPath, ['.yml', '.yaml']);

  if (verbose) {
    logger.info(
      `Found ${yamlFiles.length} YAML files in .github/workflows. Updating placeholders...`
    );
  }

  yamlFiles.forEach(filePath => {
    if (verbose) {
      logger.info(`Processing file: ${filePath}`);
    }
    const content = fs.readFileSync(filePath, 'utf8');
    const newContent = content.replace(
      new RegExp(LIB_PLACEHOLDER_NAME, 'g'),
      projectName
    );
    fs.writeFileSync(filePath, newContent);
  });

  logger.info(
    'Placeholder names were replaced in .github/workflows YAML files.'
  );
};

export default (projectPath, projectName, verbose) => {
  logger.info('Setting names in template files...');
  renameLibraryPackageDirectory(projectPath, projectName, verbose);
  renamePackages(projectPath, projectName, verbose);
  renameTSconfigAlias(projectPath, projectName, verbose);
  renamePlaceholdersInExampleApp(projectPath, projectName, verbose);
  renamePlaceholdersInGithubWorkflows(projectPath, projectName, verbose);
  logger.success('All renaming steps completed successfully.');
};
