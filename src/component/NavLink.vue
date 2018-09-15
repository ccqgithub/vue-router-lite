
<template>
  <route :path="path" >
    <template slot-scope="scope">
      <x-link :class="getClassName(scope)">

      </x-link>
    </template>
  </route>
</template>

<script>
import { warning } from '../util/utils';
import Route from './Route';
import Link from './Link';

const NavLink = {
  components: {
    Route,
    XLink: Link
  },

  props: {
    // to path
    to: {
      type: [String, Object],
      required: true
    },
    path: {
      type: String,
      required: true
    },

    activeClass: String,
    activeStyle: Object
  },

  methods: {
    getClassName({ match }) {
      return match ? this.activeClass : '';
    },
    getStyle({ match }) {
      return match ? this.activeStyle : {};
    }
  }
}

export default NavLink;
</script>