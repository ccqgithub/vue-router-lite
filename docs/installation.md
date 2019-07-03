# Installation

## npm

``` bash
npm install vue-router-lite
```

You need to import the components from 'vue-router-lite' and use them just as other vue components.

```js
import Vue from 'vue';
import {
  // components
  BrowserRouter,
  HashRouter,
  MemoryRouter,
  StaticRouter,
  Router,
  RouterLink,
  Prompt,
  Redirect,
  Route,
  RouteContext,
  RouteSwitch,

  // methods
  generatePath,
  matchPath,
  createBrowserHistory,
  createHashHistory,
  createMemoryHistory,
  createStaticHistory
} from 'vue-router-lite';
```

You don't need to do this when using global script tags.

## Dev Build

You will have to clone directly from GitHub and build `vue-router-lite` yourself if
you want to use the latest dev build.

``` bash
git clone https://github.com/ccqgithub/vue-router-lite node_modules/vue-router-lite
cd node_modules/vue-router
npm install
npm run build
```
