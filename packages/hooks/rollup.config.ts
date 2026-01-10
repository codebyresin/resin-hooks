import { defineConfig } from 'rollup';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import alias from '@rollup/plugin-alias';
import typescript from '@rollup/plugin-typescript';
import del from 'rollup-plugin-delete';
import resolve from '@rollup/plugin-node-resolve'; // 修正拼写
import commonjs from '@rollup/plugin-commonjs';
import postcss from 'rollup-plugin-postcss';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
      entries: [{ find: '@', replacement: path.resolve(__dirname, './src') }],
    }),
    typescript({
      tsconfig: path.resolve(__dirname, './tsconfig.json'),
      declaration: true,
      declarationDir: path.resolve(__dirname, './dist/types'),
    }),
  ],
});
