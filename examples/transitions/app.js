import Vue from 'vue'
import { BrowserRouter as Router, Route, RouterLink, MatchFirst } from 'vue-router-lite'

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
      // transitionName: 'slide-left',
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
      <route :path="match.url" exact :component="components.Default" key="default" />
      <route :path="match.url + '/foo'" :component="components.Foo" key="foo" />
      <route :path="match.url + '/bar'" :component="components.Bar" key="bar" />
    </div>
  `
}

const App = {
  components: {
    RouterLink,
    Route,
    MatchFirst
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
      <transition :name="transitionName">
        <match-first>
          <route path="/" :component="Home" key="home" exact />
          <route path="/parent" :component="Parent" key="parent" />
        </match-first>
      </transition>
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
