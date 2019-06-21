import { createLocation, createMemoryHistory, createHashHistory, createBrowserHistory, createPath, locationsAreEqual } from 'history';
export { createBrowserHistory, createHashHistory, createMemoryHistory } from 'history';
import pathToRegexp from 'path-to-regexp';

function assert(condition, message) {
  if (!condition) {
    throw new Error("[vue-router-lite] ".concat(message));
  }
}

var resolveToLocation = function resolveToLocation(to, currentLocation) {
  return typeof to === "function" ? to(currentLocation) : to;
}; // 

var normalizeToLocation = function normalizeToLocation(to, currentLocation) {
  return typeof to === "string" ? createLocation(to, null, null, currentLocation) : to;
};
var guardEvent = function guardEvent(e) {
  // don't redirect with control keys
  if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) return; // don't redirect when preventDefault called

  if (e.defaultPrevented) return; // don't redirect on right click

  if (e.button !== undefined && e.button !== 0) return; // don't redirect if `target="_blank"`

  if (e.currentTarget && e.currentTarget.getAttribute) {
    var target = e.currentTarget.getAttribute('target');
    if (/\b_blank\b/i.test(target)) return;
  } // this may be a Weex event which doesn't have this method


  if (e.preventDefault) {
    e.preventDefault();
  }

  return true;
};

/**
 * render the single child or empty
 */

var Single = {
  functional: true,
  render: function render(createElement, context) {
    var children = context.children.filter(function (item) {
      return !!item.tag;
    });
    if (!children.length) return null;
    assert(children.length === 1, "The component ".concat(context.props.name || 'Single', " should have only one child!"));
    return children[0];
  }
};

//
var Router = {
  name: 'Router',
  components: {
    Single: Single
  },
  props: {
    // history control
    history: {
      type: Object,
      required: true
    },
    component: {
      type: Object
    }
  },
  provide: function provide() {
    return {
      router: this.router,
      route: this.route
    };
  },
  data: function data() {
    return {
      router: {
        history: this.history
      },
      route: {
        match: this.computeMatch(this.history.location.pathname)
      }
    };
  },
  beforeMount: function beforeMount() {
    var _this = this;

    var history = this.history;
    this.unlisten = history.listen(function () {
      _this.route.match = _this.computeMatch(history.location.pathname);
    });
  },
  befreDestory: function befreDestory() {
    this.unlisten();
  },
  watch: {
    history: function history(val, oldVal) {
      assert(false, 'You cannot change <Router>\'s history!');
    }
  },
  methods: {
    computeMatch: function computeMatch(pathname) {
      return {
        path: "/",
        url: "/",
        params: {},
        isExact: pathname === "/"
      };
    }
  }
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
var __vue_render__ = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _vm.component
    ? _c(_vm.component, {
        tag: "component",
        attrs: {
          history: _vm.history,
          location: _vm.history.location,
          match: _vm.route.match
        }
      })
    : _c(
        "single",
        { attrs: { name: "Router" } },
        [
          _vm._t("default", null, {
            history: _vm.history,
            location: _vm.history.location,
            match: _vm.route.match
          })
        ],
        2
      )
};
var __vue_staticRenderFns__ = [];
__vue_render__._withStripped = true;

  /* style */
  const __vue_inject_styles__ = undefined;
  /* scoped */
  const __vue_scope_id__ = undefined;
  /* module identifier */
  const __vue_module_identifier__ = undefined;
  /* functional template */
  const __vue_is_functional_template__ = false;
  /* style inject */
  
  /* style inject SSR */
  

  
  var Router$1 = normalizeComponent_1(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    undefined,
    undefined
  );

