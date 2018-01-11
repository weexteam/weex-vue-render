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
import { init } from '../helper'
import { init as initViewport } from '../../src/weex/viewport'

init('core style', (Vue, helper) => {
  const { scale } = initViewport()

  let vm
  const id = 'core.style'

  before(() => {
    vm = helper.createVm(id)
  })

  after(() => {
    helper.clear(id)
  })

  it('should get inline styles.', function () {
    const ct = vm.$refs.ct
    const txt = vm.$refs.txt
    expect(ct).to.be.ok
    const expectedCt = {
      width: 750 * scale,
      height: 400 * scale,
      backgroundColor: 'rgb(247, 247, 247)'
    }
    const computedCtStyle = window.getComputedStyle(ct)
    expect(parseFloat(computedCtStyle.width)).to.be.closeTo(expectedCt.width, 0.1)
    expect(parseFloat(computedCtStyle.height)).to.be.closeTo(expectedCt.height, 0.1)
    expect(computedCtStyle.backgroundColor).to.be.equal(expectedCt.backgroundColor)

    expect(txt).to.be.ok
    const expectedTxt = {
      color: 'rgb(255, 0, 0)',
      backgroundColor: 'rgb(0, 128, 0)',
      lineHeight: 100 * scale
    }
    const computedTxtStyle = window.getComputedStyle(txt)
    expect(computedTxtStyle.color).to.be.equal(expectedTxt.color)
    expect(computedTxtStyle.backgroundColor).to.be.equal(expectedTxt.backgroundColor)
    expect(parseFloat(computedTxtStyle.lineHeight)).to.be.closeTo(expectedTxt.lineHeight, 0.1)
  })
})
