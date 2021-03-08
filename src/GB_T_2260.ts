import AREA from './area';

interface AreaInfo {
  code: string;
  name: string;
  province: string;
  city?: string;
  county?: string;
  revoked: boolean;
  usedNames: string[];
}

interface AreaNode {
  code: string;
  name: string;
}

interface AreaTree extends AreaNode {
  children: AreaNode[];
}
/**
 * 根据区域代码获取名称
 * @param code 区域代码
 * @returns 区域名称
 */
export function getAreaName(code: string): string {
  return AREA.data[code] || AREA.revoked[code];
}

let nameMap: { [name: string]: string[] };

/**
 * 根据区域名称获取区域代码
 * @param name 区域名称
 * @returns 区域代码数组
 */
export function getAreaCode(name: string): string[] {
  if (!nameMap) {
    nameMap = {};
    const push = (k: string, v: string) => {
      if (!nameMap[k]) {
        nameMap[k] = [];
      }
      nameMap[k].push(v);
    };
    const walk = (obj: { [code: string]: string | string[] }) => {
      Object.keys(obj).forEach((k: string) => {
        const v = obj[k];
        if (Array.isArray(v)) {
          v.forEach((n) => push(n, k));
        } else {
          push(v, k);
        }
      });
    };
    walk(AREA.data);
    walk(AREA.revoked);
    walk(AREA.usedNames);
  }
  return nameMap[name];
}
/**
 * 判断区域代码是否已撤销
 * @param code 区域代码
 * @returns 是否已撤销
 */
export function isRevoked(code: string): boolean {
  if (AREA.revoked[code]) return true;
  return false;
}
/**
 * 获取曾用名
 * @param code 区域代码
 * @returns 返回曾用名列表
 */
export function getUsedNames(code: string): string[] {
  return AREA.usedNames[code] || [];
}
/**
 * 获取区域信息
 * @param code 区域代码
 * @returns 区域信息
 */
export function getArea(code: string): AreaInfo {
  const s1 = code.slice(0, 2);
  const s2 = code.slice(2, 4);
  const s3 = code.slice(4, 6);
  const obj: AreaInfo = {
    code,
    name: getAreaName(code),
    province: getAreaName(s1 + '0000'),
    revoked: isRevoked(code),
    usedNames: getUsedNames(code)
  };
  if (s2 === '00') {
    return obj;
  }
  if (s3 === '00') {
    obj.city = getAreaName(code);
    return obj;
  }
  obj.city = getAreaName(s1 + s2 + '00');
  // 直辖市特殊处理
  if (!obj.city) {
    obj.city = obj.province;
  }
  obj.county = getAreaName(code);
  return obj;
}
/**
 * 按照树形结构获取省市县数据
 * @returns 返回省市县树状结构
 */
export function getAreaTree(): AreaTree[] {
  const map: { [key: string]: AreaTree } = {};
  const roots: AreaTree[] = [];
  Object.keys(AREA.data).forEach((k: string) => {
    map[k] = {
      code: k,
      name: AREA.data[k],
      children: []
    };
  });
  Object.keys(AREA.data).forEach((k: string) => {
    const s1 = k.slice(0, 2);
    const s2 = k.slice(2, 4);
    const s3 = k.slice(4, 6);
    if (s3 !== '00') {
      const cityCode = s1 + s2 + '00';
      // 直辖市特殊处理
      if (!map[cityCode]) {
        const province = map[s1 + '0000'];
        map[cityCode] = {
          code: cityCode,
          name: province.name,
          children: []
        };
        province.children.push(map[cityCode]);
      }
      map[cityCode].children.push(map[k]);
      return;
    }
    if (s2 !== '00') {
      map[s1 + '0000'].children.push(map[k]);
      return;
    }
    roots.push(map[k]);
  });
  return roots;
}
/**
 * 获取省份列表
 * @returns 返回省份列表
 */
export function getProvinces(): AreaNode[] {
  return Object.keys(AREA.data)
    .filter((k) => k.endsWith('0000'))
    .map((k) => ({
      code: k,
      name: AREA.data[k]
    }));
}
/**
 * 获取市级列表
 * @param province 省份代码
 * @returns 市级列表
 */
export function getCities(province?: string): AreaNode[] {
  return Object.keys(AREA.data)
    .filter((k) => {
      const s1 = k.slice(0, 2);
      const s2 = k.slice(2, 4);
      const s3 = k.slice(4, 6);
      if (s2 === '00' || s3 !== '00') return false;
      if (province) {
        return province.slice(0, 2) === s1;
      }
      return true;
    })
    .map((k) => ({
      code: k,
      name: AREA.data[k]
    }));
}
/**
 * 获取所有县级列表
 * @param city 市代码
 * @returns 县级列表
 */
export function getCounties(city?: string): AreaNode[] {
  return Object.keys(AREA.data)
    .filter((k) => {
      if (k.slice(4, 6) === '00') return false;
      if (city) {
        if (city.slice(2, 4) === '00') {
          return city.slice(0, 2) === k.slice(0, 2);
        }
        return city.slice(0, 4) === k.slice(0, 4);
      }
      return true;
    })
    .map((k) => ({
      code: k,
      name: AREA.data[k]
    }));
}

export { AREA };
