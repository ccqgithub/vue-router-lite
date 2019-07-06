/*!
  * vue-router-lite v1.2.0
  * (c) 2019-present Season Chen
  * @license MIT
  */
import { createLocation, createMemoryHistory, createHashHistory, createBrowserHistory, createPath, locationsAreEqual } from 'history';
export { createBrowserHistory, createHashHistory, createMemoryHistory } from 'history';
import pathToRegexp from 'path-to-regexp';

function assert(condition, message) {
  if (!condition) {
    throw new Error(`[vue-router-lite] ${message}`);
  }
}

const resolveToLocation = (to, currentLocation) => typeof to === "function" ? to(currentLocation) : to; // 

const normalizeToLocation = (to, currentLocation) => {
  return typeof to === "string" ? createLocation(to, null, null, currentLocation) : to;
};
const guardEvent = e => {
  // don't redirect with control keys
  if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) return; // don't redirect when preventDefault called

  if (e.defaultPrevented) return; // don't redirect on right click

  if (e.button !== undefined && e.button !== 0) return; // don't redirect if `target="_blank"`

  if (e.currentTarget && e.currentTarget.getAttribute) {
    const target = e.currentTarget.getAttribute('target');
    if (/\b_blank\b/i.test(target)) return;
  } // this may be a Weex event which doesn't have this method


  if (e.preventDefault) {
    e.preventDefault();
  }

  return true;
};
function isAsyncPlaceholder(node) {
  return node.isComment && node.asyncFactory;
}
function isNotTextNode(c) {
  return c.tag || isAsyncPlaceholder(c);
}

const Router = {
  name: 'Router',
  props: {
    // history control
    history: {
      type: Object,
      required: true
    },
    // name for debug
    name: {
      type: String,
      default: 'router'
    }
  },

  provide() {
    return {
      router: this.router,
      route: this.route
    };
  },

  data() {
    return {
      // add provide's properties in data, to make provide reactivity 
      router: {
        history: this.history
      },
      // add provide's properties in data, to make provide reactivity 
      route: {
        location: this.history.location,
        match: this.computeMatch(this.history.location.pathname)
      }
    };
  },

  created() {
    const {
      history
    } = this;
    this.unlisten = history.listen(() => {
      this.route.location = history.location;
      this.route.match = this.computeMatch(history.location.pathname);
    });
  },

  befreDestory() {
    this.unlisten();
  },

  watch: {
    history(val, oldVal) {
      assert(false, `You cannot change <router>\'s history!`);
    }

  },
  methods: {
    computeMatch(pathname) {
      return {
        path: "/",
        url: "/",
        params: {},
        isExact: pathname === "/"
      };
    }

  },

  render(createElement) {
    let children = this.$scopedSlots.default({
      history: this.history,
      location: this.route.location,
      match: this.route.match
    });
    children = children.filter(isNotTextNode);
    assert(children.length === 1, `<${this.name}> must only be used on a single child element.`);
    return children[0];
  }

};

Router.install = function (Vue) {
  Vue.component(Router.name, Router);
};

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier
/* server only */
, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
  if (typeof shadowMode !== 'boolean') {
    createInjectorSSR = createInjector;
    createInjector = shadowMode;
    shadowMode = false;
  } // Vue.extend constructor export interop.


  var options = typeof script === 'function' ? script.options : script; // render functions

  if (template && template.render) {
    options.render = template.render;
    options.staticRenderFns = template.staticRenderFns;
    options._compiled = true; // functional template

    if (isFunctionalTemplate) {
      options.functional = true;
    }
  } // scopedId


  if (scopeId) {
    options._scopeId = scopeId;
  }

  var hook;

  if (moduleIdentifier) {
    // server build
    hook = function hook(context) {
      // 2.3 injection
      context = context || // cached call
      this.$vnode && this.$vnode.ssrContext || // stateful
      this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext; // functional
      // 2.2 with runInNewContext: true

      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__;
      } // inject component styles


      if (style) {
        style.call(this, createInjectorSSR(context));
      } // register component module identifier for async chunk inference


      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier);
      }
    }; // used by ssr in case component is cached and beforeCreate
    // never gets called


    options._ssrRegister = hook;
  } else if (style) {
    hook = shadowMode ? function () {
      style.call(this, createInjectorShadow(this.$root.$options.shadowRoot));
    } : function (context) {
      style.call(this, createInjector(context));
    };
  }

  if (hook) {
    if (options.functional) {
      // register for functional component in vue file
      var originalRender = options.render;

      options.render = function renderWithStyleInjection(h, context) {
        hook.call(context);
        return originalRender(h, context);
      };
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate;
      options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
    }
  }

  return script;
}

