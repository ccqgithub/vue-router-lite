<template>
  <empty />
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

  inject: ['$router', '$route'],

  created() {
    if (!this.$router) {
      warning('You should not use <Prompt> outside a <Router>');
    }

    this.lastMessage = null;
    this.unblock = null;
  },

  mounted() {
    if(this.when) this.block(); 
  },

  updated() {
    if (!this.when) {
      if (this.unblock) this.unblock()
    } else {
      this.block();
    }
  },

  methods: {
    block() {
      let { message, lastMessage } = this;

      if (!this.unblock) {
        this.unblock = this.$router.history.block(message);
      } else if (message !== lastMessage) {
        this.unblock();
        this.unblock = this.$router.history.block(message);
      }

      // last message
      this.lastMessage = message;
    }
  },

  beforeDestroy() {
    if (this.unblock) this.unblock();
  }
}

export default Prompt;
</script>