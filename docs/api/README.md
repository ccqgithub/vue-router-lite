---
sidebar: auto
---

# API Reference

<!-- <Bit/> -->

```js
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

const MyComponnet = {
  components: {
    BrowserRouter,
    // ...
  },
  template: `
    <browser-router>
      <app />
    </browser-router>
  `
}
```

## `<router>`

The common low-level interface for all router components. Typically apps will use one of the high-level routers instead:

- `<browser-router>`
- `<hash-router>`
- `<memory-router>`
- `<static-router>`

Their single slot child component will receive these props: `history`, `location`, `match`.

```js
  const history = createBrowserHistory({
    //...
  });

  new Vue({
    template: `
      <router
        :history="history"
        v-slot="{ history, location, match }"
      >
        <app v-bind="{ history, location, match }" />
      </router>
    `
  });
```

## `<router>` Props

### history

A [history](https://github.com/ReactTraining/history) object to use for navigation.

- Type: `History`
- Required


## `<browser-router>`

A `<router>` that uses the HTML5 history API (pushState, replaceState and the popstate event) to keep your UI in sync with the URL.

```html
  <browser-router
    basename="/"
    forceRefresh
    :keyLength="6"
    getUserConfirmation="getUserConfirmation"
    v-slot="{ history, location, match }"
  >
    <app :history="history" />
  </browser-router>
```

## `<browser-router>` Props

> Read `createBrowserHistory` section on [Hisotry](https://github.com/ReactTraining/history#usage) for more detail.

### basename

The base URL for all locations. If your app is served from a sub-directory on your server, you’ll want to set this to the sub-directory. A properly formatted basename should have a leading slash, but no trailing slash.

- Type: `String`
- Defaults: `''`

### getUserConfirmation

A function to use to confirm navigation.

- Type: `Function`
- Defaults: `window.confirm`

### forceRefresh

If true the router will use full page refreshes on page navigation. You probably only want this in browsers that don’t support the `HTML5 history API`.

- Type: `Boolean`
- Defaults: `false`

### keyLength

The length of location.key.

- Type: `Number`
Defaults: `6`


## `<hash-router>`

A `<router>` that uses the hash portion of the URL (i.e. window.location.hash) to keep your UI in sync with the URL.

**IMPORTANT NOTE**: Hash history does not support location.key or location.state.

```html
  <hash-router
    basename="/"
    hashType="slash"
    getUserConfirmation="getUserConfirmation"
    v-slot="{ history, location, match }"
  >
    <app :history="history" />
  </hash-router>
```

## `<hash-router>` Props

> Read `createHashHistory` section on [Hisotry](https://github.com/ReactTraining/history#usage) for more detail.

### basename

The base URL for all locations. A properly formatted basename should have a leading slash, but no trailing slash.

- Type: `String`
- Defaults: `''`

### hashType

The type of encoding to use for window.location.hash. Available values are:

- "slash" - Creates hashes like #/ and #/sunshine/lollipops
- "noslash" - Creates hashes like # and #sunshine/lollipops
- "hashbang" - Creates “ajax crawlable” (deprecated by Google) hashes like #!/ and #!/sunshine/lollipops

- Type: `String`
- Defaults: `slash`

### getUserConfirmation

A function to use to confirm navigation.

- Type: `Function`
- Defaults: `window.confirm`


## `<memory-router>`

A `<router>` that keeps the history of your “URL” in memory (does not read or write to the address bar). Useful in tests and non-browser environments.

```html
  <memory-router
    :initialEntries="['/']"
    :initialIndex="0"
    :keyLength="6"
    getUserConfirmation="getUserConfirmation"
    v-slot="{ history, location, match }"
  >
    <app :history="history" />
  </memory-router>
```

## `<memory-router>` Props

> Read `createMemoryHistory` section on [Hisotry](https://github.com/ReactTraining/history#usage) for more detail.

### initialEntries

An array of locations in the history stack. These may be full-blown location objects with { pathname, search, hash, state } or simple string URLs.

- Type: `[String | Location]`
- Defaults: `['/']`

### initialIndex

The initial location’s index in the array of initialEntries.

- Type: `Number`
- Defaults: `0`

### keyLength

The length of location.key.

- Type: `Number`
- Defaults: `6`

### getUserConfirmation

A function to use to confirm navigation. You must use this option when using `<memory-router>` directly with a `<prompt>`.

- Type: `Function`
- Defaults: `window.confirm`


## `<static-router>`

A `<router>` that never changes location.

```html
  <static-router
    basename="/"
    :context="{}"
    :location="{ pathname: '/bubblegum' }"
    v-slot="{ history, location, match }"
  >
    <app :history="history" />
  </static-router>
```

## `<static-router>` Props

### basename

The base URL for all locations. A properly formatted basename should have a leading slash, but no trailing slash.

- Type: `String`
- Defaults: `''`

### context

A plain JavaScript object. During the render, components can add properties to the object to store information about the render.

- Type: `Object`
- Defaults: `{}`

### location

The URL the server received, probably req.url on a node server. Or a location object shaped like { pathname, search, hash, state }

- Type: `[String | Location]`
- Defaults: `'/'`