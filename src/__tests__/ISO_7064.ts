import * as alg from '../ISO_7064';

test('mod11_2', () => {
  expect(alg.mod11_2('0794')).toBe('0');
});
test('mod37_2', () => {
  expect(alg.mod37_2('1234ABCD')).toBe('V');
});
test('mod97_10', () => {
  expect(alg.mod97_10('794')).toBe('44');
});
test('mod661_26', () => {
  expect(alg.mod661_26('ABCD')).toBe('KN');
});
test('mod1271_36', () => {
  expect(alg.mod1271_36('ISO79')).toBe('3W');
  expect(alg.mod1271_36('ZZZZZZZZZZZZZZZZ')).toBe('UU');
});
