import { checkLength, computeCC } from './GB_T_17710';
/**
 * 计算组织机构代码的校验码
 * @param code 组织机构代码
 * @returns 返回一位校验码
 */
export function compute(code: string): string {
  // 加权因子: W[i] = (2 ** (8 - i)) % 11
  const W = [3, 7, 9, 10, 5, 8, 4, 2];
  const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const chars = '0123456789X';
  return computeCC(code, 11, W, alphabet, chars);
}
/**
 * 验证组织机构代码是否有效
 * @param code 组织机构代码
 * @returns 返回是否有效
 */
export function isValid(code: string): boolean {
  if (!checkLength(code, 9)) return false;
  return compute(code) === code[8];
}
