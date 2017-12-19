import weex from '../../src/env/weex'
import * as utils from './utils'
import bundles from '../bundles'

const helper = {
  roots: {},
  _done: {},
  _vms: {},
  bundles,
  utils,
  /**
   * register a component.
   * @param  {string} name,
   * @param  {object} component.
   */
  register (name, component) {
    weex.install(component)
  },

  /**
   * create a vm instance of Vue.
   * @param  {Object} options.
   * @return {Vue} vue instance.
   */
  createVm (options = {}, id) {
    let ct, root
    const Vue = weex.__vue__
    if (id) {
      ct = document.createElement('div')
      ct.id = `${id}-root`
      ct.style.cssText = 'width:100%;height:300px;overflow:scroll;'
      root = document.createElement('div')
      root.id = id
      ct.appendChild(root)
      document.body.appendChild(ct)
    }
    const pre = this._vms[id]
    if (pre) {
      helper.clear(id)
    }
    const vm = new Vue(options).$mount(root)
    this._vms[id] = vm
    this.roots[id] = vm.$el
    return vm
  },

  clearAll () {
    const roots = this.roots
    Object.keys(roots).forEach((id) => {
      const ct = roots[id].parentNode
      document.body.removeChild(ct)
    })
    this.roots = {}
  },

  clear (id) {
    if (!id) {
      return this.clearAll()
    }
    const roots = this.roots
    const root = roots[id]
    if (!root) { return }
    const el = roots[id]
    el.parentElement.removeChild(el)
  },

  registerDone (id, cb) {
    this._done[id] = cb
  },

  unregisterDone (id) {
    if (!id) { return }
    delete this._done[id]
  },

  done (id, ...args) {
    const done = this._done[id]
    done && done(...args)
  },

  /**
   * [compile description]
   * @param  {[type]} template [description]
   * @return {[type]}          [description]
   */
  compile (template) {
    return helper.createVm({ template })
  }
}

export default helper
