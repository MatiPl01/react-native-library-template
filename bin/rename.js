import fs from 'fs';
import path from 'path';

import logger from './logger.js';
import { readJSON, writeJSON } from './utils.js';
import { findFilesByName, findFilesByExtension } from './find.js';

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

const renameJsonPackages = (projectPath, projectName, verbose) => {
  const packagePaths = findFilesByName(projectPath, 'package.json', [
    'node_modules'
  ]);

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

const renameTSconfigs = (projectPath, projectName, verbose) => {
  const tsconfigPaths = findFilesByName(projectPath, 'tsconfig.json', [
    'node_modules'
  ]);

  if (verbose) {
    logger.info(
      `Found ${tsconfigPaths.length} tsconfig.json files. Updating placeholders...`
    );
  }

  tsconfigPaths.forEach(tsconfigPath => {
    const tsconfig = readJSON(tsconfigPath);

    const tsconfigJSONString = JSON.stringify(tsconfig);
    const updatedTSconfigJSONString = tsconfigJSONString
      .replace(new RegExp(LIB_KEBAB_CASE_NAME, 'g'), projectName)
      .replace(new RegExp(LIB_CAMEL_CASE_NAME, 'g'), toCamelCase(projectName));
    const updatedTSconfig = JSON.parse(updatedTSconfigJSONString);

    writeJSON(tsconfigPath, updatedTSconfig);

    if (verbose) {
      logger.info(`Updated ${tsconfigPath}`);
    }
  });

  logger.info('Placeholder names were replaced in tsconfig.json files.');
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
  const yamlFiles = findFilesByExtension(
    workflowsPath,
    ['.yml', '.yaml'],
    ['node_modules']
  );

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
    appJson.expo.name = toCamelCase(projectName);
    appJson.expo.slug = projectName;
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
  const appJsonPath = path.resolve(projectPath, 'example', 'bare', 'app.json');
  const camelCaseName = toCamelCase(projectName);

  if (fs.existsSync(appJsonPath)) {
    if (verbose) {
      logger.info(`Updating app.json in bare project at ${appJsonPath}`);
    }
    const appJson = readJSON(appJsonPath);
    appJson.name = projectName;
    appJson.displayName = camelCaseName;
    writeJSON(appJsonPath, appJson);
    if (verbose) {
      logger.info('Updated app.json in bare project');
    }
  } else {
    if (verbose) {
      logger.warn(`app.json not found in bare project at ${appJsonPath}`);
    }
  }

  const replacePlaceholdersInDirectory = dirPath => {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });

    entries.forEach(entry => {
      const entryPath = path.join(dirPath, entry.name);
      if (entry.isDirectory()) {
        // First, rename the directory if needed
        const newDirPath = entryPath
          .replace(new RegExp(LIB_CAMEL_CASE_NAME, 'g'), camelCaseName)
          .replace(new RegExp(LIB_KEBAB_CASE_NAME, 'g'), projectName);

        if (newDirPath !== entryPath) {
          fs.renameSync(entryPath, newDirPath);
          if (verbose) {
            logger.info(`Renamed directory: ${entryPath} to ${newDirPath}`);
          }
        }
        // Recursively process the directory
        replacePlaceholdersInDirectory(newDirPath);
      } else if (entry.isFile()) {
        const content = fs.readFileSync(entryPath, 'utf8');
        const newContent = content
          .replace(new RegExp(LIB_CAMEL_CASE_NAME, 'g'), camelCaseName)
          .replace(new RegExp(LIB_KEBAB_CASE_NAME, 'g'), projectName);
        fs.writeFileSync(entryPath, newContent);

        const newFilePath = entryPath
          .replace(new RegExp(LIB_CAMEL_CASE_NAME, 'g'), camelCaseName)
          .replace(new RegExp(LIB_KEBAB_CASE_NAME, 'g'), projectName);

        if (newFilePath !== entryPath) {
          fs.renameSync(entryPath, newFilePath);
          if (verbose) {
            logger.info(`Renamed file: ${entryPath} to ${newFilePath}`);
          }
        }
      }
    });
  };

  if (verbose) {
    logger.info('Renaming placeholders in iOS and Android directories');
  }

  replacePlaceholdersInDirectory(iosPath);
  replacePlaceholdersInDirectory(androidPath);

  if (verbose) {
    logger.info(
      'Placeholders in iOS and Android directories were renamed successfully.'
    );
  }
};

export default (projectPath, projectName, verbose) => {
  logger.info('Setting names in template files...');
  renameLibraryPackageDirectory(projectPath, projectName, verbose);
  renameJsonPackages(projectPath, projectName, verbose);
  renameTSconfigs(projectPath, projectName, verbose);
  renamePlaceholdersInExampleApp(projectPath, projectName, verbose);
  renamePlaceholdersInGithubWorkflows(projectPath, projectName, verbose);
  renameExpoApp(projectPath, projectName, verbose);
  renameBareApp(projectPath, projectName, verbose);
  logger.success('All renaming steps completed successfully.');
};
