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
const path = require('path')
const getConfig = require('./build').getConfig
const rollupConfig = require('./build').getConfig('weex-vue-render', true)
const resolve = require('./utils').resolve

const removeConfigs = ['input', 'output']
const removePlugins = ['eslint', 'uglify']

removeConfigs.forEach(cfg => {
  delete rollupConfig[cfg]
})

const plugins = rollupConfig.plugins.slice()
rollupConfig.plugins = []

for (let i = 0, l = plugins.length; i < l; i++) {
  const plg = plugins[i]
  let isRemove = false
  if (removePlugins.length <= 0) {
    rollupConfig.plugins.push(plg)
  }
  removePlugins.forEach(rp => {
    if (plg.name === rp) {
      isRemove = true
    }
  })
  if (!isRemove) { rollupConfig.plugins.push(plg) }
}

rollupConfig.format = 'iife'
rollupConfig.name = 'test'
rollupConfig.sourcemap = 'inline'
// rollupConfig.intro = `
// describe('ignore inject function from postcss', function () {
//   it('ignore', function () {
//       var shouldBe = 'test'
//       var expected = __$styleInject('.body{}',shouldBe)
//       expect(shouldBe).to.be.equal(expected)
//     })
//   })
// `

module.exports = function (config) {
  config.set({
    frameworks: ['mocha', 'sinon-chai'],
    browsers: ['PhantomJS'],
    files: [
      resolve('test/components/a.js'),
      resolve('test/components/cell.js'),
      resolve('test/components/custom-component.js'),
      resolve('test/components/div.js'),
      resolve('test/components/input.js'),
      resolve('test/components/image.js'),
      resolve('test/components/render-function.js'),
      resolve('test/components/switch.js'),
      resolve('test/components/text.js'),
      resolve('test/core/style.js'),
      '../test/utils/*.js',
      '../test/modules/*.js',
      '../test/misc/*.js'
      ///////////////////////////////////////////
      // '../test/core/*.js',
      // '../test/!(utils|core)/*.js'
      // '../test/components/switch.js',
    ],
    exclude: [
      '../test/core/node.js',
      '../test/helper/*.js',
      '../test/vender/**/*.js',
      '../test/data/**/*.js'
    ],

    reporters: ['mocha', 'coverage'],
    coverageReporter: {
      instrumenterOptions: {
        istanbul: {
          // noCompact: true
        }
      },
      reporters: [
        { type: 'html', dir: resolve('coverage'), subdir: 'weex-vue-render' },
        { type: 'text-summary', dir: resolve('coverage'), subdir: 'weex-vue-render' }
      ]
    },
    browserDisconnectTimeout: 10000,
    preprocessors: {
      '../test/**/*.js': ['rollup', 'coverage']
    },
    rollupPreprocessor: rollupConfig,

    plugins: [
      'karma-coverage',
      'karma-mocha',
      'karma-mocha-reporter',
      'karma-phantomjs-launcher',
      'karma-rollup-preprocessor',
      'karma-sinon-chai'
      // 'karma-sourcemap-loader',
      // 'karma-webpack'
    ],

    // singleRun: false,
    singleRun: true
  })
}
