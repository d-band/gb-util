import { compute, isValid } from '../GB_11714';

const ids = ['D2143569X', '768225469'];

test('compute', () => {
  ids.forEach((id) => {
    expect(compute(id)).toBe(id.slice(-1));
  });
});

test('isValid', () => {
  ids.forEach((id) => {
    expect(isValid(id)).toBe(true);
  });
  expect(isValid('')).toBe(false);
  expect(isValid('123')).toBe(false);
  expect(isValid(ids[0].slice(0, 8) + '0')).toBe(false);
});
