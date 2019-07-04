import Vue from 'vue'
import { BrowserRouter as Router, Route, RouterLink } from 'vue-router-lite'

const Home = { 
  template: `
    <div>
      <h2>Home</h2>
    </div>
  ` 
}

const About = { 
  template: `
    <div>
      <h2>About</h2>
    </div>
  ` 
}

const OldSchoolMenuLink = {
  components: {
    Route,
    RouterLink
  },
  props: {
    label: String,
    to: [String, Object],
    activeOnlyWhenExact: Boolean,
  },
  template: `
    <route :path="to" :exact="activeOnlyWhenExact" force-render v-slot:default="{ match }">
      <div :class="{ active: !!match }">
        {{ match ? '> ' : '' }}
        <router-link :to="to">{{ label }}</router-link>
      </div>
    </route>
  `
}

const App = {
  data: () => ({ n: 0 }),
  components: {
    Route, 
    RouterLink,
    Home,
    About,
    OldSchoolMenuLink
  },
  template: `
    <div id="app">
      <h1>custom link</h1>
      <div>
        <old-school-menu-link active-only-when-exact to="/" label="home" />
        <old-school-menu-link to="/about" label="about" />
        <hr />
        <route exact path="/" >
          <home />
        </route>
        <route exact path="/about" >
          <about />
        </route>
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
  data() {
    const p = '/custom-link';
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
