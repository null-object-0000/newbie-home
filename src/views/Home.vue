<template>
  <div class="home-page" :class="{ 'dark-mode': isDark, 'light-mode': !isDark }">
    <!-- Header -->
    <header class="home-header">
      <div class="header-content">
        <div class="logo-area">
          <img :src="`${base}logo.png`" alt="Newbie Home" class="logo" />
          <span class="site-title">Newbie Home</span>
        </div>
        
        <nav class="header-nav">
          <router-link to="/" class="nav-link active">首页</router-link>
          <router-link to="/nav/" class="nav-link">导航</router-link>
          <router-link to="/posts/2025-04" class="nav-link">博客</router-link>
          <button class="theme-toggle" @click="toggleDark()" :title="isDark ? '切换到亮色模式' : '切换到暗色模式'">
            <component :is="isDark ? Sun : Moon" :size="18" />
          </button>
        </nav>
      </div>
    </header>

    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-content">
        <div class="hero-text">
          <h1 class="hero-name">Newbie Home</h1>
          <p class="hero-tagline">我的个人导航与博客</p>
          <p class="hero-desc">收集灵感，记录成长，分享技术</p>
          <div class="hero-actions">
            <router-link to="/nav/" class="hero-btn hero-btn-primary">
              <Compass :size="18" />
              <span>查看导航</span>
            </router-link>
            <router-link to="/posts/2025-04" class="hero-btn hero-btn-secondary">
              <BookOpen :size="18" />
              <span>阅读博客</span>
            </router-link>
          </div>
        </div>
        <div class="hero-image">
          <img :src="`${base}logo.png`" alt="Newbie Home Logo" />
        </div>
      </div>
      
      <!-- Background decorations -->
      <div class="hero-bg">
        <div class="hero-bg-circle hero-bg-circle-1"></div>
        <div class="hero-bg-circle hero-bg-circle-2"></div>
      </div>
    </section>

    <!-- Quick Nav Section -->
    <section class="section quick-nav-section">
      <div class="section-container">
        <h2 class="section-title">
          <Rocket :size="24" />
          <span>快速导航</span>
        </h2>
        
        <div class="quick-nav-grid">
          <router-link to="/nav/" class="quick-nav-card">
            <div class="quick-nav-icon">
              <Bot :size="32" />
            </div>
            <h3>AI 助手</h3>
            <p>访问常用的 AI 对话工具</p>
            <span class="quick-nav-link">
              前往 <ArrowRight :size="14" />
            </span>
          </router-link>
          
          <router-link to="/nav/" class="quick-nav-card">
            <div class="quick-nav-icon">
              <Wrench :size="32" />
            </div>
            <h3>常用工具</h3>
            <p>开发与调试必备工具</p>
            <span class="quick-nav-link">
              前往 <ArrowRight :size="14" />
            </span>
          </router-link>
          
          <router-link to="/nav/" class="quick-nav-card">
            <div class="quick-nav-icon">
              <Zap :size="32" />
            </div>
            <h3>AI Agent</h3>
            <p>智能自动化工具集合</p>
            <span class="quick-nav-link">
              前往 <ArrowRight :size="14" />
            </span>
          </router-link>
        </div>
      </div>
    </section>

    <!-- Latest Posts Section -->
    <section class="section posts-section">
      <div class="section-container">
        <h2 class="section-title">
          <FileText :size="24" />
          <span>最新文章</span>
        </h2>
        
        <div class="posts-list">
          <router-link 
            v-for="post in latestPosts" 
            :key="post.slug" 
            :to="`/posts/${post.slug}`" 
            class="post-card"
          >
            <div class="post-badge">最新</div>
            <h3 class="post-title">{{ post.title }}</h3>
            <p class="post-excerpt">{{ post.excerpt }}</p>
            <div class="post-meta">
              <span class="post-date">
                <Calendar :size="14" />
                {{ post.date }}
              </span>
              <span class="post-link">
                阅读全文 <ArrowRight :size="14" />
              </span>
            </div>
          </router-link>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="home-footer">
      <div class="footer-content">
        <p>© 2026 Newbie Home. Built with Vue 3 + Vite.</p>
        <div class="footer-links">
          <a href="https://github.com/null-object-0000/newbie-home" target="_blank" rel="noopener noreferrer">
            <Github :size="18" />
          </a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useTheme, useData } from '@/composables/useTheme'
