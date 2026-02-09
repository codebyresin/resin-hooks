import { defineConfig } from 'rollup';
import path from 'node:path';
import alias from '@rollup/plugin-alias';
import typescript from '@rollup/plugin-typescript';
import del from 'rollup-plugin-delete';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';

const __dirname = path.resolve();

// 修复：避免使用 import.meta.url, 保证兼容较低的 module 选项

export default defineConfig({
  input: 'src/index.ts',
  output: [
    { file: 'dist/index.cjs', format: 'cjs' },
    { file: 'dist/index.js', format: 'esm' },
  ],
  external: ['react', 'react-dom'],
  plugins: [
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
    terser({
      compress: { drop_console: false, drop_debugger: true },
      format: { comments: false },
    }),
  ],
});
