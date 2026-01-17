/**
 * 构建后处理脚本：将 HTML 文件重组为目录结构
 * 
 * 将扁平的文件结构转换为目录结构，以便 OSS 等静态托管服务正确提供页面：
 * - posts.html → posts/index.html
 * - projects.html → projects/index.html
 * - posts/xxx.html → posts/xxx/index.html
 */

import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const distDir = path.resolve(__dirname, '../dist')

/**
 * 递归处理目录中的所有 HTML 文件
 */
async function restructureHtmlFiles(dir = distDir, basePath = '') {
  const entries = await fs.readdir(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    const relativePath = path.join(basePath, entry.name)

    if (entry.isDirectory()) {
      // 递归处理子目录
      await restructureHtmlFiles(fullPath, relativePath)
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      // 跳过根目录的 index.html
      if (entry.name === 'index.html' && basePath === '') {
        continue
      }

      // 跳过已经是 index.html 的文件（已经在正确的目录结构中）
      if (entry.name === 'index.html') {
        continue
      }

      // 处理 HTML 文件
      const fileName = entry.name
      const routeName = fileName.replace(/\.html$/, '')
      
      // 构建新的目录路径
      const newDir = path.join(dir, routeName)
      const newFilePath = path.join(newDir, 'index.html')

      // 检查目标文件是否已存在
      try {
        await fs.access(newFilePath)
        console.log(`⚠️  跳过: ${relativePath} (目标文件已存在: ${path.join(relativePath, routeName, 'index.html')})`)
        continue
      } catch {
        // 文件不存在，可以继续处理
      }

      console.log(`📦 重组: ${relativePath} → ${path.join(relativePath, routeName, 'index.html')}`)

      // 创建新目录
      await fs.mkdir(newDir, { recursive: true })

      // 移动文件
      await fs.rename(fullPath, newFilePath)
    }
  }
}

/**
 * 主函数
 */
async function main() {
  try {
    console.log('🚀 开始重组 HTML 文件结构...')
    
    // 检查 dist 目录是否存在
    try {
      await fs.access(distDir)
    } catch {
      console.error(`❌ 错误: dist 目录不存在，请先运行构建命令 (npm run build)`)
      process.exit(1)
    }

    // 重组文件
    await restructureHtmlFiles()

    console.log('✅ HTML 文件重组完成！')
  } catch (error) {
    console.error('❌ 重组过程中发生错误:', error)
    process.exit(1)
  }
}

main()
