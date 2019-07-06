/*!
  * vue-router-lite v1.2.0
  * (c) 2019-present Season Chen
  * @license MIT
  */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.VueRouterLite = {}));
}(this, function (exports) { 'use strict';

  function _extends() {
    _extends = Object.assign || function (target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];

        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }

      return target;
    };

    return _extends.apply(this, arguments);
  }

  function isAbsolute(pathname) {
    return pathname.charAt(0) === '/';
  } // About 1.5x faster than the two-arg version of Array#splice()


  function spliceOne(list, index) {
    for (var i = index, k = i + 1, n = list.length; k < n; i += 1, k += 1) {
      list[i] = list[k];
    }

    list.pop();
  } // This implementation is based heavily on node's url.parse


  function resolvePathname(to) {
    var from = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    var toParts = to && to.split('/') || [];
    var fromParts = from && from.split('/') || [];
    var isToAbs = to && isAbsolute(to);
    var isFromAbs = from && isAbsolute(from);
    var mustEndAbs = isToAbs || isFromAbs;

    if (to && isAbsolute(to)) {
      // to is absolute
      fromParts = toParts;
    } else if (toParts.length) {
      // to is relative, drop the filename
      fromParts.pop();
      fromParts = fromParts.concat(toParts);
    }

    if (!fromParts.length) return '/';
    var hasTrailingSlash = void 0;

    if (fromParts.length) {
      var last = fromParts[fromParts.length - 1];
      hasTrailingSlash = last === '.' || last === '..' || last === '';
    } else {
      hasTrailingSlash = false;
    }

    var up = 0;

    for (var i = fromParts.length; i >= 0; i--) {
      var part = fromParts[i];

      if (part === '.') {
        spliceOne(fromParts, i);
      } else if (part === '..') {
        spliceOne(fromParts, i);
        up++;
      } else if (up) {
        spliceOne(fromParts, i);
        up--;
      }
    }

    if (!mustEndAbs) for (; up--; up) {
      fromParts.unshift('..');
    }
    if (mustEndAbs && fromParts[0] !== '' && (!fromParts[0] || !isAbsolute(fromParts[0]))) fromParts.unshift('');
    var result = fromParts.join('/');
    if (hasTrailingSlash && result.substr(-1) !== '/') result += '/';
    return result;
  }

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  function valueEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;

    if (Array.isArray(a)) {
      return Array.isArray(b) && a.length === b.length && a.every(function (item, index) {
        return valueEqual(item, b[index]);
      });
    }

    var aType = typeof a === 'undefined' ? 'undefined' : _typeof(a);
    var bType = typeof b === 'undefined' ? 'undefined' : _typeof(b);
    if (aType !== bType) return false;

    if (aType === 'object') {
      var aValue = a.valueOf();
      var bValue = b.valueOf();
      if (aValue !== a || bValue !== b) return valueEqual(aValue, bValue);
      var aKeys = Object.keys(a);
      var bKeys = Object.keys(b);
      if (aKeys.length !== bKeys.length) return false;
      return aKeys.every(function (key) {
        return valueEqual(a[key], b[key]);
      });
    }

    return false;
  }

  function warning(condition, message) {
    {
      if (condition) {
        return;
      }

      var text = "Warning: " + message;

      if (typeof console !== 'undefined') {
        console.warn(text);
      }

      try {
        throw Error(text);
      } catch (x) {}
    }
  }

  var prefix = 'Invariant failed';

  function invariant(condition, message) {
    if (condition) {
      return;
    }

    {
      throw new Error(prefix + ": " + (message || ''));
    }
  }

  function addLeadingSlash(path) {
    return path.charAt(0) === '/' ? path : '/' + path;
  }

  function stripLeadingSlash(path) {
    return path.charAt(0) === '/' ? path.substr(1) : path;
  }

  function hasBasename(path, prefix) {
    return new RegExp('^' + prefix + '(\\/|\\?|#|$)', 'i').test(path);
  }

  function stripBasename(path, prefix) {
    return hasBasename(path, prefix) ? path.substr(prefix.length) : path;
  }

  function stripTrailingSlash(path) {
    return path.charAt(path.length - 1) === '/' ? path.slice(0, -1) : path;
  }

  function parsePath(path) {
    var pathname = path || '/';
    var search = '';
    var hash = '';
    var hashIndex = pathname.indexOf('#');

    if (hashIndex !== -1) {
      hash = pathname.substr(hashIndex);
      pathname = pathname.substr(0, hashIndex);
    }

    var searchIndex = pathname.indexOf('?');

    if (searchIndex !== -1) {
      search = pathname.substr(searchIndex);
      pathname = pathname.substr(0, searchIndex);
    }

    return {
      pathname: pathname,
      search: search === '?' ? '' : search,
      hash: hash === '#' ? '' : hash
    };
  }

  function createPath(location) {
    var pathname = location.pathname,
        search = location.search,
        hash = location.hash;
    var path = pathname || '/';
    if (search && search !== '?') path += search.charAt(0) === '?' ? search : "?" + search;
    if (hash && hash !== '#') path += hash.charAt(0) === '#' ? hash : "#" + hash;
    return path;
  }

  function createLocation(path, state, key, currentLocation) {
    var location;

    if (typeof path === 'string') {
      // Two-arg form: push(path, state)
      location = parsePath(path);
      location.state = state;
    } else {
      // One-arg form: push(location)
      location = _extends({}, path);
      if (location.pathname === undefined) location.pathname = '';

      if (location.search) {
        if (location.search.charAt(0) !== '?') location.search = '?' + location.search;
      } else {
        location.search = '';
      }

      if (location.hash) {
        if (location.hash.charAt(0) !== '#') location.hash = '#' + location.hash;
      } else {
        location.hash = '';
      }

      if (state !== undefined && location.state === undefined) location.state = state;
    }

    try {
      location.pathname = decodeURI(location.pathname);
    } catch (e) {
      if (e instanceof URIError) {
        throw new URIError('Pathname "' + location.pathname + '" could not be decoded. ' + 'This is likely caused by an invalid percent-encoding.');
      } else {
        throw e;
      }
    }

    if (key) location.key = key;

    if (currentLocation) {
      // Resolve incomplete/relative pathname relative to current location.
      if (!location.pathname) {
        location.pathname = currentLocation.pathname;
      } else if (location.pathname.charAt(0) !== '/') {
        location.pathname = resolvePathname(location.pathname, currentLocation.pathname);
      }
    } else {
      // When there is no prior location and pathname is empty, set it to /
      if (!location.pathname) {
        location.pathname = '/';
      }
    }

    return location;
  }

  function locationsAreEqual(a, b) {
    return a.pathname === b.pathname && a.search === b.search && a.hash === b.hash && a.key === b.key && valueEqual(a.state, b.state);
  }

  function createTransitionManager() {
    var prompt = null;

    function setPrompt(nextPrompt) {
       warning(prompt == null, 'A history supports only one prompt at a time') ;
      prompt = nextPrompt;
      return function () {
        if (prompt === nextPrompt) prompt = null;
      };
    }

    function confirmTransitionTo(location, action, getUserConfirmation, callback) {
      // TODO: If another transition starts while we're still confirming
      // the previous one, we may end up in a weird state. Figure out the
      // best way to handle this.
      if (prompt != null) {
        var result = typeof prompt === 'function' ? prompt(location, action) : prompt;

        if (typeof result === 'string') {
          if (typeof getUserConfirmation === 'function') {
            getUserConfirmation(result, callback);
          } else {
             warning(false, 'A history needs a getUserConfirmation function in order to use a prompt message') ;
            callback(true);
          }
        } else {
          // Return false from a transition hook to cancel the transition.
          callback(result !== false);
        }
      } else {
        callback(true);
      }
    }

    var listeners = [];

    function appendListener(fn) {
      var isActive = true;

      function listener() {
        if (isActive) fn.apply(void 0, arguments);
      }

      listeners.push(listener);
      return function () {
        isActive = false;
        listeners = listeners.filter(function (item) {
          return item !== listener;
        });
      };
    }

    function notifyListeners() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      listeners.forEach(function (listener) {
        return listener.apply(void 0, args);
      });
    }

    return {
      setPrompt: setPrompt,
      confirmTransitionTo: confirmTransitionTo,
      appendListener: appendListener,
      notifyListeners: notifyListeners
    };
  }

  var canUseDOM = !!(typeof window !== 'undefined' && window.document && window.document.createElement);

  function getConfirmation(message, callback) {
    callback(window.confirm(message)); // eslint-disable-line no-alert
  }
  /**
   * Returns true if the HTML5 history API is supported. Taken from Modernizr.
   *
   * https://github.com/Modernizr/Modernizr/blob/master/LICENSE
   * https://github.com/Modernizr/Modernizr/blob/master/feature-detects/history.js
   * changed to avoid false negatives for Windows Phones: https://github.com/reactjs/react-router/issues/586
   */


  function supportsHistory() {
    var ua = window.navigator.userAgent;
    if ((ua.indexOf('Android 2.') !== -1 || ua.indexOf('Android 4.0') !== -1) && ua.indexOf('Mobile Safari') !== -1 && ua.indexOf('Chrome') === -1 && ua.indexOf('Windows Phone') === -1) return false;
    return window.history && 'pushState' in window.history;
  }
  /**
   * Returns true if browser fires popstate on hash change.
   * IE10 and IE11 do not.
   */


  function supportsPopStateOnHashChange() {
    return window.navigator.userAgent.indexOf('Trident') === -1;
  }
  /**
   * Returns false if using go(n) with hash history causes a full page reload.
   */


  function supportsGoWithoutReloadUsingHash() {
    return window.navigator.userAgent.indexOf('Firefox') === -1;
  }
  /**
   * Returns true if a given popstate event is an extraneous WebKit event.
   * Accounts for the fact that Chrome on iOS fires real popstate events
   * containing undefined state when pressing the back button.
   */


  function isExtraneousPopstateEvent(event) {
    event.state === undefined && navigator.userAgent.indexOf('CriOS') === -1;
  }

  var PopStateEvent = 'popstate';
  var HashChangeEvent = 'hashchange';

  function getHistoryState() {
    try {
      return window.history.state || {};
    } catch (e) {
      // IE 11 sometimes throws when accessing window.history.state
      // See https://github.com/ReactTraining/history/pull/289
      return {};
    }
  }
  /**
   * Creates a history object that uses the HTML5 history API including
   * pushState, replaceState, and the popstate event.
   */


  function createBrowserHistory(props) {
    if (props === void 0) {
      props = {};
    }

    !canUseDOM ?  invariant(false, 'Browser history needs a DOM')  : void 0;
    var globalHistory = window.history;
    var canUseHistory = supportsHistory();
    var needsHashChangeListener = !supportsPopStateOnHashChange();
    var _props = props,
        _props$forceRefresh = _props.forceRefresh,
        forceRefresh = _props$forceRefresh === void 0 ? false : _props$forceRefresh,
        _props$getUserConfirm = _props.getUserConfirmation,
        getUserConfirmation = _props$getUserConfirm === void 0 ? getConfirmation : _props$getUserConfirm,
        _props$keyLength = _props.keyLength,
        keyLength = _props$keyLength === void 0 ? 6 : _props$keyLength;
    var basename = props.basename ? stripTrailingSlash(addLeadingSlash(props.basename)) : '';

    function getDOMLocation(historyState) {
      var _ref = historyState || {},
          key = _ref.key,
          state = _ref.state;

      var _window$location = window.location,
          pathname = _window$location.pathname,
          search = _window$location.search,
          hash = _window$location.hash;
      var path = pathname + search + hash;
       warning(!basename || hasBasename(path, basename), 'You are attempting to use a basename on a page whose URL path does not begin ' + 'with the basename. Expected path "' + path + '" to begin with "' + basename + '".') ;
      if (basename) path = stripBasename(path, basename);
      return createLocation(path, state, key);
    }

    function createKey() {
      return Math.random().toString(36).substr(2, keyLength);
    }

    var transitionManager = createTransitionManager();

    function setState(nextState) {
      _extends(history, nextState);

      history.length = globalHistory.length;
      transitionManager.notifyListeners(history.location, history.action);
    }

    function handlePopState(event) {
      // Ignore extraneous popstate events in WebKit.
      if (isExtraneousPopstateEvent(event)) return;
      handlePop(getDOMLocation(event.state));
    }

    function handleHashChange() {
      handlePop(getDOMLocation(getHistoryState()));
    }

    var forceNextPop = false;

    function handlePop(location) {
      if (forceNextPop) {
        forceNextPop = false;
        setState();
      } else {
        var action = 'POP';
        transitionManager.confirmTransitionTo(location, action, getUserConfirmation, function (ok) {
          if (ok) {
            setState({
              action: action,
              location: location
            });
          } else {
            revertPop(location);
          }
        });
      }
    }

    function revertPop(fromLocation) {
      var toLocation = history.location; // TODO: We could probably make this more reliable by
      // keeping a list of keys we've seen in sessionStorage.
      // Instead, we just default to 0 for keys we don't know.

      var toIndex = allKeys.indexOf(toLocation.key);
      if (toIndex === -1) toIndex = 0;
      var fromIndex = allKeys.indexOf(fromLocation.key);
      if (fromIndex === -1) fromIndex = 0;
      var delta = toIndex - fromIndex;

      if (delta) {
        forceNextPop = true;
        go(delta);
      }
    }

    var initialLocation = getDOMLocation(getHistoryState());
    var allKeys = [initialLocation.key]; // Public interface

    function createHref(location) {
      return basename + createPath(location);
    }

    function push(path, state) {
       warning(!(typeof path === 'object' && path.state !== undefined && state !== undefined), 'You should avoid providing a 2nd state argument to push when the 1st ' + 'argument is a location-like object that already has state; it is ignored') ;
      var action = 'PUSH';
      var location = createLocation(path, state, createKey(), history.location);
      transitionManager.confirmTransitionTo(location, action, getUserConfirmation, function (ok) {
        if (!ok) return;
        var href = createHref(location);
        var key = location.key,
            state = location.state;

        if (canUseHistory) {
          globalHistory.pushState({
            key: key,
            state: state
          }, null, href);

          if (forceRefresh) {
            window.location.href = href;
          } else {
            var prevIndex = allKeys.indexOf(history.location.key);
            var nextKeys = allKeys.slice(0, prevIndex === -1 ? 0 : prevIndex + 1);
            nextKeys.push(location.key);
            allKeys = nextKeys;
            setState({
              action: action,
              location: location
            });
          }
        } else {
           warning(state === undefined, 'Browser history cannot push state in browsers that do not support HTML5 history') ;
          window.location.href = href;
        }
      });
    }

    function replace(path, state) {
       warning(!(typeof path === 'object' && path.state !== undefined && state !== undefined), 'You should avoid providing a 2nd state argument to replace when the 1st ' + 'argument is a location-like object that already has state; it is ignored') ;
      var action = 'REPLACE';
      var location = createLocation(path, state, createKey(), history.location);
      transitionManager.confirmTransitionTo(location, action, getUserConfirmation, function (ok) {
        if (!ok) return;
        var href = createHref(location);
        var key = location.key,
            state = location.state;

        if (canUseHistory) {
          globalHistory.replaceState({
            key: key,
            state: state
          }, null, href);

          if (forceRefresh) {
            window.location.replace(href);
          } else {
            var prevIndex = allKeys.indexOf(history.location.key);
            if (prevIndex !== -1) allKeys[prevIndex] = location.key;
            setState({
              action: action,
              location: location
            });
          }
        } else {
           warning(state === undefined, 'Browser history cannot replace state in browsers that do not support HTML5 history') ;
          window.location.replace(href);
        }
      });
    }

    function go(n) {
      globalHistory.go(n);
    }

    function goBack() {
      go(-1);
    }

    function goForward() {
      go(1);
    }

    var listenerCount = 0;

    function checkDOMListeners(delta) {
      listenerCount += delta;

      if (listenerCount === 1 && delta === 1) {
        window.addEventListener(PopStateEvent, handlePopState);
        if (needsHashChangeListener) window.addEventListener(HashChangeEvent, handleHashChange);
      } else if (listenerCount === 0) {
        window.removeEventListener(PopStateEvent, handlePopState);
        if (needsHashChangeListener) window.removeEventListener(HashChangeEvent, handleHashChange);
      }
    }

    var isBlocked = false;

    function block(prompt) {
      if (prompt === void 0) {
        prompt = false;
      }

      var unblock = transitionManager.setPrompt(prompt);

      if (!isBlocked) {
        checkDOMListeners(1);
        isBlocked = true;
      }

      return function () {
        if (isBlocked) {
          isBlocked = false;
          checkDOMListeners(-1);
        }

        return unblock();
      };
    }

    function listen(listener) {
      var unlisten = transitionManager.appendListener(listener);
      checkDOMListeners(1);
      return function () {
        checkDOMListeners(-1);
        unlisten();
      };
    }

    var history = {
      length: globalHistory.length,
      action: 'POP',
      location: initialLocation,
      createHref: createHref,
      push: push,
      replace: replace,
      go: go,
      goBack: goBack,
      goForward: goForward,
      block: block,
      listen: listen
    };
    return history;
  }

  var HashChangeEvent$1 = 'hashchange';
  var HashPathCoders = {
    hashbang: {
      encodePath: function encodePath(path) {
        return path.charAt(0) === '!' ? path : '!/' + stripLeadingSlash(path);
      },
      decodePath: function decodePath(path) {
        return path.charAt(0) === '!' ? path.substr(1) : path;
      }
    },
    noslash: {
      encodePath: stripLeadingSlash,
      decodePath: addLeadingSlash
    },
    slash: {
      encodePath: addLeadingSlash,
      decodePath: addLeadingSlash
    }
  };

  function getHashPath() {
    // We can't use window.location.hash here because it's not
    // consistent across browsers - Firefox will pre-decode it!
    var href = window.location.href;
    var hashIndex = href.indexOf('#');
    return hashIndex === -1 ? '' : href.substring(hashIndex + 1);
  }

  function pushHashPath(path) {
    window.location.hash = path;
  }

  function replaceHashPath(path) {
    var hashIndex = window.location.href.indexOf('#');
    window.location.replace(window.location.href.slice(0, hashIndex >= 0 ? hashIndex : 0) + '#' + path);
  }

  function createHashHistory(props) {
    if (props === void 0) {
      props = {};
    }

    !canUseDOM ?  invariant(false, 'Hash history needs a DOM')  : void 0;
    var globalHistory = window.history;
    var canGoWithoutReload = supportsGoWithoutReloadUsingHash();
    var _props = props,
        _props$getUserConfirm = _props.getUserConfirmation,
        getUserConfirmation = _props$getUserConfirm === void 0 ? getConfirmation : _props$getUserConfirm,
        _props$hashType = _props.hashType,
        hashType = _props$hashType === void 0 ? 'slash' : _props$hashType;
    var basename = props.basename ? stripTrailingSlash(addLeadingSlash(props.basename)) : '';
    var _HashPathCoders$hashT = HashPathCoders[hashType],
        encodePath = _HashPathCoders$hashT.encodePath,
        decodePath = _HashPathCoders$hashT.decodePath;

    function getDOMLocation() {
      var path = decodePath(getHashPath());
       warning(!basename || hasBasename(path, basename), 'You are attempting to use a basename on a page whose URL path does not begin ' + 'with the basename. Expected path "' + path + '" to begin with "' + basename + '".') ;
      if (basename) path = stripBasename(path, basename);
      return createLocation(path);
    }

    var transitionManager = createTransitionManager();

    function setState(nextState) {
      _extends(history, nextState);

      history.length = globalHistory.length;
      transitionManager.notifyListeners(history.location, history.action);
    }

    var forceNextPop = false;
    var ignorePath = null;

    function handleHashChange() {
      var path = getHashPath();
      var encodedPath = encodePath(path);

      if (path !== encodedPath) {
        // Ensure we always have a properly-encoded hash.
        replaceHashPath(encodedPath);
      } else {
        var location = getDOMLocation();
        var prevLocation = history.location;
        if (!forceNextPop && locationsAreEqual(prevLocation, location)) return; // A hashchange doesn't always == location change.

        if (ignorePath === createPath(location)) return; // Ignore this change; we already setState in push/replace.

        ignorePath = null;
        handlePop(location);
      }
    }

    function handlePop(location) {
      if (forceNextPop) {
        forceNextPop = false;
        setState();
      } else {
        var action = 'POP';
        transitionManager.confirmTransitionTo(location, action, getUserConfirmation, function (ok) {
          if (ok) {
            setState({
              action: action,
              location: location
            });
          } else {
            revertPop(location);
          }
        });
      }
    }

    function revertPop(fromLocation) {
      var toLocation = history.location; // TODO: We could probably make this more reliable by
      // keeping a list of paths we've seen in sessionStorage.
      // Instead, we just default to 0 for paths we don't know.

      var toIndex = allPaths.lastIndexOf(createPath(toLocation));
      if (toIndex === -1) toIndex = 0;
      var fromIndex = allPaths.lastIndexOf(createPath(fromLocation));
      if (fromIndex === -1) fromIndex = 0;
      var delta = toIndex - fromIndex;

      if (delta) {
        forceNextPop = true;
        go(delta);
      }
    } // Ensure the hash is encoded properly before doing anything else.


    var path = getHashPath();
    var encodedPath = encodePath(path);
    if (path !== encodedPath) replaceHashPath(encodedPath);
    var initialLocation = getDOMLocation();
    var allPaths = [createPath(initialLocation)]; // Public interface

    function createHref(location) {
      return '#' + encodePath(basename + createPath(location));
    }

    function push(path, state) {
       warning(state === undefined, 'Hash history cannot push state; it is ignored') ;
      var action = 'PUSH';
      var location = createLocation(path, undefined, undefined, history.location);
      transitionManager.confirmTransitionTo(location, action, getUserConfirmation, function (ok) {
        if (!ok) return;
        var path = createPath(location);
        var encodedPath = encodePath(basename + path);
        var hashChanged = getHashPath() !== encodedPath;

        if (hashChanged) {
          // We cannot tell if a hashchange was caused by a PUSH, so we'd
          // rather setState here and ignore the hashchange. The caveat here
          // is that other hash histories in the page will consider it a POP.
          ignorePath = path;
          pushHashPath(encodedPath);
          var prevIndex = allPaths.lastIndexOf(createPath(history.location));
          var nextPaths = allPaths.slice(0, prevIndex === -1 ? 0 : prevIndex + 1);
          nextPaths.push(path);
          allPaths = nextPaths;
          setState({
            action: action,
            location: location
          });
        } else {
           warning(false, 'Hash history cannot PUSH the same path; a new entry will not be added to the history stack') ;
          setState();
        }
      });
    }

    function replace(path, state) {
       warning(state === undefined, 'Hash history cannot replace state; it is ignored') ;
      var action = 'REPLACE';
      var location = createLocation(path, undefined, undefined, history.location);
      transitionManager.confirmTransitionTo(location, action, getUserConfirmation, function (ok) {
        if (!ok) return;
        var path = createPath(location);
        var encodedPath = encodePath(basename + path);
        var hashChanged = getHashPath() !== encodedPath;

        if (hashChanged) {
          // We cannot tell if a hashchange was caused by a REPLACE, so we'd
          // rather setState here and ignore the hashchange. The caveat here
          // is that other hash histories in the page will consider it a POP.
          ignorePath = path;
          replaceHashPath(encodedPath);
        }

        var prevIndex = allPaths.indexOf(createPath(history.location));
        if (prevIndex !== -1) allPaths[prevIndex] = path;
        setState({
          action: action,
          location: location
        });
      });
    }

    function go(n) {
       warning(canGoWithoutReload, 'Hash history go(n) causes a full page reload in this browser') ;
      globalHistory.go(n);
    }

    function goBack() {
      go(-1);
    }

    function goForward() {
      go(1);
    }

    var listenerCount = 0;

    function checkDOMListeners(delta) {
      listenerCount += delta;

      if (listenerCount === 1 && delta === 1) {
        window.addEventListener(HashChangeEvent$1, handleHashChange);
      } else if (listenerCount === 0) {
        window.removeEventListener(HashChangeEvent$1, handleHashChange);
      }
    }

    var isBlocked = false;

    function block(prompt) {
      if (prompt === void 0) {
        prompt = false;
      }

      var unblock = transitionManager.setPrompt(prompt);

      if (!isBlocked) {
        checkDOMListeners(1);
        isBlocked = true;
      }

      return function () {
        if (isBlocked) {
          isBlocked = false;
          checkDOMListeners(-1);
        }

        return unblock();
      };
    }

    function listen(listener) {
      var unlisten = transitionManager.appendListener(listener);
      checkDOMListeners(1);
      return function () {
        checkDOMListeners(-1);
        unlisten();
      };
    }

    var history = {
      length: globalHistory.length,
      action: 'POP',
      location: initialLocation,
      createHref: createHref,
      push: push,
      replace: replace,
      go: go,
      goBack: goBack,
      goForward: goForward,
      block: block,
      listen: listen
    };
    return history;
  }

  function clamp(n, lowerBound, upperBound) {
    return Math.min(Math.max(n, lowerBound), upperBound);
  }
  /**
   * Creates a history object that stores locations in memory.
   */


  function createMemoryHistory(props) {
    if (props === void 0) {
      props = {};
    }

    var _props = props,
        getUserConfirmation = _props.getUserConfirmation,
        _props$initialEntries = _props.initialEntries,
        initialEntries = _props$initialEntries === void 0 ? ['/'] : _props$initialEntries,
        _props$initialIndex = _props.initialIndex,
        initialIndex = _props$initialIndex === void 0 ? 0 : _props$initialIndex,
        _props$keyLength = _props.keyLength,
        keyLength = _props$keyLength === void 0 ? 6 : _props$keyLength;
    var transitionManager = createTransitionManager();

    function setState(nextState) {
      _extends(history, nextState);

      history.length = history.entries.length;
      transitionManager.notifyListeners(history.location, history.action);
    }

    function createKey() {
      return Math.random().toString(36).substr(2, keyLength);
    }

    var index = clamp(initialIndex, 0, initialEntries.length - 1);
    var entries = initialEntries.map(function (entry) {
      return typeof entry === 'string' ? createLocation(entry, undefined, createKey()) : createLocation(entry, undefined, entry.key || createKey());
    }); // Public interface

    var createHref = createPath;

    function push(path, state) {
       warning(!(typeof path === 'object' && path.state !== undefined && state !== undefined), 'You should avoid providing a 2nd state argument to push when the 1st ' + 'argument is a location-like object that already has state; it is ignored') ;
      var action = 'PUSH';
      var location = createLocation(path, state, createKey(), history.location);
      transitionManager.confirmTransitionTo(location, action, getUserConfirmation, function (ok) {
        if (!ok) return;
        var prevIndex = history.index;
        var nextIndex = prevIndex + 1;
        var nextEntries = history.entries.slice(0);

        if (nextEntries.length > nextIndex) {
          nextEntries.splice(nextIndex, nextEntries.length - nextIndex, location);
        } else {
          nextEntries.push(location);
        }

        setState({
          action: action,
          location: location,
          index: nextIndex,
          entries: nextEntries
        });
      });
    }

    function replace(path, state) {
       warning(!(typeof path === 'object' && path.state !== undefined && state !== undefined), 'You should avoid providing a 2nd state argument to replace when the 1st ' + 'argument is a location-like object that already has state; it is ignored') ;
      var action = 'REPLACE';
      var location = createLocation(path, state, createKey(), history.location);
      transitionManager.confirmTransitionTo(location, action, getUserConfirmation, function (ok) {
        if (!ok) return;
        history.entries[history.index] = location;
        setState({
          action: action,
          location: location
        });
      });
    }

    function go(n) {
      var nextIndex = clamp(history.index + n, 0, history.entries.length - 1);
      var action = 'POP';
      var location = history.entries[nextIndex];
      transitionManager.confirmTransitionTo(location, action, getUserConfirmation, function (ok) {
        if (ok) {
          setState({
            action: action,
            location: location,
            index: nextIndex
          });
        } else {
          // Mimic the behavior of DOM histories by
          // causing a render after a cancelled POP.
          setState();
        }
      });
    }

    function goBack() {
      go(-1);
    }

    function goForward() {
      go(1);
    }

    function canGo(n) {
      var nextIndex = history.index + n;
      return nextIndex >= 0 && nextIndex < history.entries.length;
    }

    function block(prompt) {
      if (prompt === void 0) {
        prompt = false;
      }

      return transitionManager.setPrompt(prompt);
    }

    function listen(listener) {
      return transitionManager.appendListener(listener);
    }

    var history = {
      length: entries.length,
      action: 'POP',
      location: entries[index],
      index: index,
      entries: entries,
      createHref: createHref,
      push: push,
      replace: replace,
      go: go,
      goBack: goBack,
      goForward: goForward,
      canGo: canGo,
      block: block,
      listen: listen
    };
    return history;
  }

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

  const addLeadingSlash$1 = path => {
    return path.charAt(0) === "/" ? path : "/" + path;
  };

  const removeTailSlash = path => {
    return path.replace(/\/+$/, '');
  };

  const addBasename = (basename, location) => {
    if (!basename) return location;
    return { ...location,
      pathname: removeTailSlash(addLeadingSlash$1(basename)) + addLeadingSlash$1(location.pathname)
    };
  };

  const stripBasename$1 = (basename, location) => {
    if (!basename) return location;
    const base = addLeadingSlash$1(basename);
    if (location.pathname.indexOf(base) !== 0) return location;
    return { ...location,
      pathname: addLeadingSlash$1(location.pathname.substr(base.length))
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
      location: stripBasename$1(basename, createLocation(location)),
      go: staticHandler("go"),
      goBack: staticHandler("goBack"),
      goForward: staticHandler("goForward"),
      createHref: location => {
        return addLeadingSlash$1(removeTailSlash(basename) + createURL(location));
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
   * Expose `pathToRegexp`.
   */
  var pathToRegexp_1 = pathToRegexp;
  var parse_1 = parse;
  var compile_1 = compile;
  var tokensToFunction_1 = tokensToFunction;
  var tokensToRegExp_1 = tokensToRegExp;
  /**
   * Default configs.
   */

  var DEFAULT_DELIMITER = '/';
  /**
   * The main path matching regexp utility.
   *
   * @type {RegExp}
   */

  var PATH_REGEXP = new RegExp([// Match escaped characters that would otherwise appear in future matches.
  // This allows the user to escape special characters that won't transform.
  '(\\\\.)', // Match Express-style parameters and un-named parameters with a prefix
  // and optional suffixes. Matches appear as:
  //
  // ":test(\\d+)?" => ["test", "\d+", undefined, "?"]
  // "(\\d+)"  => [undefined, undefined, "\d+", undefined]
  '(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?'].join('|'), 'g');
  /**
   * Parse a string for the raw tokens.
   *
   * @param  {string}  str
   * @param  {Object=} options
   * @return {!Array}
   */

  function parse(str, options) {
    var tokens = [];
    var key = 0;
    var index = 0;
    var path = '';
    var defaultDelimiter = options && options.delimiter || DEFAULT_DELIMITER;
    var whitelist = options && options.whitelist || undefined;
    var pathEscaped = false;
    var res;

    while ((res = PATH_REGEXP.exec(str)) !== null) {
      var m = res[0];
      var escaped = res[1];
      var offset = res.index;
      path += str.slice(index, offset);
      index = offset + m.length; // Ignore already escaped sequences.

      if (escaped) {
        path += escaped[1];
        pathEscaped = true;
        continue;
      }

      var prev = '';
      var name = res[2];
      var capture = res[3];
      var group = res[4];
      var modifier = res[5];

      if (!pathEscaped && path.length) {
        var k = path.length - 1;
        var c = path[k];
        var matches = whitelist ? whitelist.indexOf(c) > -1 : true;

        if (matches) {
          prev = c;
          path = path.slice(0, k);
        }
      } // Push the current path onto the tokens.


      if (path) {
        tokens.push(path);
        path = '';
        pathEscaped = false;
      }

      var repeat = modifier === '+' || modifier === '*';
      var optional = modifier === '?' || modifier === '*';
      var pattern = capture || group;
      var delimiter = prev || defaultDelimiter;
      tokens.push({
        name: name || key++,
        prefix: prev,
        delimiter: delimiter,
        optional: optional,
        repeat: repeat,
        pattern: pattern ? escapeGroup(pattern) : '[^' + escapeString(delimiter === defaultDelimiter ? delimiter : delimiter + defaultDelimiter) + ']+?'
      });
    } // Push any remaining characters.


    if (path || index < str.length) {
      tokens.push(path + str.substr(index));
    }

    return tokens;
  }
  /**
   * Compile a string to a template function for the path.
   *
   * @param  {string}             str
   * @param  {Object=}            options
   * @return {!function(Object=, Object=)}
   */


  function compile(str, options) {
    return tokensToFunction(parse(str, options));
  }
  /**
   * Expose a method for transforming tokens into the path function.
   */


  function tokensToFunction(tokens) {
    // Compile all the tokens into regexps.
    var matches = new Array(tokens.length); // Compile all the patterns before compilation.

    for (var i = 0; i < tokens.length; i++) {
      if (typeof tokens[i] === 'object') {
        matches[i] = new RegExp('^(?:' + tokens[i].pattern + ')$');
      }
    }

    return function (data, options) {
      var path = '';
      var encode = options && options.encode || encodeURIComponent;

      for (var i = 0; i < tokens.length; i++) {
        var token = tokens[i];

        if (typeof token === 'string') {
          path += token;
          continue;
        }

        var value = data ? data[token.name] : undefined;
        var segment;

        if (Array.isArray(value)) {
          if (!token.repeat) {
            throw new TypeError('Expected "' + token.name + '" to not repeat, but got array');
          }

          if (value.length === 0) {
            if (token.optional) continue;
            throw new TypeError('Expected "' + token.name + '" to not be empty');
          }

          for (var j = 0; j < value.length; j++) {
            segment = encode(value[j], token);

            if (!matches[i].test(segment)) {
              throw new TypeError('Expected all "' + token.name + '" to match "' + token.pattern + '"');
            }

            path += (j === 0 ? token.prefix : token.delimiter) + segment;
          }

          continue;
        }

        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
          segment = encode(String(value), token);

          if (!matches[i].test(segment)) {
            throw new TypeError('Expected "' + token.name + '" to match "' + token.pattern + '", but got "' + segment + '"');
          }

          path += token.prefix + segment;
          continue;
        }

        if (token.optional) continue;
        throw new TypeError('Expected "' + token.name + '" to be ' + (token.repeat ? 'an array' : 'a string'));
      }

      return path;
    };
  }
  /**
   * Escape a regular expression string.
   *
   * @param  {string} str
   * @return {string}
   */


  function escapeString(str) {
    return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, '\\$1');
  }
  /**
   * Escape the capturing group by escaping special characters and meaning.
   *
   * @param  {string} group
   * @return {string}
   */


  function escapeGroup(group) {
    return group.replace(/([=!:$/()])/g, '\\$1');
  }
  /**
   * Get the flags for a regexp from the options.
   *
   * @param  {Object} options
   * @return {string}
   */


  function flags(options) {
    return options && options.sensitive ? '' : 'i';
  }
  /**
   * Pull out keys from a regexp.
   *
   * @param  {!RegExp} path
   * @param  {Array=}  keys
   * @return {!RegExp}
   */


  function regexpToRegexp(path, keys) {
    if (!keys) return path; // Use a negative lookahead to match only capturing groups.

    var groups = path.source.match(/\((?!\?)/g);

    if (groups) {
      for (var i = 0; i < groups.length; i++) {
        keys.push({
          name: i,
          prefix: null,
          delimiter: null,
          optional: false,
          repeat: false,
          pattern: null
        });
      }
    }

    return path;
  }
  /**
   * Transform an array into a regexp.
   *
   * @param  {!Array}  path
   * @param  {Array=}  keys
   * @param  {Object=} options
   * @return {!RegExp}
   */


  function arrayToRegexp(path, keys, options) {
    var parts = [];

    for (var i = 0; i < path.length; i++) {
      parts.push(pathToRegexp(path[i], keys, options).source);
    }

    return new RegExp('(?:' + parts.join('|') + ')', flags(options));
  }
  /**
   * Create a path regexp from string input.
   *
   * @param  {string}  path
   * @param  {Array=}  keys
   * @param  {Object=} options
   * @return {!RegExp}
   */


  function stringToRegexp(path, keys, options) {
    return tokensToRegExp(parse(path, options), keys, options);
  }
  /**
   * Expose a function for taking tokens and returning a RegExp.
   *
   * @param  {!Array}  tokens
   * @param  {Array=}  keys
   * @param  {Object=} options
   * @return {!RegExp}
   */


  function tokensToRegExp(tokens, keys, options) {
    options = options || {};
    var strict = options.strict;
    var start = options.start !== false;
    var end = options.end !== false;
    var delimiter = options.delimiter || DEFAULT_DELIMITER;
    var endsWith = [].concat(options.endsWith || []).map(escapeString).concat('$').join('|');
    var route = start ? '^' : ''; // Iterate over the tokens and create our regexp string.

    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i];

      if (typeof token === 'string') {
        route += escapeString(token);
      } else {
        var capture = token.repeat ? '(?:' + token.pattern + ')(?:' + escapeString(token.delimiter) + '(?:' + token.pattern + '))*' : token.pattern;
        if (keys) keys.push(token);

        if (token.optional) {
          if (!token.prefix) {
            route += '(' + capture + ')?';
          } else {
            route += '(?:' + escapeString(token.prefix) + '(' + capture + '))?';
          }
        } else {
          route += escapeString(token.prefix) + '(' + capture + ')';
        }
      }
    }

    if (end) {
      if (!strict) route += '(?:' + escapeString(delimiter) + ')?';
      route += endsWith === '$' ? '$' : '(?=' + endsWith + ')';
    } else {
      var endToken = tokens[tokens.length - 1];
      var isEndDelimited = typeof endToken === 'string' ? endToken[endToken.length - 1] === delimiter : endToken === undefined;
      if (!strict) route += '(?:' + escapeString(delimiter) + '(?=' + endsWith + '))?';
      if (!isEndDelimited) route += '(?=' + escapeString(delimiter) + '|' + endsWith + ')';
    }

    return new RegExp(route, flags(options));
  }
  /**
   * Normalize the given path string, returning a regular expression.
   *
   * An empty array can be passed in for the keys, which will hold the
   * placeholder key descriptions. For example, using `/user/:id`, `keys` will
   * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
   *
   * @param  {(string|RegExp|Array)} path
   * @param  {Array=}                keys
   * @param  {Object=}               options
   * @return {!RegExp}
   */


  function pathToRegexp(path, keys, options) {
    if (path instanceof RegExp) {
      return regexpToRegexp(path, keys);
    }

    if (Array.isArray(path)) {
      return arrayToRegexp(
      /** @type {!Array} */
      path, keys, options);
    }

    return stringToRegexp(
    /** @type {string} */
    path, keys, options);
  }
  pathToRegexp_1.parse = parse_1;
  pathToRegexp_1.compile = compile_1;
  pathToRegexp_1.tokensToFunction = tokensToFunction_1;
  pathToRegexp_1.tokensToRegExp = tokensToRegExp_1;

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
    const regexp = pathToRegexp_1(path, keys, options);
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
    const generator = pathToRegexp_1.compile(path);

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

  exports.BrowserRouter = BrowserRouter$1;
  exports.HashRouter = HashRouter$1;
  exports.MemoryRouter = MemoryRouter$1;
  exports.Prompt = Prompt$1;
  exports.Redirect = Redirect$1;
  exports.Route = Route$1;
  exports.RouteContext = RouteContext;
  exports.RouteSwitch = RouteSwitch$1;
  exports.Router = Router$1;
  exports.RouterLink = RouterLink$1;
  exports.StaticRouter = StaticRouter$1;
  exports.createBrowserHistory = createBrowserHistory;
  exports.createHashHistory = createHashHistory;
  exports.createMemoryHistory = createMemoryHistory;
  exports.createStaticHistory = createStaticHistory;
  exports.default = index;
  exports.generatePath = generatePath;
  exports.matchPath = matchPath;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
