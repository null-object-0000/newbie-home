import type { RouteRecordRaw } from 'vue-router'
import { posts } from '@/data/posts'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/nav/',
    name: 'nav',
    component: () => import('@/views/Nav.vue')
  },
  {
    path: '/posts/:slug',
    name: 'post',
    component: () => import('@/views/Post.vue')
  }
]

// 为 SSG 生成所有博客文章的静态路由
export function getStaticRoutes(): string[] {
  const staticRoutes = [
    '/',
    '/nav/'
  ]
  
  // 添加所有博客文章路由
  for (const post of posts) {
    staticRoutes.push(`/posts/${post.slug}`)
  }
  
  return staticRoutes
}
