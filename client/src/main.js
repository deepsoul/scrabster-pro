import { createApp } from 'vue';
import './style.css';
import './assets/fonts.css';
import App from './App.vue';
import analytics from './services/analytics.js';

// Make analytics globally available
window.analytics = analytics;

createApp(App).mount('#app');