var normalizeComponent_1 = normalizeComponent;

/* script */
const __vue_script__ = Router;

/* template */

  /* style */
  const __vue_inject_styles__ = undefined;
  /* scoped */
  const __vue_scope_id__ = undefined;
  /* module identifier */
  const __vue_module_identifier__ = undefined;
  /* functional template */
  const __vue_is_functional_template__ = undefined;
  /* style inject */
  
  /* style inject SSR */
  

  
  var Router$1 = normalizeComponent_1(
    {},
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    undefined,
    undefined
  );

//
const MemoryRouter = {
  name: 'MemoryRouter',
  components: {
    Router: Router$1
  },
  props: {
    initialEntries: {
      type: Array,
      default: () => ['/']
    },
    initialIndex: {
      type: Number,
      default: 0
    },
    keyLength: {
      type: Number,
      default: 6
    },
    getUserConfirmation: {
      type: Function,
      default: null
    }
  },

  data() {
    let history = createMemoryHistory({
      initialEntries: this.initialEntries,
      initialIndex: this.initialIndex,
      keyLength: this.keyLength,
      getUserConfirmation: this.getUserConfirmation
    });
    return {
      history
    };
  }

};

MemoryRouter.install = function (Vue) {
  Vue.component(MemoryRouter.name, MemoryRouter);
};

/* script */
const __vue_script__$1 = MemoryRouter;

/* template */
var __vue_render__ = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("router", {
    attrs: { history: _vm.history, name: "memory-router" },
    scopedSlots: _vm._u(
      [
        {
          key: "default",
          fn: function(routerProps) {
            return [_vm._t("default", null, null, routerProps)]
          }
        }
      ],
      null,
      true
    )
  })
};
var __vue_staticRenderFns__ = [];
__vue_render__._withStripped = true;

  /* style */
  const __vue_inject_styles__$1 = undefined;
  /* scoped */
  const __vue_scope_id__$1 = undefined;
  /* module identifier */
  const __vue_module_identifier__$1 = undefined;
  /* functional template */
  const __vue_is_functional_template__$1 = false;
  /* style inject */
  
  /* style inject SSR */
  

  
  var MemoryRouter$1 = normalizeComponent_1(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__$1,
    __vue_script__$1,
    __vue_scope_id__$1,
    __vue_is_functional_template__$1,
    __vue_module_identifier__$1,
    undefined,
    undefined
  );

//
const HashRouter = {
  name: 'HashRouter',
  components: {
    Router: Router$1
  },
  props: {
    basename: {
      type: String,
      default: ''
    },
    hashType: {
      validator(value) {
        return ["hashbang", "noslash", "slash"].indexOf(value) !== -1;
      },

      default: 'slash'
    },
    getUserConfirmation: {
      type: Function,

      default(message, callback) {
        callback(window.confirm(message));
      }

    }
  },

  data() {
    let history = createHashHistory({
      basename: this.basename,
      hashType: this.hashType,
      getUserConfirmation: this.getUserConfirmation
    });
    return {
      history
    };
  }

};

HashRouter.install = function (Vue) {
  Vue.component(HashRouter.name, HashRouter);
};

/* script */
const __vue_script__$2 = HashRouter;

/* template */
var __vue_render__$1 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("router", {
    attrs: { history: _vm.history, name: "hash-router" },
    scopedSlots: _vm._u(
      [
        {
          key: "default",
          fn: function(routerProps) {
            return [_vm._t("default", null, null, routerProps)]
          }
        }
      ],
      null,
      true
    )
  })
};
var __vue_staticRenderFns__$1 = [];
__vue_render__$1._withStripped = true;

  /* style */
  const __vue_inject_styles__$2 = undefined;
  /* scoped */
  const __vue_scope_id__$2 = undefined;
  /* module identifier */
  const __vue_module_identifier__$2 = undefined;
  /* functional template */
  const __vue_is_functional_template__$2 = false;
  /* style inject */
  
  /* style inject SSR */
  

  
  var HashRouter$1 = normalizeComponent_1(
    { render: __vue_render__$1, staticRenderFns: __vue_staticRenderFns__$1 },
    __vue_inject_styles__$2,
    __vue_script__$2,
    __vue_scope_id__$2,
    __vue_is_functional_template__$2,
    __vue_module_identifier__$2,
    undefined,
    undefined
  );

