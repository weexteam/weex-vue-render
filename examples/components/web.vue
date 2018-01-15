<template>
  <div class="wrapper">
    <div class="toolbar" append="tree">
      <button type="primary" size="small" value="back"
        style="margin-left:30px;width:210px; margin-top:5px; margin-bottom:5px"
        @click.native="goback"></button>
      <button type="primary" size="small" value="forward"
        style="margin-left:30px;width:210px; margin-top:5px; margin-bottom:5px"
        @click.native="goforward"></button>
      <button type="primary" size="small" value="refresh"
        style="margin-left:30px;width:210px; margin-top:5px; margin-bottom:5px"
        @click.native="refresh"></button>
    </div>
    <web class="content" ref="webview" :src="src"
      @pagestart="startload" @pagefinish="finishload" @error="failload"></web>
  </div>
</template>

<script>
  var webview = weex.requireModule('webview');
  const src = 'http://invalid.src/for/test'
  const newSrc = 'http://m.taobao.com'
  module.exports = {
    data () {
      return {
        src
      }
    },
    components: {
      button: require('../include/button.vue')
    },
    mounted () {
      setTimeout(() => {
        this.src = newSrc
      }, 1000)
    },
    methods: {
      goback: function() {
        var el = this.$refs.webview
        webview.goBack(el)
      },
      goforward: function() {
        var el = this.$refs.webview
        webview.goForward(el)
      },
      refresh: function() {
        var el = this.$refs.webview
        webview.reload(el)
      },
      startload: function(e) {
        console.log('start load!', e.type, e)
      },
      finishload: function(e) {
        console.log('finish load!', e.type, e)
      },
      failload: function(e) {
        console.log('falied load!', e.type, e)
      }
    }
  }
</script>

<style scoped>
  .wrapper {
    width: 750;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
  .content {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin-top: 0;
    margin-bottom: 70;
  }
  .toolbar {
    z-index: 999;
    flex-direction: row;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 70;
  }
</style>
