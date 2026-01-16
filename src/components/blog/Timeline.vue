<template>
  <div class="timeline">
    <div 
      v-for="(item, index) in items" 
      :key="index" 
      class="timeline-item"
    >
      <div class="timeline-marker"></div>
      <div class="timeline-content">
        <div v-if="item.time" class="timeline-time">{{ item.time }}</div>
        <div class="timeline-text">{{ item.text }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface TimelineItem {
  time?: string
  text: string
}

interface Props {
  items: TimelineItem[]
}

defineProps<Props>()
</script>

<style scoped>
.timeline {
  position: relative;
  padding-left: 24px;
  margin: 20px 0;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 2px;
  background: var(--c-brand);
}

.timeline-item {
  position: relative;
  padding-bottom: 20px;
}

.timeline-item:last-child {
  padding-bottom: 0;
}

.timeline-marker {
  position: absolute;
  left: -28px;
  top: 4px;
  width: 10px;
  height: 10px;
  background: var(--c-brand);
  border-radius: 50%;
  border: 2px solid var(--c-bg);
}

.timeline-content {
  padding-left: 8px;
}

.timeline-time {
  font-size: 12px;
  color: var(--c-text-3);
  font-family: var(--font-family-mono);
  margin-bottom: 4px;
}

.timeline-text {
  font-size: 14px;
  line-height: 1.6;
  color: var(--c-text-1);
}
</style>
