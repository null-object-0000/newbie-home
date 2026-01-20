<template>
  <div class="markdown-body" ref="markdownRef" v-html="renderedHtml"></div>
  <!-- 图片预览器 -->
  <ImageViewer 
    v-model="viewerVisible"
    :image-src="viewerImageSrc"
    :image-alt="viewerImageAlt"
  />
  <!-- 注脚 Tooltip -->
  <Teleport to="body">
    <Transition name="tooltip-fade">
      <div
        v-if="tooltipVisible && tooltipContent"
        ref="tooltipElement"
        class="footnote-tooltip"
        :style="{ 
          left: `${tooltipPosition.x}px`, 
          top: `${tooltipPosition.y}px`,
          transform: 'translateX(-50%)'
        }"
      >
        <div class="tooltip-content">{{ tooltipContent }}</div>
        <div class="tooltip-arrow"></div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, nextTick, watch, onBeforeUnmount } from 'vue'
import { useMarkdown } from '@/composables/useMarkdown'
import { useTheme } from '@/composables/useTheme'
import { getAssetPath } from '@/utils/path'
import ImageGallery from './ImageGallery.vue'
import ImageViewer from './ImageViewer.vue'
import Details from './Details.vue'
import { createApp, h } from 'vue'
// 引入 highlight.js 样式
// 暗色主题使用 github-dark
import 'highlight.js/styles/github-dark.css'

interface Props {
  content: string
}

const props = defineProps<Props>()

const { parseMarkdown } = useMarkdown()
const { isDark } = useTheme()
const markdownRef = ref<HTMLElement | null>(null)
const galleryApps = ref<Array<{ app: any; container: HTMLElement }>>([])
const detailsApps = ref<Array<{ app: any; container: HTMLElement }>>([])

// 图片预览状态
const viewerVisible = ref(false)
const viewerImageSrc = ref('')
const viewerImageAlt = ref('')

// 存储已添加事件监听器的图片元素，避免重复添加
const imageClickHandlers = new WeakMap<HTMLElement, (e: Event) => void>()

// 存储已添加事件监听器的注脚链接元素，避免重复添加
const footnoteClickHandlers = new WeakMap<HTMLElement, (e: Event) => void>()
const footnoteHoverHandlers = new WeakMap<HTMLElement, { mouseenter: (e: Event) => void; mouseleave: (e: Event) => void }>()

// Tooltip 相关状态
const tooltipVisible = ref(false)
const tooltipContent = ref('')
const tooltipPosition = ref({ x: 0, y: 0 })
const tooltipElement = ref<HTMLElement | null>(null)

const renderedHtml = computed(() => {
  const { html } = parseMarkdown(props.content)
  return html
})

// 处理图片画廊
const processImageGalleries = async () => {
  await nextTick()
  if (!markdownRef.value) return

  // 清理之前的应用实例
  galleryApps.value.forEach(({ app, container }) => {
    app.unmount()
    container.remove()
  })
  galleryApps.value = []

  const galleries = markdownRef.value.querySelectorAll('.image-gallery-wrapper')
  
  galleries.forEach((gallery) => {
    const images: Array<{ src: string; alt: string }> = []
    const imgElements = gallery.querySelectorAll('img')
    
    imgElements.forEach((img) => {
      // 图片路径已被 fixImagePaths() 处理过，直接使用即可
      const src = img.getAttribute('src') || ''
      images.push({
        src: src,
        alt: img.getAttribute('alt') || ''
      })
    })
    
    if (images.length > 0) {
      // 创建容器
      const container = document.createElement('div')
      container.className = 'image-gallery-container'
      
      // 创建 Vue 应用实例来渲染 ImageGallery 组件
      const app = createApp({
        render: () => h(ImageGallery, { images })
      })
      
      // 挂载到容器
      app.mount(container)
      
      // 替换原始画廊
      gallery.parentNode?.replaceChild(container, gallery)
      
      // 保存应用实例以便后续清理
      galleryApps.value.push({ app, container })
    }
  })
}