//
const BrowserRouter = {
  name: 'BrowserRouter',
  components: {
    Router: Router$1
  },
  props: {
    basename: {
      type: String,
      default: ''
    },
    forceRefresh: {
      type: Boolean,
      default: false
    },
    keyLength: {
      type: Number,
      default: 6
    },
    getUserConfirmation: {
      type: Function,

      default(message, callback) {
        callback(window.confirm(message));
      }

    }
  },

  data() {
    let history = createBrowserHistory({
      basename: this.basename,
      forceRefresh: this.forceRefresh,
      keyLength: this.keyLength,
      getUserConfirmation: this.getUserConfirmation
    });
    return {
      history
    };
  }

};

BrowserRouter.install = function (Vue) {
  Vue.component(BrowserRouter.name, BrowserRouter);
};

/* script */
const __vue_script__$3 = BrowserRouter;

/* template */
var __vue_render__$2 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("router", {
    attrs: { history: _vm.history, name: "browser-router" },
    scopedSlots: _vm._u(
      [
        {
          key: "default",
          fn: function(routerProps) {
            return [_vm._t("default", null, null, routerProps)]
          }
        }
      ],
      null,
      true
    )
  })
};
var __vue_staticRenderFns__$2 = [];
__vue_render__$2._withStripped = true;

  /* style */
  const __vue_inject_styles__$3 = undefined;
  /* scoped */
  const __vue_scope_id__$3 = undefined;
  /* module identifier */
  const __vue_module_identifier__$3 = undefined;
  /* functional template */
  const __vue_is_functional_template__$3 = false;
  /* style inject */
  
  /* style inject SSR */
  

  
  var BrowserRouter$1 = normalizeComponent_1(
    { render: __vue_render__$2, staticRenderFns: __vue_staticRenderFns__$2 },
    __vue_inject_styles__$3,
    __vue_script__$3,
    __vue_scope_id__$3,
    __vue_is_functional_template__$3,
    __vue_module_identifier__$3,
    undefined,
    undefined
  );

const addLeadingSlash = path => {
  return path.charAt(0) === "/" ? path : "/" + path;
};

const removeTailSlash = path => {
  return path.replace(/\/+$/, '');
};

const addBasename = (basename, location) => {
  if (!basename) return location;
  return { ...location,
    pathname: removeTailSlash(addLeadingSlash(basename)) + addLeadingSlash(location.pathname)
  };
};

const stripBasename = (basename, location) => {
  if (!basename) return location;
  const base = addLeadingSlash(basename);
  if (location.pathname.indexOf(base) !== 0) return location;
  return { ...location,
    pathname: addLeadingSlash(location.pathname.substr(base.length))
  };
};

const createURL = location => typeof location === "string" ? location : createPath(location);

const staticHandler = methodName => () => {
  throw new Error(`You cannot ${methodName} with <StaticRouter>`);
};

const noop = () => {};

function createStaticHistory({
  basename = '',
  context = {},
  location = '/'
}) {
  const history = {
    isStatic: true,
    context: context,
    action: "POP",
    location: stripBasename(basename, createLocation(location)),
    go: staticHandler("go"),
    goBack: staticHandler("goBack"),
    goForward: staticHandler("goForward"),
    createHref: location => {
      return addLeadingSlash(removeTailSlash(basename) + createURL(location));
    },
    push: location => {
      context.action = "PUSH";
      context.location = addBasename(basename, createLocation(location));
      context.url = createURL(context.location);
    },
    replace: location => {
      context.action = "REPLACE";
      context.location = addBasename(basename, createLocation(location));
      context.url = createURL(context.location);
    },
    listen: () => noop,
    block: () => noop
  };
  return history;
}

//
const StaticRouter = {
  name: 'StaticRouter',
  components: {
    Router: Router$1
  },
  props: {
    basename: {
      type: String,
      default: ''
    },
    context: {
      type: Object,
      default: () => {}
    },
    location: {
      type: [String, Object],
      default: '/'
    }
  },

  data() {
    const history = createStaticHistory({
      basename: this.basename,
      context: this.context,
      location: this.location
    });
    return {
      history
    };
  }

};

StaticRouter.install = function (Vue) {
  Vue.component(StaticRouter.name, StaticRouter);
};

/* script */
const __vue_script__$4 = StaticRouter;

