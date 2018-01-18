<template>
  <div>
    <div class="switch-ct">
      <text class="label">simple</text>
      <switch ref="simple"></switch>
    </div>
    <div class="switch-ct">
      <text class="label">checked</text>
      <switch ref="checked" checked="true"></switch>
    </div>
    <div class="switch-ct">
      <text class="label">disabled</text>
      <switch ref="disabledChecked" disabled="true" checked="true"></switch>
      <switch ref="disabled" disabled="true"></switch>
    </div>
    <div class="switch-ct">
      <text class="label">onchange</text>
      <switch ref="change" @change="onchange"></switch>
      <text ref="changeInfo" class="info">{{checked}}</text>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        checked: false
      }
    },
    methods: {
      onchange (event) {
        console.log(`onchage, value: ${event.value}`)
        this.checked = event.value
        this.callSpy && this.callSpy('change', event.value)
      }
    }
  }
</script>

<style scoped>
  .switch-ct {
    flex-direction: row;
    justify-content: flex-start;
    margin-top: 60px;
  }
  .label {
    font-size: 40px;
    line-height: 60px;
    width: 350px;
    color: #666;
    text-align: right;
    margin-right: 20px;
  }
  .info {
    font-size: 30px;
    line-height: 60px;
    color: #BBB;
    margin-left: 10px;
  }
</style>