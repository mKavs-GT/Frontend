import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'serve-neoncode',
      configureServer(server) {
        server.middlewares.use('/neoncode', (req, res, next) => {
          // Decode URL to handle spaces properly (like %20 in 'kairon live bot')
          const decodedUrl = decodeURIComponent(req.url.split('?')[0]);
          const filePath = path.join(__dirname, '../neoncode', decodedUrl);
          
          if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            const ext = path.extname(filePath);
            let contentType = 'text/plain';
            if (ext === '.html') contentType = 'text/html';
            else if (ext === '.css') contentType = 'text/css';
            else if (ext === '.js') contentType = 'application/javascript';
            else if (ext === '.png') contentType = 'image/png';
            else if (ext === '.svg') contentType = 'image/svg+xml';
            
            res.setHeader('Content-Type', contentType);
            fs.createReadStream(filePath).pipe(res);
          } else {
            next();
          }
        });
      }
    },
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: null,
      includeAssets: ['favicon.svg', 'logo.png', 'icon-192.png', 'icon-512.png'],
      manifest: {
        name: 'MKAVS Admin Dashboard',
        short_name: 'MKAVS Admin',
        description: 'Executive Management Dashboard for MKAVS',
        theme_color: '#09090b',
        background_color: '#09090b',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        id: '/',
        icons: [
          {
            src: 'icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      devOptions: {
        enabled: true
      }
    })
  ],
  build: {
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // React core — tiny, always needed, cache-forever
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/') || id.includes('node_modules/react-is/')) {
            return 'vendor-react';
          }
          // Framer Motion — large animation library
          if (id.includes('node_modules/framer-motion/')) {
            return 'vendor-framer';
          }
          // Recharts + its d3 deps
          if (id.includes('node_modules/recharts/') || id.includes('node_modules/d3-') || id.includes('node_modules/victory-') || id.includes('node_modules/internmap/') || id.includes('node_modules/robust-predicates/')) {
            return 'vendor-recharts';
          }
          // Lucide icons
          if (id.includes('node_modules/lucide-react/')) {
            return 'vendor-lucide';
          }
          // Everything else in node_modules goes into a general vendor chunk
          if (id.includes('node_modules/')) {
            return 'vendor-misc';
          }
        }
      }
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
