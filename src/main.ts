import { ViteSSG } from 'vite-ssg'
import App from './App.vue'
import { routes, getStaticRoutes } from './router'

// 本地字体（避免 Google Fonts CDN 在中国大陆的访问问题）
import '@fontsource/outfit/400.css'
import '@fontsource/outfit/500.css'
import '@fontsource/outfit/600.css'
import '@fontsource/outfit/700.css'
import '@fontsource/outfit/800.css'
import '@fontsource/noto-sans-sc/400.css'
import '@fontsource/noto-sans-sc/500.css'
import '@fontsource/noto-sans-sc/600.css'
import '@fontsource/noto-sans-sc/700.css'

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
