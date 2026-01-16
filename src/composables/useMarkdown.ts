import MarkdownIt from 'markdown-it'
import container from 'markdown-it-container'
import hljs from 'highlight.js'

// 创建 markdown-it 实例
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  breaks: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        const highlighted = hljs.highlight(str, { language: lang }).value
        return `<pre class="hljs"><code>${highlighted}</code></pre>`
      } catch (__) {
        // 如果高亮失败，返回原始代码
      }
    }
    // 如果没有指定语言或语言不支持，使用默认高亮
    const highlighted = hljs.highlightAuto(str).value
    return `<pre class="hljs"><code>${highlighted}</code></pre>`
  }
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
  
  let currentKey: string | null = null
  let currentArray: string[] | null = null
  
  for (const line of lines) {
    // 检查是否是数组项（以 "  - " 开头）
    const arrayItemMatch = line.match(/^\s+-\s+(.+)$/)
    if (arrayItemMatch && currentKey && currentArray) {
      let value = arrayItemMatch[1].trim()
      // 移除引号
      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1)
      }
      currentArray.push(value)
      continue
    }
    
    // 检查是否是键值对
    const colonIndex = line.indexOf(':')
    if (colonIndex > 0 && !line.startsWith(' ')) {
      // 保存之前的数组
      if (currentKey && currentArray) {
        frontmatter[currentKey] = currentArray
      }
      
      const key = line.slice(0, colonIndex).trim()
      let value = line.slice(colonIndex + 1).trim()
      
      // 检查是否是数组开始（值为空）
      if (value === '') {
        currentKey = key
        currentArray = []
        continue
      }
      
      // 重置数组状态
      currentKey = null
      currentArray = null
      
      // 移除引号
      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1)
      }
      
      // 处理 null 值
      if (value === 'null') {
        frontmatter[key] = null
      } else if (value === 'true') {
        frontmatter[key] = true
      } else if (value === 'false') {
        frontmatter[key] = false
      } else if (!isNaN(Number(value)) && value !== '') {
        frontmatter[key] = Number(value)
      } else {
        frontmatter[key] = value
      }
    }
  }
  
  // 保存最后一个数组
  if (currentKey && currentArray) {
    frontmatter[currentKey] = currentArray
  }
  
  return { frontmatter, body }
}

// 从 markdown 内容中提取第一个 # 标题
export function extractTitleFromMarkdown(content: string): string | null {
  // 先移除 frontmatter（如果有）
  const { body } = parseFrontmatter(content)
  
  // 查找第一个 # 开头的标题
  const titleMatch = body.match(/^#\s+(.+)$/m)
  if (titleMatch) {
    return titleMatch[1].trim()
  }
  
  return null
}

// 从 markdown 内容中提取摘要（文章开头的文本内容）
export function extractExcerptFromMarkdown(content: string, maxLength: number = 200): string | null {
  const { body } = parseFrontmatter(content)
  
  // 移除第一个 # 标题行
  let text = body.replace(/^#\s+.+$/m, '').trim()
  
  // 移除图片、代码块、容器等
  text = text
    // 移除图片 ![alt](url)
    .replace(/!\[.*?\]\(.*?\)/g, '')
    // 移除链接 [text](url)，但保留文本
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
    // 移除代码块 ```...```
    .replace(/```[\s\S]*?```/g, '')
    // 移除行内代码 `code`
    .replace(/`[^`]+`/g, '')
    // 移除容器 :::xxx ... :::
    .replace(/:::[\s\S]*?:::/g, '')
    // 移除所有标题行（包括标题文本）
    .replace(/^#{1,6}\s+.+$/gm, '')
    // 移除列表标记
    .replace(/^[\s]*[-*+]\s+/gm, '')
    .replace(/^[\s]*\d+\.\s+/gm, '')
    // 移除引用标记
    .replace(/^>\s+/gm, '')
    // 移除多余的空行
    .replace(/\n{3,}/g, '\n\n')
    .trim()
  
  if (!text) {
    return null
  }
  
  // 提取前 maxLength 个字符
  if (text.length <= maxLength) {
    return text
  }
  
  // 在合适的位置截断（尽量在句号、问号、感叹号后截断）
  let excerpt = text.slice(0, maxLength)
  const lastPunctuation = Math.max(
    excerpt.lastIndexOf('。'),
    excerpt.lastIndexOf('！'),
    excerpt.lastIndexOf('？'),
    excerpt.lastIndexOf('.'),
    excerpt.lastIndexOf('!'),
    excerpt.lastIndexOf('?')
  )
  
  if (lastPunctuation > maxLength * 0.5) {
    excerpt = excerpt.slice(0, lastPunctuation + 1)
  } else {
    // 如果没有找到合适的标点，在最后一个空格处截断
    const lastSpace = excerpt.lastIndexOf(' ')
    if (lastSpace > maxLength * 0.7) {
      excerpt = excerpt.slice(0, lastSpace)
    }
  }
  
  return excerpt.trim() + (text.length > maxLength ? '...' : '')
}

// 计算文章阅读时间（基于字数）
export function calculateReadTime(content: string): number {
  const { body } = parseFrontmatter(content)
  
  // 移除 markdown 语法，只保留纯文本
  let text = body
    // 移除代码块
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]+`/g, '')
    // 移除图片和链接
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
    // 移除容器
    .replace(/:::[\s\S]*?:::/g, '')
    // 移除标题标记
    .replace(/^#{1,6}\s+/gm, '')
    // 移除列表标记
    .replace(/^[\s]*[-*+]\s+/gm, '')
    .replace(/^[\s]*\d+\.\s+/gm, '')
    // 移除引用标记
    .replace(/^>\s+/gm, '')
    // 移除 HTML 标签
    .replace(/<[^>]+>/g, '')
    // 移除多余空白
    .replace(/\s+/g, ' ')
    .trim()
  
  // 统计中文字符数（包括中文标点）
  const chineseCharCount = (text.match(/[\u4e00-\u9fa5，。！？；：、]/g) || []).length
  
  // 统计英文单词数（简单统计，按空格分割）
  const englishWords = text.replace(/[\u4e00-\u9fa5，。！？；：、]/g, '').trim()
  const englishWordCount = englishWords ? englishWords.split(/\s+/).filter(w => w.length > 0).length : 0
  
  // 中文阅读速度：300 字/分钟
  // 英文阅读速度：200 词/分钟
  const chineseMinutes = chineseCharCount / 300
  const englishMinutes = englishWordCount / 200
  
  // 总阅读时间（至少 1 分钟）
  const totalMinutes = Math.max(1, Math.ceil(chineseMinutes + englishMinutes))
  
  return totalMinutes
}

// 导出 parseFrontmatter 供其他模块使用
export { parseFrontmatter }

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
