/* eslint-disable import/no-unused-modules */
import type { Config } from 'jest';

const config: Config = {
  clearMocks: true,
  fakeTimers: {
    enableGlobally: true
  },
  preset: 'jest-expo',
  roots: ['<rootDir>/src', '<rootDir>/example/app'],
  verbose: true
};

export default config;
