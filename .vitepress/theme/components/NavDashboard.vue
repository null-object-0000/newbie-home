<template>
  <div class="nav-dashboard" :class="{ 'dark-mode': isDark, 'light-mode': !isDark }">
    <!-- 背景光效 -->
    <div class="bg-effects">
      <div class="bg-effect bg-effect-1"></div>
      <div class="bg-effect bg-effect-2"></div>
    </div>

    <!-- 移动端菜单遮罩 -->
    <div v-if="isMobileMenuOpen" class="mobile-overlay" @click="isMobileMenuOpen = false"></div>

    <!-- 左侧边栏 -->
    <aside class="sidebar" :class="{ 'sidebar-open': isMobileMenuOpen }">
      <!-- Sidebar Header (Logo / Brand) -->
      <div class="sidebar-header">
        <h1 class="sidebar-title">Newbie Home</h1>
        <button class="sidebar-close-btn" @click="isMobileMenuOpen = false">
          <X :size="20" />
        </button>
      </div>

      <!-- Navigation Links -->
      <nav class="sidebar-nav">
        <button v-for="cat in rawData" :key="cat.name" class="nav-button"
          :class="{ 'nav-button-active': activeCategory === cat.name }" @click="scrollToCategory(cat.name)">
          <component :is="getIconComponent(cat.iconName)" :size="18" class="nav-icon" />
          <span>{{ cat.name }}</span>
        </button>
      </nav>

      <!-- Sidebar Footer (Theme Toggle) -->
      <div class="sidebar-footer">
        <button class="theme-toggle" @click="toggleDark()">
          <component :is="isDark ? Sun : Moon" :size="16" class="theme-icon" />
          <span class="theme-text">{{ isDark ? 'Light Mode' : 'Dark Mode' }}</span>
        </button>
      </div>
    </aside>

    <!-- 右侧主内容区域 -->
    <main class="main-content">
      <!-- 顶部移动端 Header -->
      <div class="mobile-header">
        <button class="mobile-menu-btn" @click="isMobileMenuOpen = true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
        <span class="mobile-title">{{ activeCategory }}</span>
        <div class="mobile-spacer"></div>
      </div>

      <div class="content-wrapper">
        <!-- Header Area: Time & Search -->
        <div class="header-area">
          <!-- Time -->
          <div class="time-display">
            <h1 class="time-text">{{ formattedTime }}</h1>
            <p class="date-text">{{ formattedDate }}</p>
          </div>

          <!-- IP Location Widget -->
          <div class="ip-location-widget">
            <MapPin :size="12" class="ip-location-icon" />
            <div v-if="ipData" class="ip-location-content">
              <span v-if="ipData.city === (ipData.country_name || ipData.country)">{{ ipData.city || 'Unknown' }}</span>
              <span v-else>{{ ipData.city || 'Unknown' }}, {{ ipData.country_name || ipData.country || 'Unknown' }}</span>
              <span class="ip-location-divider"></span>
              <span class="ip-location-ip">{{ ipData.ip }}</span>
            </div>
            <span v-else class="ip-location-loading">Locating...</span>
          </div>

          <!-- Large Search Bar -->
          <div class="search-container">
            <div class="search-bg"></div>
            <form class="search-form" @submit.prevent="handleSearch">
              <select v-model="searchEngine" class="search-select">
                <option value="google">Google</option>
                <option value="baidu">Baidu</option>
                <option value="bing">Bing</option>
              </select>
              <div class="search-divider"></div>
              <input v-model="searchQuery" type="text" placeholder="Search..." class="search-input" autofocus />
              <button type="submit" class="search-button">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
              </button>
            </form>
          </div>
        </div>

        <!-- Categories Sections -->
        <div class="categories-container">
          <section v-for="category in rawData" :key="category.name" :ref="el => setCategoryRef(category.name, el)"
            class="category-section">
            <!-- Section Title -->
            <div class="section-title">
              <div class="section-icon-wrapper">
                <component :is="getIconComponent(category.iconName)" :size="20" class="section-icon" />
              </div>
              <h2 class="section-name">{{ category.name }}</h2>
              <span class="section-count">{{ category.links.length }}</span>
            </div>

            <!-- Cards Grid -->
            <div class="cards-grid">
              <a v-for="(link, idx) in category.links" :key="idx" :href="link.link" target="_blank"
                rel="noopener noreferrer" class="card-link">
                <div class="card-icon-row">
                  <div class="card-icon-wrapper">
                    <img v-if="getIconUrl(link)" :src="getIconUrl(link)" :alt="link.name" class="card-icon"
                      @error="handleIconError" />
                    <div v-else class="card-icon-fallback">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="2" y1="12" x2="22" y2="12"></line>
                        <path
                          d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z">
                        </path>
                      </svg>
                    </div>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                    class="card-external-icon">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                  </svg>
                </div>
                <div class="card-content">
                  <h3 class="card-title">{{ link.name }}</h3>
                  <p class="card-desc">{{ link.desc || "No description available." }}</p>
                </div>
              </a>
            </div>
          </section>
        </div>

        <footer class="footer">
          <p>© 2026 My Dashboard. Optimized for Efficiency.</p>
        </footer>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, h } from 'vue'
