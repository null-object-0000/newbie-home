import { ref, watch, onMounted, computed } from 'vue'
import { getBasePath } from '@/utils/path'

// 响应式的暗色模式状态
const isDark = ref(false)

// 初始化主题
const initTheme = () => {
  if (typeof window === 'undefined') return
  
  // 检查本地存储
  const stored = localStorage.getItem('theme')
  if (stored) {
    isDark.value = stored === 'dark'
  } else {
    // 检查系统偏好
    isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  
  // 应用主题到 HTML
  applyTheme()
}

// 应用主题到 DOM
const applyTheme = () => {
  if (typeof document === 'undefined') return
  
  if (isDark.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

// 切换主题
const toggleDark = () => {
  isDark.value = !isDark.value
}

// 监听变化并保存到本地存储
if (typeof window !== 'undefined') {
  watch(isDark, (newValue) => {
    localStorage.setItem('theme', newValue ? 'dark' : 'light')
    applyTheme()
  })
}

export function useTheme() {
  onMounted(() => {
    initTheme()
  })
  
  return {
    isDark,
    toggleDark
  }
}

// 导出一个兼容 VitePress useData 的接口
export function useData() {
  // 创建一个响应式的 base 路径
  // 使用 computed 确保每次访问时都重新计算
  const base = computed(() => getBasePath())
  
  // 创建一个响应式的 site 对象
  const site = computed(() => ({
    base: base.value
  }))
  
  return {
    isDark,
    site
  }
}
