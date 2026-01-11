import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import ImageViewer from './components/ImageViewer.vue'
import ImageGallery from './components/ImageGallery.vue'
import Timeline from './components/Timeline.vue'
import TimelineItem from './components/TimelineItem.vue'
import NavGrid from './components/NavGrid.vue'
import './style.css'
import './client'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // 注册全局组件
    app.component('ImageViewer', ImageViewer)
    app.component('ImageGallery', ImageGallery)
    app.component('Timeline', Timeline)
    app.component('TimelineItem', TimelineItem)
    app.component('NavGrid', NavGrid)
  }
}