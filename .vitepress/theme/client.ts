// 简单的图片查看器实现
let viewerElement: HTMLElement | null = null
let currentImages: string[] = []
let currentIndex = 0

function createImageViewer() {
  if (viewerElement) return

  const viewer = document.createElement('div')
  viewer.id = 'image-viewer'
  viewer.className = 'image-viewer'
  viewer.innerHTML = `
    <div class="image-viewer-overlay"></div>
    <div class="image-viewer-content">
      <button class="image-viewer-close" aria-label="关闭">×</button>
      <img class="image-viewer-img" />
      <button class="image-viewer-prev" aria-label="上一张">‹</button>
      <button class="image-viewer-next" aria-label="下一张">›</button>
    </div>
  `
  document.body.appendChild(viewer)
  viewerElement = viewer

  const img = viewer.querySelector('.image-viewer-img') as HTMLImageElement
  const closeBtn = viewer.querySelector('.image-viewer-close') as HTMLElement
  const prevBtn = viewer.querySelector('.image-viewer-prev') as HTMLElement
  const nextBtn = viewer.querySelector('.image-viewer-next') as HTMLElement
  const overlay = viewer.querySelector('.image-viewer-overlay') as HTMLElement

  const show = (images: string[], index: number) => {
    currentImages = images
    currentIndex = index
    img.src = images[index]
    viewer.classList.add('visible')
    document.body.style.overflow = 'hidden'
    
    // 显示/隐藏导航按钮
    if (images.length > 1) {
      prevBtn.style.display = 'flex'
      nextBtn.style.display = 'flex'
    } else {
      prevBtn.style.display = 'none'
      nextBtn.style.display = 'none'
    }
  }

  const hide = () => {
    viewer.classList.remove('visible')
    document.body.style.overflow = ''
  }

  const next = () => {
    if (currentImages.length > 0) {
      currentIndex = (currentIndex + 1) % currentImages.length
      img.src = currentImages[currentIndex]
    }
  }

  const prev = () => {
    if (currentImages.length > 0) {
      currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length
      img.src = currentImages[currentIndex]
    }
  }

  closeBtn.addEventListener('click', hide)
  overlay.addEventListener('click', hide)
  nextBtn.addEventListener('click', (e) => {
    e.stopPropagation()
    next()
  })
  prevBtn.addEventListener('click', (e) => {
    e.stopPropagation()
    prev()
  })

  // 键盘事件
  document.addEventListener('keydown', (e) => {
    if (!viewer.classList.contains('visible')) return
    if (e.key === 'Escape') {
      hide()
    } else if (e.key === 'ArrowLeft') {
      prev()
    } else if (e.key === 'ArrowRight') {
      next()
    }
  })

  // 导出 show 函数到全局
  ;(window as any).__showImageViewer = show
}

// 处理图片点击
function setupImageClick() {
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    if (target.tagName !== 'IMG' || !target.closest('.vp-doc')) return

    const img = target as HTMLImageElement
    
    // 检查是否在图片画廊中
    const gallery = img.closest('.image-gallery-wrapper')
    let imageSrcs: string[] = []
    let index = 0

    if (gallery) {
      // 在画廊中，获取同一画廊的所有图片
      const galleryImages = Array.from(gallery.querySelectorAll('img')) as HTMLImageElement[]
      imageSrcs = galleryImages.map(i => i.src)
      index = galleryImages.indexOf(img)
    } else {
      // 普通图片，获取页面所有不在画廊中的图片
      const allImages = Array.from(document.querySelectorAll('.vp-doc img')) as HTMLImageElement[]
      const normalImages = allImages.filter(i => !i.closest('.image-gallery-wrapper'))
      imageSrcs = normalImages.map(i => i.src)
      index = normalImages.indexOf(img)
    }

    if (imageSrcs.length > 0 && index >= 0) {
      e.preventDefault()
      createImageViewer()
      // 确保 viewer 已创建
      setTimeout(() => {
        const showViewer = (window as any).__showImageViewer
        if (showViewer) {
          showViewer(imageSrcs, index)
        }
      }, 10)
    }
  })
}

