import helper from '../main'

export const doneMixin = {
  methods: {
    done (subId = 'default', ...args) {
      const id = this.$root.$el.id
      const done = helper.data[id].done[subId]
      ; done(...args)
    }
  }
}
