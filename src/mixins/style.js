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

import { getTransformer } from 'wxv-transformer'
import { isArray, isPlainObject } from '../utils'
import config from '../config'
const { bindingStyleNamesForPx2Rem } = config

export default {
  methods: {
    _px2rem (value, rootValue) {
      if (typeof value === 'string') {
        return (value + '').replace(/[+-]?\d+(?:.\d*)?[pw]x/gi, function ($0) {
          return weex.utils.px2rem($0, rootValue)
        })
      }
      if (typeof value === 'number') {
        return weex.utils.px2rem(value + '', rootValue)
      }
      if (isPlainObject(value)) {
        for (const k in value) {
          if (
            value.hasOwnProperty(k)
            && bindingStyleNamesForPx2Rem.indexOf(k) > -1
          ) {
            value[k] = weex.utils.px2rem(value[k] + '', rootValue)
          }
        }
        return value
      }
      if (isArray(value)) {
        for (let i = 0, l = value.length; i < l; i++) {
          this._px2rem(value[i], rootValue)
        }
        return value
      }
    },

    _processExclusiveStyle (styleObj, rootValue, tagName) {
      const transformer = getTransformer(tagName)
      return this._px2rem(
        transformer.transform(styleObj),
        rootValue
      )
    },

    _getParentRect () {
      const el = this.$el
      const parent = el && el.parentElement
      return parent && parent.getBoundingClientRect()
    }
  }
}
