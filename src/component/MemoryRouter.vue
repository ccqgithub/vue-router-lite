<template>
  <router :history="childHistory">
    <slot></slot>
  </router>
</template>

<script>
import { createMemoryHistory as createHistory } from "history";
import { warning } from '../util/utils';
import Router from './Router';

const MemoryRouter = {
  components: {
    Router
  },

  props: {
    // just use to check if user pass history
    history: {
      validator: function (value) {
        return true;
      }
    },

    initialEntries: Array,
    initialIndex: Number,
    getUserConfirmation: Function,
    keyLength: Number
  },

  data() {
    let history = createHistory({
      initialEntries: this.initialEntries,
      initialIndex: this.initialIndex,
      getUserConfirmation: this.getUserConfirmation,
      keyLength: this.keyLength
    });

    return {
      childHistory: history
    }
  },

  beforeMount() {
    if (this.history) {
      warning(
        '<MemoryRouter> ignores the history prop. To use a custom history, ' +
        'use `import { Router }` instead of `import { MemoryRouter as Router }`.'
      )
    }
  }
}

export default MemoryRouter;
</script>