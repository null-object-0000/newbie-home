import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: process.env.VITEPRESS_BASE || '/',
  title: "Newbie Home",
  description: "我的个人导航与博客",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '🏠 首页', link: '/' },
      { text: '🧭 导航', link: '/nav/' },
      { text: '📝 博客', link: '/posts/' }
    ],

    sidebar: {
      // 简单的博客侧边栏示例
      '/posts/': [
        {
          text: '2024年文章',
          items: [
            { text: '我的第一篇博客', link: '/posts/hello-world' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/null-object-0000/newbie-home' }
    ]
  }
})
