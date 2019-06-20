<template>
  <div>
    <h2>Login</h2>
    <p v-if="query.redirect">
      You need to login first.
    </p>
    <form @submit.prevent="login">
      <label><input v-model="email" placeholder="email"></label>
      <label><input v-model="pass" placeholder="password" type="password"></label> (hint: password1)<br>
      <button type="submit">login</button>
      <p v-if="error" class="error">Bad login information</p>
    </form>
  </div>
</template>

<script>
import auth from '../auth'

export default {
  props: {
    history: Object,
    location: Object
  },
  data () {
    return {
      email: 'joe@example.com',
      pass: '',
      error: false
    }
  },
  computed: {
    query() {
      let searchParams = new URLSearchParams(this.location.search);
      let query = {};

      for(let key of searchParams.keys()) { 
        query[key] = params.get(key);
      }

      return query;
    }
  },
  methods: {
    login () {
      auth.login(this.email, this.pass, loggedIn => {
        if (!loggedIn) {
          this.error = true
        } else {
          this.history.replace(this.query.redirect || '/')
        }
      })
    }
  }
}
</script>

<style>
.error {
  color: red;
}
</style>
