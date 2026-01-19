import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  base: '/', // 使用绝对路径，通过运行时动态检测适配不同部署环境
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  ssgOptions: {
    script: 'async',
    formatting: 'minify',
    crittersOptions: {
      preload: 'swap'
    }
  }
})
