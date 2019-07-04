import Vue from 'vue'
import { BrowserRouter as Router, Route, RouterLink } from 'vue-router-lite'

// wrap <route> and use this everywhere instead, then when
// sub routes are added to any route it'll work
const RouteWithSubRoutes = {
  components: {
    Route
  },
  props: {
    route: Object
  },
  computed: {
    routeConfig() {
      const { path, component, routes, otherProps } = this.route;
      return { path, component, routes, otherProps };
    }
  },
  methods: {
    mergeObject(propsA, propsB) {
      return {
        ...propsA,
        ...propsB
      };
    }
  },
  template: `
    <route :path="routeConfig.path" v-slot="slotProps">
      <component 
        :is="routeConfig.component" 
        v-bind="mergeObject(routeConfig.otherProps, slotProps)"
        :routes="routeConfig.routes"
      />
    </route>
  `
}

const Sandwiches = {
  template: `
    <h2>Sandwiches</h2>
  `
}

const Bus = {
  template: `
    <h3>Bus</h3>
  `
}

const Cart = {
  template: `
    <h3>Cart</h3>
  `
}

const Tacos = {
  components: {
    RouterLink,
    Route,
    RouteWithSubRoutes
  },
  props: {
    routes: Array,
    default: () => []
  },
  template: `
    <div>
      <h2>Tacos</h2>
      <ul>
        <li>
          <router-link to="/tacos/bus">Bus</router-link>
        </li>
        <li>
          <router-link to="/tacos/cart">Cart</router-link>
        </li>
      </ul>

      <route-with-sub-routes 
        v-for="(item, i) in routes" 
        :key="i" 
        :route="item" 
      />
    </div>
  `
}

const routes = [
  {
    path: "/sandwiches",
    component: Sandwiches
  },
  {
    path: "/tacos",
    component: Tacos,
    routes: [
      {
        path: "/tacos/bus",
        component: Bus
      },
      {
        path: "/tacos/cart",
        component: Cart
      }
    ]
  }
];

const App = {
  data: () => {
    return {
      routes
    }
  },
  components: {
    Route, 
    RouterLink,
    RouteWithSubRoutes
  },
  template: `
    <div id="app">
      <h1>Route Config</h1>
      <div>
        <ul>
          <li>
            <router-link to="/tacos">Tacos</router-link>
          </li>
          <li>
            <router-link to="/sandwiches">Sandwiches</router-link>
          </li>
        </ul>


        <route-with-sub-routes 
          v-for="(item, i) in routes" 
          :key="i" 
          :route="item"
        />
      </div>
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
    const p = '/route-config';
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
