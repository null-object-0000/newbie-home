<template>
  <Teleport to="body">
    <Transition name="viewer-fade">
      <div v-if="visible" class="image-viewer-overlay" @click="handleClose">
        <button class="viewer-close" @click.stop="handleClose">
          <X :size="24" />
        </button>
        <img 
          :src="imageSrc" 
          :alt="imageAlt || ''" 
          class="viewer-image"
          @click.stop
        />
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { X } from 'lucide-vue-next'

interface Props {
  modelValue: boolean
  imageSrc: string
  imageAlt?: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const visible = ref(props.modelValue)

watch(() => props.modelValue, (newVal) => {
  visible.value = newVal
  if (newVal) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}, { immediate: true })

const handleClose = () => {
  visible.value = false
  emit('update:modelValue', false)
}

// Handle keyboard navigation
if (typeof window !== 'undefined') {
  window.addEventListener('keydown', (e) => {
    if (!visible.value) return
    
    if (e.key === 'Escape') {
      handleClose()
    }
  })
}
</script>

<style scoped>
/* Viewer Overlay */
.image-viewer-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
}

.viewer-image {
  max-width: 90vw;
  max-height: 90vh;
  object-fit: contain;
}

.viewer-close {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  transition: background-color 0.2s;
}

.viewer-close:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

/* Transitions */
.viewer-fade-enter-active,
.viewer-fade-leave-active {
  transition: opacity 0.3s;
}

.viewer-fade-enter-from,
.viewer-fade-leave-to {
  opacity: 0;
}
</style>
