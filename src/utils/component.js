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
import { throttle, extend } from './func'
import { dispatchNativeEvent } from './event'
import config from '../config'

/**
 * whether ct contains el.
 * @param {HTMLElement} container
 * @param {HTMLElement} target
 */
export function contains (container, target, includeSelf) {
  if (includeSelf && container === target) {
    return true
  }
  return container.contains
    ? container.contains(target) && (container !== target)
    : container.compareDocumentPosition(target) & 16 !== 0
}

export function insideA (el) {
  if (typeof el._insideA === 'boolean') {
    return el._insideA
  }
  let parent = el.parentElement
  const parents = []
  const checkParents = function (inside) {
    for (let i = 0, l = parents.length; i < l; i++) {
      parents[i]._insideA = inside
    }
  }
  const check = function (inside) {
    el._insideA = inside
    checkParents(inside)
    return inside
  }
  while (parent !== document.body) {
    if (parent.tagName.toLowerCase() === 'a') {
      return check(true)
    }
    if (typeof parent._insideA === 'boolean') {
      return check(parent._insideA)
    }
    parents.push(parent)
    parent = parent.parentElement
  }
  return check(false)
}

/**
 * get parent scroller vComponent.
 * return a VueComponent or null.
 */
export function getParentScroller (vm) {
  if (!vm) return null
  if (vm._parentScroller) {
    return vm._parentScroller
  }
  function _getParentScroller (parent) {
    if (!parent) { return }
    if (config.scrollableTypes.indexOf(parent.weexType) > -1) {
      vm._parentScroller = parent
      return parent
    }
    return _getParentScroller(parent.$parent)
  }
  return _getParentScroller(vm.$parent)
}

/**
 * get scroller's element.
 * @param vm {HTMLElement | VueCOmponent} vm or element.
 * return the element or document.body.
 */
export function getParentScrollerElement (vm) {
  if (!vm) { return null }
  const el = vm instanceof HTMLElement ? vm : vm.$el
  if (!el || el.nodeType !== 1) { return }
  if (vm._parentScroller) {
    return vm._parentScroller
  }
  function _getParentScroller (parent) {
    if (!parent) { return }
    const tagName = parent.tagName.toLowerCase()
    if (tagName === 'body'
      || (tagName === 'main'
      && config.scrollableTypes.indexOf(parent.getAttribute('weex-type')) > -1)
    ) {
      vm._parentScroller = parent
      return parent
    }
    return _getParentScroller(parent.parentElement)
  }
  return _getParentScroller(el)
}

function horizontalBalance (rect, ctRect) {
  return rect.left < ctRect.right && rect.right > ctRect.left
}

function verticalBalance (rect, ctRect) {
  return rect.top < ctRect.bottom && rect.bottom > ctRect.top
}

/**
 * return a data array with two boolean value, which are:
 * 1. visible in current ct's viewport.
 * 2. visible with offset in current ct's viewport.
 */
export function hasIntersection (rect, ctRect, dir, offset) {
  dir = dir || 'up'
  const isHorizontal = dir === 'left' || dir === 'right'
  const isVertical = dir === 'up' || dir === 'down'
  if (isHorizontal && !verticalBalance(rect, ctRect)) {
    return [false, false]
  }
  if (isVertical && !horizontalBalance(rect, ctRect)) {
    return [false, false]
  }
  offset = offset ? parseInt(offset) * weex.config.env.scale : 0
  switch (dir) {
    case 'up':
      return [
        rect.top < ctRect.bottom && rect.bottom > ctRect.top,
        rect.top < ctRect.bottom + offset && rect.bottom > ctRect.top - offset
      ]
    case 'down':
      return [
        rect.bottom > ctRect.top && rect.top < ctRect.bottom,
        rect.bottom > ctRect.top - offset && rect.top < ctRect.bottom + offset
      ]
    case 'left':
      return [
        rect.left < ctRect.right && rect.right > ctRect.left,
        rect.left < ctRect.right + offset && rect.right > ctRect.left - offset
      ]
    case 'right':
      return [
        rect.right > ctRect.left && rect.left < ctRect.right,
        rect.right > ctRect.left - offset && rect.left < ctRect.right + offset
      ]
  }
}

/**
 * isElementVisible
 * @param  {HTMLElement}  el    a dom element.
 * @param  {HTMLElement}  container  optional, the container of this el.
 */
export function isElementVisible (el, container, dir, offset) {
  if (!el.getBoundingClientRect) { return false }
  const bodyRect = {
    top: 0,
    left: 0,
    bottom: window.innerHeight,
    right: window.innerWidth
  }
  const ctRect = (container === window || container === document.body)
    ? bodyRect : container
      ? container.getBoundingClientRect() : bodyRect
  return hasIntersection(el.getBoundingClientRect(), ctRect, dir, offset)
}

