process.env.NODE_ENV = 'production'

const path = require('path')
const ora = require('ora')
const fs = require('fs-extra')
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

const debug = config.debug
if (debug) {
  process.env.NODE_ENV = 'development'
}

let isTest = false
const argv = process.argv[2]
if (argv === '--test') {
  // build for tests.
  isTest = true
}

let webConfig = merge(webpackConfigs[0], {
  entry: isTest ? getTestEntries() : getWebEntries()
})

function generateTestMeta (entries, file) {
  // to generate test/bundles.js
  const dir = {}
  for (const key in entries) {
    const arr = key.split('/')
    let next = dir
    for (let i = 0, l = arr.length; i < l; i++) {
      const nextKey = arr[i]
      if (i === l - 1) {
        next[nextKey] = `require('./${key}')`
      }
      else {
        const n = next[nextKey]
        next = n || (next[nextKey] = {})
      }
    }
  }
  const content = `module.exports = ${
    JSON.stringify(dir, null, 2).replace(/"(require\([^)]+\))"/g, function ($0, $1) {
      return $1
    })
  }\n`
  fs.outputFileSync(file, content)
}

if (debug || isTest) {
  // remove uglify plugin.
  webConfig.plugins.pop()
}

if (debug) {
  webConfig.plugins.push(new (require('webpack-bundle-analyzer').BundleAnalyzerPlugin)())
  webConfig = merge(webConfig, {
    module: {
      rules: [{
        test: /\.vue$/,
        loader: resolve('./test-loader')
      }]
    }
  })
}

if (isTest) {
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
  // generate test/bundles.js5t
  generateTestMeta(webConfig.entry, resolve('test/bundles/index.js'))
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
