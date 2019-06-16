/**
 * copy from:
 * https://github.com/ReactTraining/react-router/blob/master/packages/react-router/modules/generatePath.js
 */

import pathToRegexp from "path-to-regexp";

const cache = {};
const cacheLimit = 10000;
let cacheCount = 0;

function compilePath(path) {
  if (cache[path]) return cache[path];

  const generator = pathToRegexp.compile(path);

  if (cacheCount < cacheLimit) {
    cache[path] = generator;
    cacheCount++;
  }

  return generator;
}

/**
 * Public API for generating a URL pathname from a path and parameters.
 */
function generatePath(path = "/", params = {}, options = {}) {
  return path === "/" ? path : compilePath(path)(params, options);
}

export default generatePath;