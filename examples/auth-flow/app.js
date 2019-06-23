import Vue from 'vue'
import { BrowserRouter as Router, Route, RouterLink } from 'vue-router-lite'

import App from './components/App.vue'

/* eslint-disable no-new */
new Vue({
  components: {
    App,
    Router
  },
  template: `
    <router basename="/auth-flow/" v-slot="{ match, location, history }">
      <app :match="match" :location="location" :history="history" />
    </router>
  `
}).$mount('#app')