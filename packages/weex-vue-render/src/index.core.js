import weex from '../../../src'
import scrollable from '../../../src/components/scrollable'
import meta from '../../../src/modules/meta'

const preInit = weex.init

weex.init = function () {
  preInit.apply(weex, arguments)
  weex.install(scrollable)
  weex.install(meta)
}

if (global.Vue) {
  weex.init(global.Vue)
}

export default weex
