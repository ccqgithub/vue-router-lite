<template>
  <div>
    <h2>Dashboard</h2>
    <p>Yay you made it!</p>
    <p>{{ match.url }}</p>
  </div>
</template>

<script>
import auth from '../auth'

export default {
  props: {
    history: Object,
    match: Object
  }
}
</script>
