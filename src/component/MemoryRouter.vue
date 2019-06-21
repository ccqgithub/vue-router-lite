<template>
  <router :history="history" :component="component">
    <template v-slot:default="routerProps">
      <slot v-bind="routerProps"/>
    </template>
  </router>
</template>

<script>
import createMemoryHistory from '../util/createMemoryHistory';
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
    },
    component: {
      type: Object
    }
  },

  data() {
    let history = createMemoryHistory({
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