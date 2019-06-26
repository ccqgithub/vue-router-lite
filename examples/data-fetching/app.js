import Vue from 'vue'
import { BrowserRouter as Router, Route, RouterLink } from 'vue-router-lite'
import Post from './Post.vue'

const Home = { template: '<div>home</div>' }

new Vue({
  components: {
    Router,
    Route,
    RouterLink,
    Home,
    Post
  },
  template: `
    <router basename="/data-fetching/">
      <div id="app">
        <h1>Data Fetching</h1>
        <ul>
          <li><router-link to="/">/</router-link></li>
          <li><router-link to="/post/1">/post/1</router-link></li>
          <li><router-link to="/post/2">/post/2</router-link></li>
          <li><router-link to="/post/3">/post/3</router-link></li>
        </ul>

        <route exact path="/">
          <home />
        </route>

        <route path="/post/:id" v-slot="{ match }">
          <post :id="match.params.id" />
        </route>
      </div>
    </router>
  `
}).$mount('#app')
