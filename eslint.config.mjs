import { defineConfig } from 'eslint-define-config';

export default defineConfig({
  root: true,
  extends: [
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
    'prettier'
  ],
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off',
    'no-inline-styles/no-inline-styles': 'error'
  },
  plugins: ['@typescript-eslint', 'no-inline-styles'],
  settings: {
    react: {
      version: 'detect'
    }
  }
});