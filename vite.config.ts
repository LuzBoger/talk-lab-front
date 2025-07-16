import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import Pages from 'vite-plugin-pages'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss(), Pages({dirs: ['src/pages']})],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  }
})
