exports.getEntryFileContent = function getEntryFileContent (
  vueFilePath,
  isNative
) {
  const webTemplate = `
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
