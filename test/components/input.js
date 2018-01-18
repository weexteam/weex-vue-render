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
import input from '../../src/components/input'

init('components input', (Vue, helper) => {

  const id = 'components.input'
  const spys = ['input', 'change']
  let vm, refs
  const { toArray } = helper.utils

  before(() => {
    vm = helper.createVm(id, {
      spys,
      plugins: [input]
    })
    refs = vm.$refs
  })

  after(() => {
    helper.clear(id)
  })

  describe('basic input behaviours', function () {
    it('<input> components.', function () {
      debugger
      expect(refs.txtInput.nodeName.toLowerCase()).to.equal('p')
      expect(refs.txtChange.nodeName.toLowerCase()).to.equal('p')
      expect(refs.inputText.$el.nodeName.toLowerCase()).to.equal('input')
      expect(toArray(refs.inputText.$el.classList)).include.members(['weex-input', 'weex-el'])
      expect(refs.inputText.$el.type.toLowerCase()).to.equal('text')
    })

    it('emit input events.', function (done) {
      const input = refs.inputText.$el
      helper.utils.once(input, 'input', function (e) {
        expect(e.target.value).to.be.equal('abc')
        done()
      })
      expect(input.value).to.equal('')
      input.value = 'abc'
      helper.utils.dispatchEvent(input, 'input')
    })

    it('emit change events.', function (done) {
      const input = refs.inputText.$el
      helper.utils.once(input, 'change', function (e) {
        expect(e.target.value).to.be.equal('def')
        done()
      })
      expect(input.value).to.equal('abc')
      input.value = 'def'
      helper.utils.dispatchEvent(input, 'change')
    })

    it('v-model for two way data binding', function (done) {
      const input = refs.vModelInput.$el
      const text = refs.vModelText
      const prevValue = 'two way binding value'
      const newValue = 'v-model works!'
      expect(input.value).to.equal(prevValue)
      expect(text.textContent).to.equal(prevValue)
      input.value = newValue
      helper.utils.dispatchEvent(input, 'input', function () {
        expect(text.textContent).to.equal(newValue)
        done()
      })
      expect(input.value).to.equal(newValue)
    })

    it('return key default', function (done) {
      const input = refs.inputReturnDefault.$el
      helper.utils.dispatchEvent(input, 'keyup', {
        keyCode: 13
      }, function () {
        expect(vm.txtReturnType === 'default')
        done()
      })
    })

    it('return key go', function (done) {
      const input = refs.inputReturnDefault.$el
      helper.utils.dispatchEvent(input, 'keyup', {
        keyCode: 13
      }, function () {
        expect(vm.txtReturnType === 'go')
        done()
      })
    })

    it('return key next', function (done) {
      const input = refs.inputReturnDefault.$el
      helper.utils.dispatchEvent(input, 'keyup', {
        keyCode: 13
      }, function () {
        expect(vm.txtReturnType === 'next')
        done()
      })
    })

    it('return key search', function (done) {
      const input = refs.inputReturnDefault.$el
      helper.utils.dispatchEvent(input, 'keyup', {
        keyCode: 13
      }, function () {
        expect(vm.txtReturnType === 'search')
        done()
      })
    })

    it('return key send', function (done) {
      const input = refs.inputReturnDefault.$el
      helper.utils.dispatchEvent(input, 'keyup', {
        keyCode: 13
      }, function () {
        expect(vm.txtReturnType === 'send')
        done()
      })
    })

    it('return key done', function (done) {
      const input = refs.inputReturnDefault.$el
      helper.utils.dispatchEvent(input, 'keyup', {
        keyCode: 13
      }, function () {
        expect(vm.txtReturnType === 'done')
        done()
      })
    })

    it('method focus', function (done) {
      const btn = refs.buttonFocus
      const ipt = refs.input1
      const focusSpy = sinon.spy(ipt, 'focus')
      helper.click(btn, function () {
        expect(focusSpy.callCount).to.equal(1)
        focusSpy.restore()
        done()
      })
    })

    it('method blur', function (done) {
      const btn = refs.buttonBlur
      const ipt = refs.input1
      const blurSpy = sinon.spy(ipt, 'blur')
      helper.click(btn, function () {
        expect(blurSpy.callCount).to.equal(1)
        blurSpy.restore()
        done()
      })
    })
  })
})
