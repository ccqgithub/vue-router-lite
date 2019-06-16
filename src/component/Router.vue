<template>
  <single name="router">
    <slot />
  </single>
</template>

<script>
import { warning } from '../util/utils';
import Single from '../util/Single';

const Router = {
  components: {
    Single
  },

  props: {
    // history control
    history: {
      type: Object,
      required: true
    },
    // just for static router
    context: {
      type: Object,
      default: null
    }
  },

  provide() {
    return {
      $router: this.router,
      $route: this.route
    };
  },

  data() {
    return {
      router: {
        history: this.history,
        context: this.context
      },
      route: {
        location: this.history.location,
        match: this.computeMatch(this.history.location.pathname)
      }
    };
  },

  beforeMount() {
    const { history } = this;
    this.unlisten = history.listen(() => {
      this.route.location = history.location;
      this.route.match = this.computeMatch(history.location.pathname);
    });
  },

  befreDestory() {
    this.unlisten();
  },

  watch: {
    history(val, oldVal) {
      warning('You cannot change <Router history>');
    },
    context(val, oldVal) {
      warning('You cannot change <Router context>');
    }
  },

  methods: {
    computeMatch(pathname) {
      return { path: "/", url: "/", params: {}, isExact: pathname === "/" };
    }
  }
}

export default Router;
</script>