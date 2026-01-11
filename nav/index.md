---
layout: page
title: 资源导航
sidebar: false
---

<script setup>
import { VPTeamPage, VPTeamPageTitle } from 'vitepress/theme'
import navData from './nav-data.json'
import { useData } from 'vitepress'

const { site } = useData()
const base = site.value.base || '/'

// 处理图标路径
const processedNavData = navData.map(category => ({
  ...category,
  links: category.links.map(link => ({
    name: link.name,
    link: link.link,
    desc: link.desc || '',
    // 如果 icon 是路径（以 / 开头），说明是本地图标，使用 avatar
    // 否则是内置图标名称，使用 icon
    ...(typeof link.icon === 'string' && link.icon.startsWith('/')
      ? {
          avatar: base.endsWith('/') ? base + link.icon.substring(1) : base + link.icon
        }
      : {
          icon: link.icon
        })
  }))
}));
</script>

<VPTeamPage>
  <VPTeamPageTitle>
    <template #title>Newbie 的藏宝阁</template>
    <template #lead>收集灵感，记录成长</template>
  </VPTeamPageTitle>
  <div v-for="category in processedNavData" :key="category.name" class="nav-category">
    <h2 class="nav-category-title">{{ category.name }}</h2>
    <NavGrid :items="category.links" />
  </div>
</VPTeamPage>

<style scoped>
.nav-category {
  margin-bottom: 60px;
}

.nav-category:last-child {
  margin-bottom: 0;
}

.nav-category-title {
  text-align: center;
  margin: 40px 0 30px;
  font-size: 24px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}
</style>