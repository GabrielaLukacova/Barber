const js = require('@eslint/js');
const tseslint = require('typescript-eslint');
const prettierConfig = require('eslint-config-prettier');

module.exports = [
  { ignores: ['dist/**', 'build/**', 'node_modules/**', 'uploads/**'] },

  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettierConfig,

  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    },
  },
];
