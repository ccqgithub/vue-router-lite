import { assert } from './utils';
import matchPath from "./matchPath";

/**
 * render the first matched Route
 */
const MatchFirst = {
  inject: ['router', 'route'],

  beforeMount() {
    assert(
      this.router, 
      `You should not use <MatchFirst> outside a <Router>'`
    );
  },

  render() {
    let location = this.router.history.location;
    const vnode = this.$slots.default.find((vnode) => {
      if (!vnode.componentOptions) return false;
      if (!vnode.componentOptions.propsData) return false;
      const { path, exact, strict, sensitive } = vnode.componentOptions.propsData;
      // no path on route
      if (typeof path === 'undefined') return true;

      return !!matchPath(location.pathname, { path, exact, strict, sensitive });
    });
    return vnode;
  }
}

export default MatchFirst;