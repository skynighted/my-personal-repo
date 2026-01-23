import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import apiService from './api/index'

const app = createApp(App)

// 全局注册apiService
app.config.globalProperties.$api = apiService

app.use(router)

app.mount('#app')
