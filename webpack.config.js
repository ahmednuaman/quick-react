const _ = require('lodash')
const path = require('path')
const webpack = require('webpack')
const WebpackCleanPlugin = require('clean-webpack-plugin')
const WebpackHTMLPlugin = require('html-webpack-plugin')

const BUILD = path.resolve(__dirname, 'build')
const SRC = path.resolve(__dirname, 'src')
const PKG = require('./package.json')
const PRODUCTION = process.env.NODE_ENV === 'production'

let plugins = [
  new webpack.DefinePlugin(_.mapValues({
    PRODUCTION
  }, JSON.stringify)),
  new WebpackHTMLPlugin({
    title: PKG.title,
    template: './html/index',
    inject: false,
    minify: PRODUCTION ? {
      collapseWhitespace: true
    } : false,
    hash: true
  })
]

const devServer = PRODUCTION ? [] : ['webpack/hot/dev-server', 'webpack-hot-middleware/client']

if (PRODUCTION) {
  plugins.unshift(
    new WebpackCleanPlugin([BUILD])
  )
} else {
  plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  )
}

module.exports = {
  context: SRC,
  devtool: PRODUCTION ? false : 'eval-source-map',
  entry: {
    'asset/js/app.js': [
      ...devServer,
      './js/app'
    ]
  },
  module: {
    rules: [{
      test: /\.json$/,
      use: [{
        loader: 'json-loader'
      }]
    }, {
      exclude: /node_modules/,
      test: /\.jsx$/,
      use: [{
        loader: 'babel-loader'
      }]
    }]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.scss', '.html', '.json']
  },
  output: {
    filename: '[name].js',
    path: BUILD,
    publicPath: '/'
  },
  plugins: plugins
}
