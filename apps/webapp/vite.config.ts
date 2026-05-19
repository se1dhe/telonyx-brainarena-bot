import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  preview: {
    host: '0.0.0.0',
    allowedHosts: [
      'brainarena-web-production.up.railway.app',
      'brainarena-webapp-production.up.railway.app'
    ]
  }
})
