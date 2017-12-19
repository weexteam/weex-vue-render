process.env.NODE_ENV = 'production'

const path = require('path')
const ora = require('ora')
const chalk = require('chalk')
const del = require('del')
const webpack = require('webpack')
const merge = require('webpack-merge')
const config = require('../config')
const webpackConfigs = require('./webpack.prod.config')
const {
  getTestEntries,
  getWebEntries,
  getNativeEntries
} = require('./get-entries')
const resolve = require('./utils').resolve

let isTest = false
const argv = process.argv[2]
if (argv === '--test') {
  // build for tests.
  isTest = true
}

let webConfig = merge(webpackConfigs[0], {
  entry: isTest ? getTestEntries() : getWebEntries()
})
if (isTest) {
  // remove uglify plugin.
  webConfig.plugins.pop()
  webConfig = merge(webConfig, {
    output: {
      path: resolve('test/bundles'),
      publicPath: '/bundles/',
      library: 'bundle',
      libraryTarget: 'umd'
    },
    devtool: false
  })
  del.sync(resolve('test/bundles'))
}

const finalConfig = isTest
  ? webConfig
  : [webConfig, merge(webpackConfigs[1], { entry: getNativeEntries() })]

const spinner = ora(`building examples for ${isTest ? 'test' : 'production'}...`)
spinner.start()

webpack(finalConfig, function (err, stats) {
  spinner.stop()
  if (err) throw err
  process.stdout.write(stats.toString({
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false
  }) + '\n\n')

  console.log(chalk.cyan('  Build complete.\n'))
  console.log(chalk.yellow(
    '  Tip: built files are meant to be served over an HTTP server.\n' +
    '  Opening dist/index.html over file:// won\'t work.\n'
  ))
})
