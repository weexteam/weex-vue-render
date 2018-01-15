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

// input and textare has some common api and event
import { extend, dispatchNativeEvent } from '../utils'

const findEnterKeyType = function (key) {
  const keys = ['default', 'go', 'next', 'search', 'send']
  if (keys.indexOf(key) > -1) {
    return key
  }
  return 'done'
}

export default {
  methods: {
    focus () {
      this.$el && this.$el.focus()
    },
    blur () {
      this.$el && this.$el.blur()
    },

    setSelectionRange (start, end) {
      try {
        this.$el.setSelectionRange(start, end)
      }
      catch (e) {
        if (process.env.NODE_ENV === 'development') {
          console.warn(`[vue-render] setSelectionRange is not supported.`)
        }
      }
    },

    getSelectionRange (callback) {
      try {
        const selection = window.getSelection()
        const str = selection.toString()
        const selectionStart = this.$el.value.indexOf(str)
        const selectionEnd = selectionStart === -1 ? selectionStart : selectionStart + str.length
        callback && callback({
          selectionStart,
          selectionEnd
        })
      }
      catch (e) {
        callback && callback(new Error('[vue-render] getSelection is not supported.'))
      }
    },

    getEditSelectionRange (callback) {
      this.getSelectionRange(callback)
    },

    // support enter key event
    createKeyboardEvent (events) {
      const customKeyType = this.returnKeyType
      if (customKeyType) {
        const keyboardEvents = {
          'keyup': function (ev) {
            const code = ev.keyCode
            let key = ev.key
            if (code === 13) {
              if (!key || key.toLowerCase() === 'tab') {
                key = 'next'
              }
              dispatchNativeEvent(ev.target, 'return', {
                key,
                returnKeyType: findEnterKeyType(customKeyType),
                value: ev.target.value
              })
            }
          }
        }
        events = extend(events, keyboardEvents)
      }
      return events
    }
  }
}
