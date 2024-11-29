/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {import("prettier").Config}
 */
export default {
  arrowParens: 'always',
  bracketSpacing: true,
  singleQuote: true,
  singleAttributePerLine: true,
  semi: true,
  tabWidth: 2,
  trailingComma: 'all',
  useTabs: false,
  plugins: ['@trivago/prettier-plugin-sort-imports'],
};