/* template */
var __vue_render__$3 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("router", {
    attrs: { history: _vm.history, name: "static-router" },
    scopedSlots: _vm._u(
      [
        {
          key: "default",
          fn: function(routerProps) {
            return [_vm._t("default", null, null, routerProps)]
          }
        }
      ],
      null,
      true
    )
  })
};
var __vue_staticRenderFns__$3 = [];
__vue_render__$3._withStripped = true;

  /* style */
  const __vue_inject_styles__$4 = undefined;
  /* scoped */
  const __vue_scope_id__$4 = undefined;
  /* module identifier */
  const __vue_module_identifier__$4 = undefined;
  /* functional template */
  const __vue_is_functional_template__$4 = false;
  /* style inject */
  
  /* style inject SSR */
  

  
  var StaticRouter$1 = normalizeComponent_1(
    { render: __vue_render__$3, staticRenderFns: __vue_staticRenderFns__$3 },
    __vue_inject_styles__$4,
    __vue_script__$4,
    __vue_scope_id__$4,
    __vue_is_functional_template__$4,
    __vue_module_identifier__$4,
    undefined,
    undefined
  );

/**
 * copy from:
 * https://github.com/ReactTraining/react-router/blob/master/packages/react-router/modules/matchPath.js
 */
const cache = {};
const cacheLimit = 10000;
let cacheCount = 0;

function compilePath(path, options) {
  const cacheKey = `${options.end}${options.strict}${options.sensitive}`;
  const pathCache = cache[cacheKey] || (cache[cacheKey] = {});
  if (pathCache[path]) return pathCache[path];
  const keys = [];
  const regexp = pathToRegexp(path, keys, options);
  const result = {
    regexp,
    keys
  };

  if (cacheCount < cacheLimit) {
    pathCache[path] = result;
    cacheCount++;
  }

  return result;
}
/**
 * matching a URL pathname to a path.
 * pathname: current locations's pathname
 */


function matchPath(pathname, options = {}) {
  if (typeof options === "string") options = {
    path: options
  };
  const {
    path,
    exact = true,
    strict = false,
    sensitive = true
  } = options;
  const paths = [].concat(path);
  return paths.reduce((matched, path) => {
    if (matched) return matched;
    const {
      regexp,
      keys
    } = compilePath(path, {
      end: exact,
      strict,
      sensitive
    });
    const match = regexp.exec(pathname);
    if (!match) return null;
    const [url, ...values] = match;
    const isExact = pathname === url;
    if (exact && !isExact) return null;
    return {
      path,
      // the path used to match
      url: path === "/" && url === "" ? "/" : url,
      // the matched portion of the URL
      isExact,
      // whether or not we matched exactly
      params: keys.reduce((memo, key, index) => {
        memo[key.name] = values[index];
        return memo;
      }, {})
    };
  }, null);
}

var script = {
  name: 'Tag',
  functional: true,
  props: {
    tag: String
  },

  render(createElement, context) {
    return createElement(context.props.tag || 'div', context.data, context.children);
  }

};

/* script */
const __vue_script__$5 = script;

/* template */

  /* style */
  const __vue_inject_styles__$5 = undefined;
  /* scoped */
  const __vue_scope_id__$5 = undefined;
  /* module identifier */
  const __vue_module_identifier__$5 = undefined;
  /* functional template */
  const __vue_is_functional_template__$5 = undefined;
  /* style inject */
  
  /* style inject SSR */
  

  
  var Tag = normalizeComponent_1(
    {},
    __vue_inject_styles__$5,
    __vue_script__$5,
    __vue_scope_id__$5,
    __vue_is_functional_template__$5,
    __vue_module_identifier__$5,
    undefined,
    undefined
  );

