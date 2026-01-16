<template>
  <div class="home-page" :class="{ 'dark-mode': isDark, 'light-mode': !isDark }">
    <!-- 毛玻璃导航栏 -->
    <nav class="glass-nav">
      <div class="nav-container">
        <div class="logo-area" @click="$router.push('/')">
          <div class="logo-icon">N</div>
          <span class="site-title">Newbie Space</span>
        </div>

        <div class="nav-links">
          <router-link to="/" class="nav-item" :class="{ active: $route.path === '/' }">
            首页
            <span class="nav-indicator" v-if="$route.path === '/'"></span>
          </router-link>
          <router-link to="/nav/" class="nav-item" :class="{ active: $route.path === '/nav/' }">
            导航
            <span class="nav-indicator" v-if="$route.path === '/nav/'"></span>
          </router-link>
          <router-link to="/posts/2025-04" class="nav-item">
            文章
          </router-link>
        </div>

        <div class="nav-actions">
          <a href="https://github.com/null-object-0000" target="_blank" class="action-btn">
            <Github :size="20" />
          </a>
          <button @click="toggleDark()" class="action-btn">
            <Sun v-if="isDark" :size="20" />
            <Moon v-else :size="20" />
          </button>
          <button class="mobile-menu-btn" @click="mobileMenuOpen = !mobileMenuOpen">
            <Menu :size="24" />
          </button>
        </div>
      </div>
    </nav>

    <!-- 移动端菜单 -->
    <Transition name="fade">
      <div v-if="mobileMenuOpen" class="mobile-menu">
        <router-link to="/" class="mobile-nav-item" @click="mobileMenuOpen = false">首页</router-link>
        <router-link to="/nav/" class="mobile-nav-item" @click="mobileMenuOpen = false">导航</router-link>
        <router-link to="/posts/2025-04" class="mobile-nav-item" @click="mobileMenuOpen = false">文章</router-link>
      </div>
    </Transition>

    <!-- 主内容区域 -->
    <main class="main-content">
      <!-- Hero 区域 -->
      <section class="hero-section">
        <h1 class="hero-title">
          构建代码，记录思考。
        </h1>
        <p class="hero-desc">
          欢迎来到我的数字花园。这里有我的技术文章、精选的开发工具导航，以及我正在折腾的开源项目。
        </p>
      </section>

      <!-- 仪表板卡片网格 - 完全按照 test.html 布局 -->
      <div class="dashboard-grid">
        <!-- 第一行: 最新文章卡片 (2列) + 关于我卡片 (1列) -->
        
        <!-- 最新文章卡片 -->
        <div class="card card-article" @click="goToLatestPost">
          <div class="card-badge">
            <PenTool :size="14" />
            <span>最新发布</span>
          </div>
          <h3 class="card-title">{{ latestPost?.title || '暂无文章' }}</h3>
          <p class="card-desc">{{ latestPost?.excerpt || '敬请期待更多内容...' }}</p>
          <div class="card-tags" v-if="latestPost">
            <span class="tag">#技术</span>
            <span class="tag">#排查</span>
          </div>
        </div>

        <!-- 关于我卡片 -->
        <div class="card card-about">
          <div class="about-avatar">
            <User :size="24" />
          </div>
          <h3 class="about-title">About Me</h3>
          <p class="about-desc">全栈开发者，热爱开源，目前专注于 AI 和可视化工具链领域。</p>
          <a href="https://github.com/null-object-0000" target="_blank" class="about-link">
            了解更多 →
          </a>
        </div>

        <!-- 第二行: 开源项目卡片 (1列) + 常用导航卡片 (2列) -->
        
        <!-- 开源项目卡片 -->
        <a 
          href="https://github.com/null-object-0000/newbie-home" 
          target="_blank" 
          class="card card-project"
        >
          <div class="project-badge">
            <Box :size="14" />
            <span>Featured Project</span>
          </div>
          <div class="project-screenshot">
            <span>Newbie Space</span>
          </div>
          <h3 class="project-title">Newbie-Home</h3>
          <div class="project-stats">
            <span class="stat-item">
              <Star :size="14" />
              <span>New</span>
            </span>
            <span class="stat-item">
              <GitFork :size="14" />
              <span>Fork</span>
            </span>
          </div>
        </a>

        <!-- 常用导航卡片 -->
        <div class="card card-nav">
          <div class="nav-header">
            <div class="nav-badge">
              <Compass :size="14" />
              <span>常用导航</span>
            </div>
            <router-link to="/nav/" class="view-all">查看全部 →</router-link>
          </div>
          <div class="quick-links">
            <a 
              v-for="link in featuredLinks" 
              :key="link.name" 
              :href="link.link" 
              target="_blank"
              class="quick-link-card"
            >
              <div class="quick-link-header">
                <div class="quick-link-title-row">
                  <div class="quick-link-icon-wrapper">
                    <img 
                      :src="getIconUrl(link)" 
                      :alt="link.name"
                      class="quick-link-icon"
                      @error="handleIconError"
                    />
                  </div>
                  <h4 class="quick-link-title">{{ link.name }}</h4>
                </div>
                <ExternalLink :size="14" class="quick-link-external" />
              </div>
              <p class="quick-link-desc">{{ link.desc || 'No description available.' }}</p>
            </a>
          </div>
        </div>
      </div>
    </main>

    <!-- 页脚 -->
    <footer class="site-footer">
      <div class="footer-container">
        <p>© 2026 Newbie Space. Built with Vue 3 & Vite.</p>
        <div class="footer-links">
          <a href="https://github.com/null-object-0000" target="_blank" class="footer-link">GitHub</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTheme, useData } from '@/composables/useTheme'
