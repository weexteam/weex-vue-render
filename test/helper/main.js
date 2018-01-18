import weex from '../../src/weex/instance'
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

  initWithWeex (title, opts, fn) {
    if (typeof opts === 'function') {
      opts = null
      fn = opts
    }
    return describe(title, () => {
      before(() => {
        window.global = window
        window.weex = weex
        if (opts) {
          const { plugins } = opts
          if (plugins) {
            plugins.forEach(helper.install)
          }
        }
      })

      fn && fn(helper)
    })
  },

  /**
   * create a vm instance of Vue. and generate spys for the istance.
   * @param {String} id Also the bundle path. e.g. 'components.div'
   *    means the test bundle is avaiable in path
   *    'helper.bundles.components.div'.
   * @param {Object} options
   *  - spys: a array of spy function names.
   *  - plugins: a array of plugins.
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

    const { spys, plugins } = options
    // install plugins.
    if (plugins) {
      plugins.forEach(helper.install)
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
    try {
      return this.data[id].spy[spyName](...args)
    } catch (err) {
      console.log('!!!!!! error ===>', id, spyName, this.data, this.data[id])
    }
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
    console.log('click', el.tagName, el.className)
    const tap = new Event('weex$tap', { bubbles: true, cancellable: true })
    el.dispatchEvent(tap)
    setTimeout(function () {
      el.click && el.click()
      setTimeout(function () {
        cb && cb()
      }, 25)
    }, 200)
  }
}

export default helper
