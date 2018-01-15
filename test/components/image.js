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

init('<image> component', (Vue, helper) => {
  const { utils } = helper
  const id = 'components.image'
  const spys = ['loaded', 'placeholderLoad']
  let vm, refs

  const src = '//img.alicdn.com/tfs/TB1OOl1SVXXXXc_XVXXXXXXXXXX-340-340.png'
  const newSrc = '//img.alicdn.com/tfs/TB1.rOySVXXXXaKXXXXXXXXXXXX-400-400.png'

  before(() => {
    vm = helper.createVm(id, {
      spys
    })
    refs = vm.$refs
  })

  after(() => {
    helper.clear(id)
  })

  it('<image> with static src', () => {
    const el = refs.staticSrc
    expect(el.tagName.toLowerCase()).to.be.equal('figure')
    expect(utils.toArray(el.classList)).to.include.members(['weex-image', 'weex-el'])
    expect(el.getAttribute('weex-type')).to.be.equal('image')
    expect(el.style.backgroundImage).to.match(new RegExp(src))
  })

  it('<image> with placeholder', () => {
    const el = refs.placeholder
    expect(el.getAttribute('placeholder')).to.be.equal(src)
  })

  it('load placeholder', done => {
    const el = refs.staticSrc
    expect(el.getAttribute('data-evt-load')).to.equal('')
    const loadedSpy = helper.getSpy(id, 'loaded')
    helper.registerDone(id, 'updated', callback => {
      expect(loadedSpy.callCount).to.equal(2)
      const placeholderLoadSpy = helper.getSpy(id, 'placeholderLoad')
      expect(placeholderLoadSpy.callCount).to.equal(1)
      const loadEvt = placeholderLoadSpy.args[0][0]
      expect(loadEvt.success).to.be.false
      expect(loadEvt.size).to.deep.equal({
        naturalWidth: 0,
        naturalHeight: 0
      })
      callback(done)
    })
  })

  it('<image> resize="cover"', () => {
    const el = refs.cover
    expect(el.style.backgroundSize).to.be.equal('cover')
  })

  it('<image> resize="contain"', () => {
    const el = refs.contain
    expect(el.style.backgroundSize).to.be.equal('contain')
  })

  it('<image> resize="stretch"', () => {
    const el = refs.stretch
    expect(el.style.backgroundSize).to.contain('100%')
  })
})
