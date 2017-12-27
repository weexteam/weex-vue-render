import weex from '../../src/env/weex'
import * as utils from './utils'
import bundles from '../bundles'

function getIdPrefix (id) {
  return id.split('.').join('_') + '_'
}

const helper = {
  data: {}, // vm, spy, done, root
  bundles,
  utils,
  /**
   * install a weex plugin.
   * @param  {object} plguin.
   */
  install (plugin) {
    weex.install(plugin)
  },

  /**
   * create a vm instance of Vue. and generate spys for the istance.
   * @param {String} id Also the bundle path. e.g. 'components.div'
   *    means the test bundle is avaiable in path
   *    'helper.bundles.components.div'.
   * @param {Object} options
   *  - spys: a array of spy function names.
   * @return {Vue} vue instance.
   */
  createVm (id, options = {}) {
    if (!id) {
      return
    }
    const data = this.data[id]
    if (data) {
      helper.clear(id)
    }
    const ct = document.createElement('div')
    document.body.appendChild(ct)
    const Vue = weex.__vue__
    const bundle = id.split('.').reduce((pre, key) => {
      if (!pre) {
        throw new Error(`Test bundle is missing: ${id}`)
      }
      return pre[key]
    }, this.bundles)
    const vm = new Vue(bundle).$mount(ct)
    const root = vm.$el
    root.id = id
    root.style.height = '100%'

    this.data[id] = {
      vm,
      root,
      spy: {},
      done: {},
    }

    const { spys } = options
    // gen spys
    if (spys) {
      this.genSpys(id, spys)
    }
    return vm
  },

  clearAll () {
    const data = this.data
    for (var id in data) {
      this.clear(id)
    }
  },

  clear (id) {
    if (!id) {
      return this.clearAll()
    }
    const data = this.data[id]
    const { vm, root } = data
    vm && vm.$destroy()
    root.parentElement.removeChild(root)
    delete this.data[id]
  },

  registerDone (id, subId, cb) {
    if (typeof subId === 'function') {
      subId = 'default'
      cb = subId
    }
    const data = this.data[id]
    if (!data.done) {
      data.done = {}
    }
    data.done[subId] = () => {
      cb(done => {
        done()
        delete data.done[subId]
      })
    }
  },

  genSpys (id, spys) {
    const data = this.data[id]
    spys.forEach(name => {
      data.spy[name] = sinon.spy()
    })
  },

  callSpy (id, spyName, ...args) {
    return this.data[id].spy[spyName](...args)
  },

  getSpys (id) {
    return this.data[id].spy
  },

  getSpy (id, spyName) {
    return this.data[id].spy[spyName]
  },

  // mock mobile click events:
  // weex$tap first, and click in 200 ms later.
  click (el, cb) {
    const tap = new Event('weex$tap', { bubbles: true, cancellable: true })
    el.dispatchEvent(tap)
    setTimeout(function () {
      el.click()
      setTimeout(function () {
        cb && cb()
      }, 25)
    }, 200)
  }
}

export default helper
