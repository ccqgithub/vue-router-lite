<template>
  <router :history="childHistory">
    <slot></slot>
  </router>
</template>

<script>
import { createBrowserHistory as createHistory } from "history";
import { warning } from '../util/utils';
import Router from './Router';

const BrowserRouter = {
  components: {
    Router
  },

  props: {
    history: Object,
    basename: String,
    forceRefresh: Boolean,
    keyLength: Number,
    getUserConfirmation: Function
  },

  data() {
    let history = this.history;
    if (!history) {
      history = createHistory({
        basename: this.basename,
        forceRefresh: this.forceRefresh,
        getUserConfirmation: this.getUserConfirmation,
        keyLength: this.keyLength
      });
    }

    return {
      childHistory: history
    }
  }
}

export default BrowserRouter;
</script>