//
var MemoryRouter = {
  name: 'MemoryRouter',
  components: {
    Router: Router$1
  },
  props: {
    initialEntries: {
      type: Array,
      "default": function _default() {
        return ['/'];
      }
    },
    initialIndex: {
      type: Number,
      "default": 0
    },
    keyLength: {
      type: Number,
      "default": 6
    },
    getUserConfirmation: {
      type: Function
    },
    component: {
      type: Object
    }
  },
  data: function data() {
    var history = createMemoryHistory({
      initialEntries: this.initialEntries,
      initialIndex: this.initialIndex,
      keyLength: this.keyLength,
      getUserConfirmation: this.getUserConfirmation
    });
    return {
      history: history
    };
  }
};

/* script */
const __vue_script__$1 = MemoryRouter;

/* template */
var __vue_render__$1 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("router", {
    attrs: { history: _vm.history, component: _vm.component },
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
    { render: __vue_render__$1, staticRenderFns: __vue_staticRenderFns__$1 },
    __vue_inject_styles__$1,
    __vue_script__$1,
    __vue_scope_id__$1,
    __vue_is_functional_template__$1,
    __vue_module_identifier__$1,
    undefined,
    undefined
  );

//
var HashRouter = {
  name: 'HashRouter',
  components: {
    Router: Router$1
  },
  props: {
    basename: {
      type: String,
      "default": ''
    },
    hashType: {
      validator: function validator(value) {
        return ["hashbang", "noslash", "slash"].indexOf(value) !== -1;
      }
    },
    getUserConfirmation: {
      type: Function,
      "default": function _default(message, callback) {
        callback(window.confirm(message));
      }
    },
    component: {
      type: Object
    }
  },
  data: function data() {
    var history = createHashHistory({
      basename: this.basename,
      hashType: this.hashType,
      getUserConfirmation: this.getUserConfirmation
    });
    return {
      history: history
    };
  }
};

/* script */
const __vue_script__$2 = HashRouter;

/* template */
var __vue_render__$2 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("router", {
    attrs: { history: _vm.history, component: _vm.component },
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
    { render: __vue_render__$2, staticRenderFns: __vue_staticRenderFns__$2 },
    __vue_inject_styles__$2,
    __vue_script__$2,
    __vue_scope_id__$2,
    __vue_is_functional_template__$2,
    __vue_module_identifier__$2,
    undefined,
    undefined
  );

//
var BrowserRouter = {
  name: 'BrowserRouter',
  components: {
    Router: Router$1
  },
  props: {
    basename: {
      type: String,
      "default": ''
    },
    forceRefresh: {
      type: Boolean,
      "default": false
    },
    keyLength: {
      type: Number,
      "default": 6
    },
    getUserConfirmation: {
      type: Function,
      "default": function _default(message, callback) {
        callback(window.confirm(message));
      }
    },
    component: {
      type: Object
    }
  },
  data: function data() {
    var history = createBrowserHistory({
      basename: this.basename,
      forceRefresh: this.forceRefresh,
      keyLength: this.keyLength,
      getUserConfirmation: this.getUserConfirmation
    });
    return {
      history: history
    };
  }
};

/* script */
const __vue_script__$3 = BrowserRouter;

/* template */
var __vue_render__$3 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("router", {
    attrs: { history: _vm.history, component: _vm.component },
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
    { render: __vue_render__$3, staticRenderFns: __vue_staticRenderFns__$3 },
    __vue_inject_styles__$3,
    __vue_script__$3,
    __vue_scope_id__$3,
    __vue_is_functional_template__$3,
    __vue_module_identifier__$3,
    undefined,
    undefined
  );

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }

    ownKeys.forEach(function (key) {
      _defineProperty(target, key, source[key]);
    });
  }

  return target;
}

function _toArray(arr) {
  return _arrayWithHoles(arr) || _iterableToArray(arr) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}

var addLeadingSlash = function addLeadingSlash(path) {
  return path.charAt(0) === "/" ? path : "/" + path;
};

var removeTailSlash = function removeTailSlash(path) {
  return path.replace(/\/+$/, '');
};

