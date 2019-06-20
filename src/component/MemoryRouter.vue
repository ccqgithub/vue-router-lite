<template>
  <router :history="history">
    <slot />
  </router>
</template>

<script>
import { createMemoryHistory as createHistory } from "history";
import { assert } from '../util/utils';
import Router from './Router.vue';

const MemoryRouter = {
  name: 'MemoryRouter',

  components: {
    Router
  },

  props: {
    initialEntries: {
      type: Array,
      default: () => ['/']
    },
    initialIndex: {
      type: Number,
      default: 0
    },
    keyLength: {
      type: Number,
      default: 6
    },
    getUserConfirmation: {
      type: Function
    }
  },

  data() {
    let history = createHistory({
      initialEntries: this.initialEntries,
      initialIndex: this.initialIndex,
      keyLength: this.keyLength,
      getUserConfirmation: this.getUserConfirmation
    });

    return {
      history
    };
  }
}

export default MemoryRouter;
</script>