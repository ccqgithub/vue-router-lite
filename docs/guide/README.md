# Getting Started

> `vue-router-lite` is a component-based router for vue.js, so all the features of it can do with it's components, just like use ohter general components.

## Use Components

### Global Registration

If you use `Vue.use` to `Global Registration` like this, you can use those components directly:

```js
import Vue from 'vue'
import VueRouter from 'vue-router-lite'

// register the components to global
Vue.use(VueRouter)
```

It will install itself automatically when using global script tags.

### Manual import

If you use `vue-router-lite` with package tools like `webpack` and `npm`, you can manual import these components and use them.

```js
import Vue from 'vue'
import { BrowserRouter, Route, RouterLink, RouteSwitch } from 'vue-router-lite'

new Vue({
  components: {
    BrowserRouter,
    Route,
    RouterLink,
    RouteSwitch
  }
})
```

## HTML

```html
<script src="https://unpkg.com/vue/dist/vue.js"></script>
<script src="https://unpkg.com/vue-router-lite/dist/vue-router-lite.umd.js"></script>

<browser-router v-slot="{ history, location, match }" id="app">
  <div>
    <h1>Hello App!</h1>
    <p>
      <!-- use router-link component for navigation. -->
      <!-- specify the link by passing the `to` prop. -->
      <!-- `<router-link>` will be rendered as an `<a>` tag by default -->
      <router-link to="/">Go to Foo</router-link>
      <router-link to="/about">Go to Bar</router-link>
      <router-link to="/xxxx">Go to Bar</router-link>
    </p>

    <!-- routes -->
    <route-switch>
      <route path="/" exact v-slot="{ history, location, match }">
        <div>
          <h2>Home</h2>
          matched url: {{ match.url }}
        </div>
      </route>
      <route path="/about" v-slot="{ history, location, match }">
        <div>
          <h2>About</h2>
          matched url: {{ match.url }}
        </div>
      </route>
      <route v-slot="{ history, location, match }">
        <div>
          <h2>Other</h2>
          matched url: {{ match.url }}
        </div>
      </route>
    </route-switch>
  </div>
</browser-router>
```

## JavaScript

```js
const app = new Vue({
  el: '#app'
});
```

The `<router>`, `<browser-router>`, `<hash-router>`, `<memory-router>`, `<static-router>`, `<route>` will use [Scoped Slot Props](https://vuejs.org/v2/guide/components-slots.html#Scoped-Slots) to provide the route info.

```html
<route path="/" exact v-slot="{ history, location, match }">
  ...
</route>
```

Notice that a `<router-link>` automatically gets the .router-link-active class when its target route is matched. You can learn more about it in its [API reference](./api/).

You can also check out this example [live](https://jsfiddle.net/SeasonChen/akeh2fp7/7/).