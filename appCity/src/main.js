import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// 导入 API 服务
import { apiService } from './services'

// 全局组件
import DataCard from '../src/pages/component/common/ChartLoader.vue'
import ChartLoader from '../src/pages/component/common/ChartLoader.vue'

// 全局指令
import { autoResize, clickOutside } from './directives'

// 全局配置
import { AppConfig } from './config/appConfig'

const app = createApp(App)

// 注册全局组件
app.component('DataCard', DataCard)
app.component('ChartLoader', ChartLoader)

// 注册全局指令
app.directive('auto-resize', autoResize)
app.directive('click-outside', clickOutside)

// 提供全局配置
app.provide('appConfig', AppConfig)

// 挂载 API 服务到全局属性
app.config.globalProperties.$api = apiService

app.use(router)
app.mount('#app')