GB Utilities
============

> `gb-util` is a toolset for Chinese standards. It supports: `GB 11643`, `GB 11714`, `GB 32100`, `GB/T 2260`, `GB/T 17710`, `ISO 7064`.

[![NPM version](https://img.shields.io/npm/v/gb-util.svg)](https://www.npmjs.com/package/gb-util)
[![NPM downloads](https://img.shields.io/npm/dm/gb-util.svg)](https://www.npmjs.com/package/gb-util)
[![Build Status](https://travis-ci.com/d-band/gb-util.svg?branch=master)](https://travis-ci.com/d-band/gb-util)
[![Coverage Status](https://coveralls.io/repos/github/d-band/gb-util/badge.svg?branch=master)](https://coveralls.io/github/d-band/gb-util?branch=master)
[![Dependency Status](https://david-dm.org/d-band/gb-util.svg)](https://david-dm.org/d-band/gb-util)

## Install

```bash
$ npm install gb-util
```

## Usage

```javascript
import {
  GB_11643,
  GB_11714,
  GB_32100,
  GB_T_2260,
  GB_T_17710,
  GB_T_5795,
  ISO_7064
} from 'gb-util';

GB_11643.compute('11010519491231002'); // => 'X'
GB_11643.isValid('11010519491231002X'); // => true
GB_11643.parse('11010519491231002X');
// => { areaCode: '110105', birth: '1949-12-31', order: 2, sex: 0 }

GB_11714.compute('D2143569'); // => 'X'
GB_11714.isValid('D2143569X'); // => true

GB_32100.compute('91350100M000100Y4'); // => '3'
GB_32100.isValid('91350100M000100Y43'); // => true
GB_32100.parse('91350100M000100Y43');
// => { adminDept: '工商', areaCode: '350100', id: 'M000100Y4', type: '企业' }

GB_T_2260.getAreaName('110000'); // => '北京市'
GB_T_2260.getAreaCode('北京市'); // => ['110000']
GB_T_2260.isRevoked('372401'); // => true
GB_T_2260.getUsedNames('220281'); // => ['蛟河市', '桦甸市']
GB_T_2260.getArea('110105');
/* => {
  code: '110105',
  name: '朝阳区',
  province: '北京市',
  city: '北京市',
  county: '朝阳区',
  revoked: false,
  usedNames: []
} */
GB_T_2260.getAreaTree();
// => [{ code: '130000', name: '河北省', children: [...] }, ...]
GB_T_2260.getProvinces();
// => [{ code: '110000', name: '北京市' }, ...]
GB_T_2260.getCities('130000');
// => [{ code: '130100', name: '石家庄市' }, ...]
GB_T_2260.getCounties('130100');
// => [{ code: '130102', name: '长安市' }, ...]

ISO_7064.mod11_2('0794'); // => '0'
ISO_7064.mod37_2('1234ABCD'); // => 'V'
ISO_7064.mod97_10('794'); // => '44'
ISO_7064.mod661_26('ABCD'); // => 'KN'
ISO_7064.mod1271_36('ISO79'); // => '3W'

GB_T_5795.compute('978-4-87311-336-4'); // => 4
GB_T_5795.isValid('978-4-87311-336-4'); // => true
GB_T_5795.parse('9784873113364');
/* => {
  isIsbn10: false,
  isbn10: '4873113369',
  isbn13: '9784873113364',
  prefix: '978',
  group: '4',
  groupName: 'Japan',
  publisher: '87311',
  article: '336',
  isbn10h: '4-87311-336-9',
  isbn13h: '978-4-87311-336-4'
} */
```

## Documents

[Read full documents](https://d-band.github.io/gb-util/)

## Report a issue

* [All issues](https://github.com/d-band/gb-util/issues)
* [New issue](https://github.com/d-band/gb-util/issues/new)

## License

gb-util is available under the terms of the MIT License.
