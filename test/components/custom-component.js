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

init('custom component', (Vue, helper) => {
  const id = 'components.custom-component'
  const { utils } = helper
  const spys = ['click', 'nativeClick']
  let vm, refs

  const content = 'this text should be just in 2 lines and the overflowed text would be replaced with ellipsis...'

  before(() => {
    vm = helper.createVm(id, {
      spys
    })
    refs = vm.$refs
  })

  after(() => {
    helper.clear(id)
  })

  it('x-text scoped style lines', () => {
    const { txt1: cmp } = refs
    expect(cmp instanceof weex.__vue__).to.be.true
    const el = cmp.$el
    expect(el.tagName.toLowerCase()).to.be.equal('p')
    expect(el.textContent).to.be.equal(content)
    expect(utils.toArray(el.classList))
      .to.include.members(['weex-el', 'weex-text', 'x-txt', 'txt', 'lines2'])
  })

  it('x-text inline style lines', () => {
    const { txt2: cmp } = refs
    expect(cmp instanceof weex.__vue__).to.be.true
    const el = cmp.$el
    expect(el.tagName.toLowerCase()).to.be.equal('p')
    expect(el.textContent).to.be.equal(content)
    expect(el.style.overflow).to.be.equal('hidden')
    expect(el.style.textOverflow).to.be.equal('ellipsis')
    expect(el.style.WebkitLineClamp).to.be.equal('2')
    expect(utils.toArray(el.classList))
      .to.include.members(['weex-el', 'weex-text', 'x-txt', 'txt'])
  })

  it('x-text bound with @click', (done) => {
    const { clickTxt } = refs
    const el = clickTxt.$el
    helper.click(el, () => {
      const spy = helper.getSpy(id, spys[0])
      expect(spy.callCount).to.equal(0)
      done()
    })
  })

  it('x-text bound with @click.native', (done) => {
    const { nativeClickTxt } = refs
    const el = nativeClickTxt.$el
    helper.click(el, () => {
      const spy = helper.getSpy(id, spys[1])
      expect(spy.callCount).to.equal(1)
      expect(spy.args[0][0].target).to.equal(el)
      done()
    })
  })

  it('x-image resize cover', () => {
    const { img1: cmp } = refs
    expect(cmp instanceof weex.__vue__).to.be.true
    const el = cmp.$el
    expect(el.tagName.toLowerCase()).to.be.equal('figure')
    expect(el.getAttribute('resize')).to.be.equal('cover')
    expect(el.style.backgroundSize).to.be.equal('cover')
    expect(utils.toArray(el.classList))
      .to.include.members(['weex-el', 'weex-image', 'x-image', 'img'])
  })

  it('x-image resize contain', () => {
    const { img2: cmp } = refs
    expect(cmp instanceof weex.__vue__).to.be.true
    const el = cmp.$el
    expect(el.tagName.toLowerCase()).to.be.equal('figure')
    expect(el.getAttribute('resize')).to.be.equal('contain')
    expect(el.style.backgroundSize).to.be.equal('contain')
    expect(utils.toArray(el.classList))
      .to.include.members(['weex-el', 'weex-image', 'x-image', 'img'])
  })

  it('x-image binding resize & udpate resize', (done) => {
    const { img3: cmp } = refs
    expect(cmp instanceof weex.__vue__).to.be.true
    const el = cmp.$el
    expect(el.tagName.toLowerCase()).to.be.equal('figure')
    expect(el.getAttribute('resize')).to.be.equal('stretch')
    expect(el.style.backgroundSize).to.be.match(/^100%(?: ?100%)?$/)
    expect(utils.toArray(el.classList))
      .to.include.members(['weex-el', 'weex-image', 'x-image', 'img'])
    helper.registerDone(id, 'updated', (callback) => {
      expect(el.style.backgroundSize).to.be.equal('cover')
      callback(done)
    })
  })
})
