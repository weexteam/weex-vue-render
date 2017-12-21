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

import config from '../config'
import { camelize } from './func'
const { bindingStyleNamesForPx2Rem } = config

// whether to support using 0.5px to paint 1px width border.
let _supportHairlines
export function supportHairlines () {
  if (typeof _supportHairlines === 'undefined') {
    const dpr = window.devicePixelRatio
    if (dpr && dpr >= 2 && document.documentElement) {
      const docElm = document.documentElement
      const testElm = document.createElement('div')
      const fakeBody = document.createElement('body')
      const beforeNode = docElm.firstElementChild || docElm.firstChild
      testElm.style.border = '0.5px solid transparent'
      fakeBody.appendChild(testElm)
      docElm.insertBefore(fakeBody, beforeNode)
      _supportHairlines = testElm.offsetHeight === 1
      docElm.removeChild(fakeBody)
    }
    else {
      _supportHairlines = false
    }
  }
  return _supportHairlines
}

let support = null

export function supportSticky () {
  if (support !== null) {
    return support
  }
  const element = window.document.createElement('div')
  const elementStyle = element.style
  elementStyle.cssText = 'position:-webkit-sticky;position:sticky;'
  support = elementStyle.position.indexOf('sticky') !== -1
  return support
}

/**
 * get transformObj
 */
export function getTransformObj (elm) {
  let styleObj = {}
  if (!elm) { return styleObj }
  const transformStr = elm.style.webkitTransform
    || elm.style.mozTransform
    || elm.style.transform
  if (transformStr && transformStr.match(/(?: *(?:translate|rotate|scale)[^(]*\([^(]+\))+/i)) {
    styleObj = transformStr.trim().replace(/, +/g, ',').split(' ').reduce(function (pre, str) {
      ['translate', 'scale', 'rotate'].forEach(function (name) {
        if (new RegExp(name, 'i').test(str)) {
          pre[name] = str
        }
      })
      return pre
    }, {})
  }
  return styleObj
}

/**
 * translate a transform string from a transformObj.
 */
export function getTransformStr (obj) {
  return Object.keys(obj).reduce(function (pre, key) {
    return pre + obj[key] + ' '
  }, '')
}

/**
 * add transform style to element.
 * @param {HTMLElement} elm
 * @param {object} style: transform object, format is like this:
 *   {
 *     translate: 'translate3d(2px, 2px, 2px)',
 *     scale: 'scale(0.2)',
 *     rotate: 'rotate(30deg)'
 *   }
 * @param {boolean} replace: whether to replace all transform properties.
 */
export function addTransform (elm, style, replace) {
  if (!style) { return }
  let styleObj = {}
  if (!replace) {
    styleObj = getTransformObj(elm)
  }
  for (const key in style) {
    const val = style[key]
    if (val) {
      styleObj[key] = val
    }
  }
  const resStr = getTransformStr(styleObj)
  elm.style.webkitTransform = resStr
  elm.style.mozTransform = resStr
  elm.style.transform = resStr
}

/**
 * copy a transform behaviour from one element to another.
 * key could be: 'translate' | 'scale' | 'rotate'
 */
export function copyTransform (from, to, key) {
  let str
  if (!key) {
    str = from.style.webkitTransform
      || from.style.mozTransform
      || from.style.transform
  }
  else {
    const fromObj = getTransformObj(from)
    if (!fromObj[key]) { return }
    const toObj = getTransformObj(to)
    toObj[key] = fromObj[key]
    str = getTransformStr(toObj)
  }
  to.style.webkitTransform = str
  to.style.mozTransform = str
  to.style.transform = str
}

/**
 * get color's r, g, b value.
 * @param {string} color support all kinds of value of color.
 */
export function getRgb (color) {
  const haxReg = /#([\da-fA-F]{2})([\da-fA-F]{2})([\da-fA-F]{2})/
  const rgbReg = /rgb\((\d+),\s*(\d+),\s*(\d+)\)/
  const span = document.createElement('span')
  const body = document.body
  span.style.cssText = `color: ${color}; width: 0px; height: 0px;`
  body && body.appendChild(span)
  color = window.getComputedStyle(span).color + ''
  body && body.removeChild(span)

  let match
  match = color.match(haxReg)
  if (match) {
    return {
      r: parseInt(match[1], 16),
      g: parseInt(match[2], 16),
      b: parseInt(match[3], 16)
    }
  }
  match = color.match(rgbReg)
  if (match) {
    return {
      r: parseInt(match[1]),
      g: parseInt(match[2]),
      b: parseInt(match[3])
    }
  }
}

/**
 * get style sheet with owner node's id
 * @param {string} id owner node id.
 */
export function getStyleSheetById (id) {
  if (!id) { return }
  const styleSheets = document.styleSheets
  const len = styleSheets.length
  for (let i = 0; i < len; i++) {
    const styleSheet = styleSheets[i]
    if (styleSheet.ownerNode.id === id) {
      return styleSheet
    }
  }
}

function getChildrenTotalWidth (children) {
  const len = children.length
  let total = 0
  for (let i = 0; i < len; i++) {
    total += children[i].getBoundingClientRect().width
  }
  return total
}
/**
 * get total content width of the element.
 * @param {HTMLElement} elm
 */
export function getRangeWidth (elm) {
  const children = elm.children
  if (!children) {
    return elm.getBoundingClientRect().width
  }
  if (!Range) {
    return getChildrenTotalWidth(children)
  }
  const range = document.createRange()
  if (!range.selectNodeContents) {
    return getChildrenTotalWidth(children)
  }
  range.selectNodeContents(elm)
  return range.getBoundingClientRect().width
}

/**
 * px2rem and camelize keys.
 */
export function styleObject2rem (style, rootValue) {
  const obj = {}
  for (const k in style) {
    const camK = camelize(k)
    if (bindingStyleNamesForPx2Rem.indexOf(camK) > -1) {
      obj[camK] = px2rem(style[k] + '', rootValue)
    }
    else {
      obj[camK] = style[k]
    }
  }
  return obj
}

export function px2rem (px, rootValue) {
  return px.replace(/([+-]?\d+(?:.\d*)?)([p|w]x)/g, function ($0, $1, $2) {
    if ($2 === 'wx') { // 'wx' -> px
      return $1 + 'px'
    }
    else {  // 'px' -> rem
      const pxVal = parseFloat($1)
      const sign = pxVal > 0
        ? 1 : pxVal < 0 ?
          -1 : 0
      if (Math.abs(pxVal) <= 1) {
        return supportHairlines()
          ? `${sign * 0.5}px`
          : `${sign * 1}px`
      }
      return pxVal
        / (rootValue || window.weex.config.env.rem)
        + 'rem'
    }
  })
}

export function rem2px (rem, rootValue) {
  return rem.replace(/([+-]?\d+(?:.\d*)?)rem/g, function ($0, $1) {
    return parseFloat($1)
      * (rootValue || window.weex.config.env.rem)
      + 'px'
  })
}
