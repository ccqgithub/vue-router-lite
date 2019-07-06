<template>
  <div class="mod topics">
    <h2>Topics</h2>

    <ul>
      <li>
        <router-link :to="match.url + '/rendering'">Rendering</router-link>
      </li>
      <li>
        <router-link :to="match.url + '/components'">Components</router-link>
      </li>
      <li>
        <router-link :to="match.url + '/props-v-state'">Props v. State</router-link>
      </li>
    </ul>

    <route 
      :path="match.path + '/:topicId'" 
      v-slot="{ match }"
    >
      <topic :topic-id="match.params.topicId" />
    </route>

    <route
      exact
      :path="match.path"
    >
      <h3>Please select a topic.</h3>
    </route>
  </div>
</template>

<script>
import { Route, RouterLink } from 'vue-router-lite';
import Topic from './Topic.vue';

export default {
  components: {
    Route,
    RouterLink,
    Topic
  },
  props: {
    match: {
      type: Object,
      required: true
    }
  }
}
</script>
