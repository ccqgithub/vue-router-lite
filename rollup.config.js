import babel from 'rollup-plugin-babel';
import vue from 'rollup-plugin-vue';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

let pkg = require('./package.json');
let external = [];

// // external dependencies
// external = external.concat(Object.keys(pkg.dependencies || {}));
// // external peer dependencies
// external = external.concat(Object.keys(pkg.peerDependencies || {}));

let plugins = [
  vue({
    css: false
  }),
  babel({
    babelrc: false,
    exclude: ["node_modules/**/*"],
    plugins: [],
    "presets": [
      ["@babel/env", {
        "modules": false
      }]
    ]
  }),
  commonjs({

  }),
  // resolve({
  //   // pass custom options to the resolve plugin
  //   customResolveOptions: {
  //     moduleDirectory: 'node_modules'
  //   }
  // })
];

let config = {
  input: 'src/index.js',
  plugins: plugins,
  external: external,
  output: [
    {
      file: 'dist/router.common.js',
      format: 'cjs',
      sourcemap: true
    },
    {
      file: 'dist/router.esm.js',
      format: 'esm',
      sourcemap: true
    },
  ]
}

export default config;
