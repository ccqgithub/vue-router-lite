/**
 * reference from:
 * https://github.com/ReactTraining/react-router/blob/master/packages/react-router/modules/matchPath.js
 */

import { pathToRegexp } from 'path-to-regexp';

const cache = {};
const cacheLimit = 10000;
let cacheCount = 0;

function compilePath(path, options) {
  const cacheKey = `${options.end}-${options.strict}-${options.sensitive}`;
  const pathCache = cache[cacheKey] || (cache[cacheKey] = {});

  if (pathCache[path]) return pathCache[path];

  const keys = [];
  const regexp = pathToRegexp(path, keys, options);
  const result = { regexp, keys };

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
  if (typeof options === 'string') options = { path: options };

  const { path: p, exact = false, strict = false, sensitive = true } = options;

  const paths = [].concat(p);

  return paths.reduce((matched, path) => {
    if (matched) return matched;
    const { regexp, keys } = compilePath(path, {
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
      path, // the path used to match
      url: path === '/' && url === '' ? '/' : url, // the matched portion of the URL
      isExact, // whether or not we matched exactly
      params: keys.reduce((memo, key, index) => {
        memo[key.name] = values[index];
        return memo;
      }, {})
    };
  }, null);
}

export default matchPath;