// 处理折叠详情块
const processDetails = async () => {
  await nextTick()
  if (!markdownRef.value) return

  // 清理之前的应用实例
  detailsApps.value.forEach(({ app, container }) => {
    app.unmount()
    container.remove()
  })
  detailsApps.value = []

  const detailsWrappers = markdownRef.value.querySelectorAll('.details-wrapper')
  
  detailsWrappers.forEach((wrapper) => {
    const title = wrapper.getAttribute('data-title') || '详情'
    const content = wrapper.innerHTML
    
    // 创建容器
    const container = document.createElement('div')
    container.className = 'details-container'
    
    // 创建 Vue 应用实例来渲染 Details 组件
    const app = createApp({
      render: () => h(Details, { title, content })
    })
    
    // 挂载到容器
    app.mount(container)
    
    // 替换原始 wrapper
    wrapper.parentNode?.replaceChild(container, wrapper)
    
    // 保存应用实例以便后续清理
    detailsApps.value.push({ app, container })
  })
}

// 移除第一个 h1 标题（通常是文章标题，与页面标题重复）
const removeFirstH1 = () => {
  if (!markdownRef.value) return
  
  const firstH1 = markdownRef.value.querySelector('h1')
  if (firstH1) {
    firstH1.remove()
  }
}

// 为标题添加 id
const addHeadingIds = () => {
  if (!markdownRef.value) return
  
  const headings = markdownRef.value.querySelectorAll('h1, h2, h3, h4, h5, h6')
  headings.forEach((heading) => {
    if (!heading.id) {
      const text = heading.textContent || ''
      const id = text.toLowerCase()
        .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
        .replace(/^-+|-+$/g, '')
      heading.id = id
    }
  })
}

// 为所有图片添加点击预览功能
const addImageClickHandlers = () => {
  if (!markdownRef.value) return
  
  // 获取所有图片，但排除画廊中的图片（画廊已经有自己的预览功能）
  const allImages = markdownRef.value.querySelectorAll('img')
  
  allImages.forEach((img) => {
    const imgElement = img as HTMLElement
    
    // 检查图片是否在画廊中
    const isInGallery = img.closest('.image-gallery-container') !== null
    
    if (!isInGallery) {
      // 如果已经添加过监听器，先移除
      const existingHandler = imageClickHandlers.get(imgElement)
      if (existingHandler) {
        imgElement.removeEventListener('click', existingHandler)
      }
      
      // 创建新的点击处理函数
      const clickHandler = (e: Event) => {
        e.preventDefault()
        e.stopPropagation()
        // 图片路径已被 fixImagePaths() 处理过，直接使用即可
        const src = img.getAttribute('src') || ''
        const alt = img.getAttribute('alt') || ''
        if (src) {
          viewerImageSrc.value = src
          viewerImageAlt.value = alt
          viewerVisible.value = true
        }
      }
      
      // 添加点击事件和样式
      imgElement.style.cursor = 'pointer'
      imgElement.addEventListener('click', clickHandler)
      imageClickHandlers.set(imgElement, clickHandler)
    }
  })
}

// 获取注脚内容
const getFootnoteContent = (id: string): string => {
  // 注脚 ID 格式可能是 fn:1 或 fnref:1，需要转换为 fn:1
  let footnoteId = id
  if (id.startsWith('fnref:')) {
    footnoteId = id.replace('fnref:', 'fn:')
  }
  
  const footnoteElement = document.getElementById(footnoteId)
  if (footnoteElement) {
    // 克隆元素以移除返回链接
    const clone = footnoteElement.cloneNode(true) as HTMLElement
    const backref = clone.querySelector('a.footnote-backref')
    if (backref) {
      backref.remove()
    }
    return clone.textContent?.trim() || ''
  }
  return ''
}

