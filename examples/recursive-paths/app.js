import Vue from 'vue'
import { BrowserRouter as Router, Route, RouterLink, Redirect, MatchFirst } from 'vue-router-lite'

const PEEPS = [
  { id: 0, name: "Michelle", friends: [1, 2, 3] },
  { id: 1, name: "Sean", friends: [0, 3] },
  { id: 2, name: "Kim", friends: [0, 1, 3] },
  { id: 3, name: "David", friends: [1, 2] }
];

function find(id) {
  return PEEPS.find(p => p.id == id);
}

const Person = { 
  name: 'Person',
  components: {
    RouterLink,
    Route
  },
  props: {
    match: Object
  },
  computed: {
    person() {
      return find(this.match.params.id);
    }
  },
  methods: {
    find(id) {
      return find(id);
    }
  },
  template: `
    <div>
      <h3>
        {{ person.name }}
        ’s Friends
      </h3>
      <ul>
        <li v-for="id in person.friends" :key="id">
          <router-link :to="match.url + '/' + id">{{ find(id).name }}</router-link>
        </li>
      </ul>
      <route :path="match.url + '/:id'" v-slot:default="{ match }">
        <person :match="match" />
      </route>
    </div>
  ` 
}

const App = {
  data: () => ({ n: 0 }),
  components: {
    Route, 
    RouterLink,
    Person
  },
  template: `
    <div id="app">
      <h1>No Match (404)</h1>
      <person :match="{ params: { id: 0 }, url: '' }" />
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
    const p = '/recursive-paths';
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
