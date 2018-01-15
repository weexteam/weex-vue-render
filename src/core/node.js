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
import {
  isArray,
  isDef,
  isPrimitive,
  dispatchNativeEvent
} from '../utils'
import config from '../config'

const {
  weexBuiltInComponents
} = config

const appearEventsMap = {
  appear: 'appear',
  disappear: 'disappear',
  offsetAppear: 'offset-appear',
  offsetDisappear: 'offset-disappear'
}

/**
 * remove text nodes in the nodes array.
 * @param  {Array} nodes
 * @return {Array} nodes without text nodes.
 */
export function trimTextVNodes (vnodes) {
  if (isArray(vnodes)) {
    return vnodes.filter(vnode => !!vnode.tag)
  }
  return vnodes
}

/**
 * ==================================================
 * method to transform args passed to createElement
 * for render function.
 * ==================================================
 */

// should share with precompiler.
const metaMap = {
  figure: ['img', 'image', 'figure'],
  p: ['text', 'p'],
  div: ['container', 'div'],
  section: ['cell']
}

const checkMap = Object.keys(metaMap).reduce(function (pre, targetTag) {
  const tagArr = metaMap[targetTag]
  tagArr.forEach(function (fromTag) {
    pre[fromTag] = targetTag
  })
  return pre
}, {})

const _stdTagMap = {
  p: 'text',
  figure: 'image',
  section: 'cell'
}
function getStdTag (tag) {
  const stdTag = _stdTagMap[tag]
  return stdTag || tag
}

const precompiledClassMap = {
  div: {
    'weex-ct': true,
    'weex-div': true
  },
  image: {
    'weex-el': true,
    'weex-image': true
  },
  text: {
    'weex-el': true,
    'weex-text': true
  },
  cell: {
    'weex-ct': true,
    'weex-cell': true
  },
  a: {
    'weex-ct': true,
    'weex-a': true
  }
}

function isPrecompiled (tag) {
  return config.weexBuiltInComponents.indexOf(tag) > -1
}

export function transformRender (ctx, h) {
  return function (
    tag,
    data,
    children,
    normalizationType,
    alwaysNormalize
  ) {
    if (isArray(data) || isPrimitive(data)) {
      normalizationType = children
      children = data
      data = {}
    }
    if (!isDef(data)) {
      data = {}
    }
    if (isDef(data.is)) {
      tag = data.is
    }
    if (typeof tag === 'string') {
      data = transformData(this, data, tag)
      tag = transformTag(this, tag)
    }
    else {  // direct component options / constructor
      data = transformData(this, data, undefined)
    }
    return h.call(
      this,
      tag,
      data,
      children,
      normalizationType,
      alwaysNormalize
    )
  }.bind(ctx)
}

export function transformTag (ctx, tag) {
  const elementTag = checkMap[tag]
  return elementTag || tag
}

/**
 * Tell whether a element is contained in a element who has
 * a attribute 'bubble'=true.
 * @param {HTMLElement} el
 */
// function inBubble (el) {
//   if (typeof el._inBubble === 'boolean') {
//     return el._inBubble
//   }
//   const parents = []
//   let parent = el.parentElement
//   let inBubble
//   while (parent && parent !== document.body) {
//     if (typeof parent._inBubble === 'boolean') {
//       inBubble = parent._inBubble
//       break
//     }
//     const attr = parent.getAttribute('bubble')
//     if (attr !== '') {
//       inBubble = attr === true || attr === 'true'
//       break
//     }
//     parents.push(parent)
//     parent = parent.parentElement
//   }
//   el._inBubble = inBubble
//   for (let i = 0, l = parents.length; i < l; i++) {
//     parents[i]._inBubble = inBubble
//   }
//   return inBubble
// }

