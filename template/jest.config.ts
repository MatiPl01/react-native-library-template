import { type JestConfigWithTsJest, pathsToModuleNameMapper } from 'ts-jest';

import { compilerOptions } from './tsconfig.json';

const config: JestConfigWithTsJest = {
  clearMocks: true,
  fakeTimers: {
    enableGlobally: true
  },
  moduleDirectories: ['node_modules', '<rootDir>'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths ?? {}, {
    prefix: '<rootDir>/'
  }),
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  preset: 'jest-expo',
  roots: ['<rootDir>/src', '<rootDir>/example/app'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  transformIgnorePatterns: ['jest-runner'],
  verbose: true
};

export default config;
