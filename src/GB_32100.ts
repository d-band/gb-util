import assert from './assert';
import { checkLength, computeCC } from './GB_T_17710';

export const ADMIN_DEPT: {
  [key: string]: {
    name: string;
    types: {
      [key: string]: string;
    };
  };
} = {
  '1': {
    name: '机构编制',
    types: {
      '1': '机关',
      '2': '事业单位',
      '3': '中央编办直接管理机构编制的群众群体',
      '9': '其它'
    }
  },
  '5': {
    name: '民政',
    types: {
      '1': '社会团体',
      '2': '民办非企业单位',
      '3': '基金会',
      '9': '其它'
    }
  },
  '9': {
    name: '工商',
    types: {
      '1': '企业',
      '2': '个体工商户',
      '3': '农民专业合作社'
    }
  },
  Y: {
    name: '其他',
    types: {
      '1': '其他'
    }
  }
};

interface OrgInfo {
  adminDept: string; // 第 1 位
  type: string; // 第 2 位
  areaCode: string; // 第 3-8 位
  id: string; // 第 9-17 位
}
/**
 * 计算统一社会信用代码的校验码
 * @param code 统一社会信用代码
 * @returns 返回一位校验码
 */
export function compute(code: string): string {
  // 加权因子: W[i] = (3 ** i) % 31
  const W = [1, 3, 9, 27, 19, 26, 16, 17, 20, 29, 25, 13, 8, 24, 10, 30, 28];
  const alphabet = '0123456789ABCDEFGHJKLMNPQRTUWXY';
  return computeCC(code, 31, W, alphabet);
}
/**
 * 验证统一社会信用代码
 * @param code 统一社会信用代码
 * @returns 返回是否有效
 */
export function isValid(code: string): boolean {
  if (!checkLength(code, 18)) return false;
  return compute(code) === code[17];
}
/**
 * 通过统一社会信用代码解析出组织信息
 * @param code 统一社会信用代码
 * @returns 返回组织信息
 */
export function parse(code: string): OrgInfo {
  assert(isValid(code), 'INVALID_CODE', 'Code is invalid');
  const dept = ADMIN_DEPT[code.slice(0, 1)];
  assert(dept, 'INVALID_ADMIN_DEPT', 'Admin department is invalid');
  const type = dept.types[code.slice(1, 2)];
  assert(type, 'INVALID_ORG_TYPE', 'Organization type is invalid');
  return {
    id: code.slice(8, 17),
    type,
    adminDept: dept.name,
    areaCode: code.slice(2, 8)
  };
}
