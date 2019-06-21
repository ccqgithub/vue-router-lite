import Vue from 'vue'
import { BrowserRouter as Router, Route, RouterLink, Prompt } from 'vue-router-lite'

const FormExample = {
  components: {
    RouterLink,
    Route,
    Prompt
  },
  data() {
    return {
      isBlocking: false
    }
  },
  methods: {
    onSubmit(event) {
      event.preventDefault();
      event.target.reset();
      this.isBlocking = false;
    },
    onBlock(location, action) {
      return `Are you sure you want to go to ${location.pathname}`;
    },
    onInputChange(event) {
      this.isBlocking = event.target.value.length > 0;
    }
  },
  template: `
    <form
      @submit="onSubmit($event)"
    >
      <prompt
        :when="isBlocking"
        :message="onBlock"
      />

      <p>
        Blocking?{{ " " }}
        {{ isBlocking ? "Yes, click a link or the back button" : "Nope" }}
      </p>

      <p>
        <input
          size="50"
          placeholder="type something to block transitions"
          @change="onInputChange($event)"
        />
      </p>

      <p>
        <button>Submit to stop blocking</button>
      </p>
    </form>
  `
}

const App = {
  data: () => ({ n: 0 }),
  components: {
    Route, 
    RouterLink,
    FormExample
  },
  template: `
    <div id="app">
      <h1>Preventing Transitions</h1>
      <div>
        <ul>
          <li>
            <router-link to="/">Form</router-link>
          </li>
          <li>
            <router-link to="/one">One</router-link>
          </li>
          <li>
            <router-link to="/two">Two</router-link>
          </li>
        </ul>
        <route path="/" exact>
          <form-example />
        </route>
        <route path="/one">
          <h3>One</h3>
        </route>
        <route path="/two">
          <h3>Two</h3>
        </route>
      </div>
    </div>
  `,

  methods: {
    //
  }
}

new Vue({
  components: {
    App,
    Router
  },
  template: `
    <router basename="/preventing-transitions/">
      <app />
    </router>
  `
}).$mount('#app')
