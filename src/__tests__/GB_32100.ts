import { compute, isValid, parse } from '../GB_32100';

const ids = ['91350100M000100Y43'];
const infos = [
  { adminDept: '工商', areaCode: '350100', id: 'M000100Y4', type: '企业' }
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
  }).toThrowError('Code is invalid');
  expect(() => {
    const id = '01350100M000100Y4';
    parse(id + compute(id));
  }).toThrowError('Admin department is invalid');
  expect(() => {
    const id = '90350100M000100Y4';
    parse(id + compute(id));
  }).toThrowError('Organization type is invalid');
});
