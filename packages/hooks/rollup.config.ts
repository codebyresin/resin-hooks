import { defineConfig } from 'rollup';
import path from 'node:path';
import alias from '@rollup/plugin-alias';
import typescript from '@rollup/plugin-typescript';
import del from 'rollup-plugin-delete';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';

// 获取配置文件所在目录（使用 process.cwd() 获取当前工作目录，通常是 packages/hooks）
const __dirname = process.cwd();

export default defineConfig({
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.cjs',
      format: 'cjs',
    },
    {
      file: 'dist/index.js',
      format: 'esm',
    },
  ],
  external: ['react', 'react-dom'], // 添加 React 作为外部依赖
  plugins: [
    // 如果你不需要 CSS，可以移除 postcss 配置
    // postcss({
    //   extract: 'style/index.css',
    //   minimize: true
    // }),
    resolve(),
    commonjs(),
    del({ targets: ['dist'] }),
    alias({
      entries: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
    }),
    typescript({
      tsconfig: path.resolve(__dirname, 'tsconfig.json'),
      declaration: true,
      declarationDir: path.resolve(__dirname, 'dist/types'),
    }),
    // 代码压缩
    terser({
      compress: {
        drop_console: false, // 保留 console，可根据需要设置为 true 移除
        drop_debugger: true, // 移除 debugger
      },
      format: {
        comments: false, // 移除注释
      },
    }),
  ],
});
