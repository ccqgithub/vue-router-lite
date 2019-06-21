<template>
  <single name="Route">
    <keep-alive v-if="keepAlive" v-bind="keepAliveOptions">
      <slot 
        :history="router.history"
        :location="computedLocation" 
        :match="computedRoute.match" 
        v-if="computedRoute.match || forceRender"
      />
    </keep-alive>
    <template v-else>
      <slot 
        :history="router.history"
        :location="computedLocation" 
        :match="computedRoute.match" 
        v-if="computedRoute.match || forceRender"
      />
    </template>
  </single>
</template>

<script>
import { assert } from '../util/utils';
import matchPath from '../util/matchPath';
import Single from '../util/Single';

const Route = {
  name: 'Route',

  components: {
    Single
  },
  
  props: {
    path: {
      type: [String, Array]
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
    keepAlive: {
      type: [Boolean, Object]
    },
    forceRender: {
      type: Boolean,
      default: false
    }
  },

  inject: ['router', 'route'],

  provide() {
    return {
      route: this.computedRoute
    }
  },

  created() {
    assert(
      this.router,
      `You should not use <Route> outside a <Router>!`
    );
  },

  computed: {
    computedLocation() {
      const computedLocation = this.router.history.location;
      return computedLocation;
    },
    computedRoute() {
      const { path, strict, exact, sensitive, route } = this;
      const pathname = this.computedLocation.pathname;
      const match = path ? 
        matchPath(
          pathname,
          { path, strict, exact, sensitive }
        ) : route.match;

      return { match };
    },
    keepAliveOptions() {
      if (!this.keepAlive) return { include: [] };
      if (typeof this.keepAlive === 'boolean') {
        return {};
      }
      return this.keepAlive;
    }
  }
};

export default Route;
</script>
