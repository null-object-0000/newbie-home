import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// 从环境变量或命令行参数获取 base 路径，默认为 '/'
// 构建时可以通过 --base 参数设置，Vite 会自动处理
// 也可以通过 VITE_BASE_URL 或 BASE_URL 环境变量设置
const getBase = () => {
  // 优先使用命令行参数（通过 --base 传递）
  const baseArg = process.argv.find(arg => arg.startsWith('--base='))
  if (baseArg) {
    return baseArg.split('=')[1]
  }
  // 其次使用环境变量
  return process.env.VITE_BASE_URL || process.env.BASE_URL || '/'
}

export default defineConfig({
  base: getBase(),
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
