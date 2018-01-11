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
import { hyphenate } from './utils'

const scaleStyles = [
  'width',
  'height',
  'left',
  'right',
  'top',
  'bottom',
  'border',
  'borderRadius',
  'borderWidth',
  'borderLeft',
  'borderRight',
  'borderTop',
  'borderBottom',
  'borderLeftWidth',
  'borderRightWidth',
  'borderTopWidth',
  'borderBottomWidth',
  'margin',
  'marginLeft',
  'marginRight',
  'marginTop',
  'marginBottom',
  'padding',
  'paddingLeft',
  'paddingRight',
  'paddingTop',
  'paddingBottom',
  'fontSize',
  'lineHeight',
  'transform',
  'webkitTransform',
  'WebkitTransform',
  'mozTransform',
  'MozTransform',
  'itemSize'
]

const vendorReg = /webkit|moz/i
function hyphen (key) {
  return hyphenate(key.replace(vendorReg, function ($0) {
    return `-${$0.toLowerCase()}-`
  }))
}

function getAllStyles () {
  return Object.keys(scaleStyles.reduce(function (pre, key) {
    pre[key] = 1
    pre[hyphen(key)] = 1
    return pre
  }, {}))
}

const allStyles = getAllStyles()

export default {
  scrollableTypes: ['scroller', 'list', 'waterfall'],
  gestureEvents: [
    'panstart',
    'panmove',
    'panend',
    'swipe',
    'longpress',
    'tap'
  ],
  // these components should not bind events with .native.
  weexBuiltInComponents: [
    'div',
    'container',
    'text',
    'image',
    'img',
    'cell',
    'a'
  ],
  bindingStyleNamesForPx2Rem: allStyles
}
