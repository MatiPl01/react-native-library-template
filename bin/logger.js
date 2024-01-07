import chalk from 'chalk';

const logger = {
  error: msg => {
    console.log(chalk.red(msg));
  },
  success: msg => {
    console.log(chalk.green(msg));
  },
  info: msg => {
    console.log(chalk.blue(msg));
  },
  warning: msg => {
    console.log(chalk.yellow(msg));
  }
};

export default logger;