//
const RouterLink = {
  name: 'RouterLink',
  components: {
    Tag
  },
  props: {
    // to path
    to: {
      type: [String, Object],
      required: true
    },
    // replace or push
    replace: {
      type: Boolean,
      default: false
    },
    // tag
    tag: {
      type: String,
      default: 'a'
    },
    // user to check active
    exact: {
      type: Boolean,
      default: false
    },
    // user to check active
    strict: {
      type: Boolean,
      default: false
    },
    // user to check active
    sensitive: {
      type: Boolean,
      default: true
    },
    // active class name
    activeClass: {
      type: String,
      default: 'router-link-active'
    },
    // active class name
    exactActiveClass: {
      type: String,
      default: 'router-link-exact-active'
    },
    // navitage event
    event: {
      type: String,
      default: 'click'
    },
    // location
    location: {
      type: Object
    }
  },
  inject: ['router', 'route'],
  computed: {
    // current location
    currentLocation() {
      const currentLocation = this.location || this.route.location;
      return currentLocation;
    },

    // to location
    toLocation() {
      const toLocation = normalizeToLocation(resolveToLocation(this.to, this.currentLocation), this.currentLocation);
      return toLocation;
    },

    // link href
    href() {
      const {
        history
      } = this.router;
      const href = this.toLocation ? history.createHref(this.toLocation) : '';
      return href;
    },

    // path match with current location
    match() {
      const {
        to,
        exact,
        strict,
        sensitive
      } = this;
      const {
        pathname: pathToMatch
      } = this.currentLocation;
      const {
        pathname: path
      } = this.toLocation; // Regex taken from: https://github.com/pillarjs/path-to-regexp/blob/master/index.js#L202

      const escapedPath = path && path.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
      const match = escapedPath ? matchPath(pathToMatch, {
        path: escapedPath,
        exact,
        strict,
        sensitive
      }) : null;
      return match;
    },

    classNames() {
      let classNames = '';
      if (!this.match) return classNames;
      classNames += ` ${this.activeClass}`;
      if (this.match.exact) classNames += ` ${this.exactActiveClass}`;
      return classNames;
    }

  },
  methods: {
    handleClick(event) {
      this.$emit('click', event);
      if (!guardEvent(event)) return;
      const {
        history
      } = this.router;
      const {
        replace,
        to
      } = this;
      const loc = resolveToLocation(to, this.currentLocation);

      if (replace) {
        history.replace(loc);
      } else {
        history.push(loc);
      }
    }

  },

  created() {
    assert(this.router, 'You should not use <router-link> outside a <router>');
  },

  beforeUpdate() {
    assert(this.router, 'You should not use <router-link> outside a <router>');
  }

};

RouterLink.install = function (Vue) {
  Vue.component(RouterLink.name, RouterLink);
};

/* script */
const __vue_script__$6 = RouterLink;

/* template */
var __vue_render__$4 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "tag",
    _vm._b(
      {
        class: _vm.classNames,
        attrs: { tag: _vm.tag, href: _vm.href },
        on: _vm._d({}, [
          _vm.event,
          function($event) {
            return _vm.handleClick($event)
          }
        ])
      },
      "tag",
      _vm.$attrs,
      false
    ),
    [
      _vm._t("default", null, {
        href: _vm.href,
        match: _vm.match,
        history: _vm.router.history,
        location: _vm.router.history.location
      })
    ],
    2
  )
};
var __vue_staticRenderFns__$4 = [];
__vue_render__$4._withStripped = true;

  /* style */
  const __vue_inject_styles__$6 = undefined;
  /* scoped */
  const __vue_scope_id__$6 = undefined;
  /* module identifier */
  const __vue_module_identifier__$6 = undefined;
  /* functional template */
  const __vue_is_functional_template__$6 = false;
  /* style inject */
  
  /* style inject SSR */
  

  
  var RouterLink$1 = normalizeComponent_1(
    { render: __vue_render__$4, staticRenderFns: __vue_staticRenderFns__$4 },
    __vue_inject_styles__$6,
    __vue_script__$6,
    __vue_scope_id__$6,
    __vue_is_functional_template__$6,
    __vue_module_identifier__$6,
    undefined,
    undefined
  );

const Prompt = {
  name: 'Prompt',
  props: {
    when: {
      type: Boolean,
      required: true
    },
    message: {
      type: [Function, String],
      required: true
    }
  },
  inject: ['router', 'route'],

  created() {
    assert(this.router, 'You should not use <prompt> outside a <router>');
    this.lastMessage = null;
    this.unblock = null;
  },

  beforeUpdate() {
    assert(this.router, 'You should not use <prompt> outside a <router>');
  },

  mounted() {
    if (this.when) this.block();
  },

  watch: {
    when(val, oldVal) {
      if (!val) {
        if (this.unblock) this.unblock();
      } else {
        this.block();
      }
    }

  },
  methods: {
    block() {
      let {
        message,
        lastMessage
      } = this;

      if (!this.unblock) {
        this.unblock = this.router.history.block(message);
      } else if (message !== lastMessage) {
        this.unblock();
        this.unblock = this.router.history.block(message);
      } // last message


      this.lastMessage = message;
    }

  },

  beforeDestroy() {
    if (this.unblock) this.unblock();
  },

  render() {
    return null;
  }

};

Prompt.install = function (Vue) {
  Vue.component(Prompt.name, Prompt);
};

/* script */
const __vue_script__$7 = Prompt;

