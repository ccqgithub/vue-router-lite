<template>
  <router :history="history" name="browser-router" v-slot="routerProps">
    <slot v-bind="routerProps" />
  </router>
</template>

<script>
import createBrowserHistory from '../util/createBrowserHistory';
import Router from './Router.vue';

const BrowserRouter = {
  name: 'BrowserRouter',

  components: {
    Router
  },

  props: {
    basename: {
      type: String,
      default: ''
    },
    forceRefresh: {
      type: Boolean,
      default: false
    },
    keyLength: {
      type: Number,
      default: 6
    },
    getUserConfirmation: {
      type: Function,
      default(message, callback) {
        // eslint-disable-next-line no-alert
        callback(window.confirm(message));
      }
    }
  },

  data() {
    let history = createBrowserHistory({
      basename: this.basename,
      forceRefresh: this.forceRefresh,
      keyLength: this.keyLength,
      getUserConfirmation: this.getUserConfirmation
    });

    return {
      history
    };
  }
};

export default BrowserRouter;
</script>