var addBasename = function addBasename(basename, location) {
  if (!basename) return location;
  return _objectSpread({}, location, {
    pathname: removeTailSlash(addLeadingSlash(basename)) + addLeadingSlash(location.pathname)
  });
};

var stripBasename = function stripBasename(basename, location) {
  if (!basename) return location;
  var base = addLeadingSlash(basename);
  if (location.pathname.indexOf(base) !== 0) return location;
  return _objectSpread({}, location, {
    pathname: addLeadingSlash(location.pathname.substr(base.length))
  });
};

var createURL = function createURL(location) {
  return typeof location === "string" ? location : createPath(location);
};

var staticHandler = function staticHandler(methodName) {
  return function () {
    throw new Error("You cannot ".concat(methodName, " with <StaticRouter>"));
  };
};

var noop = function noop() {};

function createStaticHistory(_ref) {
  var _ref$basename = _ref.basename,
      basename = _ref$basename === void 0 ? '' : _ref$basename,
      _ref$context = _ref.context,
      context = _ref$context === void 0 ? {} : _ref$context,
      _ref$location = _ref.location,
      location = _ref$location === void 0 ? '/' : _ref$location;
  var history = {
    isStatic: true,
    context: context,
    action: "POP",
    location: stripBasename(basename, createLocation(location)),
    go: staticHandler("go"),
    goBack: staticHandler("goBack"),
    goForward: staticHandler("goForward"),
    createHref: function createHref(location) {
      return addLeadingSlash(removeTailSlash(basename) + createURL(location));
    },
    push: function push(location) {
      context.action = "PUSH";
      context.location = addBasename(basename, createLocation(location));
      context.url = createURL(context.location);
    },
    replace: function replace(location) {
      context.action = "REPLACE";
      context.location = addBasename(basename, createLocation(location));
      context.url = createURL(context.location);
    },
    listen: function listen() {
      return noop;
    },
    block: function block() {
      return noop;
    }
  };
  return history;
}

//
var StaticRouter = {
  name: 'StaticRouter',
  components: {
    Router: Router$1
  },
  props: {
    basename: {
      type: String,
      "default": ''
    },
    context: {
      type: Object,
      "default": function _default() {}
    },
    location: {
      type: [String, Object],
      "default": '/'
    },
    component: {
      type: Object
    }
  },
  data: function data() {
    var history = createStaticHistory({
      basename: this.basename,
      context: this.context,
      location: this.location
    });
    return {
      history: history
    };
  }
};

/* script */
const __vue_script__$4 = StaticRouter;

