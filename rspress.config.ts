import path from 'node:path';
import { defineConfig } from 'rspress/config';

export default defineConfig({
  // 基础配置
  title: 'Resin Hooks',
  description: '实用的 React 业务 Hooks 库，提供了一系列常用的 React Hooks',
  icon: '/images/logo.jpg',
  logo: '/images/logo.jpg',
  root: 'docs',
  // 部署基础路径
  base: '/resin-hooks/',

  // 输出目录
  outDir: 'docs/dist',

  // 语言配置
  lang: 'zh-CN',

  // 搜索配置
  search: {
    versioned: false,
    codeBlocks: true,
  },

  // 路由配置
  route: {
    include: ['**/*.{md,mdx}'],
    exclude: ['node_modules/**'],
    cleanUrls: true,
  },

  // 主题配置
  themeConfig: {
    // 导航栏
    nav: [
      { text: '首页', link: '/' },
      { text: '指南', link: '/guide' },
      { text: 'Hooks', link: '/hooks' },
      {
        text: 'GitHub',
        link: 'https://github.com/codebyresin/resin-hooks',
      },
    ],

    // 侧边栏配置
    sidebar: {
      '/guide': [
        {
          text: '指南',
          items: [{ text: '介绍', link: '/guide' }],
        },
      ],
      '/hooks': [
        {
          text: 'Hooks',
          items: [{ text: '概览', link: '/hooks' }],
        },
      ],
    },

    // 社交链接
    socialLinks: [
      {
        icon: 'github',
        mode: 'link',
        content: 'https://github.com/codebyresin/resin-hooks',
      },
    ],

    // 页脚
    footer: {
      message: '由 Resin Team 维护 © 2026 Resin Team. All rights reserved.',
    },

    // 暗色模式
    darkMode: true,

    // 编辑链接（可选）
    // editLink: {
    //   docRepoBaseUrl: 'https://github.com/codebyresin/resin-hooks',
    //   text: '📝 在 GitHub 上编辑此页',
    // },

    // 上一页/下一页
    prevPageText: '上一页',
    nextPageText: '下一页',

    // 大纲
    outlineTitle: '目录',
    outline: true,
  },

  // Markdown 配置
  markdown: {
    // 显示行号
    showLineNumbers: true,

    // 默认代码块换行
    defaultWrapCode: false,

    // 检查死链
    checkDeadLinks: true,

    // MDX 配置
    mdxRs: true,
  },

  // 构建配置
  builderConfig: {
    // 路径别名
    resolve: {
      alias: {
        '@hooks': path.resolve(__dirname, 'packages/hooks/src'),
        '@docs': path.resolve(__dirname, 'docs'),
      },
    },

    // 工具配置
    tools: {
      // 可以在这里配置 Rspack 相关选项
      rspack: {
        // Rspack 配置
      },
    },
  },

  // 插件配置
  plugins: [],

  // 全局 UI 组件（如果需要）
  // globalUIComponents: [
  //   path.resolve(__dirname, 'docs/.rspress/components/HomeFooter.tsx'),
  // ],

  // 全局样式
  // globalStyles: path.resolve(__dirname, 'docs/styles/global.css'),

  // Head 配置（SEO 等）
  head: [
    [
      'meta',
      { name: 'keywords', content: 'React, Hooks, TypeScript, React Hooks 库' },
    ],
    ['meta', { name: 'author', content: 'Resin Team' }],
  ],
});
