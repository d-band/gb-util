import * as Area from '../GB_T_2260';

test('getAreaName', () => {
  expect(Area.getAreaName('110000')).toBe('北京市');
  expect(Area.getAreaName('130000')).toBe('河北省');
  expect(Area.getAreaName('130100')).toBe('石家庄市');
  expect(Area.getAreaName('130102')).toBe('长安区');
  expect(Area.getAreaName('372401')).toBe('德州市');
});
test('getAreaCode', () => {
  expect(Area.getAreaCode('北京市')).toStrictEqual(['110000']);
  expect(Area.getAreaCode('德州市')).toStrictEqual(['371400', '372401']);
});
test('isRevoked', () => {
  expect(Area.isRevoked('110000')).toBe(false);
  expect(Area.isRevoked('372401')).toBe(true);
});
test('getUsedNames', () => {
  expect(Area.getUsedNames('220281')).toStrictEqual(['蛟河市', '桦甸市']);
  expect(Area.getUsedNames('110000')).toStrictEqual([]);
});
test('getArea', () => {
  expect(Area.getArea('110105')).toStrictEqual({
    code: '110105',
    name: '朝阳区',
    province: '北京市',
    city: '北京市',
    county: '朝阳区',
    revoked: false,
    usedNames: []
  });
  expect(Area.getArea('130102')).toStrictEqual({
    code: '130102',
    name: '长安区',
    province: '河北省',
    city: '石家庄市',
    county: '长安区',
    revoked: false,
    usedNames: []
  });
  expect(Area.getArea('130000')).toStrictEqual({
    code: '130000',
    name: '河北省',
    province: '河北省',
    revoked: false,
    usedNames: []
  });
  expect(Area.getArea('130100')).toStrictEqual({
    code: '130100',
    name: '石家庄市',
    province: '河北省',
    city: '石家庄市',
    revoked: false,
    usedNames: []
  });
});
test('getAreaTree', () => {
  const tree = Area.getAreaTree();
  expect(tree).toHaveLength(34);
});
test('getProvinces', () => {
  expect(Area.getProvinces()).toHaveLength(34);
});
test('getCities', () => {
  expect(Area.getCities()).toHaveLength(333);
  expect(Area.getCities('110000')).toHaveLength(0);
});
test('getCounties', () => {
  expect(Area.getCounties()).toHaveLength(2843);
  expect(Area.getCounties('110000')).toHaveLength(16);
  expect(Area.getCounties('130100')).toHaveLength(22);
});
