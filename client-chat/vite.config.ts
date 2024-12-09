import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    eslint({
      include: ['src/**/*.ts', 'src/**/*.tsx'],
      exclude: ['node_modules/**'],
    }),
    svgr(),
  ],
  server: {
    host: true,
    port: 5173,
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react')) return 'react-vendor';
            if (id.includes('firebase')) return 'firebase-vendor';
          }
        },
      },
    },
  },
  esbuild: {
    jsxFactory: 'React.createElement',
    jsxFragment: 'React.Fragment',
  },
});
