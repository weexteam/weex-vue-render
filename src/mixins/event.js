import { insideA } from '../utils'

export default {
  methods: {
    $stopOutterA (e) {
      if (insideA(e.target)) {
        e.preventDefault()
      }
    },

    $stopPropagation (e) {
      e.stopPropagation()
    }
  }
}
