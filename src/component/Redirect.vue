<template>
  <empty />
</template>

<script>
import { createLocation, locationsAreEqual } from "history";
import { warning } from '../util/utils';
import generatePath from "../util/generatePath";
import Empty from '../util/empty';

const Redirect = {
  components: {
    Empty,
  },

  props: {
    // to path
    to: {
      type: [String, Object],
      required: true,
    },
    // wheather push
    push: {
      type: Boolean,
      default: false,
    },
    // route match
    match: {
      type: Object,
    },
    // route location
    location: {
      type: Object
    },
    // router history
    history: {
      type: Object,
    },
  },

  inject: ['$router'],

  created() {
    if (!this.$router) {
      warning('You must not use <Redirect> outside a <Router>.');
    }

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
      return this.$router && this.$router.context;
    },

    // to location
    computeTo() {
      // to
      let p = this.to;
      // route
      if (this.match) {
        if (typeof this.to === 'string') {
          // to is string
          p = generatePath(this.to, this.match.params);
        } else {
          // to is object
          p = {
            ...this.to,
            pathname: generatePath(
              this.to.pathname,
              this.match.params,
            )
          };
        }
      }

      // to
      const to = createLocation(p); 

      return to;
    },

    perform() {
      const { history } = this.$router;

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