<script>
import { assert } from '../util/utils';
import * as symbols from '../util/symbol';

const Prompt = {
  name: 'Prompt',

  props: {
    when: {
      type: Boolean,
      required: true
    },
    message: {
      type: [Function, String],
      required: true
    }
  },

  inject: {
    router: { from: symbols.router },
    route: { from: symbols.route }
  },

  created() {
    assert(this.router, 'You should not use <prompt> outside a <router>');

    this.lastMessage = null;
    this.unblock = null;
  },

  beforeUpdate() {
    assert(this.router, 'You should not use <prompt> outside a <router>');
  },

  mounted() {
    if (this.when) this.block();
  },

  watch: {
    when(val, oldVal) {
      if (!val) {
        if (this.unblock) this.unblock();
      } else {
        this.block();
      }
    }
  },

  methods: {
    block() {
      let { message, lastMessage } = this;

      if (!this.unblock) {
        this.unblock = this.router.history.block(message);
      } else if (message !== lastMessage) {
        this.unblock();
        this.unblock = this.router.history.block(message);
      }

      // last message
      this.lastMessage = message;
    }
  },

  beforeDestroy() {
    if (this.unblock) this.unblock();
  },

  render() {
    return null;
  }
};

export default Prompt;
</script>
