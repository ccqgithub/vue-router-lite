/*!
  * vue-router-lite v1.3.0
  * (c) 2019-present Season Chen
  * @license MIT
  */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.VueRouterLite = {}));
}(this, (function (exports) { 'use strict';

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


  function resolvePathname(to, from) {
    if (from === undefined) from = '';
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
    var hasTrailingSlash;

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

    if (!mustEndAbs) for (; up--; up) fromParts.unshift('..');
    if (mustEndAbs && fromParts[0] !== '' && (!fromParts[0] || !isAbsolute(fromParts[0]))) fromParts.unshift('');
    var result = fromParts.join('/');
    if (hasTrailingSlash && result.substr(-1) !== '/') result += '/';
    return result;
  }

  function valueOf(obj) {
    return obj.valueOf ? obj.valueOf() : Object.prototype.valueOf.call(obj);
  }

  function valueEqual(a, b) {
    // Test for strict equality first.
    if (a === b) return true; // Otherwise, if either of them == null they are not equal.

    if (a == null || b == null) return false;

    if (Array.isArray(a)) {
      return Array.isArray(b) && a.length === b.length && a.every(function (item, index) {
        return valueEqual(item, b[index]);
      });
    }

    if (typeof a === 'object' || typeof b === 'object') {
      var aValue = valueOf(a);
      var bValue = valueOf(b);
      if (aValue !== a || bValue !== b) return valueEqual(aValue, bValue);
      return Object.keys(Object.assign({}, a, b)).every(function (key) {
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

    throw new Error(prefix + ": " + (message || ''));
  }

  function addLeadingSlash(path) {
    return path.charAt(0) === '/' ? path : '/' + path;
  }

  function stripLeadingSlash(path) {
    return path.charAt(0) === '/' ? path.substr(1) : path;
  }

  function hasBasename(path, prefix) {
    return path.toLowerCase().indexOf(prefix.toLowerCase()) === 0 && '/?#'.indexOf(path.charAt(prefix.length)) !== -1;
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
    return event.state === undefined && navigator.userAgent.indexOf('CriOS') === -1;
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
            var nextKeys = allKeys.slice(0, prevIndex + 1);
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

  function stripHash(url) {
    var hashIndex = url.indexOf('#');
    return hashIndex === -1 ? url : url.slice(0, hashIndex);
  }

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
    window.location.replace(stripHash(window.location.href) + '#' + path);
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

    function locationsAreEqual$$1(a, b) {
      return a.pathname === b.pathname && a.search === b.search && a.hash === b.hash;
    }

    function handleHashChange() {
      var path = getHashPath();
      var encodedPath = encodePath(path);

      if (path !== encodedPath) {
        // Ensure we always have a properly-encoded hash.
        replaceHashPath(encodedPath);
      } else {
        var location = getDOMLocation();
        var prevLocation = history.location;
        if (!forceNextPop && locationsAreEqual$$1(prevLocation, location)) return; // A hashchange doesn't always == location change.

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
      var baseTag = document.querySelector('base');
      var href = '';

      if (baseTag && baseTag.getAttribute('href')) {
        href = stripHash(window.location.href);
      }

      return href + '#' + encodePath(basename + createPath(location));
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
          var nextPaths = allPaths.slice(0, prevIndex + 1);
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

  var addLeadingSlash$1 = function addLeadingSlash(path) {
    return path.charAt(0) === '/' ? path : "/".concat(path);
  };

  var removeTailSlash = function removeTailSlash(path) {
    return path.replace(/\/+$/, '');
  };

  var addBasename = function addBasename(basename, location) {
    if (!basename) return location;
    return _objectSpread2({}, location, {
      pathname: removeTailSlash(addLeadingSlash$1(basename)) + addLeadingSlash$1(location.pathname)
    });
  };

  var stripBasename$1 = function stripBasename(basename, location) {
    if (!basename) return location;
    var base = addLeadingSlash$1(basename);
    if (location.pathname.indexOf(base) !== 0) return location;
    return _objectSpread2({}, location, {
      pathname: addLeadingSlash$1(location.pathname.substr(base.length))
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
      location: stripBasename$1(basename, createLocation(location)),
      go: staticHandler('go'),
      goBack: staticHandler('goBack'),
      goForward: staticHandler('goForward'),
      createHref: function createHref(loc) {
        return addLeadingSlash$1(removeTailSlash(basename) + createURL(loc));
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

  /**
   * Tokenize input string.
   */
  function lexer(str) {
    var tokens = [];
    var i = 0;

    while (i < str.length) {
      var char = str[i];

      if (char === "*" || char === "+" || char === "?") {
        tokens.push({
          type: "MODIFIER",
          index: i,
          value: str[i++]
        });
        continue;
      }

      if (char === "\\") {
        tokens.push({
          type: "ESCAPED_CHAR",
          index: i++,
          value: str[i++]
        });
        continue;
      }

      if (char === "{") {
        tokens.push({
          type: "OPEN",
          index: i,
          value: str[i++]
        });
        continue;
      }

      if (char === "}") {
        tokens.push({
          type: "CLOSE",
          index: i,
          value: str[i++]
        });
        continue;
      }

      if (char === ":") {
        var name = "";
        var j = i + 1;

        while (j < str.length) {
          var code = str.charCodeAt(j);

          if ( // `0-9`
          code >= 48 && code <= 57 || // `A-Z`
          code >= 65 && code <= 90 || // `a-z`
          code >= 97 && code <= 122 || // `_`
          code === 95) {
            name += str[j++];
            continue;
          }

          break;
        }

        if (!name) throw new TypeError("Missing parameter name at " + i);
        tokens.push({
          type: "NAME",
          index: i,
          value: name
        });
        i = j;
        continue;
      }

      if (char === "(") {
        var count = 1;
        var pattern = "";
        var j = i + 1;

        if (str[j] === "?") {
          throw new TypeError("Pattern cannot start with \"?\" at " + j);
        }

        while (j < str.length) {
          if (str[j] === "\\") {
            pattern += str[j++] + str[j++];
            continue;
          }

          if (str[j] === ")") {
            count--;

            if (count === 0) {
              j++;
              break;
            }
          } else if (str[j] === "(") {
            count++;

            if (str[j + 1] !== "?") {
              throw new TypeError("Capturing groups are not allowed at " + j);
            }
          }

          pattern += str[j++];
        }

        if (count) throw new TypeError("Unbalanced pattern at " + i);
        if (!pattern) throw new TypeError("Missing pattern at " + i);
        tokens.push({
          type: "PATTERN",
          index: i,
          value: pattern
        });
        i = j;
        continue;
      }

      tokens.push({
        type: "CHAR",
        index: i,
        value: str[i++]
      });
    }

    tokens.push({
      type: "END",
      index: i,
      value: ""
    });
    return tokens;
  }
  /**
   * Parse a string for the raw tokens.
   */


  function parse(str, options) {
    if (options === void 0) {
      options = {};
    }

    var tokens = lexer(str);
    var _a = options.prefixes,
        prefixes = _a === void 0 ? "./" : _a;
    var defaultPattern = "[^" + escapeString(options.delimiter || "/#?") + "]+?";
    var result = [];
    var key = 0;
    var i = 0;
    var path = "";

    var tryConsume = function (type) {
      if (i < tokens.length && tokens[i].type === type) return tokens[i++].value;
    };

    var mustConsume = function (type) {
      var value = tryConsume(type);
      if (value !== undefined) return value;
      var _a = tokens[i],
          nextType = _a.type,
          index = _a.index;
      throw new TypeError("Unexpected " + nextType + " at " + index + ", expected " + type);
    };

    var consumeText = function () {
      var result = "";
      var value; // tslint:disable-next-line

      while (value = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR")) {
        result += value;
      }

      return result;
    };

    while (i < tokens.length) {
      var char = tryConsume("CHAR");
      var name = tryConsume("NAME");
      var pattern = tryConsume("PATTERN");

      if (name || pattern) {
        var prefix = char || "";

        if (prefixes.indexOf(prefix) === -1) {
          path += prefix;
          prefix = "";
        }

        if (path) {
          result.push(path);
          path = "";
        }

        result.push({
          name: name || key++,
          prefix: prefix,
          suffix: "",
          pattern: pattern || defaultPattern,
          modifier: tryConsume("MODIFIER") || ""
        });
        continue;
      }

      var value = char || tryConsume("ESCAPED_CHAR");

      if (value) {
        path += value;
        continue;
      }

      if (path) {
        result.push(path);
        path = "";
      }

      var open = tryConsume("OPEN");

      if (open) {
        var prefix = consumeText();
        var name_1 = tryConsume("NAME") || "";
        var pattern_1 = tryConsume("PATTERN") || "";
        var suffix = consumeText();
        mustConsume("CLOSE");
        result.push({
          name: name_1 || (pattern_1 ? key++ : ""),
          pattern: name_1 && !pattern_1 ? defaultPattern : pattern_1,
          prefix: prefix,
          suffix: suffix,
          modifier: tryConsume("MODIFIER") || ""
        });
        continue;
      }

      mustConsume("END");
    }

    return result;
  }
  /**
   * Compile a string to a template function for the path.
   */

  function compile(str, options) {
    return tokensToFunction(parse(str, options), options);
  }
  /**
   * Expose a method for transforming tokens into the path function.
   */

  function tokensToFunction(tokens, options) {
    if (options === void 0) {
      options = {};
    }

    var reFlags = flags(options);
    var _a = options.encode,
        encode = _a === void 0 ? function (x) {
      return x;
    } : _a,
        _b = options.validate,
        validate = _b === void 0 ? true : _b; // Compile all the tokens into regexps.

    var matches = tokens.map(function (token) {
      if (typeof token === "object") {
        return new RegExp("^(?:" + token.pattern + ")$", reFlags);
      }
    });
    return function (data) {
      var path = "";

      for (var i = 0; i < tokens.length; i++) {
        var token = tokens[i];

        if (typeof token === "string") {
          path += token;
          continue;
        }

        var value = data ? data[token.name] : undefined;
        var optional = token.modifier === "?" || token.modifier === "*";
        var repeat = token.modifier === "*" || token.modifier === "+";

        if (Array.isArray(value)) {
          if (!repeat) {
            throw new TypeError("Expected \"" + token.name + "\" to not repeat, but got an array");
          }

          if (value.length === 0) {
            if (optional) continue;
            throw new TypeError("Expected \"" + token.name + "\" to not be empty");
          }

          for (var j = 0; j < value.length; j++) {
            var segment = encode(value[j], token);

            if (validate && !matches[i].test(segment)) {
              throw new TypeError("Expected all \"" + token.name + "\" to match \"" + token.pattern + "\", but got \"" + segment + "\"");
            }

            path += token.prefix + segment + token.suffix;
          }

          continue;
        }

        if (typeof value === "string" || typeof value === "number") {
          var segment = encode(String(value), token);

          if (validate && !matches[i].test(segment)) {
            throw new TypeError("Expected \"" + token.name + "\" to match \"" + token.pattern + "\", but got \"" + segment + "\"");
          }

          path += token.prefix + segment + token.suffix;
          continue;
        }

        if (optional) continue;
        var typeOfMessage = repeat ? "an array" : "a string";
        throw new TypeError("Expected \"" + token.name + "\" to be " + typeOfMessage);
      }

      return path;
    };
  }
  /**
   * Escape a regular expression string.
   */

  function escapeString(str) {
    return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
  }
  /**
   * Get the flags for a regexp from the options.
   */


  function flags(options) {
    return options && options.sensitive ? "" : "i";
  }
  /**
   * Pull out keys from a regexp.
   */


  function regexpToRegexp(path, keys) {
    if (!keys) return path; // Use a negative lookahead to match only capturing groups.

    var groups = path.source.match(/\((?!\?)/g);

    if (groups) {
      for (var i = 0; i < groups.length; i++) {
        keys.push({
          name: i,
          prefix: "",
          suffix: "",
          modifier: "",
          pattern: ""
        });
      }
    }

    return path;
  }
  /**
   * Transform an array into a regexp.
   */


  function arrayToRegexp(paths, keys, options) {
    var parts = paths.map(function (path) {
      return pathToRegexp(path, keys, options).source;
    });
    return new RegExp("(?:" + parts.join("|") + ")", flags(options));
  }
  /**
   * Create a path regexp from string input.
   */


  function stringToRegexp(path, keys, options) {
    return tokensToRegexp(parse(path, options), keys, options);
  }
  /**
   * Expose a function for taking tokens and returning a RegExp.
   */


  function tokensToRegexp(tokens, keys, options) {
    if (options === void 0) {
      options = {};
    }

    var _a = options.strict,
        strict = _a === void 0 ? false : _a,
        _b = options.start,
        start = _b === void 0 ? true : _b,
        _c = options.end,
        end = _c === void 0 ? true : _c,
        _d = options.encode,
        encode = _d === void 0 ? function (x) {
      return x;
    } : _d;
    var endsWith = "[" + escapeString(options.endsWith || "") + "]|$";
    var delimiter = "[" + escapeString(options.delimiter || "/#?") + "]";
    var route = start ? "^" : ""; // Iterate over the tokens and create our regexp string.

    for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
      var token = tokens_1[_i];

      if (typeof token === "string") {
        route += escapeString(encode(token));
      } else {
        var prefix = escapeString(encode(token.prefix));
        var suffix = escapeString(encode(token.suffix));

        if (token.pattern) {
          if (keys) keys.push(token);

          if (prefix || suffix) {
            if (token.modifier === "+" || token.modifier === "*") {
              var mod = token.modifier === "*" ? "?" : "";
              route += "(?:" + prefix + "((?:" + token.pattern + ")(?:" + suffix + prefix + "(?:" + token.pattern + "))*)" + suffix + ")" + mod;
            } else {
              route += "(?:" + prefix + "(" + token.pattern + ")" + suffix + ")" + token.modifier;
            }
          } else {
            route += "(" + token.pattern + ")" + token.modifier;
          }
        } else {
          route += "(?:" + prefix + suffix + ")" + token.modifier;
        }
      }
    }

    if (end) {
      if (!strict) route += delimiter + "?";
      route += !options.endsWith ? "$" : "(?=" + endsWith + ")";
    } else {
      var endToken = tokens[tokens.length - 1];
      var isEndDelimited = typeof endToken === "string" ? delimiter.indexOf(endToken[endToken.length - 1]) > -1 : // tslint:disable-next-line
      endToken === undefined;

      if (!strict) {
        route += "(?:" + delimiter + "(?=" + endsWith + "))?";
      }

      if (!isEndDelimited) {
        route += "(?=" + delimiter + "|" + endsWith + ")";
      }
    }

    return new RegExp(route, flags(options));
  }
  /**
   * Normalize the given path string, returning a regular expression.
   *
   * An empty array can be passed in for the keys, which will hold the
   * placeholder key descriptions. For example, using `/user/:id`, `keys` will
   * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
   */

  function pathToRegexp(path, keys, options) {
    if (path instanceof RegExp) return regexpToRegexp(path, keys);
    if (Array.isArray(path)) return arrayToRegexp(path, keys, options);
    return stringToRegexp(path, keys, options);
  }

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

  exports.BrowserRouter = __vue_component__$3;
  exports.HashRouter = __vue_component__$2;
  exports.MemoryRouter = __vue_component__$1;
  exports.Prompt = __vue_component__$7;
  exports.Redirect = __vue_component__$8;
  exports.Route = __vue_component__$9;
  exports.RouteContext = __vue_component__$a;
  exports.RouteSwitch = __vue_component__$b;
  exports.Router = __vue_component__;
  exports.RouterLink = __vue_component__$6;
  exports.StaticRouter = __vue_component__$4;
  exports.createBrowserHistory = createBrowserHistory;
  exports.createHashHistory = createHashHistory;
  exports.createMemoryHistory = createMemoryHistory;
  exports.createStaticHistory = createStaticHistory;
  exports.default = index;
  exports.generatePath = generatePath;
  exports.matchPath = matchPath;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
