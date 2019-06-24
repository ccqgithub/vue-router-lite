<script>
export default {
  name: 'router-ref',
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
