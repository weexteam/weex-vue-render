import helper from '../main'

export const spyMixin = {
  methods: {
    callSpy (spyName, ...args) {
      const id = this.$root.$el.id
      return helper.callSpy(id, spyName, ...args)
    },

    getSpys () {
      const id = this.$root.$el.id
      return helper.getSpys(id)
    },

    getSpy (spyName) {
      const id = this.$root.$el.id
      return helper.getSpy(id, spyName)
    }
  }
}
