import { compute, isValid, parse } from '../GB_T_5795';

const isbns = [
  '4873113369',
  '978-4-87311-336-4',
  '9781590597279',
  '9789999999991'
];
const isbn13h = [
  '978-4-87311-336-4',
  '978-4-87311-336-4',
  '978-1-59059-727-9',
  undefined
];

test('compute', () => {
  isbns.forEach((id) => {
    expect(compute(id)).toBe(id.slice(-1));
  });
});

test('isValid', () => {
  isbns.forEach((id) => {
    expect(isValid(id)).toBe(true);
  });
  expect(isValid('')).toBe(false);
  expect(isValid('123')).toBe(false);
  isbns.forEach((id) => {
    expect(isValid(id.slice(0, -1) + '0')).toBe(false);
  });
});

test('parse', () => {
  isbns.forEach((id, i) => {
    const obj = parse(id);
    expect(obj.prefix).toBe('978');
    expect(obj.isbn13h).toBe(isbn13h[i]);
  });
  expect(() => {
    parse('invalid');
  }).toThrowError('ISBN is invalid');
});