// 显示 tooltip
const showTooltip = (content: string, element: HTMLElement) => {
  if (!content) return
  
  tooltipContent.value = content
  tooltipVisible.value = true
  
  // 计算 tooltip 位置（初始位置，会在 nextTick 中调整）
  const rect = element.getBoundingClientRect()
  tooltipPosition.value = {
    x: rect.left + rect.width / 2,
    y: rect.top - 10
  }
  
  // 等待 DOM 更新后调整位置
  nextTick(() => {
    if (tooltipElement.value) {
      const tooltipRect = tooltipElement.value.getBoundingClientRect()
      // 由于使用了 translateX(-50%)，left 应该是中心点位置
      let x = rect.left + rect.width / 2
      let y = rect.top - tooltipRect.height - 12
      
      // 确保 tooltip 不超出视口
      const padding = 10
      const maxX = window.innerWidth - padding
      const minX = padding
      
      // 如果 tooltip 会超出右边界，调整 x
      if (x + tooltipRect.width / 2 > maxX) {
        x = maxX - tooltipRect.width / 2
      }
      // 如果 tooltip 会超出左边界，调整 x
      if (x - tooltipRect.width / 2 < minX) {
        x = minX + tooltipRect.width / 2
      }
      
      // 如果上方空间不足，显示在下方
      if (y < padding) {
        y = rect.bottom + 12
      }
      
      tooltipPosition.value = { x, y }
    }
  })
}

// 隐藏 tooltip
const hideTooltip = () => {
  tooltipVisible.value = false
  tooltipContent.value = ''
}

// 为注脚链接添加点击处理和悬浮提示
const addFootnoteClickHandlers = () => {
  if (!markdownRef.value) return
  
  // 获取所有注脚相关的链接
  const footnoteRefs = markdownRef.value.querySelectorAll('a.footnote-ref, sup.footnote-ref a')
  const footnoteBackrefs = markdownRef.value.querySelectorAll('a.footnote-backref')
  
  // 处理注脚引用链接（从正文跳转到注脚）
  footnoteRefs.forEach((link) => {
    const linkElement = link as HTMLElement
    const existingClickHandler = footnoteClickHandlers.get(linkElement)
    if (existingClickHandler) {
      linkElement.removeEventListener('click', existingClickHandler)
    }
    
    const existingHoverHandlers = footnoteHoverHandlers.get(linkElement)
    if (existingHoverHandlers) {
      linkElement.removeEventListener('mouseenter', existingHoverHandlers.mouseenter)
      linkElement.removeEventListener('mouseleave', existingHoverHandlers.mouseleave)
    }
    
    const clickHandler = (e: Event) => {
      e.preventDefault()
      const href = (link as HTMLAnchorElement).getAttribute('href')
      if (href && href.startsWith('#')) {
        const targetId = href.slice(1)
        scrollToElement(targetId)
        hideTooltip()
      }
    }
    
    const mouseenterHandler = (e: Event) => {
      const href = (link as HTMLAnchorElement).getAttribute('href')
      if (href && href.startsWith('#')) {
        const targetId = href.slice(1)
        const content = getFootnoteContent(targetId)
        if (content) {
          showTooltip(content, linkElement)
        }
      }
    }
    
    const mouseleaveHandler = () => {
      hideTooltip()
    }
    
    linkElement.addEventListener('click', clickHandler)
    linkElement.addEventListener('mouseenter', mouseenterHandler)
    linkElement.addEventListener('mouseleave', mouseleaveHandler)
    
    footnoteClickHandlers.set(linkElement, clickHandler)
    footnoteHoverHandlers.set(linkElement, { mouseenter: mouseenterHandler, mouseleave: mouseleaveHandler })
  })
  
  // 处理注脚返回链接（从注脚跳转回正文，不需要 tooltip）
  footnoteBackrefs.forEach((link) => {
    const linkElement = link as HTMLElement
    const existingHandler = footnoteClickHandlers.get(linkElement)
    if (existingHandler) {
      linkElement.removeEventListener('click', existingHandler)
    }
    
    const clickHandler = (e: Event) => {
      e.preventDefault()
      const href = (link as HTMLAnchorElement).getAttribute('href')
      if (href && href.startsWith('#')) {
        const targetId = href.slice(1)
        scrollToElement(targetId)
      }
    }
    
    linkElement.addEventListener('click', clickHandler)
    footnoteClickHandlers.set(linkElement, clickHandler)
  })
}

