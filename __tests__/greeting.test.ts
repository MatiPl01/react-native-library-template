import { greet } from '../src';

describe(greet, () => {
  it('returns greeting', () => {
    expect(greet()).toBe('Hello from library! 👋');
  });
});
