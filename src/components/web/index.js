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
    name: 'weex-web',
    props: {
      src: String
    },
    methods: {
      // TODO: check cross-origin
      goBack () {
        if (this.$el) {
          this.$el.contentWindow.history.back()
        }
      },
      goForward () {
        if (this.$el) {
          this.$el.contentWindow.history.forward()
        }
      },
      reload () {
        if (this.$el) {
          this.$el.contentWindow.history.reload()
        }
      }
    },

    mounted () {
      const el = this.$el
      this._prevSrc = this.src
      if (el) {
        dispatchNativeEvent(el, 'pagestart', { url: this.src })
      }
    },

    updated () {
      if (this.src !== this._prevSrc) {
        this._prevSrc = this.src
        dispatchNativeEvent(this.$el, 'pagestart', { url: this.src })
      }
    },

    render (createElement) {
      return createElement('iframe', {
        attrs: {
          'weex-type': 'web',
          src: this.src
        },
        on: {
          load: event => {
            dispatchNativeEvent(event.target, 'pagefinish', { url: this.src })
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
