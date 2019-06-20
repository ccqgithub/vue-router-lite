import Vue from 'vue'
import { BrowserRouter as Router, Route, RouterLink } from 'vue-router-lite'

const Home = { template: '<div><h2>Home</h2></div>' }
const About = { template: '<div><h2>About</h2></div>' }

const User = { 
  props: {
    match: {
      type: Object
    },
    location: {
      type: Object
    }
  },
  template: '<div>{{ match.params.username }} <br/> {{location.search}}</div>' 
}

const Users = {
  props: {
    match: {
      type: Object
    }
  },
  components: {
    User,
    Route
  },
  template: `
    <div>
      <h2>Users</h2>
      <route :path="match.path + '/:username'">
        <template v-slot:default="{ match, location }">
          <user :match="match" :location="location" />
        </template>
      </route>
    </div>
  `
}

new Vue({
  components: {
    Router,
    Route,
    RouterLink,
    Home,
    About,
    Users
  },
  template: `
    <router basename="/active-links/">
      <div id="app">
        <h1>Active Links</h1>
        <ul>
          <li><router-link to="/">/</router-link></li>
          <li><router-link to="/" exact>/ (exact match)</router-link></li>

          <li><router-link to="/users">/users</router-link></li>
          <li><router-link to="/users" exact>/users (exact match)</router-link></li>

          <li><router-link to="/users/evan">/users/evan</router-link></li>
          <li><router-link to="/users/evan#foo">/users/evan#foo</router-link></li>
          <li>
            <router-link :to="{ pathname: '/users/evan', search: '?foo=bar' }">
              /users/evan?foo=bar
            </router-link>
          </li>
          <li>
            <router-link :to="{ pathname: '/users/evan', search: '?foo=bar&baz=qux' }">
              /users/evan?foo=bar&baz=qux
            </router-link>
          </li>

          <li><router-link to="/about">/about</router-link></li>

          <router-link tag="li" to="/about">
            <a>/about (active class on outer element)</a>
          </router-link>
        </ul>

        <route exact path="/">
          <home />
        </route>
        <route exact path="/about">
          <about />
        </route>
        <route path="/users">
          <template v-slot:default="{ match }">
            <users :match="match" />
          </template>
        </route>
      </div>
    </router>
  `
}).$mount('#app')
