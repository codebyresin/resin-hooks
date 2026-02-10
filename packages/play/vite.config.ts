import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(() => {
  return {
    plugins: [react()],
    server: {
      port: 3000,
      open: true,
      proxy: {
        '/api': { target: 'http://localhost:8080', changeOrigin: true },
      },
    },
    resolve: {
      alias: {
        '@/src': path.join(__dirname, 'src'),
      },
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      rollupOptions: {
        output: {
          chunkFileNames: `chunks/[name].js`,
          inlineDynamicImports: true,
        },
      },
    },
  };
});
