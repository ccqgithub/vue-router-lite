<template>
  <router :history="history">
    <slot />
  </router>
</template>

<script>
import { createBrowserHistory as createHistory } from "history";
import { warning } from '../util/utils';
import Router from './Router.vue';

const BrowserRouter = {
  components: {
    Router,
  },

  props: {
    basename: {
      type: String,
      default: '',
    },
    forceRefresh: {
      type: Boolean,
      default: false,
    },
    keyLength: {
      type: Number,
      default: 6,
    },
    getUserConfirmation: {
      type: Function,
      default(message, callback) {
        callback(window.confirm(message));
      },
    }
  },

  data() {
    let history = createHistory({
      basename: this.basename,
      forceRefresh: this.forceRefresh,
      getUserConfirmation: this.getUserConfirmation,
      keyLength: this.keyLength
    });

    return {
      history,
    };
  }
}

export default BrowserRouter;
</script>