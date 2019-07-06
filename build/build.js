const { rollup } = require("rollup");
const babelPlugin = require('rollup-plugin-babel');
const cjsPlugin = require('rollup-plugin-commonjs');
const vuePlugin = require('rollup-plugin-vue');
const resolvePlugin = require("rollup-plugin-node-resolve");
const filesizePlugin = require("rollup-plugin-filesize");
const replacePlugin = require("rollup-plugin-replace");
const terserPlugin = require("rollup-plugin-terser").terser;

const fs = require("fs-extra");
const path = require("path");

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

// make sure we're in the right folder
process.chdir(__dirname, '../');

fs.removeSync("../dist");

async function generateBundledModule({ 
  inputFile, 
  outputFile, 
  format, 
  min, 
  env, 
  es5, 
  external = [] 
}) {
  console.log(`Generating ${outputFile} bundle.`);

  // basic
  let plugins = [
    vuePlugin({
      css: false
    }),
    cjsPlugin(),
    resolvePlugin(),
    replacePlugin({
      __VERSION__: version
    })
  ];

  // process.env.NODE_ENV
  if (env) {
    plugins.push(replacePlugin({
      'process.env.NODE_ENV': JSON.stringify(env)
    }));
  }

  // babel compield to es5
  if (es5) {
    plugins.push(babelPlugin());
  }

  // min
  if (min) {
    plugins.push(terserPlugin());
  }
  
  // file size
  plugins.push(filesizePlugin());

  // bundle
  const bundle = await rollup({
    input: inputFile,
    plugins,
    external
  });

  await bundle.write({
    file: outputFile,
    format,
    banner,
    exports: "named",
    name: format === "umd" ? "VueRouterLite" : undefined
  });

  console.log(`Generation of ${outputFile} bundle finished.`);
}

// outputs
const outputs = [
  // umd for no need compile
  {
    file: resolve('dist/vue-router-lite.umd.js'),
    format: 'umd',
    env: 'development',
    es5: true
  },
  {
    file: resolve('dist/vue-router-lite.umd.min.js'),
    format: 'umd',
    env: 'production',
    es5: true,
    min: true
  },

  // cjs, need to compile with `process.env.NODE_ENV` and `dependencies`
  {
    file: resolve('dist/vue-router-lite.js'),
    format: 'cjs',
    es5: true,
    external
  },

  // es module, need to compile with `process.env.NODE_ENV` and `dependencies`
  {
    file: resolve('dist/vue-router-lite.module.js'),
    format: 'es',
    es5: true,
    external
  },

  // es6, no need compile, work in envirements that es6 native support
  {
    file: resolve('dist/vue-router-lite.es6.js'),
    format: 'es',
    env: 'development'
  },
  {
    file: resolve('dist/vue-router-lite.es6.min.js'),
    format: 'es',
    env: 'production',
    min: true
  }
];

async function build() {
  const inputFile = path.join(__dirname, '../src/index.js');
  await Promise.all(outputs.map(item => {
    return generateBundledModule({
      inputFile,
      outputFile: item.file,
      format: item.format,
      es5: item.es5,
      env: item.env,
      min: item.min,
      external: item.external
    });
  }));
}

build().catch(e => {
  console.error(e);
  if (e.frame) {
    console.error(e.frame);
  }
  process.exit(1);
});