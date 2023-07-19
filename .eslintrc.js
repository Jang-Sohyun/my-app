module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['react', '@typescript-eslint'],
  extends: [
    'next/core-web-vitals',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    'prefer-const': 1,
    'no-empty-pattern': 1,
    '@typescript-eslint/no-empty-function': 0,
    '@typescript-eslint/no-empty-interface': 1,
    '@typescript-eslint/no-namespace': 0,
    '@typescript-eslint/ban-ts-comment': 0,
    'react/no-unescaped-entities': 0,
    '@next/next/no-img-element': 0,
    'react/display-name': 0,
  },
};
