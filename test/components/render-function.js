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

init('render function', (Vue, helper) => {
  const id = 'components.render-function'
  const { utils } = helper
  const spys = ['appear', 'click', 'clickTxt', 'nativeClickTxt']
  let vm, refs

  const content = 'this text should be just in one line and the overflowed text would be replaced with ellipsis...'

  before(() => {
    vm = helper.createVm(id, {
      spys
    })
    refs = vm.$refs
  })

  after(() => {
    helper.clear(id)
  })

  it('cmp-text in render function', () => {
    const { cmpText: vm } = refs
    const el = vm.$el
    expect(el instanceof HTMLElement).to.be.true
    expect(el.tagName.toLowerCase()).to.be.equal('p')
    expect(utils.toArray(el.classList)).to.include.members(['weex-el', 'weex-text'])
    expect(el.getAttribute('weex-type')).to.equal('text')
    const expectedStyles = {
      overflow: 'hidden',
      'text-overflow': 'ellipsis',
      '-webkit-line-clamp': 1
    }
    for (const k in expectedStyles) {
      expect(el.style[k]).to.be.equal(expectedStyles[k] + '')
    }
    expect(el.textContent).to.be.equal(content)
  })

  it('bound click with @click', (done) => {
    const { clickTxt: vm } = refs
    const el = vm.$el
    helper.click(el, () => {
      const spy = helper.getSpy(id, 'clickTxt')
      expect(spy.callCount).to.equal(0)
      done()
    })
  })

  it('bount click with @click.native', (done) => {
    const { nativeClickTxt: vm } = refs
    const el = vm.$el
    debugger
    helper.click(el, () => {
      const spy1 = helper.getSpy(id, 'clickTxt')
      expect(spy1.callCount).to.equal(0)
      const spy = helper.getSpy(id, 'nativeClickTxt')
      expect(spy.callCount).to.equal(1)
      const evt = spy.args[0][0]
      expect(evt.type).to.equal('weex$tap')
      expect(evt.target).to.equal(el)
      spy.reset()
      done()
    })
  })

  it('bound click with on', (done) => {
    const { clickTxtInCmp: vm } = refs
    const el = vm.$el
    helper.click(el, () => {
      const spy = helper.getSpy(id, 'clickTxt')
      const spy2 = helper.getSpy(id, 'nativeClickTxt')
      expect(spy.callCount).to.equal(0)
      expect(spy2.callCount).to.equal(1)
      const evt = spy2.args[0][0]
      expect(evt.type).to.equal('weex$tap')
      expect(evt.target).to.equal(el)
      spy2.reset()
      done()
    })
  })

  it('bount click with nativeOn', (done) => {
    const { nativeClickTxtInCmp: vm } = refs
    const el = vm.$el
    helper.click(el, () => {
      const spy1 = helper.getSpy(id, 'clickTxt')
      expect(spy1.callCount).to.equal(0)
      const spy = helper.getSpy(id, 'nativeClickTxt')
      expect(spy.callCount).to.equal(2)
      const evt1 = spy.args[0][0]
      const evt2 = spy.args[1][0]
      expect(evt1.type).to.equal('weex$tap')
      expect(evt2.type).to.equal('weex$tap')
      expect(evt1.target).to.equal(el)
      expect(evt2.target).to.equal(el)
      spy.reset()
      done()
    })
  })

  it('cmp-img in render function', () => {
    const { cmpImg: vm } = refs
    const el = vm.$el
    expect(el instanceof HTMLElement).to.be.true
    expect(el.tagName.toLowerCase()).to.be.equal('figure')
    expect(utils.toArray(el.classList)).to.include.members(['weex-el', 'weex-image'])
    expect(el.getAttribute('weex-type')).to.equal('image')
    expect(el.getAttribute('resize')).to.equal('cover')
    expect(el.style['background-size']).to.equal('cover')
  })

  it('cmp-link in render function', (done) => {
    const { cmpLink, cmpLinkInnerImg } = refs
    const a = cmpLink.$el
    const innerImg = cmpLinkInnerImg
    expect(a instanceof HTMLElement).to.be.true
    expect(a.tagName.toLowerCase()).to.be.equal('a')
    expect(utils.toArray(a.classList)).to.include.members(['weex-ct', 'weex-a'])
    expect(a.getAttribute('weex-type')).to.be.equal('a')
    expect(a.getAttribute('href')).to.be.equal('#cmp-link')
    expect(innerImg instanceof HTMLElement).to.be.true
    expect(innerImg.tagName.toLowerCase()).to.be.equal('figure')
    expect(utils.toArray(innerImg.classList)).to.include.members(['weex-el', 'weex-image'])
    expect(innerImg.getAttribute('weex-type')).to.equal('image')
    expect(innerImg.getAttribute('resize')).to.equal('contain')
    expect(innerImg.style['background-size']).to.equal('contain')

    window.location.hash = ''
    helper.click(innerImg, () => {
      expect(window.location.hash).to.equal('')
      const clickSpy = helper.getSpy(id, 'click')
      expect(clickSpy.callCount).to.be.equal(1)
      const evt = clickSpy.args[0][0]
      expect(evt.type).to.be.equal('weex$tap')
      expect(evt.target).to.be.equal(innerImg)
      helper.click(a, () => {
        expect(window.location.hash).to.equal('#cmp-link')
        window.location.hash = ''
        done()
      })
    })
  })

  it('cmp-link-img in render function', (done) => {
    const { cmpLinkImg } = refs
    const a = cmpLinkImg.$el
    const img = a.firstElementChild
    const imgSize = {
      width: 300,
      height: 140,
      margin: 10
    }
    expect(a instanceof HTMLElement).to.be.true
    expect(a.tagName.toLowerCase()).to.be.equal('a')
    expect(utils.toArray(a.classList)).to.include.members(['weex-ct', 'weex-a'])
    expect(a.getAttribute('weex-type')).to.be.equal('a')
    expect(a.getAttribute('href')).to.be.equal('#cmp-link-img')
    expect(img instanceof HTMLElement).to.be.true
    expect(img.tagName.toLowerCase()).to.be.equal('figure')
    for (const k in imgSize) {
        expect(imgSize[k] * weex.config.env.scale).to.be
          .closeTo(parseFloat(img.style[k]) * weex.config.env.rem, 0.05)
    }
    expect(utils.toArray(img.classList)).to.include.members(['weex-el', 'weex-image'])
    expect(img.getAttribute('weex-type')).to.equal('image')
    expect(img.getAttribute('resize')).to.equal('cover')
    expect(img.style['background-size']).to.equal('cover')

    window.location.hash = ''
    helper.click(img, () => {
      expect(window.location.hash).to.equal('')
      const clickSpy = helper.getSpy(id, 'click')
      expect(clickSpy.callCount).to.be.equal(2)
      const evt = clickSpy.args[1][0]
      expect(evt.type).to.be.equal('weex$tap')
      expect(evt.target).to.be.equal(img)
      helper.click(a, () => {
        expect(window.location.hash).to.equal('#cmp-link-img')
        window.location.hash = ''
        done()
      })
    })
  })

  it('should bind appear events', () => {
    const { cmpLinkImg } = refs
    const a = cmpLinkImg.$el
    const img = a.firstElementChild
    ; [a, img].forEach((elm) => {
      expect(elm.getAttribute('data-evt-appear')).to.equal('')
      expect(elm.getAttribute('weex-appear')).to.equal('')
    })
    const appearSpy = helper.getSpy(id, 'appear')
    expect(appearSpy.callCount).to.be.equal(2)
    const evts = appearSpy.args.map(arg => {
      const evt = arg[0]
      expect(evt.type).to.be.equal('appear')
      return evt
    })
    expect(evts[0].target).to.be.equal(a)
    expect(evts[1].target).to.be.equal(img)
  })
})
