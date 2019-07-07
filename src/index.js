import MemoryRouter from './component/MemoryRouter.vue';
import HashRouter from './component/HashRouter.vue';
import BrowserRouter from './component/BrowserRouter.vue';
import StaticRouter from './component/StaticRouter.vue';
import Router from './component/Router.vue';
import RouterLink from './component/RouterLink.vue';
import Prompt from './component/Prompt.vue';
import Redirect from './component/Redirect.vue';
import Route from './component/Route.vue';
import RouteContext from './component/RouteContext.vue';
import RouteSwitch from './component/RouteSwitch.vue';

import generatePath from './util/generatePath';
import matchPath from './util/matchPath';
import createBrowserHistory from './util/createBrowserHistory';
import createHashHistory from './util/createHashHistory';
import createMemoryHistory from './util/createMemoryHistory';
import createStaticHistory from './util/createStaticHistory';

export {
  MemoryRouter,
  HashRouter,
  BrowserRouter,
  StaticRouter,
  Router,
  RouterLink,
  Prompt,
  Redirect,
  Route,
  RouteContext,
  RouteSwitch,
  
  generatePath,
  matchPath,
  createBrowserHistory,
  createHashHistory,
  createMemoryHistory,
  createStaticHistory
};

const install = function(Vue) {
  [
    MemoryRouter,
    HashRouter,
    BrowserRouter,
    StaticRouter,
    Router,
    RouterLink,
    Prompt,
    Redirect,
    Route,
    RouteContext,
    RouteSwitch,
  ].map(component => {
    Vue.component(component.name, component);
  });
};

/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export default {
  version: '__VERSION__',
  install
}