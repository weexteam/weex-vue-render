import helper from '../main'

export const spyMixin = {
  methods: {
    callSpy (id, spyName, ...args) {
      return helper.callSpy(id, spyName, ...args)
    },

    getSpys (id) {
      return helper.getSpys(id)
    },

    getSpy (id, spyName) {
      return helper.getSpy(id, spyName)
    }
  }
}
