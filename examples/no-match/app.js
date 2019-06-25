import Vue from 'vue'
import { BrowserRouter as Router, Route, RouterLink, Redirect, RouteSwitch } from 'vue-router-lite'

const Home = { 
  template: `
    <p>
      A <code>&lt;route-switch></code> renders the first child <code>&lt;route></code>{{" "}}
      that matches. A <code>&lt;route></code> with no <code>path</code> always
      matches.
    </p>
  ` 
}

const WillMatch = { 
  template: `
    <h3>Matched!</h3>
  ` 
}

const NoMatch = {
  props: {
    location: {
      type: Object
    }
  },
  template: `
    <div>
      <h3>
        No match for <code>{{ location.pathname }}</code>
      </h3>
    </div>
  `
}

const App = {
  data: () => ({ n: 0 }),
  components: {
    Route, 
    RouterLink,
    Redirect,
    RouteSwitch,
    Home,
    WillMatch,
    NoMatch,
  },
  template: `
    <div id="app">
      <h1>No Match (404)</h1>
      <div>
        <ul>
          <li>
            <router-link to="/">Home</router-link>
          </li>
          <li>
            <router-link to="/old-match">Old Match, to be redirected</router-link>
          </li>
          <li>
            <router-link to="/will-match">Will Match</router-link>
          </li>
          <li>
            <router-link to="/will-not-match">Will Not Match</router-link>
          </li>
          <li>
            <router-link to="/also/will/not/match">Also Will Not Match</router-link>
          </li>
        </ul>
        <route-switch>
          <route path="/" exact>
            <home />
          </route>
          <route path="/old-match">
            <redirect to="/will-match" />
          </route>
          <route path="/will-match">
            <will-match />
          </route>
          <route v-slot:default="{ location }">
            <no-match :location="location" />
          </route>
        </route-switch>
      </div>
    </div>
  `,

  methods: {
    //
  }
}

new Vue({
  components: {
    App,
    Router
  },
  template: `
    <router basename="/no-match/">
      <app />
    </router>
  `
}).$mount('#app')
