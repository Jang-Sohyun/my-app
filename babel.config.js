module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo', 'next/babel', '@babel/preset-env', '@babel/preset-react'],
    plugins: ['@babel/plugin-proposal-class-properties'],
    ignore: ['node_modules/next/dist/compiled/gzip-size/index.js'],
  };
};
