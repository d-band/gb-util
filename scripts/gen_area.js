/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../data');
const files = fs.readdirSync(dir).sort();
const diffPath = path.join(__dirname, '../diff');
if (!fs.existsSync(diffPath)) {
  fs.mkdirSync(diffPath);
}
const all = {};
const usedNames = {};
let latest = null;
files.forEach(file => {
  const data = require(`../data/${file}`);
  latest = data;
  const diff = {};
  Object.keys(data).forEach(k => {
    if (!all[k]) {
      diff[k] = data[k];
      all[k] = data[k];
    } else {
      if (all[k] !== data[k]) {
        if (!usedNames[k]) {
          usedNames[k] = [];
        }
        usedNames[k].push(all[k]);
        all[k] = data[k];
      }
    }
  });
  
  const diffFile = path.join(diffPath, file);
  fs.writeFileSync(diffFile, JSON.stringify(diff, null, '  '), 'utf-8');
});

const revoked = {};
Object.keys(all).forEach(k => {
  if (!latest[k]) {
    revoked[k] = all[k];
  }
});
const tsData = `/* AUTO-GENERATED FILE. DO NOT MODIFY. */
/* eslint-disable */
// prettier-ignore
const data: { [key: string]: string } = ${JSON.stringify(latest)};
// prettier-ignore
const revoked: { [key: string]: string } = ${JSON.stringify(revoked)};
// prettier-ignore
const usedNames: { [key:string]: string[] } = ${JSON.stringify(usedNames)};
export default { data, revoked, usedNames };
`;
const tsFile = path.join(__dirname, '../src', 'area.ts');
fs.writeFileSync(tsFile, tsData, 'utf-8');
