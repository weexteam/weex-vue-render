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
/**
 * @fileOverview utils for tests.
 */
import {
  extend,
  getRgb
} from '../../src/utils'

export { getRgb }

export function toArray (list) {
  if (!list) return []
  return Array.prototype.slice.call(list)
}
//  see https://stackoverflow.com/questions/2735067/how-to-convert-a-dom-node-list-to-an-array-in-javascript
export function nodeListToArray (obj) {
  const array = []
    // iterate backwards ensuring that length is an UInt32
  for (let i = obj.length >>> 0; i--;) {
    array[i] = obj[i]
  }
  return array
}

export function isPhantom () {
  return window.navigator.userAgent.indexOf('PhantomJS') !== -1
}

export function dispatchEvent (dom, type, opts, callback) {
  const evt = new Event(type, { bubbles: true, cancelable: true })
  if (typeof opts === 'function') {
    callback = opts
    opts = null
  }
  extend(evt, opts)
  dom.dispatchEvent(evt)
  if (callback) {
    setTimeout(callback, 16)
  }
}

export function once (dom, type, listener) {
  const handler = function (...args) {
    listener && listener.apply(dom, args)
    dom.removeEventListener(type, handler)
  }
  dom.addEventListener(type, handler)
}

export const rgb = {
  yellow: { r: 255, g: 255, b: 0 },
  red: { r: 255, g: 0, b: 0 },
  blue: { r: 0, g: 0, b: 255 },
  green: { r: 0, g: 128, b: 0 }
}
