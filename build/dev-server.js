var path = require('path')
var fs = require('fs-extra')
var express = require('express')
var webpack = require('webpack')
var merge = require('webpack-merge')
var opn = require('opn')
var ip = require('ip').address()
var webpackConfigs = require('./webpack.dev.config')
var resolve = require('./utils').resolve
var config = require('../config')
var port = config.dev.port

var webWebpackConfig = webpackConfigs[0]
var nativeWebpackConfig = webpackConfigs[1]

// copy vue.runtime.js to public/assets
const vueRuntimeFile = require.resolve('vue/dist/vue.runtime.js')
fs.copy(
	vueRuntimeFile,
	resolve(path.join('public/assets', path.basename(vueRuntimeFile)))
)

var app = express()
var compiler = webpack(webWebpackConfig)

webpack(merge(nativeWebpackConfig, {
	watch: true,
	watchOptions: {
		ignored: /node_modules/
	}
}), function (err, stats) {
	if (err) {
		console.error('[dev-server] error:', err)
	}
	if (stats.hasErrors()) {
		var info = stats.toJson()
		console.error('[dev-server] error:', stats.errors)
	}
})

var autoOpen = true

var devMiddleware = require('webpack-dev-middleware')(compiler, {
  // publicPath is required, whereas all other options are optional
	noInfo: true,
  publicPath: webWebpackConfig.output.publicPath,
	stats: {
		colors: true
	}
})

var hotMiddleware = require('webpack-hot-middleware')(compiler, {
	path: '/__weex_hmr'
})

app.use(devMiddleware)
app.use(hotMiddleware)

app.use(express.static('public'))

var uri = 'http://' + ip + ':' + port + '/'

console.log('> Starting dev server...')
devMiddleware.waitUntilValid(() => {
  console.log('> Listening to ' + uri + '\n')
  if (autoOpen) {
    opn(uri)
  }
})

var server = app.listen(port)
