import Vue from 'vue'
import { BrowserRouter as Router, Route, RouterLink, RouteSwitch } from 'vue-router-lite'

const Home = { 
  template: `
    <div>
      <h2>Home</h2>
      <div><input /></div>
    </div>
  ` 
}

const Alive = { 
  template: `
    <div>
      <h2>Keep Alive Component</h2>
      <div><input /></div>
    </div>
  ` 
}

const AliveChild = {
  props: {
    id: {
      type: String,
      required: true
    }
  },
  template: `
    <div>
      <h3>Nested Keep Alive Child: {{ id }}</h3>
      <div><input /></div>
    </div>
  `
}

const NestAlive = {
  components: {
    RouteSwitch,
    RouterLink,
    Route,
    AliveChild
  },
  props: {
    match: {
      type: Object,
      required: true
    }
  },
  template: `
    <div>
      <h2>Nested Keep Alive Parent</h2>
      <ul>
        <li>
          <router-link :to="match.url + '/a'">Keep Alive Child A</router-link>
        </li>
        <li>
          <router-link :to="match.url + '/b'">Keep Alive Child B</router-link>
        </li>
        <li>
          <router-link :to="match.url + '/c'">Not Keep Alive Child C</router-link>
        </li>
      </ul>

      <input />

      <hr />

      <route-switch keep-alive>
        <route 
          :path="match.path + '/:id(a|b)'" 
          v-slot="{ match }"
        >
          <alive-child 
            :id="match.params.id" 
            :key="match.params.id" 
          />
        </route>
      </route-switch>

      <route 
        :path="match.path + '/:id(c)'" 
        v-slot="props"
      >
        <h3 v-if="props.match">
          without keep alive <input />
        </h3>
      </route>

      <route-switch keep-alive>
        <route
          exact
          :path="match.path"
          v-slot="props"
        >
          <h3 v-if="props.match">
            defautl route:
            <input />
          </h3>
        </route>
      </route-switch>
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
    RouteSwitch,
    Home,
    Alive,
    NestAlive
  },
  template: `
    <div id="app">
      <h1>Keep Alive (RouteSwitch)</h1>
      <ul>
        <li>
          <router-link to="/">Home</router-link>
        </li>
        <li>
          <router-link to="/alive">Keep Alive Route</router-link>
        </li>
        <li>
          <router-link to="/nest-alive">Nested Keep Alive Route</router-link>
        </li>
      </ul>

      <hr />
      
      <route-switch keep-alive>
        <route exact path="/" v-slot="props">
          <home v-bind="props"/>
        </route>

        <route path="/alive" v-slot="props">
          <alive v-bind="props"/>
        </route>
        
        <route path="/nest-alive" v-slot="props">
          <nest-alive v-bind="props" />
        </route>
      </route-switch>
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
    const p = '/keep-alive';
    const basename = location.pathname.split(p)[0] + p + '/';
    return {
      basename
    }
  },
  template: `
    <router :basename="basename">
      <app />
    </router>
  `
}).$mount('#app')
