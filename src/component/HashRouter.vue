<template>
  <router :history="history" name="hash-router" v-slot="routerProps">
    <slot v-bind="routerProps"/>
  </router>
</template>

<script>
import createHashHistory from '../util/createHashHistory';
import { assert } from '../util/utils';
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
      },
      default: 'slash'
    },
    getUserConfirmation: {
      type: Function,
      default(message, callback) {
        callback(window.confirm(message));
      }
    }
  },

  data() {
    let history = createHashHistory({
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