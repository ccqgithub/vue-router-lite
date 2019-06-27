const path = require('path');
const babel = require('rollup-plugin-babel');
const cjs = require('rollup-plugin-commonjs');
const node = require('rollup-plugin-node-resolve');
const replace = require('rollup-plugin-replace');
const vue = require('rollup-plugin-vue');
const pkg = require('../package.json');
const version = process.env.VERSION || pkg.version;
const banner =
`/*!
  * vue-router-lite v${version}
  * (c) 2019-present Season Chen
  * @license MIT
  */`;

const resolve = _path => path.resolve(__dirname, '../', _path);
let external = [];
external = external.concat(Object.keys(pkg.dependencies || {}));
external = external.concat(Object.keys(pkg.peerDependencies || {}));

module.exports = [
  // browser dev
  {
    file: resolve('dist/vue-router-lite.js'),
    format: 'umd',
    env: 'development'
  },
  {
    file: resolve('dist/vue-router-lite.min.js'),
    format: 'umd',
    env: 'production'
  },
  {
    file: resolve('dist/vue-router-lite.common.js'),
    format: 'cjs',
    external
  },
  {
    file: resolve('dist/vue-router-lite.esm.js'),
    format: 'es',
    external
  },
  {
    file: resolve('dist/vue-router-lite.esm.browser.js'),
    format: 'es',
    env: 'development',
    transpile: false
  },
  {
    file: resolve('dist/vue-router-lite.esm.browser.min.js'),
    format: 'es',
    env: 'production',
    transpile: false
  }
].map(genConfig);

function genConfig (opts) {
  const config = {
    input: {
      input: resolve('src/index.js'),
      plugins: [
        vue({
          css: false
        }),
        cjs(),
        node(),
        replace({
          __VERSION__: version
        })
      ],
      external: opts.external || []
    },
    output: {
      file: opts.file,
      format: opts.format,
      banner,
      name: 'VueRouterLite'
    }
  };

  if (opts.env) {
    config.input.plugins.unshift(replace({
      'process.env.NODE_ENV': JSON.stringify(opts.env)
    }));
  }

  if (opts.transpile !== false) {
    config.input.plugins.push(babel({
      babelrc: false,
      exclude: ['node_modules/**/*'],
      plugins: [
        '@babel/plugin-proposal-object-rest-spread'
      ],
      'presets': [
        ['@babel/env', {
          'modules': false
        }]
      ]
    }));
  }

  return config;
}