// 处理图片画廊样式
function setupImageGallery() {
  const galleries = document.querySelectorAll('.image-gallery-wrapper')
  
  galleries.forEach((gallery) => {
    // 强制设置容器样式
    const galleryElement = gallery as HTMLElement
    galleryElement.style.cssText = `
      display: flex !important;
      gap: 10px !important;
      justify-content: center !important;
      flex-wrap: wrap !important;
      margin: 20px 0 !important;
      align-items: flex-start !important;
    `

    // 处理图片被包裹在 <p> 标签中的情况
    const paragraphs = Array.from(gallery.querySelectorAll('p'))
    paragraphs.forEach((p) => {
      const imgs = Array.from(p.querySelectorAll('img'))
      if (imgs.length > 0) {
        // 将图片从 <p> 中移出，直接放到容器中
        imgs.forEach((img) => {
          const imgClone = img.cloneNode(true) as HTMLImageElement
          galleryElement.insertBefore(imgClone, p)
        })
        // 如果段落中没有其他内容，移除段落
        if (p.textContent?.trim() === '' || p.textContent === null) {
          p.remove()
        }
      }
    })

    // 重新获取图片（因为可能已经移动了）
    const images = Array.from(gallery.querySelectorAll('img'))
    if (images.length === 0) return

    // 添加类名用于样式选择
    gallery.classList.add('image-gallery')
    gallery.classList.add(`gallery-${images.length}`)

    images.forEach((img) => {
      const imgElement = img as HTMLImageElement
      imgElement.classList.add('gallery-image')
      
      // 强制设置图片样式
      imgElement.style.cssText = `
        cursor: pointer !important;
        margin: 0 !important;
        display: block !important;
        flex-shrink: 0 !important;
        border-radius: 4px;
        transition: transform 0.2s, box-shadow 0.2s;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      `
      
      // 根据图片数量设置宽度
      if (images.length === 1) {
        imgElement.style.maxWidth = '100%'
        imgElement.style.width = 'auto'
      } else if (images.length === 2) {
        imgElement.style.maxWidth = '48%'
        imgElement.style.width = 'auto'
      } else if (images.length === 3) {
        imgElement.style.maxWidth = '32%'
        imgElement.style.width = 'auto'
      } else if (images.length === 4) {
        imgElement.style.maxWidth = '48%'
        imgElement.style.width = 'auto'
      } else {
        imgElement.style.maxWidth = '32%'
        imgElement.style.width = 'auto'
      }
    })
  })
}

// 初始化
if (typeof window !== 'undefined') {
  let initTimer: ReturnType<typeof setTimeout> | null = null
  
  const init = () => {
    createImageViewer()
    setupImageClick()
    // 延迟执行以确保 DOM 完全渲染
    if (initTimer) clearTimeout(initTimer)
    initTimer = setTimeout(() => {
      setupImageGallery()
    }, 100)
  }

  // 等待 DOM 加载完成
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
  } else {
    init()
  }

  // 监听路由变化（VitePress 使用）
  window.addEventListener('load', () => {
    setTimeout(() => {
      setupImageGallery()
    }, 200)
  })

  // 使用 MutationObserver 监听 DOM 变化
  const observer = new MutationObserver((mutations) => {
    let shouldUpdate = false
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) { // Element node
            const el = node as HTMLElement
            if (el.classList?.contains('image-gallery-wrapper') || 
                el.querySelector?.('.image-gallery-wrapper')) {
              shouldUpdate = true
            }
          }
        })
      }
    })
    if (shouldUpdate) {
      setTimeout(() => {
        setupImageGallery()
      }, 50)
    }
  })

  observer.observe(document.body, {
    childList: true,
    subtree: true
  })

  // 监听 VitePress 的路由切换事件
  if (typeof window !== 'undefined') {
    // VitePress 在路由切换时会触发 popstate 事件
    window.addEventListener('popstate', () => {
      setTimeout(() => {
        setupImageGallery()
      }, 200)
    })
  }
}