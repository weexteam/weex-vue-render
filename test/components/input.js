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

init('components input', (Vue, helper) => {

  let vm
  const id = 'test-components-input'
  let refs = {}

  before(() => {
    vm = helper.createVm(helper.bundles.components.input, id)
    refs = vm.$refs
    helper.genSpys(['input', 'change'])
  })

  after(() => {
    vm.$destroy()
    vm = null
    helper.clear(id)
  })

  describe('basic input behaviours', function () {
    it('should generate input elements.', function () {
      expect(refs.txtInput.nodeName.toLowerCase()).to.equal('p')
      expect(refs.txtChange.nodeName.toLowerCase()).to.equal('p')
      expect(refs.inputText.nodeName.toLowerCase()).to.equal('input')
      expect(refs.inputText.type.toLowerCase()).to.equal('text')
    })

    it('should emit input event.', function (done) {
      const input = refs.inputText
      helper.utils.once(input, 'input', function (e) {
        expect(e.target.value).to.be.equal('abc')
        // setTimeout(function () {
        //   expect(refs.txtInput.textContent).to.be.equal('abc')
        //   done()
        // }, 25)
        done()
      })
      expect(input.value).to.equal('')
      input.value = 'abc'
      helper.utils.dispatchEvent(input, 'input')
    })

    it ('should emit change event.', function (done) {
      const input = refs.inputText
      helper.utils.once(input, 'change', function (e) {
        expect(e.target.value).to.be.equal('def')
        // setTimeout(function () {
        //   expect(refs.txtInput.textContent).to.be.equal('def')
        //   done()
        // }, 25)
        debugger
        done()
      })
      console.log('input value:', input.value)
      expect(input.value).to.equal('abc')
      input.value = 'def'
      helper.utils.dispatchEvent(input, 'change')
    })
  })
})
