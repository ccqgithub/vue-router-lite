<template>
  <div class="mod topic">
    <h3>{{ topicId }}</h3>
  </div>
</template>

<script>
export default {
  props: {
    topicId: {
      type: String,
      required: true
    }
  }
}
</script>
