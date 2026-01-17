import { defineConfig } from 'vite';
import wasm from 'vite-plugin-wasm';

export default defineConfig({
  plugins: [wasm()],

  // Otimizações para produção
  build: {
    target: 'esnext',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false, // Manter console para debug em produção
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'three': ['three'],
          'web-ifc': ['web-ifc-three'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    assetsInlineLimit: 4096,
  },

  // Configurações de servidor
  server: {
    port: 3000,
    strictPort: false,
    host: true,
  },

  // Configurações de preview (para testar build)
  preview: {
    port: 4173,
    host: true,
  },

  // Otimizações de dependências
  optimizeDeps: {
    exclude: ['web-ifc-three'],
    include: ['three'],
  },

  // Base path (importante para Azure)
  base: './',
});
