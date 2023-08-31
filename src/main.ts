import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'

const vue = createApp(App);

// 將 router 添加到 Vue 實例中
vue.use(router)

// 創建 Pinia 實例並添加到 Vue 實例中
const pinia = createPinia()
vue.use(pinia)

// 挂载 Vue 實例
vue.mount('#app')
