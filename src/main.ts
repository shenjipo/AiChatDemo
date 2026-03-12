import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './assets/main.css'
import "./assets/markdown.scss"
import { aiLoading } from './directives/aiLoading'

const app = createApp(App)
app.use(ElementPlus)
    .directive('ai-loading', aiLoading)
    .mount('#app')
