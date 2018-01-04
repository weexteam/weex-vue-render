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
/*global Event*/
// import * as animations from '../../src/modules/animation'
import animation from '../../src/modules/animation'
import helper from '../helper/main'

const { isPhantom, dispatchEvent } = helper.utils
helper.initWithWeex(
  'animation module',
  { plugins: [animation] },
  () => {    
    let animationModule, el1, el2

    before(() => {
      el1 = document.createElement('div')
      el2 = document.createElement('div')
      el1.style.cssText = 'width:100px;height:100px;background-color:red;'
      el2.style.cssText = 'width:100px;height:100px;background-color:yellow;margin-top:100px;'
      document.body.appendChild(el1)
      document.body.appendChild(el2)
      animationModule = weex.requireModule('animation')
    })

    after(() => {
      el1.parentElement.removeChild(el1)
      el2.parentElement.removeChild(el2)
    })

    it('work for VComponent', (done) => {
      const { transition } = animationModule
      const config = {
        duration: 100,
        timingFunction: 'ease',
        delay: 100,
        styles: {
          position: 'absolute',
          'align-items': 'center',
          '-webkit-align-items': 'center',
          width: '100%',
          transform: 'translate(10px, 6px, 0)',
          'border-top-width': '1px',
          top: 0,
          'margin-left': '-10px'
        }
      }
      const el = el1
      const vnode = {
        $el: el
      }
      transition([vnode], config)
      const transitionValue = `all ${config.duration}ms ${config.timingFunction} ${config.delay}ms`
      setTimeout(() => {
        // ensure event dispatched in phantom
        if (isPhantom()) {
          dispatchEvent(el, 'transitionend')
        }
        setTimeout(() => {
          expect(el.style.transition).to.be.equal('')
          const cs = window.getComputedStyle(el)
          expect(el.style.position).to.be.equal(config.styles.position)
          expect(el.style.WebkitAlignItems).to.be.equal(config.styles['align-items'])
          expect(parseFloat(cs.marginLeft)).to.be.closeTo(-10 * weex.config.env.scale, 0.01)
          done()
        }, 25)
      }, 200)
      expect(el.style.transition).to.be.equal(transitionValue)
    })

    it('work for HTMLElement', (done) => {
      const { transition } = animationModule
      const config = {
        duration: 100,
        timingFunction: 'ease',
        delay: 100,
        styles: {
          'align-items': 'center',
          '-webkit-align-items': 'center',
          width: '100%',
          transform: 'translate(10px, 6px, 0)',
          'border-top-width': '1px',
          top: 0,
          'margin-left': '-10px'
        }
      }
      const el = el2
      transition(el, config)
      const transitionValue = `all ${config.duration}ms ${config.timingFunction} ${config.delay}ms`
      setTimeout(() => {
        // ensure event dispatched in phantom
        if (isPhantom()) {
          dispatchEvent(el, 'transitionend')
        }
        setTimeout(() => {
          expect(el.style.transition).to.be.equal('')
          const cs = window.getComputedStyle(el)
          expect(el.style.WebkitAlignItems).to.be.equal(config.styles['align-items'])
          expect(parseFloat(cs.marginLeft)).to.be.closeTo(-10 * weex.config.env.scale, 0.01)
          done()
        }, 25)
      }, 200)
      expect(el.style.transition).to.be.equal(transitionValue)
    })
  }
)
