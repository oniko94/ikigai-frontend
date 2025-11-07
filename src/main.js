import { createApp } from 'vue';
import { createPinia } from "pinia";

import App from './App.vue';
import ProgressBar from './components/ProgressBar.vue';
import './styles.css';

const app = createApp(App);
app.use(createPinia());
app.component("progress-bar", ProgressBar);
app.mount("#app");
