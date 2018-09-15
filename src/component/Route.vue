<template>
  <single v-if="match">
    <component v-if="component" :is="component" v-bind="childProps"></component>
    <slot v-bind="childProps"></slot>
  </single>
</template>

<script>
import { warning } from '../util/utils';
import matchPath from '../util/matchPath';
import Single from '../util/Single';

const Route = {
  props: {
    path: String,
    exact: Boolean,
    strict: Boolean,
    sensitive: Boolean,
    location: Object,
    component: Object,
  },

  inject: ['router'],

  provide() {
    return {
      router: {
        history: this.router.history,
        route: {
          location: this.location || this.router.route.location,
          match: this.match,
        },
      },
    };
  },

  computed: {
    match() {
      let { location, path, strict, exact, sensitive, router } = this;

      if (!router) {
        throw new Error(
          `You should not use <Route> or withRouter() outside a <Router>`,
        );
      }

      const { route } = router;
      const pathname = (location || route.location).pathname;

      return matchPath(
        pathname,
        { path, strict, exact, sensitive },
        route.match,
      );
    },

    childProps() {
      let { location, match } = this;
      const { history, route, staticContext } = this.router;
      const nLocation = this.location || route.location;

      return {
        ...this.$attrs,
        match,
        location: nLocation,
        history,
        staticContext,
      };
    },
  },
};

export default Route;
</script>
