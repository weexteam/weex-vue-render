exports.getEntryFileContent = function getEntryFileContent (
  vueFilePath,
  isNative
) {
  // const relativePath = path.relative(path.join(entryPath, '../'), vueFilePath);
  const webTemplate = `
  const Vue = require('vue').default
  const weex = require('weex-vue-render')
  // import Vue from 'Vue'
  // import 'weex-vue-render'
  // import App from '${vueFilePath}'
  weex.init(Vue)
  const App = require('${vueFilePath}')
  App.el = '#root'
  new Vue(App)
`
  const nativeTemplate = `
  import App from '${vueFilePath}'
  App.el = '#root'
  new Vue(App)
`
  return isNative ? nativeTemplate : webTemplate
}