<template>
  <div class="ct">
    <xText ref="txt1" class="txt lines2">this text should be just in 2 lines and the overflowed text would be replaced with ellipsis...</xText>
    <xText ref="txt2" class="txt" style="lines:2;">this text should be just in 2 lines and the overflowed text would be replaced with ellipsis...</xText>
    <xText @click.native="nativeClick" ref="nativeClickTxt" class="txt">binding @click.native</xText>
    <xText @click="click" ref="clickTxt" class="txt">binding @click</xText>
    <xImage class="img" ref="img1" resize="cover"></xImage>
    <xImage class="img" ref="img2" resize="contain"></xImage>
    <xImage class="img" ref="img3" :resize="resize"></xImage>
  </div>
</template>

<script>
export default {
  data () {
    return {
      resize: 'stretch'
    }
  },
  updated () {
    this.done && this.done('updated')
  },
  components: {
    xText: require('./xText.vue'),
    xImage: require('./xImage.vue')
  },
  methods: {
    nativeClick (e) {
      setTimeout(() => {
        this.resize = 'cover'
      }, 400)
      this.callSpy && this.callSpy('nativeClick', e)
    },
    click (e) {
      this.callSpy && this.callSpy('click', e)
    }
  }
}
</script>

<style scoped>
.ct {
  align-items: center;
  justify-content: center;
}
.txt {
  font-size: 42px;
  margin-bottom: 20px;
}
.lines2 {
  lines: 2;
}
.img {
  margin-bottom: 20px;
}
</style>
