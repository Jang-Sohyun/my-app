/* eslint-disable */

const config = {
  siteUrl: 'https://artddle.com',
  exclude:
    process.env.APP_ENV === 'PROD'
      ? ['/my-page/*', '/admin/*', '/admin']
      : ['*'],
  generateRobotsTxt: process.env.APP_ENV === 'PROD', // (optional)
  // ...other options
};
module.exports = config;
