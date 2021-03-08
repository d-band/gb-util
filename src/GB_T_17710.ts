import { getCharMap } from './charmap';

export function checkLength(s: string, n: number): boolean {
  const re = /^[0-9A-Z]+$/;
  if (!s) return false;
  if (s.length !== n) return false;
  return re.test(s);
}
/**
 * 计算校验码
 * @param s 待计算的字符串
 * @param M 取余的除数
 * @param W 加权因子数组
 * @param alphabet 代码字符集
 * @param chars 校验位字符集（默认为代码字符集）
 * @returns 校验码
 */
export function computeCC(
  s: string,
  M: number,
  W: number[],
  alphabet: string,
  chars?: string
): string {
  chars = chars || alphabet;
  const n = W.length;
  const C = getCharMap(alphabet);
  let c = 0;
  for (let i = 0; i < n; i++) {
    const Ci = C[s[i]];
    c += Ci * W[i];
  }
  c = (M - (c % M)) % M;
  return chars[c];
}
