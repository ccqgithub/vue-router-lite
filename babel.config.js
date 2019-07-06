module.exports = {
  babelrc: false,
  exclude: ['node_modules/**/*'],
  plugins: [
    '@babel/plugin-proposal-object-rest-spread'
  ],
  presets: [
    ['@babel/env', {
      'modules': false
    }]
  ]
}