// 滚动到指定元素（考虑导航栏高度）
const scrollToElement = (id: string) => {
  const element = document.getElementById(id) || document.querySelector(`[id="${id}"]`)
  if (element) {
    // 获取导航栏高度（4rem = 64px）
    const headerHeight = 64
    const offset = 20 // 额外间距
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
    const offsetPosition = elementPosition - headerHeight - offset
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    })
  }
}

// 修复图片路径（移除 /public/ 前缀，并适配不同部署环境）
const fixImagePaths = () => {
  if (!markdownRef.value) return
  
  const images = markdownRef.value.querySelectorAll('img[src]')
  images.forEach((img) => {
    const src = img.getAttribute('src')
    if (src) {
      let normalizedSrc = src
      // 移除 /public/ 前缀
      if (normalizedSrc.startsWith('/public/')) {
        normalizedSrc = normalizedSrc.replace(/^\/public/, '')
      }
      // 使用 getAssetPath 处理路径，自动适配不同部署环境
      if (normalizedSrc.startsWith('/')) {
        img.setAttribute('src', getAssetPath(normalizedSrc))
      }
    }
  })
}

// 处理所有自定义组件
const processCustomComponents = async () => {
  await nextTick()
  removeFirstH1()
  addHeadingIds()
  fixImagePaths() // 修复图片路径
  await processImageGalleries()
  await processDetails()
  addImageClickHandlers()
  addFootnoteClickHandlers()
}

// 处理 hash 跳转的函数
const handleHashChange = () => {
  const hash = window.location.hash
  if (hash) {
    setTimeout(() => {
      scrollToElement(hash.slice(1))
    }, 100)
  }
}

onMounted(() => {
  processCustomComponents()
  
  // 处理页面加载时的 hash 跳转（包括注脚链接）
  if (typeof window !== 'undefined') {
    const hash = window.location.hash
    if (hash) {
      setTimeout(() => {
        scrollToElement(hash.slice(1))
      }, 300)
    }
    
    // 监听 hash 变化（用户点击浏览器前进/后退按钮）
    window.addEventListener('hashchange', handleHashChange)
  }
})

watch(() => props.content, () => {
  processCustomComponents()
})

onBeforeUnmount(() => {
  // 清理所有应用实例
  galleryApps.value.forEach(({ app }) => {
    app.unmount()
  })
  galleryApps.value = []
  
  detailsApps.value.forEach(({ app }) => {
    app.unmount()
  })
  detailsApps.value = []
  
  // 清理注脚链接事件监听器
  if (typeof window !== 'undefined') {
    window.removeEventListener('hashchange', handleHashChange)
  }
})
</script>

<style>
/* VitePress 默认主题样式 */
.markdown-body {
  font-size: 16px;
  line-height: 1.6;
  color: var(--c-text-1);
  max-width: none;
}

/* 标题样式 */
.markdown-body h1,
.markdown-body h2,
.markdown-body h3,
.markdown-body h4,
.markdown-body h5,
.markdown-body h6 {
  margin-top: 24px;
  margin-bottom: 16px;
  font-weight: 600;
  line-height: 1.25;
  color: var(--c-text-1);
}

.markdown-body h1 {
  font-size: 2em;
  padding-bottom: 0.3em;
  border-bottom: 1px solid var(--c-divider);
}

