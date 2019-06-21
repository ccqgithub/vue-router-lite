import Vue from 'vue'
import { MemoryRouter as Router, Route, RouterLink } from 'vue-router-lite'

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

      <route :path="match.path + '/:topicId'">
        <template v-slot:default="{ match }">
          <topic :topic-id="match.params.topicId" />
        </template>
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
      <h1>MemoryRouter</h1>
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
      <route path="/topics">
        <template v-slot:default="{ match }">
          <topics :match="match" />
        </template>
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
  template: `
    <router basename="/memory-router/">
      <app />
    </router>
  `
}).$mount('#app')
