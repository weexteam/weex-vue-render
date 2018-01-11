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
import * as event from '../../src/utils/event'
describe('utils', function () {
  describe('event', function () {
    it('createEvent', () => {
      const {
        createEvent
      } = event
      const clickEvent = createEvent('', 'click')
      expect(createEvent).to.be.a('function')
      expect(clickEvent.type).to.be.equal('click')
      const target = clickEvent.target
      expect(target === '' || target === null).to.be.true
    })

    it('createBubblesEvent', () => {
      const {
        createBubblesEvent
      } = event
      const clickEvent = createBubblesEvent('', 'click')
      expect(createBubblesEvent).to.be.a('function')
      expect(clickEvent.type).to.be.equal('click')
      const target = clickEvent.target
      expect(target === '' || target === null).to.be.true
      expect(clickEvent.bubbles).to.be.true
    })

    it('createCustomEvent', () => {
      const {
        createCustomEvent
      } = event
      const customEvent = createCustomEvent('', 'customEvent')
      expect(createCustomEvent).to.be.a('function')
      expect(customEvent.type).to.be.equal('customEvent')
      const target = customEvent.target
      expect(target === '' || target === null).to.be.true
    })

    it('dispatchNativeEvent', (done) => {
      debugger
      const {
        dispatchNativeEvent
      } = event
      expect(dispatchNativeEvent).to.be.a('function')
      const node = document.createElement('div')
      const shouldBe = 'test'
      document.body.appendChild(node)
      node.addEventListener('click', (e) => {
        expect(e.shouldBe).to.be.equal(shouldBe)
        document.body.removeChild(node)
        done()
      })
      dispatchNativeEvent(node, 'click', { shouldBe })
    })

    it('mapFormEvents', () => {
      const {
        mapFormEvents
      } = event
      const context = {
        $el: {
          value: 'test'
        },
        $emit: () => {}
      }
      const map = mapFormEvents(context)
      const evt = { type: 'input' }
      map.input(evt)
      expect(evt.value).to.equal(context.$el.value)
    })
  })
})