// to trigger the appear/disappear event.
function triggerAppearEvent (elm, evt, dir) {
  dispatchNativeEvent(elm, evt, {
    direction: dir
  })
}

/**
 * get all event listeners. including bound handlers in all parent vnodes.
 */
export function getEventHandlers (context) {
  let vnode = context.$vnode
  const handlers = {}
  const attachedVnodes = []
  while (vnode) {
    attachedVnodes.push(vnode)
    vnode = vnode.parent
  }
  attachedVnodes.forEach(function (vnode) {
    const parentListeners = vnode.componentOptions && vnode.componentOptions.listeners
    const dataOn = vnode.data && vnode.data.on
    extend(handlers, parentListeners, dataOn)
  })
  return handlers
}

function getAppearOffset (el) {
  return el && el.getAttribute('appear-offset')
}

function updateWatchAppearList (container) {
  container._watchAppearList = Array.prototype.slice.call(
    document.querySelectorAll('[weex-appear]'))
}

/**
 * inject removeChild function to watch disappear and offsetDisappear events.
 */
if (!window._rmInjected) {
  window._rmInjected = true
  const nativeRemove = HTMLElement.prototype.removeChild
  HTMLElement.prototype.removeChild = function (el) {
    el._visible && triggerAppearEvent(el, 'disappear', null)
    el._offsetVisible && triggerAppearEvent(el, 'offsetDisappear', null)
    nativeRemove.apply(this, arguments)
  }
}

/**
 * Watch element's visibility to tell whether should trigger a appear/disappear
 * event in scroll handler.
 */
export function watchAppear (context, fireNow) {
  const el = context && context.$el
  if (!el || el.nodeType !== 1) { return }

  let isWindow = false
  const container = getParentScrollerElement(context)
  if (!container) {
    return
  }
  if (container === document.body) {
    isWindow = true
  }
  /**
   * Code below will only exec once for binding scroll handler for parent container.
   */
  let scrollHandler = container._scrollHandler
  if (!scrollHandler) {
    scrollHandler = container._scrollHandler = event => {
      updateWatchAppearList(container)
      /**
       * detect scrolling direction.
       * direction only support up & down yet.
       * TODO: direction support left & right.
       */
      const scrollTop = isWindow ? window.pageYOffset : container.scrollTop
      const preTop = container._lastScrollTop
      container._lastScrollTop = scrollTop
      const dir = (scrollTop < preTop
        ? 'down' : scrollTop > preTop
          ? 'up' : container._prevDirection) || null
      container._prevDirection = dir
      const watchAppearList = container._watchAppearList || []
      const len = watchAppearList.length
      for (let i = 0; i < len; i++) {
        const el = watchAppearList[i]
        const appearOffset = getAppearOffset(el)
        const visibleData = isElementVisible(el, container, dir, appearOffset)
        detectAppear(el, visibleData, dir)
      }
    }
    container.addEventListener('scroll', throttle(scrollHandler, 100, true))
  }
  if (fireNow) {
    context.$nextTick(scrollHandler)
  }
}

/**
 * decide whether to trigger a appear/disappear event.
 * @param {VueComponent} context
 * @param {boolean} visible
 * @param {string} dir
 */
export function detectAppear (el, visibleData, dir = null, appearOffset) {
  if (!el) { return }
  const [visible, offsetVisible] = visibleData
  /**
   * No matter it's binding appear/disappear or both of them. Always
   * should test it's visibility and change the context/._visible.
   * If neithor of them was bound, then just ignore it.
   */
  /**
   * if the component hasn't appeared for once yet, then it shouldn't trigger
   * a disappear event at all.
   */
  if (el._appearedOnce || visible) {
    if (el._visible !== visible) {
      const evtName = visible ? 'appear' : 'disappear'
      if (el.getAttribute(`data-evt-${evtName}`) === '') {
        if (!el._appearedOnce) {
          el._appearedOnce = true
        }
        el._visible = visible
        triggerAppearEvent(el, evtName, dir)
      }
    }
  }
  if (el._offsetAppearedOnce || offsetVisible) {
    if (el._offsetVisible !== offsetVisible) {
      const evt = offsetVisible ? ['offset-appear', 'offsetAppear'] : ['offset-disappear', 'offsetDisappear']
      if (el.getAttribute(`data-evt-${evt[0]}`) === '') {
        if (!el._offsetAppearedOnce) {
          el._offsetAppearedOnce = true
        }
        el._offsetVisible = offsetVisible
        triggerAppearEvent(el, evt[1], dir)
      }
    }
  }
}
