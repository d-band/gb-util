/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs').promises;
const path = require('path');
const got = require('got');
const cheerio = require('cheerio');

const domain = 'http://www.mca.gov.cn';
const from1980 = '/article/sj/xzqh/1980/';
const year2020 = '/article/sj/xzqh/2020/';

const pad = (s) => s.length === 2 ? s : `0${s}`;

function getDate(s) {
  if (s.indexOf('行政区划代码') < 0) return null;
  let m = s.match(/(\d+)年(\d+)月(\d+)日/);
  if (m) {
    return `${m[1]}-${pad(m[2])}-${pad(m[3])}`;
  }
  m = s.match(/(\d+)年(\d+)月/);
  if (m) {
    return `${m[1]}-${pad(m[2])}-01`;
  }
}

async function getData(url) {
  if (!/^http/i.test(url)) {
    url = domain + url;
  }
  const text = await got(url, { retry: 3 }).text();
  const $ = cheerio.load(text);
  const content = $('.content');
  if (content.length) {
    const link = $('a', content);
    if (link.length) {
      return getData($(link[0]).attr('href'));
    } else {
      const m = text.match(/window\.location\.href="([^"]+)"/);
      if (m) {
        return getData(m[1]);
      }
    }
  }
  const data = {};
  $('tr').each((i, el) => {
    const arr = $(el).text().trim().replace(/\s+/g, ' ').split(' ');
    if (arr.length >= 2 && /^\d+$/.test(arr[0])) {
      data[arr[0]] = arr[1];
    }
  });
  return data;
}
async function main(listUrl) {
  let total = 0;
  let page = 1;
  do {
    const url = page === 1 ? listUrl : `${listUrl}?${page}`;
    const body = await got(url, { retry: 3 }).text();
    const $ = cheerio.load(body);
    const list = [];
    $('a.artitlelist').each((i, el) => {
      const title = $(el).text();
      const date = getDate(title);
      const link = $(el).attr('href');
      if (date) {
        list.push({ date, link });
      }
    });
    for (const item of list) {
      const data = await getData(item.link);
      if (Object.keys(data).length < 10) {
        continue;
      }
      const file = path.join(__dirname, '../data', `${item.date}.json`);
      await fs.writeFile(file, JSON.stringify(data, null, '  '), 'utf-8');
      console.log(item.date);
    }
    const matched = body.match(/totalpage\s*=\s*"(\d+)"/);
    if (page === 1 && matched) {
      total = parseInt(matched[1]);
    }
    page++;
  } while (page <= total);
}

const baseUrl = process.argv[2] === '1980' ? from1980 : year2020;

main(domain + baseUrl).then(() => {
  console.log('done.');
}).catch(e => {
  console.error(e);
  process.exit(1);
});
