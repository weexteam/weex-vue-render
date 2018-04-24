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

const DEFAULT_OFFSET_ACCURACY = 10
const DEFAULT_LOADMORE_OFFSET = 0

function getThrottledScroll (context) {
  const scale = weex.config.env.scale
  if (!context._throttleScroll) {
    const wrapper = context.$refs.wrapper
    const inner = context.$refs.inner
    let preOffset = (context.scrollDirection === 'horizontal'
      ? wrapper.scrollLeft
      : wrapper.scrollTop)
      || 0
    context._throttleScroll = weex.utils.throttle(function (evt) {
      const offset = context.scrollDirection === 'horizontal'
        ? wrapper.scrollLeft
        : wrapper.scrollTop
      const indent = parseInt(context.offsetAccuracy) * scale
      function triggerScroll () {
        const rect = inner.getBoundingClientRect()
        const evtObj = {
          contentSize: { width: rect.width, height: rect.height },
          contentOffset: {
            x: wrapper.scrollLeft,
            /**
             * positive direciton for y-axis is down.
             * so should use negative operation on scrollTop.
             *
             *  (0,0)---------------> x
             *       |
             *       |
             *       |
             *       |
             *       v y
             *
             */
            y: -wrapper.scrollTop
          }
        }
        if (context.$el) {
          weex.utils.dispatchNativeEvent(context.$el, 'weex$scroll', evtObj)
        }
      }
      if (Math.abs(offset - preOffset) >= indent) {
        triggerScroll()
        preOffset = offset
      }
    }, 16, true)
  }
  return context._throttleScroll
}