import { getAllPosts } from '@/data/posts'
import navData from '@/data/nav-data.json'
import { 
  Sun, Moon, Github, Menu, PenTool, User, Compass,
  Box, Star, GitFork, ExternalLink
} from 'lucide-vue-next'

const router = useRouter()
const { isDark, toggleDark } = useTheme()
const { site } = useData()
const base = site.value.base || '/'

const mobileMenuOpen = ref(false)

// 获取最新文章
const posts = getAllPosts()
const latestPost = posts[0]

// 近期使用 - 从 localStorage 读取点击记录
const STORAGE_KEY_CLICKS = 'nav-click-counts'
const clickCounts = ref<Record<string, number>>({})

const loadClickCounts = () => {
  if (typeof localStorage === 'undefined') return
  try {
    const stored = localStorage.getItem(STORAGE_KEY_CLICKS)
    if (stored) {
      clickCounts.value = JSON.parse(stored)
    }
  } catch (e) {
    console.error('Failed to load click counts:', e)
    clickCounts.value = {}
  }
}

onMounted(() => {
  loadClickCounts()
})

// 获取所有链接的扁平列表
const getAllLinks = () => {
  return navData.flatMap((cat: any) => 
    cat.links.map((link: any) => ({
      ...link,
      categoryName: cat.name
    }))
  )
}

// 默认常用工具列表（当近期使用不足时用于填充）
const defaultCategories = ['AI 对话', '常用工具', 'AI 编码', 'AI 代理']

const getDefaultLinks = () => {
  const links: any[] = []
  for (const catName of defaultCategories) {
    const category = navData.find((c: any) => c.name === catName)
    if (category && category.links && category.links.length > 0) {
      links.push(category.links[0])
    }
  }
  return links.slice(0, 4)
}

// 精选导航链接 - 优先使用近期使用，不足时用默认工具填充
const featuredLinks = computed(() => {
  const allLinks = getAllLinks()
  const MAX_LINKS = 4
  
  // 1. 获取近期使用的链接（按点击次数排序）
  const recentLinks = allLinks
    .map(link => ({
      ...link,
      clickCount: clickCounts.value[link.link] || 0
    }))
    .filter(link => link.clickCount > 0)
    .sort((a, b) => b.clickCount - a.clickCount)
    .slice(0, MAX_LINKS)
    .map(({ clickCount, categoryName, ...link }) => link)

  // 2. 如果近期使用的链接足够，直接返回
  if (recentLinks.length >= MAX_LINKS) {
    return recentLinks
  }

  // 3. 不足时用默认工具填充
  const defaultLinks = getDefaultLinks()
  const recentUrls = new Set(recentLinks.map(l => l.link))
  
  // 过滤掉已在近期使用中的默认链接
  const fillLinks = defaultLinks.filter(l => !recentUrls.has(l.link))
  
  // 合并并限制数量
  return [...recentLinks, ...fillLinks].slice(0, MAX_LINKS)
})

