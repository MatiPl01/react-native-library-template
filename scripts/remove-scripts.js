#!/usr/bin/env node

import fs from 'fs';
import chalk from 'chalk';

const PACKAGE_JSON = 'package.json';

let packageJson;
try {
  packageJson = JSON.parse(fs.readFileSync(PACKAGE_JSON, 'utf8'));
} catch (error) {
  console.error(chalk.red('Error reading package.json:'), error);
  process.exit(1);
}

// Remove the postinstall and prepare scripts if they exist
if (packageJson.scripts) {
  const scriptsRemoved = [];
  if (packageJson.scripts.postinstall) {
    delete packageJson.scripts.postinstall;
    scriptsRemoved.push('postinstall');
  }
  if (packageJson.scripts.prepare) {
    delete packageJson.scripts.prepare;
    scriptsRemoved.push('prepare');
  }
  if (scriptsRemoved.length > 0) {
    console.log(
      chalk.green('Removed scripts: ') + chalk.yellow(scriptsRemoved.join(', '))
    );
  } else {
    console.log(chalk.blue('No scripts to remove.'));
  }
} else {
  console.log(chalk.blue('No scripts section found in package.json.'));
}

try {
  fs.writeFileSync(PACKAGE_JSON, JSON.stringify(packageJson, null, 2));
} catch (error) {
  console.error(chalk.red('Error writing package.json:'), error);
  process.exit(1);
}
