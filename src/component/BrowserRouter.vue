<template>
  <router :history="history">
    <template v-slot:default="routerProps">
      <slot v-bind="routerProps"/>
    </template>
  </router>
</template>

<script>
import createBrowserHistory from '../util/createBrowserHistory';
import { assert } from '../util/utils';
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
}

export default BrowserRouter;
</script>