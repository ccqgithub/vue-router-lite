const fs = require('fs')
const path = require('path')
const VuePlugin = require('vue-loader/lib/plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

const htmlPlugins = [];

module.exports = {
  // Expose __dirname to allow automatically setting basename.
  context: __dirname,
  node: {
    __dirname: true
  },

  mode: process.env.NODE_ENV || 'development',

  entry: fs.readdirSync(__dirname).reduce((entries, dir) => {
    const fullDir = path.join(__dirname, dir)
    const entry = path.join(fullDir, 'app.js')
    const entryName = path.join(dir, 'app.js').replace(/\.js$/, '');
    if (fs.statSync(fullDir).isDirectory() && fs.existsSync(entry)) {
      entries[entryName] = ['es6-promise/auto', entry]
      const filename = path.join(dir, 'index.html')
      const template = path.join(fullDir, 'index.html')
      htmlPlugins.push(new HtmlWebpackPlugin({
        filename,
        template,
        inject: false
      }))
    }

    return entries
  }, {}),

  output: {
    path: path.join(__dirname, '__build__'),
    filename: '[name].js',
    chunkFilename: '[id].chunk.js',
    publicPath: '/__build__/'
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: false,
            presets: ['@babel/preset-env'],
            plugins: [
              '@babel/plugin-syntax-dynamic-import', 
              '@babel/plugin-proposal-object-rest-spread'
            ]
          }
        }
      },
      {
        test: /\.vue$/,
        use: 'vue-loader'
      },
      {
        test: /\.css$/,
        use: ['vue-style-loader', 'css-loader']
      }
    ]
  },

  resolve: {
    alias: {
      vue: 'vue/dist/vue.esm.js',
      'vue-router-lite': path.join(__dirname, '..', 'dist/vue-router-lite.common.js')
    }
  },

  optimization: {
    splitChunks: {
      cacheGroups: {
        shared: {
          name: 'shared',
          chunks: 'initial',
          minChunks: 2
        }
      }
    }
  },

  plugins: [
    new VuePlugin(),
    new CopyPlugin([
      'index.html',
      'global.css'
    ]),
  ].concat(htmlPlugins)
}
