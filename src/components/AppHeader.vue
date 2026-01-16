<template>
  <div>
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
          <router-link to="/projects" class="nav-item" :class="{ active: $route.path === '/projects' }">
            项目
            <span class="nav-indicator" v-if="$route.path === '/projects'"></span>
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
        <router-link to="/projects" class="mobile-nav-item" @click="mobileMenuOpen = false">项目</router-link>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useTheme } from '@/composables/useTheme'
import { Sun, Moon, Github, Menu } from 'lucide-vue-next'

const router = useRouter()
const { isDark, toggleDark } = useTheme()
const mobileMenuOpen = ref(false)
</script>

<style scoped>
/* ========== 毛玻璃导航栏 ========== */
.glass-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  border-bottom: 1px solid var(--border-color);
  transition: all 0.3s;
}
</style>

<style>
/* 全局样式，用于响应父组件的主题类 */
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

.light-mode .action-btn:hover {
  background: rgba(229, 231, 235, 1);
}

.dark-mode .action-btn:hover {
  background: rgba(39, 39, 42, 1);
}

.light-mode .mobile-menu {
  background: #ffffff;
}

.dark-mode .mobile-menu {
  background: var(--bg-main, #09090b);
}
</style>

<style scoped>

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
  background: linear-gradient(to bottom right, var(--brand-500, #3b82f6), var(--accent-600, #0891b2));
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
  color: var(--text-muted, #71717a);
  text-decoration: none;
  padding: 0.25rem 0;
  transition: color 0.2s;
}

.nav-item:hover {
  color: var(--brand-500, #3b82f6);
}

.nav-item.active {
  color: var(--brand-500, #3b82f6);
}

.nav-indicator {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: var(--brand-500, #3b82f6);
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


@media (min-width: 768px) {
  .mobile-menu {
    display: none;
  }
}

.mobile-nav-item {
  font-size: 1.25rem;
  font-weight: 500;
  color: var(--text-muted, #71717a);
  text-decoration: none;
  text-align: left;
}

.mobile-nav-item:hover {
  color: var(--brand-500, #3b82f6);
}

/* ========== 动画 ========== */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