/* template */
var __vue_render__$4 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("router", {
    attrs: { history: _vm.history, component: _vm.component },
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
var __vue_staticRenderFns__$4 = [];
__vue_render__$4._withStripped = true;

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
    { render: __vue_render__$4, staticRenderFns: __vue_staticRenderFns__$4 },
    __vue_inject_styles__$4,
    __vue_script__$4,
    __vue_scope_id__$4,
    __vue_is_functional_template__$4,
    __vue_module_identifier__$4,
    undefined,
    undefined
  );

var cache = {};
var cacheLimit = 10000;
var cacheCount = 0;

function compilePath(path, options) {
  var cacheKey = "".concat(options.end).concat(options.strict).concat(options.sensitive);
  var pathCache = cache[cacheKey] || (cache[cacheKey] = {});
  if (pathCache[path]) return pathCache[path];
  var keys = [];
  var regexp = pathToRegexp(path, keys, options);
  var result = {
    regexp: regexp,
    keys: keys
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


function matchPath(pathname) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  if (typeof options === "string") options = {
    path: options
  };
  var _options = options,
      path = _options.path,
      _options$exact = _options.exact,
      exact = _options$exact === void 0 ? true : _options$exact,
      _options$strict = _options.strict,
      strict = _options$strict === void 0 ? false : _options$strict,
      _options$sensitive = _options.sensitive,
      sensitive = _options$sensitive === void 0 ? true : _options$sensitive;
  var paths = [].concat(path);
  return paths.reduce(function (matched, path) {
    if (matched) return matched;

    var _compilePath = compilePath(path, {
      end: exact,
      strict: strict,
      sensitive: sensitive
    }),
        regexp = _compilePath.regexp,
        keys = _compilePath.keys;

    var match = regexp.exec(pathname);
    if (!match) return null;

    var _match = _toArray(match),
        url = _match[0],
        values = _match.slice(1);

    var isExact = pathname === url;
    if (exact && !isExact) return null;
    return {
      path: path,
      // the path used to match
      url: path === "/" && url === "" ? "/" : url,
      // the matched portion of the URL
      isExact: isExact,
      // whether or not we matched exactly
      params: keys.reduce(function (memo, key, index) {
        memo[key.name] = values[index];
        return memo;
      }, {})
    };
  }, null);
}

//
var Route = {
  name: 'Route',
  components: {
    Single: Single
  },
  props: {
    path: {
      type: [String, Array]
    },
    exact: {
      type: Boolean,
      "default": false
    },
    strict: {
      type: Boolean,
      "default": false
    },
    sensitive: {
      type: Boolean,
      "default": true
    },
    keepAlive: {
      type: [Boolean, Object]
    },
    forceRender: {
      type: Boolean,
      "default": false
    },
    component: {
      type: Object
    }
  },
  inject: ['router', 'route'],
  provide: function provide() {
    return {
      route: this.computedRoute
    };
  },
  created: function created() {
    assert(this.router, "You should not use <Route> outside a <Router>!");
  },
  computed: {
    computedLocation: function computedLocation() {
      var computedLocation = this.router.history.location;
      return computedLocation;
    },
    computedRoute: function computedRoute() {
      var path = this.path,
          strict = this.strict,
          exact = this.exact,
          sensitive = this.sensitive,
          route = this.route;
      var pathname = this.computedLocation.pathname;
      var match = path ? matchPath(pathname, {
        path: path,
        strict: strict,
        exact: exact,
        sensitive: sensitive
      }) : route.match;
      return {
        match: match
      };
    },
    keepAliveOptions: function keepAliveOptions() {
      if (!this.keepAlive) return {
        include: []
      };

      if (typeof this.keepAlive === 'boolean') {
        return {};
      }

      return this.keepAlive;
    }
  }
};

/* script */
const __vue_script__$5 = Route;

/* template */
var __vue_render__$5 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "single",
    { attrs: { name: "Route" } },
    [
      _vm.keepAlive
        ? [
            _vm.component
              ? _c(
                  "keep-alive",
                  _vm._b({}, "keep-alive", _vm.keepAliveOptions, false),
                  [
                    _vm.computedRoute.match || _vm.forceRender
                      ? _c(
                          _vm.component,
                          _vm._b(
                            {
                              tag: "component",
                              attrs: {
                                history: _vm.router.history,
                                location: _vm.computedLocation,
                                match: _vm.computedRoute.match
                              }
                            },
                            "component",
                            _vm.$attrs,
                            false
                          )
                        )
                      : _vm._e()
                  ],
                  1
                )
              : _c(
                  "keep-alive",
                  _vm._b({}, "keep-alive", _vm.keepAliveOptions, false),
                  [
                    _vm.computedRoute.match || _vm.forceRender
                      ? _vm._t(
                          "default",
                          null,
                          {
                            history: _vm.router.history,
                            location: _vm.computedLocation,
                            match: _vm.computedRoute.match
                          },
                          _vm.$attrs
                        )
                      : _vm._e()
                  ],
                  2
                )
          ]
        : [
            _vm.computedRoute.match || _vm.forceRender
              ? _c(_vm.component, {
                  tag: "component",
                  attrs: {
                    history: _vm.router.history,
                    location: _vm.computedLocation,
                    match: _vm.computedRoute.match
                  }
                })
              : _vm._e(),
            _vm._v(" "),
            _vm.computedRoute.match || _vm.forceRender
              ? _vm._t("default", null, {
                  history: _vm.router.history,
                  location: _vm.computedLocation,
                  match: _vm.computedRoute.match
                })
              : _vm._e()
          ]
    ],
    2
  )
};
var __vue_staticRenderFns__$5 = [];
__vue_render__$5._withStripped = true;

  /* style */
  const __vue_inject_styles__$5 = undefined;
  /* scoped */
  const __vue_scope_id__$5 = undefined;
  /* module identifier */
  const __vue_module_identifier__$5 = undefined;
  /* functional template */
  const __vue_is_functional_template__$5 = false;
  /* style inject */
  
  /* style inject SSR */
  

  
  var Route$1 = normalizeComponent_1(
    { render: __vue_render__$5, staticRenderFns: __vue_staticRenderFns__$5 },
    __vue_inject_styles__$5,
    __vue_script__$5,
    __vue_scope_id__$5,
    __vue_is_functional_template__$5,
    __vue_module_identifier__$5,
    undefined,
    undefined
  );

