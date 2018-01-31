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
import './style.css'

function getWeb (weex) {
  const { extractComponentStyle } = weex
  const { dispatchNativeEvent } = weex.utils

  return {
    data () {
      return {
        currentSrc: ''
      }
    },
    name: 'weex-web',
    props: {
      src: String
    },
    watch: {
      src (newVal) {
        this.currentSrc = newVal
      }
    },
    methods: {
      goBack () {
        const el = this.$el
        if (el) {
          const win = el.contentWindow
          try {
            win.history.back()
            this.currentSrc = win.location.href
          }
          catch (err) {
            dispatchNativeEvent(el, 'error', err)
          }
        }
      },
      goForward () {
        const el = this.$el
        if (el) {
          const win = el.contentWindow
          try {
            win.history.forward()
            this.currentSrc = win.location.href
          }
          catch (err) {
            dispatchNativeEvent(el, 'error', err)
          }
        }
      },
      reload () {
        const el = this.$el
        if (el) {
          try {
            el.contentWindow.location.reload()
            dispatchNativeEvent(el, 'pagestart', { url: this.currentSrc })
          }
          catch (err) {
            dispatchNativeEvent(el, 'error', err)
          }
        }
      }
    },

    created () {
      this.currentSrc = this.src
    },

    mounted () {
      const el = this.$el
      this._prevSrc = this.currentSrc
      if (el) {
        dispatchNativeEvent(el, 'pagestart', { url: this.currentSrc })
      }
    },

    updated () {
      if (this.currentSrc !== this._prevSrc) {
        this._prevSrc = this.currentSrc
        dispatchNativeEvent(this.$el, 'pagestart', { url: this.currentSrc })
      }
    },

    render (createElement) {
      return createElement('iframe', {
        attrs: {
          'weex-type': 'web',
          src: this.currentSrc
        },
        on: {
          load: event => {
            this.$nextTick(function () {
              const el = this.$el
              try {
                const html = el.contentWindow.document.documentElement
                if (html) {
                  dispatchNativeEvent(el, 'pagefinish', { url: this.currentSrc })
                }
                else {
                  dispatchNativeEvent(el, 'error', new Error('[vue-render]:found no page content.'))
                }
              }
              catch (err) {
                dispatchNativeEvent(el, 'error', err)
              }
            })
          }
        },
        staticClass: 'weex-web weex-el',
        staticStyle: extractComponentStyle(this)
      })
    }
  }
}

export default {
  init (weex) {
    weex.registerComponent('web', getWeb(weex))
  }
}
