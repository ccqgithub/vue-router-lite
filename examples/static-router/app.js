import Vue from 'vue'
import { StaticRouter as Router, Route, RouterLink } from 'vue-router-lite'

const Home = { 
  props: {
    history: Object
  },
  template: `
    <div>
      <h2>Home</h2>
      <div>Status Code: {{ history.context.statusCode }}</div>
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

const SetStatusCode = {
  functional: true,
  props: {
    code: String,
    history: Object
  },
  render(h, context) {
    const { history, code } = context.props;
    history.context.statusCode = code;
    return null;
  }
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
          <router-link :to="match.url + '/rendering'" v-slot:default="{ href }">
            Rendering: {{href}}
          </router-link>
        </li>
        <li>
          <router-link :to="match.url + '/components'" v-slot:default="{ href }">
            Components: {{href}}
          </router-link>
        </li>
        <li>
          <router-link :to="match.url + '/props-v-state'" v-slot:default="{ href }">
            Props v. State: {{href}}
          </router-link>
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
    Topics,
    SetStatusCode
  },
  template: `
    <div id="app">
      <h1>StaticRouter</h1>
      <div>StaticRouter can not click to navigate, copy the href to address bar.</div>
      <ul>
        <li>
          <router-link to="/" v-slot:default="{ href }">
            Home: {{href}}
          </router-link>
        </li>
        <li>
          <router-link to="/about" v-slot:default="{ href }">
            About: {{href}}
          </router-link>
        </li>
        <li>
          <router-link to="/topics" v-slot:default="{ href }">
            Topics: {{href}}
          </router-link>
        </li>
      </ul>

      <hr />

      <route v-slot="props">
        <set-status-code v-bind="props" code="404" />
      </route>
      
      <route exact path="/" v-slot="props">
        <home v-bind="props"/>
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

new Vue({
  components: {
    App,
    Router
  },
  data() {
    const p = '/static-router';
    const basename = location.pathname.split(p)[0] + p + '/';
    return {
      basename,
      context: {
        statusCode: 200
      },
      location: {
        pathname: window.location.pathname
      }
    }
  },
  template: `
    <router :basename="basename" :location="location" :context="context">
      <app />
    </router>
  `
}).$mount('#app')
