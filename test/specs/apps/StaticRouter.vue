<template>
  <router v-bind="$attrs" v-slot="props">
    <router-app v-bind="props"></router-app>
  </router>
</template>

<script>
import { StaticRouter as Router } from 'vue-router-lite';
import RouterApp from './RouterApp.vue';

export default {
  components: {
    Router,
    RouterApp
  }
}
</script>