/**
 * Used for conditional rendering in template. 
 */
var Empty = {
  render: function render() {
    return null;
  }
};

//
var Prompt = {
  components: {
    Empty: Empty
  },
  props: {
    when: {
      type: Boolean,
      "default": true
    },
    message: {
      type: [Function, String],
      required: true
    }
  },
  inject: ['router', 'route'],
  created: function created() {
    assert(this.router, 'You should not use <Prompt> outside a <Router>');
    this.lastMessage = null;
    this.unblock = null;
  },
  mounted: function mounted() {
    if (this.when) this.block();
  },
  watch: {
    when: function when(val, oldVal) {
      if (!val) {
        if (this.unblock) this.unblock();
      } else {
        this.block();
      }
    }
  },
  methods: {
    block: function block() {
      var message = this.message,
          lastMessage = this.lastMessage;

      if (!this.unblock) {
        this.unblock = this.router.history.block(message);
      } else if (message !== lastMessage) {
        this.unblock();
        this.unblock = this.router.history.block(message);
      } // last message


      this.lastMessage = message;
    }
  },
  beforeDestroy: function beforeDestroy() {
    if (this.unblock) this.unblock();
  }
};

/* script */
const __vue_script__$6 = Prompt;

/* template */
var __vue_render__$6 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("empty")
};
var __vue_staticRenderFns__$6 = [];
__vue_render__$6._withStripped = true;

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
  

  
  var Prompt$1 = normalizeComponent_1(
    { render: __vue_render__$6, staticRenderFns: __vue_staticRenderFns__$6 },
    __vue_inject_styles__$6,
    __vue_script__$6,
    __vue_scope_id__$6,
    __vue_is_functional_template__$6,
    __vue_module_identifier__$6,
    undefined,
    undefined
  );

/**
 * copy from:
 * https://github.com/ReactTraining/react-router/blob/master/packages/react-router/modules/generatePath.js
 */
var cache$1 = {};
var cacheLimit$1 = 10000;
var cacheCount$1 = 0;

function compilePath$1(path) {
  if (cache$1[path]) return cache$1[path];
  var generator = pathToRegexp.compile(path);

  if (cacheCount$1 < cacheLimit$1) {
    cache$1[path] = generator;
    cacheCount$1++;
  }

  return generator;
}
/**
 * generating a URL pathname from a path and parameters.
 */


function generatePath() {
  var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "/";
  var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return path === "/" ? path : compilePath$1(path)(params, options);
}

