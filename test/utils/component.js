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
import { init } from '../helper'
import * as components from '../../src/utils/component'

init('utils component', (Vue, helper) => {

  const id = 'utils.component'
  const spys = ['appear', 'disappear']
  let vm

  before(() => {
    vm = helper.createVm(id, { spys })
  })

  after(() => {
    helper.clear(id)
  })

  it('getParentScroller', () => {
    const { getParentScroller } = components
    expect(getParentScroller).to.be.a('function')
    expect(getParentScroller(vm)).to.equal(document.body)
  })

  it('contains', () => {
    const { contains } = components
    const ct = document.createElement('div')
    ct.id = 'contains_ct'
    const target = document.createElement('div')
    target.id = 'contains_target'
    ct.appendChild(target)
    expect(contains(ct, target)).to.be.true
    expect(contains(target, ct)).to.be.false
    expect(contains(ct, ct)).to.be.false
    expect(contains(ct, ct, true)).to.be.true
    const sibling = document.createElement('div')
    sibling.id = 'contains_sibling'
    ct.appendChild(sibling)
    expect(contains(ct, sibling)).to.be.true
    expect(contains(target, sibling)).to.be.false
    expect(contains(sibling, target)).to.be.false
  })

  it('watchAppear', function (done) {
    const subId = 'watchAppear'
    helper.registerDone(id, subId, callback => {
      const appearSpy = helper.getSpy(id, spys[0])
      const disappearSpy = helper.getSpy(id, spys[1])
      expect(appearSpy.callCount).to.equal(2)
      expect(disappearSpy.callCount).to.equal(1)
      expect(appearSpy.args[0][0].type).to.equal('appear')
      expect(appearSpy.args[1][0].type).to.equal('appear')
      expect(disappearSpy.args[0][0].type).to.equal('disappear')
      expect(appearSpy.args[0][0].direction).to.not.exist
      expect(appearSpy.args[1][0].direction).to.not.exist
      expect(disappearSpy.args[0][0].direction).to.not.exist
      setTimeout(() => {
        callback(done)
      }, 100)
    })
  })
})
