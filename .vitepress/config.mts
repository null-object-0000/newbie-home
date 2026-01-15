import { defineConfig } from 'vitepress'
import container from 'markdown-it-container'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: process.env.VITEPRESS_BASE || '/',
  title: "Newbie Home",
  description: "我的个人导航与博客",
  head: [
    ['link', { rel: 'icon', type: 'image/png', href: '/logo.png' }],
    ['link', { rel: 'apple-touch-icon', href: '/logo.png' }],
    ['link', { rel: 'shortcut icon', href: '/logo.png' }],
  ],
  markdown: {
    config(md) {
      // 注册 images 容器
      md.use(container, 'images', {
        render: (tokens, idx) => {
          const token = tokens[idx]
          
          if (token.nesting === 1) {
            // 开始标签 - 添加内联样式确保立即生效
            return '<div class="image-gallery-wrapper" style="display: flex !important; gap: 10px !important; justify-content: center !important; flex-wrap: wrap !important; margin: 20px 0 !important; align-items: flex-start !important;">\n'
          } else {
            // 结束标签
            return '</div>\n'
          }
        }
      })
      
      // 注册 timeline 容器
      md.use(container, 'timeline', {
        render: (tokens, idx) => {
          const token = tokens[idx]
          
          if (token.nesting === 1) {
            // 开始标签
            return '<div class="timeline-wrapper">\n'
          } else {
            // 结束标签
            return '</div>\n'
          }
        }
      })
    }
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/logo.png',
    nav: [
      { text: '🏠 首页', link: '/' },
      { text: '🧭 导航', link: '/nav/' },
      { text: '📝 博客', link: '/posts/2025-04' }
    ],

    sidebar: {
      // 简单的博客侧边栏示例
      '/posts/': [
        {
          text: '2025年文章',
          items: [
            { text: '2025-04 应用内单台服务器无响应问题排查', link: '/posts/2025-04' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/null-object-0000/newbie-home' }
    ]
  }
})
