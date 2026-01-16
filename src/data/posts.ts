// 博客文章索引
// 用于 SSG 生成静态路由

export interface PostMeta {
  slug: string
  title: string
  date: string
  excerpt?: string
  readTime?: number
  tags?: string[]
  cover?: string | null
}

export const posts: PostMeta[] = [
  {
    slug: '2025-04',
    title: '2025-04 应用内单台服务器无响应问题排查',
    date: '2025-04',
    excerpt: '记录了一次生产环境服务器无响应问题的完整排查过程，包括问题定位、内存分析、线程死锁排查等...',
    readTime: 15,
    tags: ['Java', '排查', '性能优化'],
    cover: null
  }
]

export function getPostBySlug(slug: string): PostMeta | undefined {
  return posts.find(p => p.slug === slug)
}

export function getAllPosts(): PostMeta[] {
  return posts
}
