<script>
export default {
  name: 'router-ref',
  inject: ['router', 'route'],
  data() {
    return {
      history: this.router,
      location: this.history.location,
      match: this.route.match
    };
  },
  render() {
    return null;
  }
}
</script>
