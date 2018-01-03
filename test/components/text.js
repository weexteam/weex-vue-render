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

init('<text> component', (Vue, helper) => {
  const id = 'components.text'
  const { utils } = helper
  let vm, refs

  before(() => {
    vm = helper.createVm(id)
    refs = vm.$refs
  })

  after(() => {
    helper.clear(id)
  })

  it('simple <text>', () => {
    const { simple: simpleText } = refs
    expect(simpleText instanceof HTMLElement).to.be.true
    expect(simpleText.tagName.toLowerCase()).to.be.equal('p')
    expect(simpleText.textContent).to.be.equal('simple text')
    expect(utils.toArray(simpleText.classList))
      .to.include.members(['weex-el', 'weex-text', 'txt'])
  })

  it('empty <text>', () => {
    const { empty: emptyText } = refs
    expect(emptyText instanceof HTMLElement).to.be.true
    expect(emptyText.tagName.toLowerCase()).to.be.equal('p')
    expect(emptyText.textContent).to.be.equal('')
  })

  it('<text> with \'lines: 1\'', () => {
    const { lines: line1Text } = refs
    expect(line1Text instanceof HTMLElement).to.be.true
    expect(line1Text.tagName.toLowerCase()).to.be.equal('p')
    expect(utils.toArray(line1Text.classList))
      .to.include.members(['weex-el', 'weex-text', 'txt', 'lines'])
    const cs = getComputedStyle(line1Text)
    expect(cs.overflow).to.be.equal('hidden')
    expect(cs.WebkitLineClamp).to.be.equal('1')
    expect(cs.textOverflow).to.be.equal('ellipsis')
  })
})
