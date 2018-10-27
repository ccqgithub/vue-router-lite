<template>
  <single>
    <slot :href="href" :history="router.history" />
    
    <tag 
      v-bind="$attrs"
      :tag="tag" 
      :target="target === '_self' ? false : target" 
      :href="href"
      @click="handleClick"
    >
      <slot />
    </tag>
  </single>
</template>

<script>
import { warning } from '../util/utils';
import { createLocation } from "history";
import Tag from '../util/Tag';
import Single from '../util/Single';

const isModifiedEvent = event =>
  !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
// Regex taken from: https://github.com/pillarjs/path-to-regexp/blob/master/index.js#L202
const escapedPath = path && path.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");

const Link = {
  components: {
    Tag,
  },

  props: {
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
      default: '_self',
    },
    // replace or push
    replace: {
      type: Boolean,
      default: false,
    },
    // active class name
    activeClassName: {
      type: String,
      default: '',
    },
    // user to check active
    exact: {
      type: Boolean,
      default: true,
    },
    // user to check active
    strict: {
      type: Boolean,
      default: false,
    },
    // user to check active
    sensitive: {
      type: Boolean,
      default: false,
    },
    // user to check active
    location: {
      type: Object,
    },
  },

  inject: ['$router', '$route'],

  computed: {
    href() {
      const { to } = this;
      const location =
        typeof to === 'string'
          ? createLocation(to, null, null, this.$route.location)
          : to;
      const href = location ? history.createHref(location) : '';

      return href;
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

      if (replace) {
        history.replace(to);
      } else {
        history.push(to);
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