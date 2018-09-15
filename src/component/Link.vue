<template>
  <single>
    <slot :href="href" :history="router.history"></slot>
    
    <tag 
      :tag="tag" 
      :class="className" 
      :style="style" 
      :target="target" 
      :href="href"
      v-bind="$attrs"
      @click="handleClick"
    >
      <slot></slot>
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

const Link = {
  components: {
    Tag
  },

  props: {
    // to path
    to: {
      type: [String, Object],
      required: true
    },

    // below props not used for slot scope
    target: String,
    replace: {
      type: Boolean,
      default: false
    },
    tag: {
      type: String,
      default: 'a'
    },
    className: {
      type: [String, Object, Array],
      default: () => {}
    },
    style: {
      type: [String, Object, Array],
      default: () => {}
    }
  },

  inject: ['router'],

  computed: {
    href() {
      const { history } = this.router;
      const location =
        typeof to === "string"
          ? createLocation(to, null, null, history.location)
          : to;
      const href = history.createHref(location);

      return href;
    }
  },

  methods: {
    handleClick(event) {
      this.$emit('click', event);
  
      event.preventDefault();
  
      const { history } = this.router;
      const { replace, to } = this;

      if (replace) {
        history.replace(to);
      } else {
        history.push(to);
      }
    }
  },

  beforeMount() {
    if (!this.to) {
      throw new Error('You must specify the "to" property');
    }

    if (!this.router) {
      warning('You should not use <Link> outside a <Router>');
    }
  }
}

export default Link;
</script>