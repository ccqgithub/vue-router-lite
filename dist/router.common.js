'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var history = require('history');
var pathToRegexp = _interopDefault(require('path-to-regexp'));

// warning
function warning(message) {
  if (!console || !console.warn) return;
  console.warn(message);
} // copyJson

function copyJson(data) {
  return JSON.parse(JSON.stringify(data));
}

/**
 * render the first existent child or empty
 */

var Single = {
  functional: true,
  render: function render(h, context) {
    if (!context.children.length) return null;

    if (context.children > 1) {
      warning("The component ".concat(context.props.name || 'Single', " should have only one child!"));
    }

    return context.children[0];
  }
};

//
var Router = {
  components: {
    Single: Single
  },
  props: {
    history: {
      type: Object,
      required: true
    }
  },
  provide: function provide() {
    return {
      router: {
        history: this.history,
        route: this.route
      }
    };
  },
  data: function data() {
    return {
      route: this.computeRoute(this.history)
    };
  },
  beforeMount: function beforeMount() {
    var _this = this;

    var history$$1 = this.history;
    this.unlisten = history$$1.listen(function () {
      _this.route = _this.computeRoute(history$$1);
    });
  },
  befreDestory: function befreDestory() {
    this.unlisten();
  },
  watch: {
    history: function history$$1(val, oldVal) {
      warning('You cannot change <Router history>');
    }
  },
  methods: {
    computeRoute: function computeRoute(history$$1) {
      var pathname = history$$1.location.pathname;
      return {
        location: copyJson(history$$1.location),
        match: {
          path: "/",
          url: "/",
          params: {},
          isExact: pathname === "/"
        }
      };
    }
  }
};

/* script */
            const __vue_script__ = Router;
            
/* template */
var __vue_render__ = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("single", [_vm._t("default")], 2)
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
  /* component normalizer */
  function __vue_normalize__(
    template, style, script,
    scope, functional, moduleIdentifier,
    createInjector, createInjectorSSR
  ) {
    const component = (typeof script === 'function' ? script.options : script) || {};

    // For security concerns, we use only base name in production mode.
    component.__file = "/Users/season/Documents/pwork/vue-router-lite/src/component/Router.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;

      if (functional) component.functional = true;
    }

    component._scopeId = scope;

    return component
  }
  /* style inject */
  
  /* style inject SSR */
  

  
  var Router$1 = __vue_normalize__(
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
  components: {
    Router: Router$1
  },
  props: {
    // just use to check if user pass history
    history: {
      validator: function validator(value) {
        return true;
      }
    },
    initialEntries: Array,
    initialIndex: Number,
    getUserConfirmation: Function,
    keyLength: Number
  },
  data: function data() {
    var history$$1 = history.createMemoryHistory({
      initialEntries: this.initialEntries,
      initialIndex: this.initialIndex,
      getUserConfirmation: this.getUserConfirmation,
      keyLength: this.keyLength
    });
    return {
      childHistory: history$$1
    };
  },
  beforeMount: function beforeMount() {
    if (this.history) {
      warning('<MemoryRouter> ignores the history prop. To use a custom history, ' + 'use `import { Router }` instead of `import { MemoryRouter as Router }`.');
    }
  }
};

/* script */
            const __vue_script__$1 = MemoryRouter;
            
