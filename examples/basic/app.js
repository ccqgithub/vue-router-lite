import Vue from 'vue'
import { BrowserRouter as Router, Route, RouterLink } from 'vue-router-lite'

// 2. Define route components
const Home = { template: '<div>home<input /></div>' }
const Foo = { template: '<div>foo<input /></div>' }
const Bar = { template: '<div>bar<input /></div>' }
const Unicode = { template: '<div>unicode<input /></div>' }

const Topic = {
  props: {
    match: {
      type: Object,
      required: true
    }
  },
  template: `
    <div>
      <h3>{{ match.params.topicId }}</h3>
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

      <route keep-alive :path="match.path + '/:topicId'">
        <template v-slot:default="{ match }">
          <topic :match="match" :key="match.url" />
        </template>
      </route>
      <route
        exact
        :path="match.path"
      >
        <h3>Please select a topic.</h3>
        <div><input /></div>
      </route>
    </div>
  `
}

// 4. Create and mount root instance.
// Make sure to inject the router.
// Route components will be rendered inside <router-view>.
const App = {
  data: () => ({ n: 0 }),
  components: {
    Route, 
    RouterLink,
    Home,
    Foo,
    Bar,
    Unicode,
    Topics
  },
  template: `
    <div id="app">
      <h1>Basic</h1>
      <div><input /></div>
      <ul>
        <li><router-link to="/">/</router-link></li>
        <li><router-link to="/foo">/foo</router-link></li>
        <li><router-link to="/bar">/bar</router-link></li>
        <li><router-link to="/topics">/topics</router-link></li>
        <router-link tag="li" to="/bar">
          <a>/bar</a>
        </router-link>
        <li><router-link to="/é">/é</router-link></li>
        <li><router-link to="/é?t=%25ñ">/é?t=%ñ</router-link></li>
        <li><router-link to="/é#%25ñ">/é#%25ñ</router-link></li>
      </ul>
      
      <route keep-alive exact path="/">
        <home />
      </route>
      <route exact path="/foo">
        <foo />
      </route>
      <route exact path="/bar">
        <bar />
      </route>
      <route exact path="/é">
        <unicode />
      </route>
      <route keep-alive path="/topics">
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
    <router basename="/basic/">
      <app />
    </router>
  `
}).$mount('#app')
