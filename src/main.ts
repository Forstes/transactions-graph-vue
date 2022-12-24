import { createApp } from 'vue'
import router from "./plugins/router"
import axios from "./plugins/axios"
import App from './App.vue'

createApp(App).use(router).mount('#app')