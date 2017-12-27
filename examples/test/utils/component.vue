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
        this.callSpy('utils.component', 'appear', evt)
      },
      disappear: function (evt) {
        this.callSpy('utils.component', 'disappear', evt)
      }
    }
  }
</script>