const goToLatestPost = () => {
  if (latestPost) {
    router.push(`/posts/${latestPost.slug}`)
  }
}

// 获取域名
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
      return base.endsWith('/') ? base + link.icon.substring(1) : base + link.icon
    } else if (link.icon.startsWith('http://') || link.icon.startsWith('https://')) {
      // 如果是完整的 URL，直接使用
      return link.icon
    }
  }
  // 如果没有本地图标，回退到 Google Favicon 服务
  return `https://www.google.com/s2/favicons?domain=${getDomain(link.link)}&sz=64`
}

const handleIconError = (e: Event) => {
  const img = e.target as HTMLImageElement
  // 尝试使用 Google Favicon 作为回退
  const linkCard = img.closest('.quick-link-card') as HTMLElement
  if (linkCard) {
    const linkUrl = linkCard.getAttribute('href')
    if (linkUrl && !img.src.includes('google.com/s2/favicons')) {
      img.src = `https://www.google.com/s2/favicons?domain=${getDomain(linkUrl)}&sz=64`
      return
    }
  }
  img.style.display = 'none'
}
</script>

<style scoped>
/* ========== 基础样式 ========== */
.home-page {
  --brand-500: #3b82f6;
  --brand-600: #2563eb;
  --accent-500: #06b6d4;
  --accent-600: #0891b2;
  
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  transition: background-color 0.3s, color 0.3s;
  -webkit-font-smoothing: antialiased;
}

/* ========== 深色主题 (完全匹配 test.html) ========== */
.dark-mode {
  --bg-main: #09090b;
  --bg-surface: #18181b;
  --bg-elevated: #27272a;
  --border-color: #27272a;
  --text-primary: #f4f4f5;
  --text-secondary: #a1a1aa;
  --text-muted: #71717a;
  
  background-color: var(--bg-main);
  color: var(--text-primary);
}

/* ========== 浅色主题 ========== */
.light-mode {
  --bg-main: #f9fafb;
  --bg-surface: #ffffff;
  --bg-elevated: #f3f4f6;
  --border-color: #e5e7eb;
  --text-primary: #111827;
  --text-secondary: #6b7280;
  --text-muted: #9ca3af;
  
  background-color: var(--bg-main);
  color: var(--text-primary);
}

/* ========== 毛玻璃导航栏 (完全匹配 test.html .glass-panel) ========== */
.glass-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  border-bottom: 1px solid var(--border-color);
  transition: all 0.3s;
}

.light-mode .glass-nav {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-color: rgba(229, 231, 235, 1);
}

.dark-mode .glass-nav {
  background: rgba(24, 24, 27, 0.6);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-color: rgba(255, 255, 255, 0.05);
}

