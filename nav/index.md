---
layout: page
title: 资源导航
sidebar: false
---

<ClientOnly>
  <NavDashboard />
  <template #fallback>
    <div class="nav-loading">
      <div class="nav-loading-spinner"></div>
      <p>加载中...</p>
    </div>
  </template>
</ClientOnly>

<style>
/* 加载占位符样式 */
.nav-loading {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--vp-c-bg);
  z-index: 100;
}

.nav-loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--vp-c-divider);
  border-top-color: var(--vp-c-brand-1);
  border-radius: 50%;
  animation: nav-spin 0.8s linear infinite;
}

@keyframes nav-spin {
  to {
    transform: rotate(360deg);
  }
}

.nav-loading p {
  margin-top: 16px;
  color: var(--vp-c-text-2);
  font-size: 14px;
}

/* 只在导航页面隐藏 VitePress 默认头部导航栏 */
:has(.nav-dashboard) .VPNav,
:has(.nav-dashboard) .VPNavBar,
:has(.nav-dashboard) .vp-nav,
:has(.nav-dashboard) header[class*="VPNav"],
:has(.nav-dashboard) nav[class*="VPNav"] {
  display: none !important;
}

/* 只在导航页面调整页面布局，去除头部后的间距 */
:has(.nav-dashboard) .vp-page {
  padding-top: 0 !important;
}

/* 只在导航页面确保 NavDashboard 能够全屏显示 */
:has(.nav-dashboard) .vp-page .vp-doc {
  padding: 0 !important;
  max-width: 100% !important;
  margin: 0 !important;
}

/* 只在导航页面移除页面容器的边距 */
:has(.nav-dashboard) .vp-page > div {
  margin: 0 !important;
  padding: 0 !important;
}

/* 确保 NavDashboard 组件占据整个视口 */
.nav-dashboard {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1;
}
</style>