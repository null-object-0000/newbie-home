<template>
  <div class="post-page" :class="{ 'dark-mode': isDark, 'light-mode': !isDark }">
    <!-- Header -->
    <header class="post-header">
      <div class="header-content">
        <router-link to="/" class="logo-link">
          <img :src="`${base}logo.png`" alt="Newbie Space" class="logo" />
          <span class="site-title">Newbie Space</span>
        </router-link>
        
        <nav class="header-nav">
          <router-link to="/" class="nav-link">首页</router-link>
          <router-link to="/nav/" class="nav-link">导航</router-link>
          <button class="theme-toggle" @click="toggleDark()" :title="isDark ? '切换到亮色模式' : '切换到暗色模式'">
            <component :is="isDark ? Sun : Moon" :size="18" />
          </button>
        </nav>
      </div>
    </header>

    <!-- Main Content -->
    <main class="post-main">
      <article class="post-article">
        <div class="post-meta">
          <span class="post-date">{{ postMeta?.date }}</span>
        </div>
        
        <MarkdownRenderer v-if="content" :content="content" />
        
        <div v-else class="loading">
          <p>加载中...</p>
        </div>
      </article>
      
      <!-- Sidebar -->
      <aside class="post-sidebar">
        <div class="sidebar-card">
          <h3 class="sidebar-title">最新文章</h3>
          <ul class="post-list">
            <li v-for="post in allPosts" :key="post.slug">
              <router-link :to="`/posts/${post.slug}`" class="post-link">
                <span class="post-name">{{ post.title }}</span>
                <span class="post-date-small">{{ post.date }}</span>
              </router-link>
            </li>
          </ul>
        </div>
      </aside>
    </main>

    <!-- Footer -->
    <footer class="post-footer">
      <p>© 2026 Newbie Space. Built with Vue 3.</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useTheme, useData } from '@/composables/useTheme'
import { Sun, Moon } from 'lucide-vue-next'
import MarkdownRenderer from '@/components/blog/MarkdownRenderer.vue'
import { posts, getPostBySlug, getAllPosts } from '@/data/posts'

const route = useRoute()
const { isDark, toggleDark } = useTheme()
const { site } = useData()
const base = site.value.base || '/'

const content = ref('')
const postMeta = computed(() => getPostBySlug(route.params.slug as string))
const allPosts = getAllPosts()

// 动态加载文章内容
const loadPost = async (slug: string) => {
  try {
    // 使用 Vite 的 import.meta.glob 来加载 markdown 文件
    const modules = import.meta.glob('@/content/posts/*.md', { query: '?raw', import: 'default' })
    const path = `/src/content/posts/${slug}.md`
    
    // 查找匹配的模块
    for (const [key, loader] of Object.entries(modules)) {
      if (key.includes(slug)) {
        const rawContent = await loader() as string
        content.value = rawContent
        return
      }
    }
    
    content.value = '# 文章未找到\n\n抱歉，您请求的文章不存在。'
  } catch (error) {
    console.error('Failed to load post:', error)
    content.value = '# 加载失败\n\n抱歉，文章加载失败，请稍后重试。'
  }
}

onMounted(() => {
  const slug = route.params.slug as string
  if (slug) {
    loadPost(slug)
  }
})

watch(() => route.params.slug, (newSlug) => {
  if (newSlug) {
    loadPost(newSlug as string)
  }
})
</script>

<style scoped>
.post-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  transition: background-color 0.3s, color 0.3s;
}

.dark-mode {
  background-color: #0f172a;
  color: #e2e8f0;
}

.light-mode {
  background-color: #f8fafc;
  color: #1e293b;
}

/* Header */
.post-header {
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(12px);
  border-bottom: 1px solid;
}

.dark-mode .post-header {
  background-color: rgba(15, 23, 42, 0.8);
  border-bottom-color: rgba(148, 163, 184, 0.1);
}

.light-mode .post-header {
  background-color: rgba(255, 255, 255, 0.8);
  border-bottom-color: rgba(0, 0, 0, 0.1);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo-link {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: inherit;
}

.logo {
  width: 32px;
  height: 32px;
}

.site-title {
  font-size: 20px;
  font-weight: 700;
  background: linear-gradient(to right, #60a5fa, #a78bfa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.header-nav {
  display: flex;
  align-items: center;
  gap: 24px;
}

.nav-link {
  color: inherit;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  opacity: 0.8;
  transition: opacity 0.2s;
}

.nav-link:hover {
  opacity: 1;
}

.nav-link.router-link-active {
  color: var(--c-brand);
  opacity: 1;
}

.theme-toggle {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  color: inherit;
}

.dark-mode .theme-toggle {
  background-color: rgba(148, 163, 184, 0.1);
}

.dark-mode .theme-toggle:hover {
  background-color: rgba(148, 163, 184, 0.2);
}

.light-mode .theme-toggle {
  background-color: rgba(0, 0, 0, 0.05);
}

.light-mode .theme-toggle:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

/* Main */
.post-main {
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 48px 24px;
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 48px;
}

@media (max-width: 900px) {
  .post-main {
    grid-template-columns: 1fr;
  }
  
  .post-sidebar {
    display: none;
  }
}

.post-article {
  min-width: 0;
}

.post-meta {
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--c-divider);
}

.post-date {
  font-size: 14px;
  color: var(--c-text-2);
  font-family: var(--font-family-mono);
}

.loading {
  text-align: center;
  padding: 48px;
  color: var(--c-text-2);
}

/* Sidebar */
.post-sidebar {
  position: sticky;
  top: 100px;
  height: fit-content;
}

.sidebar-card {
  padding: 20px;
  border-radius: 12px;
  border: 1px solid;
}

.dark-mode .sidebar-card {
  background-color: rgba(30, 41, 59, 0.4);
  border-color: rgba(71, 85, 105, 0.5);
}

.light-mode .sidebar-card {
  background-color: rgba(255, 255, 255, 0.6);
  border-color: rgba(226, 232, 240, 0.6);
}

.sidebar-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 16px 0;
}

.post-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.post-list li {
  margin-bottom: 12px;
}

.post-list li:last-child {
  margin-bottom: 0;
}

.post-link {
  display: flex;
  flex-direction: column;
  gap: 4px;
  text-decoration: none;
  color: inherit;
  padding: 8px;
  border-radius: 8px;
  transition: background-color 0.2s;
}

.dark-mode .post-link:hover {
  background-color: rgba(148, 163, 184, 0.1);
}

.light-mode .post-link:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.post-name {
  font-size: 14px;
  font-weight: 500;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-date-small {
  font-size: 12px;
  color: var(--c-text-3);
  font-family: var(--font-family-mono);
}

/* Footer */
.post-footer {
  padding: 24px;
  text-align: center;
  border-top: 1px solid var(--c-divider);
}

.post-footer p {
  font-size: 14px;
  color: var(--c-text-3);
  margin: 0;
}
</style>
