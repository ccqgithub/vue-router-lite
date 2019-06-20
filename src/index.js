import Router from './component/Router.vue';
import MemoryRouter from './component/MemoryRouter.vue';
import HashRouter from './component/HashRouter.vue';
import BrowserRouter from './component/BrowserRouter.vue';
import StaticRouter from './component/StaticRouter.vue';
import Route from './component/Route.vue';
import Prompt from './component/Prompt.vue';
import Redirect from './component/Redirect.vue';
import RouterLink from './component/RouterLink.vue';
import RouterRef from './component/RouterRef.vue';
import MatchFirst from './util/MatchFirst';
import generatePath from './util/generatePath';
import matchPath from './util/matchPath';
import createBrowserHistory from './util/createBrowserHistory';
import createHashHistory from './util/createHashHistory';
import createMemoryHistory from './util/createMemoryHistory';
import createStaticHistory from './util/createStaticHistory';

export {
  Router,
  MemoryRouter,
  HashRouter,
  BrowserRouter,
  StaticRouter,
  Prompt,
  Redirect,
  Route,
  RouterLink,
  RouterRef,
  MatchFirst,
  generatePath,
  matchPath,
  createBrowserHistory,
  createHashHistory,
  createMemoryHistory,
  createStaticHistory
};
