import babel from 'rollup-plugin-babel';
import vue from 'rollup-plugin-vue';
import resolve from 'rollup-plugin-node-resolve';

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
];

let config = {
  input: 'src/index.js',
  plugins: plugins,
  external: external,
  output: {
    file: 'dist/vue-router-lite.common.js',
    format: 'cjs',
    sourcemap: true
  }
}

export default config;
