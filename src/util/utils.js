import { createLocation } from 'history';

export function assert(condition, message) {
  if (!condition) {
    throw new Error(`[vue-router-lite] ${message}`);
  }
}

export function warn(condition, message) {
  if (process.env.NODE_ENV !== 'production' && !condition) {
    if (typeof console !== 'undefined')
      console.warn(`[vue-router-lite] ${message}`);
  }
}

export function isError(err) {
  return Object.prototype.toString.call(err).indexOf('Error') > -1;
}

// copyJson
export function copyJson(data) {
  return JSON.parse(JSON.stringify(data));
}

//
export const resolveToLocation = (to, currentLocation) =>
  typeof to === 'function' ? to(currentLocation) : to;

//
export const normalizeToLocation = (to, currentLocation) => {
  return typeof to === 'string'
    ? createLocation(to, null, null, currentLocation)
    : to;
};

export const guardEvent = (e) => {
  // don't redirect with control keys
  if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) return;
  // don't redirect when preventDefault called
  if (e.defaultPrevented) return;
  // don't redirect on right click
  if (e.button !== undefined && e.button !== 0) return;
  // don't redirect if `target="_blank"`
  if (e.currentTarget && e.currentTarget.getAttribute) {
    const target = e.currentTarget.getAttribute('target');
    if (/\b_blank\b/i.test(target)) return;
  }
  // this may be a Weex event which doesn't have this method
  if (e.preventDefault) {
    e.preventDefault();
  }
  return true;
};

export function isAsyncPlaceholder(node) {
  return node.isComment && node.asyncFactory;
}

export function isNotTextNode(c) {
  return c.tag || isAsyncPlaceholder(c);
}

export function getBooleanProps(val, defaultVal = false) {
  if (typeof val === 'undefined') return defaultVal;
  return val !== 'false';
}
