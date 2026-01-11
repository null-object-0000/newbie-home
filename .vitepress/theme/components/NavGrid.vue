<template>
  <div class="nav-grid">
    <div
      v-for="item in items"
      :key="item.name"
      class="nav-item"
      @click="handleClick(item.link)"
    >
      <div class="nav-icon-wrapper">
        <img
          v-if="item.avatar"
          :src="item.avatar"
          :alt="item.name"
          class="nav-icon"
          loading="lazy"
        />
        <span
          v-else-if="item.icon"
          class="nav-icon-text"
        >{{ getIconText(item.icon) }}</span>
        <span
          v-else
          class="nav-icon-text"
        >🔗</span>
      </div>
      <div class="nav-name">{{ item.name }}</div>
      <div v-if="item.desc" class="nav-desc">{{ item.desc }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  items: Array<{
    name: string
    avatar?: string
    icon?: string
    link?: string
    desc?: string
  }>
}>()

const handleClick = (link?: string) => {
  if (!link) return
  
  if (link.startsWith('http://') || link.startsWith('https://')) {
    window.open(link, '_blank', 'noopener,noreferrer')
  } else {
    window.location.href = link
  }
}

const getIconText = (icon?: string) => {
  if (!icon) return '🔗'
  // 如果是内置图标名称，返回一个简单的表示
  const iconMap: Record<string, string> = {
    json: '{}',
    github: '🐙',
    twitter: '🐦',
    link: '🔗'
  }
  return iconMap[icon] || '🔗'
}
</script>

<style scoped>
.nav-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 24px;
  margin: 30px 0;
  padding: 0 20px;
  max-width: 100%;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 20px 16px;
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  color: inherit;
  min-height: 180px;
}

.nav-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border-color: var(--vp-c-brand);
  background: var(--vp-c-bg);
}

.nav-icon-wrapper {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  border-radius: 12px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  overflow: hidden;
  transition: all 0.2s ease;
}

.nav-item:hover .nav-icon-wrapper {
  transform: scale(1.1);
  border-color: var(--vp-c-brand);
}

.nav-icon {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 12px;
  border-radius: 8px;
}

.nav-icon-text {
  font-size: 32px;
  line-height: 1;
}

.nav-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  text-align: center;
  line-height: 1.4;
  word-break: break-word;
  max-width: 100%;
  margin-bottom: 8px;
}

.nav-desc {
  font-size: 12px;
  color: var(--vp-c-text-2);
  text-align: center;
  line-height: 1.5;
  word-break: break-word;
  max-width: 100%;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
}

@media (max-width: 768px) {
  .nav-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 16px;
    padding: 0 12px;
  }
  
  .nav-item {
    padding: 16px 12px;
    min-height: 160px;
  }
  
  .nav-icon-wrapper {
    width: 56px;
    height: 56px;
    margin-bottom: 10px;
  }
  
  .nav-icon-text {
    font-size: 28px;
  }
  
  .nav-name {
    font-size: 13px;
  }
  
  .nav-desc {
    font-size: 11px;
    -webkit-line-clamp: 2;
  }
}

@media (max-width: 480px) {
  .nav-grid {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 12px;
    padding: 0 8px;
  }
  
  .nav-item {
    padding: 12px 8px;
    min-height: 140px;
  }
  
  .nav-icon-wrapper {
    width: 48px;
    height: 48px;
    margin-bottom: 8px;
  }
  
  .nav-icon-text {
    font-size: 24px;
  }
  
  .nav-name {
    font-size: 12px;
  }
  
  .nav-desc {
    font-size: 10px;
    -webkit-line-clamp: 2;
  }
}
</style>