function bindEvents (ctx, evts, attrs, tag, appearAttached) {
  for (const key in evts) {
    const appearEvtName = appearEventsMap[key]
    if (appearEvtName) {
      attrs[`data-evt-${appearEvtName}`] = ''
      if (!appearAttached.value) {
        appearAttached.value = true
        attrs['weex-appear'] = ''
      }
    }
    else {
      attrs[`data-evt-${key}`] = ''
      if (key !== 'click') {
        // should stop propagation by default.
        // TODO: should test inBubble first.
        const handler = evts[key]
        if (isArray(evts[key])) {
          handler.unshift(ctx.$stopPropagation)
        }
        else {
          evts[key] = [ctx.$stopPropagation, handler]
        }
      }
    }
  }
  if (evts.click) {
    evts.weex$tap = evts.click
    evts.click = ctx.$stopOuterA
  }
  if (evts.scroll) {
    evts.weex$scroll = evts.scroll
    delete evts.scroll
  }
}

function transformOn (ctx, data, tag) {
  let { on, nativeOn } = data
  if (weexBuiltInComponents.indexOf(tag) > -1) {
    /**
     * for div, image, text, cell, a, ...
     * user should bind all events without .native.
     */
    nativeOn = null
    delete data.nativeOn
  }
  if (isDef(weex._components[tag])) {
    /**
     * for slider, list, ...
     * user should bind events without .native.
     * in our events handling, all events should transfer to
     * .native binding.
     */
    delete data.nativeOn
    nativeOn = null
    if (on) {
      nativeOn = data.nativeOn = on
    }
    on = null
    delete data.on
  }

  let attrs = data.attrs
  if (!attrs) {
    attrs = data.attrs = {}
  }

  const appearAttached = {
    value: false
  }
  if (on) {
    bindEvents(ctx, on, attrs, tag, appearAttached)
  }
  if (nativeOn) {
    bindEvents(ctx, nativeOn, attrs, tag, appearAttached)
  }

  /**
   * binding a weex$tap to <a> element to stop propagation if there
   * is no bubbles=true flag showing on parents.
   */
  if (tag === 'a') {
    if (!on) {
      on = data.on = {}
    }
    // if (!checkBubble(el)) {
    let evt = on['weex$tap']
    if (!evt) {
      on['weex$tap'] = ctx.$stopPropagation
    }
    else if (Array.isArray(evt)) {
      evt.unshift(ctx.$stopPropagation)
    }
    else {
      evt = [ctx.$stopPropagation, evt]
    }
    // }
  }
}

function transformClass (data, tag) {
  let { class: classData } = data
  const tagClassObj = precompiledClassMap[tag]
  if (!classData) {
    classData = data.class = []
  }
  if (classData && isArray(classData)) {
    data.class = classData.concat(Object.keys(tagClassObj))
  }
  else if (typeof classData === 'object') {
    Object.assign(classData, tagClassObj)
  }
}

function transformStyle (ctx, data, tag) {
  const { style } = data
  if (!style) { return }
  const transformer = getTransformer(getStdTag(tag))
  if (transformer) {
    data.style = ctx._px2rem(transformer.transform(style), 75)
  }
  else {
    data.style = ctx._px2rem(style, 75)
  }
}

/**
 * transformAttrs:
 *  - add weex-type attrs for precompiledTags.
 *  - image.resize: transform to directive weex-resize.
 */
function transformAttrs (data, tag) {
  let { attrs, directives } = data
  if (!attrs) {
    attrs = data.attrs = {}
  }
  attrs['weex-type'] = tag
  if (tag === 'image') {
    const { src, resize } = attrs
    if (src) {
      attrs['data-img-src'] = src
    }
    if (resize) {
      if (!directives) {
        directives = data.directives = []
      }
      directives.push({
        name: 'weex-resize',
        value: attrs.resize
      })
    }
  }
}

export function transformData (ctx, data, tag) {
  if (isArray(data)) {
    // parameter data is ommited.
    return data
  }
  const isP = isPrecompiled(tag)
  // class
  isP && transformClass(data, tag)
  // style
  transformStyle(ctx, data, tag)
  // attrs
  isP && transformAttrs(data, tag)
  // on
  transformOn(ctx, data, tag)
  return data
}

export function mapNativeEvents (ctx, map) {
  const eventMap = {}
  for (const origEvent in map) {
    eventMap[origEvent] = function (evt) {
      const el = evt.target
      dispatchNativeEvent(el, map[origEvent])
    }
  }
  return eventMap
}
