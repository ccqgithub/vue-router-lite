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

  data() {
    return {
      match: this.computedMatch()
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

    // new match
    let newMatch = this.computedMatch();
    if (!this.match || !newMatch) {
      // old match is false or newMatch is false
      this.match = newMatch;
    } else {
      Object.keys(newMatch).forEach(key => {
        this.match[key] = newMatch[key];
      });
    }
  },

  methods: {
    computedMatch() {
      const computedLocation = this.router.history.location;
      const { path, strict, exact, sensitive, route } = this;
      const pathname = computedLocation.pathname;
      const match = path ? 
        matchPath(
          pathname,
          { path, strict, exact, sensitive }
        ) : route.match;

      return match;
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
    children = children.filter(isNotTextNode);

    assert(
      children.length === 1, 
      `<${name}> can only be used on a single child element.`
    );

    return children[0];
  }
};

export default Route;
</script>
