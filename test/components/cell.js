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
import { getRgb } from '../../src/utils'

init('<cell> component', (Vue, helper) => {
  const { utils } = helper
  const id = 'components.cell'
  let vm, refs

  before(() => {
    vm = helper.createVm('components.cell')
    refs = vm.$refs
  })

  after(() => {
    helper.clear(id)
  })

  it('simple <cell> component', () => {
    const el = refs.simple
    expect(el.tagName.toLowerCase()).to.equal('section')
    expect(el instanceof HTMLElement).to.be.true
    const classListArr = utils.toArray(el.classList)
    expect(classListArr).to.include.members(['weex-cell', 'weex-ct'])
    expect(el.getAttribute('weex-type')).to.be.equal('cell')
  })

  it('<cell> styles', () => {
    const style = {
      height: '200px',
      borderBottom: '1px solid #333333'
    }
    const el = refs.style
    expect(el instanceof HTMLElement).to.be.true
    expect(el.tagName.toLowerCase()).to.equal('section')
    const classListArr = utils.toArray(el.classList)
    expect(classListArr).to.include.members(['weex-cell', 'weex-ct'])
    expect(el.getAttribute('weex-type')).to.be.equal('cell')
    const cs = window.getComputedStyle(el)
    const rgb = getRgb('#333333')
    expect(parseFloat(cs.height)).to.be.closeTo(
      parseFloat(style.height) * weex.config.env.scale,
      0.02
    )
    expect(cs.borderBottom.replace(/ (#|rgb).+$/, ''))
      .to.equal(style.borderBottom.replace(/ (#|rgb).+$/, ''))
    expect(getRgb(cs.borderBottom.match(/(#|rgb).+$/)[0]))
      .to.deep.equal(rgb)
  })
})
