<script>
export default {
  inject: ['router', 'route'],
  data() {
    return {
      history: this.router,
      location: this.history.location,
      match: this.route.match
    };
  }
}
</script>
