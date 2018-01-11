<template>
  <div ref="ct" class="ct">
    <image class="img" @load="loaded" ref="staticSrc" src="//img.alicdn.com/tfs/TB1OOl1SVXXXXc_XVXXXXXXXXXX-340-340.png" />
    <image class="img" @load="loaded" ref="bindingSrc" :src="img" />
    <image class="img" @load="placeholderLoad" ref="placeholder" src="//invalid.img" :placeholder="img" />
    <image class="img" ref="cover" resize="cover" src="//img.alicdn.com/tfs/TB1OOl1SVXXXXc_XVXXXXXXXXXX-340-340.png" />
    <image class="img" ref="contain" resize="contain" src="//img.alicdn.com/tfs/TB1OOl1SVXXXXc_XVXXXXXXXXXX-340-340.png" />
    <image class="img" ref="stretch" resize="stretch" src="//img.alicdn.com/tfs/TB1OOl1SVXXXXc_XVXXXXXXXXXX-340-340.png" />
  </div>
</template>

<script>
const img = '//img.alicdn.com/tfs/TB1OOl1SVXXXXc_XVXXXXXXXXXX-340-340.png'
const vueImg = '//img.alicdn.com/tfs/TB1.rOySVXXXXaKXXXXXXXXXXXX-400-400.png'
let cnt = 0
export default {
  data () {
    return { img }
  },
  updated () {
    this.done && this.done('updated')
  },
  methods: {
    loaded (evt) {
      this.callSpy && this.callSpy('loaded', evt)
      this.triggerUpdate()
    },
    placeholderLoad (evt) {
      this.callSpy && this.callSpy('placeholderLoad', evt)
      this.triggerUpdate()
    },
    triggerUpdate () {
      if (++cnt === 3) {
        this.img = vueImg
      }
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
  margin: 10px;
  border: 1px solid #333;
  width: 300px;
  height: 140px;
}
</style>
