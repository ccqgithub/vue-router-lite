<script>
import * as symbols from '../util/symbol';

const RouterContext = {
  name: 'RouterContext',
  inject: {
    router: { from: symbols.router },
    route: { from: symbols.route }
  },
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
};

export default RouterContext;
</script>
