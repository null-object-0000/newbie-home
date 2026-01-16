import MarkdownIt from 'markdown-it'
import container from 'markdown-it-container'

// 创建 markdown-it 实例
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  breaks: true
})

// 注册 images 容器
md.use(container, 'images', {
  render: (tokens: any[], idx: number) => {
    const token = tokens[idx]
    
    if (token.nesting === 1) {
      // 开始标签
      return '<div class="image-gallery-wrapper">\n'
    } else {
      // 结束标签
      return '</div>\n'
    }
  }
})

// 注册 timeline 容器
md.use(container, 'timeline', {
  render: (tokens: any[], idx: number) => {
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

// 注册 details 容器
md.use(container, 'details', {
  validate: (params: string) => {
    return params.trim().startsWith('details')
  },
  render: (tokens: any[], idx: number) => {
    const token = tokens[idx]
    const info = token.info.trim()
    const m = info.match(/^details\s+(.+)$/)
    
    if (token.nesting === 1) {
      // 开始标签，提取标题
      const title = m ? m[1] : '详情'
      return `<div class="details-wrapper" data-title="${escapeHtml(title)}">\n`
    } else {
      // 结束标签
      return '</div>\n'
    }
  }
})

// HTML 转义函数
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }
  return text.replace(/[&<>"']/g, (m) => map[m])
}

// 简单的 frontmatter 解析（不使用 gray-matter 以避免 Node.js 依赖）
function parseFrontmatter(content: string): { frontmatter: Record<string, any>; body: string } {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n/
  const match = content.match(frontmatterRegex)
  
  if (!match) {
    return { frontmatter: {}, body: content }
  }
  
  const frontmatterStr = match[1]
  const body = content.slice(match[0].length)
  
  // 简单解析 YAML 格式的 frontmatter
  const frontmatter: Record<string, any> = {}
  const lines = frontmatterStr.split('\n')
  
  for (const line of lines) {
    const colonIndex = line.indexOf(':')
    if (colonIndex > 0) {
      const key = line.slice(0, colonIndex).trim()
      let value = line.slice(colonIndex + 1).trim()
      
      // 移除引号
      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1)
      }
      
      frontmatter[key] = value
    }
  }
  
  return { frontmatter, body }
}

export function parseMarkdown(content: string) {
  const { frontmatter, body } = parseFrontmatter(content)
  const html = md.render(body)
  return { frontmatter, html }
}

export function renderMarkdown(content: string): string {
  return md.render(content)
}

export function useMarkdown() {
  return {
    parseMarkdown,
    renderMarkdown,
    md
  }
}
