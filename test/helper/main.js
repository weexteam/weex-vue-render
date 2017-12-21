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
    let root
    const Vue = weex.__vue__
    if (id) {
      root = document.createElement('div')
      root = root
      document.body.appendChild(root)
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
      const root = roots[id]
      root.parentElement.removeChild(root)
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
    delete this.roots[id]
    root.parentElement.removeChild(root)
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
  },

  _spy: {},

  getSpy (spyName) {
    return this._spy[spyName]
  },

  genSpys (spys) {
    if (!window._spy) {
      window._spy = {}
    }
    spys.forEach(name => {
      this._spy[name] = sinon.spy()
      window._spy[name] = (...args) => {
        const spy = this._spy[name]
        spy && spy(...args)
      }
    })
  },

  removeSpys (spys) {
    spys.forEach(name => {
      delete this._spy[name]
      delete window._spy[name]
    })
  }
}

export default helper
