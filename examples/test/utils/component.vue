<template>
  <div>
    <foo @appear="appear" @disappear="disappear"></foo>
  </div>
</template>

<script>
  module.exports = {
    components: {
      foo: require('./component-foo.vue')
    },
    methods: {
      appear: function (evt) {
        this.callSpy('appear', evt)
      },
      disappear: function (evt) {
        this.callSpy('disappear', evt)
      }
    }
  }
</script>
