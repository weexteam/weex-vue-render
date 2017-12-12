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
// import { validateStyles } from '../validator'

const _css = `
.weex-a {
  text-decoration: none;
}
`

function preventInvoker (evt) {
  const target = evt.target
  const aEl = evt.currentTarget
  // if this 'a' contains the click target element.
  const isContain = aEl.contains
    ? aEl.contains(target) && (aEl !== target)
    : aEl.compareDocumentPosition(target) & 16 !== 0
  if (isContain) {
    evt.preventDefault()
  }
}

function getA (weex) {
  const {
    extractComponentStyle,
    trimTextVNodes
  } = weex

  return {
    name: 'weex-a',
    props: {
      href: String
    },
    mounted () {
      // if some component inside this 'a' has bound a 'click' event. THEN the
      // default behavior of a for redirecting should be prevented.
      const el = this.$el
      if (el && el.querySelectorAll) {
        const clickTargets = el.querySelectorAll('[data-evt-click]')
        if (clickTargets && clickTargets.length) {
          // should prevent default redirecting.
          el.addEventListener('click', preventInvoker)
        }
      }
    },
    render (createElement) {
      /* istanbul ignore next */
      // if (process.env.NODE_ENV === 'development') {
      //   validateStyles('a', this.$vnode.data && this.$vnode.data.staticStyle)
      // }
      return createElement('html:a', {
        attrs: {
          'weex-type': 'a',
          href: this.href
        },
        staticClass: 'weex-a weex-ct',
        staticStyle: extractComponentStyle(this)
      }, trimTextVNodes(this.$slots.default))
    },
    _css
  }
}

export default {
  init (weex) {
    weex.registerComponent('a', getA(weex))
  }
}
