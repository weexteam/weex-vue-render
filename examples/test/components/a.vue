<template>
  <div>
    <a ref="simple" href="#simple">
      <text>SIMPLE A</text>
    </a>
    <a ref="withHref" href="//m.taobao.com">
      <text>taobao</text>
    </a>
    <a ref="withChildren" href="#withChildren">
      <div ref="innerDiv" @click="clickInnerDiv">
        <text>A WITH CHILDREN...</text>
      </div>
    </a>
  </div>
</template>

<script>
export default {
  methods: {
    clickInnerDiv () {
      this.callSpy && this.callSpy('clickInnerDiv')
    }
  }
}
</script>
