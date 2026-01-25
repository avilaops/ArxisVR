import { defineConfig } from 'vite';
import wasm from 'vite-plugin-wasm';
import path from 'node:path';

export default defineConfig({
  plugins: [wasm()],

  // Definir entrada explicitamente
  build: {
    rollupOptions: {
      input: './index.html'
    }
  },

  // Base path - tentar resolver problemas de caminho
  base: '/',

  // Configurações de servidor
  server: {
    port: 3001,
    strictPort: false,
    host: true,
    fs: {
      // Permitir acesso a arquivos fora do root
      allow: ['../../'],
      // Strict mode off para permitir caracteres especiais
      strict: false
    },
    // Headers para CORS
    cors: true
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
});
