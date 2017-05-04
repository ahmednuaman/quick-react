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
const PORT = process.env.PORT || 3000
const PRODUCTION = process.env.NODE_ENV === 'production'

const ENTRY = !PRODUCTION
  ? [`webpack-hot-middleware/client?http://localhost:${PORT}`, 'webpack/hot/only-dev-server']
  : []

const plugins = [
  new webpack.DefinePlugin(_.mapValues({
    PRODUCTION
  }, JSON.stringify)),
  new WebpackExtractTextPlugin({
    allChunks: true,
    filename: 'asset/css/app.css'
  }),
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

const lessLoader = (include, modules) => ({
  include,
  test: /\.less$/,
  use: WebpackExtractTextPlugin.extract({
    fallback: 'style-loader',
    use: [{
      loader: 'css-loader',
      options: {
        modules,
        importLoaders: 3,
        minimize: PRODUCTION,
        sourceMap: !PRODUCTION
      }
    }, 'resolve-url-loader', {
      loader: 'postcss-loader',
      options: {
        plugins: () => [
          require('autoprefixer')
        ]
      }
    }, {
      loader: 'less-loader',
      options: {
        sourceMap: true
      }
    }]
  })
})

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
      ...ENTRY,
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
      }, 'img-loader']
    }, {
      test: /\.json$/,
      use: ['json-loader']
    }, {
      exclude: /node_modules/,
      test: /\.jsx?$/,
      use: ['babel-loader']
    }, lessLoader(/node_modules/, false), lessLoader(SRC, true)]
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
