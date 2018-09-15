<template>
  <router v-bind="childProps">
    <slot></slot>
  </router>
</template>

<script>
import { warning } from '../util/utils';
import { createLocation, createPath } from "history";
import Router from "./Router";

const addLeadingSlash = path => {
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

const createURL = location =>
  typeof location === "string" ? location : createPath(location);

const staticHandler = methodName => () => {
  throw new Error(`You cannot ${methodName} with <StaticRouter>`);
};

const noop = () => {};

const StaticRouter = {
  components: {
    Router
  },
  
  props: {
    // just use to check if user pass history
    history: {
      validator: function (value) {
        return true;
      }
    },

    basename: {
      type: 'String',
      default: '' 
    },
    context: {
      type: Object,
      default() {
        return {};
      }
    },
    location: {
      type: [String, Object],
      default: '/'
    }
  },

  provide() {
    return {
      router: {
        staticContext: this.context
      }
    };
  },

  computed: {
    childProps() {
      let { basename, context, location } = this;

      const history = {
        action: "POP",
        location: stripBasename(basename, createLocation(location)),
        go: staticHandler("go"),
        goBack: staticHandler("goBack"),
        goForward: staticHandler("goForward"),
        createHref: (...rest) => this.createHref(...rest),
        push: (...rest) => this.handlePush(...rest),
        replace: (...rest) => this.handleReplace(...rest), 
        listen: () => noop,
        block: () => noop
      };

      return { history };
    }
  },

  methods: {
    createHref(path) {
      return addLeadingSlash(this.basename + createURL(path));
    },
    handlePush(location) {
      const { basename, context } = this;
      context.action = "PUSH";
      context.location = addBasename(basename, createLocation(location));
      context.url = createURL(context.location);
    },
    handleReplace(location) {
      const { basename, context } = this;
      context.action = "REPLACE";
      context.location = addBasename(basename, createLocation(location));
      context.url = createURL(context.location);
    }
  },

  beforeMount() {
    if (this.history) {
      warning(
        '<StaticRouter> ignores the history prop. To use a custom history, ' +
        'use `import { Router }` instead of `import { StaticRouter as Router }`.'
      )
    }
  }
}

export default StaticRouter;
</script>