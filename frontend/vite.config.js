import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// base './' permite publicar el sitio en cualquier ruta (GitHub Pages, Vercel, etc.)
export default defineConfig({
  plugins: [vue()],
  base: './'
})
