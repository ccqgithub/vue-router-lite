<template>
  <div id="app">
    <h1>Auth Flow</h1>
    <ul>
      <li>
        <a v-if="loggedIn" @click="logout">Log out</a>
        <router-link v-if="!loggedIn" to="/login">Log in</router-link>
      </li>
      <li>
        <router-link to="/about">About</router-link>
      </li>
      <li>
        <router-link to="/dashboard">Dashboard</router-link>
        (authenticated wrapper)
      </li>
      <li>
        <router-link to="/dashboard2">Dashboard2</router-link>
        (authenticated)
      </li>
      <li>
        <router-link to="/">Ohter</router-link>
      </li>
    </ul>

    <match-first>
      <route path="/dashboard" v-slot:default="{ match, location, history }">
        <check-login :logged-in="loggedIn">
          <dashboard :match="match" :location="location" :history="history" />
        </check-login>
      </route>

      <route path="/dashboard2" v-slot:default="{ match, location, history }">
        <dashboard v-if="loggedIn" :match="match" :location="location" :history="history" />
        <redirect v-else to="/"></redirect>
      </route>

      <route path="/about" v-slot:default="{ match, location, history }">
        <about :match="match" :location="location" :history="history" />
      </route>

      <route path="/login" v-slot:default="{ match, location, history }">
        <login :match="match" :location="location" :history="history" />
      </route>

      <route>
        <p>You are logged {{ loggedIn ? 'in' : 'out' }}</p>
      </route>
    </match-first>
  </div>
</template>

<script>
import { Route, RouterLink, MatchFirst, Redirect } from 'vue-router-lite'
import auth from '../auth'
import About from './About.vue'
import Dashboard from './Dashboard.vue'
import Login from './Login.vue'
import CheckLogin from './CheckLogin.vue'

export default {
  components: {
    Route,
    RouterLink,
    About,
    Dashboard,
    Login,
    MatchFirst,
    CheckLogin,
    Redirect
  },
  props: {
    history: Object
  },
  data () {
    return {
      loggedIn: auth.loggedIn()
    }
  },
  created () {
    auth.onChange = loggedIn => {
      this.loggedIn = loggedIn
    }
  },
  methods: {
    logout() {
      auth.logout()
      this.history.replace('/')
    }
  }
}
</script>
