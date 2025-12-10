import { createApp } from 'vue';
import { createPinia } from 'pinia';
import router from './router';
import App from './App.vue';
import './assets/main.css';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia as any);
app.use(router as any);

app.mount('#app');
