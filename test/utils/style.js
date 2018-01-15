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
import {
  supportHairlines,
  supportSticky,
  addTransform,
  px2rem
} from '../../src/utils/style'
import {
  init
} from '../../src/weex/viewport'

function trimSpace (str) {
  return str.replace(/\s/g, '')
}

describe('style', function () {
  const rect = document.documentElement.getBoundingClientRect()
  const info = {}
  const {
    scale
  } = init()

  it('check if support hairlines', () => {
    const supported = supportHairlines()
    // phantomjs didn't support using 0.5px to paint 1px width border
    expect(typeof supported).to.equal('boolean')
  })

  it('should support stick style', () => {
    // phantomjs support stick true
    expect(supportSticky()).to.be.true
  })

  it('px2rem', () => {
    const str = '75px'
    const res = px2rem(str, 75)
    expect(res).to.equal('1rem')
  })

  it('support wx for px2rem', () => {
    const str = '100wx'
    const val = parseFloat(str)
    const res = px2rem(str, 75)
    expect(res).to.equal('100px')
  })
})

describe('transform', () => {
  describe('should add translate style to the element', () => {
    const style = {
      translate: 'translate3d(2px, 2px, 2px)',
      rotate: 'rotate(30deg)'
    }
    const nodeStyle = {
      translate: 'translate3d(5px, 5px, 5px)',
      scale: 'scale(0.5)',
      rotate: 'rotate(50deg)'
    }
    let node = null
    beforeEach(() => {
      node = document.createElement('div')
      node.style.transform = nodeStyle.translate + ' ' + nodeStyle.scale + ' ' + nodeStyle.rotate
      node.style.webkitTransform = nodeStyle.translate + ' ' + nodeStyle.scale + ' ' + nodeStyle.rotate
    })
    it('should inherit transform properties from element', () => {
      addTransform(node, style, false)
      expect(trimSpace(node.style.transform)).to.be.equal(
        trimSpace(style.translate + nodeStyle.scale + style.rotate))
      // webkitTransform will remove last whitespace automatically
      expect(trimSpace(node.style.webkitTransform)).to.be.equal(
        trimSpace(style.translate + nodeStyle.scale + style.rotate)
      )
    })
    it('should replace all transform properties', () => {
      addTransform(node, style, true)
      expect(trimSpace(node.style.transform)).to.be.equal(
        trimSpace(style.translate + style.rotate))
      // webkitTransform will remove last whitespace automatically
      expect(trimSpace(node.style.webkitTransform)).to.be.equal(
        trimSpace(style.translate + style.rotate))
    })
  })
  // describe('should add translate X to the element', () => {
  //   const nodeStyle = {
  //     translate: 'translate3d(5px, 5px, 5px)',
  //     scale: 'scale(0.5)',
  //     rotate: 'rotate(50deg)'
  //   }
  //   let node = null
  //   beforeEach(() => {
  //     node = document.createElement('div')
  //     // node.style.transform = nodeStyle.translate+' '+nodeStyle.scale+' '+ nodeStyle.rotate
  //     // node.style.webkitTransform = nodeStyle.translate+' '+nodeStyle.scale+' '+ nodeStyle.rotate
  //   })
  //   it('should element has translate property', () => {
  //     const toAdd = 2
  //     const translateReg = /[+-\d.]+[pw]x/
  //     const translateReplaceFunction = ($0) => {
  //       return (parseFloat($0) + toAdd) + 'px'
  //     }
  //     node.style.transform = nodeStyle.translate + ' ' + nodeStyle.scale + ' ' + nodeStyle.rotate
  //     node.style.webkitTransform = nodeStyle.translate + ' ' + nodeStyle.scale + ' ' + nodeStyle.rotate
  //     addTranslateX(node, toAdd)
  //     // webkitTransform will reserved whitespace between translate value but transform will not.
  //     expect(trimSpace(node.style.transform)).to.be.equal(
  //       trimSpace(nodeStyle.translate.replace(translateReg, translateReplaceFunction)
  //       + nodeStyle.scale
  //       + nodeStyle.rotate))
  //     // webkitTransform will remove last whitespace automatically
  //     expect(trimSpace(node.style.webkitTransform)).to.be.equal(
  //       trimSpace(nodeStyle.translate.replace(translateReg, translateReplaceFunction)
  //       + nodeStyle.scale
  //       + nodeStyle.rotate))
  //   })
  //   it('should element does not have translate property', () => {
  //     const toAdd = 2
  //     const translateReg = /[+-\d.]+[pw]x/
  //     const translateReplaceFunction = ($0) => {
  //       return (parseFloat($0) + toAdd) + 'px'
  //     }
  //     const defaultTranslate = 'translate3d(0px, 0px, 0px)'
  //     node.style.transform = nodeStyle.scale + ' ' + nodeStyle.rotate
  //     node.style.webkitTransform = nodeStyle.scale + ' ' + nodeStyle.rotate
  //     addTranslateX(node, toAdd)
  //     // transform will reserved whitespace when translate on the last position.
  //     expect(trimSpace(node.style.transform)).to.be.equal(
  //       trimSpace(nodeStyle.scale + nodeStyle.rotate + defaultTranslate.replace(translateReg, translateReplaceFunction)))
  //     // webkitTransform will remove last whitespace automatically
  //     expect(trimSpace(node.style.webkitTransform)).to.be.equal(
  //       trimSpace(nodeStyle.scale + nodeStyle.rotate + defaultTranslate.replace(translateReg, translateReplaceFunction)))
  //   })
  //   it('should elemet remain', () => {
  //     const toAdd = 0
  //     node.style.transform = nodeStyle.scale + ' ' + nodeStyle.rotate
  //     node.style.webkitTransform = nodeStyle.scale + ' ' + nodeStyle.rotate
  //     addTranslateX(node, toAdd)
  //     expect(trimSpace(node.style.transform)).to.be.equal(
  //       trimSpace(nodeStyle.scale + nodeStyle.rotate))
  //     expect(trimSpace(node.style.webkitTransform)).to.be.equal(
  //       trimSpace(nodeStyle.scale + nodeStyle.rotate)
  //     )
  //   })
  // })
})

// describe('autoPrefix', () => {
//   const style = {
//     width: '200px',
//     flexDirection: 'row',
//     flex: 1,
//     transform: 'translate3d(100px, 100px, 0)'
//   }
//   it('should add prefix for styles.', () => {
//     const res = autoPrefix(style)
//     const {
//       WebkitBoxDirection,
//       WebkitBoxOrient,
//       WebkitFlexDirection,
//       flexDirection,
//       WebkitTransform,
//       transform,
//       width
//     } = res
//     expect(WebkitBoxDirection).to.equal('normal')
//     expect(WebkitBoxOrient).to.equal('horizontal')
//     expect(WebkitFlexDirection).to.equal('row')
//     expect(flexDirection).to.equal('row')
//     expect(WebkitTransform).to.equal('translate3d(100px, 100px, 0)')
//     expect(transform).to.equal('translate3d(100px, 100px, 0)')
//     expect(width).to.equal('200px')
//   })
// })
