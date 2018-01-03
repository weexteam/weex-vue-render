import weex from '../../../src'
import scrollable from '../../../src/components/scrollable'
import directives from '../../../src/directives'
import meta from '../../../src/modules/meta'

const preInit = weex.init

weex.init = function () {
  preInit.apply(weex, arguments)
  weex.install(scrollable)
  weex.install(meta)
  for (const k in directives) {
    weex.install(directives[k])
  }
}

if (global.Vue) {
  weex.init(global.Vue)
}

export default weex
