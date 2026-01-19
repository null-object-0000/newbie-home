#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * 获取文件的 git 最后修改时间
 * @param {string} filePath - 文件路径
 * @returns {string|null} - ISO 格式的时间字符串
 */
function getGitLastModified(filePath) {
  try {
    // 获取文件的最后一次 git 提交时间
    const timestamp = execSync(
      `git log -1 --format=%ai -- "${filePath}"`,
      { encoding: 'utf-8' }
    ).trim();
    
    if (!timestamp) {
      return null;
    }
    
    // 转换为 ISO 格式的日期时间
    const date = new Date(timestamp);
    return date.toISOString();
  } catch (error) {
    console.warn(`无法获取 ${filePath} 的 git 时间:`, error.message);
    return null;
  }
}

/**
 * 获取文件的 git 创建时间（首次提交时间）
 * @param {string} filePath - 文件路径
 * @returns {string|null} - ISO 格式的时间字符串
 */
function getGitCreated(filePath) {
  try {
    // 获取文件的所有提交时间
    const allTimestamps = execSync(
      `git log --diff-filter=A --follow --format=%ai -- "${filePath}"`,
      { encoding: 'utf-8' }
    ).trim().split('\n');
    
    if (allTimestamps.length === 0 || !allTimestamps[0]) {
      return null;
    }
    
    // 获取最后一个（最早的）时间戳
    const timestamp = allTimestamps[allTimestamps.length - 1];
    const date = new Date(timestamp);
    return date.toISOString();
  } catch (error) {
    console.warn(`无法获取 ${filePath} 的 git 创建时间:`, error.message);
    return null;
  }
}

/**
 * 生成所有文章的 git 时间戳数据
 */
function generateGitTimestamps() {
  const postsDir = path.join(__dirname, '..', 'src', 'content', 'posts');
  const outputFile = path.join(__dirname, '..', 'src', 'data', 'git-timestamps.json');
  
  // 检查 posts 目录是否存在
  if (!fs.existsSync(postsDir)) {
    console.error(`❌ 找不到文章目录: ${postsDir}`);
    process.exit(1);
  }
  
  // 读取所有 markdown 文件
  const files = fs.readdirSync(postsDir).filter(file => file.endsWith('.md'));
  
  if (files.length === 0) {
    console.warn('⚠️  未找到任何 markdown 文件');
    return;
  }
  
  console.log(`📝 正在处理 ${files.length} 个文章文件...`);
  
  const timestamps = {};
  
  for (const file of files) {
    const filePath = path.join(postsDir, file);
    const relativePath = path.relative(path.join(__dirname, '..'), filePath);
    const slug = file.replace('.md', '');
    
    console.log(`   处理: ${file}`);
    
    const lastModified = getGitLastModified(relativePath);
    const created = getGitCreated(relativePath);
    
    timestamps[slug] = {
      lastModified: lastModified || new Date().toISOString(),
      created: created || lastModified || new Date().toISOString()
    };
  }
  
  // 确保输出目录存在
  const outputDir = path.dirname(outputFile);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // 写入 JSON 文件
  fs.writeFileSync(outputFile, JSON.stringify(timestamps, null, 2), 'utf-8');
  
  console.log(`\n✅ Git 时间戳数据已生成: ${outputFile}`);
  console.log(`   共处理 ${Object.keys(timestamps).length} 个文件`);
}

// 主函数
function main() {
  console.log('🚀 生成文章 Git 时间戳\n');
  
  try {
    // 检查是否在 git 仓库中
    execSync('git rev-parse --git-dir', { stdio: 'ignore' });
  } catch (error) {
    console.error('❌ 当前目录不是 git 仓库');
    process.exit(1);
  }
  
  generateGitTimestamps();
}

// 运行
if (require.main === module) {
  main();
}

module.exports = { getGitLastModified, getGitCreated };
