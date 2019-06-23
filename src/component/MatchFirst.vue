<script>
import { assert, isNotTextNode } from '../util/utils';
import matchPath from "../util/matchPath";

export default {
  name: 'match-first',
  functional: true,
  inject: ['router', 'route'],
  render(createElement, context) {
    const { router } = context.injections;

    assert(
      router, 
      `You should not use <match-first> outside a <router>'`
    );

    let vnodeKey = '';
    const location = router.history.location;
    const children = context.slots().default.filter(isNotTextNode);
    const vnode = children.find((vnode) => {
      if (!vnode.componentOptions) return false;
      const propsData = vnode.componentOptions.propsData || {};
      const { path = '', exact = false, strict = false, sensitive = true, key = '' } = propsData;
      vnodeKey = key || `path-${path}--exact-${exact}--strict-${strict}--sensitive=${sensitive}`;
      // no path on route
      if (!path) return true;
      const match = matchPath(location.pathname, { path, exact, strict, sensitive });
      return !!match;
    });

    // key
    if (vnode) vnode.key = vnodeKey;

    return vnode;
  }
}
</script>
