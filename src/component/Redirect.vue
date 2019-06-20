<template>
  <empty />
</template>

<script>
import { createLocation, locationsAreEqual } from "history";
import { assert } from '../util/utils';
import generatePath from "../util/generatePath";
import Empty from '../util/empty';

const Redirect = {
  components: {
    Empty
  },

  props: {
    // to path
    to: {
      type: [String, Object],
      required: true
    },
    // wheather push
    push: {
      type: Boolean,
      default: false
    }
  },

  inject: ['router', 'route'],

  created() {
    assert(
      this.router,
      'You must not use <Redirect> outside a <Router>.'
    );

    // static router
    if (this.isStatic()) this.perform();
  },

  mounted() {
    // not static router
    if (!this.isStatic()) this.perform();
  },

  updated() {
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
      const { match } = this.route;
      const { location } = this.router.history;
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
  }
}

export default Redirect;
</script>