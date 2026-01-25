/**
 * Rollup 打包配置文件
 *
 * 该配置用于将 TypeScript 源代码打包成 CommonJS 和 ES Module 两种格式，
 * 以便支持不同的模块系统（Node.js 和现代浏览器/打包工具）
 */

import { defineConfig } from 'rollup';
import path from 'node:path';
import alias from '@rollup/plugin-alias';
import typescript from '@rollup/plugin-typescript';
import del from 'rollup-plugin-delete';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';

// 获取当前工作目录（通常是 packages/hooks）
// 用于构建绝对路径，确保在不同环境下都能正确解析路径
const __dirname = process.cwd();

export default defineConfig({
  // 入口文件：指定要打包的源文件
  // 从这里开始构建依赖图
  input: 'src/index.ts',

  // 输出配置：指定打包后的文件输出位置和格式
  // 支持同时输出多种格式，以满足不同使用场景
  output: [
    {
      // CommonJS 格式输出文件
      // 适用于 Node.js 环境和使用 require() 的代码
      file: 'dist/index.cjs',
      format: 'cjs',
    },
    {
      // ES Module 格式输出文件
      // 适用于现代浏览器和打包工具（如 webpack、vite 等）
      file: 'dist/index.js',
      format: 'esm',
    },
  ],

  // 外部依赖：这些模块不会被打包进输出文件
  // 使用方需要自己安装这些依赖，避免重复打包和版本冲突
  external: ['react', 'react-dom'],

  // 插件配置：按顺序执行，每个插件处理特定的任务
  plugins: [
    // 1. 解析 node_modules 中的第三方模块
    // 允许从 node_modules 中导入模块
    resolve(),

    // 2. 将 CommonJS 模块转换为 ES Module
    // 使得可以导入使用 CommonJS 编写的第三方库
    commonjs(),

    // 3. 清理输出目录
    // 在构建前删除 dist 目录，确保每次构建都是全新的
    del({ targets: ['dist'] }),

    // 4. 路径别名配置
    // 将 @ 别名映射到 src 目录，方便使用绝对路径导入
    // 例如：import { useBoolean } from '@/useBoolean' 会被解析为 'src/useBoolean'
    alias({
      entries: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
    }),

    // 5. TypeScript 编译配置
    // 将 TypeScript 代码编译为 JavaScript，并生成类型声明文件
    typescript({
      // 指定 TypeScript 配置文件路径
      tsconfig: path.resolve(__dirname, 'tsconfig.json'),
      // 生成 .d.ts 类型声明文件
      declaration: true,
      // 类型声明文件的输出目录
      declarationDir: path.resolve(__dirname, 'dist/types'),
    }),

    // 6. 代码压缩和优化
    // 减小文件体积，提高加载速度
    terser({
      compress: {
        // 是否移除 console 语句
        // false: 保留 console（开发调试时有用）
        // true: 移除所有 console（生产环境推荐）
        drop_console: false,
        // 移除 debugger 语句
        // 生产环境应该移除所有调试代码
        drop_debugger: true,
      },
      format: {
        // 是否保留注释
        // false: 移除所有注释（减小文件体积）
        // true: 保留注释（保留代码说明）
        comments: false,
      },
    }),

    // 注意：如果需要处理 CSS，可以取消下面的注释并安装 rollup-plugin-postcss
    // postcss({
    //   extract: 'style/index.css',  // 提取 CSS 到独立文件
    //   minimize: true,              // 压缩 CSS
    // }),
  ],
});
