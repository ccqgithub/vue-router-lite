<script>
import { assert, isNotTextNode } from '../util/utils';
import matchPath from '../util/matchPath';

const Route = {
  name: 'route',
  
  props: {
    path: {
      type: [String, Array],
      default: ''
    },
    exact: {
      type: Boolean,
      default: false
    },
    strict: {
      type: Boolean,
      default: false
    },
    sensitive: {
      type: Boolean,
      default: true
    },
    keepAlive: {
      type: [Boolean, Object],
      default: false
    },
    forceRender: {
      type: Boolean,
      default: false
    }
  },

  inject: ['router', 'route'],

  provide() {
    return {
      route: this.computedRoute
    }
  },

  created() {
    assert(
      this.router,
      `You should not use <route> outside a <router>.`
    );
  },

  beforeUpdate() {
    assert(
      this.router,
      `You should not use <route> outside a <router>.`
    );
  },

  computed: {
    computedLocation() {
      const computedLocation = this.router.history.location;
      return computedLocation;
    },
    computedRoute() {
      const { path, strict, exact, sensitive, route } = this;
      const pathname = this.computedLocation.pathname;
      const match = path ? 
        matchPath(
          pathname,
          { path, strict, exact, sensitive }
        ) : route.match;

      return { match };
    },
    keepAliveOptions() {
      if (!this.keepAlive) return { include: [] };
      if (typeof this.keepAlive === 'boolean') {
        return {};
      }
      return this.keepAlive;
    }
  },

  render(createElement) {
    const { router, computedRoute, forceRender, keepAlive, keepAliveOptions, $scopedSlots, name } = this;
    const { history } = router;

    if (!computedRoute.match && !forceRender) return null;

    let children = $scopedSlots.default({
      history,
      location: history.location,
      match: computedRoute.match
    });
    children = children.filter(isNotTextNode);

    assert(
      children.length === 1, 
      `<${name}> can only be used on a single child element.`
    );

    if (keepAlive) {
      return createElement('keep-alive', keepAliveOptions, [
        children[0]
      ]);
    }

    return children[0];
  }
};

export default Route;
</script>
