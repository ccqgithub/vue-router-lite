<template>
  <router :history="history" name="static-router" v-slot="routerProps">
    <slot v-bind="routerProps"/>
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
      type: String,
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

StaticRouter.install = function(Vue) {
  Vue.component(StaticRouter.name, StaticRouter);
}

export default StaticRouter;
</script>