import { getAllPosts } from '@/data/posts'
import { 
  Sun, Moon, Compass, BookOpen, Rocket, Bot, Wrench, Zap, 
  FileText, Calendar, ArrowRight, Github 
} from 'lucide-vue-next'

const { isDark, toggleDark } = useTheme()
const { site } = useData()
const base = site.value.base || '/'

const latestPosts = getAllPosts().slice(0, 3)
</script>

<style scoped>
.home-page {
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
.home-header {
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(12px);
  border-bottom: 1px solid;
}

.dark-mode .home-header {
  background-color: rgba(15, 23, 42, 0.8);
  border-bottom-color: rgba(148, 163, 184, 0.1);
}

.light-mode .home-header {
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

.logo-area {
  display: flex;
  align-items: center;
  gap: 12px;
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

.nav-link:hover,
.nav-link.active {
  opacity: 1;
}

.nav-link.router-link-exact-active {
  color: var(--c-brand);
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

/* Hero Section */
.hero-section {
  position: relative;
  padding: 80px 24px;
  overflow: hidden;
}

.hero-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 48px;
  position: relative;
  z-index: 1;
}

@media (max-width: 768px) {
  .hero-content {
    flex-direction: column;
    text-align: center;
  }
}

.hero-text {
  flex: 1;
}

.hero-name {
  font-size: 56px;
  font-weight: 800;
  margin: 0 0 16px 0;
  background: linear-gradient(135deg, #60a5fa, #a78bfa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.2;
}

@media (max-width: 768px) {
  .hero-name {
    font-size: 40px;
  }
}

.hero-tagline {
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 12px 0;
  opacity: 0.9;
}

.hero-desc {
  font-size: 16px;
  margin: 0 0 32px 0;
  opacity: 0.7;
}

.hero-actions {
  display: flex;
  gap: 16px;
}

@media (max-width: 768px) {
  .hero-actions {
    justify-content: center;
    flex-wrap: wrap;
  }
}

.hero-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s;
}

.hero-btn-primary {
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  color: white;
  box-shadow: 0 4px 14px rgba(59, 130, 246, 0.4);
}

.hero-btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.5);
}

.hero-btn-secondary {
  border: 2px solid;
}

.dark-mode .hero-btn-secondary {
  border-color: rgba(148, 163, 184, 0.3);
  color: #e2e8f0;
}

.dark-mode .hero-btn-secondary:hover {
  background-color: rgba(148, 163, 184, 0.1);
  border-color: rgba(148, 163, 184, 0.5);
}

.light-mode .hero-btn-secondary {
  border-color: rgba(0, 0, 0, 0.2);
  color: #1e293b;
}

.light-mode .hero-btn-secondary:hover {
  background-color: rgba(0, 0, 0, 0.05);
  border-color: rgba(0, 0, 0, 0.3);
}

.hero-image {
  flex-shrink: 0;
}

.hero-image img {
  width: 200px;
  height: 200px;
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

@media (max-width: 768px) {
  .hero-image img {
    width: 150px;
    height: 150px;
  }
}

/* Hero Background */
.hero-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.hero-bg-circle {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.15;
}

.hero-bg-circle-1 {
  width: 500px;
  height: 500px;
  top: -200px;
  right: -100px;
  background: #3b82f6;
}

.hero-bg-circle-2 {
  width: 400px;
  height: 400px;
  bottom: -150px;
  left: -100px;
  background: #8b5cf6;
}

/* Sections */
.section {
  padding: 64px 24px;
}

.section-container {
  max-width: 1200px;
  margin: 0 auto;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 32px 0;
}

.dark-mode .section-title {
  color: #60a5fa;
}

.light-mode .section-title {
  color: #3b82f6;
}

/* Quick Nav */
.quick-nav-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.quick-nav-card {
  display: flex;
  flex-direction: column;
  padding: 32px 24px;
  border-radius: 16px;
  border: 1px solid;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
}

.quick-nav-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--c-brand), var(--c-brand-light));
  transform: scaleX(0);
  transition: transform 0.3s;
}

