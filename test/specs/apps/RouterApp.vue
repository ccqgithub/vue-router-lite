<template>
  <div id="app">
    <ul>
      <li>
        <router-link to="/">Home</router-link>
      </li>
      <li>
        <router-link to="/about">About</router-link>
      </li>
      <li>
        <router-link to="/topics">Topics</router-link>
      </li>
    </ul>

    <hr />
    
    <route exact path="/" v-slot="props">
      <home v-bind="props"/>
    </route>
    <route path="/about" v-slot="props">
      <about v-bind="props"/>
    </route>
    <route path="/topics" v-slot="props">
      <topics v-bind="props"/>
    </route>
  </div>
</template>

<script>
import { Route, RouterLink } from 'vue-router-lite';
import Home from './components/Home.vue';
import About from './components/About.vue';
import Topics from './components/Topics.vue';

export default {
  components: {
    Route,
    RouterLink,
    Home,
    About,
    Topics
  }
}
</script>
