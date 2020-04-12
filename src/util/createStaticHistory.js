import { createLocation, createPath } from 'history';

const addLeadingSlash = (path) => {
  return path.charAt(0) === '/' ? path : `/${path}`;
};

const removeTailSlash = (path) => {
  return path.replace(/\/+$/, '');
};

const addBasename = (basename, location) => {
  if (!basename) return location;

  return {
    ...location,
    pathname:
      removeTailSlash(addLeadingSlash(basename)) +
      addLeadingSlash(location.pathname)
  };
};

const stripBasename = (basename, location) => {
  if (!basename) return location;

  const base = addLeadingSlash(basename);

  if (location.pathname.indexOf(base) !== 0) return location;

  return {
    ...location,
    pathname: addLeadingSlash(location.pathname.substr(base.length))
  };
};

const createURL = (location) =>
  typeof location === 'string' ? location : createPath(location);

const staticHandler = (methodName) => () => {
  throw new Error(`You cannot ${methodName} with <StaticRouter>`);
};

const noop = () => {};

function createStaticHistory({ basename = '', context = {}, location = '/' }) {
  const history = {
    isStatic: true,
    context,
    action: 'POP',
    location: stripBasename(basename, createLocation(location)),
    go: staticHandler('go'),
    goBack: staticHandler('goBack'),
    goForward: staticHandler('goForward'),
    createHref: (loc) => {
      return addLeadingSlash(removeTailSlash(basename) + createURL(loc));
    },
    push: (loc) => {
      context.action = 'PUSH';
      context.location = addBasename(basename, createLocation(loc));
      context.url = createURL(context.location);
    },
    replace: (loc) => {
      context.action = 'REPLACE';
      context.location = addBasename(basename, createLocation(loc));
      context.url = createURL(context.location);
    },
    listen: () => noop,
    block: () => noop
  };

  return history;
}

export default createStaticHistory;
