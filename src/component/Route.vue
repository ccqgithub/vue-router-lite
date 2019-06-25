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
    forceRender: {
      type: Boolean,
      default: false
    },
    location: {
      type: Object
    }
  },

  inject: ['router', 'route'],

  provide() {
    return {
      route: this.route
    }
  },

  data() {
    return {
      isActive: true,
      // add provide's properties in data, to make provide reactivity 
      computedRoute: {
        location: this.computeLocation(),
        match: this.computeMatch()
      }
    }
  },

  watch: {
    route: {
      handler() {
        if (!this.isActive) return;
        this.computedRoute.location = this.computeLocation();
        this.computedRoute.match = this.computeMatch();
      },
      deep: true
    }
  },

  created() {
    assert(
      this.router,
      `You should not use <route> outside a <router>.`
    );

    this.cacheMatch = null;
    // use for keepalive
    this.cache = Object.create(null);
  },

  destroyed () {
    this.clearCache();
  },

  beforeUpdate() {
    assert(
      this.router,
      `You should not use <route> outside a <router>.`
    );
  },

  activated() {
    this.isActive = true;
    this.computedRoute.location = this.computeLocation();
    this.computedRoute.match = this.computeMatch();
  },

  deactivated() {
    this.isActive = false;
  },

  methods: {
    computeLocation() {
      return this.location || this.route.location;
    },
    computeMatch() {
      const computedLocation = this.computeLocation();
      const { path, strict, exact, sensitive, route } = this;
      const pathname = computedLocation.pathname;
      const match = path ? 
        matchPath(
          pathname,
          { path, strict, exact, sensitive }
        ) : route.match;

      // cache
      if (!this.cacheMatch || !match) {
        this.cacheMatch = match;
      } else {
        Object.keys(match).forEach(key => {
          this.cacheMatch[key] = match[key];
        })
      }

      return this.cacheMatch;
    },
    clearCache() {
      for (let key in this.cache) {
        this.cache[key].componentInstance.$destroy();
        this.cache[key] = null;
      }
    }
  },

  render(createElement) {
    const { router, computedRoute, forceRender, $scopedSlots, name, cache } = this;
    const { history } = router;
    const { match, location } = computedRoute;
    const isKeepAlive = this.$vnode.data.keepAlive;

    // no keep alive
    if (!isKeepAlive) {
      this.clearCache();
    }

    if (!match && !forceRender) return null;

    let children = $scopedSlots.default({ match, history, location });
    children = (children || []).filter(isNotTextNode);

    if (!children.length) return null;

    assert(
      children.length === 1, 
      `<${name}> can only be used on a single child element.`
    );
    
    const vnode = children[0];
    const componentOptions = vnode && vnode.componentOptions;

    // is keepAlive and is component
    if (isKeepAlive && componentOptions) {
      const key = vnode.key == null
        ? componentOptions.Ctor.cid + (componentOptions.tag ? ("::" + (componentOptions.tag)) : '')
        : vnode.key;
      if (cache[key]) {
        vnode.componentInstance = cache[key].componentInstance;
      } else {
        cache[key] = vnode;
      }
      vnode.data.keepAlive = true;
    }
    
    return vnode;
  }
};

export default Route;
</script>
