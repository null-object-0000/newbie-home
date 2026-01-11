<template>
  <div class="image-viewer" v-if="visible" @click="close">
    <div class="image-viewer-overlay"></div>
    <div class="image-viewer-content" @click.stop>
      <button class="image-viewer-close" @click="close" aria-label="关闭">×</button>
      <img :src="currentImage" :alt="alt" class="image-viewer-img" />
      <button 
        v-if="images.length > 1" 
        class="image-viewer-prev" 
        @click="prevImage"
        aria-label="上一张"
      >‹</button>
      <button 
        v-if="images.length > 1" 
        class="image-viewer-next" 
        @click="nextImage"
        aria-label="下一张"
      >›</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  images: string[]
  initialIndex?: number
  alt?: string
}>()

const emit = defineEmits<{
  close: []
}>()

const visible = ref(false)
const currentIndex = ref(0)
const currentImage = ref('')

const open = (index: number = 0) => {
  currentIndex.value = index
  currentImage.value = props.images[index]
  visible.value = true
  document.body.style.overflow = 'hidden'
}

const close = () => {
  visible.value = false
  document.body.style.overflow = ''
  emit('close')
}

const nextImage = () => {
  currentIndex.value = (currentIndex.value + 1) % props.images.length
  currentImage.value = props.images[currentIndex.value]
}

const prevImage = () => {
  currentIndex.value = (currentIndex.value - 1 + props.images.length) % props.images.length
  currentImage.value = props.images[currentIndex.value]
}

const handleKeydown = (e: KeyboardEvent) => {
  if (!visible.value) return
  if (e.key === 'Escape') {
    close()
  } else if (e.key === 'ArrowLeft') {
    prevImage()
  } else if (e.key === 'ArrowRight') {
    nextImage()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
  if (props.initialIndex !== undefined) {
    open(props.initialIndex)
  }
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})

defineExpose({ open, close })
</script>

<style scoped>
.image-viewer {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-viewer-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(4px);
}

.image-viewer-content {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-viewer-img {
  max-width: 100%;
  max-height: 90vh;
  object-fit: contain;
  border-radius: 4px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
}

.image-viewer-close {
  position: absolute;
  top: -40px;
  right: 0;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  font-size: 32px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
  line-height: 1;
}

.image-viewer-close:hover {
  background: rgba(255, 255, 255, 0.3);
}

.image-viewer-prev,
.image-viewer-next {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  font-size: 48px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
  line-height: 1;
}

.image-viewer-prev:hover,
.image-viewer-next:hover {
  background: rgba(255, 255, 255, 0.3);
}

.image-viewer-prev {
  left: -60px;
}

.image-viewer-next {
  right: -60px;
}

@media (max-width: 768px) {
  .image-viewer-prev {
    left: 10px;
  }
  
  .image-viewer-next {
    right: 10px;
  }
  
  .image-viewer-close {
    top: 10px;
    right: 10px;
  }
}
</style>