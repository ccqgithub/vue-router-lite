import Vue from 'vue'
import { BrowserRouter as Router, Route, RouterLink } from 'vue-router-lite'
import { basename } from 'path';

const Child = { 
  props: {
    id: String
  },
  template: `
    <div>
      <h3>ID: {{ id }}</h3>
    </div>
  ` 
}

const ChildRegex = { 
  props: {
    id: String
  },
  template: `
    <div>
      <h3>Only yahoo/netflix are matched: {{ id }}</h3>
    </div>
  ` 
}

const App = {
  data: () => ({ n: 0 }),
  components: {
    Route, 
    RouterLink,
    Child,
    ChildRegex
  },
  template: `
    <div id="app">
      <h1>URL Parameters</h1>
      <ul>
        <li>
          <router-link to="/netflix">Netflix</router-link>
        </li>
        <li>
          <router-link to="/zillow-group">Zillow Group</router-link>
        </li>
        <li>
          <router-link to="/yahoo">Yahoo</router-link>
        </li>
        <li>
          <router-link to="/modus-create">Modus Create</router-link>
        </li>
      </ul>

      <hr />
      
      <route path="/:id" v-slot:default="{ match }">
        <child :id="match.params.id" />
      </route>

      <route path="/:id(netflix|yahoo)" v-slot:default="{ match }">
        <child-regex :id="match.params.id" />
      </route>
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
    const p = '/url-parameters';
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
