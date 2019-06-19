<template>
  <router :history="history">
    <slot />
  </router>
</template>

<script>
import { createHashHistory as createHistory } from "history";
import { warning } from '../util/utils';
import Router from './Router.vue';

const HashRouter = {
  name: 'HashRouter',

  components: {
    Router
  },

  props: {
    basename: {
      type: String,
      default: ''
    },
    hashType: {
      validator(value) {
        return ["hashbang", "noslash", "slash"].indexOf(value) !== -1;
      }
    },
    getUserConfirmation: {
      type: Function,
      default(message, callback) {
        callback(window.confirm(message));
      }
    }
  },

  data() {
    let history = createHistory({
      basename: this.basename,
      hashType: this.hashType,
      getUserConfirmation: this.getUserConfirmation
    });

    return {
      history
    };
  }
}

export default HashRouter;
</script>