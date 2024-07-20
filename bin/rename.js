import fs from 'fs';
import path from 'path';

import logger from './logger.js';
import { readJSON, writeJSON } from './utils.js';
import { findFiles, findFilesByExtension } from './find.js';

const LIB_CAMEL_CASE_NAME = '__libraryName__';
const LIB_KEBAB_CASE_NAME = '__library-name__';

const toCamelCase = str => {
  return str.replace(/-([a-z])/g, g => g[1].toUpperCase());
};

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
  const packagePaths = findFiles(projectPath, 'package.json', ['node_modules']);

  if (verbose) {
    logger.info(
      `Found ${packagePaths.length} package.json files. Updating package names...`
    );
  }

  packagePaths.forEach(packagePath => {
    const packageJSON = readJSON(packagePath);

    const packageJSONString = JSON.stringify(packageJSON);
    const updatedPackageJSONString = packageJSONString
      .replace(new RegExp(LIB_KEBAB_CASE_NAME, 'g'), projectName)
      .replace(new RegExp(LIB_CAMEL_CASE_NAME, 'g'), toCamelCase(projectName));
    const updatedPackageJSON = JSON.parse(updatedPackageJSONString);

    writeJSON(packagePath, updatedPackageJSON);

    if (verbose) {
      logger.info(`Updated ${packagePath}`);
    }
  });

  logger.info('Package names updated successfully.');
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
    const relativeLibrarySrcPath = path
      .relative(tsconfigDir, librarySrcPath)
      .replace(/\\/g, '/');

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
    const newContent = content
      .replace(new RegExp(LIB_KEBAB_CASE_NAME, 'g'), projectName)
      .replace(new RegExp(LIB_CAMEL_CASE_NAME, 'g'), toCamelCase(projectName));
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
    const newContent = content
      .replace(new RegExp(LIB_KEBAB_CASE_NAME, 'g'), projectName)
      .replace(new RegExp(LIB_CAMEL_CASE_NAME, 'g'), toCamelCase(projectName));
    fs.writeFileSync(filePath, newContent);
  });

  logger.info(
    'Placeholder names were replaced in .github/workflows YAML files.'
  );
};

const renameExpoApp = (projectPath, projectName, verbose) => {
  const appJsonPath = path.resolve(projectPath, 'example', 'expo', 'app.json');
  if (fs.existsSync(appJsonPath)) {
    if (verbose) {
      logger.info(`Updating app.json in Expo project at ${appJsonPath}`);
    }
    const appJson = readJSON(appJsonPath);
    appJson.name = toCamelCase(projectName);
    appJson.slug = projectName;
    writeJSON(appJsonPath, appJson);
    if (verbose) {
      logger.info('Updated app.json in Expo project');
    }
  } else {
    if (verbose) {
      logger.warn(`app.json not found in Expo project at ${appJsonPath}`);
    }
  }
};

const renameBareApp = (projectPath, projectName, verbose) => {
  const iosPath = path.resolve(projectPath, 'example', 'bare', 'ios');
  const androidPath = path.resolve(projectPath, 'example', 'bare', 'android');
  const camelCaseName = toCamelCase(projectName);

  const replacePlaceholdersInFiles = dirPath => {
    const files = findFilesByExtension(dirPath, [
      '.m',
      '.swift',
      '.kt',
      '.java',
      '.xml',
      '.gradle'
    ]);
    files.forEach(filePath => {
      const content = fs.readFileSync(filePath, 'utf8');
      const newContent = content
        .replace(new RegExp(LIB_CAMEL_CASE_NAME, 'g'), camelCaseName)
        .replace(new RegExp(LIB_KEBAB_CASE_NAME, 'g'), projectName);
      fs.writeFileSync(filePath, newContent);
      if (verbose) {
        logger.info(`Updated file: ${filePath}`);
      }
    });
  };

  const replacePlaceholdersInFileNames = dirPath => {
    const files = findFiles(dirPath, null);
    files.forEach(filePath => {
      const newFilePath = filePath
        .replace(new RegExp(LIB_CAMEL_CASE_NAME, 'g'), camelCaseName)
        .replace(new RegExp(LIB_KEBAB_CASE_NAME, 'g'), projectName);
      if (newFilePath !== filePath) {
        fs.renameSync(filePath, newFilePath);
        if (verbose) {
          logger.info(`Renamed file: ${filePath} to ${newFilePath}`);
        }
      }
    });
  };

  if (verbose) {
    logger.info('Renaming placeholders in iOS and Android directories');
  }

  replacePlaceholdersInFiles(iosPath);
  replacePlaceholdersInFileNames(iosPath);
  replacePlaceholdersInFiles(androidPath);
  replacePlaceholdersInFileNames(androidPath);

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
  renameTSconfigAlias(projectPath, projectName, verbose);
  renamePlaceholdersInExampleApp(projectPath, projectName, verbose);
  renamePlaceholdersInGithubWorkflows(projectPath, projectName, verbose);
  renameExpoApp(projectPath, projectName, verbose);
  renameBareApp(projectPath, projectName, verbose);
  logger.success('All renaming steps completed successfully.');
};
