/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
"use strict"

const fs = require('fs-extra')
const path = require('path')
const gzip = require('zlib').createGzip()
const webpack = require('webpack')
// const scan = require('weex-vue-bundle-util')
const exec = require('child_process').execSync
const pkg = require('../package.json')
const chalk = require('chalk')

const rollup = require('rollup')
const watch = require('rollup-watch')
const json = require('rollup-plugin-json')
const eslint = require('rollup-plugin-eslint')
const replace = require('rollup-plugin-replace')
const postcss = require('rollup-plugin-postcss')
const nodeResolve = require('rollup-plugin-node-resolve')
const uglify = require('rollup-plugin-uglify')
const commonjs = require('rollup-plugin-commonjs')
const buble = require('rollup-plugin-buble')

const utils = require('./utils')
const { resolve, extend } = utils

const version = pkg.version

function zip (filePath, callback) {
  const read = fs.createReadStream(filePath)
  const write = fs.createWriteStream(filePath + '.gz')
  read.pipe(gzip).pipe(write).on('close', () => {
    report(filePath + '.gz')
    callback && callback()
  })
}

function now () {
  const time = Date.now() - (new Date()).getTimezoneOffset() * 60000
  return (new Date(time)).toISOString().replace('T', ' ').substring(0, 16)
}

function report (filePath) {
  const size = (fs.statSync(filePath).size / 1024).toFixed(2) + 'KB'
  const file = path.relative(process.cwd(), filePath)
  console.log(` => write ${chalk.yellow(file)} (${chalk.green(size)})`)
}

const configs = {
  'weex-vue-render': {
    input: resolve('packages/weex-vue-render/src/index.js'),
    output: {
      name: 'WeexVueRender',
      file: resolve('packages/weex-vue-render/dist/index.js'),
      format: 'umd',
      banner:`\nconsole.log('START WEEX VUE RENDER: ${version}, Build ${now()}.');\n\n`
    },
    plugins: [
      postcss({
        plugins: [
          require('autoprefixer')({
            browsers: ['> 0.1%', 'ios >= 8', 'not ie < 12']
          })
        ]
      }),
      nodeResolve({
        jsnext: true,
        main: true,
        browser: true
      }),
      replace({
        'process.env.WEEX_VERSION': version
      })
    ]
  },
  'weex-vue-render-core': {
    input: resolve('packages/weex-vue-render/src/index.core.js'),
    output: {
      name: 'WeexVueRenderCore',
      file: resolve('packages/weex-vue-render/dist/index.core.js'),
      format: 'umd',
      banner:`\nconsole.log('START WEEX VUE RENDER CORE: ${version}, Build ${now()}.');\n\n`
    },
    plugins: [
      postcss(),
      nodeResolve({
        jsnext: true,
        main: true,
        browser: true
      }),
      replace({
        'process.env.WEEX_VERSION': version
      })
    ]
  }
  // 'weex-vue-render-plugins': {
  //   format: 'umd',
  //   plugins: [
  //     postcss(),
  //     nodeResolve({
  //       jsnext: true,
  //       main: true,
  //       browser: true
  //     })
  //   ]
  // }
}

const getConfig = function (name, minify, params) {
  const opt = configs[name]
  let isProd
  if (params) {
    isProd = params._isProd
    delete params._isProd
    for (const k in params) {
      opt[k] = params[k]
    }
  }
  const config = {
    input: opt.input,
    output: extend({}, opt.output),
    banner: opt.banner,
    plugins: opt.plugins.concat([
      json(),
      replace({
        'process.env.VIEWPORT_WIDTH': 750,
        'process.env.NODE_ENV': JSON.stringify(isProd ? 'production' : minify ? 'production' : 'development'),
        'process.env.VUE_ENV': JSON.stringify('WEEX'),
        'process.env.NODE_DEBUG': false
      }),
      commonjs(),
      buble()
    ])
  }

  const outputFile = config.output.file
  config.output.file = minify ? outputFile && outputFile.replace(/\.js$/, '.min.js') : outputFile

  if (minify) {
    config.output.sourcemap = false
    config.plugins.push(uglify())
  }
  else {
    // console.log(config)
    config.output.sourcemap = 'inline'
    config.plugins.unshift(eslint({ exclude: ['**/*.json', '**/*.css'] }))
  }

  return config
}
exports.getConfig = getConfig

let isWatch = false
if (process.argv[3]) {
  isWatch = process.argv[3] === '--watch' || process.argv[3] === '-w'
}

// build specific package
if (process.argv[2]) {
  build(process.argv[2])
}
else {
  console.log('\nPlease specify the package you want to build. [native, runtime, browser, vue]')
}

function copyReadme (pkgName) {
  if (pkgName === 'weex-vue-render') {
    const fromMd = fs.readFileSync(resolve('README.md'))
    const toMdPath = resolve('packages/weex-vue-render/README.md')
    fs.outputFileSync(toMdPath, fromMd)
  }
}

function copyVersion (pkgName) {
  if (pkgName === 'weex-vue-render') {
    const fromPkg = fs.readJsonSync(resolve('package.json'))
    const toPkgPath = resolve('packages/weex-vue-render/package.json')
    const toPkg = fs.readJsonSync(toPkgPath)
    toPkg.version = fromPkg.version
    fs.outputJsonSync(toPkgPath, toPkg, {
      spaces: 2
    })
  }
}

function runRollupOnWatch(config) {
  const watcher = watch(rollup, config)
  watcher.on('event', event => {
    switch ( event.code ) {
      case 'STARTING':
        console.log('checking rollup-watch version...')
        break

      case 'BUILD_START':
        console.log('bundling...')
        break

      case 'BUILD_END':
        console.log('bundled in ' + path.relative(process.cwd(), config.output.file)
          + ' (' + event.duration + 'ms)')
        console.log('Watching for changes...' )
        break

      case 'ERROR':
        console.error('ERROR: ', event.error)
        break

      default:
        console.error('unknown event', event)
    }
  })
}

function runRollup (config) {
  return new Promise((resolve, reject) => {
    rollup.rollup(config).then(bundle => {
      bundle.write(config.output).then(() => {
        report(config.output.file)
        resolve()
      })
    })
  })
}

function build (name) {
  let pkgName
  switch (name) {
    case 'vue': pkgName = 'weex-vue-render'; break;
    case 'core': pkgName = 'weex-vue-render-core'; break;
    case 'plugins': pkgName = 'weex-vue-render-plugins'; break;
    default:
      return;
  }

  const config = getConfig(pkgName)
  const minifyConfig = getConfig(pkgName, true)

  if (isWatch) {
    return runRollupOnWatch(config)
  }
  else {
    console.log(`\n => start to build ${name} (${chalk.green(pkgName)}) Ver ${chalk.green(version)}\n`)
    return new Promise((resolve, reject) => {
      return runRollup(config).then(() => {
        const outputFile = config.output.file
        const basename = path.basename(outputFile).replace('index', 'render')
        fs.copy(config.output.file, utils.resolve(`public/assets/${basename}`))
        // cpy version info to packages/weex-vue-render
        copyVersion(pkgName)
        copyReadme(pkgName)
        const cjsConfig = getConfig(pkgName, false, {
          format: 'cjs',
          _isProd: true
        })
        cjsConfig.output.file = outputFile.replace(/\.js$/, '.common.js')
        const p = runRollup(cjsConfig)
        return p.then(function () {
          return runRollup(minifyConfig).then(() => {
            zip(minifyConfig.output.file, resolve)
          })
        })
      })
    })
  }
}
