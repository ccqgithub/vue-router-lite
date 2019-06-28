---
sidebar: auto
---

# API Reference

All `component`s or `method`s can import as below：

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

const App = {
  components: {
    BrowserRouter,
    Route,
    RouterLink,
    RouteSwitch
    //
    Home,
    About,
    Topics
  },
  template: `
    <browser-router>
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

        <route-switch>
          <route exact path="/" v-slot="{ history, location, match }">
            <home v-bind="{ history, location, match }"/>
          </route>
          <route path="/about" v-slot="props">
            <about v-bind="props"/>
          </route>
          <route path="/topics" v-slot="props">
            <topics v-bind="props"/>
          </route>
        </route-switch>
      </div>
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

All the router components must have a single slot child, that will receive these props:

- `history`
- `location`
- `match`

```js
  const history = createBrowserHistory({
    basename: '/',
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

Props:

### history

- Type: `History`
- Required

A [history](https://github.com/ReactTraining/history) object to use for navigation.


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

Props: read `createBrowserHistory` section on [Hisotry](https://github.com/ReactTraining/history#usage) for more details.

### basename

- Type: `String`
- Defaults: `''`

The base URL for all locations. If your app is served from a sub-directory on your server, you’ll want to set this to the sub-directory. A properly formatted basename should have a leading slash, but no trailing slash (like `/basename`).

### getUserConfirmation

- Type: `Function`

A function to use to confirm navigation. Defaults to using `window.confirm` like below.

```js
// this is the default behavior
function getConfirmation(message, callback) {
  const allowTransition = window.confirm(message);
  callback(allowTransition);
}
```

### forceRefresh

- Type: `Boolean`
- Defaults: `false`

If true the router will use full page refreshes on page navigation. You probably only want this in browsers that don’t support the `HTML5 history API`.

### keyLength

- Type: `Number`
- Defaults: `6`

The length of location.key. Read more details on [location.key](https://github.com/ReactTraining/history#listening).


## `<hash-router>`

A `<router>` that uses the hash portion of the URL (i.e. window.location.hash) to keep your UI in sync with the URL.

**IMPORTANT NOTE**: Hash history does not support `location.key` or `location.state`.

> Read `createHashHistory` section on [Hisotry](https://github.com/ReactTraining/history#usage) for more details.

```html
  <hash-router
    basename="/"
    hashType="slash"
    :getUserConfirmation="getUserConfirmation"
    v-slot="{ history, location, match }"
  >
    <app :history="history" />
  </hash-router>
```

Props:

### basename

- Type: `String`
- Defaults: `''`

The base URL for all locations. A properly formatted basename should have a leading slash, but no trailing slash (like '/basename').

### hashType

- Type: `String`
- Defaults: `'slash'`

The type of encoding to use for window.location.hash. Available values are:

- "slash" - Creates hashes like `#/` and `#/sunshine/lollipops`
- "noslash" - Creates hashes like `#` and `#sunshine/lollipops`
- "hashbang" - Creates “ajax crawlable” (deprecated by Google) hashes like `#!/` and `#!/sunshine/lollipops`

### getUserConfirmation

- Type: `Function`

A function to use to confirm navigation. Defaults to using `window.confirm` like below.

```js
// this is the default behavior
function getConfirmation(message, callback) {
  const allowTransition = window.confirm(message);
  callback(allowTransition);
}
```


## `<memory-router>`

A `<router>` that keeps the history of your “URL” in memory (does not read or write to the address bar). Useful in tests and non-browser environments.

> Read `createMemoryHistory` section on [Hisotry](https://github.com/ReactTraining/history#usage) for more details.

```html
  <memory-router
    :initialEntries="['/']"
    :initialIndex="0"
    :keyLength="6"
    :getUserConfirmation="getUserConfirmation"
    v-slot="{ history, location, match }"
  >
    <app :history="history" />
  </memory-router>
```

Props:

### initialEntries

- Type: `[String | Location]`
- Defaults: `['/']`

An array of locations in the history stack. These may be full-blown `location` objects with { pathname, search, hash, state } or simple string URLs.

### initialIndex

- Type: `Number`
- Defaults: `0`

The initial location’s index in the array of initialEntries.

### keyLength

- Type: `Number`
- Defaults: `6`

The length of location.key.

### getUserConfirmation

- Type: `Function`
- Defaults: `null`

A function to use to confirm navigation. You must use this option when using `<memory-router>` directly with a `<prompt>`.


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

Props:

### basename

- Type: `String`
- Defaults: `''`

The base URL for all locations. A properly formatted basename should have a leading slash, but no trailing slash (like `/basename`).

### context

- Type: `Object`
- Defaults: `{}`

A plain JavaScript object. During the render, components can add properties to the object to store information about the render.

### location

- Type: `[String | Location]`
- Defaults: `'/'`

The URL the server received, probably `req.url` on a node server. Or a `location` object shaped like `{ pathname, search, hash, state }`.


## `<route>`

The `<route>` component is perhaps the most important component in `vue-router-lite` to understand and learn to use well. Its most basic responsibility is to render some UI when a location matches the route’s path.

The `<route>` component must have a single slot child, that will receive these props:

- `history`
- `location`
- `match`

Consider the following code:

```js
import { BrowserRouter as Router, Route } from 'vue-route-lite';

const App = {
  components: {
    Router,
    Route
  },
  template: `
    <router>
      <div>
        <route exact path="/" v-slots="slotProps">
          <home v-bind="slotProps"/>
        </route>
        <route path="/news" v-slots="slotProps">
          <news-feed v-bind="slotProps"/>
        </route>
      </div>
    </router>
  `
}
```

If the location of the app is `/` then the UI hierarchy will be something like:

```html
<div>
  <home/>
  <!-- news-feed not render -->
</div>
```

And if the location of the app is `/news` then the UI hierarchy will be:

```html
<div>
  <!-- home not render -->
  <news-feed/>
</div>
```

Props:

### path

- Type: `String | String[]`

Any valid URL path or array of paths that [path-to-regexp@^3.0.0](https://github.com/pillarjs/path-to-regexp) understands.

Routes without a path always match.

### exact

- Type: `Boolean`,
- Defaults: `false`

When true, will only match if the path matches the location.pathname exactly.

path | location.pathname | exact | matches?
---- | --- | --- | ---
/one | /one/two | true | no
/one | /one/two | false | yes

### strict

- Type: `Boolean`,
- Defaults: `false`

When true, a path that has a trailing slash will only match a location.pathname with a trailing slash. This has no effect when there are additional URL segments in the location.pathname.

path | location.pathname | matches?
---- | --- | ---
/one/ | /one | no
/one/ | /one/ | yes
/one/ | /one/two | yes

Warning: strict can be used to enforce that a location.pathname has no trailing slash, but in order to do this both strict and exact must be true.

path | location.pathname | matches?
---- | --- | ---
/one | /one | yes
/one | /one/ | no
/one | /one/two | no

### sensitive

- Type: `Boolean`,
- Defaults: `true`

Whether the paths is case sensitive?

### forceRender

- Type: `Boolean`,
- Defaults: `true`

If true, the route component will always render whether matched, user can control the slot's show status.

```html
<route path="/home" force-render v-slot="{ match, history, location }">
  <home v-if="match" />
</route>
```

### location

- Type: `Location`

A `<route>` element tries to match its path to the current history location (usually the current browser URL). However, a location with a different pathname can also be passed for matching.

This is useful in cases when you need to match a `<route>` to a location other than the current history location.


## `<prompt>`

Used to prompt the user before navigating away from a page. When your application enters a state that should prevent the user from navigating away (like a form is half-filled out), render a `<prompt>`.

Props：

### when

- Type: `Boolean`,
- required

Instead of conditionally rendering a `<prompt>` behind a guard, you can always render it but pass `:when="true"` or `:when="false"` to prevent or allow navigation accordingly.

### message

- Type: `[Function | String]`,
- required

The message to prompt the user with when they try to navigate away.

If message is a function, it will be called with the next location and action the user is attempting to navigate to. Return a string to show a prompt to the user or true to allow the transition.


## `<redirect>`

Rendering a `<redirect>` will navigate to a new location. The new location will override the current location in the history stack, like server-side redirects (HTTP 3xx) do.

Props:

### from

- Type: `String`

A pathname to redirect from. Any valid URL path that [path-to-regexp@^3.0.0](https://github.com/pillarjs/path-to-regexp) understands. All matched URL parameters are provided to the pattern in to. Must contain all parameters that are used in to. Additional parameters not used by to are ignored.

### to

- Type: `[String | Location]`,
- required

The URL to redirect to. Any valid URL path that [path-to-regexp@^3.0.0](https://github.com/pillarjs/path-to-regexp) understands. All URL parameters that are used in to must be covered by from.

Or a location to redirect to. pathname can be any valid URL path that [path-to-regexp@^3.0.0](https://github.com/pillarjs/path-to-regexp) understands.

### push

- Type: `Boolean`,
- Defaults: `false`

When true, redirecting will push a new entry onto the history instead of replacing the current one.

### exact

- Type: `Boolean`,
- Defaults: `false`

Match from exactly; equivalent to `<route> exact`.

### strict

- Type: `Boolean`,
- Defaults: `false`

Match from exactly; equivalent to `<route> strict`.

### sensitive

- Type: `Boolean`,
- Defaults: `true`

Match from exactly; equivalent to `<route> sensitive`.


## `<route-switch>`

Renders the first child `<route>` or `<redirect>` that matches the location.

How is this different than just using a bunch of `<route>s`?

`<route-switch>` is unique in that it renders a route exclusively. In contrast, every `<route>` that matches the location renders inclusively. Consider this code:

```html
<route path="/about"><about /></route>
<Route path="/:user"><user /></route>
<Route><no-match /></route>
```

If the URL is `/about`, then `<about>`, `<user>`, and `<no-match>` will all render because they all match the path. This is by design, allowing us to compose `<route>s` into our apps in many ways, like sidebars and breadcrumbs, bootstrap tabs, etc.

Occasionally, however, we want to pick only one `<route>` to render. If we’re at `/about` we don’t want to also match `/:user` (or show our “404” page). Here’s how to do it with `<route-switch>`:

```html
<route-switch>
  <route exact path="/"><home /></route>
  <route path="/about"><about /></route>
  <route path="/:user"><user /></route>
  <route><no-match /></route>
</route-switch>
```

Now, if we’re at `/about`, `<switch>` will start looking for a matching `<route>`. `<route path="/about"/>` will match and `<route-switch>` will stop looking for matches and render `<about>`. Similarly, if we’re at `/michael` then `<user>` will render.

Props:

### location

- Type: `Location`

A `location` object to be used for matching children elements instead of the current history location (usually the current browser URL).


## `<router-link>`

Provides declarative, accessible navigation around your application.

Props:

### to

- Type: `String | Location`
- Required

A string representation of the location to link to, created by concatenating the location’s pathname, search, and hash properties.

Or an object that can have same properties of `Location`.

### replace

- Type: `Boolean`
- Defaults: `false`

When true, clicking the link will replace the current entry in the history stack instead of adding a new one.

### tag

- Type: `String`,
- Defaults: `'a'`

Sometimes we want `<router-link>` to render as another tag, e.g `<li>`. Then we can use tag prop to specify which tag to render to, and it will still listen to click events for navigation.

### exact

- Type: `Boolean`,
- Defaults: `false`

When true, the active class will only be applied if the location is matched exactly. See the `<route exact>` documentation for more information.

### strict

- Type: `Boolean`,
- Defaults: `false`

When true, the trailing slash on a location’s pathname will be taken into consideration when determining if the location matches the current URL. See the `<route strict>` documentation for more information.

### sensitive

- Type: `Boolean`,
- Defaults: `true`

Whether the paths is case sensitive. See the `<route sensitive>` documentation for more information.

### active-class

- Type: `String`,
- Defaults: `'router-link-active'`

Configure the active CSS class applied when the link is active.

### exact-active-class

- Type: `String`,
- Defaults: `'router-link-exact-active'`

Configure the active CSS class applied when the link is active with exact match.

### event

- Type: `String | String[]`,
- Defaults: `'click'`

Specify the event(s) that can trigger the link navigation.

### location

- Type: `location`

The `isActive` compares the current history location (usually the current browser URL). To compare to a different location, a location can be passed.


## history

The term “history” and "history object" in this documentation refers to the [history package](https://github.com/ReactTraining/history), which is one of only 2 major dependencies of `vue-route-lite`, and which provides several different implementations for managing session history in JavaScript in various environments.

The following terms are also used:

- “browser history” - A DOM-specific implementation, useful in web browsers that support the HTML5 history API
- “hash history” - A DOM-specific implementation for legacy web browsers
- “memory history” - An in-memory history implementation, useful in testing and non-DOM environments.

history objects typically have the following properties and methods:

- length - (number) The number of entries in the history stack
- action - (string) The current action (PUSH, REPLACE, or POP)
- location - (object) The current location. May have the following properties:
  - pathname - (string) The path of the URL
  - search - (string) The URL query string
  - hash - (string) The URL hash fragment
  - state - (object) location-specific state that was provided to e.g. push(path, state) when this location was pushed onto the stack. Only available in browser and memory history.
- push(path, [state]) - (function) Pushes a new entry onto the history stack
- replace(path, [state]) - (function) Replaces the current entry on the history stack
- go(n) - (function) Moves the pointer in the history stack by n entries
- goBack() - (function) Equivalent to go(-1)
- goForward() - (function) Equivalent to go(1)
- block(prompt) - (function) Prevents navigation (see the [history docs](https://github.com/ReactTraining/history#blocking-transitions))

### history is mutable

The history object is mutable. Therefore it is recommended to access the location from the slot props of `<route>`, not from history.location.

## location

Locations represent where the app is now, where you want it to go, or even where it was. It looks like this:

```js
{
  key: 'ac3df4', // not with HashHistory!
  pathname: '/somewhere'
  search: '?some=search-string',
  hash: '#howdy',
  state: {
    [userDefined]: true
  }
}
```

The router will provide you with a location object in a few places:

- `<router v-slot="{ history, location, match }"> <app /> </router>`
- `<route v-slot="{ history, location, match }"> <page /> </route>`

## match

A match object contains information about how a `<route path>` matched the URL. match objects contain the following properties:

- params - (object) Key/value pairs parsed from the URL corresponding to the dynamic segments of the path
- isExact - (boolean) true if the entire URL was matched (no trailing characters)
- path - (string) The path pattern used to match. Useful for building nested `<route>`s
- url - (string) The matched portion of the URL. Useful for building nested `<router-link>`s

You’ll have access to match objects in various places:

- `<router v-slot="{ history, location, match }"> <app /> </router>`
- `<route v-slot="{ history, location, match }"> <page /> </route>`

If a Route does not have a path, and therefore always matches, you’ll get the closest parent match. Same goes for withRouter.

## createBrowserHistory

Read `createBrowserHistory` section on [Hisotry](https://github.com/ReactTraining/history#usage) for more details.

Useful in use with `<router :history="history">`

## createHashHistory

Read `createHashHistory` section on [Hisotry](https://github.com/ReactTraining/history#usage) for more details.

Useful in use with `<router :history="history">`


## createMemoryHistory

Read `createMemoryHistory` section on [Hisotry](https://github.com/ReactTraining/history#usage) for more details.

Useful in use with `<router :history="history">`

## createStaticHistory

Read `createStaticHistory` section on [Hisotry](https://github.com/ReactTraining/history#usage) for more details.

Useful in use with `<router :history="history">`

## matchPath

This lets you use the same matching code that `<route>` uses except outside of the normal render cycle, like gathering up data dependencies before rendering on the server.

`const match = matchPath(pathname, props)`.

```js
import { matchPath } from "vue-router-lite";

const match = matchPath("/users/123", {
  path: "/users/:id",
  exact: true,
  strict: false,
  sensitive: true
});
```

### pathname

The first argument is the pathname you want to match. If you’re using this on the server with Node.js, it would be req.path.

### props

The second argument are the props to match against, they are identical to the matching props Route accepts:

```js
{
  path, // like /users/:id; either a single string or an array of strings
  strict, // optional, defaults to false
  exact, // optional, defaults to false
  sensitive, // optional, defaults to true
}
```

### returns

It returns an object when provided pathname does match path prop or null otherwise.


## generatePath

generate a path with a `path` and `params`.

```js
const pathname = generatePath('/user/:id', { id: 123 });
```

Read more details at [path-to-regexp compile](https://github.com/pillarjs/path-to-regexp#compile-reverse-path-to-regexp);