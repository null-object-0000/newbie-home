// 项目数据
export interface Project {
  id: number
  name: string
  stars: number | string
  desc: string
  stack: string[]
  url?: string
  demoUrl?: string
}

export const projects: Project[] = [
  {
    id: 1,
    name: 'Newbie-Home',
    stars: 'New',
    desc: '一个基于 Vue 3 的极简个人博客主题，支持暗黑模式和动态路由。',
    stack: ['vue', 'ts', 'vite'],
    url: 'https://github.com/null-object-0000/newbie-home',
    demoUrl: 'https://newbie-home.vercel.app'
  },
  {
    id: 2,
    name: 'Smart-Admin-Pro',
    stars: 1200,
    desc: '通过 JSON 配置自动生成复杂的后台表单，支持多级联动。',
    stack: ['react', 'ts', 'less'],
    url: 'https://github.com/null-object-0000/smart-admin-pro'
  },
  {
    id: 3,
    name: 'Node-Monitor-CLI',
    stars: 89,
    desc: '一个轻量级的服务器状态监控命令行工具。',
    stack: ['node', 'ts'],
    url: 'https://github.com/null-object-0000/node-monitor-cli'
  }
]

export function getProjectById(id: number): Project | undefined {
  return projects.find(p => p.id === id)
}
