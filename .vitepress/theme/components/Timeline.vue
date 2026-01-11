<template>
  <div class="timeline-container">
    <div 
      v-for="(item, index) in items" 
      :key="index" 
      class="timeline-item"
    >
      <div class="timeline-marker"></div>
      <div class="timeline-content">
        <div class="timeline-time">{{ item.time }}</div>
        <div class="timeline-description">{{ item.description }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  items: Array<{
    time: string
    description: string
  }>
}>()
</script>

<style scoped>
.timeline-container {
  position: relative;
  padding: 20px 0;
  margin: 20px 0;
}

.timeline-item {
  position: relative;
  padding-left: 30px;
  padding-bottom: 20px;
}

.timeline-item:last-child {
  padding-bottom: 0;
}

.timeline-marker {
  position: absolute;
  left: 0;
  top: 6px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--vp-c-brand);
  border: 3px solid var(--vp-c-bg);
  box-shadow: 0 0 0 2px var(--vp-c-brand);
  z-index: 1;
}

.timeline-item:not(:last-child)::before {
  content: '';
  position: absolute;
  left: 5px;
  top: 18px;
  width: 2px;
  height: calc(100% - 6px);
  background: var(--vp-c-divider);
}

.timeline-content {
  padding-top: 2px;
}

.timeline-time {
  font-weight: 600;
  color: var(--vp-c-brand);
  font-size: 14px;
  margin-bottom: 4px;
  font-family: var(--vp-font-family-mono);
}

.timeline-description {
  color: var(--vp-c-text-1);
  line-height: 1.6;
}

@media (max-width: 768px) {
  .timeline-item {
    padding-left: 24px;
  }
  
  .timeline-marker {
    width: 10px;
    height: 10px;
  }
  
  .timeline-time {
    font-size: 13px;
  }
}
</style>