/* template */

  /* style */
  const __vue_inject_styles__$7 = undefined;
  /* scoped */
  const __vue_scope_id__$7 = undefined;
  /* module identifier */
  const __vue_module_identifier__$7 = undefined;
  /* functional template */
  const __vue_is_functional_template__$7 = undefined;
  /* style inject */
  
  /* style inject SSR */
  

  
  var Prompt$1 = normalizeComponent_1(
    {},
    __vue_inject_styles__$7,
    __vue_script__$7,
    __vue_scope_id__$7,
    __vue_is_functional_template__$7,
    __vue_module_identifier__$7,
    undefined,
    undefined
  );

/**
 * copy from:
 * https://github.com/ReactTraining/react-router/blob/master/packages/react-router/modules/generatePath.js
 */
const cache$1 = {};
const cacheLimit$1 = 10000;
let cacheCount$1 = 0;

function compilePath$1(path) {
  if (cache$1[path]) return cache$1[path];
  const generator = pathToRegexp.compile(path);

  if (cacheCount$1 < cacheLimit$1) {
    cache$1[path] = generator;
    cacheCount$1++;
  }

  return generator;
}
/**
 * generating a URL pathname from a path and parameters.
 */


function generatePath(path = "/", params = {}, options = {}) {
  return path === "/" ? path : compilePath$1(path)(params, options);
}

const Redirect = {
  name: 'Redirect',
  props: {
    // from path
    from: {
      type: String
    },
    // to path
    to: {
      type: [String, Object],
      required: true
    },
    // wheather push
    push: {
      type: Boolean,
      default: false
    },
    exact: {
      type: Boolean,
      default: false
    },
    strict: {
      type: Boolean,
      default: false
    },
    sensitive: {
      type: Boolean,
      default: true
    }
  },
  inject: ['router', 'route'],

  created() {
    assert(this.router, 'You must not use <redirect> outside a <router>.'); // static router

    if (this.isStatic()) this.perform();
  },

  mounted() {
    // not static router
    if (!this.isStatic()) this.perform();
  },

  beforeUpdate() {
    assert(this.router, 'You must not use <redirect> outside a <router>.');
    const to = this.computeTo(); // already redirect

    if (locationsAreEqual(this.lastTo, to)) {
      return;
    }

    this.perform();
  },

  methods: {
    // if static router
    isStatic() {
      return this.router && this.router.history.isStatic;
    },

    // to location
    computeTo() {
      const {
        from,
        strict,
        exact,
        sensitive,
        route
      } = this;
      const pathname = route.location.pathname;
      const match = from ? matchPath(pathname, {
        from,
        strict,
        exact,
        sensitive
      }) : route.match; // to

      let p = this.to; // route

      if (match) {
        if (typeof this.to === 'string') {
          // to is string
          p = generatePath(this.to, match.params);
        } else {
          // to is object
          p = { ...this.to,
            pathname: generatePath(this.to.pathname, match.params)
          };
        }
      } // to


      const to = createLocation(p);
      return to;
    },

    perform() {
      const {
        history
      } = this.router; // history method

      const method = this.push ? history.push : history.replace;
      const to = this.computeTo(); // redirect

      this.lastTo = to;
      method(to);
    }

  },

  render() {
    return null;
  }

};

Redirect.install = function (Vue) {
  Vue.component(Redirect.name, Redirect);
};

/* script */
const __vue_script__$8 = Redirect;

/* template */

  /* style */
  const __vue_inject_styles__$8 = undefined;
  /* scoped */
  const __vue_scope_id__$8 = undefined;
  /* module identifier */
  const __vue_module_identifier__$8 = undefined;
  /* functional template */
  const __vue_is_functional_template__$8 = undefined;
  /* style inject */
  
  /* style inject SSR */
  

  
  var Redirect$1 = normalizeComponent_1(
    {},
    __vue_inject_styles__$8,
    __vue_script__$8,
    __vue_scope_id__$8,
    __vue_is_functional_template__$8,
    __vue_module_identifier__$8,
    undefined,
    undefined
  );