.markdown-body h2 {
  font-size: 1.5em;
  padding-bottom: 0.3em;
  border-bottom: 1px solid var(--c-divider);
}

.markdown-body h3 {
  font-size: 1.25em;
}

.markdown-body h4 {
  font-size: 1em;
}

.markdown-body h5 {
  font-size: 0.875em;
}

.markdown-body h6 {
  font-size: 0.85em;
  color: var(--c-text-2);
}

/* 段落 */
.markdown-body p {
  margin-top: 0;
  margin-bottom: 16px;
  line-height: 1.6;
}

/* 链接 */
.markdown-body a {
  color: var(--c-brand);
  text-decoration: none;
  transition: color var(--transition-fast);
}

.markdown-body a:hover {
  color: var(--c-brand-light);
  text-decoration: underline;
}

/* 图片 */
.markdown-body img {
  max-width: 100%;
  border-radius: var(--radius);
  margin: 16px 0;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.2s;
}

.markdown-body img:hover {
  opacity: 0.9;
  transform: scale(1.01);
}

/* 画廊中的图片不需要额外的点击效果，因为画廊组件已经处理了 */
.markdown-body .image-gallery-container img {
  cursor: default;
}

.markdown-body .image-gallery-container img:hover {
  opacity: 1;
  transform: none;
}

/* 列表 */
.markdown-body ul,
.markdown-body ol {
  padding-left: 2em;
  margin-top: 0;
  margin-bottom: 16px;
}

.markdown-body li {
  margin-bottom: 4px;
  line-height: 1.6;
}

.markdown-body li > p {
  margin-top: 16px;
}

.markdown-body li + li {
  margin-top: 0.25em;
}

/* 引用 */
.markdown-body blockquote {
  margin: 16px 0;
  padding: 0 1em;
  color: var(--c-text-2);
  border-left: 0.25em solid var(--c-divider);
}

.markdown-body blockquote > :first-child {
  margin-top: 0;
}

.markdown-body blockquote > :last-child {
  margin-bottom: 0;
}

/* 代码 */
.markdown-body code {
  font-family: var(--font-family-mono);
  font-size: 0.875em;
  background: var(--c-bg-soft);
  padding: 0.2em 0.4em;
  border-radius: 4px;
  color: var(--c-text-1);
}

/* 代码块 */
.markdown-body pre {
  background: var(--c-bg-soft);
  border-radius: var(--radius);
  padding: 16px;
  overflow-x: auto;
  margin-bottom: 16px;
  font-family: var(--font-family-mono);
  font-size: 0.875rem;
  line-height: 1.7;
}

.markdown-body pre code {
  background: transparent;
  padding: 0;
  color: inherit;
  font-size: inherit;
}

/* highlight.js 样式覆盖 */
.markdown-body pre.hljs {
  padding: 16px;
  border-radius: var(--radius);
  overflow-x: auto;
  margin-bottom: 16px;
  background: #f6f8fa !important;
}

.markdown-body pre.hljs code {
  background: transparent;
  padding: 0;
  display: block;
  overflow-x: auto;
}

/* 确保代码块中的代码样式正确 */
.markdown-body pre.hljs code.hljs {
  display: block;
  overflow-x: auto;
  padding: 0;
  background: transparent;
  font-size: 0.875rem;
  line-height: 1.7;
}

/* 浅色主题下的代码高亮增强对比度 */
.markdown-body:not(.dark) pre.hljs {
  background: #f6f8fa !important;
  border: 1px solid #e1e4e8;
}

.markdown-body:not(.dark) pre.hljs code {
  color: #24292e;
}

