import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173
  },
  base: '/stationery-donation/',
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-hook-form'],
          ui: ['framer-motion', 'lucide-react', '@heroicons/react'],
          utils: ['lodash', 'crypto-js', 'dompurify']
        }
      }
    }
  }
})