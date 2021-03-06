import Vue from 'vue'
import { Router, Route, RouterLink, createBrowserHistory } from 'vue-router-lite'

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

const Topic = {
  props: {
    topicId: {
      type: String,
      required: true
    }
  },
  template: `
    <div>
      <h3>{{ topicId }}</h3>
    </div>
  `
}

const Topics = {
  components: {
    RouterLink,
    Topic,
    Route
  },
  props: {
    match: {
      type: Object,
      required: true
    }
  },
  mounted() {
    // console.log(this.match)
  },
  template: `
    <div>
      <h2>Topics</h2>
      <ul>
        <li>
          <router-link :to="match.url + '/rendering'">Rendering</router-link>
        </li>
        <li>
          <router-link :to="match.url + '/components'">Components</router-link>
        </li>
        <li>
          <router-link :to="match.url + '/props-v-state'">Props v. State</router-link>
        </li>
      </ul>

      <route :path="match.path + '/:topicId'" v-slot:default="{ match }">
        <topic :topic-id="match.params.topicId" />
      </route>
      <route
        exact
        :path="match.path"
      >
        <h3>Please select a topic.</h3>
      </route>
    </div>
  `
}

const App = {
  data: () => ({ n: 0 }),
  components: {
    Route, 
    RouterLink,
    Home,
    About,
    Topics
  },
  template: `
    <div id="app">
      <h1>Control History: Router</h1>
      <div>Redirect to topics after 5 seconds.</div>
      <ul>
        <li>
          <router-link to="/">Home</router-link>
        </li>
        <li>
          <router-link to="/about">About</router-link>
        </li>
        <li>
          <router-link to="/topics">Topics</router-link>
        </li>
      </ul>

      <hr />
      
      <route exact path="/">
        <home />
      </route>
      <route path="/about">
        <about />
      </route>
      <route path="/topics" v-slot:default="{ match }">
        <topics :match="match" />
      </route>
    </div>
  `,

  methods: {
    //
  }
}

const p = '/control-history';
const basename = location.pathname.split(p)[0] + p + '/';
const history = createBrowserHistory({
  basename
})

new Vue({
  components: {
    App,
    Router
  },
  data() {
    return {
      history
    }
  },
  template: `
    <router :history="history">
      <app />
    </router>
  `
}).$mount('#app')

setTimeout(() => {
  history.push('/topics/rendering');
}, 5000);
