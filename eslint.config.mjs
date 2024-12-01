// @ts-check
import { includeIgnoreFile } from '@eslint/compat';
import eslint from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import tseslint from 'typescript-eslint';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const gitignorePath = path.resolve(__dirname, '.gitignore');

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,
  eslintPluginUnicorn.configs['flat/recommended'],
  {
    languageOptions: {
      parser: tseslint.parser,
      ecmaVersion: 2022,
      sourceType: 'module',
    },
  },
  {
    name: 'Global Ignores',
    ignores: [
      // @ts-ignore
      ...includeIgnoreFile(gitignorePath).ignores,
      '/.cache',
      '/.git',
      '/.husky',
      '/.yarn',
      'eslint.config.mjs',
    ],
  },
  {
    files: ['**/*.tsx', '**/*.ts'],
  },
  eslintConfigPrettier,
);
