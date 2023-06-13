import { createApp } from "vue";
import { Quasar, Notify } from "quasar";
import { createPinia } from "pinia";
import router from "./router/index.ts";

// Import icon libraries
import "@quasar/extras/material-icons/material-icons.css";
import "@quasar/extras/material-icons-outlined/material-icons-outlined.css";

// Import Quasar css
import "quasar/src/css/index.sass";
import "@quasar/extras/animate/fadeIn.css";

// Assumes your root component is App.vue
// and placed in same folder as main.js
import App from "./App.vue";

const pinia = createPinia();
const myApp = createApp(App);

myApp.use(Quasar, {
  plugins: { Notify }, // import Quasar plugins and add here
});

myApp.use(pinia);
myApp.use(router);

// Assumes you have a <div id="app"></div> in your index.html
myApp.mount("#app");
