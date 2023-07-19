/* eslint-disable */

const axios = require('axios');
const fs = require('fs');

const LOCALES = ['ko', 'en'];

const getLocale = (locale) =>
  axios
    .get(`https://static.getraffle.io/translate/${locale}.json`, {
      headers: {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        Expires: '0',
      },
    })
    .then((res) => res.data);
(async () => {
  const isFolderExists = fs.existsSync('locales');
  if (!isFolderExists) {
    fs.mkdirSync('locales');
  }
  try {
    //  renewRemoteLocale
    await axios.get('https://api.getraffle.io/api/r/translate');
  } catch (e) {
    console.error(e);
  }
  await Promise.all(
    LOCALES.map(async (locale) => {
      const data = await getLocale(locale);
      if (data)
        fs.writeFileSync(`locales/${locale}.json`, JSON.stringify(data));
    })
  );
})();
