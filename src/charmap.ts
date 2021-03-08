type CharMap = {
  [ch: string]: number;
};
const cache: { [alphabet: string]: CharMap } = {};
export function getCharMap(alphabet: string): CharMap {
  if (!cache[alphabet]) {
    cache[alphabet] = {};
    for (let i = 0; i < alphabet.length; i++) {
      cache[alphabet][alphabet[i]] = i;
    }
  }
  return cache[alphabet];
}
