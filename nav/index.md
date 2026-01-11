---
layout: page
title: 资源导航
sidebar: false
---

<script setup>
import { VPTeamPage, VPTeamPageTitle, VPTeamMembers } from 'vitepress/theme'

// 这里是你的数据源，以后就在这里加链接
const navData = [
  {
    name: '常用工具',
    title: 'Daily Tools',
    links: [
      { icon: 'github', link: 'https://github.com', desc: '代码托管' },
      { icon: 'twitter', link: 'https://twitter.com', desc: '摸鱼' },
      { icon: 'youtube', link: 'https://youtube.com', desc: '学习' }
    ]
  },
  {
    name: '学习资源',
    title: 'Learning',
    links: [
      { icon: 'book', link: 'https://vitepress.dev', desc: 'VitePress文档' },
      { icon: 'code', link: 'https://developer.mozilla.org', desc: 'MDN Web Docs' }
    ]
  }
]
</script>

<VPTeamPage>
  <VPTeamPageTitle>
    <template #title>Newbie 的藏宝阁</template>
    <template #lead>收集灵感，记录成长</template>
  </VPTeamPageTitle>
  <div v-for="category in navData" :key="category.name">
    <h2 style="text-align:center; margin: 40px 0 20px;">{{ category.name }}</h2>
    <VPTeamMembers :members="category.links" />
  </div>
</VPTeamPage>