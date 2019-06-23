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
      <div><input /></div>
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
      <div><input /></div>
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

      <input />

      <hr />

      <route 
        :path="match.path + '/:topicId'" 
        v-slot="{ match }"
      >
        <topic :topic-id="match.params.topicId" :key="match.params.topicId" />
      </route>
      <route
        exact
        :path="match.path"
        v-slot="props"
      >
        <h3 v-if="props.match">Please select a topic. <input /></h3>
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
    Route, 
    RouterLink,
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

      
      <route path="/about" v-slot="props" force-render>
        <keep-alive>
          <about v-bind="props" v-if="props.match" />
        </keep-alive>
      </route>
      
      <route path="/topics" v-slot="props" force-render>
        <keep-alive>
          <topics v-bind="props" v-if="props.match" />
        </keep-alive>
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
    <router basename="/keep-alive/">
      <app />
    </router>
  `
}).$mount('#app')
