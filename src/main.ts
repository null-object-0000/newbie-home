import { ViteSSG } from 'vite-ssg'
import App from './App.vue'
import { routes, getStaticRoutes } from './router'
import './styles/variables.css'
import './styles/global.css'

export const createApp = ViteSSG(
  App,
  { 
    routes, 
    base: import.meta.env.BASE_URL,
    // 配置 SSG 预渲染路由
    // @ts-ignore
    getRoutes: getStaticRoutes
  },
  ({ app, router, isClient }) => {
    // 可以在这里注册全局组件或插件
  }
)
