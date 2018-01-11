<template>
  <div class="ct">
    <cmp-text ref="cmpText">this text should be just in one line and the overflowed text would be replaced with ellipsis...</cmp-text>
    <cmp-text ref="clickTxt" @click="clickTxt">bound @click</cmp-text>
    <cmp-text ref="nativeClickTxt" @click.native="nativeClickTxt">bound @click.native</cmp-text>
    <cmp-text-in-cmp ref="clickTxtInCmp" @click="clickTxt">bound on</cmp-text-in-cmp>
    <cmp-text-in-cmp ref="nativeClickTxtInCmp" @click.native="nativeClickTxt">bound nativeOn</cmp-text-in-cmp>
    <cmp-img ref="cmpImg"></cmp-img>
    <cmp-link ref="cmpLink" href="#cmp-link">
      <image ref="cmpLinkInnerImg" @click="imgClick" :src="img" class="img" resize="contain"/>
    </cmp-link>
    <cmp-link-img ref="cmpLinkImg"></cmp-link-img>
    <!-- <my-component v-for="(item, index) in items" :key="index">{{item}}</my-component> -->
  </div>
</template>

<script>
const img = '//img.alicdn.com/tfs/TB1OOl1SVXXXXc_XVXXXXXXXXXX-340-340.png'
const cmpText = {
  render (h) {
    return h('text', {
      style: {
        margin: '10px',
        width: '400px',
        border: '1px solid #ccc',
        backgroundColor: '#f7f7f7',
        lines: 1
      }
    }, this.$slots.default)
  }
}

export default {
  data () {
    return {
      t: 0,
      img,
      items: [1,2,3]
    }
  },
  components: {
    'cmp-text': cmpText,
    'cmp-img': {
      render (h) {
        return h('image', {
          class: ['img'],
          attrs: {
            src: img,
            resize: 'cover'
          }
        })
      }
    },
    'cmp-link': {
      render (h) {
        return h('a', this.$slots.default)
      }
    },
    'cmp-link-img': {
      render (h) {
        const _this = this
        return h('a', {
          class: ['cmp-link-img'],
          attrs: {
            href: '#cmp-link-img'
          },
          on: {
            appear: (e) => {
              _this.callSpy && _this.callSpy('appear', e)
            }
          }
        }, [h('image', {
          style: {
            width: '300px',
            height: '140px',
            margin: '10px',
            border: '1px solid #ccc'
          },
          on: {
            appear: (e) => {
              _this.callSpy && _this.callSpy('appear', e)
            },
            click: (e) => {
              _this.callSpy && _this.callSpy('click', e)
            }
          },
          attrs: {
            src: img,
            resize: 'cover'
          }
        })])
      }
    },
    'cmp-text-in-cmp': {
      render (h) {
        const _this = this
        return h(cmpText, {
          nativeOn: {
            click (e) {
              _this.callSpy && _this.callSpy('nativeClickTxt', e)
            }
          },
          on: {
            click (e) {
              _this.callSpy && _this.callSpy('clickTxt', e)
            }
          }
        }, this.$slots.default)
      }
    }
  },
  mounted () {
    setTimeout(() => {
      this.t = 1
    }, 1000)
  },
  methods: {
    imgClick (e) {
      this.callSpy && this.callSpy('click', e)
    },
    clickTxt (e) {
      this.callSpy && this.callSpy('clickTxt', e)
    },
    nativeClickTxt (e) {
      this.callSpy && this.callSpy('nativeClickTxt', e)
    }
  }
}
</script>

<style scoped>
.ct {
  align-items: center;
  justify-content: center;
}
.img {
  width: 300px;
  height: 140px;
  margin: 10px;
  border: 1px solid #ccc;
}
</style>