const Route = {
  name: 'Route',
  props: {
    path: {
      type: [String, Array],
      default: ''
    },
    exact: {
      type: Boolean,
      default: false
    },
    strict: {
      type: Boolean,
      default: false
    },
    sensitive: {
      type: Boolean,
      default: true
    },
    forceRender: {
      type: Boolean,
      default: false
    },
    location: {
      type: Object
    }
  },
  inject: ['router', 'route'],

  provide() {
    return {
      route: this.computedRoute
    };
  },

  data() {
    return {
      isActive: true,
      // add provide's properties in data, to make provide reactivity 
      computedRoute: {
        location: this.location || this.route.location,
        match: this.route.match
      }
    };
  },

  computed: {
    computeLocation() {
      return this.location || this.route.location;
    },

    computeMatch() {
      const computedLocation = this.computeLocation;
      const {
        path,
        strict,
        exact,
        sensitive,
        route
      } = this;
      const pathname = computedLocation.pathname;
      const match = path ? matchPath(pathname, {
        path,
        strict,
        exact,
        sensitive
      }) : route.match;
      return match;
    }

  },
  watch: {
    computeMatch: {
      handler() {
        this.updateRoute();
      },

      deep: true
    }
  },
  methods: {
    updateRoute() {
      if (!this.isActive) return;
      const match = this.computeMatch; // cache

      if (!this.cacheMatch || !match) {
        this.cacheMatch = match;
      } else {
        Object.keys(match).forEach(key => {
          this.cacheMatch[key] = match[key];
        });
      }

      this.computedRoute.location = this.computeLocation;
      this.computedRoute.match = this.cacheMatch;
    },

    clearCache() {
      for (let key in this.cache) {
        this.cache[key].componentInstance.$destroy();
        this.cache[key] = null;
      }
    }

  },

  created() {
    assert(this.router, `You should not use <route> outside a <router>.`); // cache match object

    this.cacheMatch = null; // use for cache keepalive component

    this.cache = Object.create(null); // update current route

    this.updateRoute();
  },

  beforeUpdate() {
    assert(this.router, `You should not use <route> outside a <router>.`);
  },

  activated() {
    this.isActive = true;
    this.updateRoute();
  },

  deactivated() {
    this.isActive = false;
  },

  destroyed() {
    this.clearCache();
  },

  render(createElement) {
    const {
      router,
      computedRoute,
      forceRender,
      $scopedSlots,
      name,
      cache
    } = this;
    const {
      history
    } = router;
    const {
      match,
      location
    } = computedRoute;
    const isKeepAlive = this.$vnode.data.keepAlive; // no keep alive

    if (!isKeepAlive) {
      this.clearCache();
    }

    if (!match && !forceRender) return null;
    let children = $scopedSlots.default({
      match,
      history,
      location
    });
    children = (children || []).filter(isNotTextNode);
    if (!children.length) return null;
    assert(children.length === 1, `<${name}> can only be used on a single child element.`);
    const vnode = children[0];
    const componentOptions = vnode && vnode.componentOptions; // is keepAlive and is component

    if (isKeepAlive && componentOptions) {
      const key = vnode.key == null ? componentOptions.Ctor.cid + (componentOptions.tag ? "::" + componentOptions.tag : '') : vnode.key;

      if (cache[key]) {
        vnode.componentInstance = cache[key].componentInstance;
      } else {
        cache[key] = vnode;
      }

      vnode.data.keepAlive = true;
    }

    return vnode;
  }

};

Route.install = function (Vue) {
  Vue.component(Route.name, Route);
};

/* script */
const __vue_script__$9 = Route;

/* template */

  /* style */
  const __vue_inject_styles__$9 = undefined;
  /* scoped */
  const __vue_scope_id__$9 = undefined;
  /* module identifier */
  const __vue_module_identifier__$9 = undefined;
  /* functional template */
  const __vue_is_functional_template__$9 = undefined;
  /* style inject */
  
  /* style inject SSR */
  

  
  var Route$1 = normalizeComponent_1(
    {},
    __vue_inject_styles__$9,
    __vue_script__$9,
    __vue_scope_id__$9,
    __vue_is_functional_template__$9,
    __vue_module_identifier__$9,
    undefined,
    undefined
  );

const RouterContext = {
  name: 'RouterContext',
  inject: ['router', 'route'],

  data() {
    return {
      history: this.router.history,
      location: this.route.location,
      match: this.route.match
    };
  },

  render() {
    return null;
  }

};

RouterContext.install = function (Vue) {
  Vue.component(RouterContext.name, RouterContext);
};

/* script */
const __vue_script__$a = RouterContext;

/* template */

  /* style */
  const __vue_inject_styles__$a = undefined;
  /* scoped */
  const __vue_scope_id__$a = undefined;
  /* module identifier */
  const __vue_module_identifier__$a = undefined;
  /* functional template */
  const __vue_is_functional_template__$a = undefined;
  /* style inject */
  
  /* style inject SSR */
  

  
  var RouteContext = normalizeComponent_1(
    {},
    __vue_inject_styles__$a,
    __vue_script__$a,
    __vue_scope_id__$a,
    __vue_is_functional_template__$a,
    __vue_module_identifier__$a,
    undefined,
    undefined
  );