/* 增强浅色主题下的语法高亮颜色 - 使用 !important 确保覆盖默认样式 */
.markdown-body:not(.dark) pre.hljs .hljs-keyword,
.markdown-body:not(.dark) pre.hljs .hljs-selector-tag,
.markdown-body:not(.dark) pre.hljs .hljs-literal,
.markdown-body:not(.dark) pre.hljs .hljs-title,
.markdown-body:not(.dark) pre.hljs .hljs-section,
.markdown-body:not(.dark) pre.hljs .hljs-doctag,
.markdown-body:not(.dark) pre.hljs .hljs-type,
.markdown-body:not(.dark) pre.hljs .hljs-name,
.markdown-body:not(.dark) pre.hljs .hljs-strong {
  color: #d73a49 !important;
  font-weight: 600;
}

.markdown-body:not(.dark) pre.hljs .hljs-string,
.markdown-body:not(.dark) pre.hljs .hljs-attr,
.markdown-body:not(.dark) pre.hljs .hljs-attribute {
  color: #032f62 !important;
  font-weight: 500;
}

.markdown-body:not(.dark) pre.hljs .hljs-number,
.markdown-body:not(.dark) pre.hljs .hljs-symbol,
.markdown-body:not(.dark) pre.hljs .hljs-bullet {
  color: #005cc5 !important;
  font-weight: 500;
}

.markdown-body:not(.dark) pre.hljs .hljs-comment,
.markdown-body:not(.dark) pre.hljs .hljs-quote {
  color: #6a737d !important;
  font-style: italic;
}

.markdown-body:not(.dark) pre.hljs .hljs-tag,
.markdown-body:not(.dark) pre.hljs .hljs-name {
  color: #22863a !important;
  font-weight: 600;
}

.markdown-body:not(.dark) pre.hljs .hljs-meta,
.markdown-body:not(.dark) pre.hljs .hljs-meta-keyword {
  color: #6f42c1 !important;
}

.markdown-body:not(.dark) pre.hljs .hljs-variable,
.markdown-body:not(.dark) pre.hljs .hljs-template-variable {
  color: #e36209 !important;
}

/* XML/HTML 特定样式 */
.markdown-body:not(.dark) pre.hljs .hljs-tag .hljs-name {
  color: #22863a !important;
  font-weight: 600;
}

.markdown-body:not(.dark) pre.hljs .hljs-tag .hljs-attr {
  color: #005cc5 !important;
  font-weight: 500;
}

.markdown-body:not(.dark) pre.hljs .hljs-tag .hljs-string {
  color: #032f62 !important;
  font-weight: 500;
}

/* 暗色主题保持原有样式 */
.dark .markdown-body pre.hljs {
  background: #0d1117 !important;
  border: 1px solid #30363d;
}

/* 表格 */
.markdown-body table {
  border-collapse: collapse;
  width: 100%;
  margin: 16px 0;
  display: block;
  overflow-x: auto;
}

.markdown-body th,
.markdown-body td {
  padding: 8px 12px;
  border: 1px solid var(--c-divider);
}

.markdown-body th {
  background: var(--c-bg-soft);
  font-weight: 600;
}

.markdown-body tr {
  border-top: 1px solid var(--c-divider);
}

.markdown-body tr:nth-child(2n) {
  background: var(--c-bg-soft);
}

/* 水平线 */
.markdown-body hr {
  height: 1px;
  border: none;
  background: var(--c-divider);
  margin: 24px 0;
}

/* 上标 */
.markdown-body sup {
  font-size: 0.6em;
  vertical-align: super;
  line-height: 0;
  position: relative;
  top: -0.5em;
  margin-left: 0.2em;
}

/* 脚注引用（主内容中的注脚标号） */
.markdown-body sup.footnote-ref,
.markdown-body a.footnote-ref {
  color: var(--c-brand);
  text-decoration: none;
  cursor: pointer;
  font-weight: 500;
  transition: color var(--transition-fast);
  margin-left: 0.25em;
  margin-right: 0.1em;
}

.markdown-body sup.footnote-ref:hover,
.markdown-body a.footnote-ref:hover {
  color: var(--c-brand-light);
  text-decoration: underline;
}

