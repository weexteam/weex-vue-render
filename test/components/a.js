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

init('<a> component', (Vue, helper) => {
  const { utils } = helper
  const id = 'components.a'
  let vm, refs

  const spys = ['clickInnerDiv']

  before(() => {
    vm = helper.createVm('components.a', {
      spys
    })
    refs = vm.$refs
  })

  after(() => {
    helper.clear(id)
  })

  it('simple <a> component', () => {
    const el = refs.simple
    expect(el.tagName.toLowerCase()).to.equal('a')
    const classListArr = utils.toArray(el.classList)
    expect(classListArr).to.have.members(['weex-a', 'weex-ct'])
    expect(el.getAttribute('weex-type')).to.be.equal('a')
  })

  it('<a> with href', () => {
    const href = '//m.taobao.com'
    const el = refs.withHref
    expect(el.getAttribute('href')).to.be.equal(href)
  })

  it('<a> with children <div>', () => {
    const el = refs.withChildren
    expect(el.children.length).to.be.equal(1)
    expect(el.children[0].tagName).to.match(/^(?:html:)?div$/i)
    expect(el.children[0].getAttribute('weex-type')).to.be.equal('div')
  })

  it('click inner <div>', (done) => {
    location.hash = ''
    const div = refs.innerDiv
    helper.click(div, () => {
      expect(helper.getSpy(id, 'clickInnerDiv').callCount).to.equal(1)
      expect(location.hash).to.equal('')
      location.hash = ''
      done()
    })
  })

  it('click outside <a> with inner <div>', (done) => {
    location.hash = ''
    const el = refs.withChildren
    helper.click(el, () => {
      expect(location.hash).to.equal('#withChildren')
      location.hash = ''
      done()
    })
  })
})
