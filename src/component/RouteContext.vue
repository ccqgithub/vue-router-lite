<script>
export default {
  name: 'router-context',
  inject: ['router', 'route'],
  data() {
    return {
      history: this.router.history,
      location: this.route.location,
      match: this.route.match
    };
  },
  render() {
    return null;
  }
}
</script>
