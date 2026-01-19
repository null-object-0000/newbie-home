/**
 * 构建后处理脚本：修复资源路径
 * 
 * 在 GitHub Pages 部署时，确保所有资源路径都包含 /newbie-space/ 前缀
 * 主要用于修复 CSS 中的字体路径等可能被 Vite 遗漏的资源
 */

import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const distDir = path.resolve(__dirname, '../dist')

/**
 * 检测构建时的 base 路径
 */
async function detectBase() {
  try {
    const indexPath = path.join(distDir, 'index.html')
    const content = await fs.readFile(indexPath, 'utf-8')
    
    // 检查 HTML 中是否已经有 /newbie-space/ 前缀
    if (content.includes('/newbie-space/assets/') || content.includes('href="/newbie-space/')) {
      return '/newbie-space/'
    }
    
    // 检查环境变量
    const envBase = process.env.BASE_URL || process.env.VITE_BASE_URL
    if (envBase) {
      return envBase.endsWith('/') ? envBase : envBase + '/'
    }
    
    // 默认返回 /newbie-space/（GitHub Pages 部署）
    return '/newbie-space/'
  } catch {
    // 如果无法读取文件，使用环境变量或默认值
    const envBase = process.env.BASE_URL || process.env.VITE_BASE_URL
    return envBase ? (envBase.endsWith('/') ? envBase : envBase + '/') : '/newbie-space/'
  }
}

/**
 * 修复 HTML 文件中的资源路径
 */
async function fixHtmlFiles(dir, shouldAddBase) {
  const entries = await fs.readdir(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      // 递归处理子目录
      await fixHtmlFiles(fullPath, shouldAddBase)
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      // 处理 HTML 文件
      let content = await fs.readFile(fullPath, 'utf-8')
      let modified = false

      // 修复 script 标签中的 src（如果路径不包含 /newbie-space/）
      content = content.replace(
        /<script([^>]*)\ssrc="([^"]+)"/g,
        (match, attrs, src) => {
          if (shouldAddBase && src.startsWith('/') && !src.startsWith('/newbie-space/') && !src.startsWith('http')) {
            modified = true
            return `<script${attrs} src="/newbie-space${src}"`
          }
          return match
        }
      )

      // 修复 link 标签中的 href（如果路径不包含 /newbie-space/）
      content = content.replace(
        /<link([^>]*)\shref="([^"]+)"/g,
        (match, attrs, href) => {
          if (shouldAddBase && href.startsWith('/') && !href.startsWith('/newbie-space/') && !href.startsWith('http')) {
            modified = true
            return `<link${attrs} href="/newbie-space${href}"`
          }
          return match
        }
      )

      // 修复内联 CSS 中的 url() 路径
      content = content.replace(
        /url\((['"]?)(\/[^'")]+)\1\)/g,
        (match, quote, url) => {
          if (shouldAddBase && !url.startsWith('/newbie-space/') && !url.startsWith('http')) {
            modified = true
            return `url(${quote}/newbie-space${url}${quote})`
          }
          return match
        }
      )

      if (modified) {
        await fs.writeFile(fullPath, content, 'utf-8')
        console.log(`✅ 修复 HTML: ${path.relative(distDir, fullPath)}`)
      }
    }
  }
}

/**
 * 修复 CSS 文件中的资源路径
 */
async function fixCssFiles(dir, shouldAddBase) {
  const entries = await fs.readdir(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      // 递归处理子目录
      await fixCssFiles(fullPath, shouldAddBase)
    } else if (entry.isFile() && entry.name.endsWith('.css')) {
      // 处理 CSS 文件
      let content = await fs.readFile(fullPath, 'utf-8')
      let modified = false

      // 修复 url() 中的路径（字体文件等）
      content = content.replace(
        /url\((['"]?)(\/[^'")]+)\1\)/g,
        (match, quote, url) => {
          if (shouldAddBase && !url.startsWith('/newbie-space/') && !url.startsWith('http')) {
            modified = true
            return `url(${quote}/newbie-space${url}${quote})`
          }
          return match
        }
      )

      if (modified) {
        await fs.writeFile(fullPath, content, 'utf-8')
        console.log(`✅ 修复 CSS: ${path.relative(distDir, fullPath)}`)
      }
    }
  }
}

/**
 * 主函数
 */
async function main() {
  try {
    // 检查 dist 目录是否存在
    try {
      await fs.access(distDir)
    } catch {
      console.error(`❌ 错误: dist 目录不存在，请先运行构建命令 (npm run build)`)
      process.exit(1)
    }

    // 检测 base 路径
    const detectedBase = await detectBase()
    const shouldAdd = detectedBase.includes('/newbie-space/') && detectedBase !== '/'
    
    console.log('🚀 开始修复资源路径...')
    console.log(`📌 检测到的 Base URL: ${detectedBase}`)
    console.log(`📌 是否添加前缀: ${shouldAdd}`)
    
    // 修复 HTML 和 CSS 文件
    await fixHtmlFiles(distDir, shouldAdd)
    await fixCssFiles(distDir, shouldAdd)

    console.log('✅ 资源路径修复完成！')
  } catch (error) {
    console.error('❌ 修复过程中发生错误:', error)
    process.exit(1)
  }
}

main()
