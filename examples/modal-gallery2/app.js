import Vue from 'vue'
import { BrowserRouter as Router, Route, RouterLink, RouteSwitch } from 'vue-router-lite'

// This example shows how to render two different screens
// (or the same screen in a different context) at the same url,
// depending on how you got there.
//
// Click the colors and see them full screen, then "visit the
// gallery" and click on the colors. Note the URL and the component
// are the same as before but now we see them inside a modal
// on top of the old screen.

const IMAGES = [
  { id: 0, title: "Dark Orchid", color: "DarkOrchid" },
  { id: 1, title: "Lime Green", color: "LimeGreen" },
  { id: 2, title: "Tomato", color: "Tomato" },
  { id: 3, title: "Seven Ate Nine", color: "#789" },
  { id: 4, title: "Crimson", color: "Crimson" }
];

const Thumbnail = {
  props: {
    color: String
  },
  template: `
    <div
      :style="{
        width: 50 + 'px',
        height: 50 + 'px',
        background: color
      }"
    />
  `
}

const ImageShow = {
  props: {
    color: String
  },
  template: `
    <div
      :style="{
        width: '100%',
        height: 400 + 'px',
        background: color
      }"
    />
  `
}

const Home = {
  components: {
    RouterLink
  },
  template: `
    <div>
      <router-link to="/gallery">Visit the Gallery</router-link>
      <h2>Featured Images</h2>
      <ul>
        <li>
          <router-link to="/img/2">Tomato</router-link>
        </li>
        <li>
          <router-link to="/img/4">Crimson</router-link>
        </li>
      </ul>
    </div>
  `
}

const Gallery = {
  components: {
    RouterLink,
    Thumbnail
  },
  data() {
    return {
      IMAGES
    }
  },
  template: `
    <div>
      <router-link 
        v-for="item in IMAGES" 
        :key="item.id" 
        :to="'/modal/gallery/img/' + item.id"
      >
        <thumbnail :color="item.color" />
        <p>{{ item.title }}</p>
      </router-link>
    </div>
  `
}

const ImageView = {
  components: {
    ImageShow
  },
  props: {
    match: Object
  },
  computed: {
    image() {
      return IMAGES[parseInt(this.match.params.id, 10)];
    }
  },
  template: `
    <div v-if="!image">Image not found</div>
    <div v-else>
      <h1>{{ image.title }}</h1>
      <image-show :color="image.color" />
    </div>
  `
}

const Modal = {
  components: {
    ImageShow
  },
  props: {
    history: Object,
    match: Object
  },
  computed: {
    image() {
      return IMAGES[parseInt(this.match.params.id, 10)];
    }
  },
  methods: {
    back(e) {
      e.stopPropagation();
      this.history.goBack();
    }
  },
  template: `
    <div
      @click="back($event)"
      :style="{
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        background: 'rgba(0, 0, 0, 0.15)'
      }"
    >
      <div
        class='modal'
        :style="{
          position: 'absolute',
          background: '#fff',
          top: 25 + 'px',
          left: '10%',
          right: '10%',
          padding: 15 + 'px',
          border: '2px solid #444'
        }"
      >
        <h1>{{ image.title }}</h1>
        <image-show :color="image.color" />
        <button type="button" @click="back($event)">
          Close
        </button>
      </div>
    </div>
  `
}

// We can pass a location to <route-match/> that will tell it to
// ignore the router's current location and use the location
// prop instead.
//
// We can also use "location state" to tell the app the user
// wants to go to `/img/2` in a modal, rather than as the
// main page, keeping the gallery visible behind it.
//
// Normally, `/img/2` wouldn't match the gallery at `/`.
// So, to get both screens to render, we can save the old
// location and pass it to RouteSwitch, so it will think the location
// is still `/` even though its `/img/2`.
const App = {
  components: {
    Route,
    RouteSwitch,
    Home,
    Gallery,
    ImageView,
    Modal
  },
  props: {
    location: Object,
    history: Object
  },
  data() {
    return {
      previousLocation: this.location
    }
  },
  computed: {
    isModal() {
      let { location } = this;
      let isModal = !!(
        location.state &&
        location.state.modal &&
        this.previousLocation !== location
      ); 
      return isModal;
    }
  },
  watch: {
    'history': {
      handler(history, oldHistory) {
        if (
          history.action !== "POP" &&
          (!history.location.state || !history.location.state.modal)
        ) {
          this.previousLocation = history.location;
        }
      },
      deep: true
    }
  },
  template: `
    <div class="app">
      <h1>Modal Gallery 2: path control</h1>
      <hr />
      <route-switch>
        <route 
          exact 
          path="/" 
          v-slot="props"
        >
          <home v-bind="props" />
        </route>
        <route 
          :path="['/gallery', '/modal/gallery/img/:id']" 
          v-slot="props"
        >
          <gallery v-bind="props" />
        </route>
        <route 
          path="/img/:id" 
          v-slot="props"
        >
          <image-view v-bind="props" />
        </route>
      </route-switch>
      
      <route path="/modal/:page/img/:id" v-slot="props">
        <modal v-bind="props" />
      </route>
    </div>
  `
}

new Vue({
  components: {
    App,
    Router
  },
  template: `
    <router basename="/modal-gallery2/" v-slot="slotProps">
      <app v-bind="slotProps"/>
    </router>
  `
}).$mount('#app')
