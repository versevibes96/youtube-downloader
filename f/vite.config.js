// frontend/vite.config.js में ये जोड़ें
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/', 
  plugins: [react()],
})
