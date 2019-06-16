<template>
  <single>
    <slot 
      v-if="type === 'slot'"
      v-bind:href="childProps.href" 
      v-bind:history="router.history"
      v-bind:match="childProps.match" 
    />
    
    <tag 
      v-if="type === 'tag'"
      v-bind="$attrs"
      :tag="tag" 
      :target="target === '_self' ? false : target" 
      :href="href"
      :class="childProps.active ? activeClassName : {}"
      :style="childProps.active ? activeStyle : {}"
      @click="handleClick($event)"
    >
      <slot />
    </tag>
  </single>
</template>

<script>
import { createLocation } from "history";
import { warning } from '../util/utils';
import matchPath from '../util/matchPath';
import Tag from '../util/Tag';
import Single from '../util/Single';

// 
const isModifiedEvent = event =>
  !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);

// 
export const resolveToLocation = (to, currentLocation) =>
  typeof to === "function" ? to(currentLocation) : to;

// 
export const normalizeToLocation = (to, currentLocation) => {
  return typeof to === "string"
    ? createLocation(to, null, null, currentLocation)
    : to;
};

const Link = {
  components: {
    Tag
  },

  props: {
    // type: tag, slot
    type: {
      type: String,
      default: 'tag'
    },
    // to path
    to: {
      type: [String, Object],
      required: true
    },
    // tag
    tag: {
      type: String,
      default: 'a'
    },
    // target
    target: {
      type: String,
      default: '_self'
    },
    // replace or push
    replace: {
      type: Boolean,
      default: false
    },
    // user to check active
    exact: {
      type: Boolean,
      default: true
    },
    // user to check active
    strict: {
      type: Boolean,
      default: false
    },
    // user to check active
    sensitive: {
      type: Boolean,
      default: false
    },
    // active class name
    activeClassName: {
      type: String,
      default: ''
    },
    activeStyle: {
      type: Object,
      default: () => {}
    },
    isActive: {
      type: Function
    },
    location: {
      type: Object
    }
  },

  inject: ['$router', '$route'],

  computed: {
    childProps() {
      const { exact, strict, sensitive, isActive } = this;
      const currentLocation = this.location || this.$route.location;
      const { pathname: pathToMatch } = currentLocation;
      const toLocation = normalizeToLocation(
        resolveToLocation(to, currentLocation),
        currentLocation
      );
      const { pathname: path } = toLocation;
      // Regex taken from: https://github.com/pillarjs/path-to-regexp/blob/master/index.js#L202
      const escapedPath =
        path && path.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");

      const match = escapedPath
        ? matchPath(pathToMatch, { path: escapedPath, exact, strict, sensitive })
        : null;
      const active = !!(isActive
        ? isActive(match, toLocation)
        : match);
      const href = toLocation ? history.createHref(toLocation) : '';

      return {
        match,
        isActive,
        href
      };
    }
  },

  methods: {
    handleClick(event) {
      this.$emit('click', event);

      if (
        this.target !== '_self' || // et browser handle "target=_blank" etc.
        event.defaultPrevented || // onClick prevented default
        event.button === 0 || // ignore everything but left clicks
        isModifiedEvent(event) // ignore clicks with modifier keys
      ) {
        return false;
      }

      event.preventDefault();

      const { history } = this.$router;
      const { replace, to } = this;
      const location = this.location || this.$route.location;
      const loc = resolveToLocation(to, location);

      if (replace) {
        history.replace(loc);
      } else {
        history.push(loc);
      }
    }
  },

  created() {
    if (!this.router) {
      warning('You should not use <Link> outside a <Router>');
    }

    if (!this.to) {
      throw new Error('You must specify the "to" property');
    }
  }
}

export default Link;
</script>