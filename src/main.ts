import { createApp } from 'vue'
import './assets/all.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from '@/router/index'
import { createPinia } from 'pinia'
import App from './App.vue'
const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(ElementPlus)
app.use(router)
app.mount('#app')
