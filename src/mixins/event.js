import { insideA } from '../utils'

export default {
  methods: {
    $stopOutterA (e) {
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
