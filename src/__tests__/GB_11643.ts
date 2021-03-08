import { compute, isValid, parse } from '../GB_11643';

const ids = ['11010519491231002X', '440524188001010014'];
const infos = [
  { areaCode: '110105', birth: '1949-12-31', order: 2, sex: 0 },
  { areaCode: '440524', birth: '1880-01-01', order: 1, sex: 1 }
];

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
  expect(isValid(ids[0].slice(0, 17) + 'A')).toBe(false);
});

test('parse', () => {
  ids.forEach((id, i) => {
    expect(parse(id)).toStrictEqual(infos[i]);
  });
  expect(() => {
    parse(ids[0].slice(0, 17) + '0');
  }).toThrowError('ID is invalid');
});
