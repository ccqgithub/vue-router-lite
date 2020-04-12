module.exports = {
  parserOptions: {
    // move it into parserOptions, for eslint-plugin-vue
    // https://github.com/vuejs/eslint-plugin-vue#couple-faq
    parser: 'babel-eslint',
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  plugins: [
    // https://github.com/babel/eslint-plugin-babel
    'babel',
    // https://github.com/prettier/eslint-plugin-prettier
    'prettier'
  ],
  extends: [
    // https://github.com/vuejs/eslint-plugin-vue#bulb-rules
    'plugin:vue/strongly-recommended',

    // https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb
    'airbnb-base',

    // https://github.com/prettier/eslint-plugin-prettier
    'prettier',
    'prettier/react',
    'prettier/standard',
    'prettier/vue'
  ],
  env: {
    browser: true,
    es6: true
  },
  rules: {
    eqeqeq: 'warn',
    'prettier/prettier': 'warn',
    'no-unused-vars': ['warn', { args: 'none' }],
    'no-console': 'off',
    'no-script-url': 'warn',
    'no-shadow': 'warn',
    'no-plusplus': 'off',
    'no-param-reassign': 'off',
    'no-underscore-dangle': 'off',
    'prefer-const': 'off',
    'prefer-destructuring': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/prefer-default-export': 'off',
    'import/no-dynamic-require': 'off',
    'global-require': 'off',
    'consistent-return': 'off',
    'max-classes-per-file': 'off',
    'arrow-body-style': 'off',
    'class-methods-use-this': 'off',
    'prefer-arrow-callback': 'off',
    'vue/html-quotes': 'error',
    'vue/this-in-template': 'error',
    'vue/max-attributes-per-line': [
      'warn',
      {
        singleline: 20,
        multiline: {
          max: 1,
          allowFirstLine: false
        }
      }
    ]
  },
  overrides: [
    {
      files: ['build/**/*'],
      parserOptions: {
        // move it into parserOptions, for eslint-plugin-vue
        // https://github.com/vuejs/eslint-plugin-vue#couple-faq
        parser: 'espree',
        ecmaVersion: 2018,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true
        }
      },
      env: {
        browser: false,
        node: true
      }
    }
  ]
};
