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
import _switch from '../../src/components/switch'

init('<switch> component', (Vue, helper) => {
  const id = 'components.switch'
  const spys = ['change']
  const { utils, click } = helper
  const { toArray } = utils
  let vm, refs

  before(() => {
    vm = helper.createVm(id, {
      spys,
      plugins: [_switch]
    })
    refs = vm.$refs
  })

  after(() => {
    helper.clear(id)
  })

  it('simple <switch> component', () => {
    const el = refs.simple.$el
    expect(el.tagName.toLowerCase()).to.be.equal('span')
    expect(utils.toArray(el.classList)).to.include.members(
      ['weex-switch', 'weex-el']
    )
  })

  it('disabled <switch>', () => {
    const disabled = refs.disabled.$el
    const disabledChecked = refs.disabledChecked.$el
    expect(toArray(disabled.classList)).to.include.members(
      ['weex-switch-disabled', 'weex-switch', 'weex-el']
    )
    expect(toArray(disabledChecked.classList)).to.include.members(
      ['weex-switch-disabled', 'weex-switch', 'weex-el', 'weex-switch-checked']
    )
  })

  it('checked <switch>', () => {
    const checked = refs.checked.$el
    expect(toArray(checked.classList)).to.include.members(
      ['weex-switch-checked', 'weex-switch', 'weex-el']
    )
  })

  it('toggle <switch>', () => {
    const vm = refs.simple
    expect(vm.isChecked).to.not.be.true
    vm.toggle()
    expect(vm.isChecked).to.be.true
    vm.toggle()
    expect(vm.isChecked).to.not.be.true
  })

  it('toggle disabled <switch>', () => {
    const vm = refs.disabled
    vm.isDisabled = true
    expect(vm.isChecked).to.not.be.true
    vm.toggle()
    expect(vm.isChecked).to.not.be.true
  })

  it('emit change events.', (done) => {
    const change = refs.change.$el
    const info = refs.changeInfo
    const spy = helper.getSpy(id, 'change')
    expect(spy.callCount).to.equal(0)
    expect(info.textContent).to.equal('false')
    click(change, function () {
      expect(spy.callCount).to.equal(1)
      expect(spy.args[0][0]).to.equal(true)
      expect(info.textContent).to.equal('true')
      spy.reset()
      click(change, function () {
        expect(spy.callCount).to.equal(1)
        expect(spy.args[0][0]).to.equal(false)
        expect(info.textContent).to.equal('false')
        done()
      })
    })
  })
})
