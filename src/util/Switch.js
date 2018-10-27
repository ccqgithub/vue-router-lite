import { warning } from './utils';
import matchPath from "./matchPath";

/**
 * render the first matched Route
 */
const Switch = {
  props: {
    location: Object,
  },

  inject: ['$router', '$route'],

  beforeMount() {
    if (!this.$router) {
      warning('You should not use <Switch> outside a <Router>');
    }
  },

  render() {
    let location = this.location || this.$route.location;
    const vnode = this.$slots.default.find((vnode) => {
      if (!vnode.componentOptions) return false;
      if (!vnode.componentOptions.propsData) return false;
      const { path, exact, strict, sensitive } = vnode.componentOptions.propsData;
      return matchPath(path, { exact, strict, sensitive }, location);
    });
    return vnode;
  }
}

export default Switch;