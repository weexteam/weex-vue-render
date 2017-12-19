const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const vueLoaderConfig = require('./vue-loader.config.js')
const config = require('../config')
const { resolve } = require('./utils')
const { getWebEntries, getNativeEntries } = require('./get-entries')

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
