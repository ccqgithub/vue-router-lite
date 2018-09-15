<template>
  <router :history="childHistory">
    <slot></slot>
  </router>
</template>

<script>
import { createHashHistory as createHistory } from "history";
import { warning } from '../util/utils';
import Router from './Router';

const HashRouter = {
  components: {
    Router
  },

  props: {
    history: Object,
    basename: String,
    hashType: {
      validator: function(value) {
        return ["hashbang", "noslash", "slash"].indexOf(value) !== -1
      }
    },
    getUserConfirmation: Function
  },

  data() {
    let history = this.history;
    if (!history) {
      history = createHistory({
        basename: this.basename,
        hashType: this.hashType,
        getUserConfirmation: this.getUserConfirmation
      });
    }

    return {
      childHistory: history
    }
  }
}

export default HashRouter;
</script>