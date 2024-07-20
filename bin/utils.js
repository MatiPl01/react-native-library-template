import fs from 'fs';
import path from 'path';

import logger from './logger.js';

export const toCamelCase = str => {
  return str.replace(/-([a-z])/g, g => g[1].toUpperCase());
};

export const replacePlaceholdersInFile = (filePath, replacements, verbose) => {
  const content = fs.readFileSync(filePath, 'utf8');
  let newContent = content;

  replacements.forEach(([placeholder, replacement]) => {
    newContent = newContent.replace(new RegExp(placeholder, 'g'), replacement);
  });

  fs.writeFileSync(filePath, newContent);

  if (verbose) {
    logger.info(`Updated file: ${filePath}`);
  }
};

export const replacePlaceholdersInDirectory = (
  dirPath,
  replacements,
  verbose
) => {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  entries.forEach(entry => {
    const entryPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      // First, rename the directory if needed
      let newDirPath = entryPath;
      replacements.forEach(([placeholder, replacement]) => {
        newDirPath = newDirPath.replace(
          new RegExp(placeholder, 'g'),
          replacement
        );
      });

      if (newDirPath !== entryPath) {
        fs.renameSync(entryPath, newDirPath);
        if (verbose) {
          logger.info(`Renamed directory: ${entryPath} to ${newDirPath}`);
        }
      }
      // Recursively process the directory
      replacePlaceholdersInDirectory(newDirPath, replacements, verbose);
    } else if (entry.isFile()) {
      replacePlaceholdersInFile(entryPath, replacements, verbose);

      let newFilePath = entryPath;
      replacements.forEach(([placeholder, replacement]) => {
        newFilePath = newFilePath.replace(
          new RegExp(placeholder, 'g'),
          replacement
        );
      });

      if (newFilePath !== entryPath) {
        fs.renameSync(entryPath, newFilePath);
        if (verbose) {
          logger.info(`Renamed file: ${entryPath} to ${newFilePath}`);
        }
      }
    }
  });
};
