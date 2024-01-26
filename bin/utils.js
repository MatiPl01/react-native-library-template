import fs from 'fs';

export const loadJSON = path =>
  JSON.parse(fs.readFileSync(new URL(path, import.meta.url)));

export const writeJSON = (path, data) =>
  fs.writeFileSync(
    new URL(path, import.meta.url),
    JSON.stringify(data, null, 2)
  );
