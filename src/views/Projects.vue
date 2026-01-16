<template>
  <div class="projects-page" :class="{ 'dark-mode': isDark, 'light-mode': !isDark }">
    <!-- 公共导航栏 -->
    <AppHeader />

    <!-- 主内容区域 -->
    <main class="main-content">
      <div class="projects-header">
        <h2 class="projects-title">开源工坊</h2>
        <p class="projects-desc">造轮子，不仅是为了使用，更是为了理解原理。</p>
      </div>

      <div class="projects-grid">
        <div 
          v-for="project in projects" 
          :key="project.id" 
          class="project-card"
        >
          <div class="project-image">
            <div class="project-image-placeholder">
              {{ project.name }}
            </div>
            <div class="project-actions">
              <a 
                v-if="project.demoUrl"
                :href="project.demoUrl" 
                target="_blank"
                class="demo-btn"
              >
                <Play :size="12" />
                Live Demo
              </a>
            </div>
          </div>
          <div class="project-content">
            <div class="project-header">
              <h3 class="project-name">{{ project.name }}</h3>
              <div class="project-stats">
                <span class="stat-item">
                  <Star :size="16" />
                  {{ project.stars }}
                </span>
              </div>
            </div>
            <p class="project-desc">
              {{ project.desc }}
            </p>
            <div class="project-footer">
              <div class="project-stack">
                <span 
                  v-for="tech in project.stack" 
                  :key="tech"
                  class="tech-dot" 
                  :class="getTechColor(tech)"
                  :title="tech"
                ></span>
              </div>
              <a 
                v-if="project.url"
                :href="project.url" 
                target="_blank"
                class="project-link"
              >
                查看文档
                <ArrowRight :size="16" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- 页脚 -->
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import { useTheme } from '@/composables/useTheme'
import { projects } from '@/data/projects'
import { 
  Star, Play, ArrowRight
} from 'lucide-vue-next'

const { isDark } = useTheme()

const getTechColor = (tech: string) => {
  const map: Record<string, string> = {
    vue: 'tech-vue',
    react: 'tech-react',
    ts: 'tech-ts',
    vite: 'tech-vite',
    node: 'tech-node',
    less: 'tech-less'
  }
  return map[tech] || 'tech-default'
}
</script>

<style scoped>
/* ========== 基础样式 ========== */
.projects-page {
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

/* ========== 深色主题 ========== */
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
  animation: slideUp 0.5s ease-out;
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

/* ========== 项目页头部 ========== */
.projects-header {
  margin-bottom: 2.5rem;
}

.projects-title {
  font-size: 1.875rem;
  font-weight: 700;
  margin: 0 0 1rem;
}

.projects-desc {
  color: var(--text-secondary);
  margin: 0;
}

/* ========== 项目网格 ========== */
.projects-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

@media (min-width: 768px) {
  .projects-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* ========== 项目卡片 ========== */
.project-card {
  background: var(--bg-surface);
  border-radius: 1rem;
  border: 1px solid var(--border-color);
  overflow: hidden;
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
}

.project-card:hover {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  transform: translateY(-2px);
}

.dark-mode .project-card:hover {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2);
}

/* ========== 项目图片区域 ========== */
.project-image {
  height: 12rem;
  background: var(--bg-elevated);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.project-image-placeholder {
  font-size: 2.25rem;
  font-weight: 700;
  opacity: 0.2;
  transform: scale(1);
  transition: transform 0.5s;
}

.project-card:hover .project-image-placeholder {
  transform: scale(1.1);
}

.project-actions {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  display: flex;
  gap: 0.5rem;
  opacity: 0;
  transform: translateY(0.5rem);
  transition: opacity 0.3s, transform 0.3s;
}

.project-card:hover .project-actions {
  opacity: 1;
  transform: translateY(0);
}

.demo-btn {
  background: var(--bg-surface);
  color: var(--text-primary);
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 700;
  text-decoration: none;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  gap: 0.25rem;
  transition: all 0.2s;
}

.demo-btn:hover {
  transform: scale(1.05);
}

/* ========== 项目内容 ========== */
.project-content {
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.project-name {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
}

.project-stats {
  display: flex;
  gap: 0.75rem;
  color: var(--text-muted);
  font-size: 0.875rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.project-desc {
  color: var(--text-secondary);
  font-size: 0.875rem;
  margin: 0 0 1rem;
  flex: 1;
  line-height: 1.5;
}

/* ========== 项目底部 ========== */
.project-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

.project-stack {
  display: flex;
  gap: 0.5rem;
}

.tech-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 9999px;
}

.tech-vue {
  background: #10b981;
}

.tech-react {
  background: #3b82f6;
}

.tech-ts {
  background: #2563eb;
}

.tech-vite {
  background: #06b6d4;
}

.tech-node {
  background: #16a34a;
}

.tech-less {
  background: #fb923c;
}

.tech-default {
  background: #9ca3af;
}

.project-link {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--brand-500);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  transition: color 0.2s;
}

.project-link:hover {
  color: var(--brand-600);
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
