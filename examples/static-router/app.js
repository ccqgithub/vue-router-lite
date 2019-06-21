import Vue from 'vue'
import { StaticRouter as Router, Route, RouterLink } from 'vue-router-lite'

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
          <router-link :to="match.url + '/rendering'">
            <template v-slot:default="{ href }">
              Rendering: {{href}}
            </template>
          </router-link>
        </li>
        <li>
          <router-link :to="match.url + '/components'">
            <template v-slot:default="{ href }">
              Components: {{href}}
            </template>
          </router-link>
        </li>
        <li>
          <router-link :to="match.url + '/props-v-state'">
            <template v-slot:default="{ href }">
              Props v. State: {{href}}
            </template>
          </router-link>
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
      <h1>StaticRouter</h1>
      <div>StaticRouter can not click to navigate, copy the href to address bar.</div>
      <ul>
        <li>
          <router-link to="/">
            <template v-slot:default="{ href }">
              Home: {{href}}
            </template>
          </router-link>
        </li>
        <li>
          <router-link to="/about">
            <template v-slot:default="{ href }">
              About: {{href}}
            </template>
          </router-link>
        </li>
        <li>
          <router-link to="/topics">
            <template v-slot:default="{ href }">
              Topics: {{href}}
            </template>
          </router-link>
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
  data() {
    return {
      context: {},
      location: {
        pathname: window.location.pathname
      }
    }
  },
  template: `
    <router basename="/static-router/" :location="location" :context="context">
      <app />
    </router>
  `
}).$mount('#app')