import { useData } from 'vitepress'
import navData from '../../../nav/nav-data.json'
import * as lucideIcons from 'lucide-vue-next'
import { Sun, Moon, MapPin, X } from 'lucide-vue-next'

// 处理数据，从配置中读取图标名称
const rawData = navData.map((cat: any) => {
  const iconName = cat.icon || 'layout-grid' // 从配置中读取 icon，如果没有则使用默认值 'layout-grid'
  return {
    ...cat,
    iconName
  }
})

// 使用 VitePress 的主题模式
const { isDark, site } = useData()
const base = site.value.base || '/'

const toggleDark = () => {
  isDark.value = !isDark.value
}

// 状态
const activeCategory = ref(rawData[0].name)
const searchEngine = ref('google')
const searchQuery = ref('')
const currentTime = ref(new Date())
const isMobileMenuOpen = ref(false)
const categoryRefs = ref<Record<string, HTMLElement>>({})
const ipData = ref<any>(null)

// 计算属性
const formattedTime = computed(() => {
  return currentTime.value.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
})

const formattedDate = computed(() => {
  return currentTime.value.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: '2-digit', day: '2-digit' })
})

// 方法
const setCategoryRef = (name: string, el: HTMLElement | null) => {
  if (el) {
    categoryRefs.value[name] = el
  }
}

