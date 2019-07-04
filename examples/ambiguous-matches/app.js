import Vue from 'vue'
import { BrowserRouter as Router, Route, RouterLink, RouteSwitch } from 'vue-router-lite'

const About = { 
  template: `
    <div>
      <h2>About</h2>
    </div>
  ` 
}

const Company = { 
  template: `
    <div>
      <h2>Company</h2>
    </div>
  ` 
}

const User = {
  props: {
    match: Object
  },
  template: `
    <div>
      <h2>User: {{ match.params.user }}</h2>
    </div>
  `
}

const App = {
  data: () => {
    return {
      //
    }
  },
  components: {
    Route, 
    RouterLink,
    RouteSwitch,
    Company,
    About,
    User
  },
  template: `
    <div id="app">
      <h1>Ambiguous Matches: RouteSwitch</h1>
      <ul>
        <li>
          <router-link to="/about">About Us (static)</router-link>
        </li>
        <li>
          <router-link to="/company">Company (static)</router-link>
        </li>
        <li>
          <router-link to="/kim">Kim (dynamic)</router-link>
        </li>
        <li>
          <router-link to="/chris">Chris (dynamic)</router-link>
        </li>
      </ul>

      <hr />
      
      <pre>
Sometimes you want to have a whitelist of static paths like "/about" and "/company" but also allow for dynamic patterns like "/:user". 
The problem is that "/about" is ambiguous and will match both "/about" and "/:user".
Most routers have an algorithm to decide for you what it will match since they only allow you to match one "route". 
Vue Router Lite lets you match in multiple places on purpose (sidebars, breadcrumbs, etc). 
So, when you want to clear up any ambiguous matching, and not match "/about" to "/:user", just wrap your &lt;route&gt;s in a &lt;route-switch&gt;. 
It will render the first one that matches.
      </pre>

      <route-switch>
        <route path="/about" v-slot="props">
          <about v-bind="props"/>
        </route>
        <route path="/company" v-slot="props">
          <company v-bind="props"/>
        </route>
        <route path="/:user" v-slot="props">
          <user v-bind="props"/>
        </route>
      </route-switch>
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
  data() {
    const p = '/ambiguous-matches';
    const basename = location.pathname.split(p)[0] + p + '/';
    return {
      basename
    }
  },
  template: `
    <router :basename="basename">
      <app />
    </router>
  `
}).$mount('#app')
