const path = require('path')
const fs = require('fs-extra')
const express = require('express')
const webpack = require('webpack')
const merge = require('webpack-merge')
const opn = require('opn')
const ip = require('ip').address()
const webpackConfigs = require('./webpack.dev.config')
const resolve = require('./utils').resolve
const config = require('../config')
const { getWebEntries, getNativeEntries } = require('./get-entries')
const port = config.dev.port

const webWebpackConfig = webpackConfigs[0]
const nativeWebpackConfig = webpackConfigs[1]

// copy vue.runtime.js to public/assets
const vueRuntimeFile = require.resolve('vue/dist/vue.runtime.js')
fs.copy(
	vueRuntimeFile,
	resolve(path.join('public/assets', path.basename(vueRuntimeFile)))
)

const app = express()

const webEntries = getWebEntries()
Object.keys(webEntries).forEach(function (name) {
  webEntries[name] = [config.dev.clientPath].concat(webEntries[name])
})
const webCompiler = webpack(merge(webWebpackConfig, {
	entry: webEntries
}))

const nativeCompiler = webpack(merge(nativeWebpackConfig, {
	entry: getNativeEntries(),
	watch: true,
	watchOptions: {
		ignored: /node_modules/
	}
}))

const autoOpen = true

const devMiddleware = require('webpack-dev-middleware')(webCompiler, {
  // publicPath is required, whereas all other options are optional
	noInfo: true,
  publicPath: webWebpackConfig.output.publicPath,
	stats: {
		colors: true
	}
})

const hotMiddleware = require('webpack-hot-middleware')(webCompiler, {
	path: '/__weex_hmr'
})

app.use(devMiddleware)
app.use(hotMiddleware)

app.use(express.static('public'))

const uri = 'http://' + ip + ':' + port + '/'

console.log('> Starting dev server...')
devMiddleware.waitUntilValid(() => {
	console.log('> Listening to ' + uri + '\n')
	nativeCompiler.watch(null, function (err, stats) {
		if (err) {
			console.error('[dev-server] error:', err)
		}
		if (stats.hasErrors()) {
			var info = stats.toJson()
			console.error('[dev-server] error:', stats.errors)
		}
	})

  if (autoOpen) {
    opn(uri)
  }
})

const server = app.listen(port)
