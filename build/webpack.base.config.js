const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const fs = require('fs-extra')
const vueLoaderConfig = require('./vue-loader.config.js')
const config = require('../config')
const { resolve } = require('../build/utils')
const del = require('del');

const examplesDirectory = resolve('examples')
const entriesDirectory = resolve('examples/bundle-entry')
const { getEntryFileContent } = require('./entry-template')

function walk(entry, dir, isNative) {
  dir = dir || '.'
  const directory = path.join(examplesDirectory, dir)
  const subEntryDir = isNative ? 'native' : 'web'
  const entryDirectory = path.join(entriesDirectory, subEntryDir, dir)

  fs.readdirSync(directory)
    .forEach(function(file) {
      const fullpath = path.join(directory, file)
      const stat = fs.statSync(fullpath)
      const extname = path.extname(fullpath)
      if (stat.isFile() && extname === '.vue') {
        const entryFile = path.join(entryDirectory, path.basename(file, extname) + '.js')
        fs.outputFileSync(entryFile, getEntryFileContent(fullpath, isNative))
        const name = path.join(subEntryDir, dir, path.basename(file, extname))
        entry[name] = entryFile + '?entry=true'
      } else if (stat.isDirectory() && file !== 'bundle-entry' && file !== 'include') {
        const subdir = path.join(dir, file)
        walk(entry, subdir, isNative)
      }
    })
}

function getEntries (isNative) {
  const entry = {}
  walk(entry, null, isNative)
  return entry
}

function getWebEntries () {
  del.sync(resolve('examples/bundle-entry/web/**'))
  const entries = getEntries(false)
  // for test.
  // const entryDir = 'web'
  // const entryName = 'hello'
  // const entryPath = path.join(entryDir, entryName)
  // fs.outputFileSync(
  //   resolve(path.join('examples/bundle-entry', entryPath + '.js')),
  //   getEntryFileContent(
  //     resolve(path.join('examples', entryName + '.vue')),
  //     false
  //   )
  // )
  // const entries = {}
  // entries[`${entryDir}/${entryName}`]
  //   = resolve('examples/bundle-entry/web/hello.js')
  return entries
}

function getNativeEntries () {
  del.sync(resolve('examples/bundle-entry/native/**'))
  return getEntries(true)
}

var baseConfig = {
  output: {
    path: config.build.publicDistRoot,
    // path: resolve('public/dist'),
    publicPath: config.build.publicPath,
    // publicPath: '/dist/'
  },
  resolve: {
    alias: {
      'weex-vue-render': resolve('packages/weex-vue-render/dist/index.common')
    }
  },
  module: {
    rules: [{
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: /node_modules/
    }]
  },
  plugins: []
}
var webConfig = merge(baseConfig, {
  entry: getWebEntries(),
  module: {
    rules: [{
      test: /\.vue$/,
      loader: 'vue-loader',
      options: vueLoaderConfig
    }],
  },
  output: {
    filename: '[name].js'
  },
  plugins: [
    new webpack.BannerPlugin({
      banner: '// NOTE: for vue2.0 and platform:web only.\n',
      raw: true,
      exclude: 'Vue'
    })
  ]
})

var nativeConfig = merge(baseConfig, {
  entry: getNativeEntries(),
  module: {
    rules: [{
      test: /\.vue$/,
      loader: 'weex-loader'
    }],
  },
  output: {
    filename: '[name].js'
  },
  plugins: [
    new webpack.BannerPlugin({
      banner: '// { "framework": "Vue" } \n',
      raw: true,
      exclude: 'Vue'
    })
  ]
})

module.exports = [webConfig, nativeConfig]
