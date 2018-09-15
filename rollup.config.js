const babel = require('rollup-plugin-babel');

let pkg = require('./package.json');
let external = [
  'rxjs',
  'rxjs/operators'
];

// external dependencies
external = external.concat(Object.keys(pkg.dependencies || {}));
// external peer dependencies
external = external.concat(Object.keys(pkg.peerDependencies || {}));

let plugins = [
  babel({
    babelrc: false,
    exclude: ['node_modules/**/*'],
    plugins: [
      'external-helpers'
    ],
    "presets": [
      ["env", {
        "targets": {
          "browsers": ["> 1%", "ie >= 8"]
        },
        "useBuiltIns": true,
        "modules": false
      }],
      "stage-2",
      "stage-3"
    ]
  })
];

let config = {
  input: 'index.js',
  plugins: plugins,
  external: external,
  output: {
    file: 'dist/gentx.common.js',
    format: 'cjs',
    sourcemap: true
  }
}

export default config;
