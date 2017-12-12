<template>
  <!-- <div class="item" @click="handleTest"> -->
  <div class="item">
    <text class="txt">{{txt}}</text>
  </div>
</template>

<script>
export default {
  data () {
    return {
      txt: 'HELLO'
    }
  },
  mounted () {
    setTimeout(() => {
      this.$emit('tap')
      this.$emit('userDef', 'test')
      this.txt = 'HELLO WORLD!'
    }, 2000)
  },
}
</script>


<style scoped>
.item {
  background-color: yellow;
}
.txt {
  font-size: 64px;
}
</style>
