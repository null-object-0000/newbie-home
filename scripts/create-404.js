/**
 * 构建后处理脚本：创建 404.html 文件
 * 
 * GitHub Pages 在找不到文件时会使用 404.html
 * 我们将 index.html 复制为 404.html，让 Vue Router 处理所有路由
 */

import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const distDir = path.resolve(__dirname, '../dist')

/**
 * 主函数
 */
async function main() {
  try {
    console.log('🚀 开始创建 404.html...')
    
    // 检查 dist 目录是否存在
    try {
      await fs.access(distDir)
    } catch {
      console.error(`❌ 错误: dist 目录不存在，请先运行构建命令 (npm run build)`)
      process.exit(1)
    }

    const indexPath = path.join(distDir, 'index.html')
    const notFoundPath = path.join(distDir, '404.html')

    // 检查 index.html 是否存在
    try {
      await fs.access(indexPath)
    } catch {
      console.error(`❌ 错误: index.html 不存在`)
      process.exit(1)
    }

    // 读取 index.html 内容
    let content = await fs.readFile(indexPath, 'utf-8')
    
    // 创建 404.html（直接复制 index.html）
    await fs.writeFile(notFoundPath, content, 'utf-8')
    
    console.log('✅ 404.html 创建完成！')
  } catch (error) {
    console.error('❌ 创建 404.html 过程中发生错误:', error)
    process.exit(1)
  }
}

main()
