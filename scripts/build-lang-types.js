/* eslint-disable */

const fs = require('fs');

// locale에 따라 타입을 만든다.

(async () => {
  const path = 'locales/ko.json';
  const typePath = 'types/localeWords.ts';
  const json = fs.readFileSync(path, { encoding: 'utf8' });
  if (json) {
    const getKeys = (obj) => {
      const keys = [];
      Object.keys(obj);

      return Object.entries(obj).reduce((acc, [key, value]) => {
        if (typeof value === 'object') {
          acc.push(...getKeys(value).map((k) => `${key}.${k}`));
        } else {
          acc.push(key);
        }
        return acc;
      }, []);
      return keys;
    };

    const keys = getKeys(JSON.parse(json));
    fs.writeFileSync(
      typePath,
      `export type LocaleWords = ${keys.map((key) => `'${key}'`).join(' | ')};`
    );
  } else {
    console.error("can't read file", path);
  }
})();
