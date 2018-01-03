import weex from '../../../src'

import components from '../../../src/components'
import modules from '../../../src/modules'
import directives from '../../../src/directives'

const preInit = weex.init

weex.init = function () {
  preInit.apply(weex, arguments)
  const plugins = components.concat(modules)

  plugins.forEach(function (plugin) {
    weex.install(plugin)
  })

  for (const k in directives) {
    weex.install(directives[k])
  }
}

if (global.Vue) {
  weex.init(global.Vue)
}

export default weex
