---
layout: page
title: 资源导航
sidebar: false
---

<script setup>
import { VPTeamPage, VPTeamPageTitle, VPTeamMembers } from 'vitepress/theme'
import navData from './nav-data.json'
import { useData } from 'vitepress'

const { site } = useData()
const base = site.value.base || '/'

// 处理图标路径，如果是本地路径则使用 avatar，否则使用 icon（内置图标）
const processedNavData = navData.map(category => ({
  ...category,
  links: category.links.map(link => {
    // 如果 icon 是路径（以 / 开头），说明是本地图标，使用 avatar
    // 否则是内置图标名称，使用 icon
    if (typeof link.icon === 'string' && link.icon.startsWith('/')) {
      // 确保 base 以 / 结尾，icon 以 / 开头
      const iconPath = base.endsWith('/') ? base + link.icon.substring(1) : base + link.icon;
      return {
        ...link,
        avatar: iconPath
      };
    }
    return link;
  })
}));
</script>

<VPTeamPage>
  <VPTeamPageTitle>
    <template #title>Newbie 的藏宝阁</template>
    <template #lead>收集灵感，记录成长</template>
  </VPTeamPageTitle>
  <div v-for="category in processedNavData" :key="category.name">
    <h2 style="text-align:center; margin: 40px 0 20px;">{{ category.name }}</h2>
    <VPTeamMembers :members="category.links" />
  </div>
</VPTeamPage>