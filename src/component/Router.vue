<script>
import { assert, isNotTextNode } from '../util/utils';

const Router = {
  name: 'router',

  props: {
    // history control
    history: {
      type: Object,
      required: true
    },
    // name for debug
    name: {
      type: String,
      default: 'router'
    }
  },

  provide() {
    return {
      router: this.router,
      route: this.route
    };
  },

  data() {
    return {
      // add provide's properties in data, to make provide reactivity 
      router: {
        history: this.history
      },
      // add provide's properties in data, to make provide reactivity 
      route: {
        location: this.history.location,
        match: this.computeMatch(this.history.location.pathname)
      }
    };
  },

  created() {
    const { history } = this;
    this.unlisten = history.listen(() => {
      this.route.location = history.location;
      this.route.match = this.computeMatch(history.location.pathname);
    });
  },

  befreDestory() {
    this.unlisten();
  },

  watch: {
    history(val, oldVal) {
      assert(false, `You cannot change <router>\'s history!`);
    }
  },
  methods: {
    computeMatch(pathname) {
      return { path: "/", url: "/", params: {}, isExact: pathname === "/" };
    }
  },
  render(createElement) {
    let children = this.$scopedSlots.default({
      history: this.history,
      location: this.route.location,
      match: this.route.match
    });

    children = children.filter(isNotTextNode);
  
    assert(
      children.length === 1, 
      `<${this.name}> must only be used on a single child element.`
    );

    return children[0];
  }
}

export default Router;
</script>