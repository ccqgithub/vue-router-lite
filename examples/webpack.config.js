const fs = require('fs')
const path = require('path')
const VuePlugin = require('vue-loader/lib/plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const isProduction = process.env.NODE_ENV === 'production'
const publicPath = process.env.PUBLIC_PATH || '/'
const htmlPlugins = [
  new HtmlWebpackPlugin({
    filename: 'index.html',
    template: path.join(__dirname, 'index.html'),
    inject: false,
    publicPath,
    chunks: ['global.css']
  })
]
const entry = fs.readdirSync(__dirname).reduce((entries, dir) => {
  const fullDir = path.join(__dirname, dir)
  const entry = path.join(fullDir, 'app.js')
  const entryName = path.join('js', dir);
  if (fs.statSync(fullDir).isDirectory() && fs.existsSync(entry)) {
    entries[entryName] = entry;
    const filename = path.join(dir, 'index.html')
    const template = path.join(fullDir, 'index.html')
    htmlPlugins.push(new HtmlWebpackPlugin({
      filename,
      template,
      inject: false,
      publicPath,
      chunks: ['global.css', entryName]
    }))
  }

  return entries
}, {})

entry['global.css'] = path.join(__dirname, 'global.css')

module.exports = {
  // Expose __dirname to allow automatically setting basename.
  context: __dirname,
  node: {
    __dirname: true
  },

  mode: isProduction ? 'production' : 'development',

  entry,

  output: {
    path: path.join(__dirname, '__build__'),
    filename: '[name].js',
    chunkFilename: '[name].chunk.js',
    publicPath
  },

  module: {
    rules: [
      {
        test: /\.html$/,
        use: [
          {
            loader: 'ejs-loader'
          },
          {
            loader: "extract-loader",
          },
          {
            loader: 'html-loader',
            options: {
              minimize: false,
              removeComments: false,
              collapseWhitespace: false,
              interpolate: 'require'
            }
          }
        ]
      },
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
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath,
              hmr: !isProduction
            },
          },
          'css-loader'
        ]
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
    runtimeChunk: {
      name: 'runtime'
    },
    splitChunks: {
      cacheGroups: {
        'shared': {
          name: 'js/shared',
          test: /[\\/]node_modules[\\/]/,
          minChunks: 2
        }
      }
    }
  },

  plugins: [
    new VuePlugin(),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
      chunkFilename: 'css/[name].chunk.css',
    }),
  ]
  .concat(htmlPlugins)
}
