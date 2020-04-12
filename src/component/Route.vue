<script>
import { assert, isNotTextNode } from '../util/utils';
import matchPath from '../util/matchPath';
import * as symbols from '../util/symbol';

const Route = {
  name: 'Route',

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
    forceRender: {
      type: Boolean,
      default: false
    },
    location: {
      type: Object,
      default: null
    }
  },

  inject: {
    router: { from: symbols.router },
    route: { from: symbols.route }
  },

  provide() {
    return {
      [symbols.route]: this.computedRoute
    };
  },

  data() {
    return {
      isActive: true,
      // add provide's properties in data, to make provide reactivity
      computedRoute: {
        location: this.route.location,
        match: this.route.match
      }
    };
  },

  computed: {
    computeLocation() {
      return this.location || this.route.location;
    },
    computeMatch() {
      const computedLocation = this.computeLocation;
      const { path, strict, exact, sensitive, route } = this;
      const pathname = computedLocation.pathname;
      const match = path
        ? matchPath(pathname, { path, strict, exact, sensitive })
        : route.match;

      return match;
    }
  },

  watch: {
    computeMatch: {
      handler() {
        this.updateRoute();
      },
      deep: true
    }
  },

  methods: {
    updateRoute() {
      if (!this.isActive) return;
      this.computedRoute.location = this.computeLocation;
      this.computedRoute.match = this.computeMatch;
    }
  },

  created() {
    assert(this.router, `You should not use <route> outside a <router>.`);
    // update current route
    this.updateRoute();
  },

  beforeUpdate() {
    assert(this.router, `You should not use <route> outside a <router>.`);
  },

  activated() {
    this.isActive = true;
    this.updateRoute();
  },

  deactivated() {
    this.isActive = false;
  },

  render(createElement) {
    const { router, computedRoute, forceRender, $scopedSlots, name } = this;
    const { history } = router;
    const { match, location } = computedRoute;

    if (!match && !forceRender) return null;

    let children = $scopedSlots.default({ match, history, location });
    children = (children || []).filter(isNotTextNode);

    if (!children.length) return null;

    assert(
      children.length === 1,
      `<${name}> can only be used on a single child element.`
    );

    const vnode = children[0];
    return vnode;
  }
};

export default Route;
</script>
