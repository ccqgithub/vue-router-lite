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
    }
  },

  inject: ['router', 'route'],

  provide() {
    return {
      route: { match: this.match }
    }
  },

  created() {
    assert(
      this.router,
      `You should not use <route> outside a <router>.`
    );

    this.cacheMatch = null;
  },

  beforeUpdate() {
    assert(
      this.router,
      `You should not use <route> outside a <router>.`
    );
  },

  computed: {
    match() {
      const computedLocation = this.router.history.location;
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
    }
  },

  render(createElement) {
    const { router, match, forceRender, $scopedSlots, name } = this;
    const { history } = router;

    if (!match && !forceRender) return null;

    let children = $scopedSlots.default({
      match,
      history,
      location: history.location
    });
    children = (children || []).filter(isNotTextNode);

    assert(
      children.length <= 1, 
      `<${name}> can only be used on a single child element.`
    );

    if (!children.length) return null;

    return children[0];
  }
};

export default Route;
</script>
