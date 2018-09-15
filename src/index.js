import Router from './component/Router.vue';
import MemoryRouter from './component/MemoryRouter.vue';
import HashRouvter from './component/HashRouter.vue';
import BrowserRouter from './component/BrowserRouter.vue';
import StaticRouter from './component/StaticRouter.vue';
import Route from './component/Route.vue';
import Prompt from './component/Prompt.vue';
import Redirect from './component/Redirect.vue';
import Link from './component/Link.vue';
import NavLink from './component/NavLink.vue';
import Switch from './util/Switch';
import generatePath from './util/generatePath';
import matchPath from './util/matchPath';
import withRouter from './util/withRouter';

export {
  Router,
  MemoryRouter,
  HashRouvter,
  BrowserRouter,
  StaticRouter,
  Prompt,
  Redirect,
  Route,
  Link,
  NavLink,
  Switch,
  generatePath,
  matchPath,
  withRouter,
};
