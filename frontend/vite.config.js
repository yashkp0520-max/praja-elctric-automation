import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://praja-elctric-automation-backend.onrender.com',
        changeOrigin: true,
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 1000 // Size in KB
  }
})
