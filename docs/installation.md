# Installation

## Direct Download / CDN

[https://unpkg.com/vue-router-lite/dist/vue-router-lite.umd.js](https://unpkg.com/vue-router-lite/dist/vue-router-lite.umd.js)

<!--email_off-->
[Unpkg.com](https://unpkg.com) provides npm-based CDN links. The above link will always point to the latest release on npm. You can also use a specific version/tag via URLs like `https://unpkg.com/vue-router-lite@1.2.1/dist/vue-router-lite.umd.js`.
<!--/email_off-->

Include `vue-router-lite` after Vue and it will install itself automatically:

``` html
<script src="/path/to/vue.js"></script>
<script src="/path/to/vue-router-lite.umd.js"></script>
```

## Npm

``` bash
npm install vue-router-lite
```

## Use

There are two ways to use the `vue-router-lite`'s components.

### `Global Registration` via `Vue.use()`

> You don't need to do `Vue.use()` when using global script tags.

``` js
import Vue from 'vue'
import VueRouter from 'vue-router-lite'

// register the components to global
Vue.use(VueRouter)

// then use the components directly
new Vue({
  el: '#app',
  template: `
    <browser-router basename="/app/">
      <div id="app">
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
    </browser-router>
  `
});
```

### Local Registration

```js
import Vue from 'vue'
import { BrowserRouter as Router, Route, RouterLink } from 'vue-router-lite'

// then use the components directly
new Vue({
  components: {
    Router,
    Route,
    RouterLink
  },
  el: '#app',
  template: `
    <router basename="/app/">
      <div id="app">
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
    </router>
  `
});
```

## Dev Build

You will have to clone directly from GitHub and build `vue-router-lite` yourself if
you want to use the latest dev build.

``` bash
git clone https://github.com/ccqgithub/vue-router-lite/.git node_modules/vue-router-lite
cd node_modules/vue-router-lite
npm install
npm run build
```
