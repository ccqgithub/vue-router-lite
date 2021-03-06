import Vue from 'vue'
import VueRouter from 'vue-router-lite'

Vue.use(VueRouter)

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
    Topic
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

      <route 
        :path="match.path + '/:topicId'" 
        v-slot="{ match }"
      >
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
  data: () => {
    return {
      //
    }
  },
  components: {
    Topics,
    About,
    Home
  },
  template: `
    <div id="app">
      <h1>Basic: BrowserRouter</h1>
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
      
      <route exact path="/" v-slot="props">
        <home v-bind="props"/>
      </route>
      <route path="/about" v-slot="props">
        <about v-bind="props"/>
      </route>
      <route path="/topics" v-slot="props">
        <topics v-bind="props"/>
      </route>
    </div>
  `,

  methods: {
    //
  }
}

new Vue({
  components: {
    App
  },
  data() {
    const p = '/basic';
    const basename = location.pathname.split(p)[0] + p + '/';
    return {
      basename
    }
  },
  template: `
    <browser-router :basename="basename">
      <app />
    </browser-router>
  `
}).$mount('#app')
