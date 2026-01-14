---
layout: page
title: 资源导航
sidebar: false
---

<NavDashboard />

<style>
/* 隐藏 VitePress 默认头部导航栏 */
.VPNav,
.VPNavBar,
.vp-nav,
header[class*="VPNav"],
nav[class*="VPNav"] {
  display: none !important;
}

/* 调整页面布局，去除头部后的间距 */
.vp-page {
  padding-top: 0 !important;
}

/* 确保 NavDashboard 能够全屏显示 */
.vp-page .vp-doc {
  padding: 0 !important;
  max-width: 100% !important;
  margin: 0 !important;
}

/* 移除页面容器的边距 */
.vp-page > div {
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