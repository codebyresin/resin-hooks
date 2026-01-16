import { defineConfig } from 'dumi';
import path from 'path';

export default defineConfig({
  // 站点基本配置
  title: 'Resin Hooks',
  favicon: '/images/logo.png',
  logo: '/images/logo.png',
  outputPath: 'docs/dist',
  mode: 'site',

  // 路由配置
  base: '/',
  publicPath: '/',

  // 导航栏配置
  navs: [
    {
      title: '指南',
      path: '/guide',
    },
    {
      title: 'Hooks',
      path: '/hooks',
    },
    {
      title: 'GitHub',
      href: 'https://github.com/yourusername/resin-hooks',
    },
  ],

  // 侧边栏配置
  menus: {
    '/hooks': [
      {
        title: '状态管理',
        children: [{ title: 'useBoolean', path: '/hooks/useBoolean' }],
      },
    ],
  },

  // 解析配置
  resolve: {
    docDirs: ['docs'],
    alias: {
      '@resin-hooks/core': path.resolve(__dirname, 'packages/hooks/src'),
    },
  },

  // 主题配置
  themeConfig: {
    logo: '/images/logo.png',
    footer: {
      copyright: 'Copyright (c) © 2026 by Resin Team, All Rights Reserved',
    },
  },

  // 构建配置
  extraBabelPlugins: [
    [
      'babel-plugin-import',
      {
        libraryName: '@resin-hooks/core',
        libraryDirectory: 'es',
        camel2DashComponentName: false,
      },
    ],
  ],
});
