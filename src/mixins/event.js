import { insideA } from '../utils'

export default {
  methods: {
    // deprecated.
    $stopOutterA (e) {
      return this.$stopOuterA(e)
    },

    $stopOuterA (e) {
      if (e && e.preventDefault && e.target) {
        if (insideA(e.target)) {
          e.preventDefault()
        }
      }
    },

    $stopPropagation (e) {
      if (e && e.stopPropagation) {
        e.stopPropagation()
      }
    }
  }
}
