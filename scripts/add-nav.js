#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');
const inquirer = require('inquirer');

// 常见网站的图标映射
const iconMap = {
  'github.com': 'github',
  'twitter.com': 'twitter',
  'x.com': 'twitter',
  'youtube.com': 'youtube',
  'facebook.com': 'facebook',
  'linkedin.com': 'linkedin',
  'instagram.com': 'instagram',
  'reddit.com': 'reddit',
  'stackoverflow.com': 'stack-overflow',
  'medium.com': 'medium',
  'dev.to': 'code',
  'codepen.io': 'code',
  'jsfiddle.net': 'code',
  'mdn.org': 'code',
  'developer.mozilla.org': 'code',
  'vitepress.dev': 'book',
  'vuejs.org': 'code',
  'react.dev': 'code',
  'angular.io': 'code',
  'nodejs.org': 'code',
  'npmjs.com': 'package',
};

// 下载图标
async function downloadIcon(iconUrl, savePath) {
  try {
    // 处理相对路径
    if (iconUrl.startsWith('//')) {
      iconUrl = 'https:' + iconUrl;
    } else if (iconUrl.startsWith('/')) {
      // 需要从原始 URL 获取域名
      const baseUrl = new URL(iconUrl.includes('://') ? iconUrl : 'https://' + iconUrl);
      iconUrl = baseUrl.origin + iconUrl;
    } else if (!iconUrl.includes('://')) {
      // 相对路径，需要基础 URL
      return null;
    }

    const response = await axios.get(iconUrl, {
      responseType: 'arraybuffer',
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    // 确保目录存在
    const dir = path.dirname(savePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(savePath, response.data);
    return true;
  } catch (error) {
    console.warn(`下载图标失败: ${error.message}`);
    return false;
  }
}

// 获取网站信息并下载图标
async function fetchWebsiteInfo(url) {
  try {
    console.log(`正在获取网站信息: ${url}...`);
    
    // 确保 URL 格式正确
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    const urlObj = new URL(url);
    const baseUrl = urlObj.origin;
    const hostname = urlObj.hostname.replace('www.', '');

    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const $ = cheerio.load(response.data);
    
    // 获取网站标题
    const title = $('title').text().trim() || 
                  $('meta[property="og:title"]').attr('content') ||
                  hostname;

    // 获取网站描述
    const description = $('meta[name="description"]').attr('content') ||
                       $('meta[property="og:description"]').attr('content') ||
                       '';

    // 查找 favicon
    let faviconUrl = null;
    let iconPath = null;

    // 尝试多种方式获取 favicon
    const faviconSelectors = [
      'link[rel="icon"]',
      'link[rel="shortcut icon"]',
      'link[rel="apple-touch-icon"]',
      'link[rel="apple-touch-icon-precomposed"]'
    ];

    for (const selector of faviconSelectors) {
      const link = $(selector).first();
      if (link.length) {
        faviconUrl = link.attr('href');
        if (faviconUrl) break;
      }
    }

    // 如果没找到，尝试默认路径
    if (!faviconUrl) {
      const defaultPaths = ['/favicon.ico', '/favicon.png', '/apple-touch-icon.png'];
      for (const defaultPath of defaultPaths) {
        try {
          const testUrl = baseUrl + defaultPath;
          const testResponse = await axios.head(testUrl, { timeout: 3000 });
          if (testResponse.status === 200) {
            faviconUrl = defaultPath;
            break;
          }
        } catch {
          // 继续尝试下一个
        }
      }
    }

    // 下载图标
    if (faviconUrl) {
      // 处理相对路径
      let fullIconUrl = faviconUrl;
      if (faviconUrl.startsWith('//')) {
        fullIconUrl = 'https:' + faviconUrl;
      } else if (faviconUrl.startsWith('/')) {
        fullIconUrl = baseUrl + faviconUrl;
      } else if (!faviconUrl.includes('://')) {
        fullIconUrl = baseUrl + '/' + faviconUrl;
      }

      // 生成文件名
      const iconExt = path.extname(new URL(fullIconUrl).pathname) || '.ico';
      const iconFileName = hostname.replace(/[^a-z0-9]/gi, '_') + iconExt;
      iconPath = path.join(__dirname, '..', 'public', 'icons', iconFileName);

      console.log(`正在下载图标: ${fullIconUrl}...`);
      const downloaded = await downloadIcon(fullIconUrl, iconPath);
      
      if (downloaded) {
        // 返回相对路径（从 public 目录开始）
        iconPath = `/icons/${iconFileName}`;
        console.log(`✅ 图标已保存: ${iconPath}`);
      } else {
        iconPath = null;
      }
    }

    // 如果下载失败，检查是否有内置图标
    if (!iconPath && iconMap[hostname]) {
      iconPath = iconMap[hostname]; // 使用内置图标名称
    }

    return {
      url,
      title: title.substring(0, 50), // 限制长度
      description: description.substring(0, 100),
      icon: iconPath || hostname.split('.')[0].substring(0, 10),
      hostname
    };
  } catch (error) {
    console.error('获取网站信息失败:', error.message);
    // 如果获取失败，使用基本信息
    const urlObj = new URL(url.startsWith('http') ? url : 'https://' + url);
    const hostname = urlObj.hostname.replace('www.', '');
    return {
      url: url.startsWith('http') ? url : 'https://' + url,
      title: hostname,
      description: '',
      icon: iconMap[hostname] || hostname.split('.')[0].substring(0, 10),
      hostname
    };
  }
}

// 读取导航数据
function readNavData() {
  const jsonFile = path.join(__dirname, '..', 'nav', 'nav-data.json');
  
  if (!fs.existsSync(jsonFile)) {
    throw new Error('找不到 nav-data.json 文件');
  }
  
  try {
    const content = fs.readFileSync(jsonFile, 'utf-8');
    const navData = JSON.parse(content);
    return navData;
  } catch (error) {
    throw new Error('读取导航数据失败: ' + error.message);
  }
}

// 写入导航数据
function writeNavData(navData) {
  const jsonFile = path.join(__dirname, '..', 'nav', 'nav-data.json');
  
  try {
    const content = JSON.stringify(navData, null, 2);
    fs.writeFileSync(jsonFile, content, 'utf-8');
    console.log('\n✅ 导航数据已更新！');
  } catch (error) {
    throw new Error('写入导航数据失败: ' + error.message);
  }
}

// 主函数
async function main() {
  console.log('🚀 导航添加工具\n');

  // 读取现有导航数据
  const navData = readNavData();
  
  // 提取现有分类
  const categories = navData.map(cat => cat.name);

  // 询问用户输入
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'url',
      message: '请输入网站 URL:',
      validate: (input) => {
        if (!input.trim()) {
          return 'URL 不能为空';
        }
        try {
          const url = input.startsWith('http') ? input : 'https://' + input;
          new URL(url);
          return true;
        } catch {
          return '请输入有效的 URL';
        }
      }
    }
  ]);

  // 获取网站信息
  const siteInfo = await fetchWebsiteInfo(answers.url);
  
  console.log(`\n📋 网站信息:`);
  console.log(`   标题: ${siteInfo.title}`);
  console.log(`   图标: ${siteInfo.icon}`);
  if (siteInfo.description) {
    console.log(`   描述: ${siteInfo.description}`);
  }

  // 询问分类和描述
  const addAnswers = await inquirer.prompt([
    {
      type: 'list',
      name: 'category',
      message: '选择分类:',
      choices: [
        ...categories,
        new inquirer.Separator(),
        { name: '+ 创建新分类', value: '__NEW__' }
      ]
    },
    {
      type: 'input',
      name: 'newCategory',
      message: '请输入新分类名称:',
      when: (answers) => answers.category === '__NEW__',
      validate: (input) => {
        if (!input.trim()) {
          return '分类名称不能为空';
        }
        if (categories.includes(input.trim())) {
          return '该分类已存在';
        }
        return true;
      }
    },
    {
      type: 'input',
      name: 'newCategoryTitle',
      message: '请输入新分类英文标题:',
      when: (answers) => answers.category === '__NEW__',
      validate: (input) => input.trim().length > 0 || '标题不能为空'
    },
    {
      type: 'input',
      name: 'description',
      message: '请输入网站描述:',
      default: siteInfo.description || '',
      validate: (input) => input.trim().length > 0 || '描述不能为空'
    }
  ]);

  // 确定分类
  let categoryName = addAnswers.category;
  let categoryTitle = '';
  
  if (categoryName === '__NEW__') {
    categoryName = addAnswers.newCategory.trim();
    categoryTitle = addAnswers.newCategoryTitle.trim();
  } else {
    // 查找现有分类的 title
    const existingCategory = navData.find(cat => cat.name === categoryName);
    categoryTitle = existingCategory ? existingCategory.title : categoryName;
  }

  // 创建新的链接项
  const newLink = {
    icon: siteInfo.icon,
    link: siteInfo.url,
    desc: addAnswers.description.trim()
  };

  // 查找或创建分类
  let category = navData.find(cat => cat.name === categoryName);
  
  if (!category) {
    // 创建新分类
    category = {
      name: categoryName,
      title: categoryTitle,
      links: []
    };
    navData.push(category);
  }

  // 检查链接是否已存在
  const linkExists = category.links.some(link => link.link === siteInfo.url);
  if (linkExists) {
    console.log('\n⚠️  该链接已存在于该分类中！');
    return;
  }

  // 添加链接
  category.links.push(newLink);

  // 保存
  writeNavData(navData);
  
  console.log(`\n✨ 已成功添加 "${siteInfo.title}" 到分类 "${categoryName}"`);
}

// 运行
main().catch(error => {
  console.error('\n❌ 发生错误:', error.message);
  process.exit(1);
});