const scrollToCategory = (name: string) => {
  activeCategory.value = name
  isMobileMenuOpen.value = false
  const element = categoryRefs.value[name]
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

const handleSearch = () => {
  if (!searchQuery.value.trim()) return
  let url = ''
  switch (searchEngine.value) {
    case 'google':
      url = `https://www.google.com/search?q=${encodeURIComponent(searchQuery.value)}`
      break
    case 'baidu':
      url = `https://www.baidu.com/s?wd=${encodeURIComponent(searchQuery.value)}`
      break
    case 'bing':
      url = `https://www.bing.com/search?q=${encodeURIComponent(searchQuery.value)}`
      break
    default:
      url = `https://www.google.com/search?q=${encodeURIComponent(searchQuery.value)}`
  }
  window.open(url, '_blank')
}

const getDomain = (link: string) => {
  try {
    return new URL(link).hostname
  } catch (e) {
    return ''
  }
}

// 获取图标 URL
const getIconUrl = (link: any) => {
  // 如果 link.icon 存在且是路径（以 / 开头），使用本地图标
  if (link.icon && typeof link.icon === 'string') {
    if (link.icon.startsWith('/')) {
      // 处理 base 路径
      const iconPath = base.endsWith('/') ? base + link.icon.substring(1) : base + link.icon
      return iconPath
    } else if (link.icon.startsWith('http://') || link.icon.startsWith('https://')) {
      // 如果是完整的 URL，直接使用
      return link.icon
    }
  }
  // 如果没有本地图标，回退到 Google Favicon 服务
  return `https://www.google.com/s2/favicons?domain=${getDomain(link.link)}&sz=64`
}

// 将配置中的图标名称转换为 Lucide 组件名（PascalCase）
// 例如: "wrench" -> "Wrench", "message-square" -> "MessageSquare", "message" -> "MessageSquare"
const toPascalCase = (str: string): string => {
  return str
    .split(/[-_\s]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('')
}

// 常见的图标名称映射（处理特殊情况，如 message -> MessageSquare）
const iconNameMap: Record<string, string> = {
  'message': 'MessageSquare',
  'grid': 'LayoutGrid'
}

// 从配置中动态获取图标组件
const getIconComponent = (iconName: string) => {
  if (!iconName) {
    return lucideIcons.LayoutGrid // 默认图标
  }

  // 先检查是否有映射
  const mappedName = iconNameMap[iconName.toLowerCase()]
  const finalName = mappedName || iconName

  // 转换为 PascalCase 组件名
  const componentName = toPascalCase(finalName)

  // 从 lucideIcons 中获取对应的组件
  const IconComponent = (lucideIcons as any)[componentName]

  // 如果找不到，尝试使用默认图标
  return IconComponent || lucideIcons.LayoutGrid
}

const handleIconError = (e: Event) => {
  const target = e.target as HTMLImageElement
  if (target && target.parentElement) {
    // 如果本地图标加载失败，尝试使用 Google Favicon 作为回退
    const link = target.closest('.card-link')
    if (link) {
      const linkElement = link as HTMLElement
      const linkData = rawData
        .flatMap(cat => cat.links)
        .find(l => l.link === linkElement.getAttribute('href'))

      if (linkData) {
        // 如果当前使用的是本地图标但加载失败，回退到 Google Favicon
        if (linkData.icon && linkData.icon.startsWith('/')) {
          target.src = `https://www.google.com/s2/favicons?domain=${getDomain(linkData.link)}&sz=64`
          return
        }
      }
    }

    // 如果所有回退都失败，显示默认图标
    target.style.display = 'none'
    const fallback = document.createElement('div')
    fallback.className = 'card-icon-fallback'
    fallback.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>'
    target.parentNode?.replaceChild(fallback, target)
  }
}

// 时间更新
let timer: NodeJS.Timeout | null = null

// IP 获取
// IP 获取 - 支持多个备用 API
const fetchIpData = async () => {
  const apis = [
    'https://get.geojs.io/v1/ip/geo.json',
    'https://ipapi.co/json/',
    'https://ip-api.com/json/',
    'https://ipwhois.app/json/'
  ]

  for (const api of apis) {
    try {
      const response = await fetch(api)
      if (response.ok) {
        const data = await response.json()
        ipData.value = data
        return // 成功获取后退出
      }
    } catch (error) {
      console.log(`Failed to fetch from ${api}, trying next...`)
      continue // 继续尝试下一个
    }
  }

  console.error('All IP APIs failed')
}

onMounted(() => {
  // 设置 body overflow 为 hidden，让 NavDashboard 内部的滚动容器处理滚动
  document.body.style.overflow = 'hidden'
  
  timer = setInterval(() => {
    currentTime.value = new Date()
  }, 1000)
  fetchIpData()
})

onUnmounted(() => {
  // 恢复 body overflow
  document.body.style.overflow = ''
  
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<style scoped>
.nav-dashboard {
  display: flex;
  height: 100vh;
  overflow: hidden;
  transition: background-color 0.5s, color 0.5s;
}

.dark-mode {
  background-color: #0f172a;
  color: #e2e8f0;
}

.light-mode {
  background-color: #f8fafc;
  color: #1e293b;
}

/* 背景光效 */
.bg-effects {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.bg-effect {
  position: absolute;
  border-radius: 50%;
  mix-blend-mode: screen;
  filter: blur(120px);
  opacity: 0.1;
}

.bg-effect-1 {
  top: 0;
  left: 0;
  width: 800px;
  height: 800px;
}

.dark-mode .bg-effect-1 {
  background-color: #2563eb;
}

.light-mode .bg-effect-1 {
  background-color: #60a5fa;
}

.bg-effect-2 {
  bottom: 0;
  right: 0;
  width: 600px;
  height: 600px;
  filter: blur(100px);
}

.dark-mode .bg-effect-2 {
  background-color: #9333ea;
}

.light-mode .bg-effect-2 {
  background-color: #a78bfa;
}

/* 移动端菜单遮罩 */
.mobile-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 40;
  backdrop-filter: blur(4px);
}

@media (min-width: 768px) {
  .mobile-overlay {
    display: none;
  }
}

/* 左侧边栏 */
.sidebar {
  position: fixed;
  z-index: 50;
  width: 256px;
  height: 100%;
  display: flex;
  flex-direction: column;
  border-right: 1px solid;
  backdrop-filter: blur(12px);
  transition: transform 0.3s ease-in-out;
  transform: translateX(-100%);
}

.dark-mode .sidebar {
  background-color: rgba(15, 23, 42, 0.8);
  border-right-color: #1e293b;
}

.light-mode .sidebar {
  background-color: rgba(255, 255, 255, 0.8);
  border-right-color: #e2e8f0;
}

@media (min-width: 768px) {
  .sidebar {
    position: relative;
    transform: translateX(0);
  }
}

.sidebar-open {
  transform: translateX(0);
}

.sidebar-header {
  padding: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.sidebar-title {
  font-size: 24px;
  font-weight: 700;
  letter-spacing: -0.025em;
  background: linear-gradient(to right, #60a5fa, #a78bfa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.sidebar-close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  color: inherit;
  background: none;
  border: none;
  cursor: pointer;
  border-radius: 8px;
  transition: background-color 0.2s;
}

.sidebar-close-btn:hover {
  background-color: rgba(148, 163, 184, 0.1);
}

@media (min-width: 768px) {
  .sidebar-close-btn {
    display: none;
  }
}

.sidebar-nav {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.sidebar-nav::-webkit-scrollbar {
  display: none;
}

.sidebar-nav {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.nav-button {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 12px;
  transition: all 0.2s;
  font-size: 14px;
  font-weight: 500;
  background: none;
  border: none;
  cursor: pointer;
  color: inherit;
  opacity: 0.7;
}

.nav-button:hover {
  opacity: 1;
}

.dark-mode .nav-button:hover {
  background-color: rgba(148, 163, 184, 0.1);
}

.light-mode .nav-button:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.nav-button-active {
  opacity: 1;
}

.dark-mode .nav-button-active {
  background-color: rgba(37, 99, 235, 0.2);
  color: #93c5fd;
}

.light-mode .nav-button-active {
  background-color: #dbeafe;
  color: #1e40af;
}

.nav-icon {
  display: flex;
  align-items: center;
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.sidebar-footer {
  padding: 16px;
  border-top: 1px solid;
}

.dark-mode .sidebar-footer {
  border-top-color: rgba(148, 163, 184, 0.1);
}

.light-mode .sidebar-footer {
  border-top-color: rgba(0, 0, 0, 0.1);
}

.theme-toggle {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px;
  border-radius: 8px;
  transition: background-color 0.2s;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  color: inherit;
}

.dark-mode .theme-toggle {
  background-color: #1e293b;
}

.dark-mode .theme-toggle:hover {
  background-color: #334155;
}

.light-mode .theme-toggle {
  background-color: #e2e8f0;
}

.light-mode .theme-toggle:hover {
  background-color: #cbd5e1;
}

.theme-icon {
  display: flex;
  align-items: center;
  width: 16px;
  height: 16px;
}

.theme-text {
  font-size: 12px;
}

/* 右侧主内容区域 */
.main-content {
  flex: 1;
  position: relative;
  overflow-y: auto;
  scroll-behavior: smooth;
}

.mobile-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  position: sticky;
  top: 0;
  z-index: 30;
  backdrop-filter: blur(12px);
  border-bottom: 1px solid;
}

.dark-mode .mobile-header {
  background-color: rgba(15, 23, 42, 0.8);
  border-bottom-color: rgba(148, 163, 184, 0.1);
}

.light-mode .mobile-header {
  background-color: rgba(255, 255, 255, 0.8);
  border-bottom-color: rgba(0, 0, 0, 0.1);
}

@media (min-width: 768px) {
  .mobile-header {
    display: none;
  }
}

.mobile-menu-btn {
  padding: 8px;
  background-color: rgba(148, 163, 184, 0.1);
  border-radius: 8px;
  border: none;
  cursor: pointer;
  color: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mobile-title {
  font-weight: 700;
}

.mobile-spacer {
  width: 32px;
}

.content-wrapper {
  max-width: 1280px;
  margin: 0 auto;
  padding: 32px 16px;
}

@media (min-width: 640px) {
  .content-wrapper {
    padding: 48px 32px;
  }
}

/* Header Area */
.header-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 64px;
  gap: 32px;
  animation: fade-in 0.6s ease-out forwards;
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.time-display {
  text-align: center;
}

.time-text {
  font-size: 48px;
  font-weight: 300;
  letter-spacing: -0.025em;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  margin-bottom: 8px;
  line-height: 1;
}

@media (min-width: 768px) {
  .time-text {
    font-size: 80px;
  }
}

.date-text {
  font-size: 12px;
  opacity: 0.6;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-weight: 400;
}

@media (min-width: 768px) {
  .date-text {
    font-size: 14px;
  }
}

/* IP Location Widget */
.ip-location-widget {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 16px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 500;
  backdrop-filter: blur(12px);
  border: 1px solid;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
  user-select: none;
}

.ip-location-widget:hover {
  transform: scale(1.05);
}

.dark-mode .ip-location-widget {
  background-color: rgba(30, 41, 59, 0.4);
  border-color: rgba(71, 85, 105, 0.5);
  color: #94a3b8;
}

.dark-mode .ip-location-widget:hover {
  background-color: rgba(30, 41, 59, 0.6);
}

.light-mode .ip-location-widget {
  background-color: rgba(255, 255, 255, 0.6);
  border-color: rgba(226, 232, 240, 0.6);
  color: #64748b;
}

.light-mode .ip-location-widget:hover {
  background-color: rgba(255, 255, 255, 0.8);
}

.ip-location-icon {
  flex-shrink: 0;
}

.dark-mode .ip-location-icon {
  color: #fb7185;
}

.light-mode .ip-location-icon {
  color: #ef4444;
}

.ip-location-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ip-location-divider {
  width: 1px;
  height: 12px;
}

.dark-mode .ip-location-divider {
  background-color: rgba(255, 255, 255, 0.1);
}

.light-mode .ip-location-divider {
  background-color: rgba(0, 0, 0, 0.1);
}

.ip-location-ip {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  opacity: 0.8;
}

.ip-location-loading {
  opacity: 0.7;
}

/* Search Bar */
.search-container {
  width: 100%;
  max-width: 640px;
  position: relative;
  transition: transform 0.3s;
}

.search-container:focus-within {
  transform: scale(1.02);
}

.search-bg {
  position: absolute;
  inset: 0;
  border-radius: 16px;
  filter: blur(8px);
  opacity: 0.2;
  transition: opacity 0.3s;
}

.search-container:hover .search-bg {
  opacity: 0.4;
}

.search-container:focus-within .search-bg {
  opacity: 0.5;
}

.dark-mode .search-bg {
  background: linear-gradient(to right, #3b82f6, #9333ea);
}

.light-mode .search-bg {
  background: linear-gradient(to right, #60a5fa, #a78bfa);
}

.search-form {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  padding: 6px;
  border-radius: 16px;
  border: 1px solid;
  backdrop-filter: blur(12px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.dark-mode .search-form {
  background-color: rgba(30, 41, 59, 0.8);
  border-color: #475569;
  color: white;
}

.light-mode .search-form {
  background-color: rgba(255, 255, 255, 0.9);
  border-color: #e2e8f0;
  color: #1e293b;
}

.search-select {
  background: transparent;
  font-size: 14px;
  font-weight: 500;
  padding: 12px 8px 12px 16px;
  outline: none;
  border: none;
  cursor: pointer;
  color: inherit;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
}

.dark-mode .search-select {
  color: #e2e8f0 !important;
  background-color: transparent;
}

.dark-mode .search-select option {
  background-color: #1e293b !important;
  color: #e2e8f0 !important;
}

.light-mode .search-select {
  color: #1e293b !important;
  background-color: transparent;
}

.light-mode .search-select option {
  background-color: #ffffff !important;
  color: #1e293b !important;
}

.search-divider {
  width: 1px;
  height: 24px;
  margin: 0 8px;
}

.dark-mode .search-divider {
  background-color: rgba(148, 163, 184, 0.2);
}

.light-mode .search-divider {
  background-color: rgba(0, 0, 0, 0.1);
}

.search-input {
  flex: 1;
  background: transparent;
  padding: 8px;
  outline: none;
  border: none;
  font-size: 18px;
  color: inherit;
}

.search-input::placeholder {
  color: rgba(148, 163, 184, 0.5);
}

.search-button {
  padding: 12px;
  border-radius: 12px;
  color: white;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s, background-color 0.2s;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  min-width: 44px;
}

.search-button:active {
  transform: scale(0.95);
}

.dark-mode .search-button {
  background-color: #2563eb;
}

.dark-mode .search-button:hover {
  background-color: #3b82f6;
}

.light-mode .search-button {
  background-color: #3b82f6;
}

.light-mode .search-button:hover {
  background-color: #60a5fa;
}

/* 移动端响应式调整 */
@media (max-width: 768px) {
  .search-form {
    padding: 4px;
  }

  .search-select {
    padding: 8px 4px 8px 12px;
    font-size: 12px;
  }

  .search-input {
    padding: 6px 4px;
    font-size: 16px;
    min-width: 0;
  }

  .search-button {
    padding: 8px;
    min-width: 40px;
  }

  .search-divider {
    height: 20px;
    margin: 0 4px;
  }
}

/* Categories */
.categories-container {
  display: flex;
  flex-direction: column;
  gap: 48px;
  padding-bottom: 80px;
}

.category-section {
  scroll-margin-top: 32px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  padding-left: 8px;
  border-left: 4px solid;
}

.dark-mode .section-title {
  border-left-color: rgba(59, 130, 246, 0.5);
}

.light-mode .section-title {
  border-left-color: rgba(59, 130, 246, 0.5);
}

.section-icon-wrapper {
  padding: 8px;
  border-radius: 8px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.dark-mode .section-icon-wrapper {
  background-color: #1e293b;
  color: #60a5fa;
}

.light-mode .section-icon-wrapper {
  background-color: white;
  color: #2563eb;
}

.section-icon {
  display: flex;
  align-items: center;
  width: 20px;
  height: 20px;
}

.section-name {
  font-size: 24px;
  font-weight: 700;
  letter-spacing: -0.025em;
  opacity: 0.9;
}

.section-count {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 9999px;
  font-family: ui-monospace, monospace;
  opacity: 0.6;
}

.dark-mode .section-count {
  background-color: rgba(148, 163, 184, 0.1);
}

.light-mode .section-count {
  background-color: rgba(0, 0, 0, 0.05);
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 16px;
}

@media (min-width: 640px) {
  .cards-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .cards-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1280px) {
  .cards-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.card-link {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 16px;
  border-radius: 16px;
  border: 1px solid;
  transition: all 0.3s;
  text-decoration: none;
  color: inherit;
}

.card-link:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.dark-mode .card-link {
  background-color: rgba(30, 41, 59, 0.4);
  border-color: rgba(71, 85, 105, 0.5);
}

.dark-mode .card-link:hover {
  background-color: rgba(30, 41, 59, 0.8);
  border-color: rgba(59, 130, 246, 0.3);
}

.light-mode .card-link {
  background-color: rgba(255, 255, 255, 0.6);
  border-color: rgba(226, 232, 240, 0.6);
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.light-mode .card-link:hover {
  background-color: white;
  border-color: rgba(147, 197, 253, 0.5);
}

.card-icon-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 12px;
}

.card-icon-wrapper {
  padding: 8px;
  border-radius: 12px;
}

.dark-mode .card-icon-wrapper {
  background-color: rgba(15, 23, 42, 0.5);
}

.light-mode .card-icon-wrapper {
  background-color: #f1f5f9;
}

.card-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: contain;
  display: block;
}

.card-icon-fallback {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.5;
  color: inherit;
}

.card-external-icon {
  opacity: 0;
  transition: opacity 0.2s;
  color: inherit;
}

.card-link:hover .card-external-icon {
  opacity: 0.5;
}

.card-content {
  flex: 1;
}

.card-title {
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding-right: 8px;
  line-height: 1.5;
}

.card-desc {
  font-size: 12px;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin: 0;
}

.dark-mode .card-desc {
  color: #94a3b8;
}

.light-mode .card-desc {
  color: #64748b;
}

.footer {
  text-align: center;
  font-size: 14px;
  opacity: 0.3;
  padding: 32px 0;
}
</style>
