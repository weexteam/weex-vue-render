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

let getComponentInlineStyle

function getIndicatorItemStyle (ms, isActive) {
  const style = {}
  const bgColor = isActive
    ? ms['itemSelectedColor'] || ms['item-selected-color']
    : ms['itemColor'] || ms['item-color']
  style['background-color'] = bgColor
  style['width'] = style['height'] = ms['itemSize'] || ms['item-size']
  return style
}

function getScopeIds (context) {
  let scopeIds = context._scopeIds
  if (scopeIds) {
    return scopeIds
  }
  else {
    scopeIds = []
  }
  let parent = context.$parent
  while (parent) {
    let i
    if ((i = parent.$options) && (i = i._scopeId)) {
      scopeIds.push(i)
    }
    parent = parent.$parent
  }
  context._scopeIds = scopeIds
  return scopeIds
}

function _render (context, h) {
  const children = []
  const mergedStyle = getComponentInlineStyle(context)
  const scopeIds = getScopeIds(context)
  const attrs = {}
  for (let i = 0, l = scopeIds.length; i < l; i++) {
    attrs[scopeIds[i]] = ''
  }
  for (let i = 0; i < Number(context.count); ++i) {
    const classNames = ['weex-indicator-item weex-el']
    let isActive = false
    if (i === Number(context.active)) {
      classNames.push('weex-indicator-item-active')
      isActive = true
    }
    children.push(h('mark', {
      attrs,
      staticClass: classNames.join(' '),
      staticStyle: getIndicatorItemStyle(mergedStyle, isActive)
    }))
  }
  return h('nav', {
    attrs: { 'weex-type': 'indicator' },
    staticClass: 'weex-indicator weex-ct'
  }, [
    // the indicator nav may cover the slides, and may stop the
    // click event be triggered on the slides.
    // so a smaller wrapper is needed to prevent the overlap.
    // This wrapper will cover only the whole size of all the
    // indicator pointers' item-sizes.
    h('div', {
      staticClass: 'weex-indicator-inner'
    }, children)
  ])
}

const indicator = {
  name: 'weex-indicator',
  methods: {
    show: function () {
      this.$el.style.visibility = 'visible'
    }
  },
  props: {
    itemColor: [String],
    itemSelectedColor: [String],
    itemSize: [String]
  },
  data () {
    return {
      count: 0,
      active: 0
    }
  },
  render (createElement) {
    const { count, active } = this.$vnode.data.attrs || {}
    this.count = count
    this.active = active
    if (!this.count) { return }
    return _render(this, createElement)
  }
}

export default {
  init (weex) {
    getComponentInlineStyle = weex.getComponentInlineStyle
    weex.registerComponent('indicator', indicator)
  }
}
