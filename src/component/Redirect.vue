<script>
import { createLocation, locationsAreEqual } from "history";
import { assert } from '../util/utils';
import generatePath from "../util/generatePath";
import matchPath from "../util/matchPath";

const Redirect = {
  name: 'Redirect',

  props: {
    // from path
    from: {
      type: String
    },
    // to path
    to: {
      type: [String, Object],
      required: true
    },
    // wheather push
    push: {
      type: Boolean,
      default: false
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
    }
  },

  inject: ['router', 'route'],

  created() {
    assert(
      this.router,
      'You must not use <redirect> outside a <router>.'
    );

    // static router
    if (this.isStatic()) this.perform();
  },

  mounted() {
    // not static router
    if (!this.isStatic()) this.perform();
  },

  beforeUpdate() {
    assert(
      this.router,
      'You must not use <redirect> outside a <router>.'
    );

    const to = this.computeTo();

    // already redirect
    if (locationsAreEqual(this.lastTo, to)) {
      return;
    }

    this.perform();
  },

  methods: {
    // if static router
    isStatic() {
      return this.router && this.router.history.isStatic;
    },

    // to location
    computeTo() {
      const { from, strict, exact, sensitive, route } = this;
      const pathname = route.location.pathname;
      const match = from ? 
        matchPath(
          pathname,
          { from, strict, exact, sensitive }
        ) : route.match;

      // to
      let p = this.to;
      // route
      if (match) {
        if (typeof this.to === 'string') {
          // to is string
          p = generatePath(this.to, match.params);
        } else {
          // to is object
          p = {
            ...this.to,
            pathname: generatePath(
              this.to.pathname,
              match.params
            )
          };
        }
      }

      // to
      const to = createLocation(p); 

      return to;
    },

    perform() {
      const { history } = this.router;

      // history method
      const method = this.push
        ? history.push
        : history.replace;

      const to = this.computeTo();

      // redirect
      this.lastTo = to;
      method(to);
    }
  },

  render() {
    return null;
  }
}

export default Redirect;
</script>