/* 脚注容器 */
.markdown-body .footnotes {
  margin-top: 2em;
  padding-top: 1em;
  border-top: 1px solid var(--c-divider);
  font-size: 0.875em;
  line-height: 1.6;
  color: var(--c-text-2);
}

.markdown-body .footnotes::before {
  content: '注脚';
  display: block;
  font-size: 0.9em;
  font-weight: 600;
  color: var(--c-text-1);
  margin-bottom: 0.75em;
}

/* 脚注列表 */
.markdown-body .footnotes ol {
  margin: 0;
  padding-left: 1.5em;
  list-style: decimal;
}

.markdown-body .footnotes li {
  margin-bottom: 0.75em;
  position: relative;
  padding-left: 0.25em;
}

.markdown-body .footnotes li:last-child {
  margin-bottom: 0;
}

/* 脚注内容 */
.markdown-body .footnotes li p {
  margin: 0;
  display: inline;
}

/* 脚注返回链接 */
.markdown-body .footnotes a.footnote-backref {
  margin-left: 0.5em;
  font-size: 0.75em;
  text-decoration: none;
  color: var(--c-brand);
  transition: color var(--transition-fast);
  vertical-align: baseline;
}

.markdown-body .footnotes a.footnote-backref:hover {
  color: var(--c-brand-light);
  text-decoration: underline;
}

/* 响应式优化 */
@media (max-width: 600px) {
  .markdown-body .footnotes {
    margin-top: 1.5em;
    padding-top: 0.8em;
    font-size: 0.8125em;
  }
  
  .markdown-body .footnotes li {
    margin-bottom: 0.5em;
  }
}

/* 注脚 Tooltip */
.footnote-tooltip {
  position: fixed;
  z-index: 10000;
  max-width: 320px;
  pointer-events: none;
}

.tooltip-content {
  background: var(--c-bg);
  color: var(--c-text-1);
  padding: 8px 12px;
  border-radius: var(--radius);
  border: 1px solid var(--c-divider);
  box-shadow: var(--shadow-2);
  font-size: 0.875rem;
  line-height: 1.5;
  word-wrap: break-word;
}

.tooltip-arrow {
  position: absolute;
  bottom: -6px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 6px solid var(--c-divider);
}

.tooltip-arrow::after {
  content: '';
  position: absolute;
  bottom: 1px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid var(--c-bg);
}

/* Tooltip 动画 */
.tooltip-fade-enter-active,
.tooltip-fade-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}

.tooltip-fade-enter-from {
  opacity: 0;
  transform: translateX(-50%) translateY(4px);
}

.tooltip-fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(4px);
}

/* Image Gallery */
.markdown-body .image-gallery-wrapper {
  display: flex !important;
  gap: 10px !important;
  justify-content: center !important;
  flex-wrap: wrap !important;
  margin: 20px 0 !important;
  align-items: flex-start !important;
}

.markdown-body .image-gallery-wrapper img {
  max-height: 300px;
  width: auto;
  border-radius: var(--radius);
  cursor: pointer;
  transition: transform 0.3s;
  margin: 0;
}

.markdown-body .image-gallery-wrapper img:hover {
  transform: scale(1.02);
}

/* Timeline */
.markdown-body .timeline-wrapper {
  position: relative;
  padding-left: 24px;
  margin: 20px 0;
}

.markdown-body .timeline-wrapper::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 2px;
  background: var(--c-brand);
}

.markdown-body .timeline-wrapper ul {
  list-style: none;
  padding-left: 0;
}

.markdown-body .timeline-wrapper li {
  position: relative;
  margin-bottom: 12px;
  padding-left: 8px;
}

.markdown-body .timeline-wrapper li::before {
  content: '';
  position: absolute;
  left: -28px;
  top: 8px;
  width: 10px;
  height: 10px;
  background: var(--c-brand);
  border-radius: 50%;
  border: 2px solid var(--c-bg);
}
</style>
