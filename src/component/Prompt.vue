<template>
  <empty></empty>
</template>

<script>
import { warning } from '../util/utils';
import Empty from '../util/empty';

const Prompt = {
  components: {
    Empty
  },

  props: {
    when: {
      type: Boolean,
      default: true
    },
    message: {
      type: [Function, String],
      required: true
    }
  },

  inject: ['router'],

  beforeMount() {
    if (!this.router) {
      warning('You should not use <Prompt> outside a <Router>');
    }

    if(this.when) this.enable(this.message);
  },

  watch: {
    when(val, old) {
      if (val) {
        if (!old && this.message)
          this.enable(this.message);
      } else {
        this.disable();
      }
    },
    message(val) {
      if (val) {
        this.enable(this.message);
      }
    }
  },

  methods: {
    enable(message) {
      if (this.unblock) this.unblock();
      this.unblock = this.router.history.block(message);
    },

    disable() {
      if (this.unblock) {
        this.unblock();
        this.unblock = null;
      }
    }
  },

  beforeDestroy() {
    this.disable();
  }
}

export default Prompt;
</script>