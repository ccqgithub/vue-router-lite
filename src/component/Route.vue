<template>
  <single v-if="match">
    <slot v-bind="childProps" />
  </single>
</template>

<script>
import { warning } from '../util/utils';
import matchPath from '../util/matchPath';
import Single from '../util/Single';

const Route = {
  props: {
    path: {
      type: [String, Array],
    },
    exact: {
      type: Boolean,
      default: true,
    },
    strict: {
      type: Boolean,
      default: false,
    },
    sensitive: {
      type: Boolean,
      default: false,
    },
    location: {
      type: Object,
    },
  },

  inject: ['$router', '$route'],

  provide() {
    return {
      $route: {
        match: this.match,
        location: this.computedLocation,
      }
    }
  },

  created() {
    if (!this.$router) {
      throw new Error(
        `You should not use <Route> outside a <Router>`,
      );
    }
  },

  computed: {
    computedLocation() {
      return this.location || this.$route.location;
    },
    match() {
      let { computedLocation, path, strict, exact, sensitive, $route } = this;
      const pathname = computedLocation.pathname;

      return path ? 
        matchPath(
          pathname,
          { path, strict, exact, sensitive },
        ) : $route.match;
    },

    childProps() {
      const { history } = this.$router;
      let location = this.computedLocation;
      let match = this.match;

      return {
        match,
        location,
        history,
      };
    },
  },
};

export default Route;
</script>
