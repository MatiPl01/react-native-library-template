import { example } from '../src';

describe(example, () => {
  it('returns example', () => {
    expect(example()).toBe('example');
  });
});
