import { getCharMap } from './charmap';

// from: https://github.com/LiosK/cdigit
export function computePure(
  num: string,
  mod: number,
  radix: number,
  hasTwoCCs: boolean,
  alphabet: string
): string {
  const ds = `${num}${alphabet[0]}${hasTwoCCs ? alphabet[0] : ''}`;
  const max = Math.floor(0xffffffffffff / radix);
  const charmap = getCharMap(alphabet);

  let c = 0;
  for (let i = 0, len = ds.length; i < len; i += 1) {
    c = c * radix + charmap[ds[i]];
    if (c > max) {
      c %= mod;
    }
  }
  c = (mod + 1 - (c % mod)) % mod;

  if (hasTwoCCs) {
    return `${alphabet[Math.floor(c / radix)]}${alphabet[c % radix]}`;
  }
  return alphabet[c];
}
// from: https://github.com/LiosK/cdigit
export function computeHybrid(ds: string, alphabet: string): string {
  const mod = alphabet.length;
  const charmap = getCharMap(alphabet);

  let c = mod;
  for (let i = 0, len = ds.length; i < len; i += 1) {
    c = (c % (mod + 1)) + charmap[ds[i]];
    c = (c % mod || mod) * 2;
  }
  c %= mod + 1;

  return alphabet[(mod + 1 - c) % mod];
}

const N = '0123456789';
const A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
// Pure systems
export function mod11_2(num: string): string {
  return computePure(num, 11, 2, false, N + 'X');
}
export function mod37_2(num: string): string {
  return computePure(num, 37, 2, false, N + A + '*');
}
export function mod97_10(num: string): string {
  return computePure(num, 97, 10, true, N);
}
export function mod661_26(num: string): string {
  return computePure(num, 661, 26, true, A);
}
export function mod1271_36(num: string): string {
  return computePure(num, 1271, 36, true, N + A);
}
// Hybrid systems
export function mod11_10(ds: string): string {
  return computeHybrid(ds, N);
}
export function mod27_26(ds: string): string {
  return computeHybrid(ds, A);
}
export function mod37_36(ds: string): string {
  return computeHybrid(ds, N + A);
}
