import autoprefixer from 'autoprefixer'
import postcssImport from 'postcss-import'
import tailwind from 'tailwindcss'
import { defineConfig } from 'vite'

export default defineConfig({
  css: {
    postcss: {
      plugins: [
        postcssImport(),
        tailwind(),
        autoprefixer(),
      ]
    }
  }
})