const RouteSwitch = {
  name: 'RouteSwitch',
  props: {
    location: Object
  },
  inject: ['router', 'route'],

  provide() {
    return {
      route: this.computedRoute
    };
  },

  data() {
    return {
      isActive: true,
      // add provide's properties in data, to make provide reactivity 
      computedRoute: {
        location: this.location || this.route.location,
        match: this.route.match
      }
    };
  },

  computed: {
    computeLocation() {
      return this.location || this.route.location;
    }

  },
  watch: {
    computeLocation: {
      handler() {
        this.updateRoute();
      },

      deep: true
    }
  },
  methods: {
    updateRoute() {
      if (!this.isActive) return;
      this.computedRoute.location = this.computeLocation;
      this.computedRoute.match = this.route.match;
    },

    clearCache() {
      for (let key in this.cache) {
        this.cache[key].componentInstance.$destroy();
        this.cache[key] = null;
      }
    }

  },

  created() {
    assert(this.router, `You should not use <route-switch> outside a <router>.`); // use for cache keepalive component

    this.cache = Object.create(null); // update current route

    this.updateRoute();
  },

  beforeUpdate() {
    assert(this.router, `You should not use <route-switch> outside a <router>.`);
  },

  activated() {
    this.isActive = true;
    this.updateRoute();
  },

  deactivated() {
    this.isActive = false;
  },

  destroyed() {
    this.clearCache();
  },

  render(createElement, context) {
    const {
      router,
      cache
    } = this;
    const {
      location
    } = this.computedRoute;
    const children = (this.$slots.default || []).filter(isNotTextNode);
    const isKeepAlive = this.$vnode.data.keepAlive; // no keep alive

    if (!isKeepAlive) {
      this.clearCache();
    }

    if (!children.length) return null;
    let key = '';
    const vnode = children.find(vnode => {
      // filter text nodes
      if (!vnode.tag) return false; // check children if <route> component

      assert(vnode.componentOptions, `<route-switch>'s children can only be <route>.`);
      const propsData = vnode.componentOptions.propsData || {};
      const {
        path = '',
        exact = false,
        strict = false,
        sensitive = true
      } = propsData; // key

      key = vnode.key || `path-${path}--exact-${exact}--strict-${strict}--sensitive-${sensitive}`; // no path on route

      if (!path) return true;
      const match = matchPath(location.pathname, {
        path,
        exact,
        strict,
        sensitive
      });
      return !!match;
    });
    if (!vnode) return vnode; // is keepAlive and is component

    if (isKeepAlive) {
      if (cache[key]) {
        vnode.componentInstance = cache[key].componentInstance;
      } else {
        cache[key] = vnode;
      }

      vnode.data.keepAlive = true;
    } // key


    vnode.key = key;
    return vnode;
  }

};

RouteSwitch.install = function (Vue) {
  Vue.component(RouteSwitch.name, RouteSwitch);
};

/* script */
const __vue_script__$b = RouteSwitch;

/* template */

  /* style */
  const __vue_inject_styles__$b = undefined;
  /* scoped */
  const __vue_scope_id__$b = undefined;
  /* module identifier */
  const __vue_module_identifier__$b = undefined;
  /* functional template */
  const __vue_is_functional_template__$b = undefined;
  /* style inject */
  
  /* style inject SSR */
  

  
  var RouteSwitch$1 = normalizeComponent_1(
    {},
    __vue_inject_styles__$b,
    __vue_script__$b,
    __vue_scope_id__$b,
    __vue_is_functional_template__$b,
    __vue_module_identifier__$b,
    undefined,
    undefined
  );

const install = function (Vue) {
  [MemoryRouter$1, HashRouter$1, BrowserRouter$1, StaticRouter$1, Router$1, RouterLink$1, Prompt$1, Redirect$1, Route$1, RouteContext, RouteSwitch$1].map(component => {
    Vue.use(component);
  });
};
/* istanbul ignore if */


if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

var index = {
  version: '1.2.0',
  install
};

export default index;
export { BrowserRouter$1 as BrowserRouter, HashRouter$1 as HashRouter, MemoryRouter$1 as MemoryRouter, Prompt$1 as Prompt, Redirect$1 as Redirect, Route$1 as Route, RouteContext, RouteSwitch$1 as RouteSwitch, Router$1 as Router, RouterLink$1 as RouterLink, StaticRouter$1 as StaticRouter, createStaticHistory, generatePath, matchPath };
