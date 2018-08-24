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

function getLoading () {
  const { extractComponentStyle } = weex
  const { dispatchNativeEvent } = weex.utils

  return {
    name: 'weex-loading',
    props: {
      display: {
        type: String,
        default: 'show',
        validator (value) {
          return ['show', 'hide'].indexOf(value) !== -1
        }
      }
    },
    data () {
      return {
        height: -1,
        viewHeight: 0
      }
    },
    mounted () {
      this.viewHeight = this.$el.offsetHeight
      if (this.display === 'hide') {
        this.height = 0
      }
      else {
        this.height = this.viewHeight
      }
    },
    watch: {
      height (val) {
        const offset = `${val}px`
        this.$el.style.height = offset
        this.$el.style.bottom = offset
      },
      display (val) {
        if (val === 'hide') {
          this.height = 0
        }
        else {
          this.height = this.viewHeight
        }
      }
    },
    methods: {
      pulling (offsetY = 0) {
        this.height = offsetY
      },
      pullingUp (offsetY) {
        this.$el.style.transition = `height 0s`
        this.pulling(offsetY)
      },
      pullingEnd () {
        this.$el && (this.$el.style.transition = `height .2s`)
        if (this.height >= this.viewHeight) {
          this.pulling(this.viewHeight)
          if (this.$el) {
            dispatchNativeEvent(this.$el, 'loading')
          }
        }
        else {
          this.pulling(0)
        }
      },
      getChildren () {
        const children = this.$slots.default || []
        if (this.display === 'show') {
          return children
        }
        return children.filter(vnode => {
          return !(vnode.componentOptions
            && vnode.componentOptions.tag === 'loading-indicator')
        })
      }
    },
    render (createElement) {
      this.$parent._loading = this
      return createElement('aside', {
        ref: 'loading',
        attrs: { 'weex-type': 'loading' },
        staticClass: 'weex-loading weex-ct',
        staticStyle: extractComponentStyle(this)
      }, this.getChildren())
    }
  }
}

export default {
  init (weex) {
    weex.registerComponent('loading', getLoading(weex))
  }
}