.nav-container {
  max-width: 72rem;
  margin: 0 auto;
  padding: 0 1rem;
  height: 4rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

@media (min-width: 640px) {
  .nav-container {
    padding: 0 1.5rem;
  }
}

@media (min-width: 1024px) {
  .nav-container {
    padding: 0 2rem;
  }
}

.logo-area {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.logo-icon {
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
  background: linear-gradient(to bottom right, var(--brand-500), var(--accent-600));
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 1rem;
}

.site-title {
  font-size: 1.125rem;
  font-weight: 700;
  letter-spacing: -0.025em;
}

.nav-links {
  display: none;
  align-items: center;
  gap: 2rem;
}

@media (min-width: 768px) {
  .nav-links {
    display: flex;
  }
}

.nav-item {
  position: relative;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-muted);
  text-decoration: none;
  padding: 0.25rem 0;
  transition: color 0.2s;
}

.nav-item:hover {
  color: var(--brand-500);
}

.nav-item.active {
  color: var(--brand-500);
}

.nav-indicator {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: var(--brand-500);
  border-radius: 9999px;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.action-btn {
  padding: 0.5rem;
  border-radius: 9999px;
  border: none;
  background: transparent;
  color: inherit;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.light-mode .action-btn:hover {
  background: rgba(229, 231, 235, 1);
}

.dark-mode .action-btn:hover {
  background: rgba(39, 39, 42, 1);
}

.mobile-menu-btn {
  display: block;
  padding: 0.5rem;
  border: none;
  background: transparent;
  color: inherit;
  cursor: pointer;
}

@media (min-width: 768px) {
  .mobile-menu-btn {
    display: none;
  }
}

/* ========== 移动端菜单 ========== */
.mobile-menu {
  position: fixed;
  inset: 0;
  z-index: 40;
  padding-top: 5rem;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.light-mode .mobile-menu {
  background: #ffffff;
}

.dark-mode .mobile-menu {
  background: var(--bg-main);
}

@media (min-width: 768px) {
  .mobile-menu {
    display: none;
  }
}

.mobile-nav-item {
  font-size: 1.25rem;
  font-weight: 500;
  color: var(--text-muted);
  text-decoration: none;
  text-align: left;
}

.mobile-nav-item:hover {
  color: var(--brand-500);
}

/* ========== 主内容区域 ========== */
.main-content {
  flex: 1;
  padding-top: 6rem;
  padding-bottom: 4rem;
  padding-left: 1rem;
  padding-right: 1rem;
  max-width: 72rem;
  margin: 0 auto;
  width: 100%;
}

@media (min-width: 640px) {
  .main-content {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
}

@media (min-width: 1024px) {
  .main-content {
    padding-left: 2rem;
    padding-right: 2rem;
  }
}

/* ========== Hero 区域 ========== */
.hero-section {
  text-align: center;
  padding: 2.5rem 0;
  animation: slideUp 0.5s ease-out;
}

.hero-title {
  font-size: 2.25rem;
  font-weight: 700;
  margin: 0 0 1rem;
  line-height: 1.2;
}

@media (min-width: 768px) {
  .hero-title {
    font-size: 3.75rem;
  }
}

.light-mode .hero-title {
  background: linear-gradient(to right, #111827, #4b5563);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.dark-mode .hero-title {
  background: linear-gradient(to right, #ffffff, #a1a1aa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-desc {
  font-size: 1.125rem;
  color: var(--text-secondary);
  max-width: 42rem;
  margin: 0 auto;
  line-height: 1.75;
}

/* ========== 仪表板卡片网格 ========== */
.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  animation: slideUp 0.5s ease-out;
}

@media (min-width: 768px) {
  .dashboard-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* ========== 通用卡片样式 ========== */
.card {
  border-radius: 1rem;
  padding: 1.5rem;
  border: 1px solid var(--border-color);
  transition: all 0.2s;
  cursor: pointer;
}

.light-mode .card {
  background: var(--bg-surface);
}

.dark-mode .card {
  background: var(--bg-surface);
}

.card:hover {
  border-color: var(--brand-500);
}

/* ========== 文章卡片 (占2列) ========== */
.card-article {
  grid-column: 1;
}

@media (min-width: 768px) {
  .card-article {
    grid-column: span 2;
  }
}

.card-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--brand-500);
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 1rem;
}

.card-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 0.5rem;
  line-height: 1.3;
  transition: color 0.2s;
}

.card:hover .card-title {
  color: var(--brand-500);
}

.card-desc {
  color: var(--text-muted);
  line-height: 1.625;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-tags {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.tag {
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  color: var(--text-muted);
}

.light-mode .tag {
  background: #f3f4f6;
}

.dark-mode .tag {
  background: rgba(39, 39, 42, 1);
}

/* ========== 关于我卡片 ========== */
.card-about {
  background: linear-gradient(to bottom right, var(--brand-500), var(--accent-600)) !important;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: none !important;
}

.card-about:hover {
  border: none !important;
}

.about-avatar {
  width: 3rem;
  height: 3rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}

.about-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
}

.about-desc {
  font-size: 0.875rem;
  opacity: 0.8;
  margin: 0.5rem 0 0;
  line-height: 1.5;
}

.about-link {
  font-size: 0.875rem;
  font-weight: 500;
  color: white;
  text-decoration: none;
  margin-top: 1rem;
  align-self: flex-start;
}

.about-link:hover {
  text-decoration: underline;
}

/* ========== 开源项目卡片 ========== */
.card-project {
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s, border-color 0.2s;
}

.card-project:hover {
  transform: translateY(-4px);
}

.project-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--accent-500);
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 1rem;
}

.project-screenshot {
  width: 100%;
  height: 8rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: 600;
}

.light-mode .project-screenshot {
  background: #f3f4f6;
  color: #9ca3af;
}

.dark-mode .project-screenshot {
  background: rgba(39, 39, 42, 1);
  color: #71717a;
}

.project-title {
  font-size: 1.125rem;
  font-weight: 700;
  margin: 0;
}

.project-stats {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: var(--text-muted);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

/* ========== 常用导航卡片 (占2列，无外边框) ========== */
.card-nav {
  grid-column: 1;
  background: transparent !important;
  border: none !important;
  padding: 0.5rem;
}

.card-nav:hover {
  border: none !important;
}

@media (min-width: 768px) {
  .card-nav {
    grid-column: span 2;
  }
}

.nav-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.nav-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #22c55e;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.view-all {
  font-size: 0.75rem;
  color: var(--text-muted);
  text-decoration: none;
  transition: color 0.2s;
}

.view-all:hover {
  color: var(--brand-500);
}

.quick-links {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
}

@media (min-width: 640px) {
  .quick-links {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* 内部网站卡片样式 - 有边框 */
.quick-link-card {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  border-radius: 0.75rem;
  border: 1px solid;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s;
}

.light-mode .quick-link-card {
  background-color: rgba(255, 255, 255, 0.6);
  border-color: rgba(226, 232, 240, 0.6);
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.light-mode .quick-link-card:hover {
  background-color: white;
  border-color: rgba(147, 197, 253, 0.5);
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.dark-mode .quick-link-card {
  background-color: rgba(30, 41, 59, 0.4);
  border-color: rgba(71, 85, 105, 0.5);
}

.dark-mode .quick-link-card:hover {
  background-color: rgba(30, 41, 59, 0.8);
  border-color: rgba(59, 130, 246, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.1);
}

.quick-link-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.quick-link-title-row {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  flex: 1;
  min-width: 0;
}

.quick-link-icon-wrapper {
  padding: 0.375rem;
  border-radius: 0.5rem;
  flex-shrink: 0;
}

.light-mode .quick-link-icon-wrapper {
  background-color: #f1f5f9;
}

.dark-mode .quick-link-icon-wrapper {
  background-color: rgba(15, 23, 42, 0.5);
}

.quick-link-icon {
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 50%;
  object-fit: contain;
  display: block;
}

.quick-link-title {
  font-size: 0.875rem;
  font-weight: 600;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.quick-link-external {
  color: var(--text-muted);
  opacity: 0;
  transition: opacity 0.2s;
  flex-shrink: 0;
}

.quick-link-card:hover .quick-link-external {
  opacity: 1;
}

.quick-link-desc {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin: 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* ========== 页脚 ========== */
.site-footer {
  border-top: 1px solid var(--border-color);
  padding: 2rem 1rem;
  margin-top: auto;
}

.footer-container {
  max-width: 72rem;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  font-size: 0.875rem;
  color: var(--text-muted);
}

@media (min-width: 768px) {
  .footer-container {
    flex-direction: row;
    justify-content: space-between;
  }
}

.footer-container p {
  margin: 0;
}

.footer-links {
  display: flex;
  gap: 1.5rem;
}

.footer-link {
  color: var(--text-muted);
  text-decoration: none;
  transition: color 0.2s;
}

.footer-link:hover {
  color: var(--brand-500);
}

/* ========== 动画 ========== */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* ========== 滚动条 ========== */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background-color: #3f3f46;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background-color: #52525b;
}

/* ========== 文字选中效果 ========== */
::selection {
  background: var(--brand-500);
  color: white;
}
</style>


