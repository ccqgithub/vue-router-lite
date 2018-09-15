<template>
  <single>
    <slot></slot>
  </single>
</template>

<script>
import { warning, copyJson } from '../util/utils';
import Single from '../util/Single';

const Router = {
  components: {
    Single
  },

  props: {
    history: {
      type: Object,
      required: true
    }
  },

  provide() {
    return {
      router: {
        history: this.history,
        route: this.route
      }
    }
  },

  data() {
    return {
      route: this.computeRoute(this.history)
    }
  },

  beforeMount() {
    const { history } = this;
    this.unlisten = history.listen(() => {
      this.route = this.computeRoute(history);
    });
  },

  befreDestory() {
    this.unlisten();
  },

  watch: {
    history(val, oldVal) {
      warning('You cannot change <Router history>');
    }
  },

  methods: {
    computeRoute(history) {
      let pathname = history.location.pathname;
      return {
        location: copyJson(history.location),
        match: {
          path: "/",
          url: "/",
          params: {},
          isExact: pathname === "/"
        }
      }
    }
  }
}

export default Router;
</script>