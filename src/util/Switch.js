import { warning } from './utils';
import matchPath from "./matchPath";

/**
 * render the first matched Route
 */
const Switch = {
  props: {
    location: Object
  },

  inject: ['router'],

  beforeMount() {
    if (!this.router) {
      warning('You should not use <Switch> outside a <Router>');
    }
  },

  render(h) {
    const vnode = this.$slots.default.find(vnode => {
      if (!vnode.componentOptions) return false;
      const { path, exact, strict, sensitive } = vnode.componentOptions.propsData;
      return matchPath(path, { exact, strict, sensitive }, this.router.location)
    });
    return vnode;
  }
}

export default Switch;