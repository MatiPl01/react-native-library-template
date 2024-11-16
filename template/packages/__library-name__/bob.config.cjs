module.exports = {
  exclude: [
    '**/{__tests__,__fixtures__,__mocks__}/**',
    '**/*.test.{js,jsx,ts,tsx}'
  ],
  output: 'dist',
  source: 'src',
  targets: [
    'commonjs',
    'module',
    [
      'typescript',
      {
        project: 'tsconfig.build.json'
      }
    ]
  ]
};
