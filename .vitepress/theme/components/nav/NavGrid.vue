<template>
  <div class="nav-grid">
    <div
      v-for="item in items"
      :key="item.name"
      class="nav-item"
      @click="handleClick(item.link)"
    >
      <div class="nav-header">
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
      </div>
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
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
  margin: 30px 0;
  padding: 0 20px;
  max-width: 100%;
}

.nav-item {
  display: flex;
  flex-direction: column;
  padding: 16px;
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  color: inherit;
}

.nav-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border-color: var(--vp-c-brand);
  background: var(--vp-c-bg);
}

.nav-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.nav-icon-wrapper {
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  overflow: hidden;
  transition: all 0.2s ease;
}

.nav-item:hover .nav-icon-wrapper {
  transform: scale(1.05);
  border-color: var(--vp-c-brand);
}

.nav-icon {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 8px;
  border-radius: 6px;
}

.nav-icon-text {
  font-size: 24px;
  line-height: 1;
}

.nav-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  line-height: 1.4;
  word-break: break-word;
  flex: 1;
  min-width: 0;
}

.nav-desc {
  font-size: 12px;
  color: var(--vp-c-text-2);
  line-height: 1.5;
  word-break: break-word;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 4px;
}

@media (max-width: 768px) {
  .nav-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 16px;
    padding: 0 12px;
  }
  
  .nav-item {
    padding: 14px;
  }
  
  .nav-header {
    gap: 10px;
    margin-bottom: 10px;
  }
  
  .nav-icon-wrapper {
    width: 44px;
    height: 44px;
  }
  
  .nav-icon-text {
    font-size: 20px;
  }
  
  .nav-name {
    font-size: 14px;
  }
  
  .nav-desc {
    font-size: 11px;
    -webkit-line-clamp: 2;
  }
}

@media (max-width: 480px) {
  .nav-grid {
    grid-template-columns: 1fr;
    gap: 12px;
    padding: 0 8px;
  }
  
  .nav-item {
    padding: 12px;
  }
  
  .nav-header {
    gap: 10px;
    margin-bottom: 8px;
  }
  
  .nav-icon-wrapper {
    width: 40px;
    height: 40px;
  }
  
  .nav-icon-text {
    font-size: 18px;
  }
  
  .nav-name {
    font-size: 14px;
  }
  
  .nav-desc {
    font-size: 12px;
    -webkit-line-clamp: 2;
  }
}
</style>
