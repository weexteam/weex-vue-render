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

import { isElementVisible } from './component'
import { dispatchNativeEvent } from './event'
import { throttle } from './func'

const lazyloadAttr = 'data-img-src'
const placeholderAttr = 'placeholder'

function preLoadImg (src,
  loadCallback,
  errorCallback) {
  const img = new Image()
  img.onload = loadCallback ? loadCallback.bind(img) : null
  img.onerror = errorCallback ? errorCallback.bind(img) : null
  img.src = src
}

export function applySrc (item, src, placeholderSrc) {
  if (!src) { return }
  function finallCb () {
    delete item._src_loading
  }

  if (window._processImgSrc) {
    src = window._processImgSrc(src, item)
    if (placeholderSrc) {
      placeholderSrc = window._processImgSrc(placeholderSrc, item)
    }
  }

  if (item._src_loading === src) {
    return
  }

  /**
   * 1. apply src immediately in case javscript blocks the image loading
   *  before next tick.
   */
  item.style.backgroundImage = `url(${src || ''})`
  item.removeAttribute(lazyloadAttr)
  /**
   * 2. then load the img src with Image constructor (but would not post
   *  a request again), just to trigger the load event.
   */
  item._src_loading = src
  preLoadImg(src, function (evt) {
    item.style.backgroundImage = `url(${src || ''})`
    const { width: naturalWidth, height: naturalHeight } = this
    const params = {
      success: true,
      size: { naturalWidth, naturalHeight }
    }
    dispatchNativeEvent(item, 'load', params)
    finallCb()
  }, function (evt) {
    const params = {
      success: false,
      size: { naturalWidth: 0, naturalHeight: 0 }
    }
    dispatchNativeEvent(item, 'load', params)
    if (placeholderSrc) {
      preLoadImg(placeholderSrc, function () {
        item.style.backgroundImage = `url(${placeholderSrc || ''})`
      })
    }
    finallCb()
  })
}

function getCtScroller (el) {
  if (!el) { return }
  let scroller = el._ptScroller
  if (!scroller) {
    let pt = el.parentElement
    while (pt && pt !== document.body) {
      if ((pt.className + '' || '').match(/weex-list|weex-scroller|weex-waterfall/)) {
        scroller = pt
        break
      }
      pt = pt.parentElement
    }
    scroller = pt
    el._ptScroller = pt
  }
  return scroller
}

export function fireLazyload (el, ignoreVisibility) {
  if (Array.isArray(el)) {
    return el.forEach(ct => fireLazyload(ct))
  }
  el = el || document.body
  if (!el) { return }
  let imgs = (el || document.body).querySelectorAll(`[${lazyloadAttr}]`)
  if (el.getAttribute(lazyloadAttr)) { imgs = [el] }
  for (let i = 0; i < imgs.length; i++) {
    const img = imgs[i]
    if (typeof ignoreVisibility === 'boolean' && ignoreVisibility) {
      applySrc(img, img.getAttribute(lazyloadAttr), img.getAttribute(placeholderAttr))
    }
    else if (isElementVisible(img, getCtScroller(el))[0]) {
      applySrc(img, img.getAttribute(lazyloadAttr), img.getAttribute(placeholderAttr))
    }
  }
}

/**
 * cache a throttle lazyload function for every container element
 * once for different wait times separate.
 *   the architecture of this cache:
 *      cache: {
 *        el.id: {
 *          wait: throttledFunction () { ... }
 *        }
 *      }
 */
const cache = {}
let _uid = 1
export function getThrottleLazyload (wait = 16, el = document.body) {
  let id = +(el && el.dataset.throttleId)
  if (isNaN(id) || id <= 0) {
    id = _uid++
    el && el.setAttribute('data-throttle-id', id + '')
  }

  !cache[id] && (cache[id] = {})
  const throttled = cache[id][wait] ||
    (cache[id][wait] = throttle(
      fireLazyload.bind(this, el),
      parseFloat(wait),
      // true for callLastTime.
      // to trigger once more time after the last throttled function called with a little more delay.
      true)
    )
  return throttled
}
