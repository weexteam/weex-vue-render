<template>
  <scroller>
    <video class="video" @pause="onpause" @start="onstart" @finish="onfinish" @fail="onfail"
      controls="true"
      :src="src"
      auto-play="true" :playStatus="playStatus">
    </video>
    <div style="flex-direction: row; justify-content: center;">
      <button value="Pause" @click.native="pause"></button>
      <button value="Play" @click.native="play" type="primary" style="margin-left:20px;"></button>
    </div>
  </scroller>
</template>

<style scoped>
  .video {
    width: 750px;
    height: 460px;
    margin-bottom: 80px;
  }
</style>

<script>
  var modal = weex.requireModule('modal')
  const src = 'http://a.invalid/video.mp4'
  const newSrc = 'http://g.tbcdn.cn/ali-wireless-h5/res/0.0.6/toy.mp4'
  module.exports = {
    data: function () {
      return {
        src,
        playStatus: 'play'
      }
    },
    mounted () {
      setTimeout(() => {
        this.src = newSrc
      }, 1000)
    },
    components: {
      button: require('../include/button.vue')
    },
    methods: {
      pause: function() {
        this.playStatus = 'pause'
        modal.toast({ 'message': 'click pause' })
      },
      play: function() {
        this.playStatus = 'play'
        modal.toast({ 'message': 'click play' })
      },
      onpause: function(e) {
        this.playStatus = e.playStatus
        modal.toast({ 'message': 'video pause' })
      },
      onplay: function (e) {
        this.playStatus = e.playStatus
        modal.toast({ 'message': 'video play' })
      },
      onstart: function(e) {
        this.playStatus = e.playStatus
        modal.toast({ 'message': 'video start' })
      },
      onfinish: function(e) {
        this.playStatus = e.playStatus
        modal.toast({ 'message': 'video finish' })
      },
      onfail: function(e) {
        this.playStatus = e.playStatus
        modal.toast({ 'message': 'video fail' })
      }
    }
  };
</script>
