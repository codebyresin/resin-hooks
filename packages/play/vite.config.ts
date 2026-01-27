import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@resin-hooks/core': path.resolve(__dirname, '../hooks/src'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: '../docs/public/play',
    emptyOutDir: true,
  },
});
