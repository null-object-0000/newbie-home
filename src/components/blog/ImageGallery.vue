<template>
  <div class="image-gallery" :class="galleryClass">
    <div 
      v-for="(image, index) in images" 
      :key="index" 
      class="gallery-item"
      @click="openViewer(index)"
    >
      <img :src="image.src" :alt="image.alt || ''" loading="lazy" />
    </div>
    
    <!-- Image Viewer Modal -->
    <Teleport to="body">
      <Transition name="viewer-fade">
        <div v-if="viewerOpen" class="image-viewer-overlay" @click="closeViewer">
          <button class="viewer-close" @click.stop="closeViewer">
            <X :size="24" />
          </button>
          <button v-if="images.length > 1" class="viewer-nav viewer-prev" @click.stop="prevImage">
            <ChevronLeft :size="32" />
          </button>
          <img 
            :src="images[currentIndex]?.src" 
            :alt="images[currentIndex]?.alt || ''" 
            class="viewer-image"
            @click.stop
          />
          <button v-if="images.length > 1" class="viewer-nav viewer-next" @click.stop="nextImage">
            <ChevronRight :size="32" />
          </button>
          <div class="viewer-counter">{{ currentIndex + 1 }} / {{ images.length }}</div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { X, ChevronLeft, ChevronRight } from 'lucide-vue-next'

interface ImageItem {
  src: string
  alt?: string
}

interface Props {
  images: ImageItem[]
}

const props = defineProps<Props>()

const viewerOpen = ref(false)
const currentIndex = ref(0)

// 根据图片数量计算布局类名
const galleryClass = computed(() => {
  const count = props.images.length
  if (count === 1) return 'gallery-count-1'
  if (count === 2) return 'gallery-count-2'
  if (count === 3) return 'gallery-count-3'
  if (count === 4) return 'gallery-count-4'
  return 'gallery-count-many'
})

const openViewer = (index: number) => {
  currentIndex.value = index
  viewerOpen.value = true
  document.body.style.overflow = 'hidden'
}

const closeViewer = () => {
  viewerOpen.value = false
  document.body.style.overflow = ''
}

const prevImage = () => {
  currentIndex.value = (currentIndex.value - 1 + props.images.length) % props.images.length
}

const nextImage = () => {
  currentIndex.value = (currentIndex.value + 1) % props.images.length
}

// Handle keyboard navigation
if (typeof window !== 'undefined') {
  window.addEventListener('keydown', (e) => {
    if (!viewerOpen.value) return
    
    if (e.key === 'Escape') {
      closeViewer()
    } else if (e.key === 'ArrowLeft') {
      prevImage()
    } else if (e.key === 'ArrowRight') {
      nextImage()
    }
  })
}
</script>

<style scoped>
.image-gallery {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
  margin: 20px 0;
}

.gallery-item {
  cursor: pointer;
  border-radius: var(--radius);
  overflow: hidden;
  transition: transform 0.3s;
  flex-shrink: 0;
}

.gallery-item:hover {
  transform: scale(1.02);
}

.gallery-item img {
  max-height: 300px;
  width: auto;
  display: block;
}

/* 根据图片数量自动调整布局 */
.gallery-count-1 .gallery-item {
  width: 100%;
}

.gallery-count-2 .gallery-item {
  width: calc(50% - 5px);
}

.gallery-count-3 .gallery-item {
  width: calc(33.333% - 7px);
}

.gallery-count-4 .gallery-item {
  width: calc(50% - 5px);
}

.gallery-count-many .gallery-item {
  width: calc(33.333% - 7px);
}

/* 响应式：移动端单列布局 */
@media (max-width: 768px) {
  .gallery-item {
    width: 100% !important;
  }
}

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

.viewer-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 56px;
  height: 56px;
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

.viewer-nav:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.viewer-prev {
  left: 20px;
}

.viewer-next {
  right: 20px;
}

.viewer-counter {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  font-size: 14px;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 8px 16px;
  border-radius: 20px;
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