var Redirect = {
  components: {
    Empty: Empty
  },
  props: {
    // to path
    to: {
      type: [String, Object],
      required: true
    },
    // wheather push
    push: {
      type: Boolean,
      "default": false
    }
  },
  inject: ['router', 'route'],
  created: function created() {
    assert(this.router, 'You must not use <Redirect> outside a <Router>.'); // static router

    if (this.isStatic()) this.perform();
  },
  mounted: function mounted() {
    // not static router
    if (!this.isStatic()) this.perform();
  },
  beforeUpdate: function beforeUpdate() {
    var to = this.computeTo(); // already redirect

    if (locationsAreEqual(this.lastTo, to)) {
      return;
    }

    this.perform();
  },
  methods: {
    // if static router
    isStatic: function isStatic() {
      return this.router && this.router.history.isStatic;
    },
    // to location
    computeTo: function computeTo() {
      var match = this.route.match;
      var location = this.router.history.location; // to

      var p = this.to; // route

      if (match) {
        if (typeof this.to === 'string') {
          // to is string
          p = generatePath(this.to, match.params);
        } else {
          // to is object
          p = _objectSpread({}, this.to, {
            pathname: generatePath(this.to.pathname, match.params)
          });
        }
      } // to


      var to = createLocation(p);
      return to;
    },
    perform: function perform() {
      var history = this.router.history; // history method

      var method = this.push ? history.push : history.replace;
      var to = this.computeTo(); // redirect

      this.lastTo = to;
      method(to);
    }
  }
};

/* script */
const __vue_script__$7 = Redirect;

/* template */
var __vue_render__$7 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("empty")
};
var __vue_staticRenderFns__$7 = [];
__vue_render__$7._withStripped = true;

  /* style */
  const __vue_inject_styles__$7 = undefined;
  /* scoped */
  const __vue_scope_id__$7 = undefined;
  /* module identifier */
  const __vue_module_identifier__$7 = undefined;
  /* functional template */
  const __vue_is_functional_template__$7 = false;
  /* style inject */
  
  /* style inject SSR */
  

  
  var Redirect$1 = normalizeComponent_1(
    { render: __vue_render__$7, staticRenderFns: __vue_staticRenderFns__$7 },
    __vue_inject_styles__$7,
    __vue_script__$7,
    __vue_scope_id__$7,
    __vue_is_functional_template__$7,
    __vue_module_identifier__$7,
    undefined,
    undefined
  );

/**
 * custom tag element
 */
var Tag = {
  functional: true,
  render: function render(createElement, context) {
    return createElement(context.props.tag || 'div', context.data, context.children);
  }
};

//
var RouterLink = {
  name: 'RouterLink',
  components: {
    Tag: Tag
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
      "default": false
    },
    // tag
    tag: {
      type: String,
      "default": 'a'
    },
    // user to check active
    exact: {
      type: Boolean,
      "default": false
    },
    // user to check active
    strict: {
      type: Boolean,
      "default": false
    },
    // user to check active
    sensitive: {
      type: Boolean,
      "default": true
    },
    // active class name
    activeClass: {
      type: String,
      "default": 'router-link-active'
    },
    // active class name
    exactActiveClass: {
      type: String,
      "default": 'router-link-exact-active'
    },
    // navitage event
    event: {
      type: String,
      "default": 'click'
    }
  },
  inject: ['router', 'route'],
  computed: {
    // current location
    currentLocation: function currentLocation() {
      var currentLocation = this.router.history.location;
      return currentLocation;
    },
    // to location
    toLocation: function toLocation() {
      var toLocation = normalizeToLocation(resolveToLocation(this.to, this.currentLocation), this.currentLocation);
      return toLocation;
    },
    // link href
    href: function href() {
      var history = this.router.history;
      var href = this.toLocation ? history.createHref(this.toLocation) : '';
      return href;
    },
    // path match with current location
    match: function match() {
      var to = this.to,
          exact = this.exact,
          strict = this.strict,
          sensitive = this.sensitive;
      var pathToMatch = this.currentLocation.pathname;
      var path = this.toLocation.pathname; // Regex taken from: https://github.com/pillarjs/path-to-regexp/blob/master/index.js#L202

      var escapedPath = path && path.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
      var match = escapedPath ? matchPath(pathToMatch, {
        path: escapedPath,
        exact: exact,
        strict: strict,
        sensitive: sensitive
      }) : null;
      return match;
    },
    classNames: function classNames() {
      var classNames = '';
      if (!this.match) return classNames;
      classNames += " ".concat(this.activeClass);
      if (this.match.exact) classNames += " ".concat(this.exactActiveClass);
      return classNames;
    }
  },
  methods: {
    handleClick: function handleClick(event) {
      this.$emit('click', event);
      if (!guardEvent(event)) return;
      var history = this.router.history;
      var replace = this.replace,
          to = this.to;
      var loc = resolveToLocation(to, this.currentLocation);

      if (replace) {
        history.replace(loc);
      } else {
        history.push(loc);
      }
    }
  },
  created: function created() {
    assert(this.router, 'You should not use <RouterLink> outside a <Router>');
  }
};

