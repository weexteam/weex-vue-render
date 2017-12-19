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
  getThrottleLazyload,
  watchAppear,
  debounce
} from '../utils'

import config from '../config'
const scrollableTypes = config.scrollableTypes

let lazyloadWatched = false
function watchLazyload () {
  lazyloadWatched = true
  ; [
    'scroll',
    // 'transitionend',
    // 'webkitTransitionEnd',
    // 'animationend',
    // 'webkitAnimationEnd',
    'resize'
  ].forEach(evt => {
    window.addEventListener(evt, getThrottleLazyload(25, document.body))
  })
  /**
   * In case the users use the body's overflow to scroll. Then the scroll
   * event would not be triggered on the window object but on the body.
   */
  document.body.addEventListener('scroll', getThrottleLazyload(25, document.body))
}

let idCnt = 0
let appearWatched = false

/**
 * during updating, the appear watcher binding on the appearWatched context
 * should be triggered within a debounced wrapper.
 * If the updating interval is shorter then 50 ms, then the appear events will
 * ignore the change in the previous 50 ms due to the debounce wrapper.
 */
const debouncedWatchAppear = debounce(function () {
  watchAppear(appearWatched, true)
}, 50)

/**
 * if it's a scrollable tag, then watch appear events for it.
 */
function watchAppearForScrollables (tagName, context) {
  // when this is a scroller/list/waterfall
  if (scrollableTypes.indexOf(tagName) > -1) {
    const sd = context.scrollDirection
    if (!sd || sd !== 'horizontal') {
      appearWatched = context
      watchAppear(context, true)
    }
  }
}

export default {
  beforeCreate () {
    if (!lazyloadWatched) {
      watchLazyload()
    }
  },

  updated () {
    const el = this.$el
    if (!el || el.nodeType !== 1) {
      return
    }
    if (this._rootId) {
      if (el.className.indexOf('weex-root') <= -1) {
        el.classList.add('weex-root')
        el.classList.add('weex-ct')
        el.setAttribute('data-wx-root-id', this._rootId)
      }
    }

    const tagName = this.$options && this.$options._componentTag
    const metaUp = weex._meta.updated
    if (!metaUp[tagName]) {
      metaUp[tagName] = 0
    }
    metaUp[tagName]++
    // will check appearing when no other changes in latest 50ms.
    debouncedWatchAppear()
    /**
     * since the updating of component may affect the layout, the lazyloading should
     * be fired.
     */
    this._fireLazyload()
  },

  mounted () {
    const tagName = this.$options && this.$options._componentTag
    const el = this.$el
    if (!el || el.nodeType !== 1) {
      return
    }
    if (typeof weex._components[tagName] !== 'undefined') {
      weex._components[tagName]++
    }
    const metaMt = weex._meta.mounted
    if (!metaMt[tagName]) {
      metaMt[tagName] = 0
    }
    metaMt[tagName]++

    watchAppearForScrollables(tagName, this)

    // when this is the root element of Vue instance.
    if (this === this.$root) {
      const rootId = `wx-root-${idCnt++}`
      if (!weex._root) {
        weex._root = {}
      }
      weex._root[rootId] = this
      this._rootId = rootId
      if (el.nodeType !== 1) {
        return
      }
      el.classList.add('weex-root')
      el.classList.add('weex-ct')
      el.setAttribute('data-wx-root-id', rootId)

      /**
       * there's no scrollable component in this page. That is to say,
       * the page is using body scrolling instead of scrollabe components.
       * Then the appear watcher should be attached on the body.
       */
      if (!appearWatched) {
        appearWatched = this
        watchAppear(this, true)
      }

      this._fireLazyload(el)
    }

    // give warning for not using $processStyle in vue-loader config.
    // if (!warned && !window._style_processing_added) {
    //   warnProcessStyle()
    // }
  },

  destroyed () {
    const el = this.$el
    if (!el || el.nodeType !== 1) {
      return
    }
    /**
     * if the destroyed element is above another panel with images inside, and the images
     * moved into the viewport, then the lazyloading should be triggered.
     */
    if (this._rootId) {
      delete weex._root[this._rootId]
      delete this._rootId
    }
    const tagName = this.$options && this.$options._componentTag
    if (typeof weex._components[tagName] !== 'undefined') {
      weex._components[tagName]--
    }
    const metaDs = weex._meta.destroyed
    if (!metaDs[tagName]) {
      metaDs[tagName] = 0
    }
    metaDs[tagName]++
    this._fireLazyload()
  },

  methods: {
    _fireLazyload (el) {
      getThrottleLazyload(25, el || document.body)()
    }
  }
}
