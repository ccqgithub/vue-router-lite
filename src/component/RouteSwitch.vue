<script>
import { assert, isNotTextNode } from '../util/utils';
import matchPath from "../util/matchPath";

const RouteSwitch = {
  name: 'RouteSwitch',
  props: {
    location: Object
  },
  inject: ['router', 'route'],

  provide() {
    return {
      route: this.computedRoute
    }
  },

  data() {
    return {
      isActive: true,
      // add provide's properties in data, to make provide reactivity 
      computedRoute: {
        location: this.location || this.route.location,
        match: this.route.match
      }
    }
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
    },
    clearCache() {
      for (let key in this.cache) {
        this.cache[key].componentInstance.$destroy();
        this.cache[key] = null;
      }
    }
  },

  created() {
    assert(
      this.router,
      `You should not use <route-switch> outside a <router>.`
    );

    // use for cache keepalive component
    this.cache = Object.create(null);
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

  destroyed () {
    this.clearCache();
  },

  render(createElement, context) {
    const { router, cache } = this;
    const { location } = this.computedRoute;
    const children = (this.$slots.default || []).filter(isNotTextNode);
    const isKeepAlive = this.$vnode.data.keepAlive;

    // no keep alive
    if (!isKeepAlive) {
      this.clearCache();
    }

    if (!children.length) return null;

    let key = '';
    const vnode = children.find((vnode) => {
      // filter text nodes
      if (!vnode.tag) return false;
      // check children if <route> component
      assert(
        vnode.componentOptions, 
        `<route-switch>'s children can only be <route>.`
      );

      const propsData = vnode.componentOptions.propsData || {};
      const { path = '', exact = false, strict = false, sensitive = true } = propsData;
      // key
      key = vnode.key || `path-${path}--exact-${exact}--strict-${strict}--sensitive-${sensitive}`;
      // no path on route
      if (!path) return true;
      const match = matchPath(location.pathname, { path, exact, strict, sensitive });
      return !!match;
    });

    if (!vnode) return vnode;

    // is keepAlive and is component
    if (isKeepAlive) {
      if (cache[key]) {
        vnode.componentInstance = cache[key].componentInstance;
      } else {
        cache[key] = vnode;
      }
      vnode.data.keepAlive = true;
    }

    // key
    vnode.key = key;

    return vnode;
  }
}

RouteSwitch.install = function(Vue) {
  Vue.component(RouteSwitch.name, RouteSwitch);
}

export default RouteSwitch;
</script>
