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

RouterContext.install = function(Vue) {
  Vue.component(RouterContext.name, RouterContext);
}

export default RouterContext;
</script>
