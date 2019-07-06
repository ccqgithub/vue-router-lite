<template>
  <browser-router>
    <div class="app">
      <route path="/">
        <home></home>
      </route>
      <route path="/about">
        <about></about>
      </route>
    </div>
  </browser-router>
</template>

<script>
import { BrowserRouter, Route } from '@/index';
import About from './components/About.vue';
import Home from './components/Home.vue';

export default {
  components: {
    BrowserRouter,
    Route,
    Home,
    About
  }
}
</script>