export default {
  props: {
    loadmoreoffset: {
      type: [String, Number],
      default: DEFAULT_LOADMORE_OFFSET,
      validator (value) {
        const val = parseInt(value)
        return !isNaN(val) && val >= DEFAULT_LOADMORE_OFFSET
      }
    },

    offsetAccuracy: {
      type: [Number, String],
      default: DEFAULT_OFFSET_ACCURACY,
      validator (value) {
        const val = parseInt(value)
        return !isNaN(val) && val >= DEFAULT_OFFSET_ACCURACY
      }
    }
  },

  created () {
    // should call resetLoadmore() to enable loadmore event.
    this._loadmoreReset = true
  },

  mounted () {
    this.reloadStickyChildren()
  },

  updated () {
    this.reloadStickyChildren()
  },

  methods: {
    updateLayout () {
      const wrapper = this.$refs.wrapper
      if (wrapper) {
        const rect = wrapper.getBoundingClientRect()
        this._wrapperWidth = rect.width
        this._wrapperHeight = rect.height
      }
      const inner = this.$refs.inner
      const children = inner && inner.children
      if (inner) {
        const rect = inner.getBoundingClientRect()
        this._innerWidth = rect.width
        this._innerHeight = rect.height
      }
      const loadingEl = this._loading && this._loading.$el
      const refreshEl = this._refresh && this._refresh.$el
      if (loadingEl) {
        this._innerHeight -= loadingEl.getBoundingClientRect().height
      }
      if (refreshEl) {
        this._innerHeight -= refreshEl.getBoundingClientRect().height
      }
      // inner width is always the viewport width somehow in horizontal
      // scoller, therefore the inner width should be reclaculated.
      if (this.scrollDirection === 'horizontal' && children) {
        this._innerWidth = weex.utils.getRangeWidth(inner)
      }
    },

    resetLoadmore () {
      this._loadmoreReset = true
    },

    /**
     * process sticky children in scrollable components.
     * current only support list and vertical scroller.
     */
    processSticky () {
      /**
       * current browser support 'sticky' or '-webkit-sticky', so there's no need
       * to do further more.
       */
      const stickyChildren = this._stickyChildren
      const len = stickyChildren && stickyChildren.length || 0
      if (len <= 0) { return }

      const origSticky = weex.utils.supportSticky()
      // current only support list and vertical scroller.
      if (this.scrollDirection === 'horizontal') {
        return
      }

      const container = this.$el
      if (!container) { return }
      const scrollTop = container.scrollTop

      let stickyChild
      for (let i = 0; i < len; i++) {
        stickyChild = stickyChildren[i]
        if (origSticky) {
          this.addSticky(stickyChild, origSticky)
        }
        else if (stickyChild._initOffsetTop < scrollTop) {
          this.addSticky(stickyChild)
        }
        else {
          this.removeSticky(stickyChild)
        }
      }
    },

    addSticky (el, supportSticky) {
      if (supportSticky) {
        el.classList.add('weex-ios-sticky')
      }
      else {
        if (el._sticky === true) return
        if (process.env.NODE_ENV !== 'production') {
          console.log(`[vue-render] header add sticky`, el)
        }
        el._sticky = true
        if (!el._placeholder) {
          const placeholder = el.cloneNode(true)
          placeholder._origNode = el
          placeholder.classList.add('weex-sticky-placeholder')
          el._placeholder = placeholder
        }
        el.parentNode.insertBefore(el._placeholder, el)
        el.style.width = window.getComputedStyle(el).width
        el.classList.add('weex-sticky')
      }
    },

    removeSticky (el) {
      if (
        typeof el._sticky === 'undefined'
        || el._sticky === false
      ) {
        return
      }
      if (process.env.NODE_ENV !== 'production') {
        console.log(`[vue-render] header remove sticky`, el)
      }
      el._sticky = false
      el.parentNode.removeChild(el._placeholder)
      el.classList.remove('weex-sticky')
    },

    reloadStickyChildren () {
      const container = this.$el
      if (!container) return
      const stickyChildren = []
      const children = container.querySelectorAll('[sticky]')
      for (let i = 0, l = children.length; i < l; i++) {
        const child = children[i]
        if (/weex-sticky-placeholder/.test(child.className)) {  // is a placeholder.
          const origNode = child._origNode
          if (
            !origNode
            || !origNode.parentNode
            || origNode.parentNode !== child.parentNode
          ) {
            child.parentNode.removeChild(child)
          }
        }
        else {  // is a sticky node.
          stickyChildren.push(child)
          if (!child._sticky) {
            child._initOffsetTop = child.offsetTop
          }
        }
      }
      this._stickyChildren = stickyChildren
    },

    handleScroll (event) {
      weex.utils.getThrottleLazyload(25, this.$el, 'scroll')()
      getThrottledScroll(this)(event)

      this.processSticky()

      // fire loadmore event.
      const inner = this.$refs.inner
      if (inner) {
        const innerLength = this.scrollDirection === 'horizontal'
          ? this._innerWidth
          : this._innerHeight
        if (!this._innerLength) {
          this._innerLength = innerLength
        }
        if (this._innerLength !== innerLength) {
          this._innerLength = innerLength
          this._loadmoreReset = true
        }
        if (this._loadmoreReset && this.reachBottom(this.loadmoreoffset)) {
          this._loadmoreReset = false
          const el = this.$el
          if (el) {
            weex.utils.dispatchNativeEvent(el, 'loadmore')
          }
        }
      }
    },

    reachTop () {
      const wrapper = this.$refs.wrapper
      return (!!wrapper) && (wrapper.scrollTop <= 0)
    },

    reachBottom (offset) {
      const wrapper = this.$refs.wrapper
      const inner = this.$refs.inner
      offset = parseInt(offset || 0) * weex.config.env.scale

      if (wrapper && inner) {
        const key = this.scrollDirection === 'horizontal'
          ? 'width'
          : 'height'
        const innerLength = this[`_inner${key[0].toUpperCase()}${key.substr(1)}`]
        const wrapperLength = this[`_wrapper${key[0].toUpperCase()}${key.substr(1)}`]
        const scrollOffset = this.scrollDirection === 'horizontal'
          ? wrapper.scrollLeft
          : wrapper.scrollTop
        return scrollOffset >= innerLength - wrapperLength - offset
      }
      return false
    },

    handleTouchStart (event) {
      if (this._loading || this._refresh) {
        const touch = event.changedTouches[0]
        this._touchParams = {
          reachTop: this.reachTop(),
          reachBottom: this.reachBottom(),
          startTouchEvent: touch,
          startX: touch.pageX,
          startY: touch.pageY,
          timeStamp: event.timeStamp
        }
      }
    },

    handleTouchMove (event) {
      if (!this._touchParams || !this._refresh && !this._loading) {
        return
      }
      const inner = this.$refs.inner
      const { startY, reachTop, reachBottom } = this._touchParams
      if (inner) {
        const touch = event.changedTouches[0]
        const offsetY = touch.pageY - startY
        const dir = offsetY > 0 ? 'down' : 'up'
        this._touchParams.offsetY = offsetY
        if (this._refresh && (dir === 'down') && reachTop) {
          this._refresh.pullingDown(offsetY)
        }
        else if (this._loading && (dir === 'up') && reachBottom) {
          this._loading.pullingUp(-offsetY)
        }
      }
    },

    handleTouchEnd (event) {
      if (!this._touchParams || !this._refresh && !this._loading) {
        return
      }
      const inner = this.$refs.inner
      const { startY, reachTop, reachBottom } = this._touchParams
      if (inner) {
        const touch = event.changedTouches[0]
        const offsetY = touch.pageY - startY
        const dir = offsetY > 0 ? 'down' : 'up'
        this._touchParams.offsetY = offsetY
        if (this._refresh && (dir === 'down') && reachTop) {
          this._refresh.pullingEnd()
        }
        else if (this._loading && (dir === 'up') && reachBottom) {
          this._loading.pullingEnd()
        }
      }
      delete this._touchParams
    }
  }
}