/* template */
var __vue_render__$1 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "router",
    { attrs: { history: _vm.childHistory } },
    [_vm._t("default")],
    2
  )
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
  /* component normalizer */
  function __vue_normalize__$1(
    template, style, script,
    scope, functional, moduleIdentifier,
    createInjector, createInjectorSSR
  ) {
    const component = (typeof script === 'function' ? script.options : script) || {};

    // For security concerns, we use only base name in production mode.
    component.__file = "/Users/season/Documents/pwork/vue-router-lite/src/component/MemoryRouter.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;

      if (functional) component.functional = true;
    }

    component._scopeId = scope;

    return component
  }
  /* style inject */
  
  /* style inject SSR */
  

  
  var MemoryRouter$1 = __vue_normalize__$1(
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
  components: {
    Router: Router$1
  },
  props: {
    history: Object,
    basename: String,
    hashType: {
      validator: function validator(value) {
        return ["hashbang", "noslash", "slash"].indexOf(value) !== -1;
      }
    },
    getUserConfirmation: Function
  },
  data: function data() {
    var history$$1 = this.history;

    if (!history$$1) {
      history$$1 = history.createHashHistory({
        basename: this.basename,
        hashType: this.hashType,
        getUserConfirmation: this.getUserConfirmation
      });
    }

    return {
      childHistory: history$$1
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
  return _c(
    "router",
    { attrs: { history: _vm.childHistory } },
    [_vm._t("default")],
    2
  )
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
  /* component normalizer */
  function __vue_normalize__$2(
    template, style, script,
    scope, functional, moduleIdentifier,
    createInjector, createInjectorSSR
  ) {
    const component = (typeof script === 'function' ? script.options : script) || {};

    // For security concerns, we use only base name in production mode.
    component.__file = "/Users/season/Documents/pwork/vue-router-lite/src/component/HashRouter.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;

      if (functional) component.functional = true;
    }

    component._scopeId = scope;

    return component
  }
  /* style inject */
  
  /* style inject SSR */
  

  
  var HashRouter$1 = __vue_normalize__$2(
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
  components: {
    Router: Router$1
  },
  props: {
    history: Object,
    basename: String,
    forceRefresh: Boolean,
    keyLength: Number,
    getUserConfirmation: Function
  },
  data: function data() {
    var history$$1 = this.history;

    if (!history$$1) {
      history$$1 = history.createBrowserHistory({
        basename: this.basename,
        forceRefresh: this.forceRefresh,
        getUserConfirmation: this.getUserConfirmation,
        keyLength: this.keyLength
      });
    }

    return {
      childHistory: history$$1
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
  return _c(
    "router",
    { attrs: { history: _vm.childHistory } },
    [_vm._t("default")],
    2
  )
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
  /* component normalizer */
  function __vue_normalize__$3(
    template, style, script,
    scope, functional, moduleIdentifier,
    createInjector, createInjectorSSR
  ) {
    const component = (typeof script === 'function' ? script.options : script) || {};

    // For security concerns, we use only base name in production mode.
    component.__file = "/Users/season/Documents/pwork/vue-router-lite/src/component/BrowserRouter.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;

      if (functional) component.functional = true;
    }

    component._scopeId = scope;

    return component
  }
  /* style inject */
  
  /* style inject SSR */
  

  
  var BrowserRouter$1 = __vue_normalize__$3(
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

var addBasename = function addBasename(basename, location) {
  if (!basename) return location;
  return _objectSpread({}, location, {
    pathname: addLeadingSlash(basename) + location.pathname
  });
};

var stripBasename = function stripBasename(basename, location) {
  if (!basename) return location;
  var base = addLeadingSlash(basename);
  if (location.pathname.indexOf(base) !== 0) return location;
  return _objectSpread({}, location, {
    pathname: location.pathname.substr(base.length)
  });
};

var createURL = function createURL(location) {
  return typeof location === "string" ? location : history.createPath(location);
};

var staticHandler = function staticHandler(methodName) {
  return function () {
    throw new Error("You cannot ".concat(methodName, " with <StaticRouter>"));
  };
};

var noop = function noop() {};

var StaticRouter = {
  components: {
    Router: Router$1
  },
  props: {
    // just use to check if user pass history
    history: {
      validator: function validator(value) {
        return true;
      }
    },
    basename: {
      type: 'String',
      default: ''
    },
    context: {
      type: Object,
      default: function _default() {
        return {};
      }
    },
    location: {
      type: [String, Object],
      default: '/'
    }
  },
  provide: function provide() {
    return {
      router: {
        staticContext: this.context
      }
    };
  },
  computed: {
    childProps: function childProps() {
      var _this = this;

      var basename = this.basename,
          context = this.context,
          location = this.location;
      var history$$1 = {
        action: "POP",
        location: stripBasename(basename, history.createLocation(location)),
        go: staticHandler("go"),
        goBack: staticHandler("goBack"),
        goForward: staticHandler("goForward"),
        createHref: function createHref() {
          return _this.createHref.apply(_this, arguments);
        },
        push: function push() {
          return _this.handlePush.apply(_this, arguments);
        },
        replace: function replace() {
          return _this.handleReplace.apply(_this, arguments);
        },
        listen: function listen() {
          return noop;
        },
        block: function block() {
          return noop;
        }
      };
      return {
        history: history$$1
      };
    }
  },
  methods: {
    createHref: function createHref(path) {
      return addLeadingSlash(this.basename + createURL(path));
    },
    handlePush: function handlePush(location) {
      var basename = this.basename,
          context = this.context;
      context.action = "PUSH";
      context.location = addBasename(basename, history.createLocation(location));
      context.url = createURL(context.location);
    },
    handleReplace: function handleReplace(location) {
      var basename = this.basename,
          context = this.context;
      context.action = "REPLACE";
      context.location = addBasename(basename, history.createLocation(location));
      context.url = createURL(context.location);
    }
  },
  beforeMount: function beforeMount() {
    if (this.history) {
      warning('<StaticRouter> ignores the history prop. To use a custom history, ' + 'use `import { Router }` instead of `import { StaticRouter as Router }`.');
    }
  }
};

/* script */
            const __vue_script__$4 = StaticRouter;
            
/* template */
var __vue_render__$4 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "router",
    _vm._b({}, "router", _vm.childProps, false),
    [_vm._t("default")],
    2
  )
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
  /* component normalizer */
  function __vue_normalize__$4(
    template, style, script,
    scope, functional, moduleIdentifier,
    createInjector, createInjectorSSR
  ) {
    const component = (typeof script === 'function' ? script.options : script) || {};

    // For security concerns, we use only base name in production mode.
    component.__file = "/Users/season/Documents/pwork/vue-router-lite/src/component/StaticRouter.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;

      if (functional) component.functional = true;
    }

    component._scopeId = scope;

    return component
  }
  /* style inject */
  
  /* style inject SSR */
  

  
  var StaticRouter$1 = __vue_normalize__$4(
    { render: __vue_render__$4, staticRenderFns: __vue_staticRenderFns__$4 },
    __vue_inject_styles__$4,
    __vue_script__$4,
    __vue_scope_id__$4,
    __vue_is_functional_template__$4,
    __vue_module_identifier__$4,
    undefined,
    undefined
  );

var patternCache = {};
var cacheLimit = 10000;
var cacheCount = 0;

var compilePath = function compilePath(pattern, options) {
  var cacheKey = "".concat(options.end).concat(options.strict).concat(options.sensitive);
  var cache = patternCache[cacheKey] || (patternCache[cacheKey] = {});
  if (cache[pattern]) return cache[pattern];
  var keys = [];
  var re = pathToRegexp(pattern, keys, options);
  var compiledPattern = {
    re: re,
    keys: keys
  };

  if (cacheCount < cacheLimit) {
    cache[pattern] = compiledPattern;
    cacheCount++;
  }

  return compiledPattern;
};
/**
 * Public API for matching a URL pathname to a path pattern.
 */


var matchPath = function matchPath(pathname) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var parent = arguments.length > 2 ? arguments[2] : undefined;
  if (typeof options === "string") options = {
    path: options
  };
  var _options = options,
      path = _options.path,
      _options$exact = _options.exact,
      exact = _options$exact === void 0 ? false : _options$exact,
      _options$strict = _options.strict,
      strict = _options$strict === void 0 ? false : _options$strict,
      _options$sensitive = _options.sensitive,
      sensitive = _options$sensitive === void 0 ? false : _options$sensitive;
  if (path == null) return parent;

  var _compilePath = compilePath(path, {
    end: exact,
    strict: strict,
    sensitive: sensitive
  }),
      re = _compilePath.re,
      keys = _compilePath.keys;

  var match = re.exec(pathname);
  if (!match) return null;

  var _match = _toArray(match),
      url = _match[0],
      values = _match.slice(1);

  var isExact = pathname === url;
  if (exact && !isExact) return null;
  return {
    path: path,
    // the path pattern used to match
    url: path === "/" && url === "" ? "/" : url,
    // the matched portion of the URL
    isExact: isExact,
    // whether or not we matched exactly
    params: keys.reduce(function (memo, key, index) {
      memo[key.name] = values[index];
      return memo;
    }, {})
  };
};

var Route = {
  props: {
    path: String,
    exact: Boolean,
    strict: Boolean,
    sensitive: Boolean,
    location: Object,
    component: Object
  },
  inject: ['router'],
  provide: function provide() {
    return {
      router: {
        history: this.router.history,
        route: {
          location: this.location || this.router.route.location,
          match: this.match
        }
      }
    };
  },
  computed: {
    match: function match() {
      var location = this.location,
          path = this.path,
          strict = this.strict,
          exact = this.exact,
          sensitive = this.sensitive,
          router = this.router;

      if (!router) {
        throw new Error("You should not use <Route> or withRouter() outside a <Router>");
      }

      var route = router.route;
      var pathname = (location || route.location).pathname;
      return matchPath(pathname, {
        path: path,
        strict: strict,
        exact: exact,
        sensitive: sensitive
      }, route.match);
    },
    childProps: function childProps() {
      var location = this.location,
          match = this.match;
      var _this$router = this.router,
          history$$1 = _this$router.history,
          route = _this$router.route,
          staticContext = _this$router.staticContext;
      var nLocation = this.location || route.location;
      return _objectSpread({}, this.$attrs, {
        match: match,
        location: nLocation,
        history: history$$1,
        staticContext: staticContext
      });
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
  return _vm.match
    ? _c(
        "single",
        [
          _vm.component
            ? _c(
                _vm.component,
                _vm._b({ tag: "component" }, "component", _vm.childProps, false)
              )
            : _vm._e(),
          _vm._v(" "),
          _vm._t("default", null, null, _vm.childProps)
        ],
        2
      )
    : _vm._e()
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
  /* component normalizer */
  function __vue_normalize__$5(
    template, style, script,
    scope, functional, moduleIdentifier,
    createInjector, createInjectorSSR
  ) {
    const component = (typeof script === 'function' ? script.options : script) || {};

    // For security concerns, we use only base name in production mode.
    component.__file = "/Users/season/Documents/pwork/vue-router-lite/src/component/Route.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;

      if (functional) component.functional = true;
    }

    component._scopeId = scope;

    return component
  }
  /* style inject */
  
  /* style inject SSR */
  

  
  var Route$1 = __vue_normalize__$5(
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
  render: function render(h) {
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
      default: true
    },
    message: {
      type: [Function, String],
      required: true
    }
  },
  inject: ['router'],
  beforeMount: function beforeMount() {
    if (!this.router) {
      warning('You should not use <Prompt> outside a <Router>');
    }

    if (this.when) this.enable(this.message);
  },
  watch: {
    when: function when(val, old) {
      if (val) {
        if (!old && this.message) this.enable(this.message);
      } else {
        this.disable();
      }
    },
    message: function message(val) {
      if (val) {
        this.enable(this.message);
      }
    }
  },
  methods: {
    enable: function enable(message) {
      if (this.unblock) this.unblock();
      this.unblock = this.router.history.block(message);
    },
    disable: function disable() {
      if (this.unblock) {
        this.unblock();
        this.unblock = null;
      }
    }
  },
  beforeDestroy: function beforeDestroy() {
    this.disable();
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
  /* component normalizer */
  function __vue_normalize__$6(
    template, style, script,
    scope, functional, moduleIdentifier,
    createInjector, createInjectorSSR
  ) {
    const component = (typeof script === 'function' ? script.options : script) || {};

    // For security concerns, we use only base name in production mode.
    component.__file = "/Users/season/Documents/pwork/vue-router-lite/src/component/Prompt.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;

      if (functional) component.functional = true;
    }

    component._scopeId = scope;

    return component
  }
  /* style inject */
  
  /* style inject SSR */
  

  
  var Prompt$1 = __vue_normalize__$6(
    { render: __vue_render__$6, staticRenderFns: __vue_staticRenderFns__$6 },
    __vue_inject_styles__$6,
    __vue_script__$6,
    __vue_scope_id__$6,
    __vue_is_functional_template__$6,
    __vue_module_identifier__$6,
    undefined,
    undefined
  );

var patternCache$1 = {};
var cacheLimit$1 = 10000;
var cacheCount$1 = 0;

var compileGenerator = function compileGenerator(pattern) {
  var cacheKey = pattern;
  var cache = patternCache$1[cacheKey] || (patternCache$1[cacheKey] = {});
  if (cache[pattern]) return cache[pattern];
  var compiledGenerator = pathToRegexp.compile(pattern);

  if (cacheCount$1 < cacheLimit$1) {
    cache[pattern] = compiledGenerator;
    cacheCount$1++;
  }

  return compiledGenerator;
};
/**
 * Public API for generating a URL pathname from a pattern and parameters.
 */


var generatePath = function generatePath() {
  var pattern = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "/";
  var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (pattern === "/") {
    return pattern;
  }

  var generator = compileGenerator(pattern);
  return generator(params);
};

var Redirect = {
  components: {
    Empty: Empty
  },
  props: {
    computedMatch: Object,
    push: {
      type: Boolean,
      default: false
    },
    from: String,
    to: {
      type: [String, Object],
      required: true
    }
  },
  inject: ['router'],
  created: function created() {
    if (!this.router) {
      warning('You should not use <Redirect> outside a <Router>');
    }

    this.lastTo = this.to;
    if (this.isStatic()) this.perform();
  },
  mounted: function mounted() {
    if (!this.isStatic()) this.perform();
  },
  updated: function updated() {
    var prevTo = history.createLocation(this.lastTo);
    var nextTo = history.createLocation(this.to);

    if (history.locationsAreEqual(prevTo, nextTo)) {
      warning("You tried to redirect to the same route you're currently on: " + "\"".concat(nextTo.pathname).concat(nextTo.search, "\""));
      return;
    }

    this.perform();
  },
  methods: {
    isStatic: function isStatic() {
      return this.router && this.router.staticContext;
    },
    computeTo: function computeTo(_ref) {
      var computedMatch = _ref.computedMatch,
          to = _ref.to;

      if (computedMatch) {
        if (typeof to === "string") {
          return generatePath(to, computedMatch.params);
        } else {
          return _objectSpread({}, to, {
            pathname: generatePath(to.pathname, computedMatch.params)
          });
        }
      }

      return to;
    },
    perform: function perform() {
      var history$$1 = this.router.history;
      var push = this.push;
      var to = this.computeTo({
        computedMatch: this.computedMatch,
        to: this.to
      });
      this.lastTo = this.to;

      if (push) {
        history$$1.push(to);
      } else {
        history$$1.replace(to);
      }
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
  /* component normalizer */
  function __vue_normalize__$7(
    template, style, script,
    scope, functional, moduleIdentifier,
    createInjector, createInjectorSSR
  ) {
    const component = (typeof script === 'function' ? script.options : script) || {};

    // For security concerns, we use only base name in production mode.
    component.__file = "/Users/season/Documents/pwork/vue-router-lite/src/component/Redirect.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;

      if (functional) component.functional = true;
    }

    component._scopeId = scope;

    return component
  }
  /* style inject */
  
  /* style inject SSR */
  

  
  var Redirect$1 = __vue_normalize__$7(
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
  render: function render(h, context) {
    return h(context.props.tag || 'div', context.data, context.children);
  }
};

//

var Link = {
  components: {
    Tag: Tag
  },
  props: {
    // to path
    to: {
      type: [String, Object],
      required: true
    },
    // below props not used for slot scope
    target: String,
    replace: {
      type: Boolean,
      default: false
    },
    tag: {
      type: String,
      default: 'a'
    },
    className: {
      type: [String, Object, Array],
      default: function _default() {}
    },
    style: {
      type: [String, Object, Array],
      default: function _default() {}
    }
  },
  inject: ['router'],
  computed: {
    href: function href() {
      var history$$1 = this.router.history;
      var location = typeof to === "string" ? history.createLocation(to, null, null, history$$1.location) : to;
      var href = history$$1.createHref(location);
      return href;
    }
  },
  methods: {
    handleClick: function handleClick(event) {
      this.$emit('click', event);
      event.preventDefault();
      var history$$1 = this.router.history;
      var replace = this.replace,
          to = this.to;

      if (replace) {
        history$$1.replace(to);
      } else {
        history$$1.push(to);
      }
    }
  },
  beforeMount: function beforeMount() {
    if (!this.to) {
      throw new Error('You must specify the "to" property');
    }

    if (!this.router) {
      warning('You should not use <Link> outside a <Router>');
    }
  }
};

/* script */
            const __vue_script__$8 = Link;
            
/* template */
var __vue_render__$8 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "single",
    [
      _vm._t("default", null, { href: _vm.href, history: _vm.router.history }),
      _vm._v(" "),
      _c(
        "tag",
        _vm._b(
          {
            class: _vm.className,
            style: _vm.style,
            attrs: { tag: _vm.tag, target: _vm.target, href: _vm.href },
            on: { click: _vm.handleClick }
          },
          "tag",
          _vm.$attrs,
          false
        ),
        [_vm._t("default")],
        2
      )
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
  /* component normalizer */
  function __vue_normalize__$8(
    template, style, script,
    scope, functional, moduleIdentifier,
    createInjector, createInjectorSSR
  ) {
    const component = (typeof script === 'function' ? script.options : script) || {};

    // For security concerns, we use only base name in production mode.
    component.__file = "/Users/season/Documents/pwork/vue-router-lite/src/component/Link.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;

      if (functional) component.functional = true;
    }

    component._scopeId = scope;

    return component
  }
  /* style inject */
  
  /* style inject SSR */
  

  
  var Link$1 = __vue_normalize__$8(
    { render: __vue_render__$8, staticRenderFns: __vue_staticRenderFns__$8 },
    __vue_inject_styles__$8,
    __vue_script__$8,
    __vue_scope_id__$8,
    __vue_is_functional_template__$8,
    __vue_module_identifier__$8,
    undefined,
    undefined
  );

//
var NavLink = {
  components: {
    Route: Route$1,
    XLink: Link$1
  },
  props: {
    // to path
    to: {
      type: [String, Object],
      required: true
    },
    path: {
      type: String,
      required: true
    },
    activeClass: String,
    activeStyle: Object
  },
  methods: {
    getClassName: function getClassName(_ref) {
      var match = _ref.match;
      return match ? this.activeClass : '';
    },
    getStyle: function getStyle(_ref2) {
      var match = _ref2.match;
      return match ? this.activeStyle : {};
    }
  }
};

/* script */
            const __vue_script__$9 = NavLink;
            
/* template */
var __vue_render__$9 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("route", {
    attrs: { path: _vm.path },
    scopedSlots: _vm._u([
      {
        key: "default",
        fn: function(scope) {
          return [_c("x-link", { class: _vm.getClassName(scope) })]
        }
      }
    ])
  })
};
var __vue_staticRenderFns__$9 = [];
__vue_render__$9._withStripped = true;

  /* style */
  const __vue_inject_styles__$9 = undefined;
  /* scoped */
  const __vue_scope_id__$9 = undefined;
  /* module identifier */
  const __vue_module_identifier__$9 = undefined;
  /* functional template */
  const __vue_is_functional_template__$9 = false;
  /* component normalizer */
  function __vue_normalize__$9(
    template, style, script,
    scope, functional, moduleIdentifier,
    createInjector, createInjectorSSR
  ) {
    const component = (typeof script === 'function' ? script.options : script) || {};

    // For security concerns, we use only base name in production mode.
    component.__file = "/Users/season/Documents/pwork/vue-router-lite/src/component/NavLink.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;

      if (functional) component.functional = true;
    }

    component._scopeId = scope;

    return component
  }
  /* style inject */
  
  /* style inject SSR */
  

  
  var NavLink$1 = __vue_normalize__$9(
    { render: __vue_render__$9, staticRenderFns: __vue_staticRenderFns__$9 },
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

var Switch = {
  props: {
    location: Object
  },
  inject: ['router'],
  beforeMount: function beforeMount() {
    if (!this.router) {
      warning('You should not use <Switch> outside a <Router>');
    }
  },
  render: function render(h) {
    var _this = this;

    var vnode = this.$slots.default.find(function (vnode) {
      if (!vnode.componentOptions) return false;
      var _vnode$componentOptio = vnode.componentOptions.propsData,
          path = _vnode$componentOptio.path,
          exact = _vnode$componentOptio.exact,
          strict = _vnode$componentOptio.strict,
          sensitive = _vnode$componentOptio.sensitive;
      return matchPath(path, {
        exact: exact,
        strict: strict,
        sensitive: sensitive
      }, _this.router.location);
    });
    return vnode;
  }
};

/**
 * wrap Component with Route, 
 * so the Component will have the propeties: location, history, match ...
 */

var withRouter = function withRouter(Component) {
  return {
    functional: true,
    render: function render(h, context) {
      context.data.props.component = Component;
      return h(Route$1, context.data, context.children);
    }
  };
};

exports.Router = Router$1;
exports.MemoryRouter = MemoryRouter$1;
exports.HashRouvter = HashRouter$1;
exports.BrowserRouter = BrowserRouter$1;
exports.StaticRouter = StaticRouter$1;
exports.Prompt = Prompt$1;
exports.Redirect = Redirect$1;
exports.Route = Route$1;
exports.Link = Link$1;
exports.NavLink = NavLink$1;
exports.Switch = Switch;
exports.generatePath = generatePath;
exports.matchPath = matchPath;
exports.withRouter = withRouter;
//# sourceMappingURL=router.common.js.map
