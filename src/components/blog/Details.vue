<template>
  <div class="details-wrapper">
    <button 
      class="details-summary" 
      @click="toggle"
      :aria-expanded="isOpen"
    >
      <span class="details-icon" :class="{ 'is-open': isOpen }">
        <ChevronDown :size="20" />
      </span>
      <span class="details-title">{{ title }}</span>
    </button>
    <Transition name="details-content">
      <div v-show="isOpen" class="details-content">
        <div class="details-inner" v-html="content"></div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ChevronDown } from 'lucide-vue-next'

interface Props {
  title: string
  content: string
}

const props = defineProps<Props>()
const isOpen = ref(false)

const toggle = () => {
  isOpen.value = !isOpen.value
}
</script>

<style scoped>
.details-wrapper {
  margin: 20px 0;
  border: 1px solid var(--c-divider);
  border-radius: var(--radius);
  overflow: hidden;
  background: var(--c-bg-soft);
}

.details-summary {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: transparent;
  border: none;
  cursor: pointer;
  text-align: left;
  font-size: 14px;
  font-weight: 500;
  color: var(--c-text-1);
  transition: background-color 0.2s;
}

.details-summary:hover {
  background: var(--c-bg-mute);
}

.details-icon {
  display: flex;
  align-items: center;
  transition: transform 0.3s;
  flex-shrink: 0;
}

.details-icon.is-open {
  transform: rotate(180deg);
}

.details-title {
  flex: 1;
}

.details-content {
  overflow: hidden;
}

.details-inner {
  padding: 16px;
  padding-top: 0;
  color: var(--c-text-2);
  font-size: 14px;
  line-height: 1.6;
}

.details-inner :deep(pre) {
  margin: 0 0 12px 0;
  padding: 12px;
  background: var(--c-bg);
  border-radius: var(--radius);
  overflow-x: auto;
}

.details-inner :deep(pre:last-child) {
  margin-bottom: 0;
}

.details-inner :deep(code) {
  font-family: var(--font-family-mono);
  font-size: 0.875em;
}

.details-inner :deep(p) {
  margin: 0 0 12px 0;
}

.details-inner :deep(p:last-child) {
  margin-bottom: 0;
}

.details-inner :deep(ul),
.details-inner :deep(ol) {
  margin: 0 0 12px 0;
  padding-left: 2em;
}

.details-inner :deep(ul:last-child),
.details-inner :deep(ol:last-child) {
  margin-bottom: 0;
}

/* Transitions */
.details-content-enter-active,
.details-content-leave-active {
  transition: max-height 0.3s ease, opacity 0.3s ease;
  overflow: hidden;
}

.details-content-enter-from,
.details-content-leave-to {
  max-height: 0;
  opacity: 0;
}

.details-content-enter-to,
.details-content-leave-from {
  max-height: 1000px;
  opacity: 1;
}
</style>
