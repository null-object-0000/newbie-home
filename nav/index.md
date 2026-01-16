---
layout: page
title: 资源导航
sidebar: false
---

<div class="nav-page-container">
  <ClientOnly>
    <NavDashboard />
    <template #fallback>
      <div class="nav-loading">
        <div class="nav-loading-spinner"></div>
        <p>加载中...</p>
      </div>
    </template>
  </ClientOnly>
</div>

<style>
/* 
 * 关键：使用 .nav-page-container 作为标记，这样 SSR 阶段就能触发样式
 * 解决了 ClientOnly 导致的页面闪烁问题
 */

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

/* 使用 .nav-page-container 替代 .nav-dashboard，确保 SSR 阶段样式就能生效 */
:has(.nav-page-container) .VPNav,
:has(.nav-page-container) .VPNavBar,
:has(.nav-page-container) .vp-nav,
:has(.nav-page-container) header[class*="VPNav"],
:has(.nav-page-container) nav[class*="VPNav"] {
  display: none !important;
}

:has(.nav-page-container) .vp-page {
  padding-top: 0 !important;
}

:has(.nav-page-container) .vp-page .vp-doc {
  padding: 0 !important;
  max-width: 100% !important;
  margin: 0 !important;
}

:has(.nav-page-container) .vp-page > div {
  margin: 0 !important;
  padding: 0 !important;
}

/* NavDashboard 组件样式 */
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