import fs from 'fs';
import path from 'path';

import logger from './logger.js';
import { readJSON, writeJSON } from './utils.js';

const LIB_PLACEHOLDER_NAME = '$$library-name$$';

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
  // Monorepo package.json
  if (verbose) {
    logger.info('Setting name in monorepo package.json...');
  }
  const monorepoPackagePath = path.resolve(projectPath, 'package.json');
  const monorepoPackage = readJSON(monorepoPackagePath);
  writeJSON(monorepoPackagePath, { ...monorepoPackage, name: `${projectName}-monorepo` });

  // Library package.json
  if (verbose) {
    logger.info('Setting name in library package.json...');
  }
  const libraryPackagePath = path.resolve(projectPath, 'packages', projectName, 'package.json');
  const libraryPackage = readJSON(libraryPackagePath);
  writeJSON(libraryPackagePath, { ...libraryPackage, name: projectName });

  if (verbose) {
    logger.info('Names were set in package.json files');
  }
};

const renameTSconfigAlias = (projectPath, projectName, verbose) => {
  if (verbose) {
    logger.info('Setting library name aliases in tsconfig.json...');
  }
  // projectPath/example/app/tsconfig.json
  const tsconfigPath = path.resolve(projectPath, 'example', 'app', 'tsconfig.json');
  const tsconfig = readJSON(tsconfigPath);
  tsconfig.compilerOptions.paths[projectName] = [`../../packages/${projectName}/src`];
  writeJSON(tsconfigPath, tsconfig);
  if (verbose) {
    logger.info('Library name aliases were set in tsconfig.json');
  }
};

const renameImportsInExampleApp = (projectPath, projectName, verbose) => {
  if (verbose) {
    logger.info('Setting library imports in example app...');
  }
  // go through all .ts,.tsx,.js,.jsx files in example/app/src (directly or nested in other directories) and replace $$library-name$$ with projectName
  // for each file, read the content, replace, and write back
  const exampleAppSrcPath = path.resolve(projectPath, 'example', 'app', 'src');
  // go through the entire tree of files in exampleAppSrcPath
  // for each file, read the content, replace, and write back
  const walk = (dir) => {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.resolve(dir, file);
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        walk(filePath);
      } else {
        if (verbose) {
          logger.info(`Processing file: ${filePath}`);
        }
        const content = fs.readFileSync(filePath, 'utf8');
        const newContent = content.replace(new RegExp(LIB_PLACEHOLDER_NAME, 'g'), projectName);
        fs.writeFileSync(filePath, newContent);
      }
    });
  };
  
  walk(exampleAppSrcPath);

  if (verbose) {
    logger.info('Placeholder names were replaced in example app');
  }
};

export default (projectPath, projectName, verbose) => {
  logger.info('Setting names in template files...');
  renameLibraryPackageDirectory(projectPath, projectName, verbose);
  renamePackages(projectPath, projectName, verbose);
  renameTSconfigAlias(projectPath, projectName, verbose);
  renameImportsInExampleApp(projectPath, projectName, verbose);
};
