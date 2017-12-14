const precompile = require('weex-vue-precompiler')()

module.exports = {
  optimizeSSR: false,
  postcss: [
    require('postcss-plugin-weex')(),
    require('autoprefixer')({
      browsers: ['> 0.1%', 'ios >= 8', 'not ie < 12']
    }),
    require('postcss-plugin-px2rem')({ rootValue: 75, minPixelValue: 1.01 })
  ],
  compilerModules: [
    {
      postTransformNode: el => {
        precompile(el)
      }
    }
  ]
}
