import assert from './assert';
import { mod11_2 } from './ISO_7064';

/**
 * 计算身份证校验位
 * @param id 身份证前17位
 * @returns 校验位
 */
export function compute(id: string): string {
  const s = id.slice(0, 17);
  return mod11_2(s);
}
/**
 * 校验身份证号是否有效
 * @param id 身份证号
 * @returns 返回是否有效
 */
export function isValid(id: string): boolean {
  const re = /^\d+[\d|X]$/;
  if (!id) return false;
  if (id.length !== 18) return false;
  if (!re.test(id)) return false;
  return compute(id) === id[17];
}

interface IdentityInfo {
  areaCode: string;
  birth: string;
  sex: number;
  order: number;
}
/**
 * 解析身份证获取身份信息
 * @param id 身份证号
 * @returns 身份信息
 */
export function parse(id: string): IdentityInfo {
  assert(isValid(id), 'INVALID_ID', 'ID is invalid');
  const areaCode = id.slice(0, 6);
  const year = id.slice(6, 10);
  const month = id.slice(10, 12);
  const day = id.slice(12, 14);
  const order = Number(id.slice(14, 17));
  return {
    areaCode,
    birth: `${year}-${month}-${day}`,
    sex: order % 2,
    order
  };
}
