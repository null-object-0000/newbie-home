---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "Newbie Home"
  text: "我的个人导航与博客"
  tagline: "收集灵感，记录成长，分享技术"
  actions:
    - theme: brand
      text: 查看导航
      link: /nav/
    - theme: alt
      text: 阅读博客
      link: /posts/2025-04

---

## 🚀 快速导航

<div class="home-quick-nav">

<div class="quick-nav-card">
  <div class="quick-nav-icon">🤖</div>
  <h3>AI 助手</h3>
  <p>访问常用的 AI 对话工具</p>
  <a href="/nav/" class="quick-nav-link">前往 →</a>
</div>

<div class="quick-nav-card">
  <div class="quick-nav-icon">🛠️</div>
  <h3>常用工具</h3>
  <p>开发与调试必备工具</p>
  <a href="/nav/" class="quick-nav-link">前往 →</a>
</div>

<div class="quick-nav-card">
  <div class="quick-nav-icon">🤝</div>
  <h3>AI Agent</h3>
  <p>智能自动化工具集合</p>
  <a href="/nav/" class="quick-nav-link">前往 →</a>
</div>

</div>

## 📚 最新文章

<div class="home-latest-post">

<div class="latest-post-card">
  <div class="post-badge">最新</div>
  <h3>2025-04 应用内单台服务器无响应问题排查</h3>
  <p class="post-excerpt">记录了一次生产环境服务器无响应问题的完整排查过程，包括问题定位、内存分析、线程死锁排查等...</p>
  <div class="post-meta">
    <span class="post-date">2025-04</span>
    <a href="/posts/2025-04" class="post-link">阅读全文 →</a>
  </div>
</div>

</div>

<style>
.home-quick-nav {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin: 40px 0;
}

.quick-nav-card {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 32px 24px;
  text-align: center;
  transition: all 0.3s ease;
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
  background: linear-gradient(90deg, var(--vp-c-brand), var(--vp-c-brand-light));
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.quick-nav-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  border-color: var(--vp-c-brand);
}

.quick-nav-card:hover::before {
  transform: scaleX(1);
}

.quick-nav-icon {
  font-size: 48px;
  margin-bottom: 16px;
  display: block;
}

.quick-nav-card h3 {
  margin: 0 0 8px 0;
  font-size: 20px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.quick-nav-card p {
  margin: 0 0 20px 0;
  color: var(--vp-c-text-2);
  font-size: 14px;
  line-height: 1.6;
}

.quick-nav-link {
  display: inline-block;
  color: var(--vp-c-brand);
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
}

.quick-nav-link:hover {
  color: var(--vp-c-brand-dark);
  transform: translateX(4px);
}

.home-latest-post {
  margin: 40px 0;
}

.latest-post-card {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 32px;
  position: relative;
  transition: all 0.3s ease;
}

.latest-post-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  border-color: var(--vp-c-brand);
}

.post-badge {
  display: inline-block;
  background: linear-gradient(135deg, var(--vp-c-brand), var(--vp-c-brand-light));
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 16px;
}

.latest-post-card h3 {
  margin: 0 0 16px 0;
  font-size: 24px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  line-height: 1.4;
}

.post-excerpt {
  margin: 0 0 20px 0;
  color: var(--vp-c-text-2);
  font-size: 15px;
  line-height: 1.7;
}

.post-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid var(--vp-c-divider);
}

.post-date {
  color: var(--vp-c-text-3);
  font-size: 14px;
  font-family: var(--vp-font-family-mono);
}

.post-link {
  color: var(--vp-c-brand);
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
}

.post-link:hover {
  color: var(--vp-c-brand-dark);
  transform: translateX(4px);
}

@media (max-width: 768px) {
  .home-quick-nav {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .quick-nav-card {
    padding: 24px 20px;
  }
  
  .latest-post-card {
    padding: 24px;
  }
  
  .latest-post-card h3 {
    font-size: 20px;
  }
  
  .post-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}
</style>
---

