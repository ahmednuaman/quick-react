const _ = require('lodash')
const path = require('path')
const webpack = require('webpack')
const WebpackBabiliPlugin = require('babili-webpack-plugin')
const WebpackCleanPlugin = require('clean-webpack-plugin')
const WebpackExtractTextPlugin = require('extract-text-webpack-plugin')
const WebpackHTMLPlugin = require('html-webpack-plugin')

const BUILD = path.resolve(__dirname, 'build')
const SRC = path.resolve(__dirname, 'src')
const PKG = require('./package.json')
const PORT = process.env.PORT
const PRODUCTION = process.env.NODE_ENV === 'production'

const devServer = PRODUCTION ? [] : ['webpack/hot/dev-server', 'webpack-hot-middleware/client']
const reactHotLoader = PRODUCTION ? [] : ['react-hot-loader']

let plugins = [
  new webpack.DefinePlugin(_.mapValues({
    PRODUCTION
  }, JSON.stringify)),
  new WebpackExtractTextPlugin('asset/css/asset.css'),
  new WebpackHTMLPlugin({
    title: PKG.name,
    template: './html/index',
    inject: false,
    minify: PRODUCTION ? {
      collapseWhitespace: true
    } : false,
    hash: true
  })
]

if (PRODUCTION) {
  plugins.unshift(new WebpackCleanPlugin([BUILD]))
  plugins.push(new WebpackBabiliPlugin())
} else {
  plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  )
}

module.exports = {
  context: SRC,
  devtool: PRODUCTION ? false : 'eval-source-map',
  entry: {
    'asset/js/app.js': [
      ...devServer,
      './js/app',
      'bootstrap/less/bootstrap'
    ]
  },
  module: {
    rules: [{
      test: /\.(eot|woff2?|ttf|svg)/,
      include: /font/,
      use: [{
        loader: 'file-loader',
        query: {
          name: '/asset/font/[name].[ext]'
        }
      }]
    }, {
      test: /\.(jpg|png|gif|svg)/,
      exclude: /font/,
      use: [{
        loader: 'url-loader',
        query: {
          limit: 1000,
          name: '/asset/img/[hash].[ext]'
        }
      }, {
        loader: 'img-loader'
      }]
    }, {
      test: /\.json$/,
      use: [{
        loader: 'json-loader'
      }]
    }, {
      exclude: /node_modules/,
      test: /\.jsx?$/,
      use: [
        ...reactHotLoader, {
        loader: 'babel-loader'
      }]
    }, {
      test: /\.less$/,
      use: WebpackExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [{
          loader: 'css-loader',
          options: {
            minimize: PRODUCTION,
            sourceMap: !PRODUCTION,
            modules: true
          }
        }, {
          loader: 'resolve-url-loader'
        }, {
          loader: 'less-loader',
          options: {
            sourceMap: true
          }
        }]
      })
    }]
  },
  resolve: {
    extensions: ['.html', '.js', '.json', '.jsx', '.less']
  },
  output: {
    filename: '[name]',
    path: BUILD,
    publicPath: '/'
  },
  plugins: plugins
}
