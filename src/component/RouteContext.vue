<script>
const RouterContext = {
  name: 'RouterContext',
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

export default RouterContext;
</script>
