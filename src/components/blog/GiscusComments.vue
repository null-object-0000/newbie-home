<template>
  <div class="giscus-comments">
    <Giscus
      :repo="repo"
      :repo-id="repoId"
      :category="category"
      :category-id="categoryId"
      :mapping="mapping"
      :strict="strict"
      :reactions-enabled="reactionsEnabled"
      :emit-metadata="emitMetadata"
      :input-position="inputPosition"
      :theme="giscusTheme"
      :lang="lang"
      :loading="loading"
      :term="discussionTerm"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Giscus from '@giscus/vue'
import { useTheme } from '@/composables/useTheme'

const { isDark } = useTheme()
const route = useRoute()

// Giscus 配置
const repo = 'null-object-0000/newbie-space'
const repoId = 'R_kgDOQ3kQBA'
const category = 'Announcements'
const categoryId = 'DIC_kwDOQ3kQBM4C1Ir_'

// 映射配置
// 使用 'specific' 映射模式 + term 参数，这样可以自定义映射的路径
// 避免受 base path（如 /newbie-space/）的影响
const mapping = 'specific'
const strict = '0'
const reactionsEnabled = '1'
const emitMetadata = '0'
const inputPosition = 'top'
const lang = 'zh-CN'
const loading = 'lazy'

// 生成讨论的 term（去除 base path）
// 自动检测并去除 base path，确保本地和部署环境的评论一致
const discussionTerm = computed(() => {
  const fullPath = route.path
  
  // 获取 Vite 的 base 配置（如 /newbie-space/）
  const base = import.meta.env.BASE_URL || '/'
  
  // 如果 base 不是根路径，则去除它
  if (base !== '/' && fullPath.startsWith(base)) {
    return fullPath.slice(base.length - 1) // 保留开头的 /
  }
  
  return fullPath
})

// 根据当前主题自动切换 Giscus 主题
const giscusTheme = computed(() => {
  return isDark.value ? 'dark' : 'light'
})
</script>

<style scoped>
.giscus-comments {
  margin-top: 4rem;
  padding-top: 3rem;
  border-top: 1px solid var(--border-color, #e5e7eb);
}
</style>
