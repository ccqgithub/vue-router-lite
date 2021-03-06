/*!
  * vue-router-lite v1.3.0
  * (c) 2019-present Season Chen
  * @license MIT
  */
import { createLocation, createMemoryHistory, createHashHistory, createBrowserHistory, createPath, locationsAreEqual } from 'history';
export { createBrowserHistory, createHashHistory, createMemoryHistory } from 'history';
import { pathToRegexp, compile } from 'path-to-regexp';

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

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

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _toArray(arr) {
  return _arrayWithHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(n);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function assert(condition, message) {
  if (!condition) {
    throw new Error("[vue-router-lite] ".concat(message));
  }
}

var resolveToLocation = function resolveToLocation(to, currentLocation) {
  return typeof to === 'function' ? to(currentLocation) : to;
}; //

var normalizeToLocation = function normalizeToLocation(to, currentLocation) {
  return typeof to === 'string' ? createLocation(to, null, null, currentLocation) : to;
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
function isAsyncPlaceholder(node) {
  return node.isComment && node.asyncFactory;
}
function isNotTextNode(c) {
  return c.tag || isAsyncPlaceholder(c);
}
function getBooleanProps(val) {
  var defaultVal = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  if (typeof val === 'undefined') return defaultVal;
  return val !== 'false';
}

function getSymbol(str) {
  if (typeof Symbol === 'function') {
    return Symbol(str);
  }

  return "vue-router-lite-symbol-".concat(str);
}
var route = getSymbol('route');
var router = getSymbol('router');

var Router = {
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
      "default": 'router'
    }
  },
  provide: function provide() {
    var _ref;

    return _ref = {}, _defineProperty(_ref, router, this.router), _defineProperty(_ref, route, this.route), _ref;
  },
  data: function data() {
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
  created: function created() {
    var _this = this;

    var history = this.history;
    this.unlisten = history.listen(function () {
      _this.route.location = history.location;
      _this.route.match = _this.computeMatch(history.location.pathname);
    });
  },
  befreDestory: function befreDestory() {
    this.unlisten();
  },
  watch: {
    history: function history(val, oldVal) {
      assert(false, "You cannot change <router>'s history!");
    }
  },
  methods: {
    computeMatch: function computeMatch(pathname) {
      return {
        path: '/',
        url: '/',
        params: {},
        isExact: pathname === '/'
      };
    }
  },
  render: function render(createElement) {
    var children = this.$scopedSlots["default"]({
      history: this.history,
      location: this.route.location,
      match: this.route.match
    });
    children = children.filter(isNotTextNode);
    assert(children.length === 1, "<".concat(this.name, "> must only be used on a single child element."));
    return children[0];
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


  const options = typeof script === 'function' ? script.options : script; // render functions

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

  let hook;

  if (moduleIdentifier) {
    // server build
    hook = function (context) {
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
    hook = shadowMode ? function (context) {
      style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
    } : function (context) {
      style.call(this, createInjector(context));
    };
  }

  if (hook) {
    if (options.functional) {
      // register for functional component in vue file
      const originalRender = options.render;

      options.render = function renderWithStyleInjection(h, context) {
        hook.call(context);
        return originalRender(h, context);
      };
    } else {
      // inject component registration as beforeCreate hook
      const existing = options.beforeCreate;
      options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
    }
  }

  return script;
}

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
  
  /* style inject shadow dom */
  

  
  const __vue_component__ = normalizeComponent(
    {},
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    false,
    undefined,
    undefined,
    undefined
  );

//
var MemoryRouter = {
  name: 'MemoryRouter',
  components: {
    Router: __vue_component__
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
      type: Function,
      "default": null
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
  
  /* style inject shadow dom */
  

  
  const __vue_component__$1 = normalizeComponent(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__$1,
    __vue_script__$1,
    __vue_scope_id__$1,
    __vue_is_functional_template__$1,
    __vue_module_identifier__$1,
    false,
    undefined,
    undefined,
    undefined
  );

//
var HashRouter = {
  name: 'HashRouter',
  components: {
    Router: __vue_component__
  },
  props: {
    basename: {
      type: String,
      "default": ''
    },
    hashType: {
      validator: function validator(value) {
        return ['hashbang', 'noslash', 'slash'].indexOf(value) !== -1;
      },
      "default": 'slash'
    },
    getUserConfirmation: {
      type: Function,
      "default": function _default(message, callback) {
        // eslint-disable-next-line no-alert
        callback(window.confirm(message));
      }
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
  
  /* style inject shadow dom */
  

  
  const __vue_component__$2 = normalizeComponent(
    { render: __vue_render__$1, staticRenderFns: __vue_staticRenderFns__$1 },
    __vue_inject_styles__$2,
    __vue_script__$2,
    __vue_scope_id__$2,
    __vue_is_functional_template__$2,
    __vue_module_identifier__$2,
    false,
    undefined,
    undefined,
    undefined
  );

//
var BrowserRouter = {
  name: 'BrowserRouter',
  components: {
    Router: __vue_component__
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
        // eslint-disable-next-line no-alert
        callback(window.confirm(message));
      }
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
  
  /* style inject shadow dom */
  

  
  const __vue_component__$3 = normalizeComponent(
    { render: __vue_render__$2, staticRenderFns: __vue_staticRenderFns__$2 },
    __vue_inject_styles__$3,
    __vue_script__$3,
    __vue_scope_id__$3,
    __vue_is_functional_template__$3,
    __vue_module_identifier__$3,
    false,
    undefined,
    undefined,
    undefined
  );

var addLeadingSlash = function addLeadingSlash(path) {
  return path.charAt(0) === '/' ? path : "/".concat(path);
};

var removeTailSlash = function removeTailSlash(path) {
  return path.replace(/\/+$/, '');
};

var addBasename = function addBasename(basename, location) {
  if (!basename) return location;
  return _objectSpread2({}, location, {
    pathname: removeTailSlash(addLeadingSlash(basename)) + addLeadingSlash(location.pathname)
  });
};

var stripBasename = function stripBasename(basename, location) {
  if (!basename) return location;
  var base = addLeadingSlash(basename);
  if (location.pathname.indexOf(base) !== 0) return location;
  return _objectSpread2({}, location, {
    pathname: addLeadingSlash(location.pathname.substr(base.length))
  });
};

var createURL = function createURL(location) {
  return typeof location === 'string' ? location : createPath(location);
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
    action: 'POP',
    location: stripBasename(basename, createLocation(location)),
    go: staticHandler('go'),
    goBack: staticHandler('goBack'),
    goForward: staticHandler('goForward'),
    createHref: function createHref(loc) {
      return addLeadingSlash(removeTailSlash(basename) + createURL(loc));
    },
    push: function push(loc) {
      context.action = 'PUSH';
      context.location = addBasename(basename, createLocation(loc));
      context.url = createURL(context.location);
    },
    replace: function replace(loc) {
      context.action = 'REPLACE';
      context.location = addBasename(basename, createLocation(loc));
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
    Router: __vue_component__
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
  
  /* style inject shadow dom */
  

  
  const __vue_component__$4 = normalizeComponent(
    { render: __vue_render__$3, staticRenderFns: __vue_staticRenderFns__$3 },
    __vue_inject_styles__$4,
    __vue_script__$4,
    __vue_scope_id__$4,
    __vue_is_functional_template__$4,
    __vue_module_identifier__$4,
    false,
    undefined,
    undefined,
    undefined
  );

var cache = {};
var cacheLimit = 10000;
var cacheCount = 0;

function compilePath(path, options) {
  var cacheKey = "".concat(options.end, "-").concat(options.strict, "-").concat(options.sensitive);
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
  if (typeof options === 'string') options = {
    path: options
  };
  var _options = options,
      p = _options.path,
      _options$exact = _options.exact,
      exact = _options$exact === void 0 ? false : _options$exact,
      _options$strict = _options.strict,
      strict = _options$strict === void 0 ? false : _options$strict,
      _options$sensitive = _options.sensitive,
      sensitive = _options$sensitive === void 0 ? true : _options$sensitive;
  var paths = [].concat(p);
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
      url: path === '/' && url === '' ? '/' : url,
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

var script = {
  name: 'Tag',
  functional: true,
  props: {
    tag: {
      type: String,
      "default": 'div'
    }
  },
  render: function render(createElement, context) {
    return createElement(context.props.tag, context.data, context.children);
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
  
  /* style inject shadow dom */
  

  
  const __vue_component__$5 = normalizeComponent(
    {},
    __vue_inject_styles__$5,
    __vue_script__$5,
    __vue_scope_id__$5,
    __vue_is_functional_template__$5,
    __vue_module_identifier__$5,
    false,
    undefined,
    undefined,
    undefined
  );

//
var RouterLink = {
  name: 'RouterLink',
  components: {
    Tag: __vue_component__$5
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
    },
    // location
    location: {
      type: Object
    }
  },
  inject: {
    router: {
      from: router
    },
    route: {
      from: route
    }
  },
  computed: {
    // current location
    currentLocation: function currentLocation() {
      var currentLocation = this.location || this.route.location;
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

      var escapedPath = path && path.replace(/([.+*?=^!:${}()[\]|/\\])/g, '\\$1');
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
    assert(this.router, 'You should not use <router-link> outside a <router>');
  },
  beforeUpdate: function beforeUpdate() {
    assert(this.router, 'You should not use <router-link> outside a <router>');
  }
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
  
  /* style inject shadow dom */
  

  
  const __vue_component__$6 = normalizeComponent(
    { render: __vue_render__$4, staticRenderFns: __vue_staticRenderFns__$4 },
    __vue_inject_styles__$6,
    __vue_script__$6,
    __vue_scope_id__$6,
    __vue_is_functional_template__$6,
    __vue_module_identifier__$6,
    false,
    undefined,
    undefined,
    undefined
  );

var Prompt = {
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
  inject: {
    router: {
      from: router
    },
    route: {
      from: route
    }
  },
  created: function created() {
    assert(this.router, 'You should not use <prompt> outside a <router>');
    this.lastMessage = null;
    this.unblock = null;
  },
  beforeUpdate: function beforeUpdate() {
    assert(this.router, 'You should not use <prompt> outside a <router>');
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
  },
  render: function render() {
    return null;
  }
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
  
  /* style inject shadow dom */
  

  
  const __vue_component__$7 = normalizeComponent(
    {},
    __vue_inject_styles__$7,
    __vue_script__$7,
    __vue_scope_id__$7,
    __vue_is_functional_template__$7,
    __vue_module_identifier__$7,
    false,
    undefined,
    undefined,
    undefined
  );

/**
 * reference from:
 * https://github.com/ReactTraining/react-router/blob/master/packages/react-router/modules/generatePath.js
 */
var cache$1 = {};
var cacheLimit$1 = 10000;
var cacheCount$1 = 0;

function compilePath$1(path) {
  if (cache$1[path]) return cache$1[path];
  var generator = compile(path);

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
  var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '/';
  var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return path === '/' ? path : compilePath$1(path)(params, options);
}

var Redirect = {
  name: 'Redirect',
  props: {
    // from path
    from: {
      type: String,
      "default": null
    },
    // to path
    to: {
      type: [String, Object],
      required: true
    },
    // wheather push
    push: {
      type: Boolean,
      "default": false
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
    }
  },
  inject: {
    router: {
      from: router
    },
    route: {
      from: route
    }
  },
  created: function created() {
    assert(this.router, 'You must not use <redirect> outside a <router>.'); // static router

    if (this.isStatic()) this.perform();
  },
  mounted: function mounted() {
    // not static router
    if (!this.isStatic()) this.perform();
  },
  beforeUpdate: function beforeUpdate() {
    assert(this.router, 'You must not use <redirect> outside a <router>.');
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
      var from = this.from,
          strict = this.strict,
          exact = this.exact,
          sensitive = this.sensitive,
          route = this.route;
      var pathname = route.location.pathname;
      var match = from ? matchPath(pathname, {
        from: from,
        strict: strict,
        exact: exact,
        sensitive: sensitive
      }) : route.match; // to

      var p = this.to; // route

      if (match) {
        if (typeof this.to === 'string') {
          // to is string
          p = generatePath(this.to, match.params);
        } else {
          // to is object
          p = _objectSpread2({}, this.to, {
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
  },
  render: function render() {
    return null;
  }
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
  
  /* style inject shadow dom */
  

  
  const __vue_component__$8 = normalizeComponent(
    {},
    __vue_inject_styles__$8,
    __vue_script__$8,
    __vue_scope_id__$8,
    __vue_is_functional_template__$8,
    __vue_module_identifier__$8,
    false,
    undefined,
    undefined,
    undefined
  );

var Route = {
  name: 'Route',
  props: {
    path: {
      type: [String, Array],
      "default": ''
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
    forceRender: {
      type: Boolean,
      "default": false
    },
    location: {
      type: Object,
      "default": null
    }
  },
  inject: {
    router: {
      from: router
    },
    route: {
      from: route
    }
  },
  provide: function provide() {
    return _defineProperty({}, route, this.computedRoute);
  },
  data: function data() {
    return {
      isActive: true,
      // add provide's properties in data, to make provide reactivity
      computedRoute: {
        location: this.route.location,
        match: this.route.match
      }
    };
  },
  computed: {
    computeLocation: function computeLocation() {
      return this.location || this.route.location;
    },
    computeMatch: function computeMatch() {
      var computedLocation = this.computeLocation;
      var path = this.path,
          strict = this.strict,
          exact = this.exact,
          sensitive = this.sensitive,
          route = this.route;
      var pathname = computedLocation.pathname;
      var match = path ? matchPath(pathname, {
        path: path,
        strict: strict,
        exact: exact,
        sensitive: sensitive
      }) : route.match;
      return match;
    }
  },
  watch: {
    computeMatch: {
      handler: function handler() {
        this.updateRoute();
      },
      deep: true
    }
  },
  methods: {
    updateRoute: function updateRoute() {
      if (!this.isActive) return;
      this.computedRoute.location = this.computeLocation;
      this.computedRoute.match = this.computeMatch;
    }
  },
  created: function created() {
    assert(this.router, "You should not use <route> outside a <router>."); // update current route

    this.updateRoute();
  },
  beforeUpdate: function beforeUpdate() {
    assert(this.router, "You should not use <route> outside a <router>.");
  },
  activated: function activated() {
    this.isActive = true;
    this.updateRoute();
  },
  deactivated: function deactivated() {
    this.isActive = false;
  },
  render: function render(createElement) {
    var router = this.router,
        computedRoute = this.computedRoute,
        forceRender = this.forceRender,
        $scopedSlots = this.$scopedSlots,
        name = this.name;
    var history = router.history;
    var match = computedRoute.match,
        location = computedRoute.location;
    if (!match && !forceRender) return null;
    var children = $scopedSlots["default"]({
      match: match,
      history: history,
      location: location
    });
    children = (children || []).filter(isNotTextNode);
    if (!children.length) return null;
    assert(children.length === 1, "<".concat(name, "> can only be used on a single child element."));
    var vnode = children[0];
    return vnode;
  }
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
  
  /* style inject shadow dom */
  

  
  const __vue_component__$9 = normalizeComponent(
    {},
    __vue_inject_styles__$9,
    __vue_script__$9,
    __vue_scope_id__$9,
    __vue_is_functional_template__$9,
    __vue_module_identifier__$9,
    false,
    undefined,
    undefined,
    undefined
  );

var RouterContext = {
  name: 'RouterContext',
  inject: {
    router: {
      from: router
    },
    route: {
      from: route
    }
  },
  data: function data() {
    return {
      history: this.router.history,
      location: this.route.location,
      match: this.route.match
    };
  },
  render: function render() {
    return null;
  }
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
  
  /* style inject shadow dom */
  

  
  const __vue_component__$a = normalizeComponent(
    {},
    __vue_inject_styles__$a,
    __vue_script__$a,
    __vue_scope_id__$a,
    __vue_is_functional_template__$a,
    __vue_module_identifier__$a,
    false,
    undefined,
    undefined,
    undefined
  );

var RouteSwitch = {
  name: 'RouteSwitch',
  props: {
    location: Object,
    keepAlive: {
      type: [Object, Boolean],
      "default": false
    }
  },
  inject: {
    router: {
      from: router
    },
    route: {
      from: route
    }
  },
  provide: function provide() {
    return _defineProperty({}, route, this.computedRoute);
  },
  data: function data() {
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
    computeLocation: function computeLocation() {
      return this.location || this.route.location;
    }
  },
  watch: {
    computeLocation: {
      handler: function handler() {
        this.updateRoute();
      },
      deep: true
    }
  },
  methods: {
    updateRoute: function updateRoute() {
      if (!this.isActive) return;
      this.computedRoute.location = this.computeLocation;
      this.computedRoute.match = this.route.match;
    }
  },
  created: function created() {
    assert(this.router, "You should not use <route-switch> outside a <router>."); // update current route

    this.updateRoute();
  },
  beforeUpdate: function beforeUpdate() {
    assert(this.router, "You should not use <route-switch> outside a <router>.");
  },
  activated: function activated() {
    this.isActive = true;
    this.updateRoute();
  },
  deactivated: function deactivated() {
    this.isActive = false;
  },
  render: function render(createElement, context) {
    var location = this.computedRoute.location;
    var children = (this.$slots["default"] || []).filter(isNotTextNode);
    var realChild = null;

    if (children.length) {
      realChild = children.find(function (node) {
        // filter text nodes
        if (!node.tag) return false; // check children if <route> component

        assert(node.componentOptions && node.componentOptions.Ctor && node.componentOptions.Ctor.options.name === 'Route', "<route-switch>'s children can only be <route>.");
        var propsData = node.componentOptions.propsData || {};
        var _propsData$path = propsData.path,
            path = _propsData$path === void 0 ? '' : _propsData$path;
        var exact = getBooleanProps(propsData.exact, false);
        var strict = getBooleanProps(propsData.strict, false);
        var sensitive = getBooleanProps(propsData.sensitive, true); // no path on route

        if (!path) return true; // check path to match

        var match = matchPath(location.pathname, {
          path: path,
          exact: exact,
          strict: strict,
          sensitive: sensitive
        });

        if (match) {
          node.key = match.url;
          return true;
        }

        return false;
      });
    }

    if (this.keepAlive) {
      return createElement('keep-alive', {
        props: _typeof(this.keepAlive) === 'object' ? this.keepAlive : {}
      }, [realChild]);
    }

    return realChild;
  }
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
  
  /* style inject shadow dom */
  

  
  const __vue_component__$b = normalizeComponent(
    {},
    __vue_inject_styles__$b,
    __vue_script__$b,
    __vue_scope_id__$b,
    __vue_is_functional_template__$b,
    __vue_module_identifier__$b,
    false,
    undefined,
    undefined,
    undefined
  );

var install = function install(Vue) {
  [__vue_component__$1, __vue_component__$2, __vue_component__$3, __vue_component__$4, __vue_component__, __vue_component__$6, __vue_component__$7, __vue_component__$8, __vue_component__$9, __vue_component__$a, __vue_component__$b].forEach(function (component) {
    Vue.component(component.name, component);
  });
};
/* istanbul ignore if */


if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

var index = {
  version: '1.3.0',
  install: install
};

export default index;
export { __vue_component__$3 as BrowserRouter, __vue_component__$2 as HashRouter, __vue_component__$1 as MemoryRouter, __vue_component__$7 as Prompt, __vue_component__$8 as Redirect, __vue_component__$9 as Route, __vue_component__$a as RouteContext, __vue_component__$b as RouteSwitch, __vue_component__ as Router, __vue_component__$6 as RouterLink, __vue_component__$4 as StaticRouter, createStaticHistory, generatePath, matchPath };
