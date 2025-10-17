import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => ({
  server: {
    host: '0.0.0.0',
    port: 8080,
    hmr: { overlay: false },
    open: false,
  },
  preview: {
    host: '0.0.0.0',
    port: 8080,
    open: false,
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['lucide-react', '@radix-ui/react-slot'],
        },
      },
    },
    chunkSizeWarningLimit: 1000, // Increase default warning threshold
    minify: mode === 'production' ? 'terser' : false,
    terserOptions:
      mode === 'production'
        ? {
            compress: {
              drop_console: true,
              drop_debugger: true,
              pure_funcs: ['console.log'],
            },
          }
        : undefined,
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
    force: mode === 'development',
  },
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' },
  },
}));
