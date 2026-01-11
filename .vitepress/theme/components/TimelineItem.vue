<template>
  <div class="timeline-item-simple">
    <span class="timeline-time">{{ time }}</span>
    <span class="timeline-separator">→</span>
    <span class="timeline-description">{{ description }}</span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  time: string
  description: string
}>()
</script>

<style scoped>
.timeline-item-simple {
  display: flex;
  align-items: baseline;
  gap: 12px;
  padding: 8px 0;
  border-left: 2px solid var(--vp-c-divider);
  padding-left: 16px;
  margin-left: 8px;
  position: relative;
}

.timeline-item-simple::before {
  content: '';
  position: absolute;
  left: -6px;
  top: 12px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--vp-c-brand);
  border: 2px solid var(--vp-c-bg);
}

.timeline-time {
  font-weight: 600;
  color: var(--vp-c-brand);
  font-size: 13px;
  font-family: var(--vp-font-family-mono);
  white-space: nowrap;
  flex-shrink: 0;
}

.timeline-separator {
  color: var(--vp-c-text-3);
  flex-shrink: 0;
}

.timeline-description {
  color: var(--vp-c-text-1);
  line-height: 1.6;
  flex: 1;
}

@media (max-width: 768px) {
  .timeline-item-simple {
    flex-direction: column;
    gap: 4px;
    padding-left: 20px;
  }
  
  .timeline-separator {
    display: none;
  }
}
</style>