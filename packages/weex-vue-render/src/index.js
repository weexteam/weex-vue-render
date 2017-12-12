import weex from '../../../src'

import components from '../../../src/components'
import modules from '../../../src/modules'

const preInit = weex.init

weex.init = function () {
  preInit.apply(weex, arguments)
  const plugins = components.concat(modules)

  plugins.forEach(function (plugin) {
    weex.install(plugin)
  })
}

if (global.Vue) {
  weex.init(global.Vue)
}

export default weex
