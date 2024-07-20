import fs from 'fs';
import path from 'path';

export const findFilesByName = (dir, fileName, excludeDirs = []) => {
  let results = [];
  const list = fs.readdirSync(dir);

  list.forEach(file => {
    const filePath = path.resolve(dir, file);
    const stat = fs.statSync(filePath);

    if (stat && stat.isDirectory() && !excludeDirs.includes(file)) {
      results = results.concat(
        findFilesByName(filePath, fileName, excludeDirs)
      );
    } else if (stat && stat.isFile() && file === fileName) {
      results.push(filePath);
    }
  });

  return results;
};

export const findFilesByExtension = (dir, extensions, excludeDirs = []) => {
  let results = [];
  const list = fs.readdirSync(dir);

  list.forEach(file => {
    const filePath = path.resolve(dir, file);
    const stat = fs.statSync(filePath);

    if (stat && stat.isDirectory() && !excludeDirs.includes(file)) {
      results = results.concat(
        findFilesByExtension(filePath, extensions, excludeDirs)
      );
    } else if (
      stat &&
      stat.isFile() &&
      extensions.some(ext => file.endsWith(ext))
    ) {
      results.push(filePath);
    }
  });

  return results;
};
