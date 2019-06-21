import Vue from 'vue'
import { BrowserRouter as Router, Route, RouterLink } from 'vue-router-lite'

const routes = [
  {
    path: "/",
    exact: true,
    sidebar: {
      template: `<div>home!</div>`
    },
    main: {
      template: `<div>home!</div>`
    }
  },
  {
    path: "/bubblegum",
    sidebar: {
      template: `<div>bubblegum!</div>`
    },
    main: {
      template: `<div>bubblegum!</div>`
    }
  },
  {
    path: "/shoelaces",
    sidebar: {
      template: `<div>shoelaces!</div>`
    },
    main: {
      template: `<div>shoelaces!</div>`
    }
  }
];

const App = {
  data: () => {
    return {
      routes
    }
  },
  components: {
    Route, 
    RouterLink
  },
  template: `
    <div id="app">
      <h1>Sidebar</h1>
      <div :style="{ display: 'flex' }">
        <div
          :style="{
            padding: '10px',
            width: '40%',
            background: '#f0f0f0'
          }"
        >
          <ul :style="{ listStyleType: 'none', padding: 0 }">
            <li>
              <router-link to="/">Home</router-link>
            </li>
            <li>
              <router-link to="/bubblegum">Bubblegum</router-link>
            </li>
            <li>
              <router-link to="/shoelaces">Shoelaces</router-link>
            </li>
          </ul>
          
          <route
            v-for="(route, index) in routes"
            :key="index"
            :path="route.path"
            :exact="route.exact"
            :component="route.sidebar"
          />
        </div>

        <div :style="{ flex: 1, padding: '10px' }">
          <route
            v-for="(route, index) in routes"
            :key="index"
            :path="route.path"
            :exact="route.exact"
            :component="route.main"
          />
        </div>
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
    <router basename="/sidebar/">
      <app />
    </router>
  `
}).$mount('#app')
