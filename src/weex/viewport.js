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

import { extend } from '../utils/func'

/**
 * viewport priority:
 *
 * 1. meta weex-viewport (developer custom)
 * 2. setViewport(config) := config.width (private code) @deprecated
 * 3. process.env.VIEWPORT_WIDTH (buid time)
 *
 */
let isInited = false
const DEFAULT_VIEWPORT_WIDTH = 750

/**
 * get viewport width from weex-viewport meta.
 */
const envViewportWidth = parseInt(process.env.VIEWPORT_WIDTH)
let width = !isNaN(envViewportWidth) && envViewportWidth > 0
  ? envViewportWidth
  : DEFAULT_VIEWPORT_WIDTH

let wxViewportMeta = document.querySelector('meta[name="weex-viewport"]')
const metaWidth = wxViewportMeta && parseInt(wxViewportMeta.getAttribute('content'))
if (metaWidth && !isNaN(metaWidth) && metaWidth > 0) {
  width = metaWidth
}

let dpr = 0
let screenWidth = 0
let screenHeight = 0

const info = {
  dpr,
  scale: 0,
  rootValue: 0,
  rem: 0,
  deviceWidth: 0,
  deviceHeight: 0
}

/**
 * set root font-size for rem units. If already been set, just skip this.
 */
function setRootFont (width, viewportWidth, force) {
  const doc = window.document
  const rem = width * 750 / viewportWidth / 10
  if (!doc.documentElement) { return }
  const rootFontSize = doc.documentElement.style.fontSize
  if (!rootFontSize || force) {
    doc.documentElement.style.fontSize = rem + 'px'
  }
  info.rem = rem
  info.rootValue = viewportWidth / 10
}

function setMetaViewport (width) {
  if (!wxViewportMeta) {
    wxViewportMeta = document.createElement('meta')
    wxViewportMeta.setAttribute('name', 'weex-viewport')
    const firstMeta = document.querySelector('meta')
    const head = firstMeta && firstMeta.parentElement
      || document.documentElement.children[0]
    firstMeta
      ? head.insertBefore(wxViewportMeta, firstMeta)
      : head.appendChild(wxViewportMeta)
  }
  else {
    const metaWidth = parseInt(wxViewportMeta.getAttribute('content'))
    if (metaWidth === width) {
      return
    }
  }
  wxViewportMeta.setAttribute('content', width + '')
}

/**
 * export viewport info.
 */
export function init (viewportWidth = width) {
  if (!isInited) {
    isInited = true

    const doc = window.document
    if (!doc) {
      console.error('[vue-render] window.document is undfined.')
      return
    }
    if (!doc.documentElement) {
      console.error('[vue-render] document.documentElement is undfined.')
      return
    }

    dpr = info.dpr = window.devicePixelRatio
    screenWidth = doc.documentElement.clientWidth
    screenHeight = doc.documentElement.clientHeight

    const resetDeviceHeight = function () {
      screenHeight = doc.documentElement.clientHeight
      const env = window.weex && window.weex.config.env
      info.deviceHeight = env.deviceHeight = screenHeight * dpr
    }

    // set root font for rem.
    setRootFont(screenWidth, viewportWidth)
    setMetaViewport(viewportWidth)

    window.addEventListener('resize', resetDeviceHeight)

    /**
     * why not to use window.screen.width to get screenWidth ? Because in some
     * old webkit browser on android system it get the device pixel width, which
     * is the screenWidth multiply by the device pixel ratio.
     * e.g. ip6 -> get 375 for virtual screen width.
     */
    const scale = screenWidth / viewportWidth
    /**
     * 1. if set initial/maximum/mimimum-scale some how the page will have a bounce
     * effect when user drag the page towards horizontal axis.
     * 2. Due to compatibility reasons, not to use viewport meta anymore.
     * 3. viewport meta should always be:
     *    <meta name="viewport"
     *      content="width=device-width,
     *      initial-scale=1,
     *      maximum-scale=1,
     *      user-scalable=no" />
     */
    extend(info, {
      scale,
      rootValue: viewportWidth / 10,
      deviceWidth: screenWidth * dpr,
      deviceHeight: screenHeight * dpr
    })
  }

  return info
}

/**
 * reset viewport width and scale.
 * @return new scale.
 */
export function resetViewport (viewportWidth) {
  setRootFont(screenWidth, viewportWidth, true)
  setMetaViewport(viewportWidth)
  const newScale = screenWidth / viewportWidth
  info.scale = newScale
  return newScale
}

export function getViewportInfo () {
  return info
}
