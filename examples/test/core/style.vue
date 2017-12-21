<template>
  <div>
    <div ref="ct" class="ct">
      <text ref="txt" class="txt" :style="textStyle">HELLO</text>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      textStyle: {
        color: 'red',
        backgroundColor: 'green',
        'line-height': '100px'
      }
    }
  }
}
</script>

<style scoped>
.ct {
  width: 750px;
  height: 400px;
  background-color: #f7f7f7;
}
.txt {
  font-size: 32px;
}
</style>
