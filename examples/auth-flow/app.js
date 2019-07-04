import Vue from 'vue'
import { BrowserRouter as Router, Route, RouterLink } from 'vue-router-lite'

import App from './components/App.vue'

/* eslint-disable no-new */
new Vue({
  components: {
    App,
    Router
  },
  data() {
    const p = '/auth-flow';
    const basename = location.pathname.split(p)[0] + p + '/';
    return {
      basename
    }
  },
  template: `
    <router :basename="basename" v-slot="{ match, location, history }">
      <app :match="match" :location="location" :history="history" />
    </router>
  `
}).$mount('#app')