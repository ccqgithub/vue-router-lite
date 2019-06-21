import Vue from 'vue'
import { BrowserRouter as Router, Route, RouterLink } from 'vue-router-lite'

const Home = {
  template: `
    <div class="home">
      <h2>Home</h2>
      <p>hello</p>
    </div>
  `
}

const Default = { template: '<div class="default">default</div>' }
const Foo = { template: '<div class="foo">foo</div>' }
const Bar = { template: '<div class="bar">bar</div>' }

const Parent = {
  props: {
    history: Object,
    match: Object
  },
  components: {
    RouterLink,
    Route
  },
  data () {
    return {
      transitionName: 'slide-left',
      components: {
        Default,
        Foo,
        Bar
      }
    }
  },
  computed: {
    transitionName() {
      if (this.history.action === 'REPLACE') return 'fade';
      if (this.history.action === 'PUSH') return 'slide-left';
      if (this.history.action === 'POP') return 'slide-right';
      return 'fade';
    }
  },
  template: `
    <div class="parent">
      <h2>Parent</h2>
      <transition-group :name="transitionName">
        <route :path="match.url" exact :component="Default" key="default" />
        <route :path="match.url + '/foo'" :component="Foo" key="foo" />
        <route :path="match.url + '/bar'" :component="Bar" key="bar" />
      </transition-group>
    </div>
  `
}

const App = {
  components: {
    RouterLink,
    Route
  },
  props: {
    history: Object
  },
  data() {
    return {
      Home,
      Parent
    }
  },
  created() {
    console.log('----')
  },
  computed: {
    transitionName() {
      if (this.history.action === 'REPLACE') return 'fade';
      if (this.history.action === 'PUSH') return 'slide-left';
      if (this.history.action === 'POP') return 'slide-right';
      return 'fade';
    }
  },
  template: `
    <div id="app">
      <h1>Transitions</h1>
      <ul>
        <li><router-link to="/">/</router-link></li>
        <li><router-link to="/parent">/parent</router-link></li>
        <li><router-link to="/parent/foo">/parent/foo</router-link></li>
        <li><router-link to="/parent/bar">/parent/bar</router-link></li>
      </ul>
      <transition-group :name="transitionName" tag="div">
        <route path="/" :component="Home" key="home" exact />
        <route path="/parent" :component="Parent" key="parent" />
      </transition-group>
    </div>
  `
};

new Vue({
  components: {
    Router
  },
  data() {
    return {
      App
    }
  },
  template: `
    <router basename="/transitions/" :component="App" />
  `
}).$mount('#app')
