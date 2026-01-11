<template>
  <div class="image-gallery" :class="`gallery-${images.length}`">
    <img
      v-for="(image, index) in images"
      :key="index"
      :src="image.src"
      :alt="image.alt || ''"
      class="gallery-image"
      @click="openViewer(index)"
    />
    <ImageViewer
      ref="viewerRef"
      :images="imageSrcs"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ImageViewer from './ImageViewer.vue'

const props = defineProps<{
  images: Array<{ src: string; alt?: string }>
}>()

const viewerRef = ref<InstanceType<typeof ImageViewer> | null>(null)

const openViewer = (index: number) => {
  viewerRef.value?.open(index)
}

const imageSrcs = computed(() => props.images.map(img => img.src))
</script>

<style scoped>
.image-gallery {
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
  margin: 20px 0;
}

.gallery-image {
  max-width: 32%;
  height: auto;
  border-radius: 4px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.gallery-image:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

/* 单张图片 */
.gallery-1 .gallery-image {
  max-width: 100%;
}

/* 两张图片 */
.gallery-2 .gallery-image {
  max-width: 48%;
}

/* 三张图片 */
.gallery-3 .gallery-image {
  max-width: 32%;
}

/* 四张图片 */
.gallery-4 .gallery-image {
  max-width: 48%;
}

/* 五张及以上 */
.gallery-5 .gallery-image,
.gallery-6 .gallery-image {
  max-width: 32%;
}

@media (max-width: 768px) {
  .gallery-image {
    max-width: 100% !important;
  }
}
</style>