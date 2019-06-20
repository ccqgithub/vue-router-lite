import { createLocation, createPath } from "history";

const addLeadingSlash = (path) => {
  return path.charAt(0) === "/" ? path : "/" + path;
};

const addBasename = (basename, location) => {
  if (!basename) return location;

  return {
    ...location,
    pathname: addLeadingSlash(basename) + location.pathname
  };
};

const stripBasename = (basename, location) => {
  if (!basename) return location;

  const base = addLeadingSlash(basename);

  if (location.pathname.indexOf(base) !== 0) return location;

  return {
    ...location,
    pathname: location.pathname.substr(base.length)
  };
};

const createURL = (location) =>
  typeof location === "string" ? location : createPath(location);

const staticHandler = (methodName) => () => {
  throw new Error(`You cannot ${methodName} with <StaticRouter>`);
};

const noop = () => {};

function createStaticHistory({ basename = '', context = {}, location = '/' }) {
  const history = {
    action: "POP",
    location: stripBasename(basename, createLocation(location)),
    go: staticHandler("go"),
    goBack: staticHandler("goBack"),
    goForward: staticHandler("goForward"),
    createHref: (location) => {
      return addLeadingSlash(basename + createURL(location))
    },
    push: (location) => {
      context.action = "PUSH";
      context.location = addBasename(basename, createLocation(location));
      context.url = createURL(context.location);
    },
    replace: (location) => {
      context.action = "REPLACE";
      context.location = addBasename(basename, createLocation(location));
      context.url = createURL(context.location);
    }, 
    listen: () => noop,
    block: () => noop
  };

  return history;
}

export default createStaticHistory;