/* script */
const __vue_script__$8 = RouterLink;

/* template */
var __vue_render__$8 = function() {
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
var __vue_staticRenderFns__$8 = [];
__vue_render__$8._withStripped = true;

  /* style */
  const __vue_inject_styles__$8 = undefined;
  /* scoped */
  const __vue_scope_id__$8 = undefined;
  /* module identifier */
  const __vue_module_identifier__$8 = undefined;
  /* functional template */
  const __vue_is_functional_template__$8 = false;
  /* style inject */
  
  /* style inject SSR */
  

  
  var RouterLink$1 = normalizeComponent_1(
    { render: __vue_render__$8, staticRenderFns: __vue_staticRenderFns__$8 },
    __vue_inject_styles__$8,
    __vue_script__$8,
    __vue_scope_id__$8,
    __vue_is_functional_template__$8,
    __vue_module_identifier__$8,
    undefined,
    undefined
  );

var script = {
  inject: ['router', 'route'],
  data: function data() {
    return {
      history: this.router,
      location: this.history.location,
      match: this.route.match
    };
  }
};

/* script */
const __vue_script__$9 = script;

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
  

  
  var RouterRef = normalizeComponent_1(
    {},
    __vue_inject_styles__$9,
    __vue_script__$9,
    __vue_scope_id__$9,
    __vue_is_functional_template__$9,
    __vue_module_identifier__$9,
    undefined,
    undefined
  );

/**
 * render the first matched Route
 */

var MatchFirst = {
  inject: ['router', 'route'],
  beforeMount: function beforeMount() {
    assert(this.router, "You should not use <MatchFirst> outside a <Router>'");
  },
  render: function render() {
    var location = this.router.history.location;
    var vnode = this.$slots["default"].find(function (vnode) {
      if (!vnode.componentOptions) return false;
      if (!vnode.componentOptions.propsData) return false;
      var _vnode$componentOptio = vnode.componentOptions.propsData,
          path = _vnode$componentOptio.path,
          exact = _vnode$componentOptio.exact,
          strict = _vnode$componentOptio.strict,
          sensitive = _vnode$componentOptio.sensitive; // no path on route

      if (typeof path === 'undefined') return true;
      return !!matchPath(location.pathname, {
        path: path,
        exact: exact,
        strict: strict,
        sensitive: sensitive
      });
    });
    return vnode;
  }
};

export { BrowserRouter$1 as BrowserRouter, HashRouter$1 as HashRouter, MatchFirst, MemoryRouter$1 as MemoryRouter, Prompt$1 as Prompt, Redirect$1 as Redirect, Route$1 as Route, Router$1 as Router, RouterLink$1 as RouterLink, RouterRef, StaticRouter$1 as StaticRouter, createStaticHistory, generatePath, matchPath };
//# sourceMappingURL=router.esm.js.map