.quick-nav-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

.quick-nav-card:hover::before {
  transform: scaleX(1);
}

.dark-mode .quick-nav-card {
  background-color: rgba(30, 41, 59, 0.4);
  border-color: rgba(71, 85, 105, 0.5);
}

.dark-mode .quick-nav-card:hover {
  background-color: rgba(30, 41, 59, 0.6);
  border-color: var(--c-brand);
}

.light-mode .quick-nav-card {
  background-color: rgba(255, 255, 255, 0.6);
  border-color: rgba(226, 232, 240, 0.6);
}

.light-mode .quick-nav-card:hover {
  background-color: white;
  border-color: var(--c-brand);
}

.quick-nav-icon {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  margin-bottom: 20px;
}

.dark-mode .quick-nav-icon {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(139, 92, 246, 0.2));
  color: #60a5fa;
}

.light-mode .quick-nav-icon {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1));
  color: #3b82f6;
}

.quick-nav-card h3 {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.quick-nav-card p {
  font-size: 14px;
  margin: 0 0 16px 0;
  opacity: 0.7;
  flex: 1;
}

.quick-nav-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 500;
  color: var(--c-brand);
  transition: transform 0.2s;
}

.quick-nav-card:hover .quick-nav-link {
  transform: translateX(4px);
}

/* Posts Section */
.posts-section {
  border-top: 1px solid;
}

.dark-mode .posts-section {
  background-color: rgba(15, 23, 42, 0.5);
  border-top-color: rgba(148, 163, 184, 0.1);
}

.light-mode .posts-section {
  background-color: rgba(255, 255, 255, 0.5);
  border-top-color: rgba(0, 0, 0, 0.05);
}

.posts-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.post-card {
  display: block;
  padding: 28px;
  border-radius: 16px;
  border: 1px solid;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s;
  position: relative;
}

.post-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.dark-mode .post-card {
  background-color: rgba(30, 41, 59, 0.4);
  border-color: rgba(71, 85, 105, 0.5);
}

.dark-mode .post-card:hover {
  background-color: rgba(30, 41, 59, 0.6);
  border-color: var(--c-brand);
}

.light-mode .post-card {
  background-color: rgba(255, 255, 255, 0.6);
  border-color: rgba(226, 232, 240, 0.6);
}

.light-mode .post-card:hover {
  background-color: white;
  border-color: var(--c-brand);
}

.post-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 16px;
  background: linear-gradient(135deg, var(--c-brand), var(--c-brand-light));
  color: white;
}

.post-title {
  font-size: 22px;
  font-weight: 600;
  margin: 0 0 12px 0;
  line-height: 1.4;
}

.post-excerpt {
  font-size: 15px;
  margin: 0 0 20px 0;
  opacity: 0.7;
  line-height: 1.7;
}

.post-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid var(--c-divider);
}

.post-date {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  opacity: 0.6;
  font-family: var(--font-family-mono);
}

.post-link {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 500;
  color: var(--c-brand);
  transition: transform 0.2s;
}

.post-card:hover .post-link {
  transform: translateX(4px);
}

/* Footer */
.home-footer {
  margin-top: auto;
  padding: 24px;
  border-top: 1px solid var(--c-divider);
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
}

.footer-content p {
  font-size: 14px;
  margin: 0;
  opacity: 0.6;
}

.footer-links a {
  color: inherit;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.footer-links a:hover {
  opacity: 1;
}
</style>
