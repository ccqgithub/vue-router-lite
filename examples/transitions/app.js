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
    Route,
    Default,
    Foo,
    Bar
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
      <route :path="match.url" exact key="default" v-slot="props">
        <default v-bind="props"/>
      </route>
      <route :path="match.url + '/foo'" key="foo" v-slot="props">
        <foo v-bind="props"/>
      </route>
      <route :path="match.url + '/bar'" key="bar" v-slot="props">
        <bar v-bind="props"/>
      </route>
    </div>
  `
}

const App = {
  components: {
    RouterLink,
    Route,
    MatchFirst,
    Home,
    Parent
  },
  props: {
    history: Object
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
          <route path="/" key="home" exact v-slot="props">
            <home v-bind="props"/>
          </route>
          <route path="/parent" key="parent" v-slot="props">
            <parent v-bind="props"/>
          </route>
        </match-first>
      </transition>
    </div>
  `
};

new Vue({
  components: {
    Router,
    App
  },
  template: `
    <router basename="/transitions/" v-slot="props">
      <app v-bind="props"/>
    </router>
  `
}).$mount('#app')
