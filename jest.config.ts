/* eslint-disable import/no-unused-modules */
import type { Config } from 'jest';

const config: Config = {
  clearMocks: true,
  fakeTimers: {
    enableGlobally: true
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  preset: 'jest-expo',
  roots: ['<rootDir>/__tests__', '<rootDir>/example/app'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  transformIgnorePatterns: ['jest-runner'],
  verbose: true
};

export default config;
