<template>
  <tag
    v-bind="$attrs"
    :tag="tag"
    :href="href"
    :class="classNames"
    @[event]="handleClick($event)"
  >
    <slot
      :href="href"
      :match="match"
      :history="router.history"
      :location="router.history.location"
    />
  </tag>
</template>

<script>
import {
  assert,
  resolveToLocation,
  normalizeToLocation,
  guardEvent
} from '../util/utils';
import matchPath from '../util/matchPath';
import * as symbols from '../util/symbol';
import Tag from './Tag.vue';

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

  inject: {
    router: { from: symbols.router },
    route: { from: symbols.route }
  },

  computed: {
    // current location
    currentLocation() {
      const currentLocation = this.location || this.route.location;
      return currentLocation;
    },
    // to location
    toLocation() {
      const toLocation = normalizeToLocation(
        resolveToLocation(this.to, this.currentLocation),
        this.currentLocation
      );
      return toLocation;
    },
    // link href
    href() {
      const { history } = this.router;
      const href = this.toLocation ? history.createHref(this.toLocation) : '';

      return href;
    },
    // path match with current location
    match() {
      const { to, exact, strict, sensitive } = this;
      const { pathname: pathToMatch } = this.currentLocation;
      const { pathname: path } = this.toLocation;
      // Regex taken from: https://github.com/pillarjs/path-to-regexp/blob/master/index.js#L202
      const escapedPath =
        path && path.replace(/([.+*?=^!:${}()[\]|/\\])/g, '\\$1');
      const match = escapedPath
        ? matchPath(pathToMatch, {
            path: escapedPath,
            exact,
            strict,
            sensitive
          })
        : null;

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

      const { history } = this.router;
      const { replace, to } = this;
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

export default RouterLink;
</script>
