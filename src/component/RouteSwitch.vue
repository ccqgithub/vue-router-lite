<script>
import { assert, isNotTextNode, getBooleanProps } from '../util/utils';
import matchPath from '../util/matchPath';
import * as symbols from '../util/symbol';

const RouteSwitch = {
  name: 'RouteSwitch',
  props: {
    location: Object,
    keepAlive: {
      type: [Object, Boolean],
      default: false
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
        location: this.location || this.route.location,
        match: this.route.match
      }
    };
  },

  computed: {
    computeLocation() {
      return this.location || this.route.location;
    }
  },

  watch: {
    computeLocation: {
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
      this.computedRoute.match = this.route.match;
    }
  },

  created() {
    assert(
      this.router,
      `You should not use <route-switch> outside a <router>.`
    );
    // update current route
    this.updateRoute();
  },

  beforeUpdate() {
    assert(
      this.router,
      `You should not use <route-switch> outside a <router>.`
    );
  },

  activated() {
    this.isActive = true;
    this.updateRoute();
  },

  deactivated() {
    this.isActive = false;
  },

  render(createElement, context) {
    const { location } = this.computedRoute;
    const children = (this.$slots.default || []).filter(isNotTextNode);
    let realChild = null;

    if (children.length) {
      realChild = children.find((node) => {
        // filter text nodes
        if (!node.tag) return false;
        // check children if <route> component
        assert(
          node.componentOptions &&
            node.componentOptions.Ctor &&
            node.componentOptions.Ctor.options.name === 'Route',
          `<route-switch>'s children can only be <route>.`
        );

        const propsData = node.componentOptions.propsData || {};
        const { path = '' } = propsData;
        const exact = getBooleanProps(propsData.exact, false);
        const strict = getBooleanProps(propsData.strict, false);
        const sensitive = getBooleanProps(propsData.sensitive, true);
        // no path on route
        if (!path) return true;
        // check path to match
        const match = matchPath(location.pathname, {
          path,
          exact,
          strict,
          sensitive
        });
        if (match) {
          node.key = match.url;
          return true;
        }
        return false;
      });
    }

    if (this.keepAlive) {
      return createElement(
        'keep-alive',
        {
          props: typeof this.keepAlive === 'object' ? this.keepAlive : {}
        },
        [realChild]
      );
    }

    return realChild;
  }
};

export default RouteSwitch;
</script>
