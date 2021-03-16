/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const path = require('path');
const got = require('got');
const FormData = require('form-data');
const { parseStringPromise } = require('xml2js');

const domain = 'https://www.isbn-international.org';

async function main() {
  const url = `${domain}/?q=bl_proxy/GetRangeInformations`;
  const body = new FormData();
  body.append('format', 1);
  body.append('language', 'en');
  body.append('translatedTexts', 'Printed;Last Change');
  const { result } = await got.post(url, { body }).json();
  const fileUrl = `${domain}/?q=download_range/${result.value}/${result.filename}`;
  const xml = await got(fileUrl).text();
  const data = await parseStringPromise(xml);
  const getRanges = (rules) => rules
    .filter(v => v.Length[0] !== '0')
    .map(v => {
      const l = v.Length[0];
      const arr = v.Range[0].split('-');
      return [arr[0].slice(0, l), arr[1].slice(0, l)];
    });
  const groups = data.ISBNRangeMessage.RegistrationGroups[0].Group.reduce((obj, g) => ({
    ...obj,
    [g.Prefix[0]]: {
      name: g.Agency[0].trim(),
      ranges: getRanges(g.Rules[0].Rule)
    }
  }), {});
  if (groups['978-7'].ranges.length === 5) {
    groups['978-7'].ranges[4][0] = '900000';
    groups['978-7'].ranges[4][1] = '989999';
    groups['978-7'].ranges.push(['9900000', '9999999']);
  }
  const tsData = [
    '/* AUTO-GENERATED FILE. DO NOT MODIFY. */',
    '/* eslint-disable */',
    '// prettier-ignore',
    `const data: { [key: string]: { name: string, ranges: string[][] } } = ${JSON.stringify(groups)};`,
    'export default data;\n'
  ].join('\n');
  const tsFile = path.join(__dirname, '../src', 'isbn_groups.ts');
  fs.writeFileSync(tsFile, tsData, 'utf-8');
}

main().then(() => {
  console.log('done.');
}).catch(e => {
  console.error(e);
  process.exit(1);
});