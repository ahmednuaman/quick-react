const browserSync = require('browser-sync')
const fs = require('fs')
const path = require('path')
const url = require('url')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')

const webpackConfig = require('./webpack.config')
const bundler = webpack(webpackConfig)

const BUILD = path.resolve(__dirname, 'build')

browserSync({
  server: {
    port: process.env.PORT,
    baseDir: BUILD,
    middleware: [
      (req, res, next) => {
        const requestURL = url.parse(req.url)
        const pathname = requestURL.pathname
        const exists = fs.existsSync(path.join(BUILD, pathname))

        if (!exists) {
          req.url = '/index.html'
        }

        return next()
      },
      webpackDevMiddleware(bundler, {
        publicPath: webpackConfig.output.publicPath,
        stats: {
          colors: true
        }
      }),
      webpackHotMiddleware(bundler)
    ]
  },
  files: [
    `${BUILD}/asset/css/*.css`,
    `${BUILD}/asset/img/*`,
    `${BUILD}/*.html`
  ]
})
