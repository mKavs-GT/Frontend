import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/works-build/',
  build: {
    outDir: '../works-build',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.dev.html')
      }
    }
  },
  server: {
    proxy: {
      '/Portfolio': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
      }
    }
  }
})
