<script>
import { Redirect } from 'vue-router-lite'

export default {
  components: {
    Redirect
  },
  props: {
    loggedIn: Boolean
  },
  render(h) {
    if (!this.loggedIn) {
      return h(
        'redirect', { 
          props: { to: '/' } 
        }
      )
    }
    return this.$slots.default
  }
}
</script>
