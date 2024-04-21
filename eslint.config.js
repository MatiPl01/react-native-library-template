import js from '@eslint/js';
import globals from 'globals';

// PLUGINS
import prettier from 'eslint-plugin-prettier';

const ignores = [
  // Directories and their contents
  'node_modules/**/*',
  'template/**/*',
  'dist/**/*',
  // Files
  'README.md',
  '.pnp.cjs',
  '.pnp.loader.mjs',
];

const configs = [
  js.configs.recommended,
  {
    plugins: {
      prettier
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
      }
    },
    rules: {
      indent: ['error', 2],
      'linebreak-style': ['error', 'unix'],
      quotes: ['error', 'single'],
      semi: ['error', 'always'],
    },
  },
  // Applies to all configs listed above (needs to be a separate object)
  {
    ignores
  }
];

export default configs;
