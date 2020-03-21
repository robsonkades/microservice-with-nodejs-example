module.exports = {
  env: {
    es6: true,
    node: true,
    jest: true,
  },
  extends: ['airbnb-base', 'prettier'],
  plugins: ['prettier', 'jest', 'import', 'eslint-plugin-import-helpers'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    'prettier/prettier': 'error',
    camelcase: 'off',
    'no-underscore-dangle': 'off',
    'no-unused-vars': ['error', { argsIgnorePattern: 'next' }],
    'class-methods-use-this': 'off',
    'no-param-reassign': 'off',
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: ['**/*.test.js', '__tests__/utils/*.js'],
      },
    ],
    'import-helpers/order-imports': [
      'warn',
      {
        newlinesBetween: 'always',
        groups: [
          'absolute',
          'module',
          ['sibling', 'parent'],
          '/^./app/middlewares/',
          '/^./app/controllers/',
          '/^./app/validators/',
          'index',
        ],
        alphabetize: { order: 'asc', ignoreCase: true },
      },
    ],
  },
};
