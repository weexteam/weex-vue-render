/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import {
  transformRender
} from '../core/node'
import { isDef } from '../utils'

let _inited = false

export default {
  init (weex) {
    if (_inited) {
      return
    }
    _inited = true
    const Vue = weex.__vue__
    const _render = Vue.prototype._render
    Vue.prototype._render = function () {
      let weexRender = this._weexRender
      const tag = this.$options && this.$options._componentTag
      if (
        !weexRender
        && !isDef(weex._components[tag])
      ) {
        const origRender = this.$options.render
        weexRender = this._weexRender = function (h, ...args) {
          return origRender.call(this, transformRender(this, h), ...args)
        }
        this.$options.render = weexRender
      }
      return _render.call(this)
    }
  }
}
