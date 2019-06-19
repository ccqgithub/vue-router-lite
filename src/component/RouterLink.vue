<template>
  <single>
    <slot
      v-if="type === 'slot'" 
      :href="href"
      :active="active"
      :match="match"
      :history="router.history"
    />
    <tag 
      v-if="type === 'tag'"
      v-bind="$attrs"
      :tag="tag" 
      :target="target === '_self' ? false : target" 
      :href="href"
      :style="active ? activeStyle : {}"
      :class="active ? activeClassName : {}"
      @click="handleClick($event)"
    >
      <slot />
    </tag>
  </single>
</template>

<script>
import { 
  warning, 
  resolveToLocation, 
  normalizeToLocation, 
  guardEvent 
} from '../util/utils';
import matchPath from '../util/matchPath';
import Tag from '../util/Tag';
import Single from '../util/Single';

const RouterLink = {
  name: 'RouterLink',
  
  components: {
    Single,
    Tag
  },

  props: {
    // type
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
    // active style
    activeStyle: {
      type: Object,
      default: () => {}
    },
    // is active
    isActive: {
      type: Function
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
      const currentLocation = this.location || this.router.history.location;
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
        path && path.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
      const match = escapedPath
        ? matchPath(pathToMatch, { path: escapedPath, exact, strict, sensitive })
        : null;

      return match;
    },
    // if link active
    active() {
      const active = !!(this.isActive
        ? this.isActive(this.match, this.toLocation)
        : this.match);
      return active;
    }
  },

  methods: {
    handleClick(event) {
      this.$emit('click', event);

      if (!guardEvent(event)) return;

      const { history } = this.router;
      const { replace, to } = this;
      const location = this.location || this.router.history.location;
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

export default RouterLink;
</script>