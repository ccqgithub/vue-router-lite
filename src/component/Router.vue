<template>
  <single name="Router">
    <slot 
      :history="history" 
      :location="history.location" 
      :match="route.match"
    />
  </single>
</template>

<script>
import { assert } from '../util/utils';
import Single from '../util/Single';

const Router = {
  name: 'Router',

  components: {
    Single
  },

  props: {
    // history control
    history: {
      type: Object,
      required: true
    }
  },

  provide() {
    return {
      router: this.router,
      route: this.route
    };
  },

  data() {
    return {
      router: {
        history: this.history
      },
      route: {
        match: this.computeMatch(this.history.location.pathname)
      }
    };
  },

  beforeMount() {
    const { history } = this;
    this.unlisten = history.listen(() => {
      this.route.match = this.computeMatch(history.location.pathname);
    });
  },

  befreDestory() {
    this.unlisten();
  },

  watch: {
    history(val, oldVal) {
      assert(false, 'You cannot change <Router>\'s history!');
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