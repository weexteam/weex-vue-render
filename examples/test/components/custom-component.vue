<template>
  <div class="ct">
    <xText ref="txt1" class="txt lines2">this text should be just in 2 lines and the overflowed text would be replaced with ellipsis...</xText>
    <xText ref="txt2" class="txt" style="lines:2;">this text should be just in 2 lines and the overflowed text would be replaced with ellipsis...</xText>
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
  mounted () {
    setTimeout(() => {
      this.resize = 'cover'
    }, 400)
  },
  components: {
    xText: require('./xText.vue'),
    xImage: require('./xImage.vue')
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
