<template>
  <empty></empty>
</template>

<script>
import { createLocation, locationsAreEqual } from "history";
import { warning } from '../util/utils';
import generatePath from "../util/generatePath";
import Empty from '../util/empty';

const Redirect = {
  components: {
    Empty
  },

  props: {
    computedMatch: Object,
    push: {
      type: Boolean,
      default: false
    },
    from: String,
    to: {
      type: [String, Object],
      required: true
    }
  },

  inject: ['router'],

  created() {
    if (!this.router) {
      warning('You should not use <Redirect> outside a <Router>');
    }

    this.lastTo = this.to;
    if (this.isStatic()) this.perform();
  },

  mounted() {
    if (!this.isStatic()) this.perform();
  },

  updated() {
    const prevTo = createLocation(this.lastTo);
    const nextTo = createLocation(this.to);

    if (locationsAreEqual(prevTo, nextTo)) {
      warning(
        `You tried to redirect to the same route you're currently on: ` +
        `"${nextTo.pathname}${nextTo.search}"`
      );
      return;
    }

    this.perform();
  },

  methods: {
    isStatic() {
      return this.router && this.router.staticContext;
    },

    computeTo({ computedMatch, to }) {
      if (computedMatch) {
        if (typeof to === "string") {
          return generatePath(to, computedMatch.params);
        } else {
          return {
            ...to,
            pathname: generatePath(to.pathname, computedMatch.params)
          };
        }
      }
  
      return to;
    },

    perform() {
      const { history } = this.router;
      const push = this.push;
      const to = this.computeTo({
        computedMatch: this.computedMatch,
        to: this.to
      });
      
      this.lastTo = this.to;
      if (push) {
        history.push(to);
      } else {
        history.replace(to);
      }
    }
  }
}

export default Redirect;
</script>