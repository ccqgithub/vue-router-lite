module.exports = {
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  quoteProps: 'preserve',
  jsxSingleQuote: false,
  trailingComma: 'none',
  bracketSpacing: true,
  jsxBracketSameLine: false,
  arrowParens: 'always',
  requirePragma: false,
  insertPragma: false,
  proseWrap: 'preserve',
  htmlWhitespaceSensitivity: 'css',
  vueIndentScriptAndStyle: false,
  endOfLine: 'auto',
  overrides: [
    {
      files: '*.css',
      options: {
        singleQuote: false
      }
    },
    {
      files: '*.less',
      options: {
        singleQuote: false
      }
    },
    {
      files: '*.scss',
      options: {
        singleQuote: false
      }
    },
    {
      files: '*.md',
      options: {}
    }
  ]
};
