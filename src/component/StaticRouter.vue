<template>
  <router :history="history">
    <template v-slot:default="routerProps">
      <slot v-bind="routerProps"/>
    </template>
  </router>
</template>

<script>
import { assert } from '../util/utils';
import createStaticHistory from "../util/createStaticHistory";
import Router from "./Router.vue";

const StaticRouter = {
  name: 'StaticRouter',

  components: {
    Router
  },
  
  props: {
    basename: {
      type: 'String',
      default: ''
    },
    context: {
      type: Object,
      default: () => {}
    },
    location: {
      type: [String, Object],
      default: '/'
    }
  },

  data() {
    const history = createStaticHistory({ 
      basename: this.basename,
      context: this.context,
      location: this.location
    });

    return {
      history
    };
  }
}

export default StaticRouter;
</script>