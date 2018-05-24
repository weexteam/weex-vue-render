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

import { resetViewport } from '../weex/viewport'

const meta = {
  /**
   * setViewport.
   * Changing viewport design width at runtime.
   */
  setViewport (options) {
    if (!options) {
      console.error(`[vue-render] set viewport width invalid options: ${options}`)
    }
    const newWidth = parseInt(options.width)
    if (!isNaN(newWidth) && newWidth > 0) {
      resetViewport(options.width)
    }
    else {
      console.error(`[vue-render] set viewport width invalid options.width: ${options.width}`)
    }
  }
}

export default {
  init (weex) {
    weex.registerModule('meta', meta